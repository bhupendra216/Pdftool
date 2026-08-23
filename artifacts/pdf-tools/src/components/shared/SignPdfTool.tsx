import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { AlertCircle, CheckCircle2, CircleDashed, Download, FileSignature, ImagePlus, MousePointer2, Plus, Trash2, UploadCloud } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type SignatureMode = "draw" | "type" | "image";
type SignatureTarget = "current" | "all" | "pages";

type SignatureItem = {
  id: number;
  type: SignatureMode;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  target: SignatureTarget;
  targetPages: number[];
  text?: string;
  imageDataUrl?: string;
  drawDataUrl?: string;
  fontName?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseTargetPages(value: string, pageCount: number) {
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

function dataUrlToBytes(dataUrl: string) {
  const [header, encoded] = dataUrl.split(",");
  if (!encoded) return new Uint8Array();

  const isBase64 = header.includes(";base64");
  const source = isBase64 ? atob(encoded) : decodeURIComponent(encoded);
  const bytes = new Uint8Array(source.length);
  for (let index = 0; index < source.length; index += 1) {
    bytes[index] = source.charCodeAt(index);
  }
  return bytes;
}

export function SignPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [signatureText, setSignatureText] = useState("John Doe");
  const [fontName, setFontName] = useState("HelveticaOblique");
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [signatures, setSignatures] = useState<SignatureItem[]>([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([]);
  const sideDrawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sideDrawDataUrlRef = useRef<string | null>(null);
  const isSideDrawingRef = useRef(false);
  const sideDrawPointsRef = useRef<{ x: number; y: number }[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isPdfDocumentReady, setIsPdfDocumentReady] = useState(false);
  // `savePdfBytes` holds a separate, non-transferred copy used for PDF-lib operations.
  // pdfjs may transfer/detach buffers when using workers, so keep an independent copy
  // for the save path to avoid "detached ArrayBuffer" errors.
  const [savePdfBytes, setSavePdfBytes] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewBoxSize, setPreviewBoxSize] = useState({ width: 560, height: 760 });
  const [renderedPageSize, setRenderedPageSize] = useState({ width: 560, height: 760 });
  const [zoomMode, setZoomMode] = useState<"fitWidth" | "fitPage" | "custom">("fitWidth");
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [signatureTarget, setSignatureTarget] = useState<SignatureTarget>("current");
  const [signatureTargetText, setSignatureTargetText] = useState("1");
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof getDocument>['promise']> | null>(null);
  const drawCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const fonts = [
    { label: "Handwritten 1", value: "HelveticaOblique" },
    { label: "Handwritten 2", value: "TimesRomanItalic" },
    { label: "Handwritten 3", value: "CourierOblique" },
  ];

  const activeSignature = useMemo(
    () => signatures.find((item) => item.id === selectedSignatureId) ?? null,
    [selectedSignatureId, signatures],
  );

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updatePreviewBoxSize = () => {
      const rect = container.getBoundingClientRect();
      setPreviewBoxSize({ width: rect.width, height: rect.height });
    };

    updatePreviewBoxSize();
    const observer = new ResizeObserver(updatePreviewBoxSize);
    observer.observe(container);
    window.addEventListener("resize", updatePreviewBoxSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePreviewBoxSize);
    };
  }, [previewUrl, currentPage]);

  const setSignatureCanvasRef = (signatureId: number) => (element: HTMLCanvasElement | null) => {
    drawCanvasRefs.current[signatureId] = element;
  };

  // Drag / resize interaction refs
  const draggingRef = useRef<{ id: number; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizingRef = useRef<{ id: number; startX: number; startY: number; origW: number; origH: number } | null>(null);

  useEffect(() => {
    if (!pdfBytes) {
      pdfDocRef.current = null;
      setIsPdfDocumentReady(false);
      return;
    }

    let cancelled = false;
    pdfDocRef.current = null;
    setIsPdfDocumentReady(false);

    getDocument({ data: pdfBytes as Uint8Array }).promise
      .then((pdf) => {
        if (!cancelled) {
          pdfDocRef.current = pdf;
          setIsPdfDocumentReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load the selected PDF.");
          setIsPdfDocumentReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pdfBytes]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !file || !pdfBytes || !isPdfDocumentReady || !pdfDocRef.current) {
      setRenderedPageSize({ width: 560, height: 760 });
      return;
    }

    let isActive = true;

    const renderCurrentPage = async () => {
      setError(null);
      setIsPageRendering(true);
      const pdf = pdfDocRef.current;
      if (!pdf) {
        setIsPageRendering(false);
        return;
      }

      const page = await pdf.getPage(currentPage);
      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(280, previewBoxSize.width - 24);
      const availableHeight = Math.max(320, previewBoxSize.height - 24);

      const fitWidthScale = availableWidth / baseViewport.width;
      const fitPageScale = Math.min(fitWidthScale, availableHeight / baseViewport.height);
      const effectiveScale = zoomMode === "fitPage" ? fitPageScale : zoomMode === "fitWidth" ? fitWidthScale : Math.max(0.1, zoomPercent / 100);
      const normalizedScale = Math.min(Math.max(effectiveScale, 0.25), 4);
      const viewport = page.getViewport({ scale: normalizedScale });
      const context = canvas.getContext("2d");
      if (!context || !isActive) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(viewport.width * ratio);
      canvas.height = Math.round(viewport.height * ratio);
      canvas.style.width = `${Math.round(viewport.width)}px`;
      canvas.style.height = `${Math.round(viewport.height)}px`;
      const wrapper = canvasWrapperRef.current;
      if (wrapper) {
        wrapper.style.width = `${Math.round(viewport.width)}px`;
        wrapper.style.height = `${Math.round(viewport.height)}px`;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      if (!isActive) return;

      setRenderedPageSize({ width: viewport.width, height: viewport.height });
      setZoomPercent(Math.round(normalizedScale * 100));
      setIsPageRendering(false);
    };

    renderCurrentPage().catch(() => {
      if (isActive) {
        setError("Unable to preview the selected PDF page.");
        setIsPageRendering(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [currentPage, file, pdfBytes, isPdfDocumentReady, previewBoxSize.height, previewBoxSize.width, zoomMode, zoomPercent]);

  useEffect(() => {
    const canvas = activeSignature && activeSignature.type === "draw" ? drawCanvasRefs.current[activeSignature.id] : null;
    if (!canvas || !activeSignature || activeSignature.type !== "draw") {
      return;
    }

    const context = canvas.getContext("2d");
    const boxWidth = Math.max(1, Math.round(activeSignature.width));
    const boxHeight = Math.max(1, Math.round(activeSignature.height));
    canvas.width = boxWidth;
    canvas.height = boxHeight;
    canvas.style.width = `${boxWidth}px`;
    canvas.style.height = `${boxHeight}px`;

    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (activeSignature.drawDataUrl) {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = activeSignature.drawDataUrl;
    }
  }, [activeSignature?.id, activeSignature?.drawDataUrl, activeSignature?.width, activeSignature?.height]);

  const resetState = () => {
    setError(null);
    setSignatures([]);
    setSelectedSignatureId(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    pdfDocRef.current = null;
    setIsPdfDocumentReady(false);
    setPdfBytes(null);
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const handleUpload = async (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    resetState();
    setFile(selectedFile);
    setIsLoading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      // Create two independent copies: one for pdf-lib (save) and one for pdfjs preview.
      const saveCopy = new Uint8Array(arrayBuffer.slice(0));
      const previewCopy = new Uint8Array(arrayBuffer.slice(0));
      const pdfDoc = await PDFDocument.load(saveCopy);
      const pageCountValue = pdfDoc.getPageCount();
      setPageCount(pageCountValue);
      setCurrentPage(1);
      setSavePdfBytes(saveCopy);
      setPdfBytes(previewCopy);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } catch {
      setError("Unable to read the uploaded PDF. Please try another file.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const addSignature = () => {
    if (!pdfBytes) return;
    if (mode === "draw") {
      const newItem: SignatureItem = {
        id: Date.now(),
        type: "draw",
        pageNumber: currentPage,
        x: Math.max(24, renderedPageSize.width / 4),
        y: Math.max(24, renderedPageSize.height / 4),
        width: Math.max(140, renderedPageSize.width / 4),
        height: Math.max(80, renderedPageSize.height / 8),
        rotation: 0,
        target: signatureTarget,
        targetPages: signatureTarget === "pages" ? parseTargetPages(signatureTargetText, pageCount) : [],
      };
      setSignatures((prev) => [...prev, newItem]);
      setSelectedSignatureId(newItem.id);
      return;
    }

    if (mode === "type") {
      const newItem: SignatureItem = {
        id: Date.now(),
        type: "type",
        pageNumber: currentPage,
        x: Math.max(24, renderedPageSize.width / 4),
        y: Math.max(24, renderedPageSize.height / 4),
        width: Math.max(180, renderedPageSize.width / 3),
        height: Math.max(80, renderedPageSize.height / 8),
        rotation: 0,
        target: signatureTarget,
        targetPages: signatureTarget === "pages" ? parseTargetPages(signatureTargetText, pageCount) : [],
        text: signatureText || "Signature",
        fontName,
      };
      setSignatures((prev) => [...prev, newItem]);
      setSelectedSignatureId(newItem.id);
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg";
    input.onchange = async () => {
      const selected = input.files?.[0];
      if (!selected) return;
      const reader = new FileReader();
      reader.onload = () => {
        const newItem: SignatureItem = {
          id: Date.now(),
          type: "image",
          pageNumber: currentPage,
          x: Math.max(24, renderedPageSize.width / 4),
          y: Math.max(24, renderedPageSize.height / 4),
          width: Math.max(180, renderedPageSize.width / 3),
          height: Math.max(80, renderedPageSize.height / 8),
          rotation: 0,
          target: signatureTarget,
          targetPages: signatureTarget === "pages" ? parseTargetPages(signatureTargetText, pageCount) : [],
          imageDataUrl: reader.result as string,
        };
        setSignatures((prev) => [...prev, newItem]);
        setSelectedSignatureId(newItem.id);
      };
      reader.readAsDataURL(selected);
    };
    input.click();
  };

  const updateSignature = (id: number, updater: (item: SignatureItem) => SignatureItem) => {
    setSignatures((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const deleteSignature = (id: number) => {
    setSignatures((prev) => prev.filter((item) => item.id !== id));
    setSelectedSignatureId((prev) => (prev === id ? null : prev));
  };

  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!activeSignature || activeSignature.pageNumber !== currentPage) return;

    // Use the actual canvas bounding rect so clicks are measured against the
    // displayed PDF page rather than the outer container (which may be
    // larger due to flex centering).
    const canvasEl = previewCanvasRef.current;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1)) * renderedPageSize.width, 8, renderedPageSize.width - 8);
    const y = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1)) * renderedPageSize.height, 8, renderedPageSize.height - 8);

    updateSignature(activeSignature.id, (item) => ({ ...item, x, y }));
  };

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeSignature || activeSignature.pageNumber !== currentPage || activeSignature.type !== "draw") return;
    setIsDrawing(true);
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(17, 24, 39, 0.95)";
    context.lineWidth = Math.max(1.5, (canvas.width / Math.max(rect.width, 1)) * 2.5);
    context.beginPath();
    context.moveTo(x, y);
    setDrawPoints([{ x, y }]);
  };

  // Side-panel draw handlers
  const handleSidePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isSideDrawingRef.current = true;
    sideDrawPointsRef.current = [{ x, y }];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(17,24,39,0.95)';
    ctx.lineWidth = Math.max(2, canvas.width / 60);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSidePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSideDrawingRef.current) return;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
    sideDrawPointsRef.current.push({ x, y });
  };

  const handleSidePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sideDrawCanvasRef.current) return;
    const canvas = sideDrawCanvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    sideDrawDataUrlRef.current = dataUrl;
    isSideDrawingRef.current = false;
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineTo(x, y);
    context.stroke();
    setDrawPoints((prev) => [...prev, { x, y }]);
    const dataUrl = canvas.toDataURL("image/png");
    if (activeSignature) {
      updateSignature(activeSignature.id, (item) => ({ ...item, drawDataUrl: dataUrl }));
    }
  };

  const handleCanvasPointerUp = () => {
    setIsDrawing(false);
    setDrawPoints([]);
  };

  const clearSideDrawing = () => {
    const c = sideDrawCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0,c.width,c.height);
    sideDrawDataUrlRef.current = null;
    sideDrawPointsRef.current = [];
  };

  const useSideDrawingAsSignature = () => {
    if (!sideDrawDataUrlRef.current) return;
    const newItem: SignatureItem = {
      id: Date.now(),
      type: 'draw',
      pageNumber: currentPage,
      x: Math.max(24, renderedPageSize.width / 4),
      y: Math.max(24, renderedPageSize.height / 4),
      width: Math.max(140, renderedPageSize.width / 4),
      height: Math.max(80, renderedPageSize.height / 8),
      rotation: 0,
      target: signatureTarget,
      targetPages: signatureTarget === 'pages' ? parseTargetPages(signatureTargetText, pageCount) : [],
      drawDataUrl: sideDrawDataUrlRef.current,
    };
    setSignatures(prev => [...prev, newItem]);
    setSelectedSignatureId(newItem.id);
  };

  // Setup side draw canvas pixel size
  useEffect(() => {
    const c = sideDrawCanvasRef.current;
    if (!c) return;
    const resize = () => {
      const rect = c.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      c.width = Math.max(100, Math.round(rect.width * ratio));
      c.height = Math.max(40, Math.round(rect.height * ratio));
      const ctx = c.getContext('2d');
      if (ctx) ctx.scale(ratio, ratio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => ro.disconnect();
  }, [mode]);

  // Dragging / resizing handlers
  const startDrag = (ev: React.PointerEvent, signature: SignatureItem) => {
    ev.stopPropagation();
    const canvasRect = canvasWrapperRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    // compute pointer offset inside the signature box so the box doesn't jump
    const wrapperLeft = canvasRect.left;
    const wrapperTop = canvasRect.top;
    const boxLeftPx = wrapperLeft + (signature.x / renderedPageSize.width) * canvasRect.width;
    const boxTopPx = wrapperTop + (signature.y / renderedPageSize.height) * canvasRect.height;
    const pointerOffsetX = ev.clientX - boxLeftPx;
    const pointerOffsetY = ev.clientY - boxTopPx;
    draggingRef.current = { id: signature.id, startX: ev.clientX, startY: ev.clientY, origX: signature.x, origY: signature.y } as any;
    // store pointer offsets separately on the ref object
    (draggingRef.current as any).offsetX = pointerOffsetX;
    (draggingRef.current as any).offsetY = pointerOffsetY;
    const onMove = (e: PointerEvent) => {
      const d = draggingRef.current;
      if (!d) return;
      // compute new top-left so pointer keeps same offset inside box
      const pointerX = e.clientX - (d as any).offsetX;
      const pointerY = e.clientY - (d as any).offsetY;
      const newX = clamp(((pointerX - canvasRect.left) / canvasRect.width) * renderedPageSize.width, 8, renderedPageSize.width - 8);
      const newY = clamp(((pointerY - canvasRect.top) / canvasRect.height) * renderedPageSize.height, 8, renderedPageSize.height - 8);
      updateSignature(d.id, (item) => ({ ...item, x: newX, y: newY }));
    };
    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); draggingRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startResize = (ev: React.PointerEvent, signature: SignatureItem) => {
    ev.stopPropagation();
    const canvasRect = canvasWrapperRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    // compute initial box right/bottom positions and pointer offset so resize doesn't jump
    const wrapperLeft2 = canvasRect.left;
    const wrapperTop2 = canvasRect.top;
    const boxLeftPx2 = wrapperLeft2 + (signature.x / renderedPageSize.width) * canvasRect.width;
    const boxTopPx2 = wrapperTop2 + (signature.y / renderedPageSize.height) * canvasRect.height;
    const boxRightPx = boxLeftPx2 + (signature.width / renderedPageSize.width) * canvasRect.width;
    const boxBottomPx = boxTopPx2 + (signature.height / renderedPageSize.height) * canvasRect.height;
    const pointerOffsetRight = boxRightPx - ev.clientX;
    const pointerOffsetBottom = boxBottomPx - ev.clientY;
    resizingRef.current = { id: signature.id, startX: ev.clientX, startY: ev.clientY, origW: signature.width, origH: signature.height } as any;
    (resizingRef.current as any).offsetRight = pointerOffsetRight;
    (resizingRef.current as any).offsetBottom = pointerOffsetBottom;
    const onMove = (e: PointerEvent) => {
      const r = resizingRef.current;
      if (!r) return;
      // compute new width/height so pointer remains at the same distance from bottom-right
      const pointerX = e.clientX + (r as any).offsetRight;
      const pointerY = e.clientY + (r as any).offsetBottom;
      const newW = clamp(((pointerX - canvasRect.left) / canvasRect.width) * renderedPageSize.width - signature.x, 8, renderedPageSize.width);
      const newH = clamp(((pointerY - canvasRect.top) / canvasRect.height) * renderedPageSize.height - signature.y, 8, renderedPageSize.height);
      updateSignature(r.id, (item) => ({ ...item, width: newW, height: newH }));
    };
    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); resizingRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleSave = async () => {
    if (!file || !savePdfBytes) {
      setError("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.debug("sign-pdf: save bytes", savePdfBytes ? { byteLength: savePdfBytes.byteLength, isUint8Array: savePdfBytes instanceof Uint8Array } : null);
      const pdfDoc = await PDFDocument.load(savePdfBytes as Uint8Array);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      const courierItalic = await pdfDoc.embedFont(StandardFonts.CourierOblique);
      const previewWidth = renderedPageSize.width || 560;
      const previewHeight = renderedPageSize.height || 760;

      for (const signature of signatures) {
        const targetPages = signature.target === "all"
          ? Array.from({ length: pageCount }, (_, index) => index + 1)
          : signature.target === "pages"
          ? signature.targetPages.filter((page) => page >= 1 && page <= pageCount)
          : [signature.pageNumber];

        for (const targetPage of targetPages) {
          const page = pdfDoc.getPage(targetPage - 1);
          const { width, height } = page.getSize();
          const normalizedX = (signature.x / previewWidth) * width;
          const normalizedY = (signature.y / previewHeight) * height;
          const normalizedWidth = (signature.width / previewWidth) * width;
          const normalizedHeight = (signature.height / previewHeight) * height;
          const actualY = height - normalizedY - normalizedHeight;

          if (signature.type === "type") {
            const fontToUse = signature.fontName === "TimesRomanItalic"
              ? timesItalic
              : signature.fontName === "CourierOblique"
              ? courierItalic
              : italicFont;

            page.drawText(signature.text || "Signature", {
              x: normalizedX,
              y: actualY,
              size: 24,
              font: fontToUse,
              color: rgb(0.08, 0.1, 0.15),
            });
          } else if (signature.type === "image" && signature.imageDataUrl) {
            const imageBytes = dataUrlToBytes(signature.imageDataUrl);
            const imageMime = signature.imageDataUrl.split(",")[0] ?? "";
            const isJpeg = imageMime.includes("image/jpeg") || imageMime.includes("image/jpg");
            const image = isJpeg ? await pdfDoc.embedJpg(imageBytes) : await pdfDoc.embedPng(imageBytes);
            const imageWidth = image.width;
            const imageHeight = image.height;
            const aspectRatio = imageWidth / imageHeight;
            let drawWidth = normalizedWidth;
            let drawHeight = normalizedHeight;
            if (drawWidth / drawHeight > aspectRatio) {
              drawWidth = drawHeight * aspectRatio;
            } else {
              drawHeight = drawWidth / aspectRatio;
            }
            page.drawImage(image, {
              x: normalizedX + (normalizedWidth - drawWidth) / 2,
              y: actualY + (normalizedHeight - drawHeight) / 2,
              width: drawWidth,
              height: drawHeight,
            });
          } else if (signature.type === "draw" && signature.drawDataUrl) {
            const drawImageBytes = dataUrlToBytes(signature.drawDataUrl);
            const drawImage = await pdfDoc.embedPng(drawImageBytes);
            page.drawImage(drawImage, {
              x: normalizedX,
              y: actualY,
              width: normalizedWidth,
              height: normalizedHeight,
            });
          } else {
            page.drawText("Sign", {
              x: normalizedX,
              y: actualY,
              size: 18,
              font,
              color: rgb(0.08, 0.1, 0.15),
            });
          }
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // expose for debugging/tests
      try {
        // @ts-ignore - debug hook
        (window as any).__lastDownloadUrl = url;
      } catch (e) {
        // ignore
      }
      setDownloadUrl(url);

      // trigger an immediate download for convenience
      try {
        const fileName = (file && file.name) ? file.name.replace(/\.pdf$/i, "") + "-signed.pdf" : "signed.pdf";
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        // append to DOM to make click work in some browsers
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        // if auto-download fails, user can still use Preview output
      }
      setError(null);
    } catch (err) {
      console.error("Sign PDF save failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Unable to save the signed PDF: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-4 lg:py-8">
      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              <FileSignature className="mr-2 h-4 w-4" />
              New tool
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">Sign your PDF professionally</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Upload a PDF, add signatures using drawing, typed text, or an uploaded image, and place them anywhere on any page before exporting the finished document.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Upload PDF</p>
                    <p className="text-sm text-muted-foreground">Securely sign in your browser without sending files to third parties.</p>
                  </div>
                  <Button variant="outline" onClick={() => uploadInputRef.current?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Choose PDF
                  </Button>
                </div>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Button variant={mode === "draw" ? "default" : "outline"} onClick={() => setMode("draw")}>
                  <MousePointer2 className="mr-2 h-4 w-4" />
                  Draw
                </Button>
                <Button variant={mode === "type" ? "default" : "outline"} onClick={() => setMode("type")}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  Type
                </Button>
                <Button variant={mode === "image" ? "default" : "outline"} onClick={() => setMode("image")}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Image
                </Button>
              </div>

              {mode === "type" ? (
                <div className="space-y-3 rounded-3xl border border-border/70 bg-background/70 p-4">
                  <Label htmlFor="signature-text">Signature text</Label>
                  <Textarea id="signature-text" value={signatureText} onChange={(event) => setSignatureText(event.target.value)} rows={3} />
                  <Label htmlFor="signature-font">Handwriting style</Label>
                  <select id="signature-font" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" value={fontName} onChange={(event) => setFontName(event.target.value)}>
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              {mode === 'draw' ? (
                <div className="space-y-3 rounded-3xl border border-border/70 bg-background/70 p-4">
                  <Label>Draw signature</Label>
                  <div className="flex flex-col gap-2">
                    <canvas ref={sideDrawCanvasRef} className="w-full h-40 rounded-xl border" onPointerDown={handleSidePointerDown as any} onPointerMove={handleSidePointerMove as any} onPointerUp={handleSidePointerUp as any} onPointerLeave={handleSidePointerUp as any} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { clearSideDrawing(); }}>Clear</Button>
                      <Button size="sm" onClick={() => { useSideDrawingAsSignature(); }}>Use drawing as signature</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Draw here; click "Use drawing as signature" to create a signature you can position on the page.</p>
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Placement controls</p>
                  <Badge variant="secondary">Page {currentPage} / {pageCount}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((value) => clamp(value - 1, 1, pageCount))} disabled={pageCount <= 1}>
                    Previous page
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((value) => clamp(value + 1, 1, pageCount))} disabled={pageCount <= 1}>
                    Next page
                  </Button>
                  <Button size="sm" onClick={addSignature} disabled={!file}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add signature
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  <Label htmlFor="signature-target">Apply signature to</Label>
                  <select id="signature-target" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" value={signatureTarget} onChange={(event) => setSignatureTarget(event.target.value as SignatureTarget)}>
                    <option value="current">Current page</option>
                    <option value="all">All pages</option>
                    <option value="pages">Specific pages</option>
                  </select>
                  {signatureTarget === "pages" ? (
                    <>
                      <Label htmlFor="signature-target-pages">Page numbers</Label>
                      <input id="signature-target-pages" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" value={signatureTargetText} onChange={(event) => setSignatureTargetText(event.target.value)} placeholder="1,3,5" />
                    </>
                  ) : null}
                </div>
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Live preview</p>
                  {signatures.length > 0 ? <Badge variant="secondary">{signatures.length} placed</Badge> : null}
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30 p-2">
                  {previewUrl ? (
                    <div ref={previewContainerRef} className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-white p-3" onClick={handlePreviewClick}>
                      <div ref={canvasWrapperRef} className="relative" style={{ display: 'inline-block' }}>
                        <canvas ref={previewCanvasRef} className="max-h-[620px] w-full rounded-xl object-contain" />
                        {signatures.filter((item) => item.pageNumber === currentPage).map((signature) => (
                          <div
                              key={signature.id}
                              className={cn("absolute flex items-center justify-center rounded-lg border-2 border-dashed border-primary/60 bg-primary/10 p-2 shadow-sm", selectedSignatureId === signature.id ? "ring-2 ring-primary" : "")}
                              style={{ left: `${(signature.x / Math.max(renderedPageSize.width, 1)) * 100}%`, top: `${(signature.y / Math.max(renderedPageSize.height, 1)) * 100}%`, width: `${(signature.width / Math.max(renderedPageSize.width, 1)) * 100}%`, height: `${(signature.height / Math.max(renderedPageSize.height, 1)) * 100}%` }}
                              onClick={(event) => { event.stopPropagation(); setSelectedSignatureId(signature.id); }}
                            >
                            {/* Drag handle */}
                            <div
                              onPointerDown={(e) => startDrag(e, signature)}
                              className="absolute left-1 top-1 h-4 w-4 rounded bg-white/90 border border-border/60 shadow-sm"
                              style={{ zIndex: 30, cursor: 'grab' }}
                            />
                            {signature.type === "draw" ? (
                              <canvas
                                ref={setSignatureCanvasRef(signature.id)}
                                className="absolute inset-0 h-full w-full rounded-lg"
                                style={{ pointerEvents: 'auto', cursor: signature.type === 'draw' ? 'crosshair' : 'auto' }}
                                onPointerDown={handleCanvasPointerDown}
                                onPointerMove={handleCanvasPointerMove}
                                onPointerUp={handleCanvasPointerUp}
                                onPointerLeave={handleCanvasPointerUp}
                              />
                            ) : null}
                            {/* Resize handle */}
                            <div
                              onPointerDown={(e) => startResize(e, signature)}
                              className="absolute right-1 bottom-1 h-4 w-4 rounded bg-white/90 border border-border/60 shadow-sm"
                              style={{ zIndex: 30, cursor: 'nwse-resize' }}
                            />
                            <div className="pointer-events-none flex items-center justify-center text-center text-xs font-medium text-primary">
                              {signature.type === "type" ? (signature.text || "Signature") : signature.type === "image" ? "Image" : "Draw"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/60 text-center text-sm text-muted-foreground">
                      Upload a PDF to begin signing.
                    </div>
                  )}
                </div>
              </div>

              {signatures.length > 0 ? (
                <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
                  <p className="mb-3 text-sm font-semibold text-foreground">Placed signatures</p>
                  <div className="space-y-2">
                    {signatures.map((signature) => (
                      <div key={signature.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {signature.type === "type" ? "Typed" : signature.type === "image" ? "Image" : "Drawn"} signature · Page {signature.pageNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {signature.target === "all" ? "All pages" : signature.target === "pages" ? `Pages ${signature.targetPages.join(", ")}` : `Current page only`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSignatureId(signature.id)}>
                            <CircleDashed className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteSignature(signature.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSave} disabled={!file || isLoading}>
                  {isLoading ? "Preparing PDF..." : <><Download className="mr-2 h-4 w-4" /> Download signed PDF</>}
                </Button>
                <Button variant="outline" disabled={!downloadUrl} onClick={() => downloadUrl && window.open(downloadUrl, "_blank")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Preview output
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
