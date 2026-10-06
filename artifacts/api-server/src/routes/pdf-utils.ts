import { PDFDocument } from "pdf-lib";
export { parsePageList } from "@workspace/pdf-pages";

const VALID_ROTATIONS = new Set([0, 90, 180, 270]);

export function isPdfFile(file: Express.Multer.File | undefined): file is Express.Multer.File {
  if (!file || !file.originalname) return false;
  const ext = file.originalname.toLowerCase().split(".").pop();
  return ext === "pdf";
}

export function buildDefaultPageOrder(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

export function parseSingleRotationValue(raw: unknown): number {
  if (raw == null) {
    return 0;
  }

  let value: number;
  if (typeof raw === "number") {
    value = Math.trunc(raw);
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") {
      return 0;
    }
    if (!/^-?\d+$/.test(trimmed)) {
      throw new Error(`rotation must be one of 0, 90, 180, or 270`);
    }
    value = parseInt(trimmed, 10);
  } else {
    throw new Error("rotation must be one of 0, 90, 180, or 270");
  }

  if (!VALID_ROTATIONS.has(value)) {
    throw new Error("rotation must be one of 0, 90, 180, or 270");
  }

  return value;
}

export function parseRotationValues(raw: unknown, expectedLength: number): number[] {
  if (raw == null) {
    return Array(expectedLength).fill(0);
  }

  const values: unknown[] = [];
  if (Array.isArray(raw)) {
    values.push(...raw);
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") {
      return Array(expectedLength).fill(0);
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          values.push(...parsed);
        } else {
          throw new Error("pageRotations must be an array");
        }
      } catch {
        values.push(...trimmed.split(/[,;]+/).map((value) => value.trim()).filter(Boolean));
      }
    } else {
      values.push(...trimmed.split(/[,;]+/).map((value) => value.trim()).filter(Boolean));
    }
  } else if (typeof raw === "number") {
    values.push(raw);
  } else {
    throw new Error("pageRotations must be an array or comma-separated list");
  }

  if (values.length !== expectedLength) {
    throw new Error(`pageRotations must contain ${expectedLength} values`);
  }

  return values.map((value, index) => {
    let rotation: number;
    if (typeof value === "number") {
      rotation = Math.trunc(value);
    } else if (typeof value === "string") {
      const trimmed = value.trim();
      if (!/^-?\d+$/.test(trimmed)) {
        throw new Error(`pageRotations[${index}] is invalid: ${trimmed}`);
      }
      rotation = parseInt(trimmed, 10);
    } else {
      throw new Error(`pageRotations[${index}] is invalid`);
    }

    if (!VALID_ROTATIONS.has(rotation)) {
      throw new Error(`pageRotations[${index}] must be one of 0, 90, 180, or 270`);
    }

    return rotation;
  });
}

export function preservePdfMetadata(source: PDFDocument, target: PDFDocument): void {
  const title = source.getTitle();
  const author = source.getAuthor();
  const subject = source.getSubject();
  const keywords = source.getKeywords();
  const producer = source.getProducer();
  const creator = source.getCreator();
  const creationDate = source.getCreationDate();
  const modificationDate = source.getModificationDate();

  if (title != null) target.setTitle(title);
  if (author != null) target.setAuthor(author);
  if (subject != null) target.setSubject(subject);
  if (keywords != null) target.setKeywords(Array.isArray(keywords) ? keywords : [keywords]);
  if (producer != null) target.setProducer(producer);
  if (creator != null) target.setCreator(creator);
  if (creationDate != null) target.setCreationDate(creationDate);
  if (modificationDate != null) target.setModificationDate(modificationDate);
}

export async function loadPdf(buffer: Buffer): Promise<PDFDocument> {
  return PDFDocument.load(buffer);
}
