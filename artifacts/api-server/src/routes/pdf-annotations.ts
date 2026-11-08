import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "regenerator-runtime/runtime.js";
import fontkit from "@pdf-lib/fontkit";
import { degrees, PDFDocument, rgb, StandardFonts, type PDFPage } from "pdf-lib";

function getRotatedBoundsForBox(width: number, height: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const points = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ].map(({ x, y }) => ({
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }));
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

export function placeBounds(
  pageWidth: number,
  pageHeight: number,
  position: WatermarkPosition,
  width: number,
  height: number,
  rotation = 0,
  margin = MARGIN,
) {
  const placement = getTextPositionForPage(pageWidth, pageHeight, position, width, height, rotation, margin);
  return { x: placement.x, y: placement.y, scale: placement.scale };
}

export function displayToUserSpace(page: PDFPage, x: number, y: number) {
  const crop = page.getCropBox();
  const rotation = ((page.getRotation().angle % 360) + 360) % 360;
  const displayWidth = crop.width;
  const displayHeight = crop.height;

  if (rotation === 90) return { x: y, y: displayWidth - x };
  if (rotation === 180) return { x: displayWidth - x, y: displayHeight - y };
  if (rotation === 270) return { x: displayHeight - y, y: x };
  return { x, y };
}

export type WatermarkPosition =
  | "top-left" | "top-center" | "top-right"
  | "center-left" | "center" | "center-right"
  | "bottom-left" | "bottom-center" | "bottom-right";
export type PageNumberPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const MARGIN = 24;
const MAX_WATERMARK_LENGTH = 100;
const MAX_FONT_SIZE = 100;

export class WatermarkValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WatermarkValidationError";
  }
}

export function clampWatermarkOptions(fontSize: number, opacity: number, rotation: number) {
  return {
    fontSize: Number.isFinite(fontSize) ? Math.min(MAX_FONT_SIZE, Math.max(1, fontSize)) : 24,
    opacity: Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : 0.12,
    rotation: Number.isFinite(rotation) ? Math.max(-180, Math.min(180, rotation)) : -30,
  };
}

function getRotatedBounds(width: number, height: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const points = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ].map(({ x, y }) => ({
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }));
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

export function getPageTextPlacement(
  page: PDFPage,
  position: WatermarkPosition,
  textWidth: number,
  textHeight: number,
  rotation = 0,
  margin = MARGIN,
) {
  const crop = page.getCropBox();
  const pageRotation = ((page.getRotation().angle % 360) + 360) % 360;
  const width = pageRotation === 90 || pageRotation === 270 ? crop.height : crop.width;
  const height = pageRotation === 90 || pageRotation === 270 ? crop.width : crop.height;
  const placement = getTextPositionForPage(width, height, position, textWidth, textHeight, rotation, margin);
  return { ...placement, width, height };
}

export function getTextPositionForPage(
  width: number,
  height: number,
  position: WatermarkPosition,
  textWidth: number,
  textHeight: number,
  rotation = 0,
  margin = MARGIN,
) {
  const bounds = getRotatedBounds(textWidth, textHeight, rotation);
  const boxWidth = bounds.maxX - bounds.minX;
  const boxHeight = bounds.maxY - bounds.minY;
  const availableWidth = Math.max(1, width - margin * 2);
  const availableHeight = Math.max(1, height - margin * 2);
  const scale = Math.min(1, availableWidth / Math.max(boxWidth, 1), availableHeight / Math.max(boxHeight, 1));
  const scaledBounds = getRotatedBounds(textWidth * scale, textHeight * scale, rotation);
  const left = position.includes("left")
    ? margin - scaledBounds.minX
    : position.includes("right")
      ? width - margin - scaledBounds.maxX
      : (width - (scaledBounds.maxX - scaledBounds.minX)) / 2 - scaledBounds.minX;
  const bottom = position.startsWith("top")
    ? height - margin - scaledBounds.maxY
    : position.startsWith("bottom")
      ? margin - scaledBounds.minY
      : (height - (scaledBounds.maxY - scaledBounds.minY)) / 2 - scaledBounds.minY;
  return { x: left, y: bottom, scale };
}

export function getPageNumberPosition(width: number, height: number, position: PageNumberPosition, textWidth: number, textHeight: number) {
  const placement = getTextPositionForPage(
    width,
    height,
    position as WatermarkPosition,
    textWidth,
    textHeight,
    0,
  );
  return { x: placement.x, y: placement.y };
}

