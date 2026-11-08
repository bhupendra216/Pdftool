import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { fork } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import { getSingleUploadedFile } from "./upload-shape";
import { logger } from "../lib/logger";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_CONCURRENT_JOBS = 2;
const OCR_TIMEOUT_MS = 30_000;
const OCR_WORKER_MEMORY_MB = 256;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 10 },
});
const router = Router();
let activeOcrJobs = 0;

type OcrFileType = "image" | "pdf";
type OcrWorkerMessage =
  | { ok: true; text: string; confidence?: number; pages: number }
  | { ok: false; code: "BAD_INPUT" | "PROCESSING"; message: string };

class OcrTimeoutError extends Error {}

class OcrWorkerError extends Error {
  constructor(
    message: string,
    readonly code: "BAD_INPUT" | "PROCESSING",
  ) {
    super(message);
  }
}

function isSupportedInput(buffer: Buffer): OcrFileType | null {
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "pdf";
  }
  if (
    (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
    (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) ||
    (buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP") ||
    (buffer.length >= 2 && buffer.subarray(0, 2).toString("ascii") === "BM") ||
    (buffer.length >= 4 &&
      (buffer.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2a, 0x00])) ||
        buffer.subarray(0, 4).equals(Buffer.from([0x4d, 0x4d, 0x00, 0x2a]))))
  ) {
    return "image";
  }
  return null;
}

function runOcrInChild(
  buffer: Buffer,
  fileType: OcrFileType,
  tempDir?: string,
): Promise<OcrWorkerMessage> {
  return new Promise((resolve, reject) => {
    const workerPath = fileURLToPath(new URL("./routes/ocr-worker.mjs", import.meta.url));
    const child = fork(workerPath, [], {
      execArgv: [`--max-old-space-size=${OCR_WORKER_MEMORY_MB}`],
      serialization: "advanced",
      stdio: ["ignore", "ignore", "pipe", "ipc"],
    });
    let settled = false;

    const finish = (error?: Error, result?: OcrWorkerMessage) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else if (result) resolve(result);
      else reject(new Error("OCR worker returned no result"));
    };

    child.stderr?.on("data", (chunk: Buffer) => {
      logger.error({ workerStderr: chunk.toString("utf8").slice(0, 2000) }, "OCR worker diagnostic");
    });
    child.once("error", (error) => finish(error));
    child.once("message", (message: OcrWorkerMessage) => {
      if (message?.ok) {
        finish(undefined, message);
      } else if (message && message.ok === false) {
        finish(new OcrWorkerError(message.message, message.code));
      } else {
        finish(new Error("OCR worker returned an invalid response"));
      }
    });
    child.once("exit", (code, signal) => {
      if (!settled) {
        finish(new Error(`OCR worker exited without a result (code=${code}, signal=${signal})`));
      }
    });

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      finish(new OcrTimeoutError("OCR processing timed out"));
    }, OCR_TIMEOUT_MS);
    timeout.unref();

    child.send({ buffer, fileType, tempDir }, (error) => {
      if (error) finish(error);
    });
  });
}

function reserveOcrSlot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (activeOcrJobs >= MAX_CONCURRENT_JOBS) {
    res.status(503).json({ error: "OCR is busy. Please try again shortly." });
    return;
  }

  activeOcrJobs += 1;
  let released = false;
  const releaseSlot = () => {
    if (released) return;
    released = true;
    activeOcrJobs -= 1;
  };
  res.once("finish", releaseSlot);
  res.once("close", releaseSlot);

  upload.single("files")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    logger.warn({ err: error }, "OCR upload rejected");
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "The upload exceeds the 20 MB limit." });
      return;
    }
    if (error instanceof multer.MulterError) {
      res.status(400).json({ error: "Invalid upload." });
      return;
    }
    res.status(500).json({ error: "The upload could not be processed." });
  });
}

router.post("/ocr-image-to-text", reserveOcrSlot, async (req, res) => {
  let tempDir: string | undefined;
  try {
    const file = getSingleUploadedFile(req);
    if (!file || file.size === 0) {
      res.status(400).json({ error: "Upload a non-empty image or scanned PDF." });
      return;
    }

    const fileType = isSupportedInput(file.buffer);
    if (!fileType) {
      res.status(400).json({ error: "Unsupported file. Upload PNG, JPEG, WEBP, BMP, TIFF, or PDF." });
      return;
    }

    if (fileType === "pdf") {
      tempDir = await mkdtemp(path.join(os.tmpdir(), "ocr-"));
    }

    const result = await runOcrInChild(file.buffer, fileType, tempDir);
    if (!result.ok) {
      if (result.code === "BAD_INPUT") {
        res.status(400).json({ error: result.message });
        return;
      }
      logger.error({ workerMessage: result.message }, "OCR processing failed");
      res.status(500).json({ error: "OCR processing failed. Please try another file." });
      return;
    }

    res.json({
      text: result.text,
      confidence: result.confidence,
      pages: result.pages,
    });
  } catch (error) {
    if (error instanceof OcrTimeoutError) {
      logger.warn({ err: error }, "OCR processing timed out");
      res.status(504).json({ error: "OCR processing timed out. Please try a smaller file." });
      return;
    }
    if (error instanceof OcrWorkerError) {
      if (error.code === "BAD_INPUT") {
        res.status(400).json({ error: error.message });
        return;
      }
      logger.error({ err: error }, "OCR worker failed");
      res.status(500).json({ error: "OCR processing failed. Please try another file." });
      return;
    }
    logger.error({ err: error }, "OCR request failed");
    res.status(500).json({ error: "OCR processing failed. Please try again." });
  } finally {
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (error) {
        logger.error({ err: error }, "Failed to clean up OCR temporary files");
      }
    }
  }
});

export default router;
