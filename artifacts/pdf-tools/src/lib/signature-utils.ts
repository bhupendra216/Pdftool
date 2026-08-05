export type SignatureTarget = "current" | "all" | "pages";

export type SignatureItem = {
  id: number;
  pageNumber: number;
  target: SignatureTarget;
  targetPages: number[];
  x: number;
  y: number;
  width: number;
  height: number;
};

export function parseTargetPages(value: string, pageCount: number) {
  const normalizedValue = value.replace(/\s+/g, "");
  if (!normalizedValue) return [];

  const matches = new Set<number>();
  const segments = normalizedValue.split(",").filter(Boolean);

  for (const segment of segments) {
    if (!segment) continue;

    if (segment.includes("-")) {
      const [startText, endText] = segment.split("-", 2);
      const start = Number.parseInt(startText, 10);
      const end = Number.parseInt(endText, 10);
      if (!Number.isInteger(start) || !Number.isInteger(end)) continue;

      const startPage = Math.min(start, end);
      const endPage = Math.max(start, end);
      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
        if (pageNumber >= 1 && pageNumber <= pageCount) {
          matches.add(pageNumber);
        }
      }
      continue;
    }

    const pageNumber = Number.parseInt(segment, 10);
    if (Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      matches.add(pageNumber);
    }
  }

  return Array.from(matches).sort((left, right) => left - right);
}

export function isSignatureVisibleOnPage(signature: SignatureItem, pageNumber: number) {
  if (signature.target === "all") return true;
  if (signature.target === "pages") return signature.targetPages.includes(pageNumber);
  return signature.pageNumber === pageNumber;
}

export function filterSignaturesForPage(signatures: SignatureItem[], pageNumber: number) {
  return signatures.filter((signature) => isSignatureVisibleOnPage(signature, pageNumber));
}
