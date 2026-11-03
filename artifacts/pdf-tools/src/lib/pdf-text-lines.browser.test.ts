import { expect, it } from 'vitest';
import * as pdfjsLib from 'pdfjs-dist';
import fixtureUrl from '../../test-fixtures/dogs-devanagari-clean.pdf?url';
import { groupTextItemsIntoLines, groupTextLinesIntoBlocks, inferTextBlockAlignment, inferWordSpaceGapThreshold } from './pdf-text-lines';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

function line(id: string, left: number, right: number, top: number) {
  return {
    id,
    pageNumber: 1,
    items: [],
    text: id,
    baselineY: 100 - top,
    topLeftY: top,
    boundingBox: { x: left, y: 90 - top, width: right - left, height: 12 },
    dominantFontSize: 12,
    runs: [],
  };
}

it('infers left, right, centered, justified, and indented blocks from all line edges', () => {
  expect(inferTextBlockAlignment([
    line('left-first-indent', 78, 240, 0),
    line('left-next-a', 68, 310, 14),
    line('left-next-b', 68, 265, 28),
  ])).toBe('left');
  expect(inferTextBlockAlignment([
    line('right-a', 110, 340, 0),
    line('right-b', 90, 340, 14),
    line('right-c', 68, 340, 28),
  ])).toBe('right');
  expect(inferTextBlockAlignment([
    line('center-a', 110, 290, 0),
    line('center-b', 90, 310, 14),
    line('center-c', 68, 332, 28),
  ])).toBe('center');
  expect(inferTextBlockAlignment([
    line('justify-a', 68, 340, 0),
    line('justify-b', 68, 340, 14),
    line('justify-last', 68, 210, 28),
  ])).toBe('justified');
  expect(inferTextBlockAlignment([line('single', 68, 210, 0)])).toBe('left');
});

it('calibrates Nepali word spacing from within-word and between-word gaps without splitting glyph clusters', () => {
  const items = [
    { str: 'सु', pdfX: 0, pdfY: 100, width: 10, height: 12, fontSize: 12 },
    { str: 'दी', pdfX: 10.1, pdfY: 100, width: 10, height: 12, fontSize: 12 },
    { str: 'साथी', pdfX: 24.1, pdfY: 100, width: 20, height: 12, fontSize: 12 },
  ];
  const threshold = inferWordSpaceGapThreshold(items);
  expect(threshold.medianWithinWordGapEm).toBeCloseTo(0.0083, 3);
  expect(threshold.medianBetweenWordGapEm).toBeCloseTo(0.3333, 3);
  expect(threshold.thresholdEm).toBeGreaterThan(threshold.medianWithinWordGapEm!);
  expect(threshold.thresholdEm).toBeLessThan(threshold.medianBetweenWordGapEm!);
  const [lineGroup] = groupTextItemsIntoLines(items);
  expect(lineGroup.text).toBe('सुदी साथी');

  const joinedConjunct = groupTextItemsIntoLines([
    { str: 'क्', pdfX: 0, pdfY: 100, width: 10, height: 12, fontSize: 12 },
    { str: 'ष', pdfX: 16, pdfY: 100, width: 10, height: 12, fontSize: 12 },
  ]);
  expect(joinedConjunct[0].text).toBe('क्ष');
});

it('infers each Devanagari fixture paragraph as left-aligned', async () => {
  const response = await fetch(fixtureUrl);
  expect(response.ok).toBe(true);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const document = await loadingTask.promise;

  try {
    const page = await document.getPage(1);
    const content = await page.getTextContent();
    const items = content.items
      .filter((item): item is typeof item & { str: string; transform: number[] } =>
        'str' in item && item.str.trim().length > 0)
      .map((item) => ({
        str: item.str,
        pdfX: item.transform[4],
        pdfY: item.transform[5],
        topLeftX: item.transform[4],
        topLeftY: -item.transform[5],
        width: item.width,
        height: item.height,
        fontSize: item.height,
      }));
    const blocks = groupTextLinesIntoBlocks(groupTextItemsIntoLines(items));

    for (const prefix of ['कुƺे', 'कुकुरको वफादार', 'कुकुरको सँघै', 'ˀिʚय']) {
      const block = blocks.find((candidate) =>
        candidate.groups.some((group) => group.text.startsWith(prefix)));
      expect(block, `fixture paragraph ${prefix}`).toBeDefined();
      expect(block?.alignment, `fixture paragraph ${prefix}`).toBe('left');
      expect(block?.groups.every((group) =>
        Math.abs(group.boundingBox.x - block.boundingBox.x) <= 0.5)).toBe(true);
    }
  } finally {
    await loadingTask.destroy();
  }
}, 60_000);
