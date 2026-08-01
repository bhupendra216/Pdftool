import express, { Router } from "express";
import multer from "multer";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";

type PdfToWordOptions = {
  outputFormat: "docx" | "doc";
  preserveLayout: boolean;
  extractImages: boolean;
  ocr: boolean;
};

type PdfCompressionLevel = "balanced" | "maximum";

function formatContentDisposition(filename: string) {
  const safe = filename.replace(/"/g, "");
  try {
    const encoded = encodeURIComponent(safe);
    return `attachment; filename="${safe}"; filename*=UTF-8''${encoded}`;
  } catch {
    return `attachment; filename="${safe}"`;
  }
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
const router = Router();

const WORD_INPUT_EXTS = new Set([".doc", ".docx"]);
const PDF_INPUT_EXTS = new Set([".pdf"]);
const JPG_PDF_INPUT_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const WORD_OUTPUT_EXTS = new Set(["docx", "doc"]);

function parseBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;
  }
  return defaultValue;
}

function parsePdfToWordOptions(body: Record<string, unknown>): PdfToWordOptions {
  const outputFormat = String(body.outputFormat || "docx").toLowerCase();

  return {
    outputFormat: WORD_OUTPUT_EXTS.has(outputFormat) ? (outputFormat as "docx" | "doc") : "docx",
    preserveLayout: parseBoolean(body.preserveLayout, true),
    extractImages: parseBoolean(body.extractImages, true),
    ocr: parseBoolean(body.ocr, false),
  };
}

export function parsePdfCompressionLevel(body: Record<string, unknown>): PdfCompressionLevel {
  const raw = String(body.compressionLevel || body.level || "balanced").toLowerCase();
  return raw === "maximum" || raw === "max" ? "maximum" : "balanced";
}

export function getGhostscriptCompressionArgs(inputPath: string, outputPath: string, level: PdfCompressionLevel = "balanced") {
  const settings = level === "maximum" ? "/screen" : "/ebook";

  return [
    "-q",
    "-dNOPAUSE",
    "-dBATCH",
    "-sDEVICE=pdfwrite",
    `-dPDFSETTINGS=${settings}`,
    "-dCompatibilityLevel=1.4",
    "-dEmbedAllFonts=true",
    "-dSubsetFonts=true",
    "-dOptimize=true",
    `-sOutputFile=${outputPath}`,
    inputPath,
  ];
}

function getReadablePdfError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("encrypted") || normalized.includes("password")) {
    return "Password-protected PDFs are not supported. Remove the password and try again.";
  }

  if (normalized.includes("invalid pdf") || normalized.includes("failed to parse") || normalized.includes("not a pdf")) {
    return "The uploaded file is not a valid PDF.";
  }

  return message;
}

async function validatePdfBuffer(file: Express.Multer.File) {
  const filename = file.originalname || "input.pdf";
  const ext = path.extname(filename).toLowerCase();

  if (!PDF_INPUT_EXTS.has(ext)) {
    throw new Error("Unsupported input file type. Upload a PDF file.");
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("No file uploaded");
  }

  try {
    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: false });
    return { pageCount: pdf.getPageCount(), ext };
  } catch (error: any) {
    const message = String(error?.message || error || "Invalid PDF");
    throw new Error(getReadablePdfError(message));
  }
}

async function detectScannedPdf(buffer: Buffer) {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      stopAtErrors: true,
    });
    const pdf = await loadingTask.promise;
    const samplePages = Math.min(pdf.numPages, 3);
    let extractedLength = 0;

    for (let pageIndex = 1; pageIndex <= samplePages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      const textContent = await page.getTextContent();
      extractedLength += textContent.items
        .map((item: any) => (typeof item?.str === "string" ? item.str : ""))
        .join(" ")
        .trim().length;

      if (extractedLength > 150) {
        break;
      }
    }

    return extractedLength < 80;
  } catch {
    return true;
  }
}

async function buildDocxFromText(text: string, filenameBase: string) {
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const blocks = normalizedText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const paragraphs: Paragraph[] = blocks.length > 0
    ? blocks.map((block) => new Paragraph({
        children: [new TextRun(block.replace(/\n/g, " "))],
        spacing: { after: 120 },
        alignment: AlignmentType.LEFT,
      }))
    : [new Paragraph({ children: [new TextRun(" ")], spacing: { after: 120 } })];

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  return {
    buffer: Buffer.from(await Packer.toBuffer(doc)),
    filename: `${filenameBase}.docx`,
  };
}

