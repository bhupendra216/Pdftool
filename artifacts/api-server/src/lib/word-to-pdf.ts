import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import { PDFDocument } from "pdf-lib";
import { logger } from "./logger";

const MAX_WORD_FILE_BYTES = 50 * 1024 * 1024;
const MAX_ACTIVE_CONVERSIONS = 2;
const MAX_QUEUED_CONVERSIONS = 10;
const CONVERSION_TIMEOUT_MS = 60_000;

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOC_LEGACY_HEADER = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

export class InvalidWordDocumentError extends Error {
  constructor() {
    super("This is not a valid Word document.");
    this.name = "InvalidWordDocumentError";
  }
}

export class LibreOfficeUnavailableError extends Error {
  constructor() {
    super("Word to PDF is temporarily unavailable.");
    this.name = "LibreOfficeUnavailableError";
  }
}

export class LibreOfficeBusyError extends Error {
  constructor() {
    super("Word to PDF is busy. Please try again shortly.");
    this.name = "LibreOfficeBusyError";
  }
}

export class LibreOfficeTimeoutError extends Error {
  constructor() {
    super("Word to PDF conversion timed out. Please try a smaller document.");
    this.name = "LibreOfficeTimeoutError";
  }
}

type LibreOfficeAvailability = "available" | "unavailable" | "checking";

let availability: LibreOfficeAvailability = "checking";
let availabilityCheck: Promise<boolean> | undefined;
let activeConversions = 0;
const conversionQueue: Array<() => void> = [];

function sofficeBinary() {
  return process.env.SOFFICE_BINARY || "soffice";
}

export function isWordDocumentArchive(buffer: Buffer): boolean {
  if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    return false;
  }

  const endRecordSignature = 0x06054b50;
  const centralDirectorySignature = 0x02014b50;
  const minEndRecordLength = 22;
  const searchStart = Math.max(0, buffer.length - 65_557);
  let endRecordOffset = -1;

  for (let offset = buffer.length - minEndRecordLength; offset >= searchStart; offset -= 1) {
    if (buffer.readUInt32LE(offset) === endRecordSignature) {
      endRecordOffset = offset;
      break;
    }
  }
  if (endRecordOffset < 0) return false;

  const entries = buffer.readUInt16LE(endRecordOffset + 10);
  let entryOffset = buffer.readUInt32LE(endRecordOffset + 16);
  if (entryOffset >= buffer.length) return false;

  for (let entry = 0; entry < entries; entry += 1) {
    if (
      entryOffset + 46 > buffer.length ||
      buffer.readUInt32LE(entryOffset) !== centralDirectorySignature
    ) {
      return false;
    }

    const nameLength = buffer.readUInt16LE(entryOffset + 28);
    const extraLength = buffer.readUInt16LE(entryOffset + 30);
    const commentLength = buffer.readUInt16LE(entryOffset + 32);
    const nameStart = entryOffset + 46;
    const nameEnd = nameStart + nameLength;
    if (nameEnd > buffer.length) return false;

    if (buffer.toString("utf8", nameStart, nameEnd) === "word/document.xml") {
      return true;
    }

    entryOffset = nameEnd + extraLength + commentLength;
  }

  return false;
}

export function validateWordDocument(filename: string, buffer: Buffer): void {
  if (!buffer.length || buffer.length > MAX_WORD_FILE_BYTES) {
    throw new InvalidWordDocumentError();
  }

  const extension = path.extname(filename).toLowerCase();
  if (extension === ".docx") {
    if (!isWordDocumentArchive(buffer)) throw new InvalidWordDocumentError();
    return;
  }

  if (extension === ".doc" && buffer.subarray(0, DOC_LEGACY_HEADER.length).equals(DOC_LEGACY_HEADER)) {
    return;
  }

  throw new InvalidWordDocumentError();
}

export function getLibreOfficeAvailability(): LibreOfficeAvailability {
  return availability;
}

