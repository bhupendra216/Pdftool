import type { FeatureExtractionPipeline, ProgressInfo } from "@huggingface/transformers";
import type { LabTextChunk } from "./pdf";
import { fitLabChunksToTokenLimit, rankHybrid } from "./retrieval";
import { EMBEDDING_MODEL } from "./modelCatalog";

type Request =
  | { type: "index"; chunks: LabTextChunk[] }
  | { type: "search"; query: string }
  | { type: "clear" };

type Response =
  | { type: "download-progress"; progress: number; loaded: number; total: number }
  | { type: "index-progress"; completed: number; total: number }
  | { type: "indexed"; chunks: LabTextChunk[]; embeddingMsPerChunk: number; totalMs: number }
  | { type: "results"; results: ReturnType<typeof rankHybrid>; relevant: boolean; retrievalMs: number }
  | { type: "cleared" }
  | { type: "error"; message: string };

let embedder: FeatureExtractionPipeline | undefined;
let indexedChunks: LabTextChunk[] = [];
let vectors: Float32Array[] = [];

function post(response: Response) {
  self.postMessage(response);
}

function tokenCount(text: string): number {
  if (!embedder) throw new Error("The embedding model is not loaded.");
  const ids = embedder.tokenizer(text, { truncation: false }).input_ids;
  return ids.dims[ids.dims.length - 1] ?? ids.data.length;
}

async function loadEmbedder() {
  if (embedder) return embedder;
  const transformers = await import("@huggingface/transformers");
  transformers.env.cacheKey = "ask-pdf-ai-transformers-cache";
  if (transformers.env.backends.onnx.wasm) {
    transformers.env.backends.onnx.wasm.numThreads = 1;
  }
  embedder = await transformers.pipeline("feature-extraction", EMBEDDING_MODEL.id, {
    device: "wasm",
    dtype: "q4f16",
    progress_callback: (info: ProgressInfo) => {
      if (info.status === "progress_total") {
        post({
          type: "download-progress",
          progress: info.progress,
          loaded: info.loaded,
          total: info.total,
        });
      }
    },
  });
  return embedder;
}

async function embedTexts(texts: string[]) {
  const pipeline = await loadEmbedder();
  const output = await pipeline(texts, { pooling: "mean", normalize: true });
  const width = output.dims[output.dims.length - 1] ?? 0;
  if (!width) throw new Error("The embedding model returned an empty vector.");
  return Array.from({ length: texts.length }, (_, index) => {
    const start = index * width;
    return new Float32Array(Array.from(output.data.slice(start, start + width), Number));
  });
}

self.onmessage = async (event: MessageEvent<Request>) => {
  try {
    const request = event.data;
    if (request.type === "clear") {
      indexedChunks = [];
      vectors = [];
      await embedder?.dispose();
      embedder = undefined;
      post({ type: "cleared" });
      return;
    }

    if (request.type === "index") {
      await loadEmbedder();
      const chunks = fitLabChunksToTokenLimit(
        request.chunks,
        EMBEDDING_MODEL.maxTokens - 12,
        tokenCount,
      );
      indexedChunks = chunks;
      vectors = [];
      const started = performance.now();
      const batchSize = 16;
      for (let start = 0; start < chunks.length; start += batchSize) {
        const batch = chunks.slice(start, start + batchSize);
        vectors.push(...await embedTexts(batch.map((chunk) => chunk.text)));
        const completed = Math.min(start + batch.length, chunks.length);
        post({ type: "index-progress", completed, total: chunks.length });
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
      const totalMs = performance.now() - started;
      post({
        type: "indexed",
        chunks,
        embeddingMsPerChunk: chunks.length ? totalMs / chunks.length : 0,
        totalMs,
      });
      return;
    }

    if (!embedder || !indexedChunks.length || vectors.length !== indexedChunks.length) {
      throw new Error("Enable smart search and wait for indexing before searching.");
    }
    const started = performance.now();
    const [queryVector] = await embedTexts([request.query]);
    if (!queryVector) throw new Error("The query embedding was empty.");
    const results = rankHybrid(indexedChunks, request.query, queryVector, vectors);
    post({
      type: "results",
      results,
      relevant: results.some((result) => result.lexicalScore > 0 || (result.cosineScore ?? 0) >= 0.25),
      retrievalMs: performance.now() - started,
    });
  } catch (error) {
    post({
      type: "error",
      message: error instanceof Error ? error.message : "The on-device model operation failed.",
    });
  }
};
