import { useEffect, useMemo, useRef, useState } from "react";
import { PageSizes, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { AlertCircle, CheckCircle2, CircleDashed, Download, Eraser, FileSignature, ImagePlus, MousePointer2, Plus, RotateCw, Trash2, UploadCloud } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SignatureMode = "draw" | "type" | "image";

type SignatureItem = {
  id: number;
  type: SignatureMode;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  imageDataUrl?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const resetState = () => {
    setError(null);
    setSignatures([]);
    setSelectedSignatureId(null);
    setPreviewUrl(null);
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
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCountValue = pdfDoc.getPageCount();
      setPageCount(pageCountValue);
      setCurrentPage(1);
      setPdfBytes(new Uint8Array(arrayBuffer));
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
        x: 120,
        y: 240,
        width: 180,
        height: 80,
        rotation: 0,
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
        x: 120,
        y: 240,
        width: 220,
        height: 80,
        rotation: 0,
        text: signatureText || "Signature",
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
          x: 120,
          y: 240,
          width: 220,
          height: 80,
          rotation: 0,
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

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeSignature || activeSignature.pageNumber !== currentPage) return;
    setIsDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setDrawPoints([{ x, y }]);
  };

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setDrawPoints((prev) => [...prev, { x, y }]);
  };

  const handleCanvasPointerUp = () => {
    if (!isDrawing || drawPoints.length < 2) {
      setIsDrawing(false);
      setDrawPoints([]);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const start = drawPoints[0];
    const end = drawPoints[drawPoints.length - 1];
    const width = Math.abs(end.x - start.x) + 20;
    const height = Math.abs(end.y - start.y) + 20;

    if (activeSignature) {
      updateSignature(activeSignature.id, (item) => ({
        ...item,
        x: clamp(start.x - 60, 20, 520),
        y: clamp(start.y - 40, 20, 620),
        width: clamp(width, 80, 320),
        height: clamp(height, 40, 220),
      }));
    }

    setIsDrawing(false);
    setDrawPoints([]);
  };

  const handleSave = async () => {
    if (!file || !pdfBytes) {
      setError("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      const courierItalic = await pdfDoc.embedFont(StandardFonts.CourierOblique);

      for (const signature of signatures) {
        const page = pdfDoc.getPage(signature.pageNumber - 1);
        const { width, height } = page.getSize();
        const normalizedX = (signature.x / 560) * width;
        const normalizedY = (signature.y / 760) * height;
        const normalizedWidth = (signature.width / 560) * width;
        const normalizedHeight = (signature.height / 760) * height;

        const actualY = height - normalizedY - normalizedHeight;

        if (signature.type === "type") {
          const fontToUse = signature.text?.includes("J") ? timesItalic : italicFont;
          page.drawText(signature.text || "Signature", {
            x: normalizedX,
            y: actualY,
            size: 24,
            font: fontToUse,
            color: rgb(0.08, 0.1, 0.15),
          });
        } else if (signature.type === "image" && signature.imageDataUrl) {
          const imageBytes = await fetch(signature.imageDataUrl).then((response) => response.arrayBuffer());
          const image = await pdfDoc.embedPng(imageBytes);
          page.drawImage(image, {
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

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setError(null);
    } catch {
      setError("Unable to save the signed PDF. Please try again.");
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
                    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-white p-3">
                      <img src={previewUrl} alt="PDF preview" className="max-h-[620px] w-full rounded-xl object-contain" />
                      {signatures.filter((item) => item.pageNumber === currentPage).map((signature) => (
                        <div
                          key={signature.id}
                          className={cn("absolute flex items-center justify-center rounded-lg border-2 border-dashed border-primary/60 bg-primary/10 p-2 shadow-sm", selectedSignatureId === signature.id ? "ring-2 ring-primary" : "")}
                          style={{ left: `${(signature.x / 560) * 100}%`, top: `${(signature.y / 760) * 100}%`, width: `${(signature.width / 560) * 100}%`, height: `${(signature.height / 760) * 100}%` }}
                        >
                          <div className="flex items-center justify-center text-center text-xs font-medium text-primary">
                            {signature.type === "type" ? (signature.text || "Signature") : signature.type === "image" ? "Image" : "Draw"}
                          </div>
                        </div>
                      ))}
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
                          <p className="text-xs text-muted-foreground">{signature.text || "Placement ready"}</p>
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
