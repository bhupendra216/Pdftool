import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export const MAX_PDF_BYTES = 50 * 1024 * 1024;
export const MAX_PDF_PAGES = 20;

export function validatePdfFile(file: File) {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("This PDF is larger than the 50 MB limit.");
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Choose a PDF file to continue.");
  }
}

export async function openPdf(file: File): Promise<PDFDocumentProxy> {
  validatePdfFile(file);
  if (typeof Worker === "undefined") {
    throw new Error("This browser does not support the PDF worker needed to open documents. Try a recent version of Chrome, Edge, Firefox, or Safari.");
  }
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocument({ data: bytes }).promise;
    if (pdf.numPages > MAX_PDF_PAGES) {
      await pdf.cleanup();
      throw new Error("This PDF has more than 20 pages. Please choose a shorter document.");
    }
    return pdf;
  } catch (error) {
    if (error instanceof Error && error.message.includes("more than 20 pages")) throw error;
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("password") || message.includes("encrypted")) {
      throw new Error("This PDF is password-protected. Remove its password and try again.");
    }
    throw new Error("This PDF could not be opened. It may be damaged, encrypted, or unsupported.");
  }
}

export function outputBaseName(filename: string) {
  return filename.replace(/\.pdf$/i, "").trim() || "document";
}

export function renderPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
  canvas: HTMLCanvasElement,
) {
  return pdf.getPage(pageNumber).then(async (page) => {
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser does not support the canvas features needed to render PDF pages.");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport } as Parameters<typeof page.render>[0]).promise;
    return { page, viewport, width: viewport.width, height: viewport.height };
  });
}
