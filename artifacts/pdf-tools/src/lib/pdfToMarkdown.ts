import * as pdfjsLib from "pdfjs-dist";
import type { PDFPageProxy } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import JSZip from "jszip";
import { MAX_MARKDOWN_PDF_PAGES, MAX_PDF_BYTES, MAX_PDF_SIZE_LABEL } from "./pdfToMarkdownConfig";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type Point = { x: number; y: number };
type Matrix = [number, number, number, number, number, number];
type TextRun = {
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  lineHeight: number;
  bold: boolean;
  link?: string;
};
type TextLine = {
  text: string;
  y: number;
  x: number;
  fontSize: number;
  lineHeight: number;
  bold: boolean;
  pageHeight: number;
};
type ImageReference = {
  fileName: string;
  blob: Blob;
  y: number;
};
type PageText = {
  lines: TextLine[];
  height: number;
  width: number;
};
type ImagePlacement = {
  id: string;
  objectId: string;
  y: number;
  bounds: [Point, Point, Point, Point];
};
type ImageObject = {
  width?: number;
  height?: number;
  kind?: number;
  data?: Uint8Array | Uint8ClampedArray | ImageData;
  bitmap?: ImageBitmap;
  image?: ImageBitmap | ImageData;
  smask?: ImageObject;
  isMask?: boolean;
};
type ObjectStore = {
  get(id: string, callback?: (value: unknown) => void): unknown;
  has?(id: string): boolean;
  _objs?: Record<string, { data?: unknown }>;
};
type PdfPage = PDFPageProxy;
type PdfTextItem = {
  str: string;
  transform: number[];
  width?: number;
  height?: number;
  fontName?: string;
};

export type MarkdownImage = { fileName: string; blob: Blob };
export type MarkdownPdfResult = {
  pages: string[];
  images: MarkdownImage[];
  skippedImageCount: number;
  textFound: boolean;
};

const identityMatrix: Matrix = [1, 0, 0, 1, 0, 0];
const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));

function multiplyMatrices(left: Matrix, right: number[]): Matrix {
  const [a, b, c, d, e, f] = left;
  const [g, h, i, j, k, l] = right;
  return [
    a * g + c * h,
    b * g + d * h,
    a * i + c * j,
    b * i + d * j,
    a * k + c * l + e,
    b * k + d * l + f,
  ];
}

function matrixPoint(matrix: Matrix, x: number, y: number): Point {
  return {
    x: matrix[0] * x + matrix[2] * y + matrix[4],
    y: matrix[1] * x + matrix[3] * y + matrix[5],
  };
}

