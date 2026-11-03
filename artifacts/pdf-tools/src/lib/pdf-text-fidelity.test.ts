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
import { captureEditorGlyphCheck, embedEditorFont, FONT_REGISTRY, loadEditorTextMetrics, splitTextForPdf, splitTextForPdfUsingFonts, verifyEditorPdfGlyphs, type EditorFontFamily, type FontVariant } from './fonts/registry';
import { drawShapedTextOutlines } from './fonts/draw-shaped-text';

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

function countInk(
  canvas: ReturnType<typeof createCanvas>,
  baseline: { x: number; y: number },
  width: number,
  scale: number,
) {
  const left = Math.max(0, Math.floor(baseline.x * scale) - 2);
  const right = Math.min(canvas.width, Math.ceil((baseline.x + width) * scale) + 2);
  const top = Math.max(0, Math.floor(baseline.y * scale - 18 * scale * 1.1));
  const bottom = Math.min(canvas.height, Math.ceil(baseline.y * scale + 18 * scale * 0.45));
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let ink = 0;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      if (pixels[offset] < 100 && pixels[offset + 1] < 100 && pixels[offset + 2] < 100) ink += 1;
    }
  }
  return ink;
}

function readSfntTableTags(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tableCount = view.getUint16(4);
  return new Set(Array.from({ length: tableCount }, (_, index) => {
    const offset = 12 + index * 16;
    return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
  }));
}

type PdfTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
};

