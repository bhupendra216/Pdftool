import { PDFDocument } from 'pdf-lib';

export type RasterPdfPage = {
  imageDataUrl: string;
  width: number;
  height: number;
};

export async function createImageOnlyPdf(pages: RasterPdfPage[]) {
  if (pages.length === 0) throw new Error('At least one rendered page is required.');

  const document = await PDFDocument.create();
  for (const page of pages) {
    if (!page.imageDataUrl || page.width <= 0 || page.height <= 0) {
      throw new Error('Rendered pages must include an image and positive dimensions.');
    }
    const image = await document.embedPng(page.imageDataUrl);
    const outputPage = document.addPage([page.width, page.height]);
    outputPage.drawImage(image, { x: 0, y: 0, width: page.width, height: page.height });
  }
  return document.save();
}
