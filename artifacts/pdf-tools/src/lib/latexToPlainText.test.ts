import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { convertLatexToPlainText, stripOuterLatexDelimiters } from './latexToPlainText.ts';

describe('latex to plain text', () => {
  it('strips common wrappers before conversion', () => {
    assert.equal(stripOuterLatexDelimiters('$$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$'), '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
    assert.equal(stripOuterLatexDelimiters(' $x^2$ '), 'x^2');
  });

  it('converts a quadratic expression to readable plain text', () => {
    const result = convertLatexToPlainText('\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
    assert.equal(result, '(-b ± √(b²-4ac)) / (2a)');
  });

  it('preserves Greek and symbol output', () => {
    assert.equal(convertLatexToPlainText('\\alpha + \\beta = \\pi'), 'α + β = π');
    assert.equal(convertLatexToPlainText('\\sum_{i=1}^{n} i^2'), 'Σ(i=1 to n) i²');
  });
});
