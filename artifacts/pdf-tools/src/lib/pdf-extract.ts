import { validatePdfFile } from "@/lib/client-pdf";
import * as pdfjsLib from "pdfjs-dist";

export type TextItem = {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
};

export type ExtractedPage = {
  pageNumber: number;
  text: string;
  items: TextItem[];
};

export type ExtractResult = { pages: ExtractedPage[] };

export type TextChunk = {
  text: string;
  pageNumbers: number[];
};

export async function extractPdfText(
  file: File,
  onProgress?: (message: string) => void,
  options: {
    signal?: AbortSignal;
    password?: string;
    pageRange?: { start: number; end: number };
  } = {},
): Promise<ExtractResult> {
  validatePdfFile(file);
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({
    data,
    password: options.password,
  });
  try {
    const pdf = await loadingTask.promise;
    const pages: ExtractedPage[] = [];
    const start = Math.max(1, options.pageRange?.start || 1);
    const end = Math.min(pdf.numPages, options.pageRange?.end || pdf.numPages);

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      if (options.signal?.aborted)
        throw new DOMException("Operation cancelled", "AbortError");
      onProgress?.(`Reading page ${pageNumber}/${end}`);
      const page = await pdf.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        const items = content.items
          .filter(
            (
              item,
            ): item is typeof item & {
              str: string;
              transform: number[];
              width: number;
              height: number;
            } => "str" in item,
          )
          .map((item) => {
            const transform = item.transform || [1, 0, 0, 1, 0, 0];
            const fontSize = Math.max(
              1,
              Math.sqrt((transform[0] || 0) ** 2 + (transform[1] || 0) ** 2),
            );
            return {
              str: item.str,
              x: transform[4] || 0,
              y: transform[5] || 0,
              w: item.width || 0,
              h: item.height || fontSize,
              fontSize,
            };
          });
        const text = items
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        pages.push({ pageNumber, items, text });
      } finally {
        page.cleanup();
      }
    }

    return { pages };
  } finally {
    await loadingTask.destroy();
  }
}

export function chunkPages(
  pages: ExtractedPage[],
  chunkWords = 500,
  overlapWords = 50,
): TextChunk[] {
  const chunks: TextChunk[] = [];
  for (const page of pages) {
    const words = page.text.split(/\s+/).filter(Boolean);
    for (
      let start = 0;
      start < words.length;
      start += Math.max(1, chunkWords - overlapWords)
    ) {
      const text = words.slice(start, start + chunkWords).join(" ");
      if (!text) break;
      chunks.push({ text, pageNumbers: [page.pageNumber] });
      if (start + chunkWords >= words.length) break;
    }
  }
  return chunks;
}

export function findRelevantChunks(
  chunks: TextChunk[],
  question: string,
  limit = 5,
) {
  const query = new Set(
    question
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 2),
  );
  return chunks
    .map((chunk) => {
      const words = chunk.text.toLowerCase().split(/\W+/);
      const score = words.reduce(
        (total, word) => total + (query.has(word) ? 1 : 0),
        0,
      );
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => chunk);
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