function normalizeDigits(text: string) {
  return text.replace(/\d+/g, "#").replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeLineStart(text: string) {
  const bulletNormalized = text.replace(/^[\s]*[•◦▪–]\s*/, "- ");
  if (/^(?:[-*+]\s|\d+[.)]\s)/.test(bulletNormalized)) return bulletNormalized;
  if (/^#/.test(bulletNormalized)) return `\\${bulletNormalized}`;
  return bulletNormalized;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function isTextItem(item: unknown): item is PdfTextItem {
  return typeof item === "object" && item !== null && "str" in item && "transform" in item;
}

function getTextRuns(page: PdfPage, viewport: ReturnType<PdfPage["getViewport"]>, annotations: any[]): TextRun[] {
  const items = (page as any).__textItems as unknown[];
  const styles = (page as any).__textStyles as Record<string, { fontFamily?: string; ascent?: number; descent?: number }>;
  const links = annotations.filter((annotation) => annotation?.subtype === "Link" && typeof annotation.url === "string" && Array.isArray(annotation.rect));

  return items.filter(isTextItem).map((item) => {
    const [a, b, c, d, x, y] = item.transform;
    const fontSize = Math.max(1, Math.hypot(a || 0, b || 0));
    const width = Math.max(0, item.width || 0);
    const height = Math.max(fontSize, Math.abs(item.height || fontSize));
    const rect = [x || 0, y || 0, (x || 0) + width, (y || 0) + height];
    const annotation = links.find((link) => {
      const annotationRect = link.rect as number[];
      return rect[0]! < annotationRect[2]! && rect[2]! > annotationRect[0]! &&
        rect[1]! < annotationRect[3]! && rect[3]! > annotationRect[1]!;
    });
    const style = item.fontName ? styles[item.fontName] : undefined;
    const fontName = `${item.fontName || ""} ${style?.fontFamily || ""}`;
    return {
      text: item.str.replace(/\s+/g, " ").trim(),
      x: x || 0,
      y: y || 0,
      width,
      fontSize,
      lineHeight: Math.max(fontSize, height),
      bold: /bold|heavy|black|semibold/i.test(fontName),
      ...(annotation ? { link: annotation.url as string } : {}),
    };
  }).filter((run) => run.text.length > 0 && Number.isFinite(run.x) && Number.isFinite(run.y));
}

function groupTextRuns(runs: TextRun[], pageHeight: number): TextLine[] {
  const sortedRuns = [...runs].sort((a, b) => b.y - a.y || a.x - b.x);
  const groups: TextRun[][] = [];
  for (const run of sortedRuns) {
    const line = groups.find((group) =>
      Math.abs(group[0]!.y - run.y) <= Math.max(1, Math.min(group[0]!.fontSize, run.fontSize) * 0.3),
    );
    if (line) line.push(run);
    else groups.push([run]);
  }

  return groups.map((group) => {
    const ordered = group.sort((a, b) => a.x - b.x);
    let text = "";
    let previous: TextRun | undefined;
    for (const run of ordered) {
      const gap = previous ? run.x - (previous.x + previous.width) : 0;
      const separator = previous && (gap > Math.min(previous.fontSize, run.fontSize) * 0.15) ? " " : "";
      const part = run.link ? `[${run.text}](${run.link})` : run.text;
      text += `${separator}${part}`;
      previous = run;
    }
    const first = ordered[0]!;
    return {
      text: text.trim(),
      y: group.reduce((sum, item) => sum + item.y, 0) / group.length,
      x: first.x,
      fontSize: median(group.map((item) => item.fontSize)),
      lineHeight: Math.max(...group.map((item) => item.lineHeight)),
      bold: group.some((item) => item.bold),
      pageHeight,
    };
  }).sort((a, b) => b.y - a.y);
}

function removeRepeatedFurniture(pages: PageText[]): TextLine[][] {
  if (pages.length < 3) return pages.map((page) => page.lines);
  const required = Math.max(3, Math.ceil(pages.length * 0.6));
  const counts = new Map<string, Set<number>>();
  pages.forEach((page, pageIndex) => page.lines.forEach((line) => {
    const relativeY = line.y / page.height;
    if (relativeY > 0.1 && relativeY < 0.9) return;
    const key = normalizeDigits(line.text);
    if (!key) return;
    const pageSet = counts.get(key) || new Set<number>();
    pageSet.add(pageIndex);
    counts.set(key, pageSet);
  }));

  return pages.map((page) => page.lines.filter((line) => {
    const relativeY = line.y / page.height;
    const edge = relativeY <= 0.1 || relativeY >= 0.9;
    if (!edge) return true;
    if (/^(?:\d+|page\s+\d+|\d+\s*\/\s*\d+)$/i.test(line.text.trim())) return false;
    return (counts.get(normalizeDigits(line.text))?.size || 0) < required;
  }));
}

function markdownForPage(lines: TextLine[], bodySize: number): string {
  const rendered: string[] = [];
  let previousLine: TextLine | undefined;
  for (const line of lines) {
    let text = line.text.trim();
    if (!text) continue;
    const sizeRatio = bodySize > 0 ? line.fontSize / bodySize : 1;
    const shortHeading = text.length <= 120 && !/[.]$/.test(text);
    let headingPrefix = "";
    if (shortHeading && text === text.toUpperCase() && (sizeRatio > 1 || line.bold)) headingPrefix = "## ";
    else if (shortHeading && sizeRatio >= 1.6) headingPrefix = "# ";
    else if (shortHeading && sizeRatio >= 1.3) headingPrefix = "## ";
    else if (shortHeading && sizeRatio >= 1.15) headingPrefix = "### ";

    text = normalizeLineStart(text);
    if (headingPrefix) text = `${headingPrefix}${text}`;
    else if (!/^(?:[-*+]\s|\d+[.)]\s|\\#)/.test(text)) {
      text = text.replace(/^(\d+)\.(?=\S)/, "$1\\.");
    }

    const previous = rendered[rendered.length - 1];
    if (previous && !/^(?:#|[-*+]\s|\d+[.)]\s|\\#)/.test(text)) {
      const gap = previousLine ? previousLine.y - line.y : 0;
      const height = previousLine?.lineHeight || line.lineHeight;
      if (previousLine && gap <= height * 1.5 && !/^(?:#|[-*+]\s|\d+[.)]\s)/.test(previous)) {
        const hyphenated = previous.match(/(\p{L})-\s*$/u);
        if (hyphenated && /^\p{Ll}/u.test(text)) {
          rendered[rendered.length - 1] = previous.replace(/\p{L}-\s*$/u, hyphenated[1]!) + text;
        } else {
          rendered[rendered.length - 1] = `${previous} ${text}`;
        }
        previousLine = line;
        continue;
      }
    }
    rendered.push(text);
    previousLine = line;
  }
  return rendered.join("\n\n");
}

export function sanitizeMarkdownBaseName(filename: string) {
  const withoutExtension = filename.replace(/\.pdf$/i, "");
  const sanitized = withoutExtension.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").trim();
  return sanitized || "document";
}

export function markdownPdfErrorMessage(error: unknown): string | null {
  const name = (error as { name?: string } | null)?.name;
  if (name === "PasswordException") {
    return "This PDF is password-protected. Remove the password with the Unlock PDF tool, then try again.";
  }
  if (name === "InvalidPDFException" || name === "MissingPDFException") {
    return "This file is damaged or is not a valid PDF.";
  }
  return null;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

async function hashBlob(blob: Blob) {
  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function awaitPdfObject(store: ObjectStore | undefined, id: string): Promise<unknown> {
  if (!store) return Promise.resolve(undefined);
  const cached = store._objs?.[id]?.data;
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: unknown) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(value);
    };
    const timeout = window.setTimeout(() => finish(undefined), 5000);
    try {
      const result = store.get(id, (value) => finish(value));
      if (result && typeof result === "object") finish(result);
    } catch {
      finish(undefined);
    }
  });
}

function objectStoreHas(store: ObjectStore | undefined, id: string) {
  return Boolean(store?.has?.(id) || store?._objs?.[id]);
}

async function resolveImageObject(page: PdfPage, id: string, pageNumber: number) {
  const localStore = page.objs as unknown as ObjectStore;
  const commonStore = page.commonObjs as unknown as ObjectStore;
  if (objectStoreHas(localStore, id)) {
    return { key: `page-${pageNumber}:${id}`, value: await awaitPdfObject(localStore, id) };
  }
  if (objectStoreHas(commonStore, id)) {
    return { key: `common:${id}`, value: await awaitPdfObject(commonStore, id) };
  }
  const localValue = await awaitPdfObject(localStore, id);
  if (localValue) return { key: `page-${pageNumber}:${id}`, value: localValue };
  const commonValue = await awaitPdfObject(commonStore, id);
  return {
    key: commonValue ? `common:${id}` : `page-${pageNumber}:${id}`,
    value: commonValue,
  };
}

function rgbaPixels(image: ImageObject): ImageData | null {
  const width = image.width || 0;
  const height = image.height || 0;
  if (width < 1 || height < 1) return null;
  const raw = image.data;
  if (raw instanceof ImageData) return raw;
  if (!raw) return null;

  const pixels = new Uint8ClampedArray(width * height * 4);
  if (image.kind === pdfjsLib.ImageKind.RGBA_32BPP && raw.length >= pixels.length) {
    pixels.set(raw.subarray(0, pixels.length));
  } else if (image.kind === pdfjsLib.ImageKind.RGB_24BPP && raw.length >= width * height * 3) {
    for (let source = 0, target = 0; target < pixels.length; source += 3, target += 4) {
      pixels[target] = raw[source]!;
      pixels[target + 1] = raw[source + 1]!;
      pixels[target + 2] = raw[source + 2]!;
      pixels[target + 3] = 255;
    }
  } else if (image.kind === pdfjsLib.ImageKind.GRAYSCALE_1BPP || image.isMask) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const set = (raw[y * Math.ceil(width / 8) + (x >> 3)]! & (0x80 >> (x & 7))) !== 0;
        const value = set ? 0 : 255;
        const target = (y * width + x) * 4;
        pixels[target] = value;
        pixels[target + 1] = value;
        pixels[target + 2] = value;
        pixels[target + 3] = 255;
      }
    }
  } else if (raw.length >= width * height * 4) {
    pixels.set(raw.subarray(0, pixels.length));
  } else {
    return null;
  }

  if (image.smask?.data && image.smask.width === width && image.smask.height === height) {
    const mask = rgbaPixels(image.smask);
    if (mask) {
      for (let pixel = 0; pixel < width * height; pixel += 1) {
        pixels[pixel * 4 + 3] = mask.data[pixel * 4]!;
      }
    }
  }
  return new ImageData(pixels, width, height);
}

