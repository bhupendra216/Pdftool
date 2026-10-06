import * as XLSX from "xlsx";

export type TextPart = { text: string; x: number; y: number; width: number; height: number };
export type ExtractedPage = { rows: string[][]; plainRows: string[]; hasTable: boolean };

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
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as Uint8Array;
}
