import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Document, Packer, Paragraph } from "docx";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "word-to-pdf-unavailable-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
process.env.SOFFICE_BINARY = path.join(testDataDir, "missing-soffice");
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;
let docxBuffer;

before(async () => {
  const document = new Document({
    sections: [{ children: [new Paragraph("Valid Word document")] }],
  });
  docxBuffer = await Packer.toBuffer(document);

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

test("reports missing LibreOffice as temporary unavailability without crashing", async () => {
  const toolsResponse = await fetch(`${baseUrl}/api/tools`);
  assert.equal(toolsResponse.status, 200);
  const tools = await toolsResponse.json();
  const wordToPdf = tools.find((tool) => tool.slug === "word-to-pdf");
  assert.equal(wordToPdf.status, "comingSoon");
  assert.match(wordToPdf.shortDescription, /temporarily unavailable/i);

  const formData = new FormData();
  formData.append(
    "files",
    new Blob([docxBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
    "valid.docx",
  );
  const conversionResponse = await fetch(`${baseUrl}/api/convert-word-to-pdf`, {
    method: "POST",
    body: formData,
  });
  assert.equal(conversionResponse.status, 503);
  assert.deepEqual(await conversionResponse.json(), {
    error: "Word to PDF is temporarily unavailable.",
  });

  const healthResponse = await fetch(`${baseUrl}/api/healthz`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), { status: "ok" });
});
