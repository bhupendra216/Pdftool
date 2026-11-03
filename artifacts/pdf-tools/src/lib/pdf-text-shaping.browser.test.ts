import { expect, it } from 'vitest';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import fixtureUrl from '../../test-fixtures/dogs-devanagari-clean.pdf?url';
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
import { drawPdfTextForExtraction } from './pdf-text-actual-text';
import { containsDevanagariText, createShapingFont } from './fonts/text-shaping';
import { transliterateDevanagari } from './fonts/devanagari-input';

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
  { family: 'Noto Sans Devanagari', text: 'नमस्ते हिन्दी भाषा क्षत्रिय ज्ञान श्रीमान् द्वारा कि र्क' },
  { family: 'Noto Sans Devanagari', text: 'विद्यालय कार्यालय पुस्तक भारत १२३४५६७८९० क्ष ज्ञ श्र' },
  { family: 'Noto Sans Devanagari', text: 'नेपाल राष्ट्र काठमाडौं प्रधानमन्त्री सुनसरी सङ्घीय प्रदेश' },
  { family: 'Noto Sans Devanagari', text: 'शिक्षा मन्त्रालय धन्यवाद २०८२' },
  { family: 'Noto Sans Devanagari', text: 'Kathmandu काठमाडौं 2082' },
  { family: 'Noto Sans Devanagari', text: 'क्‍ष क्‌ष ज्ञ श्र' },
  { family: 'Noto Serif Devanagari', text: 'नमस्ते हिन्दी भाषा क्षत्रिय ज्ञान श्रीमान् द्वारा कि र्क' },
  { family: 'Noto Serif Devanagari', text: 'विद्यालय कार्यालय पुस्तक भारत १२३४५६७८९० क्ष ज्ञ श्र' },
  { family: 'Noto Serif Devanagari', text: 'नेपाल राष्ट्र काठमाडौं प्रधानमन्त्री सुनसरी सङ्घीय प्रदेश' },
  { family: 'Noto Serif Devanagari', text: 'शिक्षा मन्त्रालय धन्यवाद २०८२' },
  { family: 'Noto Serif Devanagari', text: 'Kathmandu काठमाडौं 2082' },
  { family: 'Noto Serif Devanagari', text: 'क्‍ष क्‌ष ज्ञ श्र' },
  { family: 'Mukta', text: 'नमस्ते हिन्दी भाषा क्षत्रिय ज्ञान श्रीमान् द्वारा कि र्क' },
  { family: 'Mukta', text: 'विद्यालय कार्यालय पुस्तक भारत १२३४५६७८९० क्ष ज्ञ श्र' },
  { family: 'Mukta', text: 'नेपाल राष्ट्र काठमाडौं प्रधानमन्त्री सुनसरी सङ्घीय प्रदेश' },
  { family: 'Mukta', text: 'शिक्षा मन्त्रालय धन्यवाद २०८२' },
  { family: 'Mukta', text: 'Kathmandu काठमाडौं 2082' },
  { family: 'Mukta', text: 'क्‍ष क्‌ष ज्ञ श्र' },
];

const devanagariFonts = [
  { family: 'Noto Sans Devanagari', file: 'noto-sans-devanagari-regular.ttf' },
  { family: 'Noto Serif Devanagari', file: 'noto-serif-devanagari-regular.ttf' },
  { family: 'Mukta', file: 'mukta-regular.ttf' },
] as const;

const cheatSheetExamples = ['namaste', 'nepal', 'kshatriya', 'gyaan', 'aa', 'ii', 'M', '~'];
const rephAndRakarWords = [
  'र्क', 'प्र', 'ट्र', 'द्र', 'ग्र', 'त्र', 'श्र', 'क्ष', 'ज्ञ',
  'राष्ट्र', 'कार्यालय', 'प्रधानमन्त्री', 'गर्नुपर्छ', 'ऋ', 'कृ', 'रु', 'रू',
];
const typedDevanagariSentence = 'त्येस्का लागि के के गर्नुपर्छ मलाई त थाहा नै भएन .';

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

it('preserves exact Devanagari Unicode in the PDF extraction layer', async () => {
  const documentPdf = await PDFDocument.create();
  documentPdf.registerFontkit(fontkit);
  const page = documentPdf.addPage();
  const font = await embedEditorFont(documentPdf, 'Noto Sans Devanagari', 'regular');
  const text = 'क्‍ष क्‌ष ज्ञ श्र';
  await drawPdfTextForExtraction(documentPdf, page, font, text, 20, 20);
  const bytes = await documentPdf.save();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const content = await (await pdf.getPage(1)).getTextContent();
  expect(content.items.map((item) => 'str' in item ? item.str : '').join('')).toBe(text);
});