async function buildDocxFromOcrPages(pageTexts: string[], filenameBase: string) {
  const paragraphs: Paragraph[] = [];

  pageTexts.forEach((pageText, pageIndex) => {
    const normalizedText = pageText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (pageIndex > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "", break: 1 })],
          pageBreakBefore: true,
        }),
      );
    }

    if (!normalizedText) {
      paragraphs.push(new Paragraph({ children: [new TextRun(" ")], spacing: { after: 120 } }));
      return;
    }

    normalizedText.split(/\n+/).forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        paragraphs.push(new Paragraph({ children: [new TextRun(" ")], spacing: { after: 120 } }));
        return;
      }

      paragraphs.push(
        new Paragraph({
          children: [new TextRun(trimmedLine)],
          spacing: { after: 120 },
          alignment: AlignmentType.LEFT,
        }),
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return {
    buffer: Buffer.from(await Packer.toBuffer(doc)),
    filename: `${filenameBase}.docx`,
  };
}

async function convertPdfToWordViaOcr(file: Express.Multer.File, outputFormat: "docx" | "doc") {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-word-ocr-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const outputBase = path.join(tempDir, "ocr-output");
  const baseName = path.basename(file.originalname || "document", path.extname(file.originalname || "")) || "document";

  try {
    await writeFile(inputFile, file.buffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        "pdftoppm",
        ["-jpeg", "-r", "250", inputFile, outputBase],
        { timeout: 180_000, maxBuffer: 20 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`PDF OCR image extraction failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
            return;
          }
          resolve();
        },
      );
    });

    const tesseract: any = await import("tesseract.js");
    const createWorker: any = tesseract.createWorker;
    const PSM: any = tesseract.PSM;
    const worker: any = await createWorker({ logger: () => {} });

    await worker.load();
    await worker.loadLanguage("eng+nep");
    await worker.initialize("eng+nep");

    try {
      await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO });
    } catch {
      // ignore if unavailable on the runtime
    }

    const { readdir, readFile } = await import("node:fs/promises");
    const pageFiles = (await readdir(tempDir))
      .filter((name) => /^ocr-output-\d+\.jpg$/i.test(name))
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

    const pageTexts: string[] = [];

    for (const pageFile of pageFiles) {
      const pagePath = path.join(tempDir, pageFile);
      const pageBuffer = await readFile(pagePath);
      const { data } = await worker.recognize(pageBuffer);
      pageTexts.push(String(data?.text || "").trim());
    }

    await worker.terminate();

    const { buffer: docxBuffer } = await buildDocxFromOcrPages(pageTexts, baseName);

    if (outputFormat === "doc") {
      const docxInput = path.join(tempDir, `${baseName}.docx`);
      await writeFile(docxInput, docxBuffer);
      await execSofficeConvert(docxInput, tempDir, "doc");
      const outputPath = await findConvertedFile(tempDir, baseName, "doc");
      return { buffer: await readFile(outputPath), filename: `${baseName}.doc` };
    }

    const docxPath = path.join(tempDir, `${baseName}.docx`);
    await writeFile(docxPath, docxBuffer);
    return { buffer: docxBuffer, filename: `${baseName}.docx` };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function execSofficeConvert(inputPath: string, outputDir: string, outputExt: string) {
  const filters =
    outputExt === "docx"
      ? ["docx:MS Word 2007 XML", "docx"]
      : outputExt === "doc"
      ? ["doc:MS Word 97", "doc"]
      : outputExt === "pdf"
      ? ["pdf:writer_pdf_Export", "pdf"]
      : [outputExt];

  const errors: string[] = [];

  for (const outputFilter of filters) {
    try {
      await new Promise<void>((resolve, reject) => {
        execFile(
          "soffice",
          [
            "--headless",
            "--invisible",
            "--norestore",
            "--convert-to",
            outputFilter,
            "--outdir",
            outputDir,
            inputPath,
          ],
          { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 },
          (error, stdout, stderr) => {
            if (error) {
              reject(new Error(`LibreOffice conversion failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
              return;
            }
            resolve();
          },
        );
      });
      return;
    } catch (error: any) {
      errors.push(String(error.message || error));
    }
  }

  throw new Error(`LibreOffice conversion failed for filters ${filters.join(", ")}: ${errors.join(" | ")}`);
}

