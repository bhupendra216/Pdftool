import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { transliterateDevanagari } from './devanagari-input';

describe('Devanagari phonetic input', () => {
  it('converts the published examples deterministically', () => {
    const examples: Array<[string, string]> = [
      ['namaste', 'नमस्ते'],
      ['nepal', 'नेपाल'],
      ['kshatriya', 'क्षत्रिय'],
      ['gyaan', 'ज्ञान'],
      ['aa', 'आ'],
      ['ii', 'ई'],
      ['M', 'ं'],
      ['~', 'ँ'],
    ];
    for (const [input, expected] of examples) {
      assert.equal(transliterateDevanagari(input), expected, input);
    }
  });
});
