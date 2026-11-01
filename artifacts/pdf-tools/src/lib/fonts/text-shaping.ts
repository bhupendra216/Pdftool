import * as harfbuzz from 'harfbuzzjs';
import bidiFactory from 'bidi-js';

const bidi = bidiFactory();

export type ShapingFont = {
  key: string;
  face: harfbuzz.Face;
  font: harfbuzz.Font;
  characterSet: Set<number>;
};

export type ShapedGlyph = {
  id: number;
  sourceCodePoint: number;
  path: string;
  xAdvance: number;
  yAdvance: number;
  xOffset: number;
  yOffset: number;
};

export type ShapedTextRun = {
  text: string;
  fontKey: string;
  direction: 'ltr' | 'rtl';
  unitsPerEm: number;
  scale: number;
  glyphs: ShapedGlyph[];
  advanceWidth: number;
};

type TextToken = {
  character: string;
  start: number;
  level: number;
  script: string;
  direction: 'ltr' | 'rtl';
};

function scriptOf(character: string) {
  const codePoint = character.codePointAt(0) ?? 0;
  if ((codePoint >= 0x0590 && codePoint <= 0x05ff) || (codePoint >= 0xfb1d && codePoint <= 0xfb4f)) return 'Hebrew';
  if ((codePoint >= 0x0530 && codePoint <= 0x058f) || (codePoint >= 0xfb13 && codePoint <= 0xfb17)) return 'Armenian';
  if ((codePoint >= 0x10a0 && codePoint <= 0x10ff) || (codePoint >= 0x1c90 && codePoint <= 0x1cbf) ||
    (codePoint >= 0x2d00 && codePoint <= 0x2d2f)) return 'Georgian';
  if ((codePoint >= 0x0370 && codePoint <= 0x03ff) || (codePoint >= 0x1f00 && codePoint <= 0x1fff)) return 'Greek';
  if ((codePoint >= 0x0400 && codePoint <= 0x052f) || (codePoint >= 0x2de0 && codePoint <= 0x2dff) ||
    (codePoint >= 0xa640 && codePoint <= 0xa69f)) return 'Cyrillic';
  if ((codePoint >= 0x0041 && codePoint <= 0x024f) || (codePoint >= 0x1e00 && codePoint <= 0x1eff) ||
    (codePoint >= 0xab30 && codePoint <= 0xab6f)) return 'Latin';
  return /^\p{M}$/u.test(character) ? 'Inherited' : 'Common';
}

export function createShapingFont(
  key: string,
  bytes: Uint8Array,
  characterSet: Iterable<number>,
  weight?: number,
): ShapingFont {
  const face = new harfbuzz.Face(new harfbuzz.Blob(bytes));
  const font = new harfbuzz.Font(face);
  if (weight !== undefined && Object.values(face.getAxisInfos()).some((axis) => axis.tag === 'wght')) {
    font.setVariations([new harfbuzz.Variation('wght', weight)]);
  }
  return { key, face, font, characterSet: new Set(characterSet) };
}

function getTokens(text: string) {
  const embeddingLevels = bidi.getEmbeddingLevels(text);
  const visualIndices = bidi.getReorderedIndices(text, embeddingLevels);
  const mirroredCharacters = bidi.getMirroredCharactersMap(text, embeddingLevels.levels);
  const tokens: TextToken[] = [];
  let start = 0;

  for (const character of text) {
    const level = embeddingLevels.levels[start] ?? 0;
    tokens.push({
      character: mirroredCharacters.get(start) ?? character,
      start,
      level,
      script: scriptOf(character),
      direction: level % 2 === 1 ? 'rtl' : 'ltr',
    });
    start += character.length;
  }

  const tokenByIndex = new Map(tokens.map((token) => [token.start, token]));
  const visualTokens = visualIndices
    .map((index) => tokenByIndex.get(index))
    .filter((token): token is TextToken => Boolean(token));

  for (let index = 0; index < visualTokens.length; index += 1) {
    if (visualTokens[index].script !== 'Common' && visualTokens[index].script !== 'Inherited') continue;
    const previous = visualTokens.slice(0, index).reverse()
      .find((token) => token.direction === visualTokens[index].direction && token.script !== 'Common' && token.script !== 'Inherited');
    const next = visualTokens.slice(index + 1)
      .find((token) => token.direction === visualTokens[index].direction && token.script !== 'Common' && token.script !== 'Inherited');
    visualTokens[index].script = previous?.script ?? next?.script ?? 'Latin';
  }

  return visualTokens;
}

function shapeRun(text: string, direction: 'ltr' | 'rtl', font: ShapingFont): ShapedTextRun {
  const buffer = new harfbuzz.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  buffer.setDirection(direction === 'rtl' ? harfbuzz.Direction.RTL : harfbuzz.Direction.LTR);
  harfbuzz.shape(font.font, buffer);

  const positions = buffer.getGlyphInfosAndPositions();
  const glyphs = positions.map((position) => ({
    id: position.codepoint,
    sourceCodePoint: text.codePointAt(position.cluster) ?? 0,
    path: font.font.glyphToPath(position.codepoint),
    xAdvance: position.xAdvance ?? 0,
    yAdvance: position.yAdvance ?? 0,
    xOffset: position.xOffset ?? 0,
    yOffset: position.yOffset ?? 0,
  }));
  return {
    text,
    fontKey: font.key,
    direction,
    unitsPerEm: font.face.upem,
    scale: 1,
    glyphs,
    advanceWidth: glyphs.reduce((width, glyph) => width + glyph.xAdvance, 0),
  };
}

export function shapeTextByScript(text: string, fonts: ShapingFont[]): ShapedTextRun[] {
  if (!text) return [];
  if (!fonts.length) throw new Error('No font is available for shaping this text.');
  const visualTokens = getTokens(text);
  const runs: Array<{ tokens: TextToken[]; font: ShapingFont }> = [];
  for (const token of visualTokens) {
    const codePoint = token.character.codePointAt(0) ?? 0;
    const font = fonts.find((candidate) => candidate.characterSet.has(codePoint));
    if (!font) {
      throw new Error(`No selected or fallback font contains U+${codePoint.toString(16).toUpperCase()}.`);
    }
    const previous = runs.at(-1);
    if (previous && previous.font.key === font.key &&
      previous.tokens[0].direction === token.direction && previous.tokens[0].script === token.script) {
      previous.tokens.push(token);
    } else {
      runs.push({ tokens: [token], font });
    }
  }

  return runs.map(({ tokens, font }) => {
    const direction = tokens[0].direction;
    const logicalTokens = direction === 'rtl' ? [...tokens].reverse() : tokens;
    return shapeRun(
      logicalTokens.map((token) => token.character).join(''),
      direction,
      font,
    );
  });
}
