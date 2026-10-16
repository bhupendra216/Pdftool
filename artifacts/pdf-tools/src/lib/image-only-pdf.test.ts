import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createImageOnlyPdf, replacePdfPagesWithImages } from './image-only-pdf';

const onePixelPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l3sAAAAASUVORK5CYII=';

async function extractPageTexts(bytes: Uint8Array) {
  const document = await pdfjsLib.getDocument({ data: bytes }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => item.str ?? '').join(''));
  }
  return pages;
}

async function extractText(bytes: Uint8Array) {
  return (await extractPageTexts(bytes)).join('');
}

describe('image-only PDF export', () => {
  it('removes source text from PDF.js extraction after flattening', async () => {
    const source = await PDFDocument.create();
    const page = source.addPage([300, 200]);
    const font = await source.embedFont(StandardFonts.Helvetica);
    page.drawText('DELETE ME', { x: 20, y: 100, font, size: 18 });
    const sourceBytes = await source.save();
    assert.match(await extractText(sourceBytes), /DELETE ME/);

    const flattenedBytes = await createImageOnlyPdf([
      { imageDataUrl: onePixelPng, width: 300, height: 200 },
    ]);
    assert.equal(await extractText(flattenedBytes), '');
  });

  it('rasterizes only the replaced page and keeps other pages selectable', async () => {
    const source = await PDFDocument.create();
    for (const pageText of ['Page one', 'Deleted page', 'Page three']) {
      const page = source.addPage([300, 200]);
      const font = await source.embedFont(StandardFonts.Helvetica);
      page.drawText(pageText, { x: 20, y: 100, font, size: 18 });
    }
    const sourceBytes = await source.save();
    const outputBytes = await replacePdfPagesWithImages(sourceBytes, [
      { pageNumber: 2, imageDataUrl: onePixelPng, width: 300, height: 200 },
    ]);
    const pages = await extractPageTexts(outputBytes);
    assert.equal(pages.length, 3);
    assert.match(pages[0], /Page one/);
    assert.equal(pages[1], '');
    assert.match(pages[2], /Page three/);
  });
});
