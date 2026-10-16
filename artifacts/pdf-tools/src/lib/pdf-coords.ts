export type PdfRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PdfViewport = {
  width?: number;
  height?: number;
  convertToPdfPoint(x: number, y: number): number[];
  convertToViewportPoint(x: number, y: number): number[];
};

function rectFromPoints(points: number[][]): PdfRect {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const bottom = Math.min(...ys);
  return {
    x: left,
    y: bottom,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - bottom,
  };
}

export function viewportToPdf(
  viewport: PdfViewport,
  x: number,
  y: number,
  width: number,
  height: number,
): PdfRect {
  return rectFromPoints([
    viewport.convertToPdfPoint(x, y),
    viewport.convertToPdfPoint(x + width, y),
    viewport.convertToPdfPoint(x, y + height),
    viewport.convertToPdfPoint(x + width, y + height),
  ]);
}

export function pdfToViewport(viewport: PdfViewport, pdfRect: PdfRect): PdfRect {
  return rectFromPoints([
    viewport.convertToViewportPoint(pdfRect.x, pdfRect.y),
    viewport.convertToViewportPoint(pdfRect.x + pdfRect.width, pdfRect.y),
    viewport.convertToViewportPoint(pdfRect.x, pdfRect.y + pdfRect.height),
    viewport.convertToViewportPoint(pdfRect.x + pdfRect.width, pdfRect.y + pdfRect.height),
  ]);
}

export function getPdfViewportBounds(viewport: PdfViewport) {
  if (!Number.isFinite(viewport.width) || !Number.isFinite(viewport.height)) {
    throw new Error('PDF viewport dimensions are required to determine page bounds.');
  }
  return viewportToPdf(viewport, 0, 0, viewport.width ?? 0, viewport.height ?? 0);
}
