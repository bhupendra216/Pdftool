import heic2any from "heic2any";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { AlertCircle, Download, Image as ImageIcon, Loader2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { removeBackgroundToPng } from "@/lib/background-removal";
import { UploadArea } from "@/components/shared/UploadArea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SUPPORTED_FORMATS = "JPG, JPEG, PNG, WebP, GIF, BMP, AVIF, SVG, HEIC, HEIF";
const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/svg+xml,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.svg,.heic,.heif";
const MAX_SAFE_FILE_SIZE_BYTES = 500 * 1024 * 1024;

const SUPPORTED_PREVIEW_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".avif", ".svg", ".heic", ".heif"];
const SUPPORTED_PREVIEW_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);

type ToolStatus = "idle" | "processing" | "success" | "error";
type ItemStatus = "pending" | "processing" | "done" | "error";
type OriginalFileFormat = "png" | "jpeg" | "webp" | "gif" | "bmp" | "avif" | "heic" | "heif";

const stripExtension = (fileName: string) => fileName.replace(/\.[^/.]+$/, "");
const getOriginalFormatFromFile = (file: File | null, mimeTypeOverride?: string | null): OriginalFileFormat | null => {
  const mimeType = (mimeTypeOverride || file?.type || "").toLowerCase().split(";")[0].trim();

  if (mimeType) {
    if (mimeType === "image/png" || mimeType === "image/x-png") return "png";
    if (mimeType === "image/jpeg" || mimeType === "image/jpg" || mimeType === "image/pjpeg") return "jpeg";
    if (mimeType === "image/webp") return "webp";
    if (mimeType === "image/gif") return "gif";
    if (mimeType === "image/bmp" || mimeType === "image/x-ms-bmp") return "bmp";
    if (mimeType === "image/avif") return "avif";
    if (mimeType === "image/heic") return "heic";
    if (mimeType === "image/heif") return "heif";
  }

  const lowerName = (file?.name || "").toLowerCase();
  if (lowerName.endsWith(".png")) return "png";
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) return "jpeg";
  if (lowerName.endsWith(".webp")) return "webp";
  if (lowerName.endsWith(".gif")) return "gif";
  if (lowerName.endsWith(".bmp")) return "bmp";
  if (lowerName.endsWith(".avif")) return "avif";
  if (lowerName.endsWith(".heic")) return "heic";
  if (lowerName.endsWith(".heif")) return "heif";

  return null;
};

const isHeicFile = (file: File) => {
  const lowerType = file.type.toLowerCase();
  const lowerName = file.name.toLowerCase();
  return lowerType === "image/heic" || lowerType === "image/heif" || lowerName.endsWith(".heic") || lowerName.endsWith(".heif");
};

async function convertHeicToPng(file: File): Promise<File> {
  const converted = await heic2any({ blob: file, toType: "image/png", quality: 1 });
  const firstResult = Array.isArray(converted) ? converted[0] : converted;

  if (!(firstResult instanceof Blob)) {
    throw new Error("This format isn't supported for preview.");
  }

  return new File([firstResult], `${stripExtension(file.name)}.png`, {
    type: "image/png",
    lastModified: file.lastModified,
  });
}

const isSupportedPreviewFormat = (file: File) => {
  const fileType = file.type.toLowerCase();
  if (SUPPORTED_PREVIEW_TYPES.has(fileType)) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return SUPPORTED_PREVIEW_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
};

