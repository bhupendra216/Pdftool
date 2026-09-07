import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { AlertCircle, Check, Download, Image as ImageIcon, Loader2, Palette, RefreshCw, Sparkles } from "lucide-react";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { removeBackgroundToPng } from "@/lib/background-removal";
import { UploadArea } from "@/components/shared/UploadArea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ToolSeoSection from '@/components/Content/ToolSeoSection';
import { getToolSeoContent } from '@/lib/toolSeoContent';

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/svg+xml,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif,.svg,.heic,.heif";
const MAX_SAFE_FILE_SIZE_BYTES = 500 * 1024 * 1024;
const MAX_SAFE_PIXEL_COUNT = 48_000_000;
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

type ToolStatus = "idle" | "processing" | "ready" | "error";
type BackgroundMode = "transparent" | "color" | "image";
type OriginalFileFormat = "png" | "jpeg" | "webp" | "gif" | "bmp" | "avif" | "heic" | "heif";

const checkerboardStyle = {
  backgroundImage:
    "linear-gradient(45deg, rgba(120, 120, 120, 0.18) 25%, transparent 25%, transparent 75%, rgba(120, 120, 120, 0.18) 75%, rgba(120, 120, 120, 0.18)), linear-gradient(45deg, rgba(120, 120, 120, 0.18) 25%, transparent 25%, transparent 75%, rgba(120, 120, 120, 0.18) 75%, rgba(120, 120, 120, 0.18))",
  backgroundPosition: "0 0, 12px 12px",
  backgroundSize: "24px 24px",
};

const stripExtension = (fileName: string) => fileName.replace(/\.[^/.]+$/, "");
const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
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
  const heic2any = (await import("heic2any")).default;
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

function progressLabel(stepKey: string | undefined, current: number, total: number) {
  const normalized = (stepKey || "").toLowerCase();
  if (normalized.includes("download") || normalized.includes("asset") || normalized.includes("model")) {
    return `Preparing image... ${current}/${total}`;
  }
  return `Removing background... ${current}/${total}`;
}

function friendlyErrorMessage(reason: string) {
  return reason || "Something went wrong while processing your image. Please try another image.";
}

async function loadBitmap(source: Blob) {
  const bitmap = await createImageBitmap(source);
  return bitmap;
}

type ExportMimeType = "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp" | "image/gif";

const isOpaqueExportMimeType = (mimeType: ExportMimeType) => mimeType === "image/jpeg" || mimeType === "image/bmp";

const normalizeExportMimeType = (mimeType: ExportMimeType): "image/png" | "image/jpeg" | "image/webp" | "image/avif" => {
  if (mimeType === "image/png" || mimeType === "image/jpeg" || mimeType === "image/webp" || mimeType === "image/avif") {
    return mimeType;
  }
  return "image/png";
};

async function exportCompositionBlob(params: {
  width: number;
  height: number;
  foregroundBitmap: ImageBitmap;
  backgroundMode: BackgroundMode;
  solidColor: string;
  backgroundBitmap: ImageBitmap | null;
  scale: number;
  positionX: number;
  positionY: number;
  mimeType: ExportMimeType;
}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(params.width));
  canvas.height = Math.max(1, Math.round(params.height));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas unavailable.");
  }

  if (params.backgroundMode === "transparent") {
    // JPEG and BMP do not support transparency, so we flatten transparent areas to white
    // instead of leaving black artifacts when the user exports in a non-alpha format.
    if (isOpaqueExportMimeType(params.mimeType)) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  } else if (params.backgroundMode === "color") {
    context.fillStyle = params.solidColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else if (params.backgroundBitmap) {
    const bgBitmap = params.backgroundBitmap;
    const scale = Math.max(canvas.width / bgBitmap.width, canvas.height / bgBitmap.height);
    const drawWidth = bgBitmap.width * scale;
    const drawHeight = bgBitmap.height * scale;
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;
    context.drawImage(bgBitmap, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const foregroundWidth = Math.max(1, Math.round(canvas.width * params.scale));
  const foregroundHeight = Math.max(1, Math.round(canvas.height * params.scale));
  const centerX = canvas.width / 2 + (params.positionX / 100) * canvas.width;
  const centerY = canvas.height / 2 + (params.positionY / 100) * canvas.height;
  const drawX = Math.round(centerX - foregroundWidth / 2);
  const drawY = Math.round(centerY - foregroundHeight / 2);
  context.drawImage(params.foregroundBitmap, drawX, drawY, foregroundWidth, foregroundHeight);

  const exportMimeType = normalizeExportMimeType(params.mimeType);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (nextBlob) => resolve(nextBlob),
      exportMimeType,
      exportMimeType === "image/jpeg" || exportMimeType === "image/webp" || exportMimeType === "image/avif" ? 0.98 : undefined,
    );
  });

  canvas.width = 0;
  canvas.height = 0;

  if (!blob) {
    throw new Error("Unable to export the composed image.");
  }

  return blob;
}

