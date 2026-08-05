import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "wouter";
import { PDFDocument } from "pdf-lib";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useGetTool, useGetBlogPost, useListTools, useListFaqs, useOcrImageToText } from "@workspace/api-client-react";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { formatBytes } from "@/lib/utils";
import { UploadArea } from "@/components/shared/UploadArea";
import JSZip from "jszip";
import { FilePreviewList } from "@/components/shared/FilePreviewList";
import { FaqSection } from "@/components/shared/FaqSection";
import { ToolCard } from "@/components/shared/ToolCard";
import { Button } from "@/components/ui/button";
import OrganizeGrid from "@/components/organize/OrganizeGrid";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Settings2, Download, AlertCircle, MoveUp, MoveDown, RotateCcw, RotateCw, Trash2, GripVertical, Check, FileMinus, FilePlus, ShieldCheck, Zap, Sparkles, Layers3 } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { QrCodeGeneratorTool } from "@/components/shared/QrCodeGeneratorTool";
import { SignPdfTool } from "@/components/shared/SignPdfTool";
import { removePagesById } from "@/lib/page-state";
import { SITE_URL } from "@/lib/site-config";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const TRUST_POINTS = [
  "Secure processing",
  "Fast",
  "Free",
  "No registration",
];

type UploadConfig = {
  accept: string;
  maxSizeMB: number;
  label: string;
  description: string;
  supportedFormats: string[];
  highlights: string[];
};

const stripExtension = (filename: string) => filename.replace(/\.[^/.]+$/, "");

type BatchItemStatus = "pending" | "converting" | "done" | "failed";

type ImageBatchItem = {
  file: File;
  status: BatchItemStatus;
  error: string | null;
  blob?: Blob;
  outputName?: string;
};

const getUploadConfig = (slug?: string): UploadConfig => {
  switch (slug) {
    case "image-converter":
      return {
        accept: "image/png,image/jpeg,image/webp,image/bmp,image/tiff,image/gif,image/svg+xml,image/heic,image/heif,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.gif,.svg,.heic,.heif",
        maxSizeMB: 20,
        label: "image files",
        description: "or drop up to 30 images here.",
        supportedFormats: ["PNG", "JPG", "JPEG", "WebP", "BMP", "TIFF", "GIF", "SVG", "HEIC", "HEIF"],
        highlights: ["Preserve quality", "Batch convert up to 30 images", "Preview before download"],
      };
    case "image-resize":
    case "image-compress":
    case "image-upscale":
      return {
        accept: "image/png,image/jpeg,image/webp,image/bmp,image/tiff,image/gif,image/svg+xml,image/heic,image/heif,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.gif,.svg,.heic,.heif",
        maxSizeMB: 20,
        label: "image file",
        description: "or drop an image here.",
        supportedFormats: ["PNG", "JPG", "JPEG", "WebP", "BMP", "TIFF", "GIF", "SVG", "HEIC", "HEIF"],
        highlights: ["Preserve quality", "Batch-friendly workflow", "Preview before download"],
      };
    case "word-to-pdf":
      return {
        accept: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx",
        maxSizeMB: 50,
        label: "Word file",
        description: "or drop a Word document here.",
        supportedFormats: ["DOC", "DOCX"],
        highlights: ["Convert documents to PDF", "Keep layout consistent", "Fast upload and download"],
      };
    case "pdf-to-word":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Extract editable content", "Retain readable structure", "Supports up to 20 pages"],
      };
    case "ocr-image-to-text":
      return {
        accept: "image/png,image/jpeg,application/pdf,.png,.jpg,.jpeg,.pdf",
        maxSizeMB: 50,
        label: "image or PDF",
        description: "or drop an image or scanned PDF here.",
        supportedFormats: ["PNG", "JPG", "PDF"],
        highlights: ["Extract text from scans", "Copy or download OCR output", "Works on mobile and desktop"],
      };
    case "jpg-to-pdf":
      return {
        accept: "image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg",
        maxSizeMB: 50,
        label: "image file",
        description: "or drop one or more images here.",
        supportedFormats: ["JPG", "JPEG", "PNG"],
        highlights: ["Combine photos into one PDF", "Drag to reorder pages", "Ideal for scans and receipts"],
      };
    case "merge-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop multiple PDFs here.",
        supportedFormats: ["PDF"],
        highlights: ["Merge files in order", "Rearrange before download", "Supports multiple uploads"],
      };
    case "split-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Split by page range", "Preview before export", "Create focused PDFs quickly"],
      };
    case "organize-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Drag to reorder pages", "Rotate or delete pages", "Preview every page before saving"],
      };
    case "rotate-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Rotate the full document in one step", "Preview every page before download", "Professional one-click export"],
      };
    case "delete-pages":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Mark pages for removal", "Review thumbnails first", "Download a trimmed PDF"],
      };
    case "extract-pages":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Select pages to keep", "Build a new document fast", "Reorder before export"],
      };
    case "protect-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Add password protection", "Keep confidential files secure", "Simple one-step flow"],
      };
    case "unlock-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a locked PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Remove password protection", "Recover access quickly", "Keep your workflow moving"],
      };
    case "watermark-pdf":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Add text or logo watermarks", "Choose placement and opacity", "Professional branding for documents"],
      };
    case "add-page-numbers":
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop a PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Add sequential page numbers", "Choose placement", "Keep documents organized"],
      };
    default:
      return {
        accept: "application/pdf,.pdf",
        maxSizeMB: 50,
        label: "PDF file",
        description: "or drop PDF here.",
        supportedFormats: ["PDF"],
        highlights: ["Secure processing", "Fast results", "Designed for easy review"],
      };
  }
};

