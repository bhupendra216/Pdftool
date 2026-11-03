import { describe, expect, it } from 'vitest';
import {
  countUnreadableTextPlaceholders,
  replaceImpossibleDevanagariSigns,
  sanitizeEditorText,
  sanitizeExtractedPdfText,
  sanitizeTextForRendering,
} from './pdf-text-sanitize';

describe('PDF text sanitization', () => {
  it('replaces controls, replacement characters, and private-use characters with editor placeholders', () => {
    const input = `a\u0000b\u0008c\u000Bd\u001Fe\u007Ff\u009Fg\uFFFDh\uE000i\u{F0000}j\u{100000}k`;
    const sanitized = sanitizeExtractedPdfText(input);
    expect(sanitized.unreadableCharacterCount).toBe(10);
    expect(sanitized.text).toBe('a▯b▯c▯d▯e▯f▯g▯h▯i▯j▯k');
    expect(countUnreadableTextPlaceholders(sanitized.text)).toBe(10);
  });

  it('never sends invalid characters or placeholders to shaping and export callers', () => {
    const input = `word\u0000\uFFFD\uE000`;
    expect(sanitizeEditorText(input)).toBe('word▯▯▯');
    expect(sanitizeTextForRendering(input)).toBe('word');
    expect(sanitizeTextForRendering('word▯▯')).toBe('word');
  });

  it('marks a dependent vowel sign that has no Devanagari base as unreadable', () => {
    expect(replaceImpossibleDevanagariSigns('शब्द कि')).toEqual({
      text: 'शब्द कि',
      unreadableCharacterCount: 0,
    });
    expect(replaceImpossibleDevanagariSigns('शब्द \u093F')).toEqual({
      text: 'शब्द ▯',
      unreadableCharacterCount: 1,
    });
  });
});