async function imageToBlob(image: unknown): Promise<{ blob: Blob; width: number; height: number } | null> {
  if (!image || typeof image !== "object") return null;
  const candidate = image as ImageObject;
  if (candidate.isMask) return null;
  const bitmap = candidate.bitmap || (candidate.image instanceof ImageBitmap ? candidate.image : undefined);
  const width = candidate.width || bitmap?.width || (candidate.image instanceof ImageData ? candidate.image.width : 0);
  const height = candidate.height || bitmap?.height || (candidate.image instanceof ImageData ? candidate.image.height : 0);
  if (width < 16 || height < 16) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.width = 0;
    canvas.height = 0;
    return null;
  }
  try {
    if (bitmap) context.drawImage(bitmap, 0, 0);
    else if (candidate.image instanceof ImageData) context.putImageData(candidate.image, 0, 0);
    else {
      const pixels = rgbaPixels(candidate);
      if (!pixels) return null;
      context.putImageData(pixels, 0, 0);
    }
    const blob = await canvasToBlob(canvas);
    return blob ? { blob, width, height } : null;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

function getImagePlacements(page: PdfPage): ImagePlacement[] {
  const operatorList = (page as any).__operatorList as { fnArray: number[]; argsArray: unknown[][] };
  const placements: ImagePlacement[] = [];
  const stack: Matrix[] = [];
  let matrix: Matrix = [...identityMatrix];
  const jpegXObject = (pdfjsLib.OPS as unknown as Record<string, number>).paintJpegXObject;
  for (let index = 0; index < operatorList.fnArray.length; index += 1) {
    const fn = operatorList.fnArray[index];
    const args = operatorList.argsArray[index] || [];
    if (fn === pdfjsLib.OPS.save) {
      stack.push([...matrix]);
    } else if (fn === pdfjsLib.OPS.restore) {
      matrix = stack.pop() || [...identityMatrix];
    } else if (fn === pdfjsLib.OPS.transform && Array.isArray(args[0])) {
      matrix = multiplyMatrices(matrix, args[0] as number[]);
    } else if (fn === pdfjsLib.OPS.paintFormXObjectBegin) {
      stack.push([...matrix]);
      if (Array.isArray(args[0])) matrix = multiplyMatrices(matrix, args[0] as number[]);
    } else if (fn === pdfjsLib.OPS.paintFormXObjectEnd) {
      matrix = stack.pop() || [...identityMatrix];
    } else if (
      fn === pdfjsLib.OPS.paintImageXObject ||
      fn === pdfjsLib.OPS.paintInlineImageXObject ||
      fn === pdfjsLib.OPS.paintImageMaskXObject ||
      fn === jpegXObject ||
      fn === pdfjsLib.OPS.paintImageMaskXObjectGroup ||
      fn === pdfjsLib.OPS.paintInlineImageXObjectGroup
    ) {
      const rawId = typeof args[0] === "string" ? args[0] : `inline-${index}`;
      const origin = matrixPoint(matrix, 0, 0);
      placements.push({
        id: `${index}`,
        objectId: rawId,
        y: origin.y,
        bounds: [
          matrixPoint(matrix, 0, 0),
          matrixPoint(matrix, 1, 0),
          matrixPoint(matrix, 1, 1),
          matrixPoint(matrix, 0, 1),
        ],
      });
    }
  }
  return placements;
}

async function cropPlacement(
  page: PdfPage,
  placement: ImagePlacement,
  viewport: ReturnType<PdfPage["getViewport"]>,
  pageHasText: boolean,
  renderedPage: { canvas: HTMLCanvasElement } | null,
): Promise<{ blob: Blob; canvas: HTMLCanvasElement; width: number; height: number } | null> {
  const points = placement.bounds.map((point) => viewport.convertToViewportPoint(point.x, point.y));
  const xs = points.map(([x]) => x!);
  const ys = points.map(([, y]) => y!);
  const left = Math.max(0, Math.floor(Math.min(...xs) * 2));
  const top = Math.max(0, Math.floor(Math.min(...ys) * 2));
  const right = Math.min(Math.ceil(viewport.width * 2), Math.ceil(Math.max(...xs) * 2));
  const bottom = Math.min(Math.ceil(viewport.height * 2), Math.ceil(Math.max(...ys) * 2));
  const width = right - left;
  const height = bottom - top;
  const pageArea = viewport.width * viewport.height * 4;
  if (width < 16 || height < 16 || left >= right || top >= bottom) return null;
  const coversNearlyFullPage =
    width * height > pageArea * 0.9 &&
    left <= viewport.width * 2 * 0.05 &&
    top <= viewport.height * 2 * 0.05 &&
    right >= viewport.width * 2 * 0.95 &&
    bottom >= viewport.height * 2 * 0.95;
  if (width * height > pageArea * 0.9 && (pageHasText || !coversNearlyFullPage)) return null;

  let pageCanvas = renderedPage?.canvas;
  if (!pageCanvas) {
    pageCanvas = document.createElement("canvas");
    pageCanvas.width = Math.ceil(viewport.width * 2);
    pageCanvas.height = Math.ceil(viewport.height * 2);
    const context = pageCanvas.getContext("2d");
    if (!context) {
      pageCanvas.width = 0;
      pageCanvas.height = 0;
      return null;
    }
    const renderViewport = page.getViewport({ scale: 2 });
    await (page.render({ canvasContext: context, viewport: renderViewport } as any).promise as Promise<void>);
    renderedPage = { canvas: pageCanvas };
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.width = 0;
    canvas.height = 0;
    return null;
  }
  try {
    context.drawImage(pageCanvas, left, top, width, height, 0, 0, width, height);
    const blob = await canvasToBlob(canvas);
    return blob ? { blob, canvas: pageCanvas, width, height } : null;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

function getPagePositionY(viewport: ReturnType<PdfPage["getViewport"]>, y: number) {
  return viewport.height - y;
}

export function withPageMarkers(pages: string[], includePageMarkers: boolean) {
  return pages.map((page, index) => {
    if (!includePageMarkers) return page;
    return `<!-- Page ${index + 1} -->\n\n${page}`;
  }).join("\n\n");
}

export function markdownForDisplay(markdown: string, includeImageReferences: boolean) {
  if (includeImageReferences) return markdown;
  return markdown.split("\n")
    .filter((line) => !/^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

export function hasMarkdownText(pages: string[]) {
  return pages.some((page) => page.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim().length > 0);
}

export async function createMarkdownDownload(
  pages: string[],
  images: MarkdownImage[],
  baseName: string,
  includePageMarkers = false,
): Promise<{ blob: Blob; fileName: string }> {
  const markdown = withPageMarkers(pages, includePageMarkers);
  if (images.length === 0) {
    return {
      blob: new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
      fileName: `${baseName}.md`,
    };
  }
  const zip = new JSZip();
  zip.file(`${baseName}.md`, markdown);
  const imageFolder = zip.folder("images");
  images.forEach((image) => imageFolder?.file(image.fileName, image.blob));
  return {
    blob: await zip.generateAsync({ type: "blob" }),
    fileName: `${baseName}.zip`,
  };
}

export async function extractMarkdownFromPdf(
  file: File,
  options: {
    onPage?: (page: number, pageCount: number) => void;
    onTextStatus?: (textFound: boolean) => void;
    baseName?: string;
  } = {},
): Promise<MarkdownPdfResult> {
  if (file.size > MAX_PDF_BYTES) throw new Error(`This PDF is larger than the ${MAX_PDF_SIZE_LABEL} limit.`);
  const bytes = await file.arrayBuffer();
  const baseUrl = `${window.location.origin}/`;
  let pdf: pdfjsLib.PDFDocumentProxy | undefined;
  let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | undefined;
  try {
  loadingTask = pdfjsLib.getDocument({
      data: bytes,
      cMapUrl: `${baseUrl}cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${baseUrl}standard_fonts/`,
    });
    pdf = await loadingTask.promise;
    if (pdf.numPages > MAX_MARKDOWN_PDF_PAGES) {
      throw new Error(`This PDF has ${pdf.numPages} pages. The limit is ${MAX_MARKDOWN_PDF_PAGES} pages.`);
    }
    const pageTexts: PageText[] = [];
    const pageImages: ImageReference[][] = [];
    const extractedObjects = new Map<string, MarkdownImage>();
    const extractedByContent = new Map<string, MarkdownImage>();
    const uniqueImages = new Map<string, MarkdownImage>();
    let skippedImageCount = 0;
    const basename = options.baseName || sanitizeMarkdownBaseName(file.name);

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      options.onPage?.(pageNumber, pdf.numPages);
      const page = await pdf.getPage(pageNumber);
      let pageCanvas: HTMLCanvasElement | null = null;
      try {
        const viewport = page.getViewport({ scale: 1 });
        const [textContent, annotations, operatorList] = await Promise.all([
          page.getTextContent(),
          page.getAnnotations(),
          page.getOperatorList(),
        ]);
        (page as any).__textItems = textContent.items;
        (page as any).__textStyles = textContent.styles;
        (page as any).__operatorList = operatorList;
        const runs = getTextRuns(page, viewport, annotations);
        const lines = groupTextRuns(runs, viewport.height);
        pageTexts.push({ lines, height: viewport.height, width: viewport.width });

        const images: ImageReference[] = [];
        const placements = getImagePlacements(page);
        for (const [index, placement] of placements.entries()) {
          const resolved = placement.objectId.startsWith("inline-")
            ? {
                key: `inline-${pageNumber}-${placement.id}`,
                value: operatorList.argsArray[Number(placement.id)]?.[0],
              }
            : await resolveImageObject(page, placement.objectId, pageNumber);
          const cachedImage = extractedObjects.get(resolved.key);
          if (cachedImage) {
            images.push({
              ...cachedImage,
              y: getPagePositionY(viewport, placement.y),
            });
            continue;
          }
          const imageObject = resolved.value;
          let extracted: Awaited<ReturnType<typeof imageToBlob>> = null;
          try {
            extracted = await imageToBlob(imageObject);
          } catch (error) {
            console.warn("Unable to decode PDF image; trying its positioned page crop.", { pageNumber, objectId: placement.objectId, error });
          }
          const decodedFromObject = Boolean(extracted);
          if (!extracted) {
            try {
              const cropped = await cropPlacement(
                page,
                placement,
                viewport,
                lines.length > 0,
                pageCanvas ? { canvas: pageCanvas } : null,
              );
              if (cropped) {
                pageCanvas = cropped.canvas;
                extracted = {
                  blob: cropped.blob,
                  width: cropped.width,
                  height: cropped.height,
                };
              }
            } catch (error) {
              console.warn("Unable to crop positioned PDF image; skipping it.", { pageNumber, objectId: placement.objectId, error });
            }
          }
          if (!extracted) {
            console.warn("Unable to extract PDF image; skipping it.", { pageNumber, objectId: placement.objectId });
            skippedImageCount += 1;
            continue;
          }
          if (extracted.width < 16 || extracted.height < 16) {
            skippedImageCount += 1;
            continue;
          }
          const fingerprint = await hashBlob(extracted.blob);
          const duplicateImage = extractedByContent.get(fingerprint);
          if (duplicateImage) {
            images.push({
              ...duplicateImage,
              y: getPagePositionY(viewport, placement.y),
            });
            if (decodedFromObject && !placement.objectId.startsWith("inline-")) {
              extractedObjects.set(resolved.key, duplicateImage);
            }
            continue;
          }
          const fileName = `${basename}-p${pageNumber}-${index + 1}.png`;
          const imageFile = { fileName, blob: extracted.blob };
          const reference = { ...imageFile, y: getPagePositionY(viewport, placement.y) };
          images.push(reference);
          extractedByContent.set(fingerprint, imageFile);
          uniqueImages.set(fileName, imageFile);
          if (decodedFromObject && !placement.objectId.startsWith("inline-")) {
            extractedObjects.set(resolved.key, imageFile);
          }
        }
        pageImages.push(images);
      } finally {
        if (pageCanvas) {
          pageCanvas.width = 0;
          pageCanvas.height = 0;
        }
        page.cleanup();
        await delay();
      }
    }

    const linesWithoutFurniture = removeRepeatedFurniture(pageTexts);
    const bodySize = median(pageTexts.map((_, index) =>
      median(linesWithoutFurniture[index]!.map((line) => line.fontSize)),
    ));
    const pages = pageTexts.map((page, index) => {
      const textLines = linesWithoutFurniture[index]!;
      const images = pageImages[index]!;
      let text = markdownForPage(textLines, bodySize);
      const imageLines = images.map((image) => ({
        y: image.y,
        type: "image" as const,
        text: `![Image from page ${index + 1}](images/${image.fileName})`,
      }));
      const allPieces = [
        ...textLines.map((line) => ({ y: page.height - line.y, type: "text" as const, text: line.text })),
        ...imageLines,
      ].sort((a, b) => a.y - b.y);
      if (images.length) {
        const fragments: string[] = [];
        let textSegment: TextLine[] = [];
        const flushTextSegment = () => {
          if (textSegment.length) fragments.push(markdownForPage(textSegment, bodySize));
          textSegment = [];
        };
        let lineIndex = 0;
        for (const piece of allPieces) {
          if (piece.type === "image") {
            flushTextSegment();
            fragments.push(piece.text);
          }
          else {
            const next = textLines[lineIndex++];
            if (next) textSegment.push(next);
          }
        }
        flushTextSegment();
        text = fragments.join("\n\n");
      }
      return text;
    });
    const textFound = hasMarkdownText(pages);
    options.onTextStatus?.(textFound);
    return {
      pages,
      images: [...uniqueImages.values()],
      skippedImageCount,
      textFound,
    };
  } catch (error) {
    if (error instanceof Error && /pages\. The limit is/.test(error.message)) throw error;
    const friendlyMessage = markdownPdfErrorMessage(error);
    if (friendlyMessage) throw new Error(friendlyMessage);
    console.error("PDF to Markdown conversion failed.", error);
    throw new Error("Conversion failed. Try another PDF.");
  } finally {
    try {
      await pdf?.cleanup();
    } finally {
      await loadingTask?.destroy();
    }
  }
}
