import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createImageOnlyPdf } from './image-only-pdf';

const onePixelPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l3sAAAAASUVORK5CYII=';

async function extractText(bytes: Uint8Array) {
  const document = await pdfjsLib.getDocument({ data: bytes }).promise;
  const text: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    text.push(...content.items.map((item: any) => item.str ?? ''));
  }
  return text.join('');
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
});