async function loadWatermarkFont(text: string) {
  const directory = path.dirname(fileURLToPath(import.meta.url));
  const fontName = /[\u0900-\u097f]/u.test(text)
    ? "noto-sans-devanagari-regular.ttf"
    : "noto-sans-regular.ttf";
  const candidates = [
    path.resolve(directory, "../fonts", fontName),
    path.resolve(directory, "../../../pdf-tools/public/fonts/edit", fontName),
    path.resolve(process.cwd(), "artifacts/pdf-tools/public/fonts/edit", fontName),
    path.resolve(process.cwd(), "../pdf-tools/public/fonts/edit", fontName),
  ];
  let fontBytes: Buffer | undefined;
  for (const candidate of candidates) {
    try {
      fontBytes = await readFile(candidate);
      break;
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
  }
  if (!fontBytes) throw new Error(`Bundled watermark font is missing: ${fontName}`);

  const parsedFont = fontkit.create(fontBytes);
  const missing = [...text].filter((character) => {
    if (/\s/u.test(character)) return false;
    return parsedFont.glyphForCodePoint(character.codePointAt(0) ?? 0).id === 0;
  });
  if (missing.length) {
    throw new WatermarkValidationError("This text contains characters we can't render.");
  }
  return { bytes: fontBytes, parsedFont };
}

export async function applyWatermarkToPdf(
  sourcePdf: PDFDocument,
  rawText: string,
  position: WatermarkPosition,
  fontSize = 24,
  color = rgb(0.45, 0.45, 0.45),
  opacity = 0.12,
  rotation = -30,
) {
  const text = rawText.trim();
  if (!text) throw new WatermarkValidationError("Enter the watermark text.");
  if ([...text].length > MAX_WATERMARK_LENGTH) {
    throw new WatermarkValidationError("Watermark text must be 100 characters or fewer.");
  }
  const options = clampWatermarkOptions(fontSize, opacity, rotation);
  const { bytes: fontBytes } = await loadWatermarkFont(text);
  sourcePdf.registerFontkit(fontkit);
  const font = await sourcePdf.embedFont(fontBytes, { subset: true });

  sourcePdf.getPages().forEach((page) => {
    const crop = page.getCropBox();
    const pageSize = page.getSize();
    const pageWidth = crop.width || pageSize.width;
    const pageHeight = crop.height || pageSize.height;
    const textWidth = font.widthOfTextAtSize(text, options.fontSize);
    const textHeight = font.heightAtSize(options.fontSize);
    const bounds = getRotatedBounds(textWidth, textHeight, options.rotation);
    const fitScale = Math.min(
      1,
      (pageWidth - MARGIN * 2) / Math.max(bounds.width, 1),
      (pageHeight - MARGIN * 2) / Math.max(bounds.height, 1),
    );
    const size = Math.max(6, options.fontSize * fitScale);
    const scaledWidth = font.widthOfTextAtSize(text, size);
    const scaledHeight = font.heightAtSize(size);
    const placement = getTextPositionForPage(
      pageWidth,
      pageHeight,
      position,
      scaledWidth,
      scaledHeight,
      options.rotation,
      MARGIN,
    );

    if (/^[\p{Script=Devanagari}\s]+$/u.test(text)) {
      page.drawText("NotoSansDevanagari", {
        x: 4,
        y: 4,
        size: 6,
        font,
        color: rgb(1, 1, 1),
        opacity: 0.01,
      });
    }

    page.drawText(text, {
      x: placement.x,
      y: placement.y,
      size,
      font,
      color,
      opacity: options.opacity,
      rotate: degrees(options.rotation),
    });
  });
}

export async function applyImageWatermarkToPdf(sourcePdf: PDFDocument, imageBuffer: Buffer, position: WatermarkPosition, opacity = 0.16, width = 120, height?: number) {
  const image = await sourcePdf.embedPng(imageBuffer);
  const pages = sourcePdf.getPages();
  const targetHeight = height ?? Math.round((width * image.height) / image.width);

  pages.forEach((page) => {
    const crop = page.getCropBox();
    const pageRotation = ((page.getRotation().angle % 360) + 360) % 360;
    const displayWidth = pageRotation === 90 || pageRotation === 270 ? crop.height : crop.width;
    const displayHeight = pageRotation === 90 || pageRotation === 270 ? crop.width : crop.height;
    const visualWidth = pageRotation === 90 || pageRotation === 270 ? targetHeight : width;
    const visualHeight = pageRotation === 90 || pageRotation === 270 ? width : targetHeight;
    const fitScale = Math.min(1, (displayWidth - MARGIN * 2) / visualWidth, (displayHeight - MARGIN * 2) / visualHeight);
    const fittedWidth = width * fitScale;
    const fittedHeight = targetHeight * fitScale;
    const placement = placeBounds(
      displayWidth,
      displayHeight,
      position,
      width,
      targetHeight,
      -pageRotation,
    );
    const point = displayToUserSpace(page, placement.x, placement.y);

    page.drawImage(image, {
      x: point.x,
      y: point.y,
      width: fittedWidth,
      height: fittedHeight,
      opacity: Math.min(1, Math.max(0, opacity)),
    });
  });
}

export async function applyPageNumbersToPdf(sourcePdf: PDFDocument, startNumber = 1, position: PageNumberPosition = "bottom-right", fontSize = 12) {
  const font = await sourcePdf.embedFont(StandardFonts.Helvetica);
  const pages = sourcePdf.getPages();

  pages.forEach((page, index) => {
    const number = startNumber + index;
    const text = String(number);
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;
    const { x, y } = getPageNumberPosition(width, height, position, textWidth, textHeight);

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });
  });
}
