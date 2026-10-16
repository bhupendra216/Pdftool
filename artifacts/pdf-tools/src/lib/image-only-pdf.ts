import { PDFDocument } from 'pdf-lib';

export type RasterPdfPage = {
  imageDataUrl: string;
  width: number;
  height: number;
};

export type ReplacementRasterPdfPage = RasterPdfPage & {
  pageNumber: number;
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

export async function replacePdfPagesWithImages(sourceBytes: Uint8Array, replacements: ReplacementRasterPdfPage[]) {
  const source = await PDFDocument.load(sourceBytes);
  const output = await PDFDocument.create();
  const replacementByPage = new Map(replacements.map((page) => [page.pageNumber, page]));
  const sourcePages = source.getPages();

  for (let index = 0; index < sourcePages.length; index += 1) {
    const replacement = replacementByPage.get(index + 1);
    if (replacement) {
      if (!replacement.imageDataUrl || replacement.width <= 0 || replacement.height <= 0) {
        throw new Error('Rendered replacement pages must include an image and positive dimensions.');
      }
      const image = await output.embedPng(replacement.imageDataUrl);
      const page = output.addPage([replacement.width, replacement.height]);
      page.drawImage(image, { x: 0, y: 0, width: replacement.width, height: replacement.height });
    } else {
      const [copiedPage] = await output.copyPages(source, [index]);
      output.addPage(copiedPage);
    }
  }
  return output.save();
}
