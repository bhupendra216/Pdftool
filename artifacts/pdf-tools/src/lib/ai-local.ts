import type { ExtractedPage, TextChunk } from "@/lib/pdf-extract";

export type SensitiveMatch = { type: string; value: string; page: number; itemIndex: number };
export type ReviewIssue = { category: string; severity: "low" | "medium" | "high"; page: number; quote: string; suggestion: string };

const words = (value: string) => value.toLowerCase().match(/[a-z0-9]{2,}/g) || [];

export function makeChunks(pages: ExtractedPage[], size = 200, overlap = 30): TextChunk[] {
  return pages.flatMap((page) => {
    const pageWords = page.text.split(/\s+/).filter(Boolean);
    const chunks: TextChunk[] = [];
    for (let start = 0; start < pageWords.length; start += Math.max(1, size - overlap)) {
      const text = pageWords.slice(start, start + size).join(" ");
      if (!text) break;
      chunks.push({ text, pageNumbers: [page.pageNumber] });
      if (start + size >= pageWords.length) break;
    }
    return chunks;
  });
}

export function bm25Search(chunks: TextChunk[], query: string, limit = 3): TextChunk[] {
  const queryTerms = words(query);
  let totalTerms = 0;
  for (const chunk of chunks) {
    totalTerms += words(chunk.text).length;
  }
  const averageLength = chunks.length ? totalTerms / chunks.length : 1;
  const documentFrequency = new Map<string, number>();

  for (const chunk of chunks) {
    const terms = new Set(words(chunk.text));
    for (const term of terms) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    }
  }

  const scored = chunks.map((chunk) => {
    const terms = words(chunk.text);
    const counts = new Map<string, number>();
    for (const term of terms) {
      counts.set(term, (counts.get(term) || 0) + 1);
    }

    let score: number = 0;
    for (const term of queryTerms) {
      const tf = counts.get(term) || 0;
      if (!tf) continue;
      const df = documentFrequency.get(term) || 0;
      const idf = Math.log(1 + (chunks.length - df + 0.5) / (df + 0.5));
      const denominator = tf + 1.5 * (0.25 + 0.75 * (terms.length / Math.max(1, averageLength)));
      score += idf * (tf * 2.5) / denominator;
    }

    return { chunk, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((entry) => entry.chunk);
}

export function textRank(sentences: Array<{ text: string; page: number }>, count: number): Array<{ text: string; page: number }> {
  const terms = sentences.map((sentence) => new Set(words(sentence.text)));
  const scores: number[] = sentences.map(() => 1);

  for (let pass = 0; pass < 8; pass += 1) {
    sentences.forEach((_sentence, index) => {
      let score: number = 0.15;
      sentences.forEach((_other, otherIndex) => {
        if (index === otherIndex) return;
        const intersection = [...terms[index]].filter((term) => terms[otherIndex].has(term)).length;
        const union = new Set([...terms[index], ...terms[otherIndex]]).size;
        if (intersection) {
          score += 0.85 * (intersection / union) * scores[otherIndex] / Math.max(1, sentences.length - 1);
        }
      });
      scores[index] = score;
    });
  }

  return sentences
    .map((sentence, index) => ({ sentence, score: scores[index], index }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.sentence);
}

function luhn(value: string) {
  const digits = value.replace(/\D/g, "");
  let sum = 0;
  let doubleDigit = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return digits.length >= 13 && sum % 10 === 0;
}

export function detectSensitive(pages: ExtractedPage[]): SensitiveMatch[] {
  const patterns: Array<[string, RegExp, (value: string) => boolean]> = [
    ["Email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, () => true],
    ["Phone", /(?:\+?\d[\d .()\-]{7,}\d)/g, () => true],
    ["Credit card", /\b(?:\d[ -]*?){13,19}\b/g, luhn],
    ["URL", /https?:\/\/[^\s]+/gi, () => true],
    ["ID number", /\b(?:SSN|VAT|passport|tax\s*id|citizenship)[:#]?\s*[A-Z0-9-]{4,}\b/gi, () => true],
    ["Date of birth", /\b(?:dob|date of birth)[:#-]?\s*[^\s]+(?:\s+[^\s]+)?/gi, () => true],
  ];

  return pages.flatMap((page) =>
    patterns.flatMap(([type, pattern, valid]) =>
      page.items.flatMap((item, itemIndex) => {
        pattern.lastIndex = 0;
        const match = item.str.match(pattern)?.[0];
        return match && valid(match) ? [{ type, value: match, page: page.pageNumber, itemIndex }] : [];
      }),
    ),
  );
}

export function reviewText(pages: ExtractedPage[], type: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const severityOrder = { high: 0, medium: 1, low: 2 } as const;

  pages.forEach((page) => {
    const sentences = page.text.split(/(?<=[.!?])\s+/).filter(Boolean);
    sentences.forEach((sentence) => {
      if (/\s{2,}/.test(sentence)) {
        issues.push({ category: "clarity", severity: "low", page: page.pageNumber, quote: sentence.slice(0, 140), suggestion: "Remove repeated spaces and check sentence boundaries." });
      }
      if (words(sentence).length > 35) {
        issues.push({ category: "clarity", severity: "medium", page: page.pageNumber, quote: sentence.slice(0, 140), suggestion: "Break this long sentence into shorter sentences." });
      }
      if (/\b(teh|recieve|seperate|occured)\b/i.test(sentence)) {
        issues.push({ category: "grammar", severity: "medium", page: page.pageNumber, quote: sentence.slice(0, 140), suggestion: "Check the spelling of the highlighted word." });
      }
      if (/[.!?]\s+[a-z]/.test(sentence)) {
        issues.push({ category: "grammar", severity: "low", page: page.pageNumber, quote: sentence.slice(0, 140), suggestion: "Start each sentence with a capital letter." });
      }
    });
  });

  if (type === "Resume" && !/\b(email|phone|linkedin|skills|education)\b/i.test(pages.map((page) => page.text).join(" "))) {
    issues.push({ category: "missing", severity: "medium", page: 1, quote: "Resume sections", suggestion: "Check that contact information, skills, and education are present." });
  }

  return issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export function sentencesFromPages(pages: ExtractedPage[]) {
  return pages.flatMap((page) =>
    page.text
      .split(/(?<=[.!?])\s+/)
      .filter((text) => text.length > 30)
      .map((text) => ({ text, page: page.pageNumber })),
  );
}

export function makeRuleQuiz(pages: ExtractedPage[], count: number) {
  return sentencesFromPages(pages)
    .slice(0, count)
    .map((sentence) => ({
      question: "What is the main point of this passage?",
      answer: sentence.text,
      explanation: `Source passage from page ${sentence.page}.`,
      page_reference: sentence.page,
    }));
}

export function makeCitation(metadata: { title: string; authors: string; year: string; doi?: string }, format: "APA" | "MLA" | "IEEE" | "BibTeX") {
  const title = metadata.title || "Untitled paper";
  const authors = metadata.authors || "Unknown author";
  const year = metadata.year || "n.d.";

  if (format === "MLA") return `${authors}. "${title}." ${year}.`;
  if (format === "IEEE") return `${authors}, "${title}," ${year}.`;
  if (format === "BibTeX") return `@article{pdfkira${year}, title={${title}}, author={${authors}}, year={${year}}${metadata.doi ? `, doi={${metadata.doi}}` : ""}}`;
  return `${authors} (${year}). ${title}.${metadata.doi ? ` https://doi.org/${metadata.doi}` : ""}`;
}
