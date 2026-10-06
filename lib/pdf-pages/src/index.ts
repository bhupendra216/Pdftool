export type PageListOptions = {
  allowDuplicates?: boolean;
  required?: boolean;
};

type RemovablePdf = {
  getPageCount(): number;
  removePage(index: number): void;
};

function validateTotalPages(totalPages: number): void {
  if (!Number.isSafeInteger(totalPages) || totalPages < 1) {
    throw new Error("Total pages must be a positive integer");
  }
}

function pageNumberToIndex(value: unknown, totalPages: number, fieldName: string): number {
  let pageNumber: number;

  if (typeof value === "number") {
    pageNumber = value;
  } else if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    pageNumber = Number(value.trim());
  } else {
    throw new Error(`${fieldName} contains an invalid page number`);
  }

  if (!Number.isSafeInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    throw new Error(`${fieldName} contains an invalid page number: ${pageNumber}. The PDF has ${totalPages} pages.`);
  }

  return pageNumber - 1;
}

export function parsePageRanges(input: string, totalPages: number): number[] {
  validateTotalPages(totalPages);
  if (typeof input !== "string" || input.trim() === "") throw new Error("Empty input");

  const indices = new Set<number>();
  for (const rawPart of input.split(",")) {
    const part = rawPart.trim();
    if (!part) throw new Error("Invalid syntax");

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) throw new Error("Invalid syntax");
      if (start < 1) throw new Error("Page numbers must be >= 1");
      if (end < start) throw new Error("Range start must be <= range end");
      if (end > totalPages) throw new Error("Page number exceeds total pages");
      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        indices.add(pageNumber - 1);
      }
      continue;
    }

    if (!/^\d+$/.test(part)) throw new Error("Invalid syntax");
    indices.add(pageNumberToIndex(part, totalPages, "Page range"));
  }

  return Array.from(indices);
}

export function parsePageList(
  raw: unknown,
  totalPages: number,
  fieldName: string,
  options: PageListOptions = {},
): number[] {
  validateTotalPages(totalPages);
  const { allowDuplicates = true, required = false } = options;
  const values: unknown[] = [];

  if (raw == null) {
    if (required) throw new Error(`${fieldName} is required`);
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
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) values.push(...parsed);
        else values.push(parsed);
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

  const pageIndices = values
    .filter((value) => value != null && value !== "")
    .map((value) => pageNumberToIndex(value, totalPages, fieldName));

  if (required && pageIndices.length === 0) {
    throw new Error(`${fieldName} is required`);
  }

  return allowDuplicates ? pageIndices : Array.from(new Set(pageIndices));
}

export function removePdfPagesByIndex(pdf: RemovablePdf, pageIndices: number[]): void {
  const totalPages = pdf.getPageCount();
  const indices = new Set(pageIndices);

  if (indices.size === 0) throw new Error("At least one page must be selected for deletion.");
  if (indices.size >= totalPages) throw new Error("Cannot delete all pages from the PDF.");
  for (const index of indices) {
    if (!Number.isSafeInteger(index) || index < 0 || index >= totalPages) {
      throw new Error(`Page index must be between 0 and ${totalPages - 1}.`);
    }
  }

  Array.from(indices)
    .sort((left, right) => right - left)
    .forEach((index) => pdf.removePage(index));
}