async function findConvertedFile(outputDir: string, expectedBaseName: string, outputExt: string) {
  const entries = await readdir(outputDir);
  const exactName = `${expectedBaseName}.${outputExt}`;

  if (entries.includes(exactName)) {
    return path.join(outputDir, exactName);
  }

  const candidates = entries.filter((name) => name.toLowerCase().endsWith(`.${outputExt}`));
  if (candidates.length === 1) {
    return path.join(outputDir, candidates[0]);
  }

  const matchingBase = candidates.filter((name) => path.basename(name, path.extname(name)) === expectedBaseName);
  if (matchingBase.length === 1) {
    return path.join(outputDir, matchingBase[0]);
  }

  if (candidates.length > 0) {
    return path.join(outputDir, candidates[0]);
  }

  throw new Error(`Converted file not found. Expected ${exactName}. Directory contents: ${entries.join(", ")}`);
}

async function convertFileWithLibreOffice(file: Express.Multer.File, expectedExts: Set<string>, targetExt: string) {
  const filename = file.originalname || "input";
  const inputExt = path.extname(filename).toLowerCase();
  if (!expectedExts.has(inputExt)) {
    throw new Error(`Unsupported input format: ${inputExt || "unknown"}`);
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "office-convert-"));
  const inputFile = path.join(tempDir, `input${inputExt}`);

  try {
    await writeFile(inputFile, file.buffer);
    await execSofficeConvert(inputFile, tempDir, targetExt);

    const outputPath = await findConvertedFile(tempDir, path.basename(inputFile, inputExt), targetExt);
    const outputFileName = path.basename(outputPath);

    return { buffer: await readFile(outputPath), filename: outputFileName };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function convertPdfToWordViaText(file: Express.Multer.File, outputFormat: "docx" | "doc") {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-word-text-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const textOutput = path.join(tempDir, "extracted.txt");
  const baseName = path.basename(file.originalname || "document", path.extname(file.originalname || "")) || "document";

  try {
    await writeFile(inputFile, file.buffer);

    const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: false });
    const pageCount = pdf.getPageCount();

    if (pageCount > 20) {
      throw new Error("PDFs with more than 20 pages are not supported for Word conversion.");
    }

    await new Promise<void>((resolve, reject) => {
      execFile(
        "pdftotext",
        ["-layout", "-f", "1", "-l", String(pageCount), inputFile, textOutput],
        { timeout: 240_000, maxBuffer: 20 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Text extraction failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
            return;
          }
          resolve();
        },
      );
    });

    const extractedText = await readFile(textOutput, "utf8");
    if (!extractedText.trim()) {
      throw new Error("No text could be extracted from the PDF.");
    }

    const normalizedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const { buffer: docxBuffer } = await buildDocxFromText(normalizedText, baseName);

    if (outputFormat === "doc") {
      const docxInput = path.join(tempDir, `${baseName}.docx`);
      await writeFile(docxInput, docxBuffer);
      await execSofficeConvert(docxInput, tempDir, "doc");
      const outputPath = await findConvertedFile(tempDir, baseName, "doc");
      return { buffer: await readFile(outputPath), filename: `${baseName}.doc` };
    }

    return { buffer: docxBuffer, filename: `${baseName}.docx` };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function convertPdfToWord(file: Express.Multer.File, options: PdfToWordOptions) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-word-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const inputExt = ".pdf";
  const baseName = path.basename(file.originalname || "document", path.extname(file.originalname || "")) || "document";

  try {
    await writeFile(inputFile, file.buffer);

    if (options.ocr) {
      const scanned = await detectScannedPdf(file.buffer);
      if (scanned) {
        return await convertPdfToWordViaOcr(file, options.outputFormat);
      }
    }

    try {
      return await convertPdfToWordViaText(file, options.outputFormat);
    } catch (textError) {
      try {
        await execSofficeConvert(inputFile, tempDir, options.outputFormat);
        const convertedBaseName = path.basename(inputFile, inputExt);
        const outputPath = await findConvertedFile(tempDir, convertedBaseName, options.outputFormat);
        const buffer = await readFile(outputPath);
        return { buffer, filename: `${baseName}.${options.outputFormat}` };
      } catch (libreOfficeError) {
        return await convertPdfToWordViaOcr(file, options.outputFormat);
      }
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function convertJpgsToPdf(files: Express.Multer.File[]) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const buffer = file.buffer;

    let image;
    if (ext === ".png") {
      image = await pdfDoc.embedPng(buffer);
    } else if (ext === ".jpg" || ext === ".jpeg") {
      image = await pdfDoc.embedJpg(buffer);
    } else {
      throw new Error("Unsupported image format for JPG to PDF conversion");
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return { buffer: Buffer.from(pdfBytes), filename: "images.pdf" };
}

async function runPdfTool(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    execFile(
      command,
      args,
      { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`${command} failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
          return;
        }
        resolve();
      },
    );
  });
}

async function convertPdfToJpgWithFallback(inputFile: string, outputPrefix: string) {
  try {
    await runPdfTool("pdftoppm", ["-jpeg", "-r", "150", inputFile, outputPrefix]);
    return;
  } catch (error: any) {
    const message = String(error?.message || "");
    if (!message.includes("ENOENT") && !message.includes("not found")) {
      throw error;
    }
  }

  await runPdfTool("gs", [
    "-q",
    "-dNOPAUSE",
    "-dBATCH",
    "-sDEVICE=jpeg",
    "-r150",
    `-sOutputFile=${outputPrefix}-%d.jpg`,
    inputFile,
  ]);
}

export async function convertPdfToJpg(file: Express.Multer.File) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-jpg-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const outputPrefix = path.join(tempDir, "page");

  try {
    await writeFile(inputFile, file.buffer);
    await convertPdfToJpgWithFallback(inputFile, outputPrefix);

    const files = await readdir(tempDir);
    const jpgFiles = files.filter((name) => name.toLowerCase().endsWith(".jpg"));

    if (jpgFiles.length === 0) {
      throw new Error("No JPEG output was generated from the PDF.");
    }

    if (jpgFiles.length === 1) {
      const outputPath = path.join(tempDir, jpgFiles[0]);
      return { buffer: await readFile(outputPath), filename: jpgFiles[0], mimeType: "image/jpeg" };
    }

    const zipPath = path.join(tempDir, "pdf-pages.zip");
    await new Promise<void>((resolve, reject) => {
      execFile(
        "zip",
        ["-j", zipPath, ...jpgFiles.map((name) => path.join(tempDir, name))],
        { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Zip packaging failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
            return;
          }
          resolve();
        },
      );
    });

    return { buffer: await readFile(zipPath), filename: "pdf-pages.zip", mimeType: "application/zip" };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function runGhostscript(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    execFile(
      "gs",
      args,
      { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              `Ghostscript failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`,
            ),
          );
          return;
        }
        resolve();
      },
    );
  });
}

async function protectPdf(file: Express.Multer.File, password: string) {
  if (!password) {
    throw new Error("Password is required to protect the PDF.");
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "protect-pdf-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const outputFile = path.join(tempDir, "protected.pdf");

  try {
    await writeFile(inputFile, file.buffer);
    await runGhostscript([
      "-q",
      "-dNOPAUSE",
      "-dBATCH",
      "-sDEVICE=pdfwrite",
      `-sOutputFile=${outputFile}`,
      `-sOwnerPassword=${password}`,
      `-sUserPassword=${password}`,
      "-dEncryptionR=3",
      "-dKeyLength=128",
      "-dPermitPrinting=true",
      "-dPermitModify=false",
      "-dPermitExtract=false",
      "-dPermitAnnotate=false",
      inputFile,
    ]);
    return { buffer: await readFile(outputFile), filename: "protected.pdf" };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function unlockPdf(file: Express.Multer.File, password: string) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "unlock-pdf-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const outputFile = path.join(tempDir, "unlocked.pdf");

  try {
    await writeFile(inputFile, file.buffer);
    await runGhostscript([
      "-q",
      "-dNOPAUSE",
      "-dBATCH",
      "-sDEVICE=pdfwrite",
      `-sPDFPassword=${password}`,
      `-sOutputFile=${outputFile}`,
      inputFile,
    ]);
    return { buffer: await readFile(outputFile), filename: "unlocked.pdf" };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function handlePdfToWordRequest(req: express.Request, res: express.Response) {
  // Start an asynchronous job so we can report per-page progress
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const options = parsePdfToWordOptions(req.body as Record<string, unknown>);

  // In-memory job store (module-global)
  (global as any).__pdfToWordJobs = (global as any).__pdfToWordJobs || new Map();
  const jobs: Map<string, any> = (global as any).__pdfToWordJobs;

  const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  jobs.set(jobId, { status: "queued", currentPage: 0, totalPages: 0, error: null, filename: null, buffer: null });

  (async () => {
    const job = jobs.get(jobId);
    job.status = "processing";
    const startedAt = Date.now();

    try {
      const { pageCount } = await validatePdfBuffer(file);
      job.totalPages = pageCount;

      let scanned = false;
      if (options.ocr) scanned = await detectScannedPdf(file.buffer);

      const pageTexts: string[] = [];

      if (scanned) {
        const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-word-ocr-job-"));
        try {
          const inputFile = path.join(tempDir, "input.pdf");
          await writeFile(inputFile, file.buffer);
          await new Promise<void>((resolve, reject) => {
            execFile(
              "pdftoppm",
              ["-jpeg", "-r", "250", inputFile, path.join(tempDir, "page")],
              { timeout: 180_000, maxBuffer: 50 * 1024 * 1024 },
              (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve();
              },
            );
          });

          const tesseract: any = await import("tesseract.js");
          const createWorker: any = tesseract.createWorker;
          const PSM: any = tesseract.PSM;
          const worker: any = await createWorker({ logger: () => {} });
          await worker.load();
          await worker.loadLanguage("eng+nep");
          await worker.initialize("eng+nep");
          try { await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO }); } catch {}

          const images = (await readdir(tempDir)).filter((n) => n.toLowerCase().endsWith('.jpg')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          for (let i = 0; i < images.length; i++) {
            job.currentPage = i + 1;
            const buf = await readFile(path.join(tempDir, images[i]));
            const { data } = await worker.recognize(buf);
            pageTexts.push(String(data?.text || "").trim());
          }

          await worker.terminate();
        } finally {
          try { await rm(tempDir, { recursive: true, force: true }); } catch {}
        }
      } else {
        const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-word-text-job-"));
        try {
          const inputFile = path.join(tempDir, "input.pdf");
          await writeFile(inputFile, file.buffer);
          for (let p = 1; p <= job.totalPages; p++) {
            job.currentPage = p;
            const outPath = path.join(tempDir, `page-${p}.txt`);
            await new Promise<void>((resolve, reject) => {
              execFile(
                "pdftotext",
                ["-layout", "-f", String(p), "-l", String(p), inputFile, outPath],
                { timeout: 120_000, maxBuffer: 20 * 1024 * 1024 },
                (error, stdout, stderr) => {
                  if (error) return reject(error);
                  resolve();
                },
              );
            });
            const txt = await readFile(outPath, "utf8");
            pageTexts.push(txt || "");
          }
        } finally {
          try { await rm(tempDir, { recursive: true, force: true }); } catch {}
        }
      }

      const { buffer: docxBuffer, filename } = await buildDocxFromOcrPages(pageTexts, path.basename(file.originalname || "document", path.extname(file.originalname || "")) || "document");

      job.status = "done";
      job.buffer = docxBuffer;
      job.filename = filename;
      job.finishedAt = Date.now();
      job.totalTimeMs = Date.now() - startedAt;
    } catch (err: any) {
      job.status = "error";
      job.error = String(err?.message || err);
      console.error("PDF->Word job error", err);
    }
  })();

  res.json({ jobId });
}

router.post("/pdf-to-word", upload.single("files"), async (req, res) => {
  await handlePdfToWordRequest(req, res);
});

router.post("/convert-pdf-to-word", upload.single("files"), async (req, res) => {
  await handlePdfToWordRequest(req, res);
});

// Poll job status for a previously enqueued PDF->Word job
router.get("/pdf-to-word/status/:jobId", async (req, res) => {
  const jobId = String(req.params.jobId || "");
  (global as any).__pdfToWordJobs = (global as any).__pdfToWordJobs || new Map();
  const jobs: Map<string, any> = (global as any).__pdfToWordJobs;
  const job = jobs.get(jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json({ status: job.status, currentPage: job.currentPage || 0, totalPages: job.totalPages || 0, error: job.error || null });
});

// Download job result when ready
router.get("/pdf-to-word/result/:jobId", async (req, res) => {
  const jobId = String(req.params.jobId || "");
  (global as any).__pdfToWordJobs = (global as any).__pdfToWordJobs || new Map();
  const jobs: Map<string, any> = (global as any).__pdfToWordJobs;
  const job = jobs.get(jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  if (job.status !== "done") {
    res.status(400).json({ error: "Job not complete" });
    return;
  }
  const buffer: Buffer = job.buffer;
  const filename: string = job.filename || "document.docx";
  const mimeType = filename.toLowerCase().endsWith(".docx")
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/msword";
  res.setHeader("content-type", mimeType);
  res.setHeader("content-disposition", formatContentDisposition(filename));
  res.send(buffer);
});

router.post("/convert-word-to-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!WORD_INPUT_EXTS.has(ext)) {
    res.status(400).json({ error: "Unsupported input file type" });
    return;
  }

  try {
    const { buffer, filename } = await convertFileWithLibreOffice(file, WORD_INPUT_EXTS, "pdf");
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", formatContentDisposition(filename));
    res.send(buffer);
  } catch (error: any) {
    console.error("Word to PDF conversion failed", error);
    res.status(500).json({ error: error?.message || "Conversion failed" });
  }
});

router.post("/convert-jpg-to-pdf", upload.array("files"), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  try {
    const { buffer, filename } = await convertJpgsToPdf(files);
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (error: any) {
    console.error("JPG to PDF conversion failed", error);
    res.status(500).json({ error: error?.message || "Conversion failed" });
  }
});

router.post("/convert-pdf-to-jpg", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!PDF_INPUT_EXTS.has(ext)) {
    res.status(400).json({ error: "Unsupported input file type" });
    return;
  }

  try {
    const { buffer, filename, mimeType } = await convertPdfToJpg(file);
    res.setHeader("content-type", mimeType);
    res.setHeader("content-disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (error: any) {
    console.error("PDF to JPG conversion failed", error);
    res.status(500).json({ error: error?.message || "Conversion failed" });
  }
});

router.post("/compress-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    await validatePdfBuffer(file);
    const compressionLevel = parsePdfCompressionLevel(req.body as Record<string, unknown>);
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "compress-pdf-"));
    const inputFile = path.join(tempDir, "input.pdf");
    const outputFile = path.join(tempDir, "compressed.pdf");
    const base = path.basename(file.originalname || "document", path.extname(file.originalname || ""));
    const outputName = `${base}-compressed.pdf`;

    try {
      await writeFile(inputFile, file.buffer);
      await runGhostscript(getGhostscriptCompressionArgs(inputFile, outputFile, compressionLevel));
      const buffer = await readFile(outputFile);

      res.setHeader("content-type", "application/pdf");
      res.setHeader("content-disposition", formatContentDisposition(outputName));
      res.send(buffer);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  } catch (error: any) {
    const message = String(error?.message || error || "Compression failed");
    console.error("PDF compression failed", error);
    res.status(500).json({ error: message });
  }
});

router.post("/protect-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const password = String(req.body.password || "").trim();

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required to protect the file." });
    return;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!PDF_INPUT_EXTS.has(ext)) {
    res.status(400).json({ error: "Unsupported input file type" });
    return;
  }

  try {
    const { buffer, filename } = await protectPdf(file, password);
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (error: any) {
    console.error("Protect PDF conversion failed", error);
    res.status(500).json({ error: error?.message || "Conversion failed" });
  }
});

router.post("/unlock-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const password = String(req.body.password || "").trim();

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password is required to unlock the file." });
    return;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!PDF_INPUT_EXTS.has(ext)) {
    res.status(400).json({ error: "Unsupported input file type" });
    return;
  }

  try {
    const { buffer, filename } = await unlockPdf(file, password);
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (error: any) {
    console.error("Unlock PDF conversion failed", error);
    res.status(500).json({ error: error?.message || "Conversion failed" });
  }
});

export default router;
