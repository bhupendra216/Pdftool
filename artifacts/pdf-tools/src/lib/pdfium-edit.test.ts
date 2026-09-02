import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPdfiumSupportInfo, createPdfEditSession } from './pdfium-edit';

describe('pdfium edit support', () => {
  it('reports the browser-side PDFium capabilities', () => {
    const support = getPdfiumSupportInfo();

    assert.equal(support.hasPdfiumRuntime, true);
    assert.equal(support.supportsObjectRemoval, true);
    assert.equal(support.mode, 'client-side');
  });

  it('creates a session shell for browser-side editing', () => {
    const session = createPdfEditSession({ name: 'sample.pdf' });

    assert.equal(session.name, 'sample.pdf');
    assert.equal(session.status, 'ready');
  });
});
