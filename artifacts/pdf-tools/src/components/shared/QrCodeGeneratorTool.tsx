import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColorTypes, PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { AlertCircle, CheckCircle2, Copy, Download, QrCode as QrCodeIcon, RefreshCw, Share2, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function sanitizeFilename(value: string) {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

  return base || "qr-code";
}

function isValidUrl(value: string) {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function QrCodeGeneratorTool() {
  const [link, setLink] = useState("");
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadPngUrl, setDownloadPngUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("qr-code");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const normalizedLink = useMemo(() => link.trim(), [link]);
  const normalizedProjectName = useMemo(() => projectName.trim(), [projectName]);

  const generateQrCode = useCallback(async (value: string, projectValue: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter a link to generate a QR code.");
      setPreviewUrl(null);
      setDownloadPngUrl(null);
      setIsGenerating(false);
      return;
    }

    if (!isValidUrl(trimmedValue)) {
      setError("Please provide a valid URL starting with http:// or https://.");
      setPreviewUrl(null);
      setDownloadPngUrl(null);
      setIsGenerating(false);
      return;
    }

    setError(null);
    setIsGenerating(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGenerating(false);
      return;
    }

    canvas.width = 1200;
    canvas.height = 1200;

    await QRCode.toCanvas(canvas, trimmedValue, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 16,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
      type: "image/png",
    });

    const pngUrl = canvas.toDataURL("image/png");
    setPreviewUrl(pngUrl);
    setDownloadPngUrl(pngUrl);
    setFilename(sanitizeFilename(projectValue || new URL(trimmedValue).hostname));
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    if (!normalizedLink) {
      setError(null);
      setPreviewUrl(null);
      setDownloadPngUrl(null);
      setFilename("qr-code");
      return;
    }

    if (!isValidUrl(normalizedLink)) {
      setError("Please provide a valid URL starting with http:// or https://.");
      setPreviewUrl(null);
      setDownloadPngUrl(null);
      return;
    }

    const timer = window.setTimeout(() => {
      void generateQrCode(normalizedLink, normalizedProjectName);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [generateQrCode, normalizedLink, normalizedProjectName]);

  const handleGenerateAnother = () => {
    setLink("");
    setProjectName("");
    setError(null);
    setPreviewUrl(null);
    setDownloadPngUrl(null);
    setFilename("qr-code");
  };

  const handleCopyLink = async () => {
    if (!normalizedLink) return;

    try {
      await navigator.clipboard.writeText(normalizedLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  };

  const handleShare = async () => {
    if (!normalizedLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: normalizedProjectName || "PDFKira QR Code",
          text: `Scan this QR code to open ${normalizedLink}`,
          url: normalizedLink,
        });
      } catch {
        setError("Sharing was canceled or unavailable on this device.");
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleDownloadPng = () => {
    if (!downloadPngUrl) return;

    const link = document.createElement("a");
    link.href = downloadPngUrl;
    link.download = `${filename}.png`;
    link.click();
  };

  const handleDownloadPdf = async () => {
    if (!downloadPngUrl) return;

    const pdfDoc = await PDFDocument.create();
    const pngBytes = await fetch(downloadPngUrl).then((response) => response.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngBytes);
    const page = pdfDoc.addPage([792, 1120]);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const imageWidth = 560;
    const imageHeight = 560;
    const x = (pageWidth - imageWidth) / 2;
    const y = (pageHeight - imageHeight) / 2 + 80;

    page.drawImage(pngImage, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });

    if (normalizedProjectName) {
      page.drawText(normalizedProjectName, {
        x: 80,
        y: 140,
        size: 24,
        color: { type: ColorTypes.RGB, red: 0.07, green: 0.1, blue: 0.18 },
      });
    }

    page.drawText("Generated by PDFKira", {
      x: 80,
      y: 90,
      size: 12,
      color: { type: ColorTypes.RGB, red: 0.4, green: 0.45, blue: 0.55 },
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-4 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                New tool
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">Create a printable QR code</CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground">
              Enter a link, add an optional project name, and instantly generate a high-quality QR code ready for print, sharing, or download.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name (optional)</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Marketing launch, Product page, Event signup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-link">Link / URL</Label>
                <Input
                  id="qr-link"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  placeholder="https://example.com"
                  className={cn(error ? "border-destructive" : "")}
                />
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => void generateQrCode(normalizedLink, normalizedProjectName)} disabled={!normalizedLink || isGenerating}>
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
                <Button variant="outline" type="button" onClick={handleGenerateAnother}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate another
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <QrCodeIcon className="h-5 w-5 text-primary" />
              Live preview
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Your QR code updates instantly as soon as the URL is valid.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4 sm:p-6">
              <div className="mx-auto flex max-w-[320px] flex-col items-center justify-center gap-4">
                <div className="flex w-full items-center justify-center rounded-2xl bg-white p-4 shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Generated QR code for the entered URL and project name" className="h-full w-full max-w-[260px] rounded-xl object-contain" />
                  ) : (
                    <div className="flex h-[260px] w-[260px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/40 text-center text-sm text-muted-foreground">
                      Enter a valid URL to create your QR code.
                    </div>
                  )}
                </div>
                {previewUrl ? (
                  <div className="w-full text-center">
                    <p className="text-sm font-semibold text-foreground">{normalizedProjectName || "QR Code"}</p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">{normalizedLink}</p>
                  </div>
                ) : null}
              </div>
            </div>

            {previewUrl ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">PNG & PDF download</Badge>
                  <Badge variant="secondary">High-resolution output</Badge>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={handleDownloadPng}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void handleDownloadPdf()}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={handleCopyLink}>
                    {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? "Copied" : "Copy link"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void handleShare()}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share QR code
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-foreground">Ready for print and digital sharing</p>
            <p className="text-sm text-muted-foreground">Export crisp QR codes with your chosen project name as the file label.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Validated link • PNG + PDF • Light and dark mode ready
          </div>
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
