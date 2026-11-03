import * as harfbuzz from 'harfbuzzjs';
import bidiFactory from 'bidi-js';
import { sanitizeTextForRendering } from '../pdf-text-sanitize';

const bidi = bidiFactory();

export type ShapingFont = {
  key: string;
  face: harfbuzz.Face;
  font: harfbuzz.Font;
  characterSet: Set<number>;
};

export type ShapedGlyph = {
  id: number;
  cluster: number;
  sourceCodePoint: number;
  isJoinControlGlyph: boolean;
  path: string;
  xAdvance: number;
  yAdvance: number;
  xOffset: number;
  yOffset: number;
};

export type ShapedTextRun = {
  text: string;
  fontKey: string;
  script: string;
  direction: 'ltr' | 'rtl';
  unitsPerEm: number;
  scale: number;
  glyphs: ShapedGlyph[];
  advanceWidth: number;
  uncoveredCodePoints: number[];
};

export type ShapedCaretStop = { offset: number; x: number };

export class UnrenderableGlyphError extends Error {
  constructor(
    readonly glyphId: number,
    readonly sourceCodePoint: number,
    readonly textContext: string,
    readonly clusterText: string,
  ) {
    super(`Could not draw glyph ${glyphId} for U+${sourceCodePoint.toString(16).toUpperCase()}.`);
    this.name = 'UnrenderableGlyphError';
  }
}

export function getShapedCaretStops(text: string, runs: ShapedTextRun[]): ShapedCaretStop[] {
  const stops: ShapedCaretStop[] = [{ offset: 0, x: 0 }];
  let sourceOffset = 0;
  let xOffset = 0;

  for (const run of runs) {
    const locatedAt = text.indexOf(run.text, sourceOffset);
    const runStart = locatedAt >= 0 ? locatedAt : sourceOffset;
    const clusters = [...new Set(run.glyphs.map((glyph) => glyph.cluster))].sort((a, b) => a - b);
    let runX = xOffset;
    for (const [index, clusterStart] of clusters.entries()) {
      const clusterEnd = clusters[index + 1] ?? run.text.length;
      const glyphs = run.glyphs.filter((glyph) => glyph.cluster === clusterStart);
      const clusterWidth = glyphs.reduce((width, glyph) => width + glyph.xAdvance, 0);
      const clusterText = run.text.slice(clusterStart, clusterEnd);
      const codePointBoundaries = [0];
      let codePointOffset = 0;
      for (const character of clusterText) {
        codePointOffset += character.length;
        codePointBoundaries.push(codePointOffset);
      }
      const unitWidth = clusterWidth / Math.max(1, codePointBoundaries.length - 1);
      for (const [boundaryIndex, boundary] of codePointBoundaries.entries()) {
        stops.push({
          offset: runStart + clusterStart + boundary,
          x: runX + unitWidth * boundaryIndex,
        });
      }
      runX += clusterWidth;
    }
    xOffset += run.advanceWidth;
    sourceOffset = runStart + run.text.length;
  }

  const byOffset = new Map<number, ShapedCaretStop>();
  for (const stop of stops) byOffset.set(stop.offset, stop);
  const result = [...byOffset.values()].sort((left, right) => left.offset - right.offset);
  if (result.at(-1)?.offset !== text.length) result.push({ offset: text.length, x: xOffset });
  return result;
}

export function nearestShapedCaretStop(stops: ShapedCaretStop[], x: number) {
  return stops.reduce((nearest, stop) =>
    Math.abs(stop.x - x) < Math.abs(nearest.x - x) ? stop : nearest, stops[0] ?? { offset: 0, x: 0 });
}

type TextToken = {
  character: string;
  start: number;
  level: number;
  script: string;
  direction: 'ltr' | 'rtl';
};

