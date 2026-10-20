import * as pdfjsLib from "pdfjs-dist";
import { MAX_PDF_BYTES, MAX_PDF_PAGES, validatePdfFile } from "@/lib/client-pdf";

export type LabPage = { pageNumber: number; text: string };
export type LabTextChunk = { id: string; page: number; text: string };

export class PasswordRequiredError extends Error {
  constructor(readonly incorrect = false) {
    super(incorrect ? "That password was not accepted. Try again." : "This PDF needs a password.");
    this.name = "PasswordRequiredError";
  }
}

export class TooManyPagesError extends Error {
  constructor() {
    super(`This PDF has more than ${MAX_PDF_PAGES} pages.`);
    this.name = "TooManyPagesError";
  }
}

type TextItem = {
  str: string;
  transform: number[];
  height: number;
  hasEOL?: boolean;
};

function structurePageText(items: TextItem[]): string {
  let result = "";
  let previousY: number | undefined;
  let previousHeight = 0;

  for (const item of items) {
    const y = item.transform[5] || 0;
    const height = Math.abs(item.height) || 10;
    if (previousY !== undefined && Math.abs(y - previousY) > Math.max(2, height * 0.35)) {
      const gap = Math.abs(y - previousY);
      result = result.trimEnd() + (gap > Math.max(previousHeight, height) * 1.35 ? "\n\n" : "\n");
    } else if (result && !/\s$/.test(result) && item.str && !/^[,.;:!?)}\]]/.test(item.str)) {
      result += " ";
    }
    result += item.str;
    if (item.hasEOL && !result.endsWith("\n")) result += "\n";
    previousY = y;
    previousHeight = height;
  }

  return result.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export async function extractLabPdf(
  file: File,
  password: string,
  onProgress: (message: string) => void,
  signal: AbortSignal,
): Promise<LabPage[]> {
  validatePdfFile(file);
  if (file.size > MAX_PDF_BYTES) throw new Error(`Choose a PDF no larger than ${MAX_PDF_BYTES / (1024 * 1024)} MB.`);

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    password: password || undefined,
  });
  try {
    let pdf: pdfjsLib.PDFDocumentProxy;
    try {
      pdf = await loadingTask.promise;
    } catch (error) {
      if (error instanceof Error && error.name === "PasswordException") {
        throw new PasswordRequiredError(Boolean(password));
      }
      throw error;
    }
    if (pdf.numPages > MAX_PDF_PAGES) throw new TooManyPagesError();

    const pages: LabPage[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      if (signal.aborted) throw new DOMException("Upload superseded.", "AbortError");
      onProgress(`Reading page ${pageNumber} of ${pdf.numPages}`);
      const page = await pdf.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        pages.push({
          pageNumber,
          text: structurePageText(content.items.filter((item) => "str" in item)),
        });
      } finally {
        page.cleanup();
      }
    }
    return pages;
  } finally {
    await loadingTask.destroy();
  }
}
