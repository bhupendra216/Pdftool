export const UNREADABLE_TEXT_PLACEHOLDER = '▯';

const unreadableCharacterPattern = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\uFFFD\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/gu;
const devanagariDependentSignPattern = /[\u093A-\u094C\u094E\u094F\u0962\u0963]/u;

export function sanitizeExtractedPdfText(text: string) {
  let unreadableCharacterCount = 0;
  const sanitizedText = text.replace(unreadableCharacterPattern, () => {
    unreadableCharacterCount += 1;
    return UNREADABLE_TEXT_PLACEHOLDER;
  });
  return { text: sanitizedText, unreadableCharacterCount };
}

export function sanitizeEditorText(text: string) {
  return text.replace(unreadableCharacterPattern, UNREADABLE_TEXT_PLACEHOLDER);
}

export function sanitizeTextForRendering(text: string) {
  return text.replace(unreadableCharacterPattern, '').replaceAll(UNREADABLE_TEXT_PLACEHOLDER, '');
}

export function countUnreadableTextPlaceholders(text: string) {
  return [...text].filter((character) => character === UNREADABLE_TEXT_PLACEHOLDER).length;
}

export function replaceImpossibleDevanagariSigns(text: string) {
  let unreadableCharacterCount = 0;
  const characters = [...text];
  for (let index = 0; index < characters.length; index += 1) {
    if (!devanagariDependentSignPattern.test(characters[index])) continue;
    const previous = characters[index - 1];
    if (previous && !/\s/u.test(previous)) continue;
    characters[index] = UNREADABLE_TEXT_PLACEHOLDER;
    unreadableCharacterCount += 1;
  }
  return { text: characters.join(''), unreadableCharacterCount };
}

export function getUnreadableTextContext(text: string, start: number, end = start + 1) {
  const lower = Math.max(0, start - 12);
  const upper = Math.min(text.length, Math.max(end, start + 1) + 12);
  return text.slice(lower, upper).replaceAll(UNREADABLE_TEXT_PLACEHOLDER, '▯');
}
