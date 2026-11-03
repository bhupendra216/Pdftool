import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { it } from 'node:test';
import { embedEditorFont, loadEditorTextMetrics } from './registry';

it('rejects font metrics and export embedding when a local font asset fails to load', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 404 });
  try {
    await assert.rejects(
      loadEditorTextMetrics('Noto Sans Devanagari', 'regular', 'Noto Sans', 'नमस्ते'),
      /Could not load the Noto Sans Devanagari font asset/u,
    );
    await assert.rejects(
      embedEditorFont(await PDFDocument.create(), 'Noto Sans Devanagari', 'regular'),
      /Could not load the Noto Sans Devanagari font asset/u,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
