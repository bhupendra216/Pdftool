import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "pdf-operations-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");
const qpdfAvailable = spawnSync("qpdf", ["--version"], { encoding: "utf8" }).status === 0;
const pythonPdfReadersAvailable = spawnSync(
  "python3",
  ["-c", "import pypdf, fitz"],
  { encoding: "utf8" },
).status === 0;

let server;
let baseUrl;
let normalPdf;

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

test("unlock accepts secret123 and preserves all three pages and text", { skip: !qpdfAvailable }, async () => {
  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  const encryptedPdf = Buffer.from(await protectedResponse.arrayBuffer());
  const response = await postPdf("/api/unlock-pdf", encryptedPdf, "secret123.pdf", { password: "secret123" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/pdf/);
  await assertTextPages(Buffer.from(await response.arrayBuffer()), 3);
});

test("unlock rejects an incorrect password without returning a download", { skip: !qpdfAvailable }, async () => {
  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  const encryptedPdf = Buffer.from(await protectedResponse.arrayBuffer());
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

test("protect creates a password-protected PDF with unchanged pages", { skip: !qpdfAvailable }, async () => {
  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "normal.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  const protectedBuffer = Buffer.from(await protectedResponse.arrayBuffer());
  const protectedPath = path.join(testDataDir, "protected.pdf");
  const passwordPath = path.join(testDataDir, "protected-password.txt");
  await writeFile(protectedPath, protectedBuffer);
  await writeFile(passwordPath, Buffer.from("secret123"), { mode: 0o600 });
  assert.equal(spawnSync("qpdf", ["--is-encrypted", protectedPath], { encoding: "utf8" }).status, 0);
  const pageCount = spawnSync(
    "qpdf",
    [`--password-file=${passwordPath}`, "--show-npages", protectedPath],
    { encoding: "utf8" },
  );
  assert.equal(pageCount.status, 0, pageCount.stderr);
  assert.equal(Number(pageCount.stdout.trim()), 3);

  const unlocked = await postPdf("/api/unlock-pdf", protectedBuffer, "protected.pdf", { password: "secret123" });
  assert.equal(unlocked.status, 200);
  await assertTextPages(Buffer.from(await unlocked.arrayBuffer()), 3);
});

test("protect rejects already-encrypted PDFs", { skip: !qpdfAvailable }, async () => {
  const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password: "secret123" });
  assert.equal(protectedResponse.status, 200);
  const encryptedPdf = Buffer.from(await protectedResponse.arrayBuffer());
  const response = await postPdf("/api/protect-pdf", encryptedPdf, "protected.pdf", { password: "new-password" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "This PDF is already password-protected. Unlock it first.",
  });
  assert.equal(response.headers.get("content-disposition"), null);
});

test("protect uses AES-256 R6 and supports normalized Unicode passwords", { skip: !qpdfAvailable }, async () => {
  for (const [password, unlockPassword, checkExternalReaders] of [
    ["Qa@12345", "Qa@12345", true],
    ["पा सवर्ड123", "पा सवर्ड123", true],
    ["cafe\u0301Pass", "caféPass", false],
  ]) {
    const protectedResponse = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password });
    assert.equal(protectedResponse.status, 200);
    const protectedBuffer = Buffer.from(await protectedResponse.arrayBuffer());
    assert.equal(protectedBuffer.includes(Buffer.from("%%Invocation")), false);
    const inputPath = path.join(testDataDir, "aes256-protected.pdf");
    const passwordPath = path.join(testDataDir, "aes256-password.txt");
    await writeFile(inputPath, protectedBuffer);
    await writeFile(passwordPath, Buffer.from(password.normalize("NFC"), "utf8"), { mode: 0o600 });

    const encryptionInfo = spawnSync(
      "qpdf",
      [`--password-file=${passwordPath}`, "--show-encryption", inputPath],
      { encoding: "utf8" },
    );
    assert.equal(encryptionInfo.status, 0, encryptionInfo.stderr);
    assert.match(encryptionInfo.stdout, /\bR\s*=\s*6\b/);
    assert.match(encryptionInfo.stdout, /AESv3/i);

    if (pythonPdfReadersAvailable && checkExternalReaders) {
      const readerCheck = spawnSync("python3", ["-c", [
        "import os, fitz",
        "from pypdf import PdfReader",
        "path = os.environ['PDF_PATH']",
        "password = os.environ['PDF_PASSWORD']",
        "reader = PdfReader(path)",
        "assert reader.decrypt(password) != 0",
        "assert len(reader.pages) == 3",
        "doc = fitz.open(path)",
        "assert doc.authenticate(password) != 0",
        "assert len(doc) == 3",
      ].join("\n")], {
        encoding: "utf8",
        env: { ...process.env, PDF_PATH: inputPath, PDF_PASSWORD: unlockPassword.normalize("NFC") },
      });
      assert.equal(readerCheck.status, 0, readerCheck.stderr);
    }

    const unlocked = await postPdf("/api/unlock-pdf", protectedBuffer, "protected.pdf", { password: unlockPassword });
    assert.equal(unlocked.status, 200);
    await assertTextPages(Buffer.from(await unlocked.arrayBuffer()), 3);
  }
});

test("protect rejects passwords under six characters and passwords over 127 UTF-8 bytes", async () => {
  for (const [password, message] of [
    ["12345", "Password must be at least 6 characters."],
    ["पा".repeat(32), "Password must be 127 UTF-8 bytes or fewer."],
  ]) {
    const response = await postPdf("/api/protect-pdf", normalPdf, "source.pdf", { password });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: message });
    assert.equal(response.headers.get("content-disposition"), null);
  }
});

test("unlock supports AES-128 and RC4 encrypted PDFs", { skip: !qpdfAvailable }, async () => {
  const inputPath = path.join(testDataDir, "legacy-source.pdf");
  await writeFile(inputPath, normalPdf);

  for (const [label, encryptionArgs] of [
    ["AES-128", ["--encrypt", "legacy-pass", "legacy-owner", "128", "--use-aes=y", "--"]],
    ["RC4", ["--allow-weak-crypto", "--encrypt", "legacy-pass", "legacy-owner", "128", "--use-aes=n", "--"]],
  ]) {
    const encryptedPath = path.join(testDataDir, `${label}.pdf`);
    const encrypted = spawnSync("qpdf", [...encryptionArgs, inputPath, encryptedPath], { encoding: "utf8" });
    assert.equal(encrypted.status, 0, encrypted.stderr);
    const encryptedBuffer = await readFile(encryptedPath);
    const unlocked = await postPdf("/api/unlock-pdf", encryptedBuffer, `${label}.pdf`, { password: "legacy-pass" });
    assert.equal(unlocked.status, 200, label);
    await assertTextPages(Buffer.from(await unlocked.arrayBuffer()), 3);
  }
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
