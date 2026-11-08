import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "ocr-api-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await rm(testDataDir, { recursive: true, force: true });
});

async function upload(buffer, name, type = "application/octet-stream") {
  const formData = new FormData();
  formData.append("files", new Blob([buffer], { type }), name);
  return fetch(`${baseUrl}/api/ocr-image-to-text`, { method: "POST", body: formData });
}

async function assertToolsAvailable() {
  const response = await fetch(`${baseUrl}/api/tools`);
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(await response.json()));
}

async function createTextImage() {
  const svg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300"><rect width="100%" height="100%" fill="white"/><text x="40" y="200" font-family="DejaVu Sans" font-size="145" font-weight="bold" fill="black">HELLO OCR</text></svg>',
  );
  return sharp(svg).png().toBuffer();
}

test("rejects empty and renamed text uploads without affecting the tools API", async () => {
  const emptyResponse = await upload(Buffer.alloc(0), "empty.png", "image/png");
  assert.equal(emptyResponse.status, 400);
  assert.match((await emptyResponse.json()).error, /non-empty/i);
  await assertToolsAvailable();

  const textResponse = await upload(Buffer.from("not an image"), "renamed.png", "image/png");
  assert.equal(textResponse.status, 400);
  assert.match((await textResponse.json()).error, /unsupported file/i);
  await assertToolsAvailable();
});

test("rejects images over the pixel limit and keeps the tools API available", async () => {
  const hugeImage = await sharp({
    create: {
      width: 5001,
      height: 5000,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();
  const response = await upload(hugeImage, "huge.png", "image/png");
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /25-megapixel/i);
  await assertToolsAvailable();
});

test("extracts text from a PNG and keeps the tools API available", async () => {
  const response = await upload(await createTextImage(), "text.png", "image/png");
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.match(result.text.toUpperCase(), /HELLO OCR/);
  assert.equal(result.pages, 1);
  await assertToolsAvailable();
});

test("rasterizes scanned PDF pages for OCR in an isolated child process", async () => {
  const image = await createTextImage();
  const pdf = await PDFDocument.create();
  const embeddedImage = await pdf.embedPng(image);
  const page = pdf.addPage([612, 180]);
  page.drawImage(embeddedImage, { x: 8, y: 8, width: 596, height: 149 });
  const pdfBuffer = Buffer.from(await pdf.save());
  assert.ok(pdfBuffer.length < 20 * 1024);

  const response = await upload(pdfBuffer, "scanned.pdf", "application/pdf");
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.match(result.text.toUpperCase(), /HELLO OCR/);
  assert.equal(result.pages, 1);
  await assertToolsAvailable();
});