export default function AddBackgroundPage() {
  useSEOAdvanced({
    title: "Add Background to Image Online Free | PDFKira",
    description:
      "Add a new background to any image online for free. Automatically remove the existing background and replace it with a color or custom image.",
    canonical: `${SITE_URL}/tools/add-background`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PDFKira Add Background Tool",
      applicationCategory: "Utility",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      description:
        "Add a new background to any image online for free. Automatically remove the existing background and replace it with a color or custom image.",
    },
  });

  const [status, setStatus] = useState<ToolStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUploadFormat, setOriginalUploadFormat] = useState<OriginalFileFormat | null>(null);
  const [originalUploadMimeType, setOriginalUploadMimeType] = useState<string | null>(null);
  const [originalDownloadMime, setOriginalDownloadMime] = useState<ExportMimeType | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [foregroundBlob, setForegroundBlob] = useState<Blob | null>(null);
  const [foregroundBitmap, setForegroundBitmap] = useState<ImageBitmap | null>(null);
  const [backgroundBitmap, setBackgroundBitmap] = useState<ImageBitmap | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("transparent");
  const [solidColor, setSolidColor] = useState<string>("#ffffff");
  const [foregroundScale, setForegroundScale] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [outputSize, setOutputSize] = useState<{ width: number; height: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Preparing image...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [largeImageWarning, setLargeImageWarning] = useState(false);
  const [backgroundNote, setBackgroundNote] = useState<string | null>(null);
  const processIdRef = useRef(0);
  const composeIdRef = useRef(0);
  const originalUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const backgroundUrlRef = useRef<string | null>(null);
  const resolvedSolidColor = isValidHexColor(solidColor) ? solidColor : "#ffffff";
  const normalizedSolidColor = resolvedSolidColor.toLowerCase();

  const PRESET_COLORS = [
    '#ffffff', // white
    '#000000', // black
    '#ff3b30', // red
    '#ff9500', // orange
    '#ffd60a', // yellow
    '#34c759', // green
    '#00d3ff', // cyan
    '#0a84ff', // blue
    '#8e44ff', // purple
    '#ff2d95', // pink
    '#8e8e93', // gray
    '#001f3f', // dark navy
  ];

  const revokeUrl = (ref: MutableRefObject<string | null>) => {
    if (ref.current) {
      URL.revokeObjectURL(ref.current);
      ref.current = null;
    }
  };

  useEffect(() => {
    return () => {
      revokeUrl(originalUrlRef);
      revokeUrl(resultUrlRef);
      revokeUrl(backgroundUrlRef);
      foregroundBitmap?.close?.();
      backgroundBitmap?.close?.();
    };
  }, [backgroundBitmap, foregroundBitmap]);

  useEffect(() => {
    let cancelled = false;
    if (!foregroundBlob) {
      setForegroundBitmap((current) => {
        current?.close?.();
        return null;
      });
      return;
    }

    void (async () => {
      try {
        const bitmap = await loadBitmap(foregroundBlob);
        if (cancelled) {
          bitmap.close?.();
          return;
        }
        setForegroundBitmap((current) => {
          current?.close?.();
          return bitmap;
        });
      } catch {
        if (!cancelled) {
          setErrorMessage("Something went wrong while processing your image. Please try another image.");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [foregroundBlob]);

  useEffect(() => {
    let cancelled = false;
    if (!backgroundFile) {
      setBackgroundBitmap((current) => {
        current?.close?.();
        return null;
      });
      return;
    }

    void (async () => {
      try {
        const bitmap = await loadBitmap(backgroundFile);
        if (cancelled) {
          bitmap.close?.();
          return;
        }
        setBackgroundBitmap((current) => {
          current?.close?.();
          return bitmap;
        });
      } catch {
        if (!cancelled) {
          setBackgroundNote("The background image could not be loaded. Please try another image.");
          setBackgroundMode("transparent");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [backgroundFile]);

  const resetTool = () => {
    processIdRef.current += 1;
    composeIdRef.current += 1;
    revokeUrl(originalUrlRef);
    revokeUrl(resultUrlRef);
    revokeUrl(backgroundUrlRef);
    setSelectedFile(null);
    setOriginalFile(null);
    setOriginalUploadFormat(null);
    setOriginalUploadMimeType(null);
    setOriginalDownloadMime(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setForegroundBlob(null);
    setForegroundScale(1);
    setPositionX(0);
    setPositionY(0);
    setOutputSize(null);
    setProgress(0);
    setProgressText("Preparing image...");
    setErrorMessage(null);
    setLargeImageWarning(false);
    setBackgroundNote(null);
    setStatus("idle");
    setBackgroundMode("transparent");
    setSolidColor("#ffffff");
    setBackgroundFile(null);
    setBackgroundPreviewUrl(null);
    if (foregroundBitmap) {
      foregroundBitmap.close?.();
      setForegroundBitmap(null);
    }
    if (backgroundBitmap) {
      backgroundBitmap.close?.();
      setBackgroundBitmap(null);
    }
  };

  const downloadName = selectedFile ? `${stripExtension(selectedFile.name)}-background.png` : "background.png";

  const convertResultToMime = async (sourceBlob: Blob, mimeType: ExportMimeType) => {
    if (mimeType === "image/png") return sourceBlob;
    const sourceBitmap = await createImageBitmap(sourceBlob);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = sourceBitmap.width;
      canvas.height = sourceBitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable.");
      if (mimeType === "image/jpeg" || mimeType === "image/bmp") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(sourceBitmap, 0, 0);
      const exportMimeType = mimeType === "image/gif" || mimeType === "image/bmp" ? "image/png" : mimeType;
      const nextBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), exportMimeType, exportMimeType === "image/jpeg" || exportMimeType === "image/webp" || exportMimeType === "image/avif" ? 0.98 : undefined);
      });
      if (!nextBlob) throw new Error("Unable to export the processed image.");
      return nextBlob;
    } finally {
      sourceBitmap.close?.();
    }
  };

  const composePreview = useCallback(async (mimeType: ExportMimeType) => {
    if (!foregroundBitmap || !outputSize) {
      throw new Error("Foreground not ready.");
    }

    if (backgroundMode === "image" && !backgroundBitmap) {
      throw new Error("Background image not ready.");
    }

    return exportCompositionBlob({
      width: outputSize.width,
      height: outputSize.height,
      foregroundBitmap,
      backgroundMode,
      solidColor: resolvedSolidColor,
      backgroundBitmap,
      scale: foregroundScale,
      positionX,
      positionY,
      mimeType,
    });
  }, [backgroundBitmap, backgroundMode, foregroundBitmap, foregroundScale, outputSize, positionX, positionY, resolvedSolidColor]);

  const handleMainImageSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    

    const file = files[0];
    if (!file) return;

    const originalMimeType = (file.type || "").toLowerCase().split(";")[0].trim();
    const originalFormat = getOriginalFormatFromFile(file, originalMimeType);
    setOriginalFile(file);
    setOriginalUploadMimeType(originalMimeType || null);
    setOriginalUploadFormat(originalFormat);
    // compute a stable download mime for the original format (HEIC/HEIF → null)
    // For HEIC/HEIF we do not offer a HEIC download — keep PNG-only.
    if (originalFormat && originalFormat !== "heic" && originalFormat !== "heif") {
      const map: Record<OriginalFileFormat, ExportMimeType> = {
        png: "image/png",
        jpeg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
        bmp: "image/bmp",
        avif: "image/avif",
        // do not map heic/heif here — treated as PNG-only
        heic: "image/png",
        heif: "image/png",
      } as const;
      const derived = map[originalFormat];
      console.debug('[add-background] original format', { originalFormat, derived });
      setOriginalDownloadMime(derived);
    } else {
      setOriginalDownloadMime(null);
    }

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

      setProgressText("Converting HEIC...");
      setProgress(1);
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
    revokeUrl(resultUrlRef);
    revokeUrl(backgroundUrlRef);
    setLargeImageWarning(false);
    setErrorMessage(null);
    setBackgroundNote(null);
    setProgress(0);
    setProgressText("Preparing image...");
    setStatus("processing");
    setSelectedFile(normalizedFile);
    setBackgroundMode("transparent");
    setSolidColor("#ffffff");
    setBackgroundFile(null);
    setBackgroundPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setForegroundBlob(null);
    setForegroundScale(1);
    setPositionX(0);
    setPositionY(0);
    setForegroundBitmap((current) => {
      current?.close?.();
      return null;
    });
    setBackgroundBitmap((current) => {
      current?.close?.();
      return null;
    });

    const fileSizeLimit = normalizedFile.size > MAX_SAFE_FILE_SIZE_BYTES;
    if (fileSizeLimit) {
      setLargeImageWarning(true);
      const proceed = window.confirm(
        "This image is very large and may be slow or unstable on lower-memory devices. Continue anyway?",
      );
      if (!proceed) {
        setStatus("idle");
        setProgress(0);
        setProgressText("Preparing image...");
        return;
      }
    }

    const processId = ++processIdRef.current;

    try {
      const previewUrl = URL.createObjectURL(normalizedFile);
      originalUrlRef.current = previewUrl;
      setOriginalUrl(previewUrl);

      const bitmap = await loadBitmap(normalizedFile);
      const width = bitmap.width;
      const height = bitmap.height;
      bitmap.close?.();
      if (width * height > MAX_SAFE_PIXEL_COUNT) {
        const proceed = window.confirm(
          "This image is very large and may use a lot of memory while processing. Continue anyway?",
        );
        if (!proceed) {
          setStatus("idle");
          return;
        }
      }

      setOutputSize({ width, height });
      setProgressText("Preparing image...");
      setProgress(3);

      const foreground = await removeBackgroundToPng(
        normalizedFile,
        (stepKey, current, total) => {
          if (processId !== processIdRef.current) return;
          const safeTotal = Math.max(1, total || 1);
          const nextProgress = Math.min(98, Math.round((current / safeTotal) * 100));
          setProgress(nextProgress);
          setProgressText(progressLabel(stepKey, current, safeTotal));
        },
        { width, height },
      );

      if (processId !== processIdRef.current) return;

      setForegroundBlob(foreground);
      setResultBlob(null);
      revokeUrl(resultUrlRef);
      setProgress(100);
      setProgressText("Ready to customize");
      setStatus("ready");
      revokeUrl(backgroundUrlRef);
      setBackgroundPreviewUrl(null);
      setBackgroundNote("Your image is processed in your browser.");
    } catch (error) {
      if (processId !== processIdRef.current) return;
      console.error("Add background failed", error);
      setErrorMessage(friendlyErrorMessage("Something went wrong while processing your image. Please try another image."));
      setProgress(0);
      setProgressText("Preparing image...");
      setStatus("error");
    }
  };

  const handleBackgroundImageSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!isSupportedPreviewFormat(file)) {
      setBackgroundNote("This format isn't supported for preview.");
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

      try {
        return await convertHeicToPng(file);
      } catch {
        throw new Error("This format isn't supported for preview.");
      }
    })().catch((error) => {
      setBackgroundNote(error instanceof Error ? error.message : "This format isn't supported for preview.");
      return null;
    });

    if (!normalizedFile) {
      return;
    }

    revokeUrl(backgroundUrlRef);
    const backgroundUrl = URL.createObjectURL(normalizedFile);
    backgroundUrlRef.current = backgroundUrl;
    setBackgroundPreviewUrl(backgroundUrl);
    setBackgroundFile(normalizedFile);
    setBackgroundMode("image");
    setBackgroundNote(null);
  };

  

  useEffect(() => {
    if (!foregroundBitmap || !outputSize || status === "processing" || status === "idle") {
      return;
    }

    if (backgroundMode === "image" && !backgroundBitmap) {
      return;
    }

    const composeId = ++composeIdRef.current;
    let cancelled = false;

    void (async () => {
      try {
        const blob = await composePreview("image/png");
        if (cancelled || composeId !== composeIdRef.current) return;

        const nextUrl = URL.createObjectURL(blob);
        revokeUrl(resultUrlRef);
        resultUrlRef.current = nextUrl;
        setResultBlob(blob);
        setResultUrl(nextUrl);
      } catch (error) {
        if (cancelled || composeId !== composeIdRef.current) return;
        console.error("Composition failed", error);
        setErrorMessage("Something went wrong while processing your image. Please try another image.");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [backgroundBitmap, backgroundMode, composePreview, foregroundBitmap, outputSize, foregroundScale, positionX, positionY, status]);

  const getOriginalDownloadMimeType = (): ExportMimeType | null => {
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

  const getMimeTypeLabel = (mimeType: ExportMimeType) => {
    if (mimeType === "image/jpeg") return "JPG";
    if (mimeType === "image/webp") return "WebP";
    if (mimeType === "image/avif") return "AVIF";
    if (mimeType === "image/bmp") return "BMP";
    if (mimeType === "image/gif") return "GIF";
    return "PNG";
  };

  const handleDownloadPng = () => {
    if (!resultBlob) return;
    const url = resultUrl;
    if (!url) return;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadName;
    anchor.click();
  };

  const handleDownloadMime = async (mimeType: ExportMimeType) => {
    try {
      const blob = await composePreview(mimeType);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${stripExtension(selectedFile?.name || "background")}-background.${
        mimeType === "image/jpeg"
          ? "jpg"
          : mimeType === "image/webp"
            ? "webp"
            : mimeType === "image/avif"
              ? "avif"
              : mimeType === "image/bmp"
                ? "bmp"
                : mimeType === "image/gif"
                  ? "gif"
                  : "png"
      }`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Something went wrong while exporting your image. Please try another image.");
      setStatus("error");
    }
  };

  const previewPanel = (label: string, url: string | null, emptyText: string, transparent = false) => (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{emptyText}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30">
          <div className="flex min-h-[280px] items-center justify-center p-4 sm:min-h-[340px]" style={transparent ? checkerboardStyle : undefined}>
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

  const backgroundEditor = () => (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Background</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a transparent, solid-color, or custom image background. The preview updates automatically.</p>
        </div>

        {backgroundNote && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{backgroundNote}</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            variant={backgroundMode === "transparent" ? "default" : "outline"}
            className="rounded-2xl"
            onClick={() => setBackgroundMode("transparent")}
          >
            Transparent
          </Button>
          <Button
            type="button"
            variant={backgroundMode === "color" ? "default" : "outline"}
            className="rounded-2xl"
            onClick={() => setBackgroundMode("color")}
          >
            Color
          </Button>
          <Button
            type="button"
            variant={backgroundMode === "image" ? "default" : "outline"}
            className="rounded-2xl"
            onClick={() => setBackgroundMode("image")}
          >
            Image
          </Button>
        </div>

        {backgroundMode === "color" && (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-secondary/20 p-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-foreground">Solid color background</p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`rounded-2xl border bg-background p-1 transition-colors ${
                  PRESET_COLORS.includes(normalizedSolidColor) ? "border-input" : "border-primary"
                }`}
              >
                <input
                  type="color"
                  aria-label="Background color picker"
                  value={resolvedSolidColor}
                  onChange={(event) => setSolidColor(event.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                />
              </div>
              <div className="text-sm text-muted-foreground">Click the swatch to open the color picker.</div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((c) => {
                const isSelected = normalizedSolidColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Set color ${c}`}
                    onClick={() => setSolidColor(c)}
                    className={`h-7 w-7 rounded-full p-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "border border-border/40"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {backgroundMode === "image" && (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-secondary/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">Custom background image</p>
              </div>
              {backgroundPreviewUrl && (
                <Button type="button" variant="ghost" className="h-9 rounded-full px-3 text-muted-foreground" onClick={() => {
                  revokeUrl(backgroundUrlRef);
                  setBackgroundPreviewUrl(null);
                  setBackgroundFile(null);
                  setBackgroundMode("transparent");
                }}>
                  Clear
                </Button>
              )}
            </div>
            <UploadArea
              onFilesSelected={handleBackgroundImageSelected}
              onError={(message) => setBackgroundNote(message)}
              multiple={false}
              accept={ACCEPTED_TYPES}
              maxSizeMB={100}
              label="background image"
              description="or drop a JPG, JPEG, PNG, WebP, GIF, BMP, AVIF, or SVG background here."
              compact
              selectedCount={backgroundFile ? 1 : 0}
              maxFiles={1}
            />
            {backgroundPreviewUrl && (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-background">
                <img src={backgroundPreviewUrl} alt="Background preview" className="max-h-44 w-full object-cover" />
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 rounded-2xl border border-border/70 bg-secondary/20 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">Foreground controls</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scale</span>
                <span className="font-medium text-foreground">{Math.round(foregroundScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={foregroundScale}
                onChange={(event) => setForegroundScale(Number(event.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Position X</span>
                <span className="font-medium text-foreground">{positionX}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={positionX}
                onChange={(event) => setPositionX(Number(event.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Position Y</span>
                <span className="font-medium text-foreground">{positionY}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={positionY}
                onChange={(event) => setPositionY(Number(event.target.value))}
                className="w-full"
              />
            </div>
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
              Browser-based image editing
            </Badge>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Add Background to Image</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Remove the existing background and add a new background to your image online for free.
            </p>
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

                {largeImageWarning && !errorMessage && (
                  <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>This image is large enough that processing may take longer on lower-memory devices.</p>
                  </div>
                )}

                <div className={status === "processing" ? "pointer-events-none opacity-70" : ""}>
                  
                  <UploadArea
                    onFilesSelected={handleMainImageSelected}
                    onError={(message) => {
                      setErrorMessage(message);
                      setStatus("error");
                    }}
                    multiple={false}
                    accept={ACCEPTED_TYPES}
                    maxSizeMB={500}
                    label="image"
                    description="or drop a JPG, JPEG, PNG, WebP, GIF, BMP, AVIF, SVG, HEIC, or HEIF file here."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">Privacy note</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">Your image is processed in your browser.</p>
                <div className="rounded-2xl bg-secondary/40 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Why it may take a moment</p>
                  <p className="mt-1 leading-6">The AI model is loaded lazily the first time you remove a background, then cached by the browser for later use.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {status === "processing" && (
              <Card className="border-border/70 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Processing image</h2>
                      <p className="text-sm text-muted-foreground">{progressText}</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            )}

            {(originalUrl || resultUrl) && (
              <Card className="border-border/70 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Preview</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Compare the original image and the composed result.</p>
                    </div>
                    {status === "ready" && (
                      <Badge variant="secondary" className="rounded-full px-4 py-1.5">
                        Ready
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {previewPanel("Original", originalUrl, "Your selected image will appear here immediately.")}
                    {previewPanel(
                      "Result",
                      resultUrl,
                      "Your composed image will appear here after processing.",
                      backgroundMode === "transparent",
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {foregroundBlob && foregroundBitmap && outputSize && backgroundEditor()}

            {status === "ready" && resultBlob && resultUrl && (
              <Card className="border-primary/20 bg-primary/5 shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary">Your background is ready</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Download the image in your preferred format, or add another background to the same image.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {(() => {
                        const originalMime = getOriginalDownloadMimeType();
                        const showOriginalDownload = Boolean(originalMime && originalMime !== "image/png");
                        const pngLabel = showOriginalDownload ? "Download as PNG" : "Download PNG";
                        return (
                          <>
                            <Button size="lg" className="rounded-full px-6" onClick={handleDownloadPng}>
                              <Download className="mr-2 h-4 w-4" />
                              {pngLabel}
                            </Button>
                            {showOriginalDownload && originalMime && (
                              <Button
                                key={originalMime}
                                size="lg"
                                variant="outline"
                                className="rounded-full px-6"
                                onClick={() => void handleDownloadMime(originalMime)}
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
                        Add Background to Another Image
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
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">Please try another image or use a smaller file.</p>
                    </div>
                    <Button size="lg" variant="outline" className="rounded-full px-6" onClick={resetTool}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Add Background to Another Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ToolSeoSection content={getToolSeoContent('add-background')} />
    </div>
  );
}
