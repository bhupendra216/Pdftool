import { PDFDocument, PDFName, PDFString, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import { expect, it } from "vitest";
import {
  createMarkdownDownload,
  extractMarkdownFromPdf,
  markdownForDisplay,
  markdownPdfErrorMessage,
  sanitizeMarkdownBaseName,
  withPageMarkers,
} from "./pdfToMarkdown";
import { MAX_MARKDOWN_PDF_PAGES, MAX_PDF_BYTES } from "./pdfToMarkdownConfig";

async function makeFile(document: PDFDocument, name = "fixture.pdf") {
  const bytes = await document.save();
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return new File([buffer], name, { type: "application/pdf" });
}

async function createTextPdf(pages = 1) {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < pages; index += 1) {
    const page = document.addPage([400, 400]);
    page.drawText(`BODY TEXT ${index + 1}`, { x: 40, y: 200, size: 12, font });
  }
  return document;
}

it("detects relative font-size headings, joins wrapped paragraphs and hyphenation", async () => {
  const document = await createTextPdf();
  const page = document.getPages()[0]!;
  const font = await document.embedFont(StandardFonts.Helvetica);
  page.drawText("Large Title", { x: 40, y: 350, size: 30, font });
  page.drawText("The first part of a para-", { x: 40, y: 300, size: 12, font });
  page.drawText("graph continues on the next line.", { x: 40, y: 285, size: 12, font });
  const result = await extractMarkdownFromPdf(await makeFile(document));
  const markdown = result.pages.join("\n");

  expect(markdown).toContain("# Large Title");
  expect(markdown).toContain("paragraph continues on the next line.");
  expect(markdown).not.toContain("para- graph");
});

it("removes repeated margin lines and standalone page numbers from four-page PDFs", async () => {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let index = 1; index <= 4; index += 1) {
    const page = document.addPage([400, 400]);
    page.drawText("REPEATED HEADER 2026", { x: 40, y: 390, size: 10, font });
    page.drawText("REPEATED FOOTER 2026", { x: 40, y: 25, size: 10, font });
    page.drawText(`Page ${index}`, { x: 40, y: 8, size: 10, font });
    page.drawText("Main paragraph content.", { x: 40, y: 200, size: 12, font });
  }
  const result = await extractMarkdownFromPdf(await makeFile(document));
  const markdown = result.pages.join("\n");

  expect(markdown).not.toContain("REPEATED HEADER");
  expect(markdown).not.toContain("REPEATED FOOTER");
  expect(markdown).not.toMatch(/Page [1-4]/);
  expect(markdown).toContain("Main paragraph content.");
  expect(withPageMarkers(result.pages, true)).toContain("<!-- Page 2 -->");
  expect(withPageMarkers(result.pages, false)).not.toContain("<!-- Page");
});

it("returns no text for an empty PDF and enforces the page limit", async () => {
  let textStatus: boolean | undefined;
  const empty = await extractMarkdownFromPdf(await makeFile(await PDFDocument.create()), {
    onTextStatus: (textFound) => { textStatus = textFound; },
  });
  expect(empty.textFound).toBe(false);
  expect(empty.images).toHaveLength(0);
  expect(empty.skippedImageCount).toBe(0);
  expect(textStatus).toBe(false);

  const tooManyPages = await createTextPdf(MAX_MARKDOWN_PDF_PAGES + 1);
  await expect(extractMarkdownFromPdf(await makeFile(tooManyPages))).rejects.toThrow(
    `This PDF has ${MAX_MARKDOWN_PDF_PAGES + 1} pages. The limit is ${MAX_MARKDOWN_PDF_PAGES} pages.`,
  );
});

it("rejects a file larger than the configured size before parsing it", async () => {
  const oversized = new File([new Uint8Array(MAX_PDF_BYTES + 1)], "large.pdf", { type: "application/pdf" });
  await expect(extractMarkdownFromPdf(oversized)).rejects.toThrow("50 MB limit");
});

it("extracts a positioned PNG without substituting a page screenshot", async () => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 32;
  sourceCanvas.height = 24;
  const context = sourceCanvas.getContext("2d")!;
  context.fillStyle = "#2563eb";
  context.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
  const png = await new Promise<Blob>((resolve) => sourceCanvas.toBlob((blob) => resolve(blob!), "image/png"));
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  const image = await pdf.embedPng(await png.arrayBuffer());
  page.drawImage(image, { x: 120, y: 180, width: 32, height: 24 });
  page.drawText("Image context", { x: 40, y: 300, size: 12, font: await pdf.embedFont(StandardFonts.Helvetica) });
  const result = await extractMarkdownFromPdf(await makeFile(pdf, "Chart.pdf"));

  expect(result.images).toHaveLength(1);
  expect(result.skippedImageCount).toBe(0);
  expect(result.images[0]!.fileName).toBe("Chart-p1-1.png");
  expect(result.pages[0]).toContain("![Image from page 1](images/Chart-p1-1.png)");
  const extracted = await createImageBitmap(result.images[0]!.blob);
  expect(extracted.width).toBeLessThan(400);
  expect(extracted.height).toBeLessThan(400);
  extracted.close();
});

it("extracts an embedded JPEG at its own dimensions", async () => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 40;
  sourceCanvas.height = 28;
  const context = sourceCanvas.getContext("2d")!;
  context.fillStyle = "#dc2626";
  context.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
  const jpeg = await new Promise<Blob>((resolve) => sourceCanvas.toBlob((blob) => resolve(blob!), "image/jpeg"));
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  const image = await pdf.embedJpg(await jpeg.arrayBuffer());
  page.drawImage(image, { x: 80, y: 80, width: 40, height: 28 });
  page.drawText("JPEG context", { x: 40, y: 300, size: 12, font: await pdf.embedFont(StandardFonts.Helvetica) });
  const result = await extractMarkdownFromPdf(await makeFile(pdf));

  expect(result.images).toHaveLength(1);
  expect(result.skippedImageCount).toBe(0);
  const extracted = await createImageBitmap(result.images[0]!.blob);
  expect(extracted.width).toBe(40);
  expect(extracted.height).toBe(28);
  extracted.close();
});

