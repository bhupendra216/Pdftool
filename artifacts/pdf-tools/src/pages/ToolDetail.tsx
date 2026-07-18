import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { PDFDocument } from "pdf-lib";
import { useGetTool, useGetBlogPost, useOcrImageToText } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/use-seo";
import { formatBytes } from "@/lib/utils";
import { UploadArea } from "@/components/shared/UploadArea";
import { FilePreviewList } from "@/components/shared/FilePreviewList";
import { FaqSection } from "@/components/shared/FaqSection";
import { Button } from "@/components/ui/button";
import OrganizeGrid from "@/components/organize/OrganizeGrid";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Settings2, Download, AlertCircle, Badge, MoveUp, MoveDown, RotateCcw, RotateCw, Trash2, GripVertical, Check, FileMinus, FilePlus } from "lucide-react";

export function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tool, isLoading, isError } = useGetTool(slug);
  const { data: blogPost } = useGetBlogPost(tool?.blogSlug || "", {
    query: { enabled: !!tool?.blogSlug, queryKey: ["getBlogPost", tool?.blogSlug] } as any,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "options" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("processed.pdf");
  const [pageRange, setPageRange] = useState("");
  const [pageRangeError, setPageRangeError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pdfPages, setPdfPages] = useState<Array<{ id: string; pageNumber: number; rotation: number; selected: boolean }>>([]);
  const [thumbnailZoom, setThumbnailZoom] = useState<number>(100);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageFormat, setImageFormat] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [resizeWidth, setResizeWidth] = useState<string>("");
  const [resizeHeight, setResizeHeight] = useState<string>("");
  const [compressQuality, setCompressQuality] = useState<number>(80);
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2);
  const [upscaleWidth, setUpscaleWidth] = useState<string>("");
  const [upscaleHeight, setUpscaleHeight] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ocrText, setOcrText] = useState<string>("");
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [watermarkPosition, setWatermarkPosition] = useState<string>("bottom-right");
  const [watermarkLogo, setWatermarkLogo] = useState<File | null>(null);
  const [pageNumberStart, setPageNumberStart] = useState<string>("1");
  const [pageNumberPosition, setPageNumberPosition] = useState<string>("bottom-right");
  const SUPPORTED_INPUT = ["png", "jpg", "jpeg", "webp", "bmp", "tiff", "gif"];
  const SUPPORTED_OUTPUT = ["png", "jpg", "jpeg", "webp", "bmp"];

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

  const allowsMultipleFiles = tool?.slug === "merge-pdf" || tool?.slug === "jpg-to-pdf";
  const requiredFileCount = tool?.slug === "merge-pdf" ? 2 : 1;

  const actionLabel = tool?.slug === "merge-pdf"
    ? "Merge PDF"
    : tool?.slug === "split-pdf"
    ? "Split PDF"
    : tool?.slug === "compress-pdf"
    ? "Compress PDF"
    : tool?.slug === "rotate-pdf"
    ? "Rotate PDF"
    : tool?.slug === "unlock-pdf"
    ? "Unlock PDF"
    : tool?.slug === "protect-pdf"
    ? "Protect PDF"
    : tool?.slug === "watermark-pdf"
    ? "Watermark PDF"
    : tool?.slug === "add-page-numbers"
    ? "Add Page Numbers"
    : tool?.slug === "image-converter"
    ? "Convert Image"
    : tool?.slug === "pdf-to-word"
    ? "Convert to Word"
    : tool?.slug === "word-to-pdf"
    ? "Convert to PDF"
    : tool?.slug === "jpg-to-pdf"
    ? "Convert to PDF"
    : tool?.slug === "pdf-to-jpg"
    ? "Convert to JPG"
    : tool?.slug === "image-resize"
    ? "Resize Image"
    : tool?.slug === "image-compress"
    ? "Compress Image"
    : tool?.slug === "image-upscale"
    ? "Upscale Image"
    : tool?.slug === "organize-pdf"
    ? "Save Organized PDF"
    : tool?.slug === "delete-pages"
    ? "Delete Pages"
    : tool?.slug === "extract-pages"
    ? "Extract Pages"
    : "Process PDF";

  const buttonLabel = status === "options" ? actionLabel : "Process";
  const selectedPageCount = pdfPages.filter((page) => page.selected).length;
  const uploadHint = tool?.slug === "image-converter"
    ? "Upload a single image file to convert."
    : tool?.slug === "pdf-to-word"
    ? "Upload a PDF to convert it into a Word document."
    : tool?.slug === "word-to-pdf"
    ? "Upload a Word document to convert it into a PDF."
    : tool?.slug === "jpg-to-pdf"
    ? "Upload one or more image files to convert them into a PDF."
    : tool?.slug === "pdf-to-jpg"
    ? "Upload a PDF to convert its pages into JPG images."
    : tool?.slug === "image-resize"
    ? "Upload an image to resize its dimensions while preserving quality."
    : tool?.slug === "image-compress"
    ? "Upload an image to reduce file size while keeping it sharp."
    : tool?.slug === "image-upscale"
    ? "Upload an image to increase resolution for larger displays."
    : tool?.slug === "organize-pdf"
    ? "Upload a PDF to reorder, rotate, and remove pages before saving."
    : tool?.slug === "delete-pages"
    ? "Upload a PDF and select pages you want to remove."
    : tool?.slug === "extract-pages"
    ? "Upload a PDF and choose pages to extract into a new file."
    : tool?.slug === "unlock-pdf"
    ? "Upload a password-protected PDF and enter its current password."
    : tool?.slug === "protect-pdf"
    ? "Upload a PDF and enter a password to secure it."
    : allowsMultipleFiles
    ? `Upload ${requiredFileCount}+ PDF files to ${actionLabel.toLowerCase()}.`
    : `Upload a single PDF file to ${actionLabel.toLowerCase()}.`;

  const ocrMutation = useOcrImageToText();

  // Reset state when slug changes
  useEffect(() => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
    setDownloadFileName("processed.pdf");
    setPdfPages([]);
    setDraggedPageIndex(null);
    setTotalPages(null);
    setPageRangeError(null);
    setErrorMessage(null);
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

    const response = await fetch("/api/merge-pdf", {
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

  const initializePdfPages = async (file: File) => {
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();

      setTotalPages(pageCount);
      setPdfPages(
        Array.from({ length: pageCount }, (_, index) => ({
          id: `${file.name}-${index + 1}`,
          pageNumber: index + 1,
          rotation: 0,
          selected: false,
        })),
      );
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

  const splitPdfOnServer = async (fileToSplit: File, range: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToSplit);
    formData.append("pageRange", range);

    const response = await fetch("/api/split-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Split failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const convertPdfToWordOnServer = async (fileToConvert: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

    const response = await fetch("/api/convert-pdf-to-word", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `PDF to Word conversion failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const convertWordToPdfOnServer = async (fileToConvert: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

    const response = await fetch("/api/convert-word-to-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Word to PDF conversion failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const convertJpgToPdfOnServer = async (filesToConvert: File[]): Promise<Blob> => {
    const formData = new FormData();
    filesToConvert.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/convert-jpg-to-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `JPG to PDF conversion failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const convertPdfToJpgOnServer = async (fileToConvert: File): Promise<{ blob: Blob; filename: string }> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);

    const response = await fetch("/api/convert-pdf-to-jpg", {
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
    const filename = filenameMatch ? filenameMatch[1] : fileToConvert.name.replace(/\.[^/.]+$/, "") + ".jpg";
    return { blob, filename };
  };

  const protectPdfOnServer = async (fileToConvert: File, password: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("password", password);

    const response = await fetch("/api/protect-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Protect PDF failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const unlockPdfOnServer = async (fileToConvert: File, password: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("password", password);

    const response = await fetch("/api/unlock-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Unlock PDF failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const watermarkPdfOnServer = async (fileToWatermark: File, text: string, position: string, logoFile: File | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToWatermark);
    formData.append("text", text);
    formData.append("position", position);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await fetch("/api/watermark-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Watermark PDF failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const addPageNumbersOnServer = async (fileToNumber: File, startNumber: number, position: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToNumber);
    formData.append("startNumber", String(startNumber));
    formData.append("position", position);

    const response = await fetch("/api/add-page-numbers", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Add Page Numbers failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const convertImageOnServer = async (fileToConvert: File, outFormat: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToConvert);
    formData.append("outputFormat", outFormat);

    const response = await fetch("/api/convert-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Image conversion failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const resizeImageOnServer = async (fileToResize: File, width: number | null, height: number | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToResize);
    if (width != null) formData.append("width", String(width));
    if (height != null) formData.append("height", String(height));

    const response = await fetch("/api/image-resize", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Image resize failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const compressImageOnServer = async (fileToCompress: File, quality: number): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToCompress);
    formData.append("quality", String(quality));

    const response = await fetch("/api/image-compress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Image compression failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const upscaleImageOnServer = async (fileToUpscale: File, scale: number, width: number | null, height: number | null): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToUpscale);
    formData.append("scale", String(scale));
    if (width != null) formData.append("width", String(width));
    if (height != null) formData.append("height", String(height));

    const response = await fetch("/api/image-upscale", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Image upscale failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const organizePdfOnServer = async (fileToOrganize: File, pageOrder: number[], rotations: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToOrganize);
    formData.append("pageOrder", JSON.stringify(pageOrder));
    formData.append("rotations", JSON.stringify(rotations));

    const response = await fetch("/api/organize-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Organize PDF failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const deletePagesOnServer = async (fileToDeleteFrom: File, pagesToDelete: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToDeleteFrom);
    formData.append("pages", pagesToDelete.join(","));

    const response = await fetch("/api/delete-pages", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Delete Pages failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const extractPagesOnServer = async (fileToExtractFrom: File, pages: number[]): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToExtractFrom);
    formData.append("pages", pages.join(","));

    const response = await fetch("/api/extract-pages", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Extract Pages failed with HTTP ${response.status}`);
    }

    return await response.blob();
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
      page.rotation = (page.rotation + delta + 360) % 360;
      return next;
    });
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
    const baseName = rawFile.name.replace(/\.[^/.]+$/, "");
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

  useSEO({
    title: tool?.seoTitle || "Loading...",
    description: tool?.seoDescription || "PDF tool"
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-8">
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

  const handleFilesSelected = (newFiles: File[]) => {
    if (!allowsMultipleFiles) {
      const first = newFiles[0];
      setFiles([first]);
      setPdfPages([]);
      setTotalPages(null);
      setPageRangeError(null);
      if (tool?.slug === "image-converter") {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
        const url = URL.createObjectURL(first);
        setImagePreviewUrl(url);
        setImageFormat(first.type.replace(/^image\//, "") || null);
        setImageWidth(null);
        setImageHeight(null);
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
      } else if (tool?.slug === "split-pdf") {
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
      }
      return updated;
    });
  };

  const handleProcess = async () => {
    if (!canProcess || !tool) return;

    setErrorMessage(null);
    setStatus("processing");
    setProgress(0);
    setDownloadUrl(null);
    setPassword("");

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(95, prev + Math.floor(Math.random() * 10) + 5));
    }, 400);

    try {
      let blob: Blob;
      let outputName = "processed.pdf";

      if (tool.slug === "merge-pdf") {
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
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + `-split.pdf`;
      } else if (tool.slug === "image-converter") {
        blob = await convertImageOnServer(files[0], outputFormat);
        const baseName = files[0].name.replace(/\.[^/.]+$/, "");
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
        outputName = `${baseName}.${ext}`;
      } else if (tool.slug === "pdf-to-word") {
        blob = await convertPdfToWordOnServer(files[0]);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + ".docx";
      } else if (tool.slug === "word-to-pdf") {
        blob = await convertWordToPdfOnServer(files[0]);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + ".pdf";
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
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-resized" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "image-compress") {
        blob = await compressImageOnServer(files[0], compressQuality);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-compressed" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "image-upscale") {
        const width = upscaleWidth ? Number(upscaleWidth) : null;
        const height = upscaleHeight ? Number(upscaleHeight) : null;
        blob = await upscaleImageOnServer(files[0], upscaleFactor, width, height);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-upscaled" + files[0].name.match(/\.[^.]+$/)?.[0];
      } else if (tool.slug === "protect-pdf") {
        blob = await protectPdfOnServer(files[0], password);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-protected.pdf";
      } else if (tool.slug === "unlock-pdf") {
        blob = await unlockPdfOnServer(files[0], password);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-unlocked.pdf";
      } else if (tool.slug === "watermark-pdf") {
        blob = await watermarkPdfOnServer(files[0], watermarkText, watermarkPosition, watermarkLogo);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-watermarked.pdf";
      } else if (tool.slug === "add-page-numbers") {
        const startNumber = Number(pageNumberStart || 1);
        blob = await addPageNumbersOnServer(files[0], Number.isFinite(startNumber) ? startNumber : 1, pageNumberPosition);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-numbered.pdf";
      } else if (tool.slug === "organize-pdf") {
        const pageOrder = pdfPages.map((page) => page.pageNumber);
        const rotations = pdfPages.map((page) => page.rotation);
        blob = await organizePdfOnServer(files[0], pageOrder, rotations);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-organized.pdf";
      } else if (tool.slug === "delete-pages") {
        const pagesToDelete = pdfPages.filter((page) => page.selected).map((page) => page.pageNumber);
        blob = await deletePagesOnServer(files[0], pagesToDelete);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-deleted-pages.pdf";
      } else if (tool.slug === "extract-pages") {
        const pages = pdfPages.filter((page) => page.selected).map((page) => page.pageNumber);
        blob = await extractPagesOnServer(files[0], pages);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-extracted-pages.pdf";
      } else if (tool.slug === "ocr-image-to-text") {
        const form = new FormData();
        form.append("files", files[0]);
        const res = await ocrMutation.mutateAsync({ data: form });
        const text = res?.text || "";
        setOcrText(text);
        // create a small blob so users can download if needed
        const blobRes = new Blob([text], { type: "text/plain" });
        blob = blobRes;
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + "-ocr.txt";
      } else {
        const rawFile = files[0];
        outputName = rawFile.name.replace(/\.[^/.]+$/, "") + `-${tool.slug}.pdf`;
        blob = new Blob([await rawFile.arrayBuffer()], {
          type: rawFile.type || "application/pdf",
        });
      }

      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFileName(outputName);
      setStatus("success");
      setProgress(100);
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
        ) : (
          <div className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-10 transition-all">
            
            {(status === "idle" || status === "options") && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UploadArea
                  onFilesSelected={handleFilesSelected}
                  multiple={allowsMultipleFiles}
                  accept={
                    tool?.slug === "image-converter" ||
                    tool?.slug === "image-resize" ||
                    tool?.slug === "image-compress" ||
                    tool?.slug === "image-upscale"
                      ? "image/png,image/jpeg,image/webp,image/bmp,image/tiff,image/gif,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.gif"
                      : tool?.slug === "word-to-pdf"
                      ? "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
                      : tool?.slug === "pdf-to-word"
                      ? "application/pdf,.pdf"
                      : tool?.slug === "ocr-image-to-text"
                      ? "image/png,image/jpeg,application/pdf,.png,.jpg,.jpeg,.pdf"
                      : tool?.slug === "jpg-to-pdf"
                      ? "image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
                      : "application/pdf,.pdf"
                  }
                  maxSizeMB={
                    tool?.slug === "image-converter" ||
                    tool?.slug === "image-resize" ||
                    tool?.slug === "image-compress" ||
                    tool?.slug === "image-upscale"
                      ? 20
                      : 50
                  }
                  label={
                    tool?.slug === "image-converter" ||
                    tool?.slug === "image-resize" ||
                    tool?.slug === "image-compress" ||
                    tool?.slug === "image-upscale"
                      ? "image file"
                      : tool?.slug === "word-to-pdf"
                      ? "Word file"
                      : tool?.slug === "pdf-to-word"
                      ? "PDF file"
                      : tool?.slug === "ocr-image-to-text"
                      ? "Image or PDF"
                      : tool?.slug === "jpg-to-pdf"
                      ? "image file"
                      : "PDF file"
                  }
                  description={
                    tool?.slug === "image-converter" ||
                    tool?.slug === "image-resize" ||
                    tool?.slug === "image-compress" ||
                    tool?.slug === "image-upscale"
                      ? "or drop an image here."
                      : tool?.slug === "word-to-pdf"
                      ? "or drop a Word document here."
                      : tool?.slug === "pdf-to-word"
                      ? "or drop a PDF here."
                      : tool?.slug === "ocr-image-to-text"
                      ? "or drop an image or scanned PDF here."
                      : tool?.slug === "jpg-to-pdf"
                      ? "or drop one or more images here."
                      : "or drop PDF here."
                  }
                        />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  {uploadHint}
                </p>
                <div className="flex-1">
                  <FilePreviewList 
                    files={files} 
                    onRemove={handleRemoveFile} 
                    status="idle" 
                  />
                  {tool.slug === "split-pdf" && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Page ranges</label>
                      <input
                        value={pageRange}
                        onChange={(e) => { setPageRange(e.target.value); setPageRangeError(null); }}
                        placeholder="e.g. 1-3,5,7-9"
                        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                        aria-label="Page ranges"
                      />
                      {pageRangeError && (
                        <p className="text-sm text-destructive mt-2">{pageRangeError}</p>
                      )}
                      {totalPages && (
                        <p className="text-xs text-muted-foreground mt-2">PDF has {totalPages} page{totalPages>1? 's':''}.</p>
                      )}
                    </div>
                  )}

                  {(tool.slug === "organize-pdf" || tool.slug === "delete-pages" || tool.slug === "extract-pages") && pdfPages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Page preview</h3>
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
                        onDelete={(indexes) => {
                          setPdfPages((pages) => pages.filter((_, i) => !indexes.includes(i)));
                        }}
                        onExtract={(indexes) => {
                          // mark selected for extraction and delegate to existing extract flow
                          setPdfPages((pages) => pages.map((p, i) => ({ ...p, selected: indexes.includes(i) || p.selected })));
                        }}
                        zoom={thumbnailZoom}
                        setZoom={setThumbnailZoom}
                      />
                    </div>
                  )}

                  {(tool.slug === "protect-pdf" || tool.slug === "unlock-pdf") && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={tool.slug === "protect-pdf" ? "Enter a password to protect the PDF" : "Enter the current password"}
                        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                        aria-label="PDF password"
                      />
                    </div>
                  )}

                  {tool.slug === "watermark-pdf" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Upload company logo (PNG recommended)</label>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => setWatermarkLogo(e.target.files?.[0] || null)}
                          className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Watermark text</label>
                        <input
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                          className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                          aria-label="Watermark text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Position</label>
                        <select
                          value={watermarkPosition}
                          onChange={(e) => setWatermarkPosition(e.target.value)}
                          className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
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
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Starting number</label>
                        <input
                          type="number"
                          min="1"
                          value={pageNumberStart}
                          onChange={(e) => setPageNumberStart(e.target.value)}
                          className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                          aria-label="Starting page number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Position</label>
                        <select
                          value={pageNumberPosition}
                          onChange={(e) => setPageNumberPosition(e.target.value)}
                          className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                        >
                          <option value="top-left">Top left</option>
                          <option value="top-right">Top right</option>
                          <option value="bottom-left">Bottom left</option>
                          <option value="bottom-right">Bottom right</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {tool.slug === "image-converter" && files[0] && (
                    <div className="mt-6">
                      <div className="flex gap-6 items-start">
                        <div className="w-40 h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
                          {imagePreviewUrl ? (
                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                            <img src={imagePreviewUrl} alt="preview" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-sm text-muted-foreground">Preview unavailable</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">{files[0].name}</p>
                          <p className="text-sm text-muted-foreground">Format: {imageFormat || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Dimensions: {imageWidth ? `${imageWidth} × ${imageHeight}` : 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Size: {formatBytes(files[0].size)}</p>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Output format</label>
                            <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm">
                              {SUPPORTED_OUTPUT.map(fmt => (
                                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>

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
                      </div>
                    </div>
                  )}

                  {(tool.slug === "image-resize" || tool.slug === "image-compress" || tool.slug === "image-upscale") && files[0] && (
                    <div className="mt-6 grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Width</label>
                          <input
                            value={tool.slug === "image-upscale" ? upscaleWidth : resizeWidth}
                            onChange={(e) => tool.slug === "image-upscale" ? setUpscaleWidth(e.target.value) : setResizeWidth(e.target.value)}
                            placeholder={tool.slug === "image-upscale" ? "Optional width" : "Width in pixels"}
                            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                            aria-label="Image width"
                            type="number"
                            min={1}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Height</label>
                          <input
                            value={tool.slug === "image-upscale" ? upscaleHeight : resizeHeight}
                            onChange={(e) => tool.slug === "image-upscale" ? setUpscaleHeight(e.target.value) : setResizeHeight(e.target.value)}
                            placeholder={tool.slug === "image-upscale" ? "Optional height" : "Height in pixels"}
                            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                            aria-label="Image height"
                            type="number"
                            min={1}
                          />
                        </div>
                      </div>

                      {tool.slug === "image-compress" && (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Quality</label>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={compressQuality}
                            onChange={(e) => setCompressQuality(Number(e.target.value))}
                            className="w-full"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Quality: {compressQuality}%
                            <span className="mx-2">·</span>
                            Estimated size: {formatBytes(estimateCompressedSize(files[0].size, compressQuality))}
                          </p>
                        </div>
                      )}

                      {tool.slug === "image-upscale" && (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Scale Factor</label>
                          <input
                            type="number"
                            min={1}
                            max={8}
                            value={upscaleFactor}
                            onChange={(e) => setUpscaleFactor(Number(e.target.value))}
                            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                            step={1}
                          />
                          <p className="text-sm text-muted-foreground mt-2">Upscale by {upscaleFactor}× unless specific width or height is set.</p>
                        </div>
                      )}
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
                
                <div className="w-full md:w-80 bg-background border rounded-2xl p-6 h-fit shrink-0">
                  <div className="flex items-center gap-2 mb-6 font-semibold pb-4 border-b">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Options
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    In a real implementation, tool-specific options would appear here (e.g., compression level, page ranges to extract).
                  </p>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <div className="h-10 bg-secondary rounded-lg w-full"></div>
                    <div className="h-10 bg-secondary rounded-lg w-full"></div>
                    <div className="h-10 bg-secondary rounded-lg w-2/3"></div>
                  </div>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="py-20 text-center animate-in fade-in duration-500 max-w-md mx-auto">
                <Icon name={tool.icon} className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
                <h3 className="text-2xl font-bold mb-6">Processing your files...</h3>
                <Progress value={progress} className="h-3 mb-4" />
                <p className="text-muted-foreground font-medium">{progress}% Complete</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-12 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                {tool.slug === "ocr-image-to-text" ? (
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
                ) : (
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
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* How it works */}
      {tool.steps && tool.steps.length > 0 && (
        <section className="py-20 bg-card border-t border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How to {tool.name.toLowerCase()}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {tool.steps.map((step, index) => (
                <div key={index} className="relative pt-6">
                  <div className="absolute top-0 left-0 w-10 h-10 bg-secondary text-primary font-bold rounded-xl flex items-center justify-center -mt-5 shadow-sm border border-background">
                    {index + 1}
                  </div>
                  <Card className="h-full border-none shadow-none bg-background">
                    <CardContent className="p-6 pt-8">
                      <p className="text-muted-foreground leading-relaxed">{step}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {tool.faqs && tool.faqs.length > 0 && (
        <FaqSection faqs={tool.faqs} title={`${tool.name} FAQ`} />
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