it('shapes and extracts phonetic Hindi and Nepali strings exactly', async () => {
  const texts = ['नेपाल राष्ट्र', 'क्षत्रिय', 'ज्ञान', 'कि', 'र्क', 'श्रीमान्', 'गर्न', 'क्‍ष क्‌ष ज्ञ श्र'];
  const documentPdf = await PDFDocument.create();
  documentPdf.registerFontkit(fontkit);
  const font = await embedEditorFont(documentPdf, 'Noto Serif Devanagari', 'regular');
  const metrics = await loadEditorTextMetrics('Noto Serif Devanagari', 'regular', 'Noto Sans', texts.join(' '));

  for (const text of texts) {
    const page = documentPdf.addPage([560, 100]);
    const shapedRuns = metrics.shapeTextAtSize(text, 24);
    expect(shapedRuns.every((run) => run.direction === 'ltr')).toBe(true);
    expect(shapedRuns.map((run) => run.text).join('')).toBe(text);
    drawShapedTextOutlines(page, shapedRuns, { x: 24, y: 38, color: rgb(0, 0, 0) });
    await drawPdfTextForExtraction(documentPdf, page, font, text, 24, 38);
  }

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await documentPdf.save()) }).promise;
  for (const [index, expected] of texts.entries()) {
    const page = await pdf.getPage(index + 1);
    const content = await page.getTextContent();
    expect(content.items.map((item) => 'str' in item ? item.str : '').join('')).toBe(expected);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d');
    expect(context).not.toBeNull();
    await page.render({ canvas, canvasContext: context!, viewport }).promise;
    expect(getInkBounds(canvas).darkness).toBeGreaterThan(100);
  }
});

it('resolves every glyph outline in the Devanagari fixture and reph/rakar corpus', async () => {
  const fixtureResponse = await fetch(fixtureUrl);
  expect(fixtureResponse.ok).toBe(true);
  const fixturePdf = await pdfjsLib.getDocument({
    data: new Uint8Array(await fixtureResponse.arrayBuffer()),
  }).promise;
  const fixtureParagraphs: string[] = [];
  for (let pageNumber = 1; pageNumber <= fixturePdf.numPages; pageNumber += 1) {
    const page = await fixturePdf.getPage(pageNumber);
    const content = await page.getTextContent();
    fixtureParagraphs.push(...content.items
      .filter((item): item is pdfjsLib.TextItem => 'str' in item)
      .map((item) => item.str)
      .filter((text) => text.trim().length > 0));
  }
  const corpus = [
    ...fixtureParagraphs,
    ...samples.filter(({ family }) =>
      family === 'Noto Sans Devanagari' || family === 'Noto Serif Devanagari' || family === 'Mukta')
      .map(({ text }) => text),
    typedDevanagariSentence,
    ...cheatSheetExamples.map(transliterateDevanagari),
    ...rephAndRakarWords,
  ];

  for (const { family, file } of devanagariFonts) {
    const response = await fetch(`/fonts/edit/${file}`);
    expect(response.ok, `${family} font asset should load`).toBe(true);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const sourceFont = fontkit.create(bytes);
    const shapingFont = createShapingFont(`${family}:regular`, bytes, sourceFont.characterSet);
    for (let glyphId = 0; glyphId < sourceFont.numGlyphs; glyphId += 1) {
      expect(
        () => shapingFont.font.glyphToPath(glyphId),
        `${family} outline lookup for gid ${glyphId}`,
      ).not.toThrow();
    }

    const metrics = await loadEditorTextMetrics(family, 'regular', family, corpus.join('\n'));
    for (const text of corpus) {
      const runs = metrics.shapeTextAtSize(text, 18);
      for (const run of runs) {
        expect(run.fontKey).toBe(`${family}:regular`);
        for (const glyph of run.glyphs) {
          const isLegitimatelyBlank = glyph.isJoinControlGlyph ||
            /\s/u.test(String.fromCodePoint(glyph.sourceCodePoint));
          expect(
            glyph.path.length > 0 || isLegitimatelyBlank,
            `${family}: gid ${glyph.id} for U+${glyph.sourceCodePoint.toString(16).toUpperCase()} in "${text}"`,
          ).toBe(true);
        }
      }
    }
  }
});

it('preserves phonetic input as exact Unicode in exported PDF text extraction', async () => {
  const examples = cheatSheetExamples.map(transliterateDevanagari);
  const documentPdf = await PDFDocument.create();
  documentPdf.registerFontkit(fontkit);
  const font = await embedEditorFont(documentPdf, 'Noto Sans Devanagari', 'regular');
  for (const text of examples) {
    const page = documentPdf.addPage();
    await drawPdfTextForExtraction(documentPdf, page, font, text, 20, 20);
  }
  const bytes = await documentPdf.save();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  for (const [index, expected] of examples.entries()) {
    const content = await (await pdf.getPage(index + 1)).getTextContent();
    expect(content.items.map((item) => 'str' in item ? item.str : '').join('')).toBe(expected);
  }
});

it('matches browser text rendering and preserves extracted Phase 1 and Devanagari samples', async () => {
  await Promise.all(samples.map(({ family, text }) => loadEditorPreviewFonts(family, 'regular', undefined, text)));
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
    const metrics = await loadEditorTextMetrics(family, 'regular', fallbackFamily, text);
    const page = documentPdf.addPage([2400, 140]);
    const x = 28;
    const y = 72;
    const size = 20;
    drawShapedTextOutlines(page, metrics.shapeTextAtSize(text, size), { x, y, color: rgb(0, 0, 0) });

    let textX = x;
    if (containsDevanagariText(text)) {
      await drawPdfTextForExtraction(documentPdf, page, primary, text, x, y);
    } else {
      const textFonts = [...new Set([fallback, primary])];
      for (const run of splitTextForPdfUsingFonts(text, textFonts)) {
        page.drawText(run.text, { x: textX, y, size, font: run.font, color: rgb(0, 0, 0), opacity: 0 });
        glyphChecks.push(await captureEditorGlyphCheck(
          run.font,
          run.font === primary ? family : fallbackFamily,
          'regular',
          run.text,
        ));
        textX += run.font.widthOfTextAtSize(run.text, size);
      }
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
}, 60_000);
