import { expect, it } from 'vitest';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { drawShapedTextOutlines } from './fonts/draw-shaped-text';
import {
  captureEditorGlyphCheck,
  cssFamilyFor,
  embedEditorFont,
  loadEditorPreviewFonts,
  loadEditorTextMetrics,
  splitTextForPdfUsingFonts,
  verifyEditorPdfGlyphs,
  type EditorFontFamily,
} from './fonts/registry';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const samples: Array<{ family: EditorFontFamily; text: string }> = [
  { family: 'Noto Sans', text: 'Zażółć gęślą jaźń, Łódź' },
  { family: 'Noto Sans', text: 'Příliš žluťoučký kůň, Ľudovít Štúr' },
  { family: 'Noto Sans', text: 'Árvíztűrő tükörfúrógép, őű' },
  { family: 'Noto Sans', text: 'Șoseaua Ștefan, țară' },
  { family: 'Noto Sans', text: 'İstanbul, ığüşöç, Çağrı' },
  { family: 'Noto Sans', text: 'Nguyễn Thị Hương, ếệờ' },
  { family: 'Noto Sans', text: 'Ọlá, ẹ, ń, ɔ' },
  { family: 'Noto Sans', text: 'Καλημέρα · Привіт' },
  { family: 'Carlito', text: 'Mārtiņš · Ķemeri · Šiauliai' },
  { family: 'Noto Sans Hebrew', text: 'English 123 שלום' },
  { family: 'Noto Sans Georgian', text: 'გამარჯობა' },
  { family: 'Noto Sans Armenian', text: 'Բարեւ աշխարհ' },
];

function getInkBounds(canvas: HTMLCanvasElement) {
  const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
  let left = canvas.width;
  let top = canvas.height;
  let right = -1;
  let bottom = -1;
  let darkness = 0;
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const offset = (y * canvas.width + x) * 4;
      const alpha = data[offset + 3] / 255;
      const luminance = alpha * (0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2]) +
        (1 - alpha) * 255;
      darkness += 255 - luminance;
      if (luminance >= 220) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return { left, top, right, bottom, darkness };
}

it('matches browser text rendering and preserves extracted Phase 1 script samples', async () => {
  await Promise.all(samples.map(({ family }) => loadEditorPreviewFonts(family, 'regular')));
  await document.fonts.ready;

  const documentPdf = await PDFDocument.create();
  documentPdf.registerFontkit(fontkit);
  const glyphChecks: Awaited<ReturnType<typeof captureEditorGlyphCheck>>[] = [];

  for (const { family, text } of samples) {
    const primary = await embedEditorFont(documentPdf, family, 'regular');
    const fallbackFamily: EditorFontFamily = 'Noto Sans';
    const fallback = family === fallbackFamily
      ? primary
      : await embedEditorFont(documentPdf, fallbackFamily, 'regular');
    const metrics = await loadEditorTextMetrics(family, 'regular', fallbackFamily);
    const page = documentPdf.addPage([720, 140]);
    const x = 28;
    const y = 72;
    const size = 20;
    drawShapedTextOutlines(page, metrics.shapeTextAtSize(text, size), { x, y, color: rgb(0, 0, 0) });

    let textX = x;
    for (const run of splitTextForPdfUsingFonts(text, [fallback, primary])) {
      page.drawText(run.text, { x: textX, y, size, font: run.font, color: rgb(0, 0, 0), opacity: 0 });
      glyphChecks.push(await captureEditorGlyphCheck(
        run.font,
        run.font === fallback ? fallbackFamily : family,
        'regular',
        run.text,
      ));
      textX += run.font.widthOfTextAtSize(run.text, size);
    }
  }

  const bytes = await documentPdf.save();
  await verifyEditorPdfGlyphs(bytes, glyphChecks);
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;

  for (const [index, { family, text }] of samples.entries()) {
    const page = await pdf.getPage(index + 1);
    const content = await page.getTextContent();
    expect(content.items.map((item) => 'str' in item ? item.str : '').join('')).toBe(text);

    const viewport = page.getViewport({ scale: 1 });
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    const pdfContext = pdfCanvas.getContext('2d');
    expect(pdfContext).not.toBeNull();
    await page.render({ canvas: pdfCanvas, canvasContext: pdfContext!, viewport }).promise;

    const browserCanvas = document.createElement('canvas');
    browserCanvas.width = viewport.width;
    browserCanvas.height = viewport.height;
    const browserContext = browserCanvas.getContext('2d')!;
    browserContext.font = `${20}px ${cssFamilyFor(family)}`;
    browserContext.textBaseline = 'alphabetic';
    browserContext.fillStyle = '#000000';
    browserContext.fillText(text, 28, viewport.height - 72);

    const pdfInk = getInkBounds(pdfCanvas);
    const browserInk = getInkBounds(browserCanvas);
    expect(pdfInk.right, `${family} PDF outlines should be visible`).toBeGreaterThanOrEqual(pdfInk.left);
    expect(browserInk.right, `${family} browser reference should be visible`).toBeGreaterThanOrEqual(browserInk.left);
    expect(
      Math.abs(pdfInk.darkness - browserInk.darkness) / browserInk.darkness,
      `${family} ink coverage: ${pdfInk.darkness} vs ${browserInk.darkness}`,
    ).toBeLessThan(0.2);
    expect(Math.abs(pdfInk.left - browserInk.left), `${family} horizontal position`).toBeLessThanOrEqual(3);
    expect(Math.abs(pdfInk.top - browserInk.top), `${family} vertical position`).toBeLessThanOrEqual(3);
  }
});
