import assert from 'node:assert/strict';
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

const { getSafeTextGeometry, validateTextItemGeometry } = await import('./pdf-text-geometry');
const { groupTextItemsIntoLines } = await import('../pages/edit-pdf-mvp');
const { reorderFiles } = await import('../components/shared/FilePreviewList');

describe('pdf text geometry validation', () => {
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
    assert.deepEqual(grouped.map((group) => group.text), ['Second line', 'First line']);
    assert.deepEqual(grouped.map((group) => group.baselineY), [180, 200]);
    assert.deepEqual(grouped.map((group) => group.boundingBox), [
      { x: 50, y: 180, width: 70, height: 12 },
      { x: 50, y: 200, width: 60, height: 12 },
    ]);
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
