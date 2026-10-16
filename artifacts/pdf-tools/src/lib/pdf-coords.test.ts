import { getPdfViewportBounds, pdfToViewport, viewportToPdf } from './pdf-coords';
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

  it('converts all rectangle corners for rotated pages and crop-box offsets', () => {
    const viewport = {
      width: 200,
      height: 300,
      convertToPdfPoint: (x: number, y: number) => [100 + y, 200 - x],
      convertToViewportPoint: (x: number, y: number) => [200 - y, x - 100],
    };
    assert.deepEqual(viewportToPdf(viewport, 10, 20, 30, 40), {
      x: 120, y: 160, width: 40, height: 30,
    });
    assert.deepEqual(pdfToViewport(viewport, { x: 120, y: 160, width: 40, height: 30 }), {
      x: 10, y: 20, width: 30, height: 40,
    });
    assert.deepEqual(getPdfViewportBounds(viewport), {
      x: 100, y: 0, width: 300, height: 200,
    });
  });
});
