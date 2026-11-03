import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  assertEditorFontCoverage,
  getEditorFontCoverageWarning,
  loadEditorTextMetrics,
} from './registry';
import { getUnsupportedScriptCharacters } from './text-shaping';

const fontAssetDirectory = new URL('../../../public/fonts/edit/', import.meta.url);

async function withFontAssetFetch<T>(run: () => Promise<T>) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const filename = new URL(String(input), 'http://localhost').pathname.split('/').at(-1) ?? '';
    return new Response(readFileSync(fileURLToPath(new URL(filename, fontAssetDirectory))));
  }) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

describe('Edit PDF unsupported script coverage', () => {
  const samples = [
    ['Hebrew', 'שלום עולם'],
    ['Georgian', 'გამარჯობა'],
    ['Armenian', 'Բարեւ աշխարհ'],
  ] as const;

  it('identifies script characters and never throws during measurement or shaping', async () => {
    await withFontAssetFetch(async () => {
      const metrics = await loadEditorTextMetrics('Liberation Sans', 'regular', 'Noto Sans');
      for (const [script, text] of samples) {
        const characters = getUnsupportedScriptCharacters(text);
        assert.equal(characters[0]?.script, script);
        assert.ok(metrics.measureTextAtSize(text, 18).width > 0);
        assert.doesNotThrow(() => metrics.widthOfTextAtSize(text, 18));
        assert.doesNotThrow(() => metrics.shapeTextAtSize(text, 18));
        assert.match(getEditorFontCoverageWarning('Liberation Sans', [...text], false) ?? '', /not supported yet/u);
        assert.throws(
          () => assertEditorFontCoverage(metrics, 'Liberation Sans', 'Noto Sans', text),
          new RegExp(`${script} script is not supported yet`, 'u'),
        );
      }
    });
  });
});
