import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { convertPdfToJpg } from "../src/routes/office.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const samplePdfPath = path.join(__dirname, "fixtures", "sample.pdf");

test("convertPdfToJpg produces a jpeg output from a PDF", async () => {
  const pdfBuffer = await readFile(samplePdfPath);
  const result = await convertPdfToJpg({
    buffer: pdfBuffer,
    originalname: "sample.pdf",
  } as any);

  assert.equal(result.mimeType, "image/jpeg");
  assert.equal(result.filename.endsWith(".jpg"), true);
  assert.ok(result.buffer.length > 0);
});
