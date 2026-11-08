import * as XLSX from "xlsx";
import type { PDFDocumentProxy } from "pdfjs-dist";

export type TextPart = { text: string; x: number; y: number; width: number; height: number };
export type ExtractedPage = { rows: string[][]; plainRows: string[]; hasTable: boolean };

export async function extractPdfTables(
  pdf: Pick<PDFDocumentProxy, "numPages" | "getPage">,
  onPage?: (pageNumber: number, pageCount: number) => void,
): Promise<ExtractedPage[]> {
  const pages: ExtractedPage[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const text = await page.getTextContent();
    const parts = text.items.flatMap((item): TextPart[] => {
      if (!("str" in item) || !item.str.trim() || !("transform" in item)) return [];
      return [{
        text: item.str,
        x: item.transform[4] ?? 0,
        y: item.transform[5] ?? 0,
        width: item.width ?? 0,
        height: item.height ?? 0,
      }];
    });
    pages.push(detectTableRows(clusterTextRows(parts)));
    onPage?.(pageNumber, pdf.numPages);
  }
  return pages;
}

export function hasDetectedTables(pages: ExtractedPage[]) {
  return pages.some((page) => page.hasTable && page.rows.length > 0);
}

export function clusterTextRows(parts: TextPart[]) {
  const sorted = parts.filter((part) => part.text.trim()).sort((left, right) => right.y - left.y || left.x - right.x);
  const rows: TextPart[][] = [];

  for (const part of sorted) {
    const row = rows.find((candidate) => Math.abs(candidate[0].y - part.y) <= 3);
    if (row) row.push(part);
    else rows.push([part]);
  }

  return rows
    .map((row) => row.sort((left, right) => left.x - right.x))
    .sort((left, right) => right[0].y - left[0].y);
}

export function detectTableRows(rows: TextPart[][]): ExtractedPage {
  // This intentionally heuristic parser groups baselines into rows and uses wide horizontal
  // gaps to infer columns; PDF text coordinates do not reliably encode semantic table cells.
  const plainRows = rows.map((row) => row.map((part) => part.text.trim()).filter(Boolean).join(" "));
  const cellRows = rows.map((row) => {
    const cells: string[] = [];
    let current = "";
    let previous: TextPart | undefined;
    for (const part of row) {
      const gap = previous ? part.x - (previous.x + previous.width) : 0;
      const splitColumn = Boolean(previous && gap > Math.max(24, Math.max(previous.height, part.height) * 2.5));
      if (splitColumn) {
        cells.push(current.trim());
        current = "";
      }
      current += `${current ? " " : ""}${part.text.trim()}`;
      previous = part;
    }
    if (current.trim()) cells.push(current.trim());
    return cells;
  });

  const tableRows = cellRows.filter((row) => row.length >= 2).length;
  return { rows: cellRows, plainRows, hasTable: tableRows >= 2 };
}

export function createExcelWorkbook(pages: ExtractedPage[], sheetMode: "pages" | "single") {
  const workbook = XLSX.utils.book_new();
  if (sheetMode === "pages") {
    pages.forEach((page, index) => {
      const rows = page.hasTable ? page.rows : page.plainRows.map((line) => [line]);
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows.length ? rows : [[""]]), `Page ${index + 1}`);
    });
  } else {
    const rows = pages.flatMap((page) => page.hasTable ? page.rows : page.plainRows.map((line) => [line]));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows.length ? rows : [[""]]), "PDF data");
  }
  const written = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer | Uint8Array;
  return written instanceof ArrayBuffer ? written : written.slice().buffer as ArrayBuffer;
}

export function createExcelWorkbookBlob(pages: ExtractedPage[], sheetMode: "pages" | "single") {
  if (!hasDetectedTables(pages)) {
    throw new Error("No tables were found in this PDF.");
  }

  const workbookBytes = createExcelWorkbook(pages, sheetMode);
  const signature = new Uint8Array(workbookBytes, 0, Math.min(2, workbookBytes.byteLength));
  if (
    workbookBytes.byteLength === 0 ||
    signature.length < 2 ||
    signature[0] !== 0x50 ||
    signature[1] !== 0x4b
  ) {
    throw new Error("Could not create the Excel file. Please try again.");
  }

  const blob = new Blob([workbookBytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  if (blob.size === 0) {
    throw new Error("Could not create the Excel file. Please try again.");
  }
  return blob;
}
