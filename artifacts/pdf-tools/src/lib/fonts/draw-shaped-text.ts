import svgpath from 'svgpath';
import type { Color, PDFPage } from 'pdf-lib';
import { getUnreadableTextContext } from '../pdf-text-sanitize';
import { UnrenderableGlyphError, type ShapedTextRun } from './text-shaping';

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
      } else if (glyph.id !== 0 && glyph.id !== 1 && !glyph.isJoinControlGlyph &&
        glyph.sourceCodePoint !== 0 && !/\s/u.test(String.fromCodePoint(glyph.sourceCodePoint))) {
        const starts = [...new Set(run.glyphs.map((item) => item.cluster))].sort((left, right) => left - right);
        const clusterIndex = starts.indexOf(glyph.cluster);
        const clusterEnd = starts[clusterIndex + 1] ?? run.text.length;
        const clusterText = run.text.slice(glyph.cluster, clusterEnd);
        throw new UnrenderableGlyphError(
          glyph.id,
          glyph.sourceCodePoint,
          getUnreadableTextContext(run.text, glyph.cluster, clusterEnd),
          clusterText,
        );
      }
      glyphX += glyph.xAdvance;
    }
    runX += run.advanceWidth;
  }
  return runX - options.x;
}
