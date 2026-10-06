import { useEffect, useMemo, useRef, useState } from "react";
import {
  PDFArray,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFOperator,
  PDFOperatorNames,
  PDFString,
} from "pdf-lib";
import { saveAs } from "file-saver";
import { AlertCircle, Check, Eraser, FileSignature, LoaderCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { UploadArea } from "@/components/shared/UploadArea";
import { ClientToolPage } from "@/components/tools/ClientToolPage";
import { openPdf, outputBaseName } from "@/lib/client-pdf";

type SignaturePlacement = {
  id: number;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
};

type Gesture = {
  id: number;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  original: SignaturePlacement;
  container: DOMRect;
};

const typedFonts = [
  { label: "Script", css: '"Brush Script MT", "Segoe Script", cursive' },
  { label: "Casual", css: '"Comic Sans MS", "Segoe Print", cursive' },
  { label: "Italic", css: 'Georgia, "Times New Roman", serif' },
];

function dataUrlBytes(dataUrl: string) {
  const encoded = dataUrl.split(",")[1];
  if (!encoded) throw new Error("The signature image could not be read.");
  const binary = atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function makeTypedSignature(name: string, fontIndex: number, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 240;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser does not support the canvas needed to create a signature.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = `italic 112px ${typedFonts[fontIndex]?.css ?? typedFonts[0].css}`;
  context.textBaseline = "middle";
  context.fillText(name || "Your name", 18, 125, 860);
  return canvas.toDataURL("image/png");
}

async function addDateToSignature(imageDataUrl: string) {
  const image = new Image();
  image.src = imageDataUrl;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1180;
  canvas.height = 280;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser does not support the canvas needed to prepare the signature.");
  context.drawImage(image, 0, 0, 900, 240);
  context.fillStyle = "#1f2937";
  context.font = "28px Arial, sans-serif";
  context.textBaseline = "middle";
  context.fillText(new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date()), 920, 145, 250);
  return canvas.toDataURL("image/png");
}

async function createStampAnnotation(pdf: PDFDocument, pageIndex: number, image: Awaited<ReturnType<PDFDocument["embedPng"]>>, x: number, y: number, width: number, height: number) {
  const page = pdf.getPage(pageIndex);
  const imageName = PDFName.of("SignatureImage");
  const appearance = pdf.context.formXObject(
    [
      PDFOperator.of(PDFOperatorNames.PushGraphicsState),
      PDFOperator.of(PDFOperatorNames.ConcatTransformationMatrix, [PDFNumber.of(width), PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(height), PDFNumber.of(0), PDFNumber.of(0)]),
      PDFOperator.of(PDFOperatorNames.DrawObject, [imageName]),
      PDFOperator.of(PDFOperatorNames.PopGraphicsState),
    ],
    {
      BBox: [0, 0, width, height],
      Resources: { XObject: { [imageName.toString()]: image.ref } },
    },
  );
  const appearanceRef = pdf.context.register(appearance);
  const annotation = pdf.context.obj({
    Type: "Annot",
    Subtype: "Stamp",
    Rect: [x, y, x + width, y + height],
    F: 4,
    Contents: PDFString.of("Electronic signature"),
    Name: PDFName.of("Draft"),
    AP: { N: appearanceRef },
  });
  const annotationRef = pdf.context.register(annotation);
  const annots = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
  if (annots) annots.push(annotationRef);
  else page.node.set(PDFName.of("Annots"), pdf.context.obj([annotationRef]) as PDFArray);
}

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<Awaited<ReturnType<typeof openPdf>> | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [previewSize, setPreviewSize] = useState({ width: 1, height: 1 });
  const [previewReady, setPreviewReady] = useState(false);
  const [mode, setMode] = useState<"draw" | "type" | "image">("draw");
  const [inkColor, setInkColor] = useState("#111827");
  const [typedName, setTypedName] = useState("");
  const [fontIndex, setFontIndex] = useState(0);
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [placements, setPlacements] = useState<SignaturePlacement[]>([]);
  const [flatten, setFlatten] = useState(true);
  const [stampDate, setStampDate] = useState(false);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingSignatureRef = useRef(false);
  const pageCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<{
    width: number;
    height: number;
    convertToPdfPoint: (x: number, y: number) => number[];
  }[]>([]);
  const gestureRef = useRef<Gesture | null>(null);

  const typedSignature = useMemo(() => {
    if (typeof document === "undefined") return null;
    try {
      return makeTypedSignature(typedName, fontIndex, inkColor);
    } catch {
      return null;
    }
  }, [typedName, fontIndex, inkColor]);

  const activeSignature = mode === "draw" ? drawnSignature : mode === "type" ? typedSignature : uploadedSignature;

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !drawnSignature) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = drawnSignature;
  }, [drawnSignature, mode]);

  const signaturePoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("This browser does not support the canvas features needed to draw a signature.");
      return;
    }
    const point = signaturePoint(event);
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + 0.1, point.y + 0.1);
    context.strokeStyle = inkColor;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    drawingSignatureRef.current = true;
  };

  const continueDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingSignatureRef.current) return;
    event.preventDefault();
    const context = event.currentTarget.getContext("2d");
    if (!context) {
      setError("This browser does not support the canvas features needed to draw a signature.");
      return;
    }
    const point = signaturePoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const finishDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingSignatureRef.current) return;
    drawingSignatureRef.current = false;
    setDrawnSignature(event.currentTarget.toDataURL("image/png"));
  };

  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    const loadThumbnails = async () => {
      try {
        const urls: string[] = [];
        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex);
          const viewport = page.getViewport({ scale: 0.18 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("This browser does not support the canvas needed to preview PDF pages.");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({ canvasContext: context, viewport } as Parameters<typeof page.render>[0]).promise;
          urls.push(canvas.toDataURL("image/png"));
        }
        if (!cancelled) setThumbnails(urls);
      } catch (previewError) {
        if (!cancelled) setError(previewError instanceof Error ? previewError.message : "Could not create PDF page previews.");
      }
    };
    void loadThumbnails();
    return () => { cancelled = true; };
  }, [pdf]);

  useEffect(() => {
    if (!pdf || !pageCanvasRef.current) return;
    let cancelled = false;
    setPreviewReady(false);
    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = pageCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) throw new Error("This browser does not support the canvas needed to preview PDF pages.");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      viewportRef.current[pageNumber] = viewport;
      setPreviewSize({ width: viewport.width, height: viewport.height });
      await page.render({ canvasContext: context, viewport } as Parameters<typeof page.render>[0]).promise;
      if (!cancelled) setPreviewReady(true);
    };
    void renderPage().catch((renderError: unknown) => {
      if (!cancelled) setError(renderError instanceof Error ? renderError.message : "Could not render the selected PDF page.");
    });
    return () => { cancelled = true; };
  }, [pdf, pageNumber]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture) return;
      const dx = (event.clientX - gesture.startX) / gesture.container.width;
      const dy = (event.clientY - gesture.startY) / gesture.container.height;
      setPlacements((current) => current.map((placement) => {
        if (placement.id !== gesture.id) return placement;
        if (gesture.mode === "move") {
          return {
            ...placement,
            x: Math.min(1 - placement.width, Math.max(0, gesture.original.x + dx)),
            y: Math.min(1 - placement.height, Math.max(0, gesture.original.y + dy)),
          };
        }
        return {
          ...placement,
          width: Math.min(1 - placement.x, Math.max(0.08, gesture.original.width + dx)),
          height: Math.min(1 - placement.y, Math.max(0.04, gesture.original.height + dy)),
        };
      }));
    };
    const onUp = () => { gestureRef.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const selectFile = (selected: File[]) => {
    const nextFile = selected[0] ?? null;
    setFile(nextFile);
    setPdf(null);
    setThumbnails([]);
    setPlacements([]);
    setPreviewReady(false);
    setError(null);
    setSuccess(false);
    setPageNumber(1);
    if (!nextFile) return;
    void openPdf(nextFile).then(setPdf).catch((openError: unknown) => {
      setFile(null);
      setError(openError instanceof Error ? openError.message : "This PDF could not be opened.");
    });
  };

  const chooseImage = (imageFile?: File) => {
    setError(null);
    if (!imageFile) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(imageFile.type)) {
      setError("Choose a PNG, JPEG, or WebP signature image.");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        setError("This browser does not support the canvas needed to prepare a signature image.");
        URL.revokeObjectURL(url);
        return;
      }
      context.drawImage(image, 0, 0);
      setUploadedSignature(canvas.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError("The selected signature image could not be opened.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const placeSignature = () => {
    if (!activeSignature) return;
    setPlacements((current) => [...current, {
      id: Date.now() + Math.random(),
      pageNumber,
      x: 0.34,
      y: 0.7,
      width: 0.3,
      height: 0.12,
      image: activeSignature,
    }]);
    setError(null);
  };

  const startGesture = (event: React.PointerEvent, placement: SignaturePlacement, modeValue: Gesture["mode"]) => {
    const container = pageContainerRef.current;
    if (!container) return;
    event.preventDefault();
    gestureRef.current = {
      id: placement.id,
      mode: modeValue,
      startX: event.clientX,
      startY: event.clientY,
      original: placement,
      container: container.getBoundingClientRect(),
    };
  };

  const applySignatures = async () => {
    if (!file || !pdf || placements.length === 0) return;
    setWorking(true);
    setProgress(5);
    setError(null);
    setSuccess(false);
    try {
      const sourceBytes = new Uint8Array(await file.arrayBuffer());
      const document = await PDFDocument.load(sourceBytes);
      for (const [index, placement] of placements.entries()) {
        const viewport = viewportRef.current[placement.pageNumber];
        let normalizedImage = placement.image;
        if (stampDate) normalizedImage = await addDateToSignature(normalizedImage);
        const embedded = await document.embedPng(dataUrlBytes(normalizedImage));
        const viewportWidth = viewport?.width ?? previewSize.width;
        const viewportHeight = viewport?.height ?? previewSize.height;
        const topLeft = viewport?.convertToPdfPoint(placement.x * viewportWidth, placement.y * viewportHeight);
        const bottomRight = viewport?.convertToPdfPoint((placement.x + placement.width) * viewportWidth, (placement.y + placement.height) * viewportHeight);
        if (!topLeft || !bottomRight) throw new Error("The signature position could not be mapped onto the PDF page.");
        const x = Math.min(topLeft[0], bottomRight[0]);
        const y = Math.min(topLeft[1], bottomRight[1]);
        const width = Math.abs(bottomRight[0] - topLeft[0]);
        const height = Math.abs(bottomRight[1] - topLeft[1]);
        const pageIndex = placement.pageNumber - 1;

        if (flatten) {
          document.getPage(pageIndex).drawImage(embedded, { x, y, width, height });
        } else {
          await createStampAnnotation(document, pageIndex, embedded, x, y, width, height);
        }
        setProgress(Math.round(5 + ((index + 1) / placements.length) * 80));
      }
      const output = await document.save();
      const outputBytes = new Uint8Array(output.length);
      outputBytes.set(output);
      saveAs(new Blob([outputBytes.buffer], { type: "application/pdf" }), `${outputBaseName(file.name)}-signed.pdf`);
      setProgress(100);
      setSuccess(true);
    } catch (applyError) {
      const message = applyError instanceof Error ? applyError.message.toLowerCase() : "";
      setError(message.includes("encrypted") || message.includes("password")
        ? "This PDF is password-protected. Remove its password and try again."
        : applyError instanceof Error ? applyError.message : "The signatures could not be applied to this PDF.");
    } finally {
      setWorking(false);
    }
  };

  const pagePlacements = placements.filter((placement) => placement.pageNumber === pageNumber);

  return (
    <ClientToolPage slug="sign-pdf">
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <UploadArea
            multiple={false}
            maxSizeMB={50}
            label="PDF file"
            description="Drop a PDF here or choose a file. Maximum 50 MB and 20 pages."
            onFilesSelected={selectFile}
            onError={setError}
          />
          {file ? <p className="truncate text-sm font-medium text-foreground">{file.name}</p> : null}

          <fieldset>
            <legend className="text-sm font-semibold text-foreground">Create your signature</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["draw", "type", "image"] as const).map((entry) => (
                <button key={entry} type="button" onClick={() => setMode(entry)} className={`rounded-lg border px-2 py-2 text-sm capitalize ${mode === entry ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                  {entry}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-medium text-foreground">
            Signature color
            <select value={inkColor} onChange={(event) => setInkColor(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3">
              <option value="#111827">Black</option>
              <option value="#1d4ed8">Blue</option>
            </select>
          </label>

          {mode === "draw" ? (
            <div>
              <canvas
                ref={signatureCanvasRef}
                width={900}
                height={260}
                className="h-auto w-full touch-none rounded-xl border border-border bg-white"
                aria-label="Draw your signature with a mouse or touch"
                onPointerDown={startDrawing}
                onPointerMove={continueDrawing}
                onPointerUp={finishDrawing}
                onPointerCancel={finishDrawing}
              />
              <button type="button" onClick={() => {
                const canvas = signatureCanvasRef.current;
                canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
                setDrawnSignature(null);
              }} className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground"><Eraser className="h-4 w-4" />Clear signature</button>
            </div>
          ) : null}
          {mode === "type" ? (
            <div className="space-y-3">
              <input value={typedName} onChange={(event) => setTypedName(event.target.value)} maxLength={80} placeholder="Type your name" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
              <select value={fontIndex} onChange={(event) => setFontIndex(Number(event.target.value))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {typedFonts.map((font, index) => <option key={font.label} value={index}>{font.label}</option>)}
              </select>
              {typedSignature ? <img src={typedSignature} alt="Typed signature preview" className="h-24 w-full rounded-xl border border-border bg-white object-contain" /> : null}
            </div>
          ) : null}
          {mode === "image" ? (
            <label className="block cursor-pointer rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              {uploadedSignature ? <img src={uploadedSignature} alt="Uploaded signature preview" className="mx-auto h-20 max-w-full object-contain" /> : "Choose a PNG, JPEG, or WebP image"}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => chooseImage(event.currentTarget.files?.[0])} />
            </label>
          ) : null}

          <button type="button" disabled={!activeSignature || !pdf || !previewReady} onClick={placeSignature} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-primary px-4 text-sm font-semibold text-primary disabled:opacity-50">
            <Plus className="h-4 w-4" />Place signature on page {pageNumber}
          </button>

          <label className="flex items-start gap-3 text-sm text-foreground"><input type="checkbox" checked={flatten} onChange={(event) => setFlatten(event.target.checked)} className="mt-1" /><span><strong>Flatten signatures</strong><span className="block text-xs text-muted-foreground">Bake signature images into page content. Uncheck to add movable stamp annotations.</span></span></label>
          <label className="flex items-center gap-3 text-sm text-foreground"><input type="checkbox" checked={stampDate} onChange={(event) => setStampDate(event.target.checked)} /><span>Auto-stamp today's date next to signatures</span></label>
          <p className="rounded-xl bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">Signatures applied locally in your browser. For legally binding e-signatures use a certified provider.</p>
        </section>

        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4 shadow-sm md:p-6">
          {!pdf ? <p className="py-16 text-center text-sm text-muted-foreground">Upload a PDF to preview pages and place signatures.</p> : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-foreground">Choose a page</h2>
                <span className="text-sm text-muted-foreground">{pageNumber} of {pdf.numPages}</span>
              </div>
              <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
                {thumbnails.map((thumbnail, index) => (
                  <button key={index} type="button" onClick={() => setPageNumber(index + 1)} className={`shrink-0 rounded-xl border p-1 ${pageNumber === index + 1 ? "border-primary ring-2 ring-primary/20" : "border-border"}`} aria-label={`Preview page ${index + 1}`}>
                    <img src={thumbnail} alt={`PDF page ${index + 1}`} className="h-24 w-16 object-contain" />
                    <span className="block pt-1 text-center text-xs">{index + 1}</span>
                  </button>
                ))}
              </div>
              <div ref={pageContainerRef} className="relative mx-auto w-full max-w-3xl overflow-hidden bg-white shadow-md">
                <canvas ref={pageCanvasRef} className="block h-auto w-full" />
                {pagePlacements.map((placement) => (
                  <div
                    key={placement.id}
                    role="button"
                    tabIndex={0}
                    aria-label="Move signature"
                    onPointerDown={(event) => startGesture(event, placement, "move")}
                    className="absolute cursor-move border border-dashed border-primary/70"
                    style={{ left: `${placement.x * 100}%`, top: `${placement.y * 100}%`, width: `${placement.width * 100}%`, height: `${placement.height * 100}%`, touchAction: "none" }}
                  >
                    <img src={placement.image} alt="Signature placement" className="h-full w-full select-none object-fill" draggable={false} />
                    <button type="button" aria-label="Remove signature" onPointerDown={(event) => event.stopPropagation()} onClick={() => setPlacements((current) => current.filter((item) => item.id !== placement.id))} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"><Trash2 className="h-3 w-3" /></button>
                    <button type="button" aria-label="Resize signature" onPointerDown={(event) => startGesture(event, placement, "resize")} className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-primary" />
                  </div>
                ))}
              </div>
            </>
          )}
          {placements.length ? <p className="mt-4 text-sm text-muted-foreground">{placements.length} signature placement{placements.length === 1 ? "" : "s"} added</p> : null}
          {working ? <div className="mt-5" role="status"><div className="mb-2 flex justify-between text-sm text-muted-foreground"><span>Applying signatures locally</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></div> : null}
          {error ? <p className="mt-5 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p> : null}
          {success ? <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700"><Check className="h-4 w-4" />Signed PDF downloaded.</p> : null}
          <button type="button" disabled={!file || placements.length === 0 || working} onClick={() => void applySignatures()} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
            {working ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}{working ? "Applying signatures…" : "Apply and download PDF"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />Your files stay on this device.</p>
        </section>
      </div>
    </ClientToolPage>
  );
}
