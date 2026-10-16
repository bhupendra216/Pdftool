import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { describe, it } from 'node:test';
import { getOriginalLineMaskRect, getReplacementBaseline } from './pdf-text-geometry';
import { pdfToViewport } from './pdf-coords';
import { embedEditorFont, FONT_REGISTRY, type EditorFontFamily, type FontVariant } from './fonts/registry';

const globals = globalThis as unknown as Record<string, unknown>;
globals.DOMMatrix ??= DOMMatrix;
globals.ImageData ??= ImageData;
globals.Path2D ??= Path2D;

const fontAssetDirectory = new URL('../../public/fonts/edit/', import.meta.url);

async function withFontAssetFetch<T>(run: () => Promise<T>) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const filename = new URL(String(input), 'http://localhost').pathname.split('/').at(-1) ?? '';
    return new Response(readFileSync(fileURLToPath(new URL(filename, fontAssetDirectory))));
  }) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function openPdf(bytes: Uint8Array) {
  return pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
}

async function renderPage(page: Awaited<ReturnType<Awaited<ReturnType<typeof openPdf>>['getPage']>>) {
  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');
  await page.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;
  return { canvas, viewport };
}

type PdfTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
};

describe('Edit PDF fidelity acceptance', () => {
  it('embeds and renders all regular/bold/italic TTF variants for the replacement families', async () => {
    await withFontAssetFetch(async () => {
      const families = ['Gelasio', 'Merriweather', 'Source Sans 3'] as const satisfies EditorFontFamily[];
      const variants: FontVariant[] = ['regular', 'bold', 'italic', 'boldItalic'];
      const document = await PDFDocument.create();
      document.registerFontkit(fontkit);
      const expectedTexts: string[] = [];

      for (const family of families) {
        for (const variant of variants) {
          const font = await embedEditorFont(document, family, variant);
          const text = `${family} ${variant} TTF 123`;
          const codePoints = [...text].map((character) => character.codePointAt(0) ?? 0);
          const characterSet = new Set(font.getCharacterSet());
          assert.ok(codePoints.every((codePoint) => characterSet.has(codePoint)), `${family} ${variant} glyph coverage`);
          const page = document.addPage([420, 100]);
          page.drawText(text, { x: 20, y: 40, size: 18, font });
          expectedTexts.push(text);
        }
      }

      const pdf = await openPdf(await document.save());
      assert.equal(pdf.numPages, expectedTexts.length);
      for (let index = 0; index < pdf.numPages; index += 1) {
        const page = await pdf.getPage(index + 1);
        const content = await page.getTextContent();
        const actualText = content.items.map((item) => 'str' in item ? item.str : '').join('');
        assert.equal(actualText, expectedTexts[index]);
        const { canvas } = await renderPage(page);
        const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let darkPixels = 0;
        for (let pixel = 0; pixel < pixels.length; pixel += 4) {
          if (pixels[pixel] < 100 && pixels[pixel + 1] < 100 && pixels[pixel + 2] < 100) darkPixels += 1;
        }
        assert.ok(darkPixels > 100, `${expectedTexts[index]} renders visible glyphs`);
      }
    });
  });

  it('masks original y/g/p/q descenders and preserves the original export baseline', async () => {
    await withFontAssetFetch(async () => {
      const source = await PDFDocument.create();
      source.registerFontkit(fontkit);
      const originalFont = await source.embedFont(readFileSync(fileURLToPath(new URL('liberation-sans-regular.ttf', fontAssetDirectory))), { subset: true });
      const sourcePage = source.addPage([500, 240]);
      sourcePage.drawText('Title ygpq', { x: 50, y: 150, size: 48, font: originalFont, color: rgb(0, 0, 0) });
      const sourceBytes = await source.save();
      const sourcePdf = await openPdf(sourceBytes);
      const sourcePageProxy = await sourcePdf.getPage(1);
      const sourceContent = await sourcePageProxy.getTextContent();
      const original = sourceContent.items.find((item): item is typeof item & PdfTextItem => 'str' in item && item.str.includes('ygpq'));
      assert.ok(original);
      const originalItem = original as PdfTextItem;
      const style = sourceContent.styles[originalItem.fontName];
      const baseline = originalItem.transform[5];
      const fontSize = originalItem.height;
      const mask = getOriginalLineMaskRect(
        { x: originalItem.transform[4], y: baseline - originalItem.height, width: originalItem.width, height: originalItem.height },
        baseline,
        fontSize,
        { ascent: style.ascent * fontSize, descent: style.descent * fontSize },
      );

      const output = await PDFDocument.load(sourceBytes);
      output.registerFontkit(fontkit);
      const outputFont = await output.embedFont(readFileSync(fileURLToPath(new URL('liberation-sans-regular.ttf', fontAssetDirectory))), { subset: true });
      const outputPage = output.getPage(0);
      outputPage.drawRectangle({ ...mask, color: rgb(1, 1, 1), borderWidth: 0 });
      outputPage.drawText('TITLE', {
        x: originalItem.transform[4],
        y: getReplacementBaseline(baseline, 0, fontSize * 1.2),
        size: fontSize,
        font: outputFont,
        color: rgb(0, 0, 0),
      });
      const outputPdf = await openPdf(await output.save());
      const outputPageProxy = await outputPdf.getPage(1);
      const outputContent = await outputPageProxy.getTextContent();
      const replacementItems = outputContent.items.filter((item): item is typeof item & PdfTextItem => 'str' in item && item.str.length > 0);
      const replacementText = replacementItems.filter((item) => item.str.includes('TITLE'));
      assert.ok(replacementItems.map((item) => item.str).join('').includes('TITLE'));
      assert.ok(replacementText.length > 0);
      assert.ok(Math.abs(replacementText[0].transform[5] - baseline) < 0.5);

      const { canvas, viewport } = await renderPage(outputPageProxy);
      const baselineScreenY = viewport.convertToViewportPoint(originalItem.transform[4], baseline)[1];
      const maskScreen = pdfToViewport(viewport, mask);
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let descenderPixels = 0;
      for (let y = Math.floor(baselineScreenY + 2); y < Math.ceil(maskScreen.y + maskScreen.height); y += 1) {
        for (let x = Math.floor(maskScreen.x); x < Math.ceil(maskScreen.x + maskScreen.width); x += 1) {
          const offset = (y * canvas.width + x) * 4;
          if (pixels[offset] < 100 && pixels[offset + 1] < 100 && pixels[offset + 2] < 100) descenderPixels += 1;
        }
      }
      assert.equal(descenderPixels, 0);
    });
  });
});