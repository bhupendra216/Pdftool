import { execFile } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import sharp, { type Sharp } from "sharp";

const MAX_IMAGE_PIXELS = 25_000_000;
const MAX_PDF_PAGES = 3;
const PDF_RENDER_DPI = 200;
const PDF_RENDER_TIMEOUT_MS = 20_000;

type OcrFileType = "image" | "pdf";
type OcrJob = { buffer: Buffer; fileType: OcrFileType; tempDir?: string };
type OcrResult = { text: string; confidence?: number; pages: number };

class BadInputError extends Error {}

async function renderPdfPages(pdfBuffer: Buffer, tempDir: string): Promise<Buffer[]> {
  const inputPath = path.join(tempDir, "input.pdf");
  const outputPrefix = path.join(tempDir, "page");
  await writeFile(inputPath, pdfBuffer);
  return new Promise((resolve, reject) => {
    execFile(
      "pdftoppm",
      [
        "-f", "1",
        "-l", String(MAX_PDF_PAGES),
        "-jpeg",
        "-r", String(PDF_RENDER_DPI),
        inputPath,
        outputPrefix,
      ],
      { timeout: PDF_RENDER_TIMEOUT_MS, maxBuffer: 2 * 1024 * 1024 },
      async (error) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const names = (await readdir(tempDir))
            .filter((name) => /^page-\d+\.jpg$/i.test(name))
            .sort((left, right) => {
              const leftPage = Number(left.match(/\d+/)?.[0] || 0);
              const rightPage = Number(right.match(/\d+/)?.[0] || 0);
              return leftPage - rightPage;
            });
          if (names.length === 0 || names.length > MAX_PDF_PAGES) {
            reject(new Error("PDF renderer returned an invalid page count"));
            return;
          }
          resolve(await Promise.all(names.map((name) => readFile(path.join(tempDir, name)))));
        } catch (readError) {
          reject(readError);
        }
      },
    );
  });
}

async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  let image: Sharp;
  try {
    image = sharp(buffer, { limitInputPixels: MAX_IMAGE_PIXELS, page: 0, pages: 1 });
    const metadata = await image.metadata();
    const allowedFormats = new Set(["png", "jpeg", "webp", "bmp", "tiff"]);
    if (
      !metadata.format ||
      !allowedFormats.has(metadata.format) ||
      !metadata.width ||
      !metadata.height ||
      metadata.width * metadata.height > MAX_IMAGE_PIXELS
    ) {
      throw new BadInputError("The image is invalid or exceeds the 25-megapixel limit.");
    }
  } catch (error) {
    if (error instanceof BadInputError) throw error;
    throw new BadInputError("The image is invalid or exceeds the 25-megapixel limit.");
  }

  return image.rotate().grayscale().normalize().sharpen().median(1).jpeg({ quality: 90 }).toBuffer();
}

async function recognize(job: OcrJob): Promise<OcrResult> {
  let images: Buffer[];

  if (job.fileType === "pdf") {
    let pdf: PDFDocument;
    try {
      pdf = await PDFDocument.load(job.buffer);
      const pages = pdf.getPages();
      if (pages.length < 1) throw new BadInputError("The PDF has no pages.");
      for (const page of pages.slice(0, MAX_PDF_PAGES)) {
        const { width, height } = page.getSize();
        const pixelWidth = Math.ceil((width * PDF_RENDER_DPI) / 72);
        const pixelHeight = Math.ceil((height * PDF_RENDER_DPI) / 72);
        if (
          !Number.isFinite(pixelWidth) ||
          !Number.isFinite(pixelHeight) ||
          pixelWidth < 1 ||
          pixelHeight < 1 ||
          pixelWidth * pixelHeight > MAX_IMAGE_PIXELS
        ) {
          throw new BadInputError("A PDF page exceeds the 25-megapixel limit.");
        }
      }
    } catch (error) {
      if (error instanceof BadInputError) throw error;
      throw new BadInputError("The PDF is invalid, encrypted, or unsupported.");
    }

    if (!job.tempDir) throw new Error("Missing temporary directory for PDF rendering");
    images = await renderPdfPages(job.buffer, job.tempDir);
  } else {
    images = [await preprocessImage(job.buffer)];
  }

  let tesseractWorker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | undefined;
  try {
    const tesseract = await import("tesseract.js");
    tesseractWorker = await tesseract.createWorker({ logger: () => {} });
    await tesseractWorker.loadLanguage("eng+nep");
    await tesseractWorker.initialize("eng+nep");

    const results = [];
    for (const imageBuffer of images) {
      const preparedImage = job.fileType === "pdf" ? await preprocessImage(imageBuffer) : imageBuffer;
      const { data } = await tesseractWorker.recognize(preparedImage);
      results.push({
        text: data?.text || "",
        confidence: data?.confidence,
      });
    }

    const confidences = results
      .map((result) => result.confidence)
      .filter((confidence): confidence is number => typeof confidence === "number");
    return {
      text: results.map((result) => result.text).join("\n\n"),
      confidence: confidences.length
        ? Math.round((confidences.reduce((sum, confidence) => sum + confidence, 0) / confidences.length) * 100) / 100
        : undefined,
      pages: results.length,
    };
  } finally {
    if (tesseractWorker) await tesseractWorker.terminate();
  }
}

process.on("message", async (message: OcrJob) => {
  try {
    const result = await recognize(message);
    process.send?.({ ok: true, ...result });
  } catch (error) {
    console.error("OCR worker processing error", error);
    process.send?.({
      ok: false,
      code: error instanceof BadInputError ? "BAD_INPUT" : "PROCESSING",
      message: error instanceof BadInputError ? error.message : "OCR processing failed",
    });
  } finally {
    process.disconnect?.();
  }
});