export function ToolDetail(props?: any) {
  const params = useParams<{ slug: string }>();
  const forcedSlug = props?.forcedSlug;
  const slug = forcedSlug ?? params.slug ?? props?.params?.slug;
  const { data: tool, isLoading, isError } = useGetTool(slug);
  const { data: catalogTools } = useListTools();
  const { data: siteFaqs } = useListFaqs();
  const { data: blogPost } = useGetBlogPost(tool?.blogSlug || "", {
    query: { enabled: !!tool?.blogSlug, queryKey: ["getBlogPost", tool?.blogSlug] } as any,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "options" | "processing" | "success">("idle");
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // ignore (server-side rendering or environments without window)
    }
  }, [status]);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState("Preparing...");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("processed.pdf");
  const [downloadSizeBytes, setDownloadSizeBytes] = useState<number | null>(null);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [pageRangeError, setPageRangeError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pdfPages, setPdfPages] = useState<Array<{ id: string; pageNumber: number; rotation: number; selected: boolean }>>([]);
  const [pageThumbnails, setPageThumbnails] = useState<Array<string | null>>([]);
  const thumbnailCacheRef = useRef<Map<string, Array<string | null>>>(new Map());
  const [thumbnailZoom, setThumbnailZoom] = useState<number>(100);
  const [documentRotation, setDocumentRotation] = useState<number>(0);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageFormat, setImageFormat] = useState<string | null>(null);
  const [imageBatchItems, setImageBatchItems] = useState<ImageBatchItem[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [svgMode, setSvgMode] = useState<"embed" | "trace">("embed");
  const [resizeWidth, setResizeWidth] = useState<string>("");
  const [resizeHeight, setResizeHeight] = useState<string>("");
  const [compressQuality, setCompressQuality] = useState<number>(78);
  const [upscaleFactor, setUpscaleFactor] = useState<number>(4);
  const [upscaleWidth, setUpscaleWidth] = useState<string>("");
  const [upscaleHeight, setUpscaleHeight] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ocrText, setOcrText] = useState<string>("");
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [watermarkPosition, setWatermarkPosition] = useState<string>("bottom-right");
  const [watermarkLogo, setWatermarkLogo] = useState<File | null>(null);
  const [pageNumberStart, setPageNumberStart] = useState<string>("1");
  const [pageNumberPosition, setPageNumberPosition] = useState<string>("bottom-right");
  const [pdfToWordPreserveLayout, setPdfToWordPreserveLayout] = useState(true);
  const [pdfToWordExtractImages, setPdfToWordExtractImages] = useState(true);
  const [pdfToWordOcr, setPdfToWordOcr] = useState(false);
  const [pdfToWordOutputFormat, setPdfToWordOutputFormat] = useState<"docx" | "doc">("docx");
  const [pdfToWordPageCount, setPdfToWordPageCount] = useState<number | null>(null);
  const uploadConfig = useMemo(() => getUploadConfig(tool?.slug), [tool?.slug]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "";
  const apiUrl = (path: string) => `${apiBaseUrl}${path}`;
  const relatedTools = useMemo(() => {
    if (!Array.isArray(catalogTools) || !tool) return [];

    return catalogTools
      .filter((candidate) => candidate.slug !== tool.slug && candidate.status === "available" && candidate.category === tool.category)
      .slice(0, 4);
  }, [catalogTools, tool]);
  const landingSteps = tool?.steps?.length ? tool.steps.slice(0, 3) : ["Upload your file", "Adjust the options", "Download the result"];
  const fallbackFaqs = Array.isArray(siteFaqs) ? siteFaqs.slice(0, 5) : [];
  const faqsToShow = tool?.faqs && tool.faqs.length > 0 ? tool.faqs : fallbackFaqs;
  const supportedFormats = uploadConfig.supportedFormats;
  const highlights = uploadConfig.highlights;
  const trustedPoints = TRUST_POINTS;
  const SUPPORTED_OUTPUT = ["png", "jpg", "jpeg", "webp", "bmp", "tiff", "gif", "svg"];
  const compressionPresets = [
    { id: "best", label: "Best Quality", quality: 92, estimateFactor: 0.88, description: "Keep more detail and color fidelity while still shaving off noticeable size." },
    { id: "balanced", label: "Balanced", quality: 78, estimateFactor: 0.65, description: "A practical middle ground for everyday sharing and storage." },
    { id: "max", label: "Maximum Compression", quality: 55, estimateFactor: 0.4, description: "Prioritize small file sizes for uploads, email, and web delivery." },
  ] as const;

  const activeCompressionPreset = compressionPresets.find((preset) => preset.quality === compressQuality) ?? compressionPresets[1];

  const compressionEstimate = useMemo(() => {
    if (!files[0]) return null;

    const originalSize = files[0].size;
    const estimatedSize = Math.max(1024, Math.round(originalSize * activeCompressionPreset.estimateFactor));
    const savedPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - estimatedSize) / originalSize) * 100)) : 0;

    return {
      originalSize,
      estimatedSize,
      savedPercent,
    };
  }, [activeCompressionPreset.estimateFactor, files]);

  const upscalePreviewStats = useMemo(() => {
    if (tool?.slug !== "image-upscale" || !files[0] || imageWidth == null || imageHeight == null) {
      return null;
    }

    const originalWidth = imageWidth;
    const originalHeight = imageHeight;
    const originalPixels = originalWidth * originalHeight;
    const outputWidth = Math.round(originalWidth * upscaleFactor);
    const outputHeight = Math.round(originalHeight * upscaleFactor);
    const outputPixels = outputWidth * outputHeight;
    const originalMegapixels = originalPixels / 1_000_000;
    const outputMegapixels = outputPixels / 1_000_000;
    const approximateOutputSize = Math.max(1024, Math.round(files[0].size * (outputPixels / originalPixels)));
    const estimatedProcessingTimeSeconds = Math.max(8, Math.min(60, Math.round(outputMegapixels * 6 + (upscaleFactor >= 8 ? 8 : 0))));

    return {
      originalWidth,
      originalHeight,
      outputWidth,
      outputHeight,
      originalMegapixels,
      outputMegapixels,
      approximateOutputSize,
      estimatedProcessingTimeSeconds,
    };
  }, [files, imageHeight, imageWidth, tool?.slug, upscaleFactor]);

  const estimateCompressedSize = (size: number, quality: number) => {
    const factor = quality >= 90 ? 0.95
      : quality >= 80 ? 0.85
      : quality >= 70 ? 0.75
      : quality >= 60 ? 0.65
      : quality >= 50 ? 0.55
      : quality >= 40 ? 0.45
      : quality >= 30 ? 0.35
      : quality >= 20 ? 0.30
      : 0.25;
    return Math.max(1024, Math.round(size * factor));
  };

  const allowsMultipleFiles = tool?.slug === "merge-pdf" || tool?.slug === "jpg-to-pdf" || tool?.slug === "image-converter";
  const requiredFileCount = tool?.slug === "merge-pdf" ? 2 : 1;

  const actionLabelBySlug: Record<string, string> = {
    "merge-pdf": "Merge PDF",
    "split-pdf": "Split PDF",
    "compress-pdf": "Compress PDF",
    "rotate-pdf": "Rotate PDF",
    "unlock-pdf": "Unlock PDF",
    "protect-pdf": "Protect PDF",
    "watermark-pdf": "Watermark PDF",
    "add-page-numbers": "Add Page Numbers",
    "image-converter": "Convert Image",
    "pdf-to-word": "Convert to Word",
    "word-to-pdf": "Convert to PDF",
    "jpg-to-pdf": "Convert to PDF",
    "pdf-to-jpg": "Convert to JPG",
    "image-resize": "Resize Image",
    "image-compress": "Compress Image",
    "image-upscale": "Upscale Image",
    "organize-pdf": "Save Organized PDF",
    "delete-pages": "Delete Pages",
    "extract-pages": "Extract Pages",
  };

  const actionLabel = actionLabelBySlug[tool?.slug ?? ""] ?? "Process PDF";

  const buttonLabel = status === "options" ? actionLabel : "Process";
  const selectedPageCount = pdfPages.filter((page) => page.selected).length;
  const uploadHintBySlug: Record<string, string> = {
    "image-converter": "Upload up to 30 image files at once to convert them in a batch.",
    "pdf-to-word": "Upload a PDF with 20 pages or fewer to convert it into a Word document.",
    "word-to-pdf": "Upload a Word document to convert it into a PDF.",
    "jpg-to-pdf": "Upload one or more image files to convert them into a PDF.",
    "pdf-to-jpg": "Upload a PDF to convert its pages into JPG images.",
    "image-resize": "Upload an image to resize its dimensions while preserving quality.",
    "image-compress": "Upload an image to reduce file size while keeping it sharp.",
    "image-upscale": "Upload an image to increase resolution for larger displays.",
    "organize-pdf": "Upload a PDF to reorder, rotate, and remove pages before saving.",
    "delete-pages": "Upload a PDF and select pages you want to remove.",
    "extract-pages": "Upload a PDF and choose pages to extract into a new file.",
    "unlock-pdf": "Upload a password-protected PDF and enter its current password.",
    "protect-pdf": "Upload a PDF and enter a password to secure it.",
  };

  const uploadHint = uploadHintBySlug[tool?.slug ?? ""] ?? (allowsMultipleFiles
    ? `Upload ${requiredFileCount}+ PDF files to ${actionLabel.toLowerCase()}.`
    : `Upload a single PDF file to ${actionLabel.toLowerCase()}.`);

  const ocrMutation = useOcrImageToText();

  // Reset state when slug changes
  useEffect(() => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setProgressStage("Preparing...");
    setDownloadUrl(null);
    setDownloadFileName("processed.pdf");
    setDownloadSizeBytes(null);
    setProcessingTimeMs(null);
    setPdfPages([]);
    setDraggedPageIndex(null);
    setTotalPages(null);
    setPdfToWordPageCount(null);
    setPageRangeError(null);
    setErrorMessage(null);
    setPdfToWordPreserveLayout(true);
    setPdfToWordExtractImages(true);
    setPdfToWordOcr(false);
    setPdfToWordOutputFormat("docx");
    setImageBatchItems([]);
  }, [slug]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const mergePdfOnServer = async (filesToMerge: File[]): Promise<Blob> => {
    const formData = new FormData();
    filesToMerge.forEach((file) => formData.append("files", file));

    const response = await fetch(apiUrl("/api/merge-pdf"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Merge failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const parsePageRangeInput = (input: string, total: number): number[] => {
    if (!input || input.trim() === "") throw new Error("Empty input");
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) throw new Error("Empty input");

    const indices: number[] = [];
    for (const part of parts) {
      const rangeMatch = part.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const a = parseInt(rangeMatch[1], 10);
        const b = parseInt(rangeMatch[2], 10);
        if (isNaN(a) || isNaN(b)) throw new Error("Invalid syntax");
        if (a < 1) throw new Error("Page numbers must be >= 1");
        if (b < a) throw new Error("Range start must be <= range end");
        if (b > total) throw new Error("Page number exceeds total pages");
        for (let i = a; i <= b; i++) indices.push(i - 1);
        continue;
      }

      const numMatch = part.match(/^(\d+)$/);
      if (numMatch) {
        const n = parseInt(numMatch[1], 10);
        if (isNaN(n)) throw new Error("Invalid syntax");
        if (n < 1) throw new Error("Page numbers must be >= 1");
        if (n > total) throw new Error("Page number exceeds total pages");
        indices.push(n - 1);
        continue;
      }

      throw new Error("Invalid syntax");
    }

    return indices;
  };

  const normalizeRotation = (value: number) => (value % 360 + 360) % 360;
  const getThumbnailCacheKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

  const renderPdfThumbnails = async (file: File, pageCount: number) => {
    const cacheKey = getThumbnailCacheKey(file);
    const cached = thumbnailCacheRef.current.get(cacheKey);
    if (cached) {
      setPageThumbnails(cached);
      return;
    }

    const placeholders: Array<string | null> = Array.from({ length: pageCount }, () => null);
    setPageThumbnails(placeholders);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await getDocument({ data: bytes }).promise;
      const thumbnails: Array<string | null> = Array.from({ length: pageCount }, () => null);

      for (let index = 0; index < pageCount; index += 1) {
        const page = await pdf.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1.35 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        if (!context) {
          continue;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        thumbnails[index] = canvas.toDataURL("image/png");
        setPageThumbnails([...thumbnails]);
      }

      thumbnailCacheRef.current.set(cacheKey, thumbnails);
      setPageThumbnails(thumbnails);
    } catch (error) {
      console.error("Unable to render page thumbnails", error);
      setPageThumbnails(placeholders);
    }
  };

  const initializePdfPages = async (file: File) => {
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();

      setTotalPages(pageCount);
      setDocumentRotation(0);
      setPdfPages(
        Array.from({ length: pageCount }, (_, index) => ({
          id: `${file.name}-${index + 1}`,
          pageNumber: index + 1,
          rotation: 0,
          selected: false,
        })),
      );
      setPageThumbnails([]);
      if (["rotate-pdf", "organize-pdf", "delete-pages", "extract-pages"].includes(tool?.slug ?? "")) {
        void renderPdfThumbnails(file, pageCount);
      }
    } catch (error: any) {
      setPageRangeError("Unable to read PDF pages for validation");
      setPdfPages([]);
      setTotalPages(null);
      console.error(error);
    }
  };

  const getSelectedPageCount = () => pdfPages.filter((page) => page.selected).length;

  const canProcess =
    files.length >= requiredFileCount &&
    (tool?.slug === "delete-pages" || tool?.slug === "extract-pages"
      ? getSelectedPageCount() > 0
      : tool?.slug === "organize-pdf"
      ? pdfPages.length > 0
      : true);

  async function postFormDataForBlob(url: string, formData: FormData, errorPrefix: string): Promise<Blob> {
    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `${errorPrefix} failed with HTTP ${response.status}`);
    }
    return await response.blob();
  }

  const splitPdfOnServer = async (fileToSplit: File, range: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToSplit);
    formData.append("pageRange", range);

    return postFormDataForBlob(apiUrl("/api/split-pdf"), formData, "Split");
  };

  const convertPdfToWordOnServer = async (fileToConvert: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

    formData.append("outputFormat", pdfToWordOutputFormat);
    formData.append("preserveLayout", String(pdfToWordPreserveLayout));
    formData.append("extractImages", String(pdfToWordExtractImages));
    formData.append("ocr", String(pdfToWordOcr));

    // Start job
    const startRes = await fetch(apiUrl("/api/pdf-to-word"), { method: "POST", body: formData });
    if (!startRes.ok) {
      const text = await startRes.text().catch(() => null);
      throw new Error(text || `Failed to start PDF->Word conversion (HTTP ${startRes.status})`);
    }

    const { jobId } = await startRes.json();
    if (!jobId) throw new Error("No job id returned");

    // Poll status
    const poll = async (): Promise<void> => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const statusRes = await fetch(apiUrl(`/api/pdf-to-word/status/${jobId}`));
        if (!statusRes.ok) throw new Error(`Job status failed (HTTP ${statusRes.status})`);
        const json = await statusRes.json();
        const { status, currentPage, totalPages, error } = json as any;
        if (status === "processing") {
          setProgressStage(`Converting page ${currentPage} of ${totalPages}...`);
        }
        if (status === "done") return;
        if (status === "error") throw new Error(error || "Conversion failed");
        // wait before next poll
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 900));
      }
    };

    await poll();

    // Fetch result
    const resultRes = await fetch(apiUrl(`/api/pdf-to-word/result/${jobId}`));
    if (!resultRes.ok) {
      const text = await resultRes.text().catch(() => null);
      throw new Error(text || `Conversion result fetch failed (HTTP ${resultRes.status})`);
    }

    return await resultRes.blob();
  };

  const convertWordToPdfOnServer = async (fileToConvert: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

  
    return postFormDataForBlob(apiUrl("/api/convert-word-to-pdf"), formData, "Word to PDF conversion");
  };

  const convertJpgToPdfOnServer = async (filesToConvert: File[]): Promise<Blob> => {
    const formData = new FormData();
    filesToConvert.forEach((file) => formData.append("files", file));

    return postFormDataForBlob(apiUrl("/api/convert-jpg-to-pdf"), formData, "JPG to PDF conversion");
  };

  const convertPdfToJpgOnServer = async (fileToConvert: File): Promise<{ blob: Blob; filename: string }> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

    const response = await fetch(apiUrl("/api/convert-pdf-to-jpg"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `PDF to JPG conversion failed with HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition") || "";
    const filenameMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
    const filename = filenameMatch ? filenameMatch[1] : stripExtension(fileToConvert.name) + ".jpg";
    return { blob, filename };
  };

  const protectPdfOnServer = async (fileToConvert: File, password: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("password", password);

    return postFormDataForBlob(apiUrl("/api/protect-pdf"), formData, "Protect PDF");
  };

  const unlockPdfOnServer = async (fileToConvert: File, password: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("password", password);

    return postFormDataForBlob(apiUrl("/api/unlock-pdf"), formData, "Unlock PDF");
  };

  const watermarkPdfOnServer = async (fileToWatermark: File, text: string, position: string, logoFile: File | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToWatermark);
    formData.append("text", text);
    formData.append("position", position);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    return postFormDataForBlob(apiUrl("/api/watermark-pdf"), formData, "Watermark PDF");
  };

  const addPageNumbersOnServer = async (fileToNumber: File, startNumber: number, position: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToNumber);
    formData.append("startNumber", String(startNumber));
    formData.append("position", position);

    return postFormDataForBlob(apiUrl("/api/add-page-numbers"), formData, "Add Page Numbers");
  };

  const convertImageOnServer = async (fileToConvert: File, outFormat: string, svgModeChoice: "embed" | "trace" = "embed"): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("outputFormat", outFormat);
    if (outFormat === "svg") {
      formData.append("svgMode", svgModeChoice);
    }

    return postFormDataForBlob(apiUrl("/api/convert-image"), formData, "Image conversion");
  };

  const resizeImageOnServer = async (fileToResize: File, width: number | null, height: number | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToResize);
    if (width != null) formData.append("width", String(width));
    if (height != null) formData.append("height", String(height));

    return postFormDataForBlob(apiUrl("/api/image-resize"), formData, "Image resize");
  };

  const compressImageOnServer = async (fileToCompress: File, quality: number): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToCompress);
    formData.append("quality", String(quality));

    return postFormDataForBlob(apiUrl("/api/image-compress"), formData, "Image compression");
  };

  const compressPdfOnServer = async (fileToCompress: File, compressionLevel: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToCompress);
    formData.append("compressionLevel", compressionLevel);

    return postFormDataForBlob(apiUrl("/api/compress-pdf"), formData, "PDF compression");
  };

  const upscaleImageOnServer = async (fileToUpscale: File, scale: number, width: number | null, height: number | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToUpscale);
    formData.append("scale", String(scale));
    if (width != null) formData.append("width", String(width));
    if (height != null) formData.append("height", String(height));

    return postFormDataForBlob(apiUrl("/api/image-upscale"), formData, "Image upscale");
  };

  const organizePdfOnServer = async (fileToOrganize: File, pageOrder: number[], rotations: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToOrganize);
    formData.append("pageOrder", JSON.stringify(pageOrder));
    formData.append("rotations", JSON.stringify(rotations));

    return postFormDataForBlob(apiUrl("/api/organize-pdf"), formData, "Organize PDF");
  };

  const rotatePdfOnServer = async (fileToRotate: File, rotationOrRotations: number | number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToRotate);

    if (Array.isArray(rotationOrRotations)) {
      formData.append("rotations", JSON.stringify(rotationOrRotations));
    } else {
      formData.append("rotation", String(rotationOrRotations));
    }

    return postFormDataForBlob(apiUrl("/api/rotate-pdf"), formData, "Rotate PDF");
  };

  const deletePagesOnServer = async (fileToDeleteFrom: File, pagesToDelete: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToDeleteFrom);
    formData.append("pages", pagesToDelete.join(","));

    return postFormDataForBlob(apiUrl("/api/delete-pages"), formData, "Delete Pages");
  };

  const extractPagesOnServer = async (fileToExtractFrom: File, pages: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToExtractFrom);
    formData.append("pages", pages.join(","));

    return postFormDataForBlob(apiUrl("/api/extract-pages"), formData, "Extract Pages");
  };

  const movePage = (index: number, direction: "up" | "down") => {
    setPdfPages((pages) => {
      const next = [...pages];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return next;
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const rotatePage = (index: number, delta: number) => {
    setPdfPages((pages) => {
      const next = [...pages];
      const page = next[index];
      if (!page) return next;
      page.rotation = normalizeRotation(page.rotation + delta);
      return next;
    });
  };

  const applyRotationToPages = (indices: number[], rotation: number) => {
    setPdfPages((pages) => pages.map((page, index) => (indices.includes(index) ? { ...page, rotation } : page)));
  };

  const rotateAllPages = (delta: number) => {
    const indices = pdfPages.map((_, index) => index);
    setPdfPages((pages) => pages.map((page, index) => (indices.includes(index) ? { ...page, rotation: normalizeRotation(page.rotation + delta) } : page)));
  };

  const applyWholeDocumentRotation = (delta: number) => {
    setDocumentRotation((current) => normalizeRotation(current + delta));
  };

  const rotateSelectedPages = (delta: number) => {
    const selectedIndexes = pdfPages.map((page, index) => (page.selected ? index : -1)).filter((index) => index >= 0);
    if (selectedIndexes.length === 0) {
      return;
    }

    setPdfPages((pages) => pages.map((page, index) => (selectedIndexes.includes(index) ? { ...page, rotation: normalizeRotation(page.rotation + delta) } : page)));
  };

  const resetSelectedPages = () => {
    const selectedIndexes = pdfPages.map((page, index) => (page.selected ? index : -1)).filter((index) => index >= 0);
    if (selectedIndexes.length === 0) {
      return;
    }

    setPdfPages((pages) => pages.map((page, index) => (selectedIndexes.includes(index) ? { ...page, rotation: 0 } : page)));
  };

  const resetAllPages = () => {
    setPdfPages((pages) => pages.map((page) => ({ ...page, rotation: 0 })));
    setDocumentRotation(0);
  };

  const togglePageSelection = (index: number) => {
    setPdfPages((pages) => {
      const next = [...pages];
      const page = next[index];
      if (!page) return next;
      page.selected = !page.selected;
      return next;
    });
  };

  const prepareLocalDownload = async (): Promise<void> => {
    const rawFile = files[0];
    const baseName = stripExtension(rawFile.name);
    let outputName = `${baseName}-${tool?.slug}.pdf`;

    switch (tool?.slug) {
      case "split-pdf":
        outputName = `${baseName}-split.pdf`;
        break;
      case "compress-pdf":
        outputName = `${baseName}-compressed.pdf`;
        break;
      case "rotate-pdf":
        outputName = `${baseName}-rotated.pdf`;
        break;
      case "unlock-pdf":
        outputName = `${baseName}-unlocked.pdf`;
        break;
      case "protect-pdf":
        outputName = `${baseName}-protected.pdf`;
        break;
      case "watermark-pdf":
        outputName = `${baseName}-watermarked.pdf`;
        break;
      case "add-page-numbers":
        outputName = `${baseName}-numbered.pdf`;
        break;
      default:
        outputName = `${baseName}-${tool?.slug}.pdf`;
    }

    const blob = new Blob([await rawFile.arrayBuffer()], {
      type: rawFile.type || "application/pdf",
    });

    setDownloadUrl(URL.createObjectURL(blob));
    setDownloadFileName(outputName);
  };

  const parseFilenameFromDisposition = (contentDisposition: string | null, fallback: string) => {
    if (!contentDisposition) return fallback;
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        return utf8Match[1];
      }
    }

    const asciiMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
    return asciiMatch?.[1] || fallback;
  };

  const toolSchema = useMemo(() => {
    if (!tool) return null;

    const faqSchema = tool.faqs?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

    return [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `PDFKira ${tool.name}`,
        description: tool.seoDescription,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/${tool.slug}`,
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `${SITE_URL}/${tool.slug}` },
        ],
      },
      ...(faqSchema ? [faqSchema] : []),
    ];
  }, [tool]);

  useSEOAdvanced({
    title: tool?.seoTitle || "Loading...",
    description: tool?.seoDescription || "Browser-based PDF tool",
    canonical: tool ? `${SITE_URL}/${tool.slug}` : SITE_URL,
    jsonLd: toolSchema || undefined,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-8">
        <BrandMark className="justify-center" logoClassName="h-10" wordmarkClassName="text-lg" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !tool) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Tool not found</h1>
        <p className="text-xl text-muted-foreground mb-8">We couldn't find the tool you're looking for.</p>
        <Button asChild><Link href="/tools">Back to All Tools</Link></Button>
      </div>
    );
  }

  const isComingSoon = tool.status === "comingSoon";

  if (tool.slug === "qr-code-generator") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="border-b border-border bg-card/90 pt-8 pb-10">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <nav className="mb-8 flex items-center text-sm font-medium text-muted-foreground">
              <Link href="/tools" className="transition-colors hover:text-primary">Tools</Link>
              <ChevronRight className="mx-2 h-4 w-4 opacity-50" />
              <span className="text-foreground">{tool.name}</span>
            </nav>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
                  <Icon name={tool.icon} className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{tool.name}</h1>
                  <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{tool.shortDescription}</p>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Live preview • Print ready
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto flex-1 px-4 py-8 md:px-6 md:py-12">
          <QrCodeGeneratorTool />
        </div>
      </div>
    );
  }

  if (tool.slug === "sign-pdf") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="border-b border-border bg-card/90 pt-8 pb-10">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <nav className="mb-8 flex items-center text-sm font-medium text-muted-foreground">
              <Link href="/tools" className="transition-colors hover:text-primary">Tools</Link>
              <ChevronRight className="mx-2 h-4 w-4 opacity-50" />
              <span className="text-foreground">{tool.name}</span>
            </nav>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
                  <Icon name={tool.icon} className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{tool.name}</h1>
                  <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{tool.shortDescription}</p>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Live preview • PDF ready
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto flex-1 px-4 py-8 md:px-6 md:py-12">
          <SignPdfTool />
        </div>
      </div>
    );
  }

  const resetImagePreviewState = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setImageWidth(null);
    setImageHeight(null);
    setImageFormat(null);
  };

  const prepareSingleImagePreview = async (file: File) => {
    const isHeic = (f: File) => {
      const name = f.name.toLowerCase();
      const type = (f.type || "").toLowerCase();
      return name.endsWith(".heic") || name.endsWith(".heif") || type.includes("heic") || type.includes("heif");
    };

    let fileForPreview = file;
    if (isHeic(file)) {
      try {
        const form = new FormData();
        form.append("files", file);
        form.append("outputFormat", "png");
        const previewRes = await fetch(apiUrl("/api/convert-image"), { method: "POST", body: form });
        if (previewRes.ok) {
          const blob = await previewRes.blob();
          fileForPreview = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".png"), { type: "image/png", lastModified: file.lastModified });
        } else {
          console.error("HEIC preview conversion failed", await previewRes.text().catch(() => null));
          setErrorMessage("Unable to generate preview for HEIC/HEIF file. You can still try converting the file.");
          fileForPreview = file;
        }
      } catch (err) {
        console.error("HEIC preview error", err);
        setErrorMessage("Unable to generate preview for HEIC/HEIF file. You can still try converting the file.");
        fileForPreview = file;
      }
    }

    resetImagePreviewState();
    const url = URL.createObjectURL(fileForPreview);
    setImagePreviewUrl(url);
    const inferredFormat = (fileForPreview.type.replace(/^image\//, "") || fileForPreview.name.split(".").pop() || "unknown").toUpperCase();
    setImageFormat(inferredFormat);
    setImageWidth(null);
    setImageHeight(null);
    setUpscaleFactor(4);
    const img = new Image();
    img.onload = () => {
      setImageWidth(img.naturalWidth);
      setImageHeight(img.naturalHeight);
    };
    img.onerror = () => {
      setImageWidth(null);
      setImageHeight(null);
    };
    img.src = url;
  };

  const syncImageBatchItems = (nextFiles: File[]) => {
    setImageBatchItems(
      nextFiles.map((file) => ({
        file,
        status: "pending" as BatchItemStatus,
        error: null,
      })),
    );
  };

  const handleFilesSelected = async (newFiles: File[]) => {
    if (tool?.slug === "image-converter") {
      const combinedFiles = [...files, ...newFiles];
      const limitedFiles = combinedFiles.slice(0, 30);
      if (combinedFiles.length > 30) {
        setErrorMessage("You can upload up to 30 images at once. The extra files were ignored.");
      } else {
        setErrorMessage(null);
      }
      setFiles(limitedFiles);
      setPdfPages([]);
      setTotalPages(null);
      setPageRangeError(null);
      if (limitedFiles.length === 1) {
        await prepareSingleImagePreview(limitedFiles[0]);
      } else {
        resetImagePreviewState();
        syncImageBatchItems(limitedFiles);
      }
      setStatus("options");
      return;
    }

    if (!allowsMultipleFiles) {
      const first = newFiles[0];
      setFiles([first]);
      setPdfPages([]);
      setTotalPages(null);
      setPageRangeError(null);
      if (tool?.slug === "pdf-to-word") {
        (async () => {
          try {
            const bytes = await first.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const pageCount = pdf.getPageCount();
            setTotalPages(pageCount);
            setPageRangeError(pageCount > 20 ? "PDFs with more than 20 pages are not supported for Word conversion." : null);
            if (pageCount > 20) {
              setErrorMessage("PDFs with more than 20 pages are not supported for Word conversion.");
            } else {
              setErrorMessage(null);
            }
          } catch (error: any) {
            setTotalPages(null);
            setPageRangeError("Unable to read PDF pages for validation");
            setErrorMessage("Unable to validate the PDF before conversion.");
          }
        })();
      }
      if (tool?.slug === "image-converter" || tool?.slug === "image-upscale" || tool?.slug === "image-compress") {
        await prepareSingleImagePreview(first);
      } else if (tool?.slug === "split-pdf" || tool?.slug === "compress-pdf") {
        (async () => {
          try {
            const bytes = await first.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            setTotalPages(pdf.getPageCount());
            setPageRangeError(null);
          } catch (e) {
            setTotalPages(null);
            setPageRangeError("Unable to read PDF pages for validation");
          }
        })();
      } else if (
        tool?.slug === "organize-pdf" ||
        tool?.slug === "rotate-pdf" ||
        tool?.slug === "delete-pages" ||
        tool?.slug === "extract-pages"
      ) {
        initializePdfPages(first);
      }
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }
    setStatus("options");
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      if (updated.length === 0) {
        setStatus("idle");
        setPdfPages([]);
        resetImagePreviewState();
        setDownloadUrl(null);
        setImageBatchItems([]);
      } else if (tool?.slug === "image-converter") {
        if (updated.length === 1) {
          void prepareSingleImagePreview(updated[0]);
        } else {
          resetImagePreviewState();
          syncImageBatchItems(updated);
        }
        setStatus("options");
      }
      return updated;
    });
  };

  const triggerFileDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcess = async () => {
    if (!canProcess || !tool) return;

    const startTime = Date.now();
    setErrorMessage(null);
    setStatus("processing");
    setProgress(0);
    setDownloadUrl(null);
    setPassword("");

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 5;
        const capped = Math.min(95, next);
        if (tool.slug === "rotate-pdf") {
          if (capped < 35) {
            setProgressStage("Uploading file...");
          } else if (capped < 75) {
            setProgressStage("Applying rotations...");
          } else {
            setProgressStage("Generating PDF...");
          }
        } else if (tool.slug === "compress-pdf") {
          if (capped < 35) {
            setProgressStage("Analyzing document structure...");
          } else if (capped < 75) {
            setProgressStage("Compressing pages and streams...");
          } else {
            setProgressStage("Finalizing download package...");
          }
        } else {
          if (capped < 35) {
            setProgressStage("Preparing optimized output...");
          } else if (capped < 75) {
            setProgressStage("Applying quality-preserving compression...");
          } else {
            setProgressStage("Finishing the optimized file...");
          }
        }
        return capped;
      });
    }, 400);

    try {
      let blob: Blob;
      let outputName = "processed.pdf";

      if (tool.slug === "pdf-to-word") {
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pageCount = pdf.getPageCount();
        if (pageCount > 20) {
          throw new Error("PDFs with more than 20 pages are not supported for Word conversion.");
        }
        blob = await convertPdfToWordOnServer(files[0]);
        outputName = stripExtension(files[0].name) + ".docx";
      } else if (tool.slug === "image-converter" && files.length > 1) {
        const concurrencyLimit = Math.min(4, files.length);
        let nextIndex = 0;
        const successfulResults: Array<{ blob: Blob; outputName: string }> = [];
        const failedItems: Array<{ fileName: string; message: string }> = [];
        const totalFiles = files.length;
        syncImageBatchItems(files);

        await Promise.all(
          Array.from({ length: concurrencyLimit }, async () => {
            while (nextIndex < totalFiles) {
              const currentIndex = nextIndex++;
              const currentFile = files[currentIndex];
              if (!currentFile) continue;
              setImageBatchItems((prev) => prev.map((item, index) => (index === currentIndex ? { ...item, status: "converting", error: null } : item)));
              setProgressStage(`Converting ${currentFile.name}`);

              try {
                const convertedBlob = await convertImageOnServer(currentFile, outputFormat, svgMode);
                const baseName = stripExtension(currentFile.name);
                const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
                const resolvedName = `${baseName}.${ext}`;
                successfulResults.push({ blob: convertedBlob, outputName: resolvedName });
                setImageBatchItems((prev) => prev.map((item, index) => (index === currentIndex ? { ...item, status: "done", error: null, blob: convertedBlob, outputName: resolvedName } : item)));
              } catch (error: any) {
                const message = error?.message || "Image conversion failed.";
                failedItems.push({ fileName: currentFile.name, message });
                setImageBatchItems((prev) => prev.map((item, index) => (index === currentIndex ? { ...item, status: "failed", error: message } : item)));
              }

              const completedCount = successfulResults.length + failedItems.length;
              const nextProgress = Math.min(95, Math.round((completedCount / totalFiles) * 100));
              setProgress(nextProgress);
              setProgressStage(`Processed ${completedCount}/${totalFiles} files`);
            }
          }),
        );

        if (successfulResults.length > 1) {
          const zip = new JSZip();
          successfulResults.forEach((result) => zip.file(result.outputName, result.blob));
          const zipBlob = await zip.generateAsync({ type: "blob" });
          setDownloadUrl(URL.createObjectURL(zipBlob));
          setDownloadFileName(`converted-images-${Date.now()}.zip`);
          setDownloadSizeBytes(zipBlob.size);
          setProgress(100);
          setProgressStage("Ready to download");
        } else if (successfulResults.length === 1) {
          const firstResult = successfulResults[0];
          if (firstResult) {
            setDownloadUrl(URL.createObjectURL(firstResult.blob));
            setDownloadFileName(firstResult.outputName);
            setDownloadSizeBytes(firstResult.blob.size);
            setProgress(100);
            setProgressStage("Ready to download");
          }
        }

        if (successfulResults.length > 0) {
          setStatus("success");
        } else {
          setErrorMessage("All images failed to convert. Review the batch list for details.");
          setStatus("options");
        }

        if (failedItems.length > 0 && successfulResults.length > 0) {
          setErrorMessage("Some images failed to convert. The rest are ready to download.");
        }

        clearInterval(interval);
        return;
      } else if (tool.slug === "merge-pdf") {
        blob = await mergePdfOnServer(files);
        outputName = "merged.pdf";
      } else if (tool.slug === "split-pdf") {
        // Validate page range before sending
        try {
          if (!pageRange || pageRange.trim() === "") throw new Error("Empty input");
          if (!totalPages) throw new Error("Unable to read PDF pages");
          parsePageRangeInput(pageRange, totalPages);
        } catch (err: any) {
          setPageRangeError(err.message || "Invalid page range");
          setStatus("options");
          return;
        }

        blob = await splitPdfOnServer(files[0], pageRange);
        outputName = stripExtension(files[0].name) + `-split.pdf`;
      } else if (tool.slug === "image-converter") {
        blob = await convertImageOnServer(files[0], outputFormat, svgMode);
        const baseName = stripExtension(files[0].name);
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
        outputName = `${baseName}.${ext}`;
      } else if (tool.slug === "pdf-to-word") {
        blob = await convertPdfToWordOnServer(files[0]);
        outputName = stripExtension(files[0].name) + ".docx";
      } else if (tool.slug === "word-to-pdf") {
        blob = await convertWordToPdfOnServer(files[0]);
        outputName = stripExtension(files[0].name) + ".pdf";
      } else if (tool.slug === "jpg-to-pdf") {
        blob = await convertJpgToPdfOnServer(files);
        outputName = "images.pdf";
      } else if (tool.slug === "pdf-to-jpg") {
        const pdfResult = await convertPdfToJpgOnServer(files[0]);
        blob = pdfResult.blob;
        outputName = pdfResult.filename;
      } else if (tool.slug === "image-resize") {
        const width = resizeWidth ? Number(resizeWidth) : null;
        const height = resizeHeight ? Number(resizeHeight) : null;
        blob = await resizeImageOnServer(files[0], width, height);
        outputName = stripExtension(files[0].name) + "-resized" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "image-compress") {
        blob = await compressImageOnServer(files[0], compressQuality);
        outputName = stripExtension(files[0].name) + "-compressed" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "compress-pdf") {
        const compressionPreset = compressionPresets.find((preset) => preset.quality === compressQuality);
        const compressionLevel = compressionPreset?.id === "max" ? "maximum" : "balanced";
        blob = await compressPdfOnServer(files[0], compressionLevel);
        outputName = stripExtension(files[0].name) + "-compressed.pdf";
      } else if (tool.slug === "image-upscale") {
        const width = upscaleWidth ? Number(upscaleWidth) : null;
        const height = upscaleHeight ? Number(upscaleHeight) : null;
        blob = await upscaleImageOnServer(files[0], upscaleFactor, width, height);
        outputName = stripExtension(files[0].name) + "-upscaled" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "protect-pdf") {
        blob = await protectPdfOnServer(files[0], password);
        outputName = stripExtension(files[0].name) + "-protected.pdf";
      } else if (tool.slug === "unlock-pdf") {
        blob = await unlockPdfOnServer(files[0], password);
        outputName = stripExtension(files[0].name) + "-unlocked.pdf";
      } else if (tool.slug === "watermark-pdf") {
        blob = await watermarkPdfOnServer(files[0], watermarkText, watermarkPosition, watermarkLogo);
        outputName = stripExtension(files[0].name) + "-watermarked.pdf";
      } else if (tool.slug === "add-page-numbers") {
        const startNumber = Number(pageNumberStart || 1);
        blob = await addPageNumbersOnServer(files[0], Number.isFinite(startNumber) ? startNumber : 1, pageNumberPosition);
        outputName = stripExtension(files[0].name) + "-numbered.pdf";
      } else if (tool.slug === "rotate-pdf") {
        blob = await rotatePdfOnServer(files[0], documentRotation);
        outputName = stripExtension(files[0].name) + "-rotated.pdf";
      } else if (tool.slug === "organize-pdf") {
        const pageOrder = pdfPages.map((page) => page.pageNumber);
        const rotations = pdfPages.map((page) => page.rotation);
        blob = await organizePdfOnServer(files[0], pageOrder, rotations);
        outputName = stripExtension(files[0].name) + "-organized.pdf";
      } else if (tool.slug === "delete-pages") {
        const pagesToDelete = pdfPages.filter((page) => page.selected).map((page) => page.pageNumber);
        blob = await deletePagesOnServer(files[0], pagesToDelete);
        outputName = stripExtension(files[0].name) + "-deleted-pages.pdf";
      } else if (tool.slug === "extract-pages") {
        const pages = pdfPages.filter((page) => page.selected).map((page) => page.pageNumber);
        blob = await extractPagesOnServer(files[0], pages);
        outputName = stripExtension(files[0].name) + "-extracted-pages.pdf";
      } else if (tool.slug === "ocr-image-to-text") {
        const form = new FormData();
        form.append("files", files[0]);
        const res = await ocrMutation.mutateAsync({ data: form });
        const text = res?.text || "";
        setOcrText(text);
        // create a small blob so users can download if needed
        const blobRes = new Blob([text], { type: "text/plain" });
        blob = blobRes;
        outputName = stripExtension(files[0].name) + "-ocr.txt";
      } else {
        const rawFile = files[0];
        outputName = stripExtension(rawFile.name) + `-${tool.slug}.pdf`;
        blob = new Blob([await rawFile.arrayBuffer()], {
          type: rawFile.type || "application/pdf",
        });
      }

      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFileName(outputName);
      setDownloadSizeBytes(blob.size);
      setProcessingTimeMs(Date.now() - startTime);
      setStatus("success");
      setProgress(100);
      setProgressStage(tool.slug === "rotate-pdf" ? "Preparing download" : "Ready to download");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Failed to process the file. Please try again.");
      setStatus("options");
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb & Header */}
      <div className="bg-card border-b border-border pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-8">
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground">{tool.name}</span>
          </nav>
          
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-sm">
              <Icon name={tool.icon} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                {tool.name}
                {isComingSoon && (
                  <span className="text-sm font-medium px-3 py-1 bg-muted text-muted-foreground rounded-full border">
                    Coming Soon
                  </span>
                )}
              </h1>
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl ml-[72px]">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl flex-1">
        
        {isComingSoon ? (
          <div className="bg-secondary/30 rounded-3xl p-12 text-center border border-border">
            <div className="w-20 h-20 bg-secondary text-primary mx-auto rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">We're working on this tool</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              This feature is currently in development and will be available soon. Check back later!
            </p>
          </div>
        ) : status === "idle" ? (
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 md:p-10 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/12),transparent_32%),radial-gradient(circle_at_bottom_left,theme(colors.accent/10),transparent_28%)] opacity-80" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:items-start">
              <div className="space-y-8">
                <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Secure processing · Fast · Free · No registration
                </Badge>

                <div className="flex items-start gap-4">
                  <div className="rounded-3xl bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/20">
                    <Icon name={tool.icon} className="h-8 w-8" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                      {tool.name}
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trustedPoints.map((point) => (
                    <Badge key={point} variant="outline" className="rounded-full border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                      {point}
                    </Badge>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((highlight) => (
                    <div key={highlight} className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {landingSteps.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-[28px] border border-border/70 bg-background/90 p-5 shadow-sm backdrop-blur-sm">
                <UploadArea
                  onFilesSelected={handleFilesSelected}
                  onError={setErrorMessage}
                  multiple={allowsMultipleFiles}
                  accept={uploadConfig.accept}
                  maxSizeMB={uploadConfig.maxSizeMB}
                  label={uploadConfig.label}
                  description={uploadConfig.description}
                />

                {errorMessage && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Supported formats
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supportedFormats.map((format) => (
                      <Badge key={format} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Smooth drag-and-drop upload
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/favicon.png" alt="PDFKira" className="h-4 w-4 object-cover rounded-sm" />
                      Friendly preview before processing
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-primary" />
                      Built for desktop and mobile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-10 transition-all">
            
            {status === "options" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UploadArea
                  onFilesSelected={handleFilesSelected}
                  onError={setErrorMessage}
                  multiple={allowsMultipleFiles}
                  accept={uploadConfig.accept}
                  maxSizeMB={uploadConfig.maxSizeMB}
                  label={uploadConfig.label}
                  description={uploadConfig.description}
                        />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  {uploadHint}
                </p>
                <div className="flex-1">
                  {tool.slug === "image-converter" && files.length > 1 ? (
                    <div className="w-full space-y-3 mt-8">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          Batch queue ({files.length})
                        </h4>
                        <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Up to 30 files
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {imageBatchItems.map((item, index) => {
                          const extension = item.file.name.split(".").pop()?.toUpperCase() || "FILE";
                          const statusTone = item.status === "done"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : item.status === "failed"
                            ? "border-destructive/20 bg-destructive/10 text-destructive"
                            : item.status === "converting"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border/70 bg-background/80 text-muted-foreground";

                          return (
                            <div key={`${item.file.name}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/90 p-3 shadow-sm">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-medium text-foreground" title={item.file.name}>{item.file.name}</p>
                                  <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
                                    {extension}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                                {item.error ? <p className="mt-1 text-xs text-destructive">{item.error}</p> : null}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusTone}`}>
                                  {item.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border border-border/70 bg-background/95 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                                  onClick={() => handleRemoveFile(index)}
                                  aria-label={`Remove ${item.file.name}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <FilePreviewList 
                      files={files} 
                      onRemove={handleRemoveFile} 
                      status="options" 
                    />
                  )}

                  {(tool.slug === "organize-pdf" || tool.slug === "rotate-pdf" || tool.slug === "delete-pages" || tool.slug === "extract-pages") && (
                    <div className="mt-6 space-y-3">
                      {tool.slug === "rotate-pdf" ? (
                        <div className="space-y-4">
                          {files[0] ? (
                            <>
                              <div className="rounded-[28px] border border-border/70 bg-background/70 p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">Rotate PDF</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Choose specific pages or rotate the entire document in one step.</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => applyWholeDocumentRotation(-90)}>90° Left</Button>
                                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => applyWholeDocumentRotation(90)}>90° Right</Button>
                                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => applyWholeDocumentRotation(180)}>180°</Button>
                                  </div>
                                </div>

                                <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                                  <div className="rounded-[24px] border border-border/60 bg-card/80 p-4 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-semibold text-foreground">Upload details</p>
                                        <p className="text-sm text-muted-foreground">Review the file before saving the rotated PDF.</p>
                                      </div>
                                      <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        {files[0].name}
                                      </Badge>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                      <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">File name</p>
                                        <p className="mt-1 font-semibold text-foreground">{files[0].name}</p>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Pages</p>
                                        <p className="mt-1 font-semibold text-foreground">{totalPages ?? "—"}</p>
                                      </div>
                                      <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Size</p>
                                        <p className="mt-1 font-semibold text-foreground">{formatBytes(files[0].size)}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="rounded-[24px] border border-border/60 bg-card/80 p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-foreground">Quick actions</p>
                                    <div className="mt-3 space-y-2">
                                      <Button variant="outline" className="w-full justify-start rounded-2xl" onClick={() => applyWholeDocumentRotation(90)}>Rotate all pages 90° right</Button>
                                      <Button variant="outline" className="w-full justify-start rounded-2xl" onClick={() => applyWholeDocumentRotation(-90)}>Rotate all pages 90° left</Button>
                                      <Button variant="outline" className="w-full justify-start rounded-2xl" onClick={() => applyWholeDocumentRotation(180)}>Rotate all pages 180°</Button>
                                      <Button variant="outline" className="w-full justify-start rounded-2xl" onClick={() => resetAllPages()}>Reset all pages</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <OrganizeGrid
                                pages={pdfPages}
                                onUpdate={(next) => setPdfPages(next)}
                                onRotate={(indexes, delta) => {
                                  setPdfPages((pages) => pages.map((page, index) => (indexes.includes(index) ? { ...page, rotation: normalizeRotation(page.rotation + delta) } : page)));
                                }}
                                  onDelete={() => undefined}
                                onExtract={() => undefined}
                                onSaveChanges={handleProcess}
                                zoom={thumbnailZoom}
                                setZoom={setThumbnailZoom}
                                alwaysShowActions
                                mode="rotate"
                                  enableRotateControls={true}
                                thumbnailUrls={pageThumbnails}
                              />
                            </>
                          ) : (
                            <div className="rounded-[28px] border border-dashed border-border/70 bg-background/70 p-10 text-center shadow-sm">
                              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary overflow-hidden">
                                <img src="/favicon.png" alt="PDFKira" className="h-10 w-10 object-cover rounded-lg" />
                              </div>
                              <h3 className="mt-4 text-xl font-semibold text-foreground">Upload a PDF to start rotating</h3>
                              <p className="mt-2 text-sm text-muted-foreground">Use the full-document controls to rotate everything in one step.</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-foreground">Page preview</h3>
                          </div>
                          <OrganizeGrid
                            pages={pdfPages}
                            onUpdate={(next) => setPdfPages(next)}
                            onRotate={(indexes, delta) => {
                              setPdfPages((pages) => {
                                const next = pages.slice();
                                indexes.forEach((i) => {
                                  next[i] = { ...next[i], rotation: ((next[i].rotation + delta) % 360 + 360) % 360 };
                                });
                                return next;
                              });
                            }}
                            onDelete={(pageIds) => {
                              setPdfPages((pages) => {
                                // update thumbnails based on the same pages -> thumbnails alignment
                                setPageThumbnails((prev) => removePagesById(pages, pageIds, prev).thumbnails);
                                return removePagesById(pages, pageIds).pages;
                              });
                            }}
                            onExtract={(indexes) => {
                              setPdfPages((pages) => pages.map((p, i) => ({ ...p, selected: indexes.includes(i) || p.selected })));
                            }}
                            onSaveChanges={handleProcess}
                            zoom={thumbnailZoom}
                            setZoom={setThumbnailZoom}
                            thumbnailUrls={pageThumbnails}
                            enableRotateControls={tool.slug !== "delete-pages"}
                            allowPerCardDelete={tool.slug !== "delete-pages"}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {(tool.slug === "image-upscale" || tool.slug === "image-compress" || tool.slug === "compress-pdf" || (tool.slug === "image-converter" && files.length === 1)) && files[0] && (
                    <div className="mt-6 rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {tool.slug === "image-upscale"
                              ? "Image details & upscale preview"
                              : tool.slug === "image-compress"
                              ? "Image details & compression preview"
                              : tool.slug === "compress-pdf"
                              ? "PDF details & compression preview"
                              : "Image details"}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {tool.slug === "image-upscale"
                              ? "Review the source image and estimate the output before processing."
                              : tool.slug === "image-compress"
                              ? "Review the source image and estimate the optimized output before compression."
                              : tool.slug === "compress-pdf"
                              ? "Review the source document and estimate the optimized size before compression."
                              : "Preview the uploaded image and confirm the file details before conversion."}
                          </p>
                        </div>
                        {tool.slug === "image-upscale" && (
                          <Badge variant="secondary" className="rounded-full border border-primary/20 bg-primary/10 text-primary">
                            AI-ready preview
                          </Badge>
                        )}
                      </div>

                      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-3">
                          {tool.slug === "compress-pdf" ? (
                              <div className="flex h-[260px] flex-col items-center justify-center gap-3 rounded-2xl bg-muted/50 px-4 text-center">
                              <img src="/favicon.png" alt="PDFKira" className="h-12 w-12 object-cover" />
                              <div>
                                <p className="font-semibold text-foreground">{files[0].name}</p>
                                <p className="mt-1 text-sm text-muted-foreground">PDF preview will be generated after compression.</p>
                              </div>
                            </div>
                          ) : imagePreviewUrl ? (
                            <img src={imagePreviewUrl} alt="preview" className="h-full max-h-[320px] w-full object-contain" />
                          ) : (
                            <div className="flex h-[240px] items-center justify-center rounded-2xl bg-muted/60 text-sm text-muted-foreground">
                              Preview unavailable
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {tool.slug === "image-upscale" && (
                            <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">Scale factor</p>
                              </div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {[2, 4, 8].map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => setUpscaleFactor(value)}
                                    className={`rounded-2xl border px-3 py-3 text-left transition-all ${upscaleFactor === value ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-foreground">{value}×</span>
                                      {value === 4 && (
                                        <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                          Recommended
                                        </Badge>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground">Choose the target enlargement before processing. Higher values increase detail synthesis and processing time.</p>
                            </div>
                          )}

                          {(tool.slug === "image-compress" || tool.slug === "compress-pdf") && (
                            <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">Compression preset</p>
                              </div>
                              <div className="mt-3 grid gap-2 md:grid-cols-3">
                                {compressionPresets.map((preset) => (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => setCompressQuality(preset.quality)}
                                    className={`rounded-2xl border px-3 py-3 text-left transition-all ${compressQuality === preset.quality ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-semibold text-foreground">{preset.label}</span>
                                      {preset.id === "balanced" && (
                                        <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                          Preferred
                                        </Badge>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground">{activeCompressionPreset.description}</p>
                            </div>
                          )}

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{tool.slug === "compress-pdf" ? "Pages" : "Resolution"}</p>
                              <p className="mt-1 font-semibold text-foreground">{tool.slug === "compress-pdf" ? (totalPages ? `${totalPages} pages` : "Loading...") : imageWidth && imageHeight ? `${imageWidth} × ${imageHeight}` : "Loading..."}</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Format</p>
                              <p className="mt-1 font-semibold text-foreground">{imageFormat || (tool.slug === "compress-pdf" ? "PDF" : "Unknown")}</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{tool.slug === "compress-pdf" ? "Document size" : "Megapixels"}</p>
                              <p className="mt-1 font-semibold text-foreground">{tool.slug === "compress-pdf" ? formatBytes(files[0].size) : imageWidth && imageHeight ? `${((imageWidth * imageHeight) / 1_000_000).toFixed(2)} MP` : "Loading..."}</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">File size</p>
                              <p className="mt-1 font-semibold text-foreground">{formatBytes(files[0].size)}</p>
                            </div>
                          </div>

                          {tool.slug === "image-upscale" && upscalePreviewStats && (
                            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">Estimated output</p>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Output resolution</p>
                                  <p className="mt-1 font-semibold text-foreground">{upscalePreviewStats.outputWidth} × {upscalePreviewStats.outputHeight}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Estimated megapixels</p>
                                  <p className="mt-1 font-semibold text-foreground">{upscalePreviewStats.outputMegapixels.toFixed(2)} MP</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Approx. output size</p>
                                  <p className="mt-1 font-semibold text-foreground">{formatBytes(upscalePreviewStats.approximateOutputSize)}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Estimated time</p>
                                  <p className="mt-1 font-semibold text-foreground">~{upscalePreviewStats.estimatedProcessingTimeSeconds}s</p>
                                </div>
                              </div>
                              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                AI upscaling improves resolution and perceived quality, but it cannot recreate details that do not exist in the original image.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {tool.slug === "image-upscale" && upscalePreviewStats && (
                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                          <div className="rounded-3xl border border-border/70 bg-card/80 p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <Badge variant="outline" className="rounded-full border-border/70">Original</Badge>
                              <p className="text-sm font-semibold text-foreground">Source image metrics</p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Resolution</span>
                                <span className="font-medium text-foreground">{upscalePreviewStats.originalWidth} × {upscalePreviewStats.originalHeight}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Megapixels</span>
                                <span className="font-medium text-foreground">{upscalePreviewStats.originalMegapixels.toFixed(2)} MP</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">File size</span>
                                <span className="font-medium text-foreground">{formatBytes(files[0].size)}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Format</span>
                                <span className="font-medium text-foreground">{imageFormat || "Unknown"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <Badge variant="secondary" className="rounded-full border-primary/20 bg-primary/10 text-primary">Upscaled</Badge>
                              <p className="text-sm font-semibold text-foreground">Estimated output metrics</p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Resolution</span>
                                <span className="font-medium text-foreground">{upscalePreviewStats.outputWidth} × {upscalePreviewStats.outputHeight}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Megapixels</span>
                                <span className="font-medium text-foreground">{upscalePreviewStats.outputMegapixels.toFixed(2)} MP</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Approx. output size</span>
                                <span className="font-medium text-foreground">{formatBytes(upscalePreviewStats.approximateOutputSize)}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2">
                                <span className="text-muted-foreground">Estimated time</span>
                                <span className="font-medium text-foreground">~{upscalePreviewStats.estimatedProcessingTimeSeconds}s</span>
                              </div>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                              Final file size can vary depending on image content, color depth, and compression settings.
                            </p>
                          </div>
                        </div>
                      )}

                      {(tool.slug === "image-compress" || tool.slug === "compress-pdf") && compressionEstimate && (
                        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <p className="text-sm font-semibold text-foreground">Original vs estimated output</p>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Original</p>
                              <p className="mt-1 font-semibold text-foreground">{formatBytes(compressionEstimate.originalSize)}</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Estimated output</p>
                              <p className="mt-1 font-semibold text-foreground">{formatBytes(compressionEstimate.estimatedSize)}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2 text-sm">
                            <span className="text-muted-foreground">Estimated savings</span>
                            <span className="font-semibold text-foreground">{compressionEstimate.savedPercent}% smaller</span>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            Final output size may shift slightly depending on file content, color depth, and the way the source is encoded.
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" onClick={() => {
                          setFiles([]);
                          setImageFormat(null);
                          if (imagePreviewUrl) {
                            URL.revokeObjectURL(imagePreviewUrl);
                          }
                          setImagePreviewUrl(null);
                          setImageWidth(null);
                          setImageHeight(null);
                          setStatus('idle');
                          setDownloadUrl(null);
                        }} className="rounded-xl h-12">
                          Reset
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-4 md:flex-row">
                    <Button variant="outline" onClick={() => setStatus("idle")} className="flex-1 rounded-xl h-12">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Add More
                    </Button>
                    <Button
                      onClick={handleProcess}
                      className="flex-[2] rounded-xl h-12 text-lg shadow-md shadow-primary/20"
                      disabled={!canProcess}
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                  {errorMessage && (
                    <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
                  )}
                </div>
                
                <div className="w-full md:w-80 h-fit shrink-0 rounded-2xl border border-border/70 bg-background/90 p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2 border-b border-border/70 pb-4 font-semibold text-foreground">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Tool options
                  </div>

                  <div className="space-y-5">
                    {(tool.slug === "merge-pdf" || tool.slug === "jpg-to-pdf") && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <p className="text-sm font-medium text-foreground">Upload order</p>
                        <p className="mt-1 text-sm text-muted-foreground">Drag files into the order you want before processing.</p>
                        <div className="mt-4 rounded-xl border border-dashed border-border/70 bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                          {files.length} file{files.length === 1 ? "" : "s"} selected
                        </div>
                      </div>
                    )}

                    {tool.slug === "split-pdf" && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <label className="mb-2 block text-sm font-medium text-foreground">Page ranges</label>
                        <input
                          value={pageRange}
                          onChange={(e) => { setPageRange(e.target.value); setPageRangeError(null); }}
                          placeholder="e.g. 1-3,5,7-9"
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          aria-label="Page ranges"
                        />
                        {pageRangeError ? (
                          <p className="mt-2 text-sm text-destructive">{pageRangeError}</p>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground">Enter pages or ranges to keep in the split output.</p>
                        )}
                      </div>
                    )}

                    {(tool.slug === "protect-pdf" || tool.slug === "unlock-pdf") && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={tool.slug === "protect-pdf" ? "Enter a password to protect the PDF" : "Enter the current password"}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          aria-label="PDF password"
                        />
                      </div>
                    )}

                    {tool.slug === "watermark-pdf" && (
                      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Watermark text</label>
                          <input
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            placeholder="Enter watermark text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            aria-label="Watermark text"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Logo</label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => setWatermarkLogo(e.target.files?.[0] || null)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Position</label>
                          <select
                            value={watermarkPosition}
                            onChange={(e) => setWatermarkPosition(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          >
                            <option value="top-left">Top left</option>
                            <option value="top-right">Top right</option>
                            <option value="bottom-left">Bottom left</option>
                            <option value="bottom-right">Bottom right</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {tool.slug === "add-page-numbers" && (
                      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Starting number</label>
                          <input
                            type="number"
                            min="1"
                            value={pageNumberStart}
                            onChange={(e) => setPageNumberStart(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            aria-label="Starting page number"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Position</label>
                          <select
                            value={pageNumberPosition}
                            onChange={(e) => setPageNumberPosition(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          >
                            <option value="top-left">Top left</option>
                            <option value="top-right">Top right</option>
                            <option value="bottom-left">Bottom left</option>
                            <option value="bottom-right">Bottom right</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {tool.slug === "image-converter" && (
                      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Output format</label>
                          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                            {SUPPORTED_OUTPUT.map((fmt) => (
                              <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        {outputFormat === "svg" && (
                          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                            <p className="text-sm font-medium text-foreground">SVG export mode</p>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => setSvgMode("embed")}
                                className={`rounded-xl border px-3 py-2 text-left text-sm transition-all ${svgMode === "embed" ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                              >
                                <span className="block font-semibold text-foreground">Embed image</span>
                                <span className="mt-1 block text-xs text-muted-foreground">Default and recommended. Works for photos and preserves the raster image inside SVG.</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSvgMode("trace")}
                                className={`rounded-xl border px-3 py-2 text-left text-sm transition-all ${svgMode === "trace" ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                              >
                                <span className="block font-semibold text-foreground">Trace to vector paths</span>
                                <span className="mt-1 block text-xs text-muted-foreground">Best for simple logos or line art. Photos may look poor, which is expected.</span>
                              </button>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">Choose the output file format before conversion.</p>
                      </div>
                    )}

                    {(tool.slug === "image-resize" || tool.slug === "image-upscale") && (
                      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Width</label>
                          <input
                            value={tool.slug === "image-upscale" ? upscaleWidth : resizeWidth}
                            onChange={(e) => tool.slug === "image-upscale" ? setUpscaleWidth(e.target.value) : setResizeWidth(e.target.value)}
                            placeholder={tool.slug === "image-upscale" ? "Optional width" : "Width in pixels"}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            aria-label="Image width"
                            type="number"
                            min={1}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">Height</label>
                          <input
                            value={tool.slug === "image-upscale" ? upscaleHeight : resizeHeight}
                            onChange={(e) => tool.slug === "image-upscale" ? setUpscaleHeight(e.target.value) : setResizeHeight(e.target.value)}
                            placeholder={tool.slug === "image-upscale" ? "Optional height" : "Height in pixels"}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            aria-label="Image height"
                            type="number"
                            min={1}
                          />
                        </div>
                        {tool.slug === "image-upscale" && (
                          <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Scale factor</label>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {[2, 4, 8].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setUpscaleFactor(value)}
                                  className={`rounded-2xl border px-3 py-3 text-left transition-all ${upscaleFactor === value ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-foreground">{value}×</span>
                                    {value === 4 && (
                                      <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">4× is recommended for a balanced quality boost.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {(tool.slug === "image-compress" || tool.slug === "compress-pdf") && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <label className="mb-2 block text-sm font-medium text-foreground">Compression preset</label>
                        <div className="grid gap-2">
                          {compressionPresets.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setCompressQuality(preset.quality)}
                              className={`rounded-2xl border px-3 py-3 text-left transition-all ${compressQuality === preset.quality ? "border-primary bg-primary/10 shadow-sm" : "border-border/70 bg-background/70 hover:border-primary/40"}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-foreground">{preset.label}</p>
                                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                                </div>
                                {preset.id === "balanced" && (
                                  <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                    Preferred
                                  </Badge>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(tool.slug === "organize-pdf" || tool.slug === "delete-pages" || tool.slug === "extract-pages") && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <p className="text-sm font-medium text-foreground">Selection summary</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedPageCount > 0
                            ? `${selectedPageCount} page${selectedPageCount === 1 ? "" : "s"} selected`
                            : "Select pages in the preview grid to enable page actions."}
                        </p>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2">
                            <span>Pages loaded</span>
                            <span className="font-medium text-foreground">{pdfPages.length}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2">
                            <span>Zoom level</span>
                            <span className="font-medium text-foreground">{thumbnailZoom}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {tool.slug === "ocr-image-to-text" && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <p className="text-sm font-medium text-foreground">OCR output</p>
                        <p className="mt-1 text-sm text-muted-foreground">Text extraction starts after you process the uploaded file.</p>
                      </div>
                    )}

                    {![
                      "merge-pdf",
                      "jpg-to-pdf",
                      "split-pdf",
                      "protect-pdf",
                      "unlock-pdf",
                      "watermark-pdf",
                      "add-page-numbers",
                      "image-converter",
                      "image-resize",
                      "image-compress",
                      "image-upscale",
                      "organize-pdf",
                      "delete-pages",
                      "extract-pages",
                      "ocr-image-to-text",
                    ].includes(tool.slug) && (
                      <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                        <p className="text-sm font-medium text-foreground">Ready to process</p>
                        <p className="mt-1 text-sm text-muted-foreground">Upload your file and review the built-in processing settings before downloading the result.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="py-20 animate-in fade-in duration-500 max-w-2xl mx-auto">
                <div className="rounded-3xl border border-border/70 bg-background/90 p-8 shadow-sm">
                  <div className="flex items-center justify-center mb-8">
                    <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                      <Icon name={tool.icon} className="w-10 h-10 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center">Processing your file...</h3>
                  <p className="text-center text-muted-foreground mb-6">{progressStage}</p>
                  <Progress value={progress} className="h-3 mb-4" />
                  <p className="text-center text-sm font-medium text-muted-foreground">{progress}% complete</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      tool.slug === "compress-pdf" ? "Analyzing document" : "Preparing source",
                      tool.slug === "compress-pdf" ? "Reducing file size" : "Applying compression",
                      "Finalizing download",
                    ].map((step, index) => {
                      const isActive = progress < 35 ? index === 0 : progress < 75 ? index === 1 : index === 2;
                      const isComplete = index < (progress < 35 ? 0 : progress < 75 ? 1 : 2);
                      return (
                        <div key={step} className={`rounded-2xl border px-3 py-3 text-sm ${isComplete || isActive ? "border-primary/30 bg-primary/10 text-foreground" : "border-border/70 bg-background/70 text-muted-foreground"}`}>
                          <div className="font-semibold">{step}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {status === "success" && (() => {
              if (tool.slug === "ocr-image-to-text") {
                return (
                  <div className="py-12 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold mb-2">Extracted Text</h3>
                      <p className="text-sm text-muted-foreground">Editable OCR output. Review and edit as needed.</p>
                      <textarea
                        value={ocrText}
                        onChange={(e) => setOcrText(e.target.value)}
                        className="w-full h-72 p-4 border border-border rounded-lg bg-background text-sm"
                      />
                      <div className="flex gap-3">
                        <Button onClick={async () => { await navigator.clipboard.writeText(ocrText || ""); }} className="flex-1">Copy Text</Button>
                        <Button onClick={() => {
                          const blob = new Blob([ocrText || ""], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = downloadFileName;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}>Download TXT</Button>
                        <Button onClick={() => {
                          const blob = new Blob([ocrText || ""], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = downloadFileName.replace(/\.txt$/, '.docx');
                          a.click();
                          URL.revokeObjectURL(url);
                        }}>Download DOCX</Button>
                        <Button variant="outline" onClick={() => { setOcrText(""); setFiles([]); setStatus('idle'); setDownloadUrl(null); }}>Clear</Button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tool.slug === "image-converter" && files.length > 1) {
                return (
                  <div className="py-12 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                    <div className="rounded-3xl border border-border/70 bg-background/90 p-8 shadow-sm">
                      <div className="flex items-center justify-center mb-6">
                        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                          <Download className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-center">Batch conversion complete</h3>
                      <p className="text-center text-muted-foreground mb-8">Your images were converted and are ready to download.</p>
                      <div className="mb-8 rounded-2xl border border-border/70 bg-card/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-foreground">Download everything</span>
                          <Button size="sm" className="rounded-full" asChild disabled={!downloadUrl}>
                            <a href={downloadUrl ?? "#"} download={downloadFileName}>Download All (.zip)</a>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {imageBatchItems.filter((item) => item.status === "done" && item.blob && item.outputName).map((item, index) => (
                          <div key={`${item.file.name}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/80 p-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground" title={item.file.name}>{item.file.name}</p>
                              <p className="text-xs text-muted-foreground">{item.outputName}</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full" onClick={() => item.blob && item.outputName && triggerFileDownload(item.blob, item.outputName)}>
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" onClick={() => { setStatus("idle"); setFiles([]); setDownloadUrl(null); setImageBatchItems([]); }} className="mt-6 text-muted-foreground">
                        Start Over
                      </Button>
                    </div>
                  </div>
                );
              }

              if (tool.slug === "image-compress" || tool.slug === "compress-pdf") {
                return (
                  <div className="py-12 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                    <div className="rounded-3xl border border-border/70 bg-background/90 p-8 shadow-sm">
                      <div className="flex items-center justify-center mb-6">
                        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                          <Download className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-center">Compression complete</h3>
                      <p className="text-center text-muted-foreground mb-8">Your file is ready to download with the estimated savings applied.</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Original size</p>
                          <p className="mt-2 text-xl font-semibold text-foreground">{formatBytes(files[0]?.size || 0)}</p>
                        </div>
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Compressed size</p>
                          <p className="mt-2 text-xl font-semibold text-foreground">{formatBytes(downloadSizeBytes || files[0]?.size || 0)}</p>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>Estimated savings</span>
                            <span className="font-semibold text-foreground">{compressionEstimate?.savedPercent ?? 0}%</span>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>Processing time</span>
                            <span className="font-semibold text-foreground">{processingTimeMs ? `${Math.max(1, Math.round(processingTimeMs / 1000))}s` : "Instant"}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="mt-8 w-full rounded-2xl h-14 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform"
                        asChild
                        disabled={!downloadUrl}
                      >
                        <a href={downloadUrl ?? "#"} download={downloadFileName}>
                          Download Compressed File
                        </a>
                      </Button>
                      <Button variant="ghost" onClick={() => { setStatus("idle"); setFiles([]); setDownloadUrl(null); setDownloadSizeBytes(null); setProcessingTimeMs(null); }} className="mt-4 text-muted-foreground">
                        Start Over
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="py-12 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                  <div className="py-12 text-center">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Download className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">Task Complete!</h3>
                    <p className="text-lg text-muted-foreground mb-10">Your files have been processed successfully and are ready to download.</p>

                    <Button
                      size="lg"
                      className="w-full rounded-2xl h-16 text-lg mb-6 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform"
                      asChild
                      disabled={!downloadUrl}
                    >
                      <a href={downloadUrl ?? "#"} download={downloadFileName}>
                        Download Processed File
                      </a>
                    </Button>

                    <Button variant="ghost" onClick={() => { setStatus("idle"); setFiles([]); setDownloadUrl(null); }} className="text-muted-foreground">
                      Start Over
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* How it works */}
      <section className="border-t border-border/70 bg-card/60 py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">How it works</h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">Three simple steps to get from upload to finished file.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {landingSteps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">Step {index + 1}</h3>
                <p className="leading-relaxed text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Feature highlights</h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">Built to be fast, clean, and comfortable in both light and dark mode.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <Card key={highlight} className="border-border/70 bg-card/90 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{highlight}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">Optimized for a focused document workflow with clear states and simple actions.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqsToShow.length > 0 && (
        <FaqSection faqs={faqsToShow} title={`${tool.name} FAQ`} />
      )}

      {relatedTools.length > 0 && (
        <section className="border-t border-border/70 bg-background py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Related tools</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">Try another tool in the same workflow family.</p>
              </div>
              <Button variant="ghost" asChild className="w-fit text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/tools">Browse all tools</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.slug} tool={relatedTool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Post */}
      {blogPost && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 mb-6 border-none">
              Featured Guide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              {blogPost.excerpt}
            </p>
            <Button variant="secondary" size="lg" asChild className="rounded-full px-8 text-primary">
              <Link href={`/blog/${blogPost.slug}`}>Read the Full Guide</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
