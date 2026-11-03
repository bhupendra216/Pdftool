import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

// pdf.js expects the browser DOMMatrix API during module initialization in Node-based tests.
(globalThis as any).DOMMatrix ??= class DOMMatrix {
  constructor() {}
  scaleSelf() { return this; }
  multiplySelf() { return this; }
  translateSelf() { return this; }
  invertSelf() { return this; }
  setMatrixTransform() { return this; }
};

const { getOriginalLineMaskRect, getSafeTextGeometry, medianRgbColor, roundPdfFontSize, validateTextItemGeometry } = await import('./pdf-text-geometry');
const { groupTextItemsIntoLines, findOverlappingTextLines, groupTextLinesIntoBlocks, inferTextBlockAlignment, inferTextMargins, joinPdfTextLines } = await import('./pdf-text-lines');
const { reorderFiles } = await import('../components/shared/FilePreviewList');
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

describe('pdf text geometry validation', () => {
  it('samples the mask background using a per-channel median', () => {
    assert.equal(medianRgbColor([[0, 255, 100], [100, 0, 200], [255, 100, 0]]), '#646464');
  });

  it('detects overlap with other extracted lines while excluding the edited line', () => {
    const groups = [
      { id: 'edited', pageNumber: 1, items: [], text: 'Edit', baselineY: 100, boundingBox: { x: 20, y: 90, width: 80, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'next', pageNumber: 1, items: [], text: 'Next line', baselineY: 75, boundingBox: { x: 20, y: 65, width: 100, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    assert.deepEqual(findOverlappingTextLines([{ x: 30, y: 68, width: 70, height: 20 }], groups, 'edited').map((group) => group.id), ['next']);
  });

  it('infers page text margins from body-sized lines instead of a large title', () => {
    const margins = inferTextMargins([
      { id: 'title', pageNumber: 1, items: [], text: 'Title', baselineY: 700, boundingBox: { x: 20, y: 690, width: 560, height: 32 }, dominantFontSize: 32, runs: [] },
      { id: 'body-a', pageNumber: 1, items: [], text: 'Body A', baselineY: 650, boundingBox: { x: 48, y: 640, width: 440, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'body-b', pageNumber: 1, items: [], text: 'Body B', baselineY: 630, boundingBox: { x: 48, y: 620, width: 500, height: 12 }, dominantFontSize: 12, runs: [] },
    ]);
    assert.deepEqual(margins, { left: 48, right: 548 });
  });

  it('rounds extracted font sizes to two decimals', () => {
    assert.equal(roundPdfFontSize(23.999999), 24);
  });

  it('builds a padded mask from the original line width and baseline metrics', () => {
    assert.deepEqual(getOriginalLineMaskRect(
      { x: 20, y: 40, width: 80, height: 12 },
      50,
      10,
      { ascent: 7, descent: 3 },
      1.5,
    ), { x: 18.5, y: 45.5, width: 83, height: 13 });
  });

  it('uses conservative ascent and descent estimates when font metrics are unavailable', () => {
    assert.deepEqual(getOriginalLineMaskRect(
      { x: 20, y: 40, width: 80, height: 12 },
      50,
      10,
    ), { x: 18.5, y: 46, width: 83, height: 13.5 });
  });

  it('accepts a normal axis-aligned text item', () => {
    const item = {
      str: 'Hello',
      transform: [10, 0, 0, 10, 50, 100],
      width: 44,
      height: 12,
      fontName: 'g_d0_f1',
    };

    const styles = { g_d0_f1: {} };
    const result = validateTextItemGeometry(item, styles);

    assert.equal(result.ok, true);
    assert.equal(result.status, 'ok');
    assert.equal(result.reason, 'valid_geometry');
  });

  it('flags rotated or skewed transforms as suspect', () => {
    const item = {
      str: 'Warning',
      transform: [12, 6, 5, 10, 50, 100],
      width: 90,
      height: 14,
      fontName: 'g_d0_f1',
    };

    const result = validateTextItemGeometry(item, { g_d0_f1: {} });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'suspect');
    assert.match(result.reason, /transform_skew_or_rotation/);
  });

  it('flags a non-uniform scale transform as suspect', () => {
    const item = {
      str: 'Scaled',
      transform: [8, 0, 0, 20, 50, 100],
      width: 80,
      height: 20,
      fontName: 'g_d0_f1',
    };

    const result = validateTextItemGeometry(item, { g_d0_f1: {} });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'suspect');
    assert.match(result.reason, /non_uniform_scale/);
  });

  it('flags zero or invalid width as suspect', () => {
    const item = {
      str: 'Broken',
      transform: [1, 0, 0, 1, 50, 100],
      width: 0,
      height: 18,
      fontName: 'g_d0_f1',
    };

    const result = validateTextItemGeometry(item, { g_d0_f1: {} });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'suspect');
    assert.match(result.reason, /invalid_width/);
  });

  it('flags font names missing in the styles map and falls back to height-based geometry', () => {
    const item = {
      str: 'LESSON 3',
      transform: [80, 0, 0, 200, 50, 100],
      width: 0,
      height: 16,
      fontName: 'missingFont',
    };

    const safeGeometry = getSafeTextGeometry(item, {}, 1);
    const result = validateTextItemGeometry(item, {});

    assert.equal(result.ok, false);
    assert.equal(result.status, 'suspect');
    assert.match(result.reason, /font_missing_from_styles_map/);
    assert.equal(safeGeometry.fontSize, 16);
    assert.equal(safeGeometry.height, 16);
    assert.ok(safeGeometry.width > 0);
  });

  it('groups a multi-run line with a bold mid-line run into a single visual line', () => {
    const items = [
      { str: 'Compiler', transform: [10, 0, 0, 10, 50, 100], width: 50, height: 12, fontName: 'Helvetica', fontSize: 12 },
      { str: ' Design', transform: [10, 0, 0, 10, 105, 100], width: 42, height: 12, fontName: 'Helvetica-Bold', fontSize: 12 },
    ];

    const grouped = groupTextItemsIntoLines(items, 2);
    assert.equal(grouped.length, 1);
    assert.equal(grouped[0].text, 'Compiler Design');
    assert.ok(Math.abs(grouped[0].baselineY - 100) < 0.001);
    assert.deepEqual(grouped[0].boundingBox, { x: 50, y: 100, width: 97, height: 12 });
  });

  it('keeps a small X-gap same-line split together, and keeps distinct baselines separate', () => {
    const sameLine = [
      { str: 'Hello', transform: [10, 0, 0, 10, 50, 200], width: 30, height: 12, fontName: 'Helvetica', fontSize: 12 },
      { str: 'World', transform: [10, 0, 0, 10, 85, 200], width: 36, height: 12, fontName: 'Helvetica', fontSize: 12 },
    ];
    const differentLines = [
      { str: 'Hello', transform: [10, 0, 0, 10, 50, 200], width: 30, height: 12, fontName: 'Helvetica', fontSize: 12 },
      { str: 'World', transform: [10, 0, 0, 10, 50, 220], width: 36, height: 12, fontName: 'Helvetica', fontSize: 12 },
    ];

    const groupedSame = groupTextItemsIntoLines(sameLine, 2);
    const groupedDifferent = groupTextItemsIntoLines(differentLines, 2);

    assert.equal(groupedSame.length, 1);
    assert.equal(groupedDifferent.length, 2);
  });

  it('handles a single run without regression', () => {
    const items = [
      { str: 'Introduction', transform: [12, 0, 0, 12, 20, 50], width: 120, height: 18, fontName: 'Helvetica', fontSize: 12 },
    ];

    const grouped = groupTextItemsIntoLines(items, 2);
    assert.equal(grouped.length, 1);
    assert.equal(grouped[0].text, 'Introduction');
  });

  it('groups normalized editor text items by their PDF positions and text values', () => {
    const items = [
      { text: 'First line', pdfX: 50, pdfY: 200, width: 60, height: 12, fontSize: 12 },
      { text: 'Second line', pdfX: 50, pdfY: 180, width: 70, height: 12, fontSize: 12 },
    ];

    const grouped = groupTextItemsIntoLines(items, 2);
    assert.equal(grouped.length, 2);
    assert.deepEqual(grouped.map((group) => group.text), ['First line', 'Second line']);
    assert.deepEqual(grouped.map((group) => group.baselineY), [200, 180]);
    assert.deepEqual(grouped.map((group) => group.boundingBox), [
      { x: 50, y: 200, width: 60, height: 12 },
      { x: 50, y: 180, width: 70, height: 12 },
    ]);
  });

  it('builds identical top-to-bottom lines from shuffled and reversed item streams', () => {
    const items = [
      { str: 'First', pdfX: 30, pdfY: 200, topLeftX: 30, topLeftY: 100, width: 28, height: 12, fontSize: 12 },
      { str: 'Second', pdfX: 30, pdfY: 180, topLeftX: 30, topLeftY: 120, width: 36, height: 12, fontSize: 12 },
      { str: ' line', pdfX: 61, pdfY: 200, topLeftX: 61, topLeftY: 100, width: 26, height: 12, fontSize: 12 },
    ];
    const expected = groupTextItemsIntoLines(items).map((group) => group.text);
    assert.deepEqual(expected, ['First line', 'Second']);
    assert.deepEqual(groupTextItemsIntoLines([...items].reverse()).map((group) => group.text), expected);
    assert.deepEqual(groupTextItemsIntoLines([items[1], items[2], items[0]]).map((group) => group.text), expected);
  });

  it('inserts word spaces by font-relative gaps without spacing touching punctuation or clusters', () => {
    const items = [
      { str: 'से', pdfX: 80, pdfY: 100, topLeftY: 100, width: 12, height: 12, fontSize: 12 },
      { str: '१५', pdfX: 10, pdfY: 100, topLeftY: 100, width: 16, height: 12, fontSize: 12 },
      { str: 'कु', pdfX: 10, pdfY: 80, topLeftY: 120, width: 14, height: 12, fontSize: 12 },
      { str: ',', pdfX: 26, pdfY: 100, topLeftY: 100, width: 2, height: 12, fontSize: 12 },
      { str: '०००', pdfX: 28, pdfY: 100, topLeftY: 100, width: 18, height: 12, fontSize: 12 },
      { str: 'मनुष्य', pdfX: 50, pdfY: 100, topLeftY: 100, width: 28, height: 12, fontSize: 12 },
      { str: 'त्ते', pdfX: 24, pdfY: 80, topLeftY: 120, width: 16, height: 12, fontSize: 12 },
    ];
    const groups = groupTextItemsIntoLines(items);
    assert.deepEqual(groups.map((group) => group.text), ['१५,००० मनुष्य से', 'कुत्ते']);
  });

  it('joins paragraph lines with one space and keeps list items in separate blocks', () => {
    const lines = [
      { id: 'one', pageNumber: 1, items: [], text: 'First line', baselineY: 200, topLeftY: 100, boundingBox: { x: 50, y: 190, width: 80, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'two', pageNumber: 1, items: [], text: 'second line', baselineY: 186, topLeftY: 114, boundingBox: { x: 50, y: 176, width: 80, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    assert.equal(joinPdfTextLines(lines), 'First line second line');

    const listLines = [
      ...lines,
      { id: 'bullet-a', pageNumber: 1, items: [], text: '• One', baselineY: 172, topLeftY: 128, boundingBox: { x: 50, y: 162, width: 50, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'bullet-b', pageNumber: 1, items: [], text: '• Two', baselineY: 158, topLeftY: 142, boundingBox: { x: 50, y: 148, width: 50, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    assert.deepEqual(groupTextLinesIntoBlocks(listLines).map((block) => block.groups.map((group) => group.id)), [
      ['one', 'two'],
      ['bullet-a'],
      ['bullet-b'],
    ]);
  });

  it('joins the supplied first-paragraph fixture text with exact Unicode code points', () => {
    const expected = 'कुत्ते १५,००० से भी अधिक वर्षों से मनुष्य के साथ रहते आए हैं, किसी भी अन्य पालतू जानवर से अधिक समय से। इस दौरान वे रखवाले, शिकारी, चरवाहे और सबसे बढ़कर साथी बन गए। बहुत कम प्राणियों ने मानव इतिहास को इतनी शांति और इतनी वफ़ादारी से आकार दिया है।';
    const groups = [
      'कुत्ते १५,००० से भी अधिक वर्षों से मनुष्य के साथ रहते आए हैं,',
      'किसी भी अन्य पालतू जानवर से अधिक समय से। इस दौरान वे रखवाले,',
      'शिकारी, चरवाहे और सबसे बढ़कर साथी बन गए। बहुत कम प्राणियों ने',
      'मानव इतिहास को इतनी शांति और इतनी वफ़ादारी से आकार दिया है।',
    ].map((text, index) => ({
      id: `expected-${index}`,
      pageNumber: 1,
      items: [],
      text,
      baselineY: 100 - index * 14,
      topLeftY: index * 14,
      boundingBox: { x: 20, y: 90 - index * 14, width: 300, height: 12 },
      dominantFontSize: 12,
      runs: [],
    }));
    const joined = joinPdfTextLines(groups);
    assert.equal(joined, expected);
    assert.deepEqual([...joined].map((character) => character.codePointAt(0)), [...expected].map((character) => character.codePointAt(0)));
  });

  it('orders the fixture text by page geometry instead of PDF.js content-stream order', async () => {
    const bytes = new Uint8Array(readFileSync(new URL('../../test-fixtures/dogs-devanagari-clean.pdf', import.meta.url)));
    const loadingTask = pdfjsLib.getDocument({ data: bytes, useSystemFonts: true });
    const document = await loadingTask.promise;
    try {
      const page = await document.getPage(1);
      const content = await page.getTextContent();
      const items = content.items.filter((item): item is typeof item & { str: string; transform: number[] } =>
        'str' in item && item.str.trim().length > 0).map((item) => ({
        str: item.str,
        pdfX: item.transform[4],
        pdfY: item.transform[5],
        topLeftX: item.transform[4],
        topLeftY: -item.transform[5],
        width: item.width,
        height: item.height,
        fontSize: item.height,
      }));
      const lines = groupTextItemsIntoLines(items);
      assert.equal(items[0].str, 'Dogs in Devanagari Fonts');
      assert.ok(items[0].pdfY > items.at(-1)!.pdfY);
      assert.deepEqual(lines.map((line) => line.text), [...lines]
        .sort((left, right) => (left.topLeftY ?? 0) - (right.topLeftY ?? 0))
        .map((line) => line.text));
      const firstBody = groupTextLinesIntoBlocks(lines)
        .find((block) => block.groups.some((line) => line.text.startsWith('कुƺे')));
      assert.equal(firstBody?.groups.length, 3);
      const fixtureBlocks = groupTextLinesIntoBlocks(lines);
      for (const prefix of ['कुƺे', 'कुकुरको वफादार', 'कुकुरको सँघै', 'ˀिʚय']) {
        const block = fixtureBlocks.find((candidate) =>
          candidate.groups.some((line) => line.text.startsWith(prefix)));
        assert.ok(block, `fixture block ${prefix} exists`);
        assert.equal(block.alignment, 'left', `${prefix} shares a common left edge`);
        assert.ok(block.groups.every((line) => Math.abs(line.boundingBox.x - block.boundingBox.x) < 0.5));
      }
    } finally {
      await loadingTask.destroy();
    }
  });

  it('keeps an indented first line and body lines in one block', () => {
    const groups = [
      { id: 'first', pageNumber: 1, items: [], text: 'Indented', baselineY: 100, boundingBox: { x: 70, y: 90, width: 280, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'second', pageNumber: 1, items: [], text: 'Body line', baselineY: 114, boundingBox: { x: 50, y: 104, width: 330, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    const blocks = groupTextLinesIntoBlocks(groups);
    assert.equal(blocks.length, 1);
    assert.deepEqual(blocks[0].groups.map((group) => group.id), ['second', 'first']);
  });

  it('keeps centered lines together and separates a differently sized heading', () => {
    const groups = [
      { id: 'heading', pageNumber: 1, items: [], text: 'Heading', baselineY: 60, boundingBox: { x: 180, y: 48, width: 140, height: 20 }, dominantFontSize: 20, runs: [] },
      { id: 'center-a', pageNumber: 1, items: [], text: 'Centered one', baselineY: 100, boundingBox: { x: 130, y: 90, width: 240, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'center-b', pageNumber: 1, items: [], text: 'Centered two', baselineY: 114, boundingBox: { x: 150, y: 104, width: 200, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    const blocks = groupTextLinesIntoBlocks(groups);
    assert.equal(blocks.length, 2);
    assert.deepEqual(blocks.find((block) => block.groups.some((group) => group.id === 'center-a'))?.groups.map((group) => group.id), ['center-b', 'center-a']);
    assert.equal(blocks.find((block) => block.groups.some((group) => group.id === 'center-a'))?.alignment, 'center');
  });

  it('infers alignment from every line in a block, including indents and justified lines', () => {
    const makeGroup = (id: string, x: number, right: number, y: number) => ({
      id,
      pageNumber: 1,
      items: [],
      text: id,
      baselineY: 100 - y,
      topLeftY: y,
      boundingBox: { x, y: 90 - y, width: right - x, height: 12 },
      dominantFontSize: 12,
      runs: [],
    });

    assert.equal(inferTextBlockAlignment([
      makeGroup('left-indented', 78, 240, 0),
      makeGroup('left-body-a', 68, 310, 14),
      makeGroup('left-body-b', 68, 265, 28),
    ]), 'left');
    assert.equal(inferTextBlockAlignment([
      makeGroup('right-a', 110, 340, 0),
      makeGroup('right-b', 90, 340, 14),
      makeGroup('right-c', 68, 340, 28),
    ]), 'right');
    assert.equal(inferTextBlockAlignment([
      makeGroup('center-a', 110, 290, 0),
      makeGroup('center-b', 90, 310, 14),
      makeGroup('center-c', 68, 332, 28),
    ]), 'center');
    assert.equal(inferTextBlockAlignment([
      makeGroup('justify-a', 68, 340, 0),
      makeGroup('justify-b', 68, 340, 14),
      makeGroup('justify-last', 68, 210, 28),
    ]), 'justified');
    assert.equal(inferTextBlockAlignment([makeGroup('single', 68, 210, 0)]), 'left');
  });

  it('uses the longest line edge for a block rectangle', () => {
    const groups = [
      { id: 'short', pageNumber: 1, items: [], text: 'Short last line', baselineY: 100, boundingBox: { x: 50, y: 90, width: 120, height: 12 }, dominantFontSize: 12, runs: [] },
      { id: 'long', pageNumber: 1, items: [], text: 'The longest line reaches the paragraph margin', baselineY: 114, boundingBox: { x: 50, y: 104, width: 360, height: 12 }, dominantFontSize: 12, runs: [] },
    ];
    const block = groupTextLinesIntoBlocks(groups)[0];
    assert.equal(block.boundingBox.x, 50);
    assert.equal(block.boundingBox.x + block.boundingBox.width, 410);
    assert.ok(block.groups.every((group) =>
      group.boundingBox.x >= block.boundingBox.x &&
      group.boundingBox.x + group.boundingBox.width <= block.boundingBox.x + block.boundingBox.width));
  });

  it('moves the full file object together when the drag order changes', () => {
    const first = new File(['first'], 'first.pdf', { type: 'application/pdf' });
    const second = new File(['second'], 'second.pdf', { type: 'application/pdf' });
    const third = new File(['third'], 'third.pdf', { type: 'application/pdf' });

    const reordered = reorderFiles([first, second, third], 2, 0);

    assert.deepEqual(reordered.map((file) => file.name), ['third.pdf', 'first.pdf', 'second.pdf']);
    assert.equal(reordered[0], third);
    assert.equal(reordered[1], first);
    assert.equal(reordered[2], second);
  });
});
