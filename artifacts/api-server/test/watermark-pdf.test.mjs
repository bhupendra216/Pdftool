import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFDocument, degrees, StandardFonts } from "pdf-lib";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "watermark-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;
let inputPdf;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const portrait = pdf.addPage([595, 842]);
  portrait.drawText("Watermark bounds test", { x: 50, y: 700, size: 14, font });
  const landscape = pdf.addPage([842, 595]);
  landscape.drawText("Watermark bounds test", { x: 50, y: 450, size: 14, font });
  const rotated = pdf.addPage([595, 842]);
  rotated.setCropBox(30, 40, 520, 760);
  rotated.setRotation(degrees(90));
  rotated.drawText("Watermark bounds test", { x: 60, y: 700, size: 14, font });
  inputPdf = Buffer.from(await pdf.save());
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await rm(testDataDir, { recursive: true, force: true });
});

async function postWatermark(buffer, fields = {}) {
  const formData = new FormData();
  formData.append("files", new Blob([buffer], { type: "application/pdf" }), "source.pdf");
  for (const [name, value] of Object.entries(fields)) formData.append(name, String(value));
  return fetch(`${baseUrl}/api/watermark-pdf`, { method: "POST", body: formData });
}

async function assertTextFitsPage(buffer, expectedText) {
  const parsed = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
  }).promise;
  for (let pageNumber = 1; pageNumber <= parsed.numPages; pageNumber += 1) {
    const page = await parsed.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const item = content.items.find((candidate) => "str" in candidate && candidate.str.includes(expectedText));
    assert.ok(item, `Expected watermark on page ${pageNumber}`);
    const transform = pdfjs.Util.transform(viewport.transform, item.transform);
    const points = [
      [0, 0],
      [item.width, 0],
      [0, item.height],
      [item.width, item.height],
    ].map(([x, y]) => ({
      x: transform[0] * x + transform[2] * y + transform[4],
      y: transform[1] * x + transform[3] * y + transform[5],
    }));
    const bounds = {
      left: Math.min(...points.map((point) => point.x)),
      right: Math.max(...points.map((point) => point.x)),
      top: Math.min(...points.map((point) => point.y)),
      bottom: Math.max(...points.map((point) => point.y)),
    };
    assert.ok(bounds.left >= -1, `left edge ${bounds.left} is outside page ${pageNumber}`);
    assert.ok(bounds.top >= -1, `top edge ${bounds.top} is outside page ${pageNumber}`);
    assert.ok(bounds.right <= viewport.width + 1, `right edge ${bounds.right} exceeds page ${pageNumber}`);
    assert.ok(bounds.bottom <= viewport.height + 1, `bottom edge ${bounds.bottom} exceeds page ${pageNumber}`);
  }
  await parsed.destroy();
}

test("text watermark stays on-page for all nine positions and 0, 45, and 90 degree rotations", async () => {
  const positions = [
    "top-left", "top-center", "top-right",
    "center-left", "center", "center-right",
    "bottom-left", "bottom-center", "bottom-right",
  ];
  for (const rotation of [0, 45, 90]) {
    for (const position of positions) {
      const response = await postWatermark(inputPdf, {
        text: "QA-WATERMARK",
        position,
        rotation,
      });
      assert.equal(response.status, 200, `${position}, ${rotation}°`);
      await assertTextFitsPage(Buffer.from(await response.arrayBuffer()), "QA-WATERMARK");
    }
  }
});

test("long watermark text is scaled to stay inside the page", async () => {
  const response = await postWatermark(inputPdf, {
    text: "A".repeat(100),
    position: "bottom-right",
    rotation: 90,
    fontSize: 500,
  });
  assert.equal(response.status, 200);
  await assertTextFitsPage(Buffer.from(await response.arrayBuffer()), "AAAA");
});

test("Devanagari text is shaped visually and embeds Noto Sans Devanagari", async () => {
  const response = await postWatermark(inputPdf, { text: "गो प्य", position: "center" });
  assert.equal(response.status, 200);
  const output = Buffer.from(await response.arrayBuffer());
  assert.ok(output.includes(Buffer.from("NotoSansDevanagari")));

  const parsed = await pdfjs.getDocument({ data: new Uint8Array(output), useWorkerFetch: false }).promise;
  const page = await parsed.getPage(1);
  const content = await page.getTextContent();
  assert.ok(content.items.some((item) => "str" in item && item.str.includes("गो प्य")));
  const pageOperatorList = await page.getOperatorList();
  assert.ok(
    pageOperatorList.fnArray.filter((operator) => operator === pdfjs.OPS.constructPath).length > 0,
    "expected visible vector glyph paths for shaped Devanagari",
  );
  await parsed.destroy();
});

test("empty watermark text is rejected and PNG logo watermarking still works", async () => {
  const empty = await postWatermark(inputPdf, { text: "  " });
  assert.equal(empty.status, 400);
  assert.deepEqual(await empty.json(), { error: "Enter the watermark text." });

  const formData = new FormData();
  formData.append("files", new Blob([inputPdf], { type: "application/pdf" }), "source.pdf");
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/r9sAAAAASUVORK5CYII=", "base64");
  formData.append("logo", new Blob([png], { type: "image/png" }), "logo.png");
  const logoResponse = await fetch(`${baseUrl}/api/watermark-pdf`, { method: "POST", body: formData });
  assert.equal(logoResponse.status, 200);
  assert.match(logoResponse.headers.get("content-type") ?? "", /application\/pdf/);
});
