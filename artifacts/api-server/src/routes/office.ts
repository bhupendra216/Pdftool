import { Router } from "express";
import multer from "multer";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";

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

async function execSofficeConvert(inputPath: string, outputDir: string, outputExt: string) {
  const filters =
    outputExt === "docx"
      ? ["docx:MS Word 2007 XML", "docx"]
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

    const outputFileName = `${path.basename(inputFile, inputExt)}.${targetExt}`;
    const outputPath = path.join(tempDir, outputFileName);

    try {
      return { buffer: await readFile(outputPath), filename: outputFileName };
    } catch (readError: any) {
      const dirFiles = await readdir(tempDir).catch(() => []);
      throw new Error(
        `Converted file not found. Expected ${outputFileName}. Directory contents: ${dirFiles.join(", ")}. ${readError.message}`,
      );
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

async function convertPdfToJpg(file: Express.Multer.File) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pdf-to-jpg-"));
  const inputFile = path.join(tempDir, "input.pdf");
  const outputPrefix = path.join(tempDir, "page");

  try {
    await writeFile(inputFile, file.buffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        "pdftoppm",
        ["-jpeg", "-r", "150", inputFile, outputPrefix],
        { timeout: 120_000, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`PDF to JPG conversion failed: ${error.message}${stderr ? ` - ${stderr}` : ""}${stdout ? ` - ${stdout}` : ""}`));
            return;
          }
          resolve();
        },
      );
    });

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

router.post("/convert-pdf-to-word", upload.single("files"), async (req, res) => {
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
    const { buffer, filename } = await convertFileWithLibreOffice(file, PDF_INPUT_EXTS, "docx");
    res.setHeader("content-type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("content-disposition", formatContentDisposition(filename));
    res.send(buffer);
  } catch (error: any) {
    console.error("PDF to Word conversion failed", error);
    const message = String(error?.message || "Conversion failed");
    if (
      message.includes("Could not find a Java Runtime Environment") ||
      message.includes("javaldx") ||
      message.includes("source file could not be loaded")
    ) {
      res.status(500).json({
        error:
          "PDF to Word requires a Java runtime for LibreOffice. Install Java and try again, or use an environment with LibreOffice Java support.",
      });
      return;
    }
    res.status(500).json({ error: message });
  }
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