export function scriptOf(character: string) {
  const codePoint = character.codePointAt(0) ?? 0;
  if ((codePoint >= 0x0900 && codePoint <= 0x097f) || (codePoint >= 0xa8e0 && codePoint <= 0xa8ff)) return 'Devanagari';
  if ((codePoint >= 0x0590 && codePoint <= 0x05ff) || (codePoint >= 0xfb1d && codePoint <= 0xfb4f)) return 'Hebrew';
  if ((codePoint >= 0x0530 && codePoint <= 0x058f) || (codePoint >= 0xfb13 && codePoint <= 0xfb17)) return 'Armenian';
  if ((codePoint >= 0x10a0 && codePoint <= 0x10ff) || (codePoint >= 0x1c90 && codePoint <= 0x1cbf) ||
    (codePoint >= 0x2d00 && codePoint <= 0x2d2f)) return 'Georgian';
  if ((codePoint >= 0x0370 && codePoint <= 0x03ff) || (codePoint >= 0x1f00 && codePoint <= 0x1fff)) return 'Greek';
  if ((codePoint >= 0x0400 && codePoint <= 0x052f) || (codePoint >= 0x2de0 && codePoint <= 0x2dff) ||
    (codePoint >= 0xa640 && codePoint <= 0xa69f)) return 'Cyrillic';
  if ((codePoint >= 0x0041 && codePoint <= 0x024f) || (codePoint >= 0x1e00 && codePoint <= 0x1eff) ||
    (codePoint >= 0xab30 && codePoint <= 0xab6f)) return 'Latin';
  return /^\p{M}$/u.test(character) || codePoint === 0x200c || codePoint === 0x200d
    ? 'Inherited'
    : 'Common';
}

export function getUnsupportedScriptCharacters(text: string) {
  const unsupportedScripts = new Set(['Hebrew', 'Georgian', 'Armenian']);
  const charactersByScript = new Map<string, Set<string>>();
  for (const character of text) {
    const script = scriptOf(character);
    if (!unsupportedScripts.has(script)) continue;
    const characters = charactersByScript.get(script) ?? new Set<string>();
    characters.add(character);
    charactersByScript.set(script, characters);
  }
  return [...charactersByScript].map(([script, characters]) => ({
    script,
    characters: [...characters],
  }));
}

export function containsDevanagariText(text: string) {
  return /[\u0900-\u097f\uA8E0-\uA8FF]/u.test(text);
}

export function isJoinControl(character: string) {
  return character === '\u200c' || character === '\u200d';
}

export function getGraphemeSegments(text: string) {
  if (typeof Intl.Segmenter === 'undefined') return [...text];
  return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)]
    .map(({ segment }) => segment);
}

export function getGraphemeBoundaries(text: string) {
  const boundaries = [0];
  let offset = 0;
  for (const segment of getGraphemeSegments(text)) {
    offset += segment.length;
    boundaries.push(offset);
  }
  return boundaries;
}