export async function initializeLibreOfficeAvailability(): Promise<boolean> {
  if (!availabilityCheck) {
    availability = "checking";
    availabilityCheck = new Promise<boolean>((resolve) => {
      execFile(
        sofficeBinary(),
        ["--version"],
        { timeout: 10_000, maxBuffer: 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            availability = "unavailable";
            logger.error(
              { err: error, stderr: String(stderr || "").slice(0, 1000) },
              "LibreOffice is unavailable; Word to PDF conversion is disabled",
            );
            resolve(false);
            return;
          }

          availability = "available";
          logger.info(
            { version: String(stdout || "").trim().slice(0, 200) },
            "LibreOffice is available",
          );
          resolve(true);
        },
      );
    });
  }

  return availabilityCheck;
}

async function acquireConversionSlot(): Promise<() => void> {
  if (activeConversions < MAX_ACTIVE_CONVERSIONS) {
    activeConversions += 1;
  } else {
    if (conversionQueue.length >= MAX_QUEUED_CONVERSIONS) {
      throw new LibreOfficeBusyError();
    }
    await new Promise<void>((resolve) => conversionQueue.push(resolve));
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    const nextInQueue = conversionQueue.shift();
    if (nextInQueue) {
      nextInQueue();
    } else {
      activeConversions -= 1;
    }
  };
}

function runSoffice(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      sofficeBinary(),
      args,
      {
        timeout: CONVERSION_TIMEOUT_MS,
        killSignal: "SIGKILL",
        maxBuffer: 10 * 1024 * 1024,
        env: {
          ...process.env,
          HOME: process.env.HOME || os.tmpdir(),
        },
      },
      (error) => {
        if (!error) {
          resolve();
          return;
        }
        if (error.killed || error.code === "ETIMEDOUT") {
          reject(new LibreOfficeTimeoutError());
          return;
        }
        reject(error);
      },
    );
  });
}

export async function runLibreOfficeCommand(args: string[]): Promise<void> {
  if (!(await initializeLibreOfficeAvailability())) {
    throw new LibreOfficeUnavailableError();
  }

  const releaseSlot = await acquireConversionSlot();
  const uniqueId = randomUUID();
  let profileDir: string | undefined;

  try {
    profileDir = await mkdtemp(path.join(os.tmpdir(), `lo_${uniqueId}-`));
    await runSoffice([
      ...args.slice(0, 3),
      `-env:UserInstallation=${pathToFileURL(profileDir).href}`,
      ...args.slice(3),
    ]);
  } finally {
    if (profileDir) await rm(profileDir, { recursive: true, force: true });
    releaseSlot();
  }
}

export async function convertWordToPdf(
  filename: string,
  buffer: Buffer,
): Promise<{ buffer: Buffer; filename: string }> {
  if (!(await initializeLibreOfficeAvailability())) {
    throw new LibreOfficeUnavailableError();
  }

  validateWordDocument(filename, buffer);
  const uniqueId = randomUUID();
  let jobDir: string | undefined;
  try {
    jobDir = await mkdtemp(path.join(os.tmpdir(), `word-to-pdf-${uniqueId}-`));
    const extension = path.extname(filename).toLowerCase();
    const inputFile = path.join(jobDir, `input${extension}`);
    const outputFile = path.join(jobDir, "input.pdf");
    const outputName = `${path.basename(filename, extension) || "document"}.pdf`;

    await writeFile(inputFile, buffer);
    await runLibreOfficeCommand([
      "--headless",
      "--norestore",
      "--nolockcheck",
      "--convert-to",
      "pdf:writer_pdf_Export",
      "--outdir",
      jobDir,
      inputFile,
    ]);

    const outputStats = await stat(outputFile);
    if (!outputStats.isFile() || outputStats.size === 0) {
      throw new Error("LibreOffice did not produce a PDF.");
    }

    const outputBuffer = await readFile(outputFile);
    if (outputBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new Error("LibreOffice produced an invalid PDF.");
    }
    const outputPdf = await PDFDocument.load(outputBuffer);
    if (outputPdf.getPageCount() < 1) {
      throw new Error("LibreOffice produced an invalid PDF.");
    }
    return { buffer: outputBuffer, filename: outputName };
  } finally {
    if (jobDir) await rm(jobDir, { recursive: true, force: true });
  }
}