describe('Edit PDF fidelity acceptance', () => {
  it('shapes and renders Phase 1 scripts while preserving exact mixed-direction text', async () => {
    await withFontAssetFetch(async () => {
      const cases: Array<[EditorFontFamily, string]> = [
        ['Noto Sans', 'Zażółć gęślą jaźń, Łódź'],
        ['Noto Sans', 'Příliš žluťoučký kůň, Ľudovít Štúr'],
        ['Noto Sans', 'Árvíztűrő tükörfúrógép, őű'],
        ['Noto Sans', 'Șoseaua Ștefan, țară'],
        ['Noto Sans', 'İstanbul, ığüşöç, Çağrı'],
        ['Noto Sans', 'Nguyễn Thị Hương, ếệờ'],
        ['Noto Sans', 'Ọlá, ẹ, ń, ɔ'],
        ['Noto Sans', 'Καλημέρα · Привіт'],
        ['Carlito', 'Mārtiņš · Ķemeri · Šiauliai'],
      ];
      const document = await PDFDocument.create();
      const glyphChecks: Awaited<ReturnType<typeof captureEditorGlyphCheck>>[] = [];

      for (const [family, text] of cases) {
        const primary = await embedEditorFont(document, family, 'regular');
        const fallbackFamily: EditorFontFamily = 'Noto Sans';
        const fallback = family === fallbackFamily
          ? primary
          : await embedEditorFont(document, fallbackFamily, 'regular');
        const extractionFont = family === 'Noto Sans'
          ? primary
          : fallbackFamily === 'Noto Sans'
            ? fallback
            : await embedEditorFont(document, 'Noto Sans', 'regular');
        const metrics = await loadEditorTextMetrics(family, 'regular', fallbackFamily);
        const page = document.addPage([720, 140]);
        const x = 28;
        const y = 72;
        const size = 20;
        const shapedRuns = metrics.shapeTextAtSize(text, size);
        assert.ok(shapedRuns.flatMap((run) => run.glyphs)
          .every((glyph) => glyph.id !== 0), `${family} produced no missing-glyph IDs`);
        drawShapedTextOutlines(page, shapedRuns, { x, y, color: rgb(0, 0, 0) });

        let textX = x;
        for (const run of splitTextForPdfUsingFonts(text, [extractionFont, fallback, primary])) {
          page.drawText(run.text, {
            x: textX,
            y,
            size,
            font: run.font,
            color: rgb(0, 0, 0),
            opacity: 0,
          });
          glyphChecks.push(await captureEditorGlyphCheck(
            run.font,
            run.font === extractionFont
              ? 'Noto Sans'
              : run.font === primary ? family : fallbackFamily,
            'regular',
            run.text,
          ));
          textX += run.font.widthOfTextAtSize(run.text, size);
        }
      }

      const bytes = await document.save();
      await verifyEditorPdfGlyphs(bytes, glyphChecks);
      const pdf = await openPdf(bytes);
      assert.equal(pdf.numPages, cases.length);
      for (const [index, [family, expectedText]] of cases.entries()) {
        const page = await pdf.getPage(index + 1);
        const content = await page.getTextContent();
        const extracted = content.items
          .filter((item): item is typeof item & PdfTextItem => 'str' in item && item.str.length > 0)
          .map((item) => item.str)
          .join('');
        assert.equal(extracted, expectedText, family);
        const { canvas } = await renderPage(page);
        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let ink = 0;
        for (let offset = 0; offset < data.length; offset += 4) {
          if (data[offset] < 100 && data[offset + 1] < 100 && data[offset + 2] < 100) ink += 1;
        }
        assert.ok(ink > 0, `${family} rendered no visible glyph outlines`);
      }
    });
  });

  it('renders an edited line in every registered font with matching ink and exact text', async () => {
    await withFontAssetFetch(async () => {
      const text = "The quick brown fox 0123456789 .,;:'- ÀÁÉÖñç";
      const document = await PDFDocument.create();
      document.registerFontkit(fontkit);
      const checks: Awaited<ReturnType<typeof captureEditorGlyphCheck>>[] = [];
      const expectedWidths: number[] = [];

      for (const { family } of FONT_REGISTRY) {
        const slug = family.toLowerCase().replaceAll(' ', '-');
        const fontAsset = `${slug}-regular.ttf`;
        const fontBytes = readFileSync(fileURLToPath(new URL(fontAsset, fontAssetDirectory)));
        const originalFont = await document.embedFont(fontBytes, { subset: false });
        const editedFont = await embedEditorFont(document, family, 'regular');
        const fallbackFont = await embedEditorFont(document, 'Noto Sans', 'regular');
        const metrics = await loadEditorTextMetrics(family, 'regular');
        const page = document.addPage([900, 180]);
        let originalX = 24;
        for (const run of splitTextForPdf(text, originalFont, fallbackFont)) {
          page.drawText(run.text, { x: originalX, y: 120, size: 18, font: run.font, color: rgb(0, 0, 0) });
          originalX += run.font.widthOfTextAtSize(run.text, 18);
        }
        let editedX = 24;
        for (const run of splitTextForPdf(text, editedFont, fallbackFont)) {
          page.drawText(run.text, { x: editedX, y: 60, size: 18, font: run.font, color: rgb(0, 0, 0) });
          checks.push(await captureEditorGlyphCheck(
            run.font,
            run.font === editedFont ? family : 'Noto Sans',
            'regular',
            run.text,
          ));
          editedX += run.font.widthOfTextAtSize(run.text, 18);
        }
        expectedWidths.push(metrics.widthOfTextAtSize(text, 18));
      }

      const bytes = await document.save();
      const pdf = await openPdf(bytes);
      await verifyEditorPdfGlyphs(bytes, checks);
      assert.equal(pdf.numPages, FONT_REGISTRY.length);
      for (let index = 0; index < pdf.numPages; index += 1) {
        const page = await pdf.getPage(index + 1);
        const content = await page.getTextContent();
        const actualText = content.items
          .filter((item): item is typeof item & PdfTextItem => 'str' in item && item.str.length > 0)
          .map((item) => item.str)
          .join('');
        assert.equal(actualText, `${text}${text}`, FONT_REGISTRY[index].family);

        const { canvas, viewport } = await renderPage(page);
        const originalBaseline = viewport.convertToViewportPoint(24, 120);
        const editedBaseline = viewport.convertToViewportPoint(24, 60);
        const originalInk = countInk(canvas, { x: originalBaseline[0] / 2, y: originalBaseline[1] / 2 }, expectedWidths[index], 2);
        const editedInk = countInk(canvas, { x: editedBaseline[0] / 2, y: editedBaseline[1] / 2 }, expectedWidths[index], 2);
        assert.ok(originalInk > 0, `${FONT_REGISTRY[index].family} original line is visible`);
        assert.ok(editedInk > 0, `${FONT_REGISTRY[index].family} edited line is visible`);
        assert.ok(
          Math.abs(editedInk - originalInk) / originalInk < 0.1,
          `${FONT_REGISTRY[index].family} ink coverage differs: ${originalInk} vs ${editedInk}`,
        );
      }
    });
  });

  it('blocks export when a subset contains blank outlines', async () => {
    await withFontAssetFetch(async () => {
      const document = await PDFDocument.create();
      document.registerFontkit(fontkit);
      const fontBytes = readFileSync(fileURLToPath(new URL('carlito-regular.ttf', fontAssetDirectory)));
      const font = await document.embedFont(fontBytes, { subset: true });
      const text = "The quick brown fox 0123456789 .,;:'- ÀÁÉÖñç";
      document.addPage().drawText(text, { x: 20, y: 40, size: 18, font });
      const check = await captureEditorGlyphCheck(font, 'Carlito', 'regular', text);
      await assert.rejects(verifyEditorPdfGlyphs(await document.save(), [check]), /Carlito.*outline|Carlito.*blank glyph/);
    });
  });

  it('blocks a variable-font input whose edited glyph has no outline', async () => {
    const variableBytes = readFileSync(fileURLToPath(
      new URL('../../test-fixtures/roboto-variable-missing-outline.ttf', import.meta.url),
    ));
    const tables = readSfntTableTags(variableBytes);
    assert.ok(tables.has('fvar'));
    assert.ok(tables.has('gvar'));

    const text = "The quick brown fox 0123456789 .,;:'- ÀÁÉÖñç";
    const sourceFont = fontkit.create(variableBytes);
    const document = await PDFDocument.create();
    document.registerFontkit(fontkit);
    const font = await document.embedFont(variableBytes, { subset: false });
    document.addPage().drawText(text, { x: 20, y: 40, size: 18, font });
    const encoded = font.encodeText(text).asBytes();
    const glyphs = sourceFont.layout(text).glyphs.map((glyph, index) => ({
      glyphId: encoded[index * 2] * 256 + encoded[index * 2 + 1],
      codePoints: [...glyph.codePoints],
    }));
    const bytes = await document.save();
    const pdf = await openPdf(bytes);
    const content = await (await pdf.getPage(1)).getTextContent();
    assert.equal(content.items.map((item) => 'str' in item ? item.str : '').join(''), text);
    await assert.rejects(
      verifyEditorPdfGlyphs(bytes, [{ font, family: 'Roboto', text, glyphs }]),
      /Roboto has a blank glyph for U\+54/,
    );
  });

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