export function nearestGraphemeBoundary(text: string, offset: number) {
  const boundaries = getGraphemeBoundaries(text);
  return boundaries.reduce((nearest, boundary) =>
    Math.abs(boundary - offset) < Math.abs(nearest - offset) ? boundary : nearest, boundaries[0]);
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
  const preserveLeftToRightOrder = [...text].some((character) => scriptOf(character) === 'Devanagari');
  const tokens: TextToken[] = [];
  let start = 0;

  for (const character of text) {
    const level = embeddingLevels.levels[start] ?? 0;
    const script = scriptOf(character);
    tokens.push({
      character: preserveLeftToRightOrder ? character : mirroredCharacters.get(start) ?? character,
      start,
      level,
      script,
      direction: preserveLeftToRightOrder || level % 2 === 0 ? 'ltr' : 'rtl',
    });
    start += character.length;
  }

  const tokenByIndex = new Map(tokens.map((token) => [token.start, token]));
  const visualTokens = preserveLeftToRightOrder
    ? tokens
    : visualIndices.map((index) => tokenByIndex.get(index))
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

function shapeRun(text: string, script: string, direction: 'ltr' | 'rtl', font: ShapingFont): ShapedTextRun {
  const buffer = new harfbuzz.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  buffer.setDirection(direction === 'rtl' ? harfbuzz.Direction.RTL : harfbuzz.Direction.LTR);
  harfbuzz.shape(font.font, buffer);

  const positions = buffer.getGlyphInfosAndPositions();
  const joinControlClusters: Array<{ start: number; end: number }> = [];
  let graphemeOffset = 0;
  for (const segment of getGraphemeSegments(text)) {
    if ([...segment].some(isJoinControl)) {
      joinControlClusters.push({ start: graphemeOffset, end: graphemeOffset + segment.length });
    }
    graphemeOffset += segment.length;
  }
  const glyphs = positions.map((position) => ({
    id: position.codepoint,
    cluster: position.cluster,
    sourceCodePoint: text.codePointAt(position.cluster) ?? 0,
    isJoinControlGlyph: position.codepoint === 3 &&
      joinControlClusters.some(({ start, end }) => position.cluster >= start && position.cluster < end),
    path: font.font.glyphToPath(position.codepoint),
    xAdvance: position.xAdvance ?? 0,
    yAdvance: position.yAdvance ?? 0,
    xOffset: position.xOffset ?? 0,
    yOffset: position.yOffset ?? 0,
  }));
  return {
    text,
    fontKey: font.key,
    script,
    direction,
    unitsPerEm: font.face.upem,
    scale: 1,
    glyphs,
    advanceWidth: glyphs.reduce((width, glyph) => width + glyph.xAdvance, 0),
    uncoveredCodePoints: [...new Set([...text]
      .filter((character) => !isJoinControl(character))
      .map((character) => character.codePointAt(0) ?? 0)
      .filter((codePoint) => !font.characterSet.has(codePoint)))],
  };
}

export function shapeTextByScript(text: string, fonts: ShapingFont[]): ShapedTextRun[] {
  text = sanitizeTextForRendering(text);
  if (!text) return [];
  if (!fonts.length) throw new Error('No font is available for shaping this text.');
  const visualTokens = getTokens(text);
  const runs: Array<{ tokens: TextToken[]; font: ShapingFont }> = [];
  for (const [index, token] of visualTokens.entries()) {
    const codePoint = token.character.codePointAt(0) ?? 0;
    const previous = runs.at(-1);
    const nextCodePoint = visualTokens.slice(index + 1)
      .find((candidate) => candidate.script === token.script && !isJoinControl(candidate.character))
      ?.character.codePointAt(0);
    const coveringFont = isJoinControl(token.character)
      ? previous?.tokens[0].script === token.script
        ? previous.font
        : nextCodePoint === undefined
          ? undefined
          : fonts.find((candidate) => candidate.characterSet.has(nextCodePoint))
      : fonts.find((candidate) => candidate.characterSet.has(codePoint));
    const font = coveringFont ?? fonts[0];
    if (!coveringFont && !isJoinControl(token.character)) {
      const lastRun = runs.at(-1);
      if (lastRun?.font.key === font.key &&
        lastRun.tokens[0].direction === token.direction && lastRun.tokens[0].script === token.script) {
        lastRun.tokens.push(token);
      } else {
        runs.push({ tokens: [token], font });
      }
      continue;
    }
    if (!font) {
      continue;
    }
    const lastRun = runs.at(-1);
    if (lastRun && lastRun.font.key === font.key &&
      lastRun.tokens[0].direction === token.direction && lastRun.tokens[0].script === token.script) {
      lastRun.tokens.push(token);
    } else {
      runs.push({ tokens: [token], font });
    }
  }

  return runs.map(({ tokens, font }) => {
    const direction = tokens[0].direction;
    const logicalTokens = direction === 'rtl' ? [...tokens].reverse() : tokens;
    return shapeRun(
      logicalTokens.map((token) => token.character).join(''),
      tokens[0].script,
      direction,
      font,
    );
  });
}
