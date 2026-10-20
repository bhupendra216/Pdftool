import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import type { LabCapabilities } from "./capabilities";
import { detectLabCapabilities, modeForCapabilities } from "./capabilities";
import { extractLabPdf, PasswordRequiredError, type LabPage, type LabTextChunk } from "./pdf";
import {
  buildPrompt,
  chunkLabPages,
  isCurrentUpload,
  isRelevant,
  rankHybrid,
  safeDiagnosticsJson,
  stripThinkBlocks,
  validateCitations,
  type RankedPassage,
  type SafeDiagnostics,
} from "./retrieval";
import { EMBEDDING_MODEL, GENERATION_MODELS, GENERATION_TIMEOUT_MS, MAX_OUTPUT_TOKENS, MODEL_LOAD_TIMEOUT_MS } from "./modelCatalog";

type EmbeddingResponse =
  | { type: "download-progress"; progress: number; loaded: number; total: number }
  | { type: "index-progress"; completed: number; total: number }
  | { type: "indexed"; chunks: LabTextChunk[]; embeddingMsPerChunk: number; totalMs: number }
  | { type: "results"; results: RankedPassage[]; relevant: boolean; retrievalMs: number }
  | { type: "cleared" }
  | { type: "error"; message: string };

type PendingEmbedding = {
  cancel: (reason: Error) => void;
};

const MINIMUM_RELEVANCE_SCORE = 0.015;
const NO_TEXT_MESSAGE = "No selectable text found. This PDF may be scanned or image-only; run it through the OCR PDF tool first.";

