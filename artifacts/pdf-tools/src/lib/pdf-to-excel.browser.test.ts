import { describe, expect, it } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";
import { openPdf } from "./client-pdf";
import {
  createExcelWorkbookBlob,
  extractPdfTables,
  type ExtractedPage,
} from "./pdf-to-excel";

async function createTablePdf() {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);

  for (let pageNumber = 1; pageNumber <= 2; pageNumber += 1) {
    const page = document.addPage([612, 792]);
    const yPositions = [700, 660, 620];
    const values = [
      ["Name", "Department", "Amount"],
      ["Ada", "Engineering", "1250"],
      ["Linus", "Research", "980"],
    ];
    for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
      const y = yPositions[rowIndex]!;
      const row = values[rowIndex]!;
      page.drawText(row[0]!, { x: 50, y, size: 12, font });
      page.drawText(row[1]!, { x: 260, y, size: 12, font });
      page.drawText(row[2]!, { x: 490, y, size: 12, font });
    }
  }

  return new Uint8Array(await document.save());
}

async function extractPages(bytes: Uint8Array): Promise<ExtractedPage[]> {
  const file = new File([bytes], "table.pdf", { type: "application/pdf" });
  const pdf = await openPdf(file);
  try {
    return await extractPdfTables(pdf);
  } finally {
    await pdf.cleanup();
  }
}

async function createPlainTextPdf() {
  const document = await PDFDocument.create();
  const page = document.addPage([612, 792]);
  const font = await document.embedFont(StandardFonts.Helvetica);
  page.drawText("This is a plain text report without a table.", { x: 50, y: 700, size: 14, font });
  return new Uint8Array(await document.save());
}

async function createScannedPdf() {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 100;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this test browser.");
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText("Scanned table image", 8, 50);
  const imageBytes = new Uint8Array(await (await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not create fixture image.")), "image/png");
  })).arrayBuffer());

  const pdfDocument = await PDFDocument.create();
  const image = await pdfDocument.embedPng(imageBytes);
  const page = pdfDocument.addPage([612, 792]);
  page.drawImage(image, { x: 50, y: 600, width: 200, height: 100 });
  return new Uint8Array(await pdfDocument.save());
}

describe("PDF to Excel workbook generation", () => {
  it("creates a valid workbook with values in separate cells for one sheet per page", async () => {
    const pages = await extractPages(await createTablePdf());
    const blob = createExcelWorkbookBlob(pages, "pages");
    const bytes = new Uint8Array(await blob.arrayBuffer());

    expect(blob.size).toBeGreaterThan(0);
    expect(Array.from(bytes.slice(0, 2))).toEqual([0x50, 0x4b]);
    const workbook = XLSX.read(bytes, { type: "array" });
    expect(workbook.SheetNames).toEqual(["Page 1", "Page 2"]);
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]!;
      expect(sheet.A1?.v).toBe("Name");
      expect(sheet.B1?.v).toBe("Department");
      expect(sheet.C1?.v).toBe("Amount");
      expect(sheet.A2?.v).toBe("Ada");
      expect(sheet.B2?.v).toBe("Engineering");
      expect(sheet.C2?.v).toBe("1250");
    }
  });

  it("creates a valid single-sheet workbook with the table split into columns", async () => {
    const pages = await extractPages(await createTablePdf());
    const blob = createExcelWorkbookBlob(pages, "single");
    const workbook = XLSX.read(await blob.arrayBuffer(), { type: "array" });
    const sheet = workbook.Sheets["PDF data"]!;

    expect(blob.size).toBeGreaterThan(0);
    expect(workbook.SheetNames).toEqual(["PDF data"]);
    expect(sheet.A1?.v).toBe("Name");
    expect(sheet.B1?.v).toBe("Department");
    expect(sheet.C1?.v).toBe("Amount");
    expect(sheet.A2?.v).toBe("Ada");
    expect(sheet.B2?.v).toBe("Engineering");
    expect(sheet.C2?.v).toBe("1250");
    expect(sheet.A5?.v).toBe("Ada");
    expect(sheet.C6?.v).toBe("980");
  });

  it("does not create a workbook for a text-only PDF", async () => {
    const pages = await extractPages(await createPlainTextPdf());
    expect(() => createExcelWorkbookBlob(pages, "pages")).toThrow(
      "No tables were found in this PDF.",
    );
    expect(() => createExcelWorkbookBlob(pages, "single")).toThrow(
      "No tables were found in this PDF.",
    );
  });

  it("does not create a workbook for a scanned PDF with no text layer", async () => {
    const pages = await extractPages(await createScannedPdf());
    expect(pages).toHaveLength(1);
    expect(pages[0]?.plainRows).toHaveLength(0);
    expect(() => createExcelWorkbookBlob(pages, "pages")).toThrow(
      "No tables were found in this PDF.",
    );
    expect(() => createExcelWorkbookBlob(pages, "single")).toThrow(
      "No tables were found in this PDF.",
    );
  });

  it("returns a short user-friendly error for a corrupt PDF", async () => {
    const corruptFile = new File(
      [new TextEncoder().encode("%PDF-1.7\nnot a valid PDF\n%%EOF")],
      "corrupt.pdf",
      { type: "application/pdf" },
    );
    await expect(openPdf(corruptFile)).rejects.toThrow(
      "This PDF could not be opened. It may be damaged, encrypted, or unsupported.",
    );
  });
});
