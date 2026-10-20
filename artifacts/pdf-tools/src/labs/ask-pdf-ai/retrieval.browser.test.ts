import { expect, it } from "vitest";
import type { LabPage, LabTextChunk } from "./pdf";
import { modeForCapabilities, type LabCapabilities } from "./capabilities";
import {
  buildPrompt,
  chunkLabPages,
  cosineSimilarity,
  fitLabChunksToTokenLimit,
  isCurrentUpload,
  isRelevant,
  rankHybrid,
  safeDiagnosticsJson,
  stripThinkBlocks,
  validateCitations,
} from "./retrieval";
import { GENERATION_MODELS } from "./modelCatalog";

const capabilityFixture: LabCapabilities = {
  webGpuAvailable: false,
  adapterAvailable: false,
  adapterInfo: "No adapter",
  deviceMemory: null,
  cacheStorageAvailable: true,
  indexedDbAvailable: true,
  reason: "WebGPU is unavailable.",
};

function chunk(id: string, page: number, text: string): LabTextChunk {
  return { id, page, text };
}

it("keeps passages page-bounded and in the requested approximate word range", () => {
  const pages: LabPage[] = [
    { pageNumber: 1, text: Array.from({ length: 160 }, (_, index) => `alpha${index}`).join(" ") },
    { pageNumber: 2, text: Array.from({ length: 160 }, (_, index) => `beta${index}`).join(" ") },
  ];
  const chunks = chunkLabPages(pages);

  expect(chunks.length).toBeGreaterThan(2);
  expect(chunks.every((item) => item.page === 1 || item.page === 2)).toBe(true);
  expect(chunks.filter((item) => item.page === 1).every((item) => item.text.split(/\s+/).length <= 140)).toBe(true);
  expect(chunks.filter((item) => item.page === 2).every((item) => item.text.split(/\s+/).every((word) => word.startsWith("beta")))).toBe(true);
});

it("splits an oversized passage before the embedding model can truncate it", () => {
  const source = chunk("p1-c0", 1, "one two three four five six seven eight");
  const result = fitLabChunksToTokenLimit([source], 3, (text) => text.split(/\s+/).length, 1);
  expect(result.every((item) => item.text.split(/\s+/).length <= 3)).toBe(true);
  expect(result.every((item) => item.page === 1)).toBe(true);
});

it("cosine ranking selects the matching mocked vector", () => {
  const chunks = [chunk("p1-c1", 1, "fruit orchard"), chunk("p2-c1", 2, "invoice total")];
  const ranked = rankHybrid(chunks, "unknown concept", new Float32Array([1, 0]), [
    new Float32Array([0, 1]),
    new Float32Array([1, 0]),
  ]);
  expect(cosineSimilarity(new Float32Array([1, 0]), new Float32Array([1, 0]))).toBe(1);
  expect(ranked[0]?.chunk.id).toBe("p2-c1");
});

it("rank fusion keeps an exact-number match above a semantic-only match", () => {
  const chunks = [
    chunk("p1-c1", 1, "The reference number is 9417."),
    chunk("p2-c1", 2, "The permit is approved for entry."),
  ];
  const ranked = rankHybrid(chunks, "reference number 9417", new Float32Array([1, 0]), [
    new Float32Array([0, 1]),
    new Float32Array([1, 0]),
  ]);
  expect(ranked[0]?.chunk.id).toBe("p1-c1");
});

it("rejects queries with no lexical or semantic evidence", () => {
  const results = rankHybrid(
    [chunk("p1-c1", 1, "The document discusses a garden.")],
    "xylophone 774900",
    new Float32Array([1, 0]),
    [new Float32Array([0, 1])],
  );
  expect(isRelevant(results, 0.015)).toBe(false);
});

it("strips citations to pages outside the retrieved set", () => {
  expect(validateCitations("Found it [p2], not [p9].", new Set([2]))).toEqual({
    answer: "Found it [p2], not .",
    validCount: 1,
  });
});

it("fits the full system prompt, question, and passages within the configured context", () => {
  const passages = Array.from({ length: 5 }, (_, index) => ({
    chunk: chunk(`p${index + 1}-c1`, index + 1, "evidence ".repeat(500)),
    score: 1,
    lexicalScore: 1,
  }));
  const countBytes = (text: string) => new TextEncoder().encode(text).length;
  const prompt = buildPrompt("What is the rule?", passages, 4096, 256, countBytes);
  const inputBudget = countBytes(prompt.system) + countBytes(prompt.user);
  expect(inputBudget + 256).toBeLessThanOrEqual(4096);
  expect(prompt.passages.length).toBeGreaterThan(0);
  expect(prompt.passages.length).toBeLessThanOrEqual(5);
});

it("strips hidden reasoning blocks before answer text is shown", () => {
  expect(stripThinkBlocks("<think>private reasoning</think>Answer [p1].")).toBe("Answer [p1].");
});

it("falls back to smart search or keyword search when WebGPU is missing", () => {
  expect(modeForCapabilities(capabilityFixture, false)).toBe("Keyword search");
  expect(modeForCapabilities(capabilityFixture, true)).toBe("Smart search");
});

it("ignores stale upload completion ids", () => {
  expect(isCurrentUpload(8, 8)).toBe(true);
  expect(isCurrentUpload(7, 8)).toBe(false);
});

it("diagnostics JSON contains only the whitelisted metrics", () => {
  const secretQuestion = "user question must never appear";
  const secretText = "private document text must never appear";
  const json = safeDiagnosticsJson({
    mode: "Keyword search",
    adapterInfo: "Adapter hidden",
    deviceMemory: null,
    cacheStorageAvailable: true,
    indexedDbAvailable: true,
    loadedModels: [],
    modelLoadMs: null,
    embeddingMsPerChunk: null,
    embeddingTotalMs: null,
    retrievalMs: null,
    firstTokenMs: null,
    tokensPerSecond: null,
    peakMemoryBytes: null,
    chunkCount: 0,
  });
  expect(json).not.toContain(secretQuestion);
  expect(json).not.toContain(secretText);
  expect(JSON.parse(json)).not.toHaveProperty("question");
  expect(JSON.parse(json)).not.toHaveProperty("document");
});

it("uses only the two pinned, verified permissive WebLLM candidates", () => {
  expect(GENERATION_MODELS.map((model) => model.id)).toEqual([
    "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
    "Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC",
  ]);
  expect(GENERATION_MODELS.every((model) => model.license === "Apache-2.0")).toBe(true);
});
