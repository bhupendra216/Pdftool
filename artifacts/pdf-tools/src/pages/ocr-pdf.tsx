import { useRef, useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createWorker } from "tesseract.js";
import { saveAs } from "file-saver";
import workerUrl from "tesseract.js/dist/worker.min.js?url";
import coreUrl from "tesseract.js-core/tesseract-core.wasm.js?url";
import englishDataUrl from "@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz?url";
import { AlertCircle, Download, FileSearch, LoaderCircle, ShieldCheck } from "lucide-react";
import { UploadArea } from "@/components/shared/UploadArea";
import { ClientToolPage } from "@/components/tools/ClientToolPage";
import { openPdf, outputBaseName } from "@/lib/client-pdf";

// PDF.js uses 72 points per inch; 2.25x renders at 162 DPI. OCR quality still depends on the original scan resolution and clarity.
const OCR_SCALE = 2.25;

function parsePageRange(value: string, pageCount: number) {
  if (!value.trim()) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set<number>();
  for (const part of value.split(",").map((entry) => entry.trim())) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < start || end > pageCount) {
        throw new Error(`Enter page ranges between 1 and ${pageCount}, for example 1-3,5.`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page);
      continue;
    }
    if (!/^\d+$/.test(part)) throw new Error("Enter page numbers like 1-3,5, or leave the field blank for every page.");
    const page = Number(part);
    if (page < 1 || page > pageCount) throw new Error(`Enter page numbers between 1 and ${pageCount}.`);
    pages.add(page);
  }
  if (!pages.size) throw new Error("Choose at least one page to recognize.");
  return Array.from(pages).sort((left, right) => left - right);
}