async function assertPreviewDecodable(file: File) {
  if (!isSupportedPreviewFormat(file)) {
    throw new Error("This format isn't supported for preview.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("This format isn't supported for preview."));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

const checkerboardStyle = {
  backgroundImage:
    "linear-gradient(45deg, rgba(120, 120, 120, 0.18) 25%, transparent 25%, transparent 75%, rgba(120, 120, 120, 0.18) 75%, rgba(120, 120, 120, 0.18)), linear-gradient(45deg, rgba(120, 120, 120, 0.18) 25%, transparent 25%, transparent 75%, rgba(120, 120, 120, 0.18) 75%, rgba(120, 120, 120, 0.18))",
  backgroundPosition: "0 0, 12px 12px",
  backgroundSize: "24px 24px",
};

function friendlyProgressLabel(stepKey: string | undefined, current: number, total: number) {
  const normalized = (stepKey || "").toLowerCase();
  if (normalized.includes("download") || normalized.includes("asset") || normalized.includes("model")) {
    return `Preparing AI background removal... ${current}/${total}`;
  }
  return `Removing background... ${current}/${total}`;
}

export default function RemoveBackgroundPage() {
  useSEOAdvanced({
    title: "Remove Background from Image Online Free | PDFKira",
    description:
      "Remove image backgrounds automatically with PDFKira. Create transparent PNG images online for free without uploading your images to a server.",
    canonical: `${SITE_URL}/tools/remove-background`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFKira Remove Background Tool",
      applicationCategory: "Utility",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      description:
        "Remove image backgrounds automatically with PDFKira. Create transparent PNG images online for free without uploading your images to a server.",
    },
  });

  const [status, setStatus] = useState<ToolStatus>("idle");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUploadFormat, setOriginalUploadFormat] = useState<OriginalFileFormat | null>(null);
  const [originalUploadMimeType, setOriginalUploadMimeType] = useState<string | null>(null);
  const [originalDownloadMime, setOriginalDownloadMime] = useState<"image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif" | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Preparing AI background removal...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLargeImageWarning, setIsLargeImageWarning] = useState(false);
  const processIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const originalUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) {
        URL.revokeObjectURL(originalUrlRef.current);
      }
      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []);

  const revokeUrl = (urlRef: MutableRefObject<string | null>) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  const resetTool = () => {
    processIdRef.current += 1;
    revokeUrl(originalUrlRef);
    revokeUrl(resultUrlRef);
    setSelectedFile(null);
    setOriginalFile(null);
    setOriginalUploadFormat(null);
    setOriginalUploadMimeType(null);
    setOriginalDownloadMime(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setProgress(0);
    setProgressLabel("Preparing AI background removal...");
    setErrorMessage(null);
    setIsLargeImageWarning(false);
    setStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadName = selectedFile ? `${stripExtension(selectedFile.name)}-no-background.png` : "no-background.png";

  const processImage = async (file: File) => {
    const processId = ++processIdRef.current;
    const originalMimeType = (file.type || "").toLowerCase().split(";")[0].trim();
    const originalFormat = getOriginalFormatFromFile(file, originalMimeType);
    setOriginalFile(file);
    setOriginalUploadMimeType(originalMimeType || null);
    setOriginalUploadFormat(originalFormat);
    // For HEIC/HEIF we keep PNG-only and avoid offering HEIC back to the user.
    if (originalFormat && originalFormat !== "heic" && originalFormat !== "heif") {
      const map: Record<OriginalFileFormat, "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif"> = {
        png: "image/png",
        jpeg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
        bmp: "image/bmp",
        avif: "image/avif",
        heic: "image/png",
        heif: "image/png",
      };
      const derived = map[originalFormat];
      console.debug('[remove-background] original format', { originalFormat, derived });
      setOriginalDownloadMime(derived);
    } else {
      setOriginalDownloadMime(null);
    }

    setErrorMessage(null);
    setIsLargeImageWarning(false);
    setStatus("idle");
    setProgress(0);
    setProgressLabel("Preparing AI background removal...");
    setResultBlob(null);
    revokeUrl(resultUrlRef);
    setResultUrl(null);

    if (!isSupportedPreviewFormat(file)) {
      setErrorMessage("This format isn't supported for preview.");
      setStatus("error");
      return;
    }

    const normalizedFile = await (async () => {
      if (!isHeicFile(file)) {
        try {
          await assertPreviewDecodable(file);
          return file;
        } catch {
          throw new Error("This format isn't supported for preview.");
        }
      }

      setProgressLabel("Converting HEIC...");
      setProgress(5);
      try {
        return await convertHeicToPng(file);
      } catch {
        throw new Error("This format isn't supported for preview.");
      }
    })().catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "This format isn't supported for preview.");
      setStatus("error");
      return null;
    });

    if (!normalizedFile) {
      return;
    }

    revokeUrl(originalUrlRef);
    const previewUrl = URL.createObjectURL(normalizedFile);
    originalUrlRef.current = previewUrl;
    setOriginalUrl(previewUrl);
    setSelectedFile(normalizedFile);

    const fileSizeLimit = normalizedFile.size > MAX_SAFE_FILE_SIZE_BYTES;
    if (fileSizeLimit) {
      setIsLargeImageWarning(true);
      const proceed = window.confirm(
        "This image is very large and may be slow or unstable on lower-memory devices. Continue anyway?",
      );
      if (!proceed) {
        setStatus("idle");
        setProgress(0);
        setProgressLabel("Preparing AI background removal...");
        return;
      }
    }

    try {
      setStatus("processing");
      setProgressLabel("Preparing AI background removal...");
      setProgress(4);

      const removedBackground = await removeBackgroundToPng(normalizedFile, (stepKey, current, total) => {
        if (processId !== processIdRef.current) return;
        const safeTotal = Math.max(1, total || 1);
        const nextProgress = Math.min(98, Math.round((current / safeTotal) * 100));
        setProgress(nextProgress);
        setProgressLabel(friendlyProgressLabel(stepKey, current, safeTotal));
      });

      if (processId !== processIdRef.current) return;

      const nextResultUrl = URL.createObjectURL(removedBackground);
      resultUrlRef.current = nextResultUrl;
      setResultBlob(removedBackground);
      setResultUrl(nextResultUrl);
      setProgress(100);
      setProgressLabel("Ready to download PNG");
      setStatus("success");
    } catch (error: any) {
      if (processId !== processIdRef.current) return;
      console.error("Remove background failed", error);
      setErrorMessage("Something went wrong while removing the background. Please try another image.");
      setProgress(0);
      setProgressLabel("Preparing AI background removal...");
      setStatus("error");
    }
  };
  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;
    await processImage(file);
  };

  

  const getOriginalDownloadMimeType = (): "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif" | null => {
    if (originalDownloadMime) return originalDownloadMime;
    const originalType = originalUploadFormat ?? getOriginalFormatFromFile(originalFile, originalUploadMimeType) ?? getOriginalFormatFromFile(selectedFile, originalUploadMimeType);
    if (!originalType) return null;
    if (originalType === "heic" || originalType === "heif") return null;
    if (originalType === "png") return "image/png";
    if (originalType === "jpeg") return "image/jpeg";
    if (originalType === "webp") return "image/webp";
    if (originalType === "avif") return "image/avif";
    if (originalType === "bmp") return "image/bmp";
    if (originalType === "gif") return "image/gif";
    return null;
  };

  const getMimeTypeLabel = (mimeType: "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif") => {
    if (mimeType === "image/jpeg") return "JPG";
    if (mimeType === "image/webp") return "WebP";
    if (mimeType === "image/avif") return "AVIF";
    if (mimeType === "image/bmp") return "BMP";
    if (mimeType === "image/gif") return "GIF";
    return "PNG";
  };

  const renderResultToMimeType = async (sourceBlob: Blob, mimeType: "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif") => {
    if (!sourceBlob) {
      throw new Error("Result not ready.");
    }

    if (mimeType === "image/png") {
      return sourceBlob;
    }

    const sourceBitmap = await createImageBitmap(sourceBlob);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = sourceBitmap.width;
      canvas.height = sourceBitmap.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas unavailable.");
      }

      // JPEG and BMP do not support transparent pixels, so we flatten alpha to white to
      // keep the result visible instead of introducing black artifacts in the export.
      if (mimeType === "image/jpeg" || mimeType === "image/bmp") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(sourceBitmap, 0, 0);
      const exportMimeType = mimeType === "image/gif" || mimeType === "image/bmp" ? "image/png" : mimeType;
      const nextBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          exportMimeType,
          exportMimeType === "image/jpeg" || exportMimeType === "image/webp" || exportMimeType === "image/avif" ? 0.98 : undefined,
        );
      });

      canvas.width = 0;
      canvas.height = 0;

      if (!nextBlob) {
        throw new Error("Unable to export the processed image.");
      }

      return nextBlob;
    } finally {
      sourceBitmap.close?.();
    }
  };
  const handleDownload = async (
    sourceBlob: Blob | null | undefined,
    originalFileName: string,
    mimeType?: "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif",
  ) => {
    const targetMime = mimeType ?? "image/png";
    if (!sourceBlob) return;

    try {
      const blob = targetMime === "image/png" ? sourceBlob : await renderResultToMimeType(sourceBlob, targetMime);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const ext = targetMime === "image/jpeg" ? "jpg" : targetMime === "image/webp" ? "webp" : targetMime === "image/bmp" ? "bmp" : targetMime === "image/gif" ? "gif" : targetMime === "image/avif" ? "avif" : "png";
      anchor.download = `${stripExtension(originalFileName)}-no-background.${ext}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Something went wrong while exporting your image. Please try another image.");
      setStatus("error");
    }
  };

  const previewPanel = (label: string, url: string | null, emptyText: string) => (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{emptyText}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
          <div className="flex min-h-[280px] items-center justify-center p-4 sm:min-h-[340px]" style={label === "Result" ? checkerboardStyle : undefined}>
            {url ? (
              <img
                src={url}
                alt={label}
                className="max-h-[420px] w-full max-w-full rounded-xl object-contain shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
                <span className="max-w-xs text-sm">{emptyText}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-background pb-20">
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto mb-4 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
              Privacy-first AI image tool
            </Badge>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Remove Background</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Remove the background from any image automatically and download it as a transparent PNG.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">JPG</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">JPEG</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">PNG</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">WebP</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">GIF</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">BMP</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">AVIF</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">SVG</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">HEIC</Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1.5">HEIF</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-8 md:px-6 md:pt-10">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Upload an image</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Your image is processed in your browser.
                      <span className="block">The first run may download AI model assets.</span>
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {isLargeImageWarning && !errorMessage && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>This image is large enough that processing may take longer on lower-memory devices.</p>
                  </div>
                )}

                <div className={status === "processing" ? "pointer-events-none opacity-70" : ""}>
                  <UploadArea
                    onFilesSelected={handleFilesSelected}
                    onError={(message) => {
                      setErrorMessage(message);
                      setStatus("error");
                    }}
                    multiple={false}
                    accept={ACCEPTED_TYPES}
                    maxSizeMB={500}
                    label="image"
                    description="or drop a JPG, JPEG, PNG, WebP, GIF, BMP, AVIF, SVG, HEIC, or HEIF file here."
                    selectedCount={selectedFile ? 1 : 0}
                    maxFiles={1}
                  />
                </div>
              </CardContent>
            </Card>

            

            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">Transparent output</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  The downloaded file is a PNG with alpha transparency. The checkerboard preview is only for visualization.
                </p>
                <div className="rounded-2xl bg-secondary/40 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Why it may take a moment</p>
                  <p className="mt-1 leading-6">The AI model is loaded lazily the first time you remove a background, then cached by the browser for later use.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Preview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Original and result previews update as soon as processing completes.</p>
                  </div>

                  {status === "processing" && (
                    <Badge variant="secondary" className="rounded-full px-4 py-1.5">
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Processing
                    </Badge>
                  )}
                </div>

                {status === "processing" && (
                  <div className="mb-5 space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-foreground">{progressLabel}</span>
                      <span className="tabular-nums text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  {previewPanel("Original", originalUrl, "Your selected image will appear here immediately.")}
                  {previewPanel("Result", resultUrl, "The transparent PNG will appear here after background removal.")}
                </div>
              </CardContent>
            </Card>

            {status === "success" && resultBlob && resultUrl && (
              <Card className="border-primary/20 bg-primary/5 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">Background removed successfully</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Download the image in your preferred format or remove another background.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {(() => {
                        const originalMime = getOriginalDownloadMimeType();
                        const showOriginalDownload = Boolean(originalMime && originalMime !== "image/png");
                        const pngLabel = showOriginalDownload ? "Download as PNG" : "Download PNG";
                        return (
                          <>
                            <Button size="lg" className="rounded-full px-6" onClick={() => void handleDownload(resultBlob, selectedFile?.name ?? "no-background", "image/png")}>
                              <Download className="mr-2 h-4 w-4" />
                              {pngLabel}
                            </Button>
                            {showOriginalDownload && originalMime && (
                              <Button
                                key={originalMime}
                                size="lg"
                                variant="outline"
                                className="rounded-full px-6"
                                onClick={() => void handleDownload(resultBlob, selectedFile?.name ?? "no-background", originalMime)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download as {getMimeTypeLabel(originalMime)}
                              </Button>
                            )}
                          </>
                        );
                      })()}
                      <Button size="lg" variant="outline" className="rounded-full px-6" onClick={resetTool}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Remove Another Background
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === "error" && (
              <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-destructive">Unable to finish processing</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Please try another image or use a smaller file.
                      </p>
                    </div>
                    <Button size="lg" variant="outline" className="rounded-full px-6" onClick={resetTool}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Remove Another Background
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
