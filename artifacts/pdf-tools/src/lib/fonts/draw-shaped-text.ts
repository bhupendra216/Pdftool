import svgpath from 'svgpath';
import type { Color, PDFPage } from 'pdf-lib';
import type { ShapedTextRun } from './text-shaping';

export function drawShapedTextOutlines(
  page: PDFPage,
  runs: ShapedTextRun[],
  options: { x: number; y: number; color: Color },
) {
  let runX = options.x;
  for (const run of runs) {
    let glyphX = runX;
    for (const glyph of run.glyphs) {
      if (glyph.path) {
        const path = svgpath(glyph.path)
          .scale(run.scale, -run.scale)
          .translate(glyphX + glyph.xOffset, -(options.y + glyph.yOffset))
          .toString();
        page.drawSvgPath(path, { x: 0, y: 0, color: options.color });
      } else if (glyph.id === 0 || !/\s/u.test(String.fromCodePoint(glyph.sourceCodePoint))) {
        throw new Error(`Could not draw the outline for U+${glyph.sourceCodePoint.toString(16).toUpperCase()}.`);
      }
      glyphX += glyph.xAdvance;
    }
    runX += run.advanceWidth;
  }
  return runX - options.x;
}
