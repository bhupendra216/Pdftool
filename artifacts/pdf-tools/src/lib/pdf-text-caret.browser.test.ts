import { expect, it } from 'vitest';
import { getGraphemeBoundaries, getShapedCaretStops, nearestShapedCaretStop } from './fonts/text-shaping';
import { loadEditorPreviewFonts, loadEditorTextMetrics, type EditorFontFamily } from './fonts/registry';

const samples = [
  'कि',
  'क्षत्रिय',
  'श्रीमान्',
  'र्क',
  'गर्न',
  'त्येसाइले म के भन्छु भने',
  'कुत्ते १५,००० से भी अधिक वर्षों से मनुष्य के साथ रहते आए हैं, किसी भी अन्य पालतू जानवर से अधिक समय से। इस दौरान वे रखवाले, शिकारी, चरवाहे और सबसे बढ़कर साथी बन गए। बहुत कम प्राणियों ने मानव इतिहास को इतनी शांति और इतनी वफ़ादारी से आकार दिया है।',
];
const families: EditorFontFamily[] = ['Noto Sans Devanagari', 'Noto Serif Devanagari', 'Mukta'];

it('keeps Devanagari caret stops aligned with shaped advances across all supported fonts', async () => {
  for (const family of families) {
    await loadEditorPreviewFonts(family, 'regular', family, samples.join(' '));
    const metrics = await loadEditorTextMetrics(family, 'regular', family, samples.join(' '));
    for (const text of samples) {
      const size = 12;
      const shaped = metrics.shapeTextAtSize(text, size);
      const stops = getShapedCaretStops(text, shaped);
      const element = document.createElement('div');
      element.contentEditable = 'true';
      element.textContent = text;
      Object.assign(element.style, {
        position: 'fixed',
        left: '24px',
        top: '24px',
        width: '12000px',
        whiteSpace: 'pre',
        overflowWrap: 'normal',
        fontFamily: `"${family}"`,
        fontSize: '12pt',
        fontKerning: 'normal',
        fontVariantLigatures: 'normal',
        lineHeight: '19.8pt',
      });
      document.body.append(element);
      await document.fonts.ready;
      const textNode = element.firstChild;
      if (!textNode) throw new Error('The caret probe text node is missing.');
      const range = document.createRange();

      try {
        let previousX = Number.NEGATIVE_INFINITY;
        for (const boundary of getGraphemeBoundaries(text)) {
          range.setStart(textNode, boundary);
          range.collapse(true);
          const actualX = range.getBoundingClientRect().left;
          const expected = stops.find((stop) => stop.offset === boundary);
          if (!expected) throw new Error(`${family}: missing shaped stop for offset ${boundary} in ${text}.`);
          expect(actualX).toBeGreaterThanOrEqual(previousX);
          previousX = actualX;
          expect(
            Math.abs(actualX - (24 + expected.x * 4 / 3)),
            `${family}: caret at ${boundary} in ${text}`,
          ).toBeLessThanOrEqual(0.5 * 4 / 3);
        }

        range.setStart(textNode, text.length);
        range.collapse(true);
        const endCaretX = range.getBoundingClientRect().left;
        const advanceWidth = shaped.reduce((width, run) => width + run.advanceWidth, 0);
        expect(Math.abs(endCaretX - (24 + advanceWidth * 4 / 3)), `${family}: end caret for ${text}`)
          .toBeLessThanOrEqual(0.5 * 4 / 3);

        for (let index = 1; index < stops.length; index += 1) {
          const midpoint = (stops[index - 1].x + stops[index].x) / 2;
          const nearest = nearestShapedCaretStop(stops, midpoint);
          expect([stops[index - 1].offset, stops[index].offset]).toContain(nearest.offset);
        }
      } finally {
        element.remove();
      }
    }
  }
}, 60_000);
