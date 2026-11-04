import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { describe, it } from 'node:test';
import { assertEditorFontCoverage, detectEditorFont, embedEditorFont, FONT_MENU_GROUP_ORDER, FONT_REGISTRY, getEditorFontCoverageWarning, getSuggestedDevanagariFont, isLegacyDevanagariFontName, loadEditorTextMetrics, looksLikeLegacyDevanagariText, normalizePdfFontName, resolveDevanagariEditorFont, resolveEditorFontFamily, splitTextForPdf, type EditorFontFamily, type FontVariant } from './registry';
import { getGraphemeBoundaries, getGraphemeSegments, nearestGraphemeBoundary } from './text-shaping';

const fontAssetDirectory = new URL('../../../public/fonts/edit/', import.meta.url);

async function withFontAssetFetch<T>(run: () => Promise<T>) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const filename = new URL(String(input), 'http://localhost').pathname.split('/').at(-1) ?? '';
    const bytes = readFileSync(fileURLToPath(new URL(filename, fontAssetDirectory)));
    return new Response(bytes);
  }) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

describe('Edit PDF font detection', () => {
  it('normalizes subset font names and maps legacy Devanagari family names to real bundled fonts', () => {
    assert.equal(normalizePdfFontName('ABCDEF+NotoSansDevanagari-Bold'), 'notosansdevanagari');
    assert.equal(resolveDevanagariEditorFont('NotoSansDevanagari-Regular-9668').status, 'detected');
    assert.equal(getSuggestedDevanagariFont('Mangal'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Nirmala UI'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Kalimati'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Sagarmatha'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Arial Unicode MS'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Sakal Bharati'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Lohit Devanagari'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Gargi'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Samanata'), 'Noto Sans Devanagari');
    assert.equal(getSuggestedDevanagariFont('Noto Serif Devanagari'), 'Noto Serif Devanagari');
    assert.equal(getSuggestedDevanagariFont('Kokila'), 'Noto Serif Devanagari');
    assert.equal(getSuggestedDevanagariFont('Aparajita'), 'Noto Serif Devanagari');
    assert.equal(getSuggestedDevanagariFont('Sanskrit Text'), 'Noto Serif Devanagari');
    assert.equal(getSuggestedDevanagariFont('Utsaah'), 'Mukta');
    assert.equal(getSuggestedDevanagariFont('Unrecognized', { isSerifFont: true }), 'Noto Serif Devanagari');
    assert.equal(getSuggestedDevanagariFont('Unrecognized'), 'Noto Sans Devanagari');
    for (const name of ['Preeti', 'Kantipur', 'Himali', 'Kruti Dev', 'DevLys', 'Chanakya', 'Shusha']) {
      assert.equal(isLegacyDevanagariFontName(name), true, name);
    }
  });

  it('distinguishes English text from legacy-font Latin gibberish', () => {
    assert.equal(looksLikeLegacyDevanagariText('Damaged line Second intact line Third intact line'), false);
    assert.equal(looksLikeLegacyDevanagariText('kfnl sfkf no sfof no'), true);
  });

  it('orders the font menu and excludes removed script groups', () => {
    assert.deepEqual(FONT_MENU_GROUP_ORDER.slice(0, 3), [
      'Compatible',
      'Devanagari (Hindi, Nepali, Marathi)',
      'Broad coverage',
    ]);
    assert.equal(FONT_REGISTRY.length, 19);
    assert.ok(FONT_REGISTRY.every((font) => !['Hebrew', 'Georgian', 'Armenian'].includes(font.group)));
  });

  it('maps an obsolete saved family id to Arial', () => {
    assert.deepEqual(resolveEditorFontFamily('retired-font-id'), {
      family: 'Liberation Sans',
      usedFallback: true,
    });
    assert.equal(detectEditorFont('Noto Sans retired').font, 'Liberation Sans');
  });

  it('loads every bundled family and style variant', async () => {
    await withFontAssetFetch(async () => {
      const variants: FontVariant[] = ['regular', 'bold', 'italic', 'boldItalic'];
      for (const { family } of FONT_REGISTRY) {
        for (const variant of variants) {
          const metrics = await loadEditorTextMetrics(family, variant);
          assert.ok(metrics.widthOfTextAtSize('PDF', 12) > 0, `${family} ${variant}`);
        }
      }
    });
  });

  it('prefers PDF descriptor family flags for unknown names', () => {
    const result = detectEditorFont('EmbeddedFont-XY12', { descriptor: { flags: 2 } });
    assert.equal(result.font, 'Liberation Serif');
    assert.equal(result.status, 'fallback');
    assert.match(result.label, /PDF font flags/);
  });

  it('uses monospace flags before unknown serif name hints', () => {
    const result = detectEditorFont('Unknown Garamond', { isMonospace: true });
    assert.equal(result.font, 'Liberation Mono');
    assert.match(result.label, /PDF font flags/);
  });

  it('uses serif and monospace keywords when descriptor family flags are absent', () => {
    assert.equal(detectEditorFont('Unknown Garamond').font, 'Liberation Serif');
    assert.equal(detectEditorFont('Unknown Consolas').font, 'Liberation Mono');
  });

  it('retains bold and italic flags while selecting a fallback family', () => {
    const result = detectEditorFont('EmbeddedFont', { descriptorFlags: 262208 });
    assert.equal(result.font, 'Liberation Sans');
    assert.equal(result.bold, true);
    assert.equal(result.italic, true);
    assert.match(result.label, /PDF font style flags/);
  });

  it('matches preview and embedded widths for Montserrat and Roboto', async () => {
    await withFontAssetFetch(async () => {
      for (const family of ['Montserrat', 'Roboto'] as const satisfies EditorFontFamily[]) {
        const metrics = await loadEditorTextMetrics(family, 'regular');
        const document = await PDFDocument.create();
        const font = await embedEditorFont(document, family, 'regular');
        const previewWidth = metrics.widthOfTextAtSize('PDFKira editor', 24);
        const exportWidth = font.widthOfTextAtSize('PDFKira editor', 24);
        assert.ok(Math.abs(previewWidth - exportWidth) / exportWidth < 0.01);
      }
    });
  });

  it('exports characters unsupported by the selected font with Noto Sans fallback', async () => {
    await withFontAssetFetch(async () => {
      const document = await PDFDocument.create();
      const primary = await embedEditorFont(document, 'Montserrat', 'regular');
      const fallback = await embedEditorFont(document, 'Noto Sans', 'regular');
      const runs = splitTextForPdf('Title \u2000 text', primary, fallback);
      assert.ok(runs.some((run) => run.font === fallback));
      const page = document.addPage();
      let x = 40;
      for (const run of runs) {
        page.drawText(run.text, { x, y: 700, size: 18, font: run.font });
        x += run.font.widthOfTextAtSize(run.text, 18);
      }
      const bytes = await document.save();
      assert.ok(bytes.byteLength > 0);
    });
  });

  it('warns and blocks export for unsupported script text without throwing while measuring', async () => {
    await withFontAssetFetch(async () => {
      const text = 'שלום עולם · გამარჯობა · Բարեւ աշխարհ';
      const metrics = await loadEditorTextMetrics('Liberation Sans', 'regular', 'Noto Sans', text);
      assert.doesNotThrow(() => metrics.measureTextAtSize(text, 18));
      assert.doesNotThrow(() => metrics.shapeTextAtSize(text, 18));
      assert.match(getEditorFontCoverageWarning('Liberation Sans', [...text], false) ?? '', /not supported yet/u);
      assert.throws(
        () => assertEditorFontCoverage(metrics, 'Liberation Sans', 'Noto Sans', text),
        /Hebrew script is not supported yet/u,
      );
    });
  });

  it('shapes mixed Latin and Devanagari runs, including digits, punctuation, and join controls', async () => {
      await withFontAssetFetch(async () => {
        const text = 'Kathmandu काठमाडौं 2082, क्ष ज्ञ श्र क्‍ष क्‌ष';
        const metrics = await loadEditorTextMetrics('Noto Sans', 'regular', 'Noto Sans', text);
        const runs = metrics.shapeTextAtSize(text, 18);

        assert.ok(runs.some((run) => run.script === 'Latin' && /Kathmandu/u.test(run.text)));
        assert.ok(runs.some((run) => run.script === 'Devanagari' && /काठमाडौं/u.test(run.text)));
        assert.ok(runs.some((run) => run.script === 'Devanagari' && /2082/u.test(run.text)));
        assert.ok(runs.filter((run) => run.script === 'Devanagari').every((run) => run.direction === 'ltr'));
        assert.ok(runs.some((run) => /क्‍ष/u.test(run.text)));
        assert.ok(runs.some((run) => /क्‌ष/u.test(run.text)));
        assert.equal(metrics.missingCharacters(text).length, 0);
      });
  });

  it('does not split Devanagari grapheme clusters when wrapping long words', () => {
      assert.deepEqual(getGraphemeSegments('क्ष ज्ञ श्र'), ['क्ष', ' ', 'ज्ञ', ' ', 'श्र']);
      assert.deepEqual(getGraphemeBoundaries('क्ष ज्ञ'), [0, 3, 4, 7]);
      assert.equal(nearestGraphemeBoundary('क्ष ज्ञ', 2), 3);
  });

  it('reports unsupported text instead of silently accepting missing glyphs', async () => {
      await withFontAssetFetch(async () => {
        const metrics = await loadEditorTextMetrics('Mukta', 'regular', 'Noto Sans', 'नमस्ते🙂');
        assert.ok(metrics.missingCharacters('नमस्ते🙂').includes('🙂'));
    });
  });
});