function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${bytes.toLocaleString()} bytes`;
  return `${(bytes / 1_000_000).toFixed(1)} MB (${(bytes / 1_073_741_824).toFixed(2)} GiB)`;
}

function conservativeTokenCount(text: string): number {
  return new TextEncoder().encode(text).length;
}

function isNoAnswer(answer: string): boolean {
  return answer.trim() === "Not found in this PDF.";
}

export function AskPdfAiLab() {
  const [capabilities, setCapabilities] = useState<LabCapabilities | null>(null);
  const [capabilityError, setCapabilityError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<LabPage[]>([]);
  const [chunks, setChunks] = useState<LabTextChunk[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [scanned, setScanned] = useState(false);
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<RankedPassage[]>([]);
  const [noRelevantPassage, setNoRelevantPassage] = useState(false);
  const [searching, setSearching] = useState(false);
  const [embeddingState, setEmbeddingState] = useState<"idle" | "loading" | "indexing" | "ready">("idle");
  const [embeddingProgress, setEmbeddingProgress] = useState<{ progress: number; loaded: number; total: number }>({
    progress: 0,
    loaded: 0,
    total: EMBEDDING_MODEL.sizeBytes,
  });
  const [indexProgress, setIndexProgress] = useState({ completed: 0, total: 0 });
  const [embeddingError, setEmbeddingError] = useState("");
  const [generationModelId, setGenerationModelId] = useState<string>(GENERATION_MODELS[0].id);
  const [generationState, setGenerationState] = useState<"idle" | "loading" | "generating" | "done" | "error">("idle");
  const [generationProgress, setGenerationProgress] = useState({ progress: 0, text: "" });
  const [generationError, setGenerationError] = useState("");
  const [answer, setAnswer] = useState("");
  const [citationWarning, setCitationWarning] = useState(false);
  const [generationMetrics, setGenerationMetrics] = useState({
    modelLoadMs: null as number | null,
    firstTokenMs: null as number | null,
    tokensPerSecond: null as number | null,
  });
  const [embeddingMetrics, setEmbeddingMetrics] = useState({
    msPerChunk: null as number | null,
    totalMs: null as number | null,
    retrievalMs: null as number | null,
  });
  const [peakMemoryBytes, setPeakMemoryBytes] = useState<number | null>(null);
  const [diagnosticsError, setDiagnosticsError] = useState("");
  const [diagnosticPrompt, setDiagnosticPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIdRef = useRef(0);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const embeddingWorkerRef = useRef<Worker | null>(null);
  const generationWorkerRef = useRef<Worker | null>(null);
  const generationEngineRef = useRef<import("@mlc-ai/web-llm").WebWorkerMLCEngine | null>(null);
  const pendingEmbeddingRef = useRef<PendingEmbedding | null>(null);
  const generationIdRef = useRef(0);
  const promptPagesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // The lab is deliberately excluded from search and public tool discovery.
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    void detectLabCapabilities().then(setCapabilities).catch((error: unknown) => {
      setCapabilityError(error instanceof Error ? error.message : "Device capability checks failed.");
    });
    return () => {
      uploadAbortRef.current?.abort();
      embeddingWorkerRef.current?.terminate();
      generationWorkerRef.current?.terminate();
    };
  }, []);

  const totalTextCharacters = useMemo(
    () => pages.reduce((total, page) => total + page.text.length, 0),
    [pages],
  );
  const emptyPageRatio = useMemo(
    () => pages.length ? pages.filter((page) => page.text.trim().length === 0).length / pages.length : 0,
    [pages],
  );
  const mode = capabilities ? modeForCapabilities(capabilities, embeddingState === "ready") : "Keyword search";
  const selectedGenerationModel = GENERATION_MODELS.find((model) => model.id === generationModelId) ?? GENERATION_MODELS[0];
  const loadedModels = [
    ...(embeddingState === "ready" ? [{ id: EMBEDDING_MODEL.id, sizeBytes: EMBEDDING_MODEL.sizeBytes }] : []),
    ...(generationEngineRef.current ? [{
      id: selectedGenerationModel.id,
      sizeBytes: selectedGenerationModel.sizeBytes,
    }] : []),
  ];

  const diagnostics: SafeDiagnostics = {
    mode,
    adapterInfo: capabilities?.adapterInfo ?? capabilityError ?? "Checking device capabilities.",
    deviceMemory: capabilities?.deviceMemory ?? null,
    cacheStorageAvailable: capabilities?.cacheStorageAvailable ?? false,
    indexedDbAvailable: capabilities?.indexedDbAvailable ?? false,
    loadedModels,
    modelLoadMs: generationMetrics.modelLoadMs,
    embeddingMsPerChunk: embeddingMetrics.msPerChunk,
    embeddingTotalMs: embeddingMetrics.totalMs,
    retrievalMs: embeddingMetrics.retrievalMs,
    firstTokenMs: generationMetrics.firstTokenMs,
    tokensPerSecond: generationMetrics.tokensPerSecond,
    peakMemoryBytes,
    chunkCount: chunks.length,
  };

  function clearEmbeddingWorker() {
    pendingEmbeddingRef.current?.cancel(new Error("Smart search was stopped because a new PDF was selected."));
    embeddingWorkerRef.current?.terminate();
    embeddingWorkerRef.current = null;
  }

  function clearGenerationWorker() {
    generationIdRef.current += 1;
    generationWorkerRef.current?.terminate();
    generationWorkerRef.current = null;
    generationEngineRef.current = null;
  }

  async function readPdf(selectedFile: File, passphrase: string, requestId: number) {
    uploadAbortRef.current?.abort();
    const abortController = new AbortController();
    uploadAbortRef.current = abortController;
    setUploadProgress("Opening PDF…");
    setUploadError("");
    setPasswordPrompt(false);
    setScanned(false);
    setPages([]);
    setChunks([]);
    setResults([]);
    setAnswer("");
    setCitationWarning(false);
    setQuestion("");
    setNoRelevantPassage(false);
    setEmbeddingState("idle");
    setEmbeddingError("");
    setGenerationState("idle");
    setGenerationError("");
    clearEmbeddingWorker();
    clearGenerationWorker();

    try {
      const extractedPages = await extractLabPdf(
        selectedFile,
        passphrase,
        setUploadProgress,
        abortController.signal,
      );
      if (!isCurrentUpload(requestId, uploadIdRef.current)) return;
      setPages(extractedPages);
      const hasNoUsableText = extractedPages.length > 0 && (
        extractedPages.reduce((total, page) => total + page.text.trim().length, 0) < 50 ||
        extractedPages.filter((page) => page.text.trim().length === 0).length / extractedPages.length > 0.9
      );
      setScanned(hasNoUsableText);
      const nextChunks = hasNoUsableText ? [] : chunkLabPages(extractedPages);
      setChunks(nextChunks);
      if (!extractedPages.length) {
        setUploadError("This PDF has no pages to read.");
      } else if (!hasNoUsableText && !nextChunks.length) {
        setUploadError("No text passages could be prepared from this PDF.");
      }
    } catch (error) {
      if (!isCurrentUpload(requestId, uploadIdRef.current) || abortController.signal.aborted) return;
      if (error instanceof PasswordRequiredError) {
        setPasswordPrompt(true);
        setPassword("");
        setUploadError(error.message);
      } else if (error instanceof Error && error.name === "TooManyPagesError") {
        setUploadError(`${error.message} The shared limit is 300 pages.`);
      } else if (error instanceof Error) {
        setUploadError(error.message || "This PDF could not be read. It may be damaged or unsupported.");
      } else {
        setUploadError("This PDF could not be read. It may be damaged or unsupported.");
      }
    } finally {
      if (isCurrentUpload(requestId, uploadIdRef.current)) setUploadProgress("");
    }
  }

  function handleFileChange(selectedFile?: File) {
    if (!selectedFile) return;
    uploadAbortRef.current?.abort();
    const requestId = ++uploadIdRef.current;
    setFile(selectedFile);
    setPassword("");
    setUploadError("");
    void readPdf(selectedFile, "", requestId);
  }

  function requestEmbedding<T extends EmbeddingResponse["type"]>(
    worker: Worker,
    request: { type: "index"; chunks: LabTextChunk[] } | { type: "search"; query: string },
    terminalType: T,
    timeoutMs = 10 * 60_000,
  ): Promise<Extract<EmbeddingResponse, { type: T }>> {
    return new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent<EmbeddingResponse>) => {
        if (event.data.type === "error") {
          cleanup();
          reject(new Error(event.data.message));
        } else if (event.data.type === terminalType) {
          cleanup();
          resolve(event.data as Extract<EmbeddingResponse, { type: T }>);
        }
      };
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error("Smart search timed out. Cancel it or try again with a shorter PDF."));
      }, timeoutMs);
      const cleanup = () => {
        window.clearTimeout(timeout);
        worker.removeEventListener("message", onMessage);
        pendingEmbeddingRef.current = null;
      };
      pendingEmbeddingRef.current = {
        cancel: (reason) => {
          cleanup();
          reject(reason);
        },
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage(request);
    });
  }

  async function enableSmartSearch() {
    if (!chunks.length || embeddingState === "loading" || embeddingState === "indexing") return;
    setEmbeddingError("");
    setEmbeddingProgress({ progress: 0, loaded: 0, total: EMBEDDING_MODEL.sizeBytes });
    setIndexProgress({ completed: 0, total: chunks.length });
    setEmbeddingState("loading");
    let worker = embeddingWorkerRef.current;
    if (!worker) {
      worker = new Worker(new URL("./embedding.worker.ts", import.meta.url), { type: "module" });
      embeddingWorkerRef.current = worker;
    }
    const onProgress = (event: MessageEvent<EmbeddingResponse>) => {
      if (event.data.type === "download-progress") {
        setEmbeddingProgress({
          progress: event.data.progress,
          loaded: event.data.loaded,
          total: event.data.total || EMBEDDING_MODEL.sizeBytes,
        });
      }
      if (event.data.type === "index-progress") {
        setEmbeddingState("indexing");
        setIndexProgress({ completed: event.data.completed, total: event.data.total });
      }
    };
    worker.addEventListener("message", onProgress);
    try {
      setEmbeddingState("indexing");
      const indexed = await requestEmbedding(worker, { type: "index", chunks }, "indexed");
      setChunks(indexed.chunks);
      setEmbeddingMetrics({
        msPerChunk: indexed.embeddingMsPerChunk,
        totalMs: indexed.totalMs,
        retrievalMs: null,
      });
      setEmbeddingState("ready");
    } catch (error) {
      setEmbeddingState("idle");
      if (error instanceof Error && !/stopped because a new PDF/i.test(error.message)) {
        setEmbeddingError(error.message);
      }
    } finally {
      worker.removeEventListener("message", onProgress);
    }
  }

  function cancelSmartSearch() {
    clearEmbeddingWorker();
    setEmbeddingState("idle");
    setEmbeddingProgress({ progress: 0, loaded: 0, total: EMBEDDING_MODEL.sizeBytes });
    setEmbeddingError("Smart search was cancelled. No PDF text was sent anywhere.");
  }

  async function searchQuestion(): Promise<RankedPassage[]> {
    if (!question.trim() || !chunks.length) return [];
    const started = performance.now();
    if (embeddingState === "ready" && embeddingWorkerRef.current) {
      const response = await requestEmbedding(
        embeddingWorkerRef.current,
        { type: "search", query: question.trim() },
        "results",
      );
      setEmbeddingMetrics((previous) => ({ ...previous, retrievalMs: response.retrievalMs }));
      return response.results;
    }
    const lexicalResults = rankHybrid(chunks, question.trim(), null, null);
    setEmbeddingMetrics((previous) => ({ ...previous, retrievalMs: performance.now() - started }));
    return lexicalResults;
  }

  async function askQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || !chunks.length || searching) return;
    setSearching(true);
    setAnswer("");
    setCitationWarning(false);
    setGenerationError("");
    setGenerationState("idle");
    try {
      const found = await searchQuestion();
      setResults(found);
      const relevant = isRelevant(found, MINIMUM_RELEVANCE_SCORE);
      setNoRelevantPassage(!relevant);
      promptPagesRef.current = new Set(found.map(({ chunk }) => chunk.page));
      setDiagnosticPrompt("");
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function writeAnswer() {
    if (!capabilities?.adapterAvailable || !results.length || noRelevantPassage) return;
    const model = GENERATION_MODELS.find((item) => item.id === generationModelId);
    if (!model) {
      setGenerationError("The selected model is not in the verified WebLLM model list.");
      setGenerationState("error");
      return;
    }
    const confirmed = window.confirm(
      `Download ${model.id} (${model.sizeBytes.toLocaleString()} bytes; ${formatBytes(model.sizeBytes)}). ` +
      "This is a one-time download cached by your browser. Your PDF, extracted text, question, and answer stay on this device. Continue?",
    );
    if (!confirmed) return;

    const generationId = ++generationIdRef.current;
    setAnswer("");
    setCitationWarning(false);
    setGenerationError("");
    setGenerationState("loading");
    setGenerationProgress({ progress: 0, text: "Preparing WebGPU model…" });
    setGenerationMetrics({ modelLoadMs: null, firstTokenMs: null, tokensPerSecond: null });
    let worker = generationWorkerRef.current;
    let engine = generationEngineRef.current;
    if (!worker || !engine) {
      worker?.terminate();
      worker = new Worker(new URL("./generation.worker.ts", import.meta.url), { type: "module" });
      generationWorkerRef.current = worker;
      engine = null;
    }
    try {
      if (!engine) {
        const { CreateWebWorkerMLCEngine, prebuiltAppConfig } = await import("@mlc-ai/web-llm");
        const modelRecord = prebuiltAppConfig.model_list.find((item) => item.model_id === model.id);
        const contextWindowSize = modelRecord?.overrides?.context_window_size;
        if (!modelRecord || contextWindowSize !== model.contextWindowSize) {
          throw new Error("The selected model context window did not match the installed WebLLM registry.");
        }
        const modelStarted = performance.now();
        const loadingTimeout = window.setTimeout(() => {
          if (generationIdRef.current === generationId) {
            generationIdRef.current += 1;
            worker.terminate();
            generationWorkerRef.current = null;
            generationEngineRef.current = null;
            setGenerationError("Model loading timed out. The model may exceed this device's memory; use smart or keyword search.");
            setGenerationState("error");
          }
        }, MODEL_LOAD_TIMEOUT_MS);
        try {
          engine = await CreateWebWorkerMLCEngine(worker, model.id, {
            initProgressCallback: (progress) => {
              if (generationIdRef.current !== generationId) return;
              setGenerationProgress({
                progress: progress.progress,
                text: progress.text,
              });
            },
          });
        } finally {
          window.clearTimeout(loadingTimeout);
        }
        if (generationIdRef.current !== generationId) {
          worker.terminate();
          return;
        }
        setGenerationMetrics((previous) => ({ ...previous, modelLoadMs: performance.now() - modelStarted }));
        generationEngineRef.current = engine;
      }

      const retrieved = results.filter((item) => item.chunk.text.length > 0).slice(0, 5);
      const prompt = buildPrompt(
        question.trim(),
        retrieved,
        model.contextWindowSize,
        MAX_OUTPUT_TOKENS,
        conservativeTokenCount,
      );
      if (!prompt.passages.length) throw new Error("The question leaves no room for passages within the model context window.");
      const allowedPages = new Set(prompt.passages.map(({ chunk }) => chunk.page));
      promptPagesRef.current = allowedPages;
      setDiagnosticPrompt(`${prompt.system}\n\n${prompt.user}`);
      setGenerationState("generating");
      setGenerationProgress({ progress: 100, text: "Generating locally…" });
      const generationStarted = performance.now();
      let firstTokenAt: number | null = null;
      let tokenCount = 0;
      let rawAnswer = "";
      let generationTimeout: number | undefined;
      const generationPromise = (async () => {
        const stream = await engine!.chat.completions.create({
          model: model.id,
          messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: prompt.user },
          ],
          temperature: 0.15,
          max_tokens: MAX_OUTPUT_TOKENS,
          stream: true,
        });
        for await (const part of stream) {
          if (generationIdRef.current !== generationId) return;
          const content = part.choices[0]?.delta?.content;
          if (typeof content === "string" && content) {
            if (firstTokenAt === null) {
              firstTokenAt = performance.now();
              setGenerationMetrics((previous) => ({
                ...previous,
                firstTokenMs: firstTokenAt! - generationStarted,
              }));
            }
            tokenCount += 1;
            rawAnswer += content;
            setAnswer(stripThinkBlocks(rawAnswer));
          }
        }
      })();
      try {
        await Promise.race([
          generationPromise,
          new Promise<never>((_, reject) => {
            generationTimeout = window.setTimeout(
              () => reject(new Error("Answer generation timed out. Retrieved passages are still available below.")),
              GENERATION_TIMEOUT_MS,
            );
          }),
        ]);
      } finally {
        if (generationTimeout !== undefined) window.clearTimeout(generationTimeout);
      }
      if (generationIdRef.current !== generationId) return;
      const validatedAnswer = validateCitations(stripThinkBlocks(rawAnswer), allowedPages);
      setAnswer(validatedAnswer.answer);
      setCitationWarning(validatedAnswer.validCount === 0 && !isNoAnswer(validatedAnswer.answer));
      const elapsed = firstTokenAt === null ? 0 : (performance.now() - firstTokenAt) / 1000;
      setGenerationMetrics((previous) => ({
        ...previous,
        tokensPerSecond: elapsed > 0 ? tokenCount / elapsed : 0,
      }));
      setGenerationState("done");
      setPeakMemoryBytes(null);
    } catch (error) {
      if (generationIdRef.current !== generationId) return;
      const message = error instanceof Error ? error.message : "The on-device model failed.";
      setGenerationError(`${message} Your retrieved passages remain available below.`);
      setGenerationState("error");
      if (/timed out|out of memory|device lost/i.test(message)) {
        worker.terminate();
        generationWorkerRef.current = null;
        generationEngineRef.current = null;
      }
    }
  }

  function stopGeneration() {
    generationIdRef.current += 1;
    generationWorkerRef.current?.terminate();
    generationWorkerRef.current = null;
    generationEngineRef.current = null;
    setGenerationState("idle");
    setGenerationProgress({ progress: 0, text: "" });
    setGenerationError("Generation stopped. Retrieved passages remain available.");
  }

  async function removeDownloadedModels() {
    const confirmed = window.confirm("Remove the cached Ask PDF AI embedding and generation models from this browser?");
    if (!confirmed) return;
    try {
      const { deleteModelAllInfoInCache } = await import("@mlc-ai/web-llm");
      await Promise.all(GENERATION_MODELS.map((model) => deleteModelAllInfoInCache(model.id)));
      if ("caches" in globalThis && globalThis.caches) {
        await globalThis.caches.delete("ask-pdf-ai-transformers-cache");
      }
      clearEmbeddingWorker();
      clearGenerationWorker();
      setEmbeddingState("idle");
      setGenerationState("idle");
      setGenerationError("");
      setEmbeddingError("");
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Could not remove all cached model files.");
    }
  }

  const canAsk = Boolean(chunks.length && !scanned && !searching);
  const notFound = isNoAnswer(answer);
  const citations = validateCitations(stripThinkBlocks(answer), promptPagesRef.current);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 text-foreground sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Ask PDF (AI)</h1>
        <p role="note" className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          Experimental. Runs on your device. Answers can be wrong, so check the cited pages.
        </p>
      </header>

      <section className="space-y-6">
        <div className="rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">1. Choose a PDF</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Up to 50 MB and 300 pages. Text extraction, search, and answer generation run locally.
          </p>
          <label className="mt-4 block text-sm font-medium" htmlFor="ask-pdf-file">PDF file</label>
          <input
            ref={fileInputRef}
            id="ask-pdf-file"
            type="file"
            accept="application/pdf,.pdf"
            className="mt-2 block w-full rounded-md border border-border bg-background p-2 text-sm"
            onChange={(event) => handleFileChange(event.currentTarget.files?.[0])}
          />
          {file && <p className="mt-2 break-all text-sm">Selected: {file.name}</p>}
          {uploadProgress && <p role="status" aria-live="polite" className="mt-3 text-sm">{uploadProgress}</p>}
          {uploadError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {uploadError}
              {passwordPrompt && <span> The password is used only in this browser.</span>}
            </p>
          )}
          {passwordPrompt && file && (
            <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => {
              event.preventDefault();
              void readPdf(file, password, uploadIdRef.current);
            }}>
              <label className="sr-only" htmlFor="ask-pdf-password">PDF password</label>
              <input
                id="ask-pdf-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                autoComplete="current-password"
                className="min-w-64 rounded-md border border-border bg-background p-2"
                placeholder="Enter PDF password"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground" type="submit">Unlock in browser</button>
            </form>
          )}
          {scanned && (
            <p role="status" className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              {NO_TEXT_MESSAGE} <Link className="underline" href="/tools/ocr-pdf">Open OCR PDF</Link>.
            </p>
          )}
          {pages.length > 0 && !scanned && (
            <p className="mt-3 text-sm text-muted-foreground">
              Read {pages.length} pages; {totalTextCharacters.toLocaleString()} text characters; {chunks.length} page-bounded passages.
              {emptyPageRatio > 0 && ` ${Math.round(emptyPageRatio * 100)}% of pages contain no selectable text.`}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">2. Search the document</h2>
          <p className="mt-1 text-sm">
            Current mode: <strong>{mode}</strong>. {capabilities?.reason ?? capabilityError}
          </p>
          {chunks.length > 0 && embeddingState !== "ready" && (
            <div className="mt-4 rounded-lg border border-border p-3">
              <p className="text-sm">
                Optional semantic model: {EMBEDDING_MODEL.id}, about {formatBytes(EMBEDDING_MODEL.sizeBytes)} of model, tokenizer, and configuration files, cached by this browser.
                This English model accepts at most {EMBEDDING_MODEL.maxTokens} tokens per passage; passages are checked and split before embedding.
              </p>
              {embeddingState === "loading" || embeddingState === "indexing" ? (
                <>
                  <div className="mt-3 h-2 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${embeddingState === "loading" ? embeddingProgress.progress : indexProgress.total ? indexProgress.completed / indexProgress.total * 100 : 0}%` }} />
                  </div>
                  <p role="status" aria-live="polite" className="mt-2 text-sm">
                    {embeddingState === "loading"
                      ? `Downloading model: ${formatBytes(embeddingProgress.loaded)} / ${formatBytes(embeddingProgress.total)}`
                      : `Embedding passage ${indexProgress.completed} of ${indexProgress.total}`}
                  </p>
                  <button type="button" className="mt-3 rounded-md border border-border px-3 py-2 text-sm" onClick={cancelSmartSearch}>Cancel</button>
                </>
              ) : (
                <button type="button" className="mt-3 rounded-md bg-primary px-4 py-2 text-primary-foreground" onClick={() => void enableSmartSearch()}>
                  Enable smart search
                </button>
              )}
              {embeddingError && <p role="alert" className="mt-2 text-sm text-destructive">{embeddingError}</p>}
            </div>
          )}
          {embeddingState === "ready" && (
            <p role="status" className="mt-3 text-sm">Smart search is ready. Vectors stay in memory for this page.</p>
          )}
          <form className="mt-4 space-y-3" onSubmit={(event) => void askQuestion(event)}>
            <label className="block text-sm font-medium" htmlFor="ask-pdf-question">Question</label>
            <textarea
              id="ask-pdf-question"
              rows={3}
              value={question}
              onChange={(event) => setQuestion(event.currentTarget.value)}
              disabled={!canAsk}
              className="w-full rounded-md border border-border bg-background p-3 text-sm disabled:opacity-60"
              placeholder="Ask about facts in your PDF"
            />
            <button type="submit" disabled={!canAsk || !question.trim()} className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
              {searching ? "Searching…" : "Find passages"}
            </button>
          </form>
          {noRelevantPassage && <p role="status" className="mt-4 text-sm">No relevant passage found in this PDF.</p>}
          {results.length > 0 && (
            <div className="mt-5 space-y-3">
              <h3 className="font-semibold">Retrieved passages</h3>
              {results.map((result, index) => (
                <article key={`${result.chunk.id}-${index}`} className="rounded-lg border border-border p-3">
                  <h4 className="text-sm font-semibold">Page {result.chunk.page} <span className="font-normal text-muted-foreground">· score {result.score.toFixed(4)}</span></h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{result.chunk.text}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">3. Optional: write an answer on this device</h2>
          {!capabilities?.adapterAvailable && (
            <p className="mt-2 text-sm text-muted-foreground">
              WebGPU is not available. Use the passages above with Smart search or Keyword search; model generation needs a compatible WebGPU adapter.
            </p>
          )}
          {capabilities?.adapterAvailable && (
            <>
              <label className="mt-3 block text-sm font-medium" htmlFor="ask-pdf-generation-model">Generation model</label>
              <select
                id="ask-pdf-generation-model"
                value={generationModelId}
                onChange={(event) => {
                  clearGenerationWorker();
                  setGenerationModelId(event.currentTarget.value);
                  setGenerationMetrics({ modelLoadMs: null, firstTokenMs: null, tokensPerSecond: null });
                }}
                disabled={generationState === "loading" || generationState === "generating"}
                className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm"
              >
                {GENERATION_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.id} · {formatBytes(model.sizeBytes)} · about {model.vramRequiredMb} MB VRAM · {model.contextWindowSize} tokens · {model.license}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-muted-foreground">
                WebGPU adapter: {capabilities.adapterInfo || "not exposed"}; estimated device memory: {capabilities.deviceMemory === null ? "unknown" : `${capabilities.deviceMemory} GB`}.
              </p>
              <button
                type="button"
                disabled={!results.length || noRelevantPassage || generationState === "loading" || generationState === "generating"}
                className="mt-3 rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void writeAnswer()}
              >
                Write an answer on my device
              </button>
              {(generationState === "loading" || generationState === "generating") && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${generationProgress.progress}%` }} />
                  </div>
                  <p role="status" aria-live="polite" className="mt-2 text-sm">{generationProgress.text}</p>
                  {generationState === "generating" && <button type="button" className="mt-2 rounded-md border border-border px-3 py-2 text-sm" onClick={stopGeneration}>Stop answer</button>}
                </div>
              )}
              {generationError && <p role="alert" className="mt-3 text-sm text-destructive">{generationError}</p>}
              {answer && (
                <section className="mt-5 rounded-lg border border-border p-3" aria-labelledby="answer-title">
                  <h3 id="answer-title" className="font-semibold">Answer</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{citations.answer}</p>
                  {citationWarning && !notFound && (
                    <p role="alert" className="mt-2 text-sm font-medium text-amber-700">No page cited, check the passages below.</p>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <details className="mt-6 rounded-xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">Diagnostics</summary>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-medium">Chosen mode</dt><dd>{mode}</dd></div>
          <div><dt className="font-medium">WebGPU</dt><dd>{capabilities?.webGpuAvailable ? "Available" : "Unavailable"}</dd></div>
          <div><dt className="font-medium">Adapter</dt><dd>{capabilities?.adapterInfo ?? capabilityError ?? "Checking"}</dd></div>
          <div><dt className="font-medium">Device memory</dt><dd>{capabilities?.deviceMemory === null || capabilities?.deviceMemory === undefined ? "Unknown" : `${capabilities.deviceMemory} GB`}</dd></div>
          <div><dt className="font-medium">Cache Storage / IndexedDB</dt><dd>{capabilities ? `${capabilities.cacheStorageAvailable} / ${capabilities.indexedDbAvailable}` : "Checking"}</dd></div>
          <div><dt className="font-medium">Loaded models</dt><dd>{loadedModels.map((model) => `${model.id} (${formatBytes(model.sizeBytes)})`).join(", ") || "None"}</dd></div>
          <div><dt className="font-medium">Model load time</dt><dd>{generationMetrics.modelLoadMs === null ? "Not loaded" : `${generationMetrics.modelLoadMs.toFixed(0)} ms`}</dd></div>
          <div><dt className="font-medium">Embedding time / chunk; total</dt><dd>{embeddingMetrics.msPerChunk === null ? "Not run" : `${embeddingMetrics.msPerChunk.toFixed(1)} ms; ${embeddingMetrics.totalMs?.toFixed(0)} ms`}</dd></div>
          <div><dt className="font-medium">Retrieval time</dt><dd>{embeddingMetrics.retrievalMs === null ? "Not run" : `${embeddingMetrics.retrievalMs.toFixed(1)} ms`}</dd></div>
          <div><dt className="font-medium">Time to first token</dt><dd>{generationMetrics.firstTokenMs === null ? "Not run" : `${generationMetrics.firstTokenMs.toFixed(0)} ms`}</dd></div>
          <div><dt className="font-medium">Tokens per second</dt><dd>{generationMetrics.tokensPerSecond === null ? "Not run" : generationMetrics.tokensPerSecond.toFixed(2)}</dd></div>
          <div><dt className="font-medium">Peak memory</dt><dd>{peakMemoryBytes === null ? "Unavailable in this browser" : formatBytes(peakMemoryBytes)}</dd></div>
          <div><dt className="font-medium">Passage count</dt><dd>{chunks.length}</dd></div>
        </dl>
        <button
          type="button"
          className="mt-4 rounded-md border border-border px-3 py-2 text-sm"
          onClick={() => {
            setDiagnosticsError("");
            void navigator.clipboard?.writeText(safeDiagnosticsJson(diagnostics)).catch((error: unknown) => {
              setDiagnosticsError(error instanceof Error ? error.message : "Could not copy diagnostics.");
            });
          }}
        >
          Copy diagnostics as JSON
        </button>
        {diagnosticsError && <p role="alert" className="mt-2 text-sm text-destructive">{diagnosticsError}</p>}
        <button type="button" className="ml-2 mt-4 rounded-md border border-border px-3 py-2 text-sm" onClick={() => void removeDownloadedModels()}>
          Remove downloaded models
        </button>
        {diagnosticPrompt && (
          <div className="mt-4">
            <h3 className="font-semibold">Exact prompt sent to the local model</h3>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs">{diagnosticPrompt}</pre>
          </div>
        )}
      </details>

      <footer className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
        Model and library downloads are the only external requests made by the lab. Your PDF, extracted text, question, and answer are not sent to a server. No OCR is performed here.
      </footer>
    </main>
  );
}
