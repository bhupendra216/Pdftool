export const EMBEDDING_MODEL = {
  id: "Xenova/bge-small-en-v1.5",
  sizeBytes: 37_134_249,
  maxTokens: 512,
  license: "MIT",
  languages: "English",
} as const;

export const GENERATION_MODELS = [
  {
    id: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
    sizeBytes: 966_375_820,
    vramRequiredMb: 1_774.19,
    contextWindowSize: 4096,
    license: "Apache-2.0",
  },
  {
    id: "Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC",
    sizeBytes: 1_946_447_243,
    vramRequiredMb: 2_863.69,
    contextWindowSize: 4096,
    license: "Apache-2.0",
  },
] as const;

export const MAX_OUTPUT_TOKENS = 256;
export const GENERATION_TIMEOUT_MS = 90_000;
export const MODEL_LOAD_TIMEOUT_MS = 15 * 60_000;
