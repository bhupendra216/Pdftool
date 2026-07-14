import { PDFDocument } from "pdf-lib";

const VALID_ROTATIONS = new Set([0, 90, 180, 270]);

export function isPdfFile(file: Express.Multer.File | undefined): file is Express.Multer.File {
  if (!file || !file.originalname) return false;
  const ext = file.originalname.toLowerCase().split(".").pop();
  return ext === "pdf";
}

export function buildDefaultPageOrder(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

export function parsePageList(
  raw: unknown,
  totalPages: number,
  fieldName: string,
  options: { allowDuplicates?: boolean; required?: boolean } = {},
): number[] {
  const { allowDuplicates = true, required = false } = options;
  const values: unknown[] = [];

  if (raw == null) {
    if (required) {
      throw new Error(`${fieldName} is required`);
    }
    return [];
  }

  if (Array.isArray(raw)) {
    values.push(...raw);
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") {
      if (required) throw new Error(`${fieldName} is required`);
      return [];
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          values.push(...parsed);
        } else {
          values.push(parsed);
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
    values.push(String(raw));
  }

  const pageIndices: number[] = [];
  for (const value of values) {
    if (value == null || value === "") continue;

    let pageNumber: number;

    if (typeof value === "number") {
      pageNumber = Math.trunc(value);
    } else if (typeof value === "string") {
      const trimmed = value.trim();
      if (!/^-?\d+$/.test(trimmed)) {
        throw new Error(`${fieldName} contains an invalid page number: ${trimmed}`);
      }
      pageNumber = parseInt(trimmed, 10);
    } else {
      throw new Error(`${fieldName} contains an invalid page number`);
    }

    if (Number.isNaN(pageNumber)) {
      throw new Error(`${fieldName} contains an invalid page number`);
    }

    if (pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`${fieldName} contains an invalid page number: ${pageNumber}. The PDF has ${totalPages} pages.`);
    }

    pageIndices.push(pageNumber - 1);
  }

  if (required && pageIndices.length === 0) {
    throw new Error(`${fieldName} is required`);
  }

  return allowDuplicates ? pageIndices : Array.from(new Set(pageIndices));
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
