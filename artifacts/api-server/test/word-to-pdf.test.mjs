import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Document, Paragraph, Packer, Table, TableCell, TableRow, WidthType } from "docx";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "word-to-pdf-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const hasSoffice = spawnSync("soffice", ["--version"], { stdio: "ignore" }).status === 0;
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;
let docxBuffer;
let pdfBuffer;

before(async () => {
  const document = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "Quarterly Results", heading: "Heading1" }),
        new Paragraph("Department revenue report for the current quarter."),
        new Table({
          columnWidths: [4500, 4500],
          width: { size: 9000, type: WidthType.DXA },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("Department")],
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("Revenue")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("Engineering")],
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("$125,000")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("Research")],
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph("$98,000")],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });
  docxBuffer = await Packer.toBuffer(document);

  const pdfDocument = await PDFDocument.create();
  pdfDocument.addPage().drawText("PDF content, not a Word document.");
  pdfBuffer = Buffer.from(await pdfDocument.save());

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

async function postWord(buffer, filename) {
  const formData = new FormData();
  formData.append(
    "files",
    new Blob([buffer], {
      type: filename.endsWith(".docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/octet-stream",
    }),
    filename,
  );
  return fetch(`${baseUrl}/api/convert-word-to-pdf`, { method: "POST", body: formData });
}

async function extractPdfText(buffer) {
  const pdf = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
  }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return { pageCount: pdf.numPages, text: pages.join("\n") };
}

test("rejects renamed PDFs, empty uploads, and text files as invalid Word documents", async () => {
  if (hasSoffice) {
    const renamedPdfResponse = await postWord(pdfBuffer, "renamed.pdf.docx");
    assert.equal(renamedPdfResponse.status, 400);
    assert.deepEqual(await renamedPdfResponse.json(), { error: "This is not a valid Word document." });
  }

  const emptyResponse = await postWord(Buffer.alloc(0), "empty.docx");
  assert.equal(emptyResponse.status, 400);
  assert.deepEqual(await emptyResponse.json(), { error: "This is not a valid Word document." });

  const textResponse = await postWord(Buffer.from("not a Word document"), "notes.txt");
  assert.equal(textResponse.status, 400);
  assert.deepEqual(await textResponse.json(), { error: "This is not a valid Word document." });
});

test("converts DOCX heading, paragraphs, and table content to a readable PDF", { skip: !hasSoffice }, async () => {
  const response = await postWord(docxBuffer, "report.docx");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/pdf/);

  const result = await extractPdfText(Buffer.from(await response.arrayBuffer()));
  assert.ok(result.pageCount >= 1);
  assert.match(result.text, /Quarterly Results/);
  assert.match(result.text, /Department/);
  assert.match(result.text, /Engineering/);
  assert.match(result.text, /\$125,000/);
  assert.match(result.text, /Research/);
  assert.match(result.text, /\$98,000/);
});

test("converts five simultaneous documents using isolated LibreOffice profiles", { skip: !hasSoffice }, async () => {
  const responses = await Promise.all(
    Array.from({ length: 5 }, (_, index) =>
      postWord(docxBuffer, `report-${index + 1}.docx`),
    ),
  );

  for (const response of responses) {
    assert.equal(response.status, 200);
    const result = await extractPdfText(Buffer.from(await response.arrayBuffer()));
    assert.ok(result.pageCount >= 1);
    assert.match(result.text, /Engineering/);
    assert.match(result.text, /\$125,000/);
  }
});
