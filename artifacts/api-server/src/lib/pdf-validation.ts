import { PDFDocument } from "pdf-lib";

export class PdfValidationError extends Error {
  constructor(message = "The uploaded file is not a valid PDF.") {
    super(message);
    this.name = "PdfValidationError";
  }
}

export type PdfInfo = {
  pageCount: number;
  encrypted: boolean;
};

export async function getPdfInfo(buffer: Buffer): Promise<PdfInfo> {
  try {
    const pdf = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });
    const pageCount = pdf.getPageCount();
    if (!pageCount) throw new PdfValidationError();
    return { pageCount, encrypted: pdf.isEncrypted };
  } catch (error) {
    if (error instanceof PdfValidationError) throw error;
    throw new PdfValidationError();
  }
}

export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  const { pageCount } = await getPdfInfo(buffer);
  return pageCount;
}

export async function isPdfEncrypted(buffer: Buffer): Promise<boolean> {
  const { encrypted } = await getPdfInfo(buffer);
  return encrypted;
}

export async function assertSamePdfPageCount(
  inputBuffer: Buffer,
  outputBuffer: Buffer,
): Promise<void> {
  const inputPageCount = await getPdfPageCount(inputBuffer);
  const outputPageCount = await getPdfPageCount(outputBuffer);
  if (inputPageCount !== outputPageCount) {
    throw new PdfValidationError("PDF processing changed the page count. No output was returned.");
  }
}
