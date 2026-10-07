import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pdfToViewport, viewportToPdf } from './pdf-coords';

describe('shared PDF coordinate conversions', () => {
  it('round-trips top-left viewport rectangles through PDF user space', () => {
    const viewport = {
      convertToPdfPoint: (x: number, y: number) => [x, 800 - y],
      convertToViewportPoint: (x: number, y: number) => [x, 800 - y],
    };
    const pdfRect = viewportToPdf(viewport, 44, 91, 180, 24);
    assert.deepEqual(pdfRect, { x: 44, y: 685, width: 180, height: 24 });
    assert.deepEqual(pdfToViewport(viewport, pdfRect), { x: 44, y: 91, width: 180, height: 24 });
  });

  it('uses the viewport rectangle conversion when the PDF.js viewport provides it', () => {
    let called = false;
    const viewport = {
      convertToPdfPoint: (x: number, y: number) => [x, y],
      convertToViewportPoint: (x: number, y: number) => [x * 2, y * 2],
      convertToViewportRectangle: (rect: [number, number, number, number]) => {
        called = true;
        return rect.map((value) => value * 2);
      },
    };
    assert.deepEqual(pdfToViewport(viewport, { x: 10, y: 20, width: 5, height: 8 }), {
      x: 20, y: 40, width: 10, height: 16,
    });
    assert.equal(called, true);
  });
});
