export type PdfRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PdfViewport = {
  convertToPdfPoint(x: number, y: number): number[];
  convertToViewportPoint(x: number, y: number): number[];
  convertToViewportRectangle?(rect: [number, number, number, number]): number[];
};

export function viewportToPdf(
  viewport: PdfViewport,
  x: number,
  y: number,
  width: number,
  height: number,
): PdfRect {
  const topLeft = viewport.convertToPdfPoint(x, y);
  const bottomRight = viewport.convertToPdfPoint(x + width, y + height);
  return {
    x: Math.min(topLeft[0], bottomRight[0]),
    y: Math.min(topLeft[1], bottomRight[1]),
    width: Math.abs(bottomRight[0] - topLeft[0]),
    height: Math.abs(bottomRight[1] - topLeft[1]),
  };
}

export function pdfToViewport(viewport: PdfViewport, pdfRect: PdfRect): PdfRect {
  const sourceRect: [number, number, number, number] = [
    pdfRect.x,
    pdfRect.y,
    pdfRect.x + pdfRect.width,
    pdfRect.y + pdfRect.height,
  ];
  // PDF.js 6 exposes point conversion but not rectangle conversion; use the same
  // viewport transform on the rectangle corners in that version.
  const rect = viewport.convertToViewportRectangle?.(sourceRect) ?? (() => {
    const first = viewport.convertToViewportPoint(sourceRect[0], sourceRect[1]);
    const second = viewport.convertToViewportPoint(sourceRect[2], sourceRect[3]);
    return [first[0], first[1], second[0], second[1]];
  })();
  return {
    x: Math.min(rect[0], rect[2]),
    y: Math.min(rect[1], rect[3]),
    width: Math.abs(rect[2] - rect[0]),
    height: Math.abs(rect[3] - rect[1]),
  };
}
