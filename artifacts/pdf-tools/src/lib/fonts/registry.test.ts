import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import { describe, it } from 'node:test';
import { detectEditorFont, embedEditorFont, FONT_REGISTRY, loadEditorTextMetrics, splitTextForPdf, type EditorFontFamily, type FontVariant } from './registry';

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
});