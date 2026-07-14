import { Router } from "express";
import multer from "multer";
import { mkdtemp, rm, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { spawn } from "node:child_process";
// import tesseract dynamically below to avoid mismatched types at build time
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });
const router = Router();

const SUPPORTED_IMAGE = new Set([".png", ".jpg", ".jpeg"]);
const SUPPORTED_PDF = new Set([".pdf"]);

async function pdfToImagesBuffers(pdfBuffer: Buffer, tempDir: string) {
  // Use pdftoppm to convert PDF pages to JPEGs
  const inputPath = path.join(tempDir, "input.pdf");
  await writeFile(inputPath, pdfBuffer);
  const outputPrefix = path.join(tempDir, "page");

  await new Promise<void>((resolve, reject) => {
    execFile(
      "pdftoppm",
      ["-jpeg", "-r", "300", inputPath, outputPrefix],
      { timeout: 120_000, maxBuffer: 50 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`pdftoppm failed: ${error.message} ${stderr || ""} ${stdout || ""}`));
          return;
        }
        resolve();
      },
    );
  });

  const files = await readdir(tempDir);
  const images = files.filter((f) => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg") || f.toLowerCase().endsWith(".png"));
  const buffers = [] as Buffer[];
  for (const img of images.sort()) {
    const p = path.join(tempDir, img);
    buffers.push(await import("node:fs/promises").then((m) => m.readFile(p)));
  }
  return buffers;
}

async function preprocessImage(buffer: Buffer) {
  // Auto-rotate, grayscale, enhance contrast, denoise-ish
  let img = sharp(buffer, { limitInputPixels: false }).rotate();
  img = img.grayscale().normalize().sharpen().median(1);
  return await img.jpeg({ quality: 90 }).toBuffer();
}

router.post("/ocr-image-to-text", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!SUPPORTED_IMAGE.has(ext) && !SUPPORTED_PDF.has(ext)) {
    res.status(400).json({ error: "Unsupported file type. Upload PNG, JPG, JPEG or PDF." });
    return;
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "ocr-"));

  try {
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
      // ignore if setParameters isn't available on this runtime
    }

    let imageBuffers: Buffer[] = [];
    if (SUPPORTED_PDF.has(ext)) {
      imageBuffers = await pdfToImagesBuffers(file.buffer, tempDir);
    } else {
      imageBuffers = [file.buffer];
    }

    const results: { text: string; confidence?: number }[] = [];

    for (const buf of imageBuffers) {
      const pre = await preprocessImage(buf).catch(() => buf);
      const { data } = await worker.recognize(pre);
      results.push({ text: data?.text || "", confidence: data?.confidences ? averageConfidence(data.confidences) : data?.confidence });
    }

    await worker.terminate();

    const combinedText = results.map((r) => r.text).join("\n\n");
    const avgConf = results.filter((r) => typeof r.confidence === "number").map((r) => r.confidence as number);
    const confidence = avgConf.length ? Math.round((avgConf.reduce((a, b) => a + b, 0) / avgConf.length) * 100) / 100 : undefined;

    res.json({ text: combinedText, confidence, pages: results.length });
  } catch (error: any) {
    console.error("OCR failed", error);
    res.status(500).json({ error: String(error?.message || "OCR processing failed") });
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});

function averageConfidence(confMap: any) {
  // tesseract.js may provide per-block confidences; fall back safely
  try {
    const arr = Object.values(confMap).map((v: any) => Number(v || 0));
    if (!arr.length) return undefined;
    return arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
  } catch {
    return undefined;
  }
}

export default router;
