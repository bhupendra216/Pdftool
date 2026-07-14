import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type PageNumberPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function getTextPositionForPage(width: number, height: number, position: WatermarkPosition, textWidth: number, textHeight: number) {
  const margin = 24;
  switch (position) {
    case "top-left":
      return { x: margin, y: height - margin - textHeight };
    case "top-right":
      return { x: width - margin - textWidth, y: height - margin - textHeight };
    case "bottom-left":
      return { x: margin, y: margin };
    case "bottom-right":
    default:
      return { x: width - margin - textWidth, y: margin };
  }
}

export function getPageNumberPosition(width: number, height: number, position: PageNumberPosition, textWidth: number, textHeight: number) {
  const margin = 24;
  switch (position) {
    case "top-left":
      return { x: margin, y: height - margin - textHeight };
    case "top-right":
      return { x: width - margin - textWidth, y: height - margin - textHeight };
    case "bottom-left":
      return { x: margin, y: margin };
    case "bottom-right":
    default:
      return { x: width - margin - textWidth, y: margin };
  }
}

export async function applyWatermarkToPdf(sourcePdf: PDFDocument, text: string, position: WatermarkPosition, fontSize = 24, color = rgb(0.45, 0.45, 0.45), opacity = 0.12) {
  const font = await sourcePdf.embedFont(StandardFonts.Helvetica);
  const pages = sourcePdf.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;
    const { x, y } = getTextPositionForPage(width, height, position, textWidth, textHeight);

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
      opacity,
      rotate: { type: "degrees", angle: -30 },
    });
  });
}

export async function applyImageWatermarkToPdf(sourcePdf: PDFDocument, imageBuffer: Buffer, position: WatermarkPosition, opacity = 0.16, width = 120, height?: number) {
  const image = await sourcePdf.embedPng(imageBuffer);
  const pages = sourcePdf.getPages();
  const targetHeight = height ?? Math.round((width * image.height) / image.width);

  pages.forEach((page) => {
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const margin = 24;
    const x = position === "top-right" || position === "bottom-right"
      ? pageWidth - margin - width
      : margin;
    const y = position === "top-left" || position === "top-right"
      ? pageHeight - margin - targetHeight
      : margin;

    page.drawImage(image, {
      x,
      y,
      width,
      height: targetHeight,
      opacity,
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