it("preserves transparency from an embedded PNG soft mask", async () => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 32;
  sourceCanvas.height = 24;
  const context = sourceCanvas.getContext("2d")!;
  context.fillStyle = "#2563eb";
  context.fillRect(0, 0, 16, 24);
  const png = await new Promise<Blob>((resolve) => sourceCanvas.toBlob((blob) => resolve(blob!), "image/png"));
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  const image = await pdf.embedPng(await png.arrayBuffer());
  page.drawImage(image, { x: 80, y: 80, width: 32, height: 24 });
  const result = await extractMarkdownFromPdf(await makeFile(pdf));

  expect(result.images).toHaveLength(1);
  const extracted = await createImageBitmap(result.images[0]!.blob);
  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = extracted.width;
  targetCanvas.height = extracted.height;
  const targetContext = targetCanvas.getContext("2d")!;
  targetContext.drawImage(extracted, 0, 0);
  expect(targetContext.getImageData(24, 12, 1, 1).data[3]).toBe(0);
  extracted.close();
  targetCanvas.width = 0;
  targetCanvas.height = 0;
});

it("converts text overlapped by a URI link annotation to a Markdown link", async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText("Visit the documentation", { x: 40, y: 200, size: 12, font });
  const annotation = pdf.context.obj({
    Type: PDFName.of("Annot"),
    Subtype: PDFName.of("Link"),
    Rect: [40, 198, 190, 216],
    Border: [0, 0, 0],
    A: {
      Type: PDFName.of("Action"),
      S: PDFName.of("URI"),
      URI: PDFString.of("https://example.com/docs"),
    },
  });
  page.node.addAnnot(pdf.context.register(annotation));

  const result = await extractMarkdownFromPdf(await makeFile(pdf));
  expect(result.pages.join("\n")).toContain("[Visit the documentation](https://example.com/docs)");
});

it("reuses a full-page embedded scan without creating rendered page screenshots", async () => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 32;
  sourceCanvas.height = 24;
  const context = sourceCanvas.getContext("2d")!;
  context.fillStyle = "#16a34a";
  context.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
  const png = await new Promise<Blob>((resolve) => sourceCanvas.toBlob((blob) => resolve(blob!), "image/png"));
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;

  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(await png.arrayBuffer());
  for (let index = 0; index < 2; index += 1) {
    pdf.addPage([400, 400]).drawImage(image, { x: 0, y: 0, width: 400, height: 400 });
  }
  const result = await extractMarkdownFromPdf(await makeFile(pdf));

  expect(result.textFound).toBe(false);
  expect(result.images).toHaveLength(1);
  expect(result.skippedImageCount).toBe(0);
  expect(result.pages[0]).toContain(result.images[0]!.fileName);
  expect(result.pages[1]).toContain(result.images[0]!.fileName);
  const extracted = await createImageBitmap(result.images[0]!.blob);
  expect(extracted.width).toBe(32);
  expect(extracted.height).toBe(24);
  extracted.close();
});

it("counts embedded images skipped because they are too small to extract", async () => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 7;
  sourceCanvas.height = 7;
  const png = await new Promise<Blob>((resolve) => sourceCanvas.toBlob((blob) => resolve(blob!), "image/png"));
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([400, 400]);
  const image = await pdf.embedPng(await png.arrayBuffer());
  page.drawImage(image, { x: 120, y: 180, width: 7, height: 7 });
  const result = await extractMarkdownFromPdf(await makeFile(pdf));

  expect(result.images).toHaveLength(0);
  expect(result.skippedImageCount).toBe(1);
});

it("packages the source basename and image references in the ZIP and filters preview references", async () => {
  const image = new Blob(["test-png"]);
  const pages = ["Body text.\n\n![Image from page 1](images/Quarterly Report-p1-1.png)"];
  const result = await createMarkdownDownload(
    pages,
    [{ fileName: "Quarterly Report-p1-1.png", blob: image }],
    "Quarterly Report",
  );
  expect(result.fileName).toBe("Quarterly Report.zip");
  const zip = await JSZip.loadAsync(result.blob);
  expect(zip.file("Quarterly Report.md")).not.toBeNull();
  expect(zip.file("images/Quarterly Report-p1-1.png")).not.toBeNull();
  expect(await zip.file("Quarterly Report.md")!.async("string")).toContain("![Image from page 1]");
  expect(markdownForDisplay(pages[0]!, false)).toBe("Body text.");
  expect(markdownForDisplay(pages[0]!, true)).toBe(pages[0]);
  expect(withPageMarkers(["One page"], true)).toBe("<!-- Page 1 -->\n\nOne page");
});

it("sanitizes only filename-illegal characters and maps PDF errors", () => {
  expect(sanitizeMarkdownBaseName("Quarterly Report.pdf")).toBe("Quarterly Report");
  expect(sanitizeMarkdownBaseName("Résumé: Q4?.pdf")).toBe("Résumé Q4");
  expect(markdownPdfErrorMessage({ name: "PasswordException" })).toContain("Unlock PDF tool");
  expect(markdownPdfErrorMessage({ name: "InvalidPDFException" })).toBe(
    "This file is damaged or is not a valid PDF.",
  );
  expect(markdownPdfErrorMessage({ name: "OtherError" })).toBeNull();
  expect(MAX_PDF_BYTES).toBe(50 * 1024 * 1024);
});
