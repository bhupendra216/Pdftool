import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { parsePageList, parsePageRanges, removePdfPagesByIndex } from "@workspace/pdf-pages";
import { removePagesById, type PageState } from "./page-state";

const markerFor = (pageNumber: number) => `PAGE-${pageNumber}`;

async function createMarkedPdf(pageCount: number): Promise<PDFDocument> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = pdf.addPage([612, 792]);
    page.drawText(markerFor(pageNumber), { x: 48, y: 720, font, size: 24 });
  }

  return pdf;
}

async function readPageMarkers(pdf: PDFDocument): Promise<string[]> {
  const loadingTask = getDocument({
    data: new Uint8Array(await pdf.save()),
    disableFontFace: true,
    useSystemFonts: true,
  });
  const document = await loadingTask.promise;
  const markers: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    markers.push(content.items.map((item) => ("str" in item ? item.str : "")).join(""));
  }

  await loadingTask.destroy();
  return markers;
}

async function removeAndRead(pageCount: number, pageIndices: number[]): Promise<string[]> {
  const pdf = await createMarkedPdf(pageCount);
  removePdfPagesByIndex(pdf, pageIndices);
  return readPageMarkers(pdf);
}

describe("shared PDF page helpers", () => {
  it("deletes the first two pages without shifting later targets", async () => {
    assert.deepEqual(await removeAndRead(6, [0, 1]), ["PAGE-3", "PAGE-4", "PAGE-5", "PAGE-6"]);
  });

  it("deletes the last two pages", async () => {
    assert.deepEqual(await removeAndRead(6, [4, 5]), ["PAGE-1", "PAGE-2", "PAGE-3", "PAGE-4"]);
  });

  it("deletes middle pages and preserves the remaining order", async () => {
    assert.deepEqual(await removeAndRead(6, [2, 3]), ["PAGE-1", "PAGE-2", "PAGE-5", "PAGE-6"]);
  });

  it("deletes non-contiguous pages", async () => {
    assert.deepEqual(await removeAndRead(6, [0, 2, 4]), ["PAGE-2", "PAGE-4", "PAGE-6"]);
  });

  it("allows deleting all but one page", async () => {
    assert.deepEqual(await removeAndRead(6, [0, 1, 2, 3, 4]), ["PAGE-6"]);
  });

  it("deletes a page by its source identity after reordering", async () => {
    const pdf = await createMarkedPdf(4);
    const initialPages: PageState[] = Array.from({ length: 4 }, (_, sourcePageIndex) => ({
      id: `page-${sourcePageIndex}`,
      pageNumber: sourcePageIndex + 1,
      sourcePageIndex,
      rotation: 0,
      selected: false,
    }));
    const reorderedPages = [initialPages[2], initialPages[0], initialPages[3], initialPages[1]].map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }));
    const remainingPages = removePagesById(reorderedPages, ["page-2"]).pages;
    const sourcePageNumbers = remainingPages.map((page) => page.sourcePageIndex + 1);
    const output = await PDFDocument.create();
    const selectedPages = await output.copyPages(pdf, parsePageList(sourcePageNumbers, 4, "pageOrder", { required: true }));
    selectedPages.forEach((page) => output.addPage(page));

    assert.deepEqual(await readPageMarkers(output), ["PAGE-1", "PAGE-4", "PAGE-2"]);
  });

  it("supports one-page range input and rejects deleting the only page", async () => {
    assert.deepEqual(parsePageRanges("1", 1), [0]);
    const pdf = await createMarkedPdf(1);

    assert.throws(() => removePdfPagesByIndex(pdf, [0]), /Cannot delete all pages/);
    assert.deepEqual(await readPageMarkers(pdf), ["PAGE-1"]);
  });

  it("parses inclusive 1-based ranges and converts them to zero-based indices", () => {
    assert.deepEqual(parsePageRanges("1-3, 5", 6), [0, 1, 2, 4]);
  });

  it("deduplicates overlapping and repeated page ranges", () => {
    assert.deepEqual(parsePageRanges("1, 1-2, 2", 6), [0, 1]);
  });

  it("rejects malformed and out-of-range page ranges", () => {
    for (const input of ["0", "4-2", "1, 7", "1,,2", "1.5"]) {
      assert.throws(() => parsePageRanges(input, 6), undefined, input);
    }
  });

  it("rejects invalid or out-of-range removal indices without changing the PDF", async () => {
    const pdf = await createMarkedPdf(3);

    assert.throws(() => removePdfPagesByIndex(pdf, [-1]), /Page index/);
    assert.throws(() => removePdfPagesByIndex(pdf, [3]), /Page index/);
    assert.deepEqual(await readPageMarkers(pdf), ["PAGE-1", "PAGE-2", "PAGE-3"]);
  });
});
