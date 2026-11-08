import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "pdf-operations-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;
let normalPdf;
let encryptedPdf;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let pageNumber = 1; pageNumber <= 3; pageNumber += 1) {
    const page = pdf.addPage([612, 792]);
    page.drawText(`Preserved page ${pageNumber}`, { x: 50, y: 700, size: 24, font });
  }
  normalPdf = Buffer.from(await pdf.save());

  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  encryptedPdf = Buffer.from(await protectedResponse.arrayBuffer());
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await rm(testDataDir, { recursive: true, force: true });
});

async function postPdf(route, buffer, filename = "sample.pdf", fields = {}) {
  const formData = new FormData();
  formData.append("files", new Blob([buffer], { type: "application/pdf" }), filename);
  for (const [name, value] of Object.entries(fields)) formData.append(name, value);
  return fetch(`${baseUrl}${route}`, { method: "POST", body: formData });
}

async function assertTextPages(buffer, expectedPageCount) {
  const pdf = await PDFDocument.load(buffer);
  assert.equal(pdf.getPageCount(), expectedPageCount);

  const parsed = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
  }).promise;
  assert.equal(parsed.numPages, expectedPageCount);
  for (let pageNumber = 1; pageNumber <= expectedPageCount; pageNumber += 1) {
    const page = await parsed.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    assert.match(text, new RegExp(`Preserved page ${pageNumber}`));
  }
}

test("unlock accepts secret123 and preserves all three pages and text", async () => {
  const response = await postPdf("/api/unlock-pdf", encryptedPdf, "secret123.pdf", { password: "secret123" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/pdf/);
  await assertTextPages(Buffer.from(await response.arrayBuffer()), 3);
});

test("unlock rejects an incorrect password without returning a download", async () => {
  const response = await postPdf("/api/unlock-pdf", encryptedPdf, "secret123.pdf", { password: "wrongpass" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Incorrect password." });
  assert.match(response.headers.get("content-type") || "", /application\/json/);
  assert.equal(response.headers.get("content-disposition"), null);
});

test("unlock returns an unencrypted PDF unchanged", async () => {
  const response = await postPdf("/api/unlock-pdf", normalPdf);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-pdf-password-status"), "not-protected");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), normalPdf);
});

test("protect creates a password-protected PDF with unchanged pages", async () => {
  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "normal.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  const protectedBuffer = Buffer.from(await protectedResponse.arrayBuffer());
  const encrypted = await PDFDocument.load(protectedBuffer, { ignoreEncryption: true });
  assert.equal(encrypted.isEncrypted, true);
  assert.equal(encrypted.getPageCount(), 3);

  const unlocked = await postPdf("/api/unlock-pdf", protectedBuffer, "protected.pdf", { password: "secret123" });
  assert.equal(unlocked.status, 200);
  await assertTextPages(Buffer.from(await unlocked.arrayBuffer()), 3);
});

test("protect rejects already-encrypted PDFs", async () => {
  const response = await postPdf("/api/protect-pdf", encryptedPdf, "protected.pdf", { password: "new-password" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "This PDF is already password-protected. Unlock it first.",
  });
  assert.equal(response.headers.get("content-disposition"), null);
});

test("compress and watermark preserve page count", async () => {
  const compressed = await postPdf("/api/compress-pdf", normalPdf, "normal.pdf");
  assert.equal(compressed.status, 200);
  await assertTextPages(Buffer.from(await compressed.arrayBuffer()), 3);

  const watermarked = await postPdf("/api/watermark-pdf", normalPdf, "normal.pdf", { text: "CONFIDENTIAL" });
  assert.equal(watermarked.status, 200);
  const watermarkPdf = await PDFDocument.load(await watermarked.arrayBuffer());
  assert.equal(watermarkPdf.getPageCount(), 3);
});

test("corrupt PDFs return JSON errors rather than blank PDF downloads", async () => {
  const corruptPdf = Buffer.from("%PDF-1.7\nnot a valid PDF\n%%EOF");

  for (const [route, fields] of [
    ["/api/unlock-pdf", { password: "secret123" }],
    ["/api/protect-pdf", { password: "secret123" }],
    ["/api/compress-pdf", {}],
    ["/api/watermark-pdf", { text: "CONFIDENTIAL" }],
  ]) {
    const response = await postPdf(route, corruptPdf, "corrupt.pdf", fields);
    assert.ok(response.status >= 400, `${route} should reject corrupt PDFs`);
    assert.match(response.headers.get("content-type") || "", /application\/json/);
    assert.equal(response.headers.get("content-disposition"), null);
    const body = await response.json();
    assert.equal(typeof body.error, "string");
    assert.ok(body.error.length > 0);
  }
});