function pngBytes(dataUrl: string) {
  const encoded = dataUrl.split(",")[1];
  if (!encoded) throw new Error("The rendered PDF page could not be encoded.");
  const binary = atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function safePdfText(value: string) {
  return value.replace(/[^\x20-\x7E\xA0-\xFF]/g, " ").replace(/\s+/g, " ").trim();
}

export default function OcrPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<Awaited<ReturnType<typeof openPdf>> | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectFile = (selected: File[]) => {
    const nextFile = selected[0] ?? null;
    setFile(nextFile);
    setPdf(null);
    setPageRange("");
    setError(null);
    setSuccess(false);
    setFallbackText(null);
    if (!nextFile) return;
    void openPdf(nextFile).then(setPdf).catch((openError: unknown) => {
      setFile(null);
      setError(openError instanceof Error ? openError.message : "This PDF could not be opened.");
    });
  };

  const saveTextFallback = () => {
    if (!file || !fallbackText) return;
    saveAs(new Blob([fallbackText], { type: "text/plain;charset=utf-8" }), `${outputBaseName(file.name)}-ocr.txt`);
  };

  const runOcr = async () => {
    if (!file || !pdf || !canvasRef.current) return;
    if (typeof Worker === "undefined" || typeof WebAssembly === "undefined") {
      setError("This browser does not support the WebAssembly worker needed for OCR. Try a recent version of Chrome, Edge, Firefox, or Safari.");
      return;
    }
    setWorking(true);
    setProgress(0);
    setProgressLabel("Preparing local OCR engine");
    setError(null);
    setSuccess(false);
    setFallbackText(null);
    let worker: Awaited<ReturnType<typeof createWorker>> | undefined;
    let recognizedOutput = "";

    try {
      const pagesToProcess = parsePageRange(pageRange, pdf.numPages);
      const languageResponse = await fetch(englishDataUrl);
      if (!languageResponse.ok) throw new Error("The local English OCR data could not be loaded. Reload the page and try again.");
      const languageData = new Uint8Array(await languageResponse.arrayBuffer());
      let activePageIndex = 0;
      worker = await createWorker({
        workerPath: workerUrl,
        corePath: coreUrl,
        workerBlobURL: false,
        gzip: true,
        logger: (message) => {
          if (message.status.includes("loading")) setProgressLabel("Loading OCR engine locally");
          if (message.status === "recognizing text" && pagesToProcess.length) {
            const percentage = Math.round(((activePageIndex + message.progress) / pagesToProcess.length) * 95);
            setProgress(Math.min(95, percentage));
            setProgressLabel(`OCR page ${pagesToProcess[activePageIndex]} of ${pdf.numPages} — ${Math.round(message.progress * 100)}%`);
          }
        },
      });
      await worker.loadLanguage([{ code: "eng", data: languageData }]);
      await worker.initialize("eng");

      const outputPdf = await PDFDocument.create();
      const font = await outputPdf.embedFont(StandardFonts.Helvetica);
      const textPages: string[] = [];
      for (let index = 0; index < pagesToProcess.length; index += 1) {
        activePageIndex = index;
        const sourcePageNumber = pagesToProcess[index];
        const page = await pdf.getPage(sourcePageNumber);
        const unitViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: OCR_SCALE });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("This browser does not support the canvas features needed for OCR.");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        setProgressLabel(`Rendering page ${sourcePageNumber} of ${pdf.numPages}`);
        await page.render({ canvasContext: context, viewport } as Parameters<typeof page.render>[0]).promise;

        const result = await worker.recognize(canvas, {}, { text: true, blocks: true, layoutBlocks: true, hocr: false, tsv: false, box: false, unlv: false, osd: false, pdf: false, imageColor: false, imageGrey: false, imageBinary: false, debug: false });
        const recognizedText = result.data.text.trim();
        textPages.push(`Page ${sourcePageNumber}\n${recognizedText}`);
        recognizedOutput = textPages.join("\n\n");
        const outputPage = outputPdf.addPage([unitViewport.width, unitViewport.height]);
        const background = await outputPdf.embedPng(pngBytes(canvas.toDataURL("image/png")));
        outputPage.drawImage(background, { x: 0, y: 0, width: unitViewport.width, height: unitViewport.height });

        const pointScale = 1 / OCR_SCALE;
        for (const word of result.data.words ?? []) {
          const wordText = safePdfText(word.text);
          if (!wordText || word.confidence < 1) continue;
          const x = word.bbox.x0 * pointScale;
          const y = unitViewport.height - word.bbox.y1 * pointScale;
          const wordHeight = Math.max(4, (word.bbox.y1 - word.bbox.y0) * pointScale);
          try {
            font.encodeText(wordText);
            outputPage.drawText(wordText, {
              x,
              y,
              size: wordHeight,
              font,
              opacity: 0,
              maxWidth: Math.max(8, (word.bbox.x1 - word.bbox.x0) * pointScale + 2),
              lineHeight: wordHeight,
            });
          } catch {
            // Skip characters unsupported by the built-in PDF font instead of failing the whole OCR document.
          }
        }
        canvas.width = 0;
        canvas.height = 0;
        setProgress(Math.round(((index + 1) / pagesToProcess.length) * 95));
      }

      const text = textPages.join("\n\n");
      setFallbackText(text);
      setProgressLabel("Saving searchable PDF");
      const saved = await outputPdf.save();
      const savedBytes = new Uint8Array(saved.length);
      savedBytes.set(saved);
      saveAs(new Blob([savedBytes.buffer], { type: "application/pdf" }), `${outputBaseName(file.name)}-ocr.pdf`);
      setProgress(100);
      setProgressLabel("Searchable PDF downloaded");
      setSuccess(true);
    } catch (ocrError) {
      if (recognizedOutput) setFallbackText(recognizedOutput);
      setError(ocrError instanceof Error
        ? ocrError.message
        : typeof Worker === "undefined" || typeof WebAssembly === "undefined"
          ? "This browser does not support the WebAssembly worker needed for OCR. Try a recent version of Chrome, Edge, Firefox, or Safari."
          : "OCR could not finish. Try a shorter page range or download the recognized text.");
      if (recognizedOutput) setProgressLabel("You can download the recognized text as a .txt file.");
    } finally {
      await worker?.terminate();
      setWorking(false);
    }
  };

  return (
    <ClientToolPage slug="ocr-pdf">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card p-5 shadow-sm md:p-8">
        <UploadArea
          multiple={false}
          maxSizeMB={50}
          label="scanned PDF"
          description="Drop a PDF here or choose a file. Maximum 50 MB and 20 pages."
          onFilesSelected={selectFile}
          onError={setError}
        />
        {file && pdf ? (
          <div className="mt-5 space-y-4 rounded-xl bg-muted/40 p-4">
            <p className="truncate text-sm font-medium text-foreground">{file.name} · {pdf.numPages} page{pdf.numPages === 1 ? "" : "s"}</p>
            {pdf.numPages > 10 ? <p className="text-sm text-amber-800">Large documents may take a few minutes. Select a smaller page range to finish sooner.</p> : null}
            <label className="block text-sm font-medium text-foreground">
              Pages to OCR <span className="font-normal text-muted-foreground">(optional; blank processes every page)</span>
              <input value={pageRange} onChange={(event) => setPageRange(event.target.value)} placeholder="For example: 1-3,5" className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
            </label>
          </div>
        ) : null}
        {working ? (
          <div className="mt-6" role="status" aria-live="polite">
            <div className="mb-2 flex items-center justify-between gap-2 text-sm text-muted-foreground"><span>{progressLabel}</span><span>{progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        ) : null}
        {error ? <p className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p> : null}
        {success ? <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700"><Download className="h-4 w-4" />Searchable PDF downloaded.</p> : null}
        {fallbackText ? <button type="button" onClick={saveTextFallback} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-medium"><Download className="h-4 w-4" />Extract text to .txt</button> : null}
        <button type="button" disabled={!file || !pdf || working} onClick={() => void runOcr()} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
          {working ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}{working ? "Recognizing text locally…" : "Make PDF searchable"}
        </button>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />PDF, OCR engine, and English language data stay in your browser and on this site.</p>
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>
    </ClientToolPage>
  );
}
