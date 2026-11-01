export type PdfTextFillOperatorList = {
  fnArray: number[];
  argsArray: unknown[][];
};

type PdfTextItem = string | {
  str?: string;
};

type TextGlyph = {
  unicode?: string;
};

function normalizeHex(value: string) {
  const match = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (!match) return null;
  const full = match.length === 3 ? match.split('').map((part) => part + part).join('') : match;
  return `#${full.toLowerCase()}`;
}

function toHexColor(red: number, green: number, blue: number) {
  const channel = (value: number) => Math.round(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0');
  return `#${channel(red)}${channel(green)}${channel(blue)}`;
}

function getFillColor(operator: number, args: unknown[], ops: Record<string, number>) {
  const asNumberArray = args.filter((value): value is number => typeof value === 'number');

  if (operator === ops.setFillRGBColor) {
    if (typeof args[0] === 'string') {
      return normalizeHex(args[0]);
    }
    if (asNumberArray.length >= 3) {
      const [red, green, blue] = asNumberArray.slice(0, 3) as [number, number, number];
      return toHexColor(red, green, blue);
    }
  }

  if (operator === ops.setFillGray && typeof args[0] === 'number') {
    return toHexColor(args[0], args[0], args[0]);
  }

  if (operator === ops.setFillCMYKColor && args.slice(0, 4).every((value) => typeof value === 'number')) {
    const [cyan, magenta, yellow, black] = args as number[];
    return toHexColor(
      (1 - cyan) * (1 - black),
      (1 - magenta) * (1 - black),
      (1 - yellow) * (1 - black),
    );
  }

  if (operator === ops.setFillColor && typeof args[0] === 'string') {
    return normalizeHex(args[0]);
  }

  if (operator === ops.setFillColor && asNumberArray.length >= 3) {
    const [red, green, blue] = asNumberArray.slice(0, 3) as [number, number, number];
    return toHexColor(red, green, blue);
  }

  return undefined;
}

function getShowTextGlyphs(value: unknown): TextGlyph[] {
  if (!Array.isArray(value)) return [];
  if (value.every((item) => item && typeof item === 'object' && 'unicode' in item)) {
    return value as TextGlyph[];
  }
  for (const item of value) {
    const glyphs = getShowTextGlyphs(item);
    if (glyphs.length) return glyphs;
  }
  return [];
}

function normalizedTextWithOffsets(glyphs: Array<{ character: string; color: string | null }>, start: number) {
  let text = '';
  const offsets: number[] = [];
  let pendingSpace = false;
  for (let index = start; index < glyphs.length; index += 1) {
    const character = glyphs[index].character;
    if (/\s/u.test(character)) {
      pendingSpace = text.length > 0;
      continue;
    }
    if (pendingSpace) {
      text += ' ';
      offsets.push(index - 1);
      pendingSpace = false;
    }
    text += character;
    offsets.push(index);
  }
  return { text, offsets };
}

export function getPdfTextFillColors(
  items: PdfTextItem[],
  operatorList: PdfTextFillOperatorList,
  ops: Record<string, number>,
) {
  const glyphs: Array<{ character: string; color: string | null }> = [];
  const graphicsState: Array<string | null> = [];
  let fillColor: string | null = null;

  for (let index = 0; index < operatorList.fnArray.length; index += 1) {
    const operator = operatorList.fnArray[index];
    const args = operatorList.argsArray[index] ?? [];
    if (operator === ops.save) {
      graphicsState.push(fillColor);
      continue;
    }
    if (operator === ops.restore) {
      fillColor = graphicsState.pop() ?? null;
      continue;
    }
    const resolvedColor = getFillColor(operator, args, ops);
    if (resolvedColor !== undefined) {
      fillColor = resolvedColor;
      continue;
    }
    if (operator !== ops.showText && operator !== ops.showSpacedText &&
      operator !== ops.nextLineShowText && operator !== ops.nextLineSetSpacingShowText) continue;

    for (const glyph of getShowTextGlyphs(args)) {
      for (const character of glyph.unicode ?? '') {
        glyphs.push({ character, color: fillColor });
      }
    }
  }

  const streamText = glyphs.map((glyph) => glyph.character).join('');
  let searchFrom = 0;
  return items.map((item) => {
    const str = typeof item === 'string' ? item : (item?.str ?? '');
    if (!str) return null;

    const exactIndex = streamText.indexOf(str, searchFrom);
    if (exactIndex >= 0) {
      searchFrom = exactIndex + str.length;
      const firstVisibleGlyph = glyphs.slice(exactIndex, searchFrom).find((glyph) => !/\s/u.test(glyph.character));
      return firstVisibleGlyph?.color ?? glyphs[exactIndex]?.color ?? null;
    }

    const normalizedItem = str.replace(/\s+/gu, ' ').trim();
    if (!normalizedItem) return null;
    const normalizedStream = normalizedTextWithOffsets(glyphs, searchFrom);
    const normalizedOffset = normalizedStream.text.indexOf(normalizedItem);
    if (normalizedOffset < 0) return null;
    const sourceStart = normalizedStream.offsets[normalizedOffset];
    const sourceEnd = normalizedStream.offsets[normalizedOffset + normalizedItem.length - 1] + 1;
    const firstVisibleGlyph = glyphs.slice(sourceStart, sourceEnd).find((glyph) => !/\s/u.test(glyph.character));
    if (!firstVisibleGlyph) return null;
    searchFrom = sourceEnd;
    return firstVisibleGlyph.color;
  });
}

export function darkestCommonPixelColor(
  pixels: ReadonlyArray<readonly [number, number, number]>,
  background: readonly [number, number, number],
) {
  if (!pixels.length) return null;
  const luminance = ([red, green, blue]: readonly [number, number, number]) =>
    0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const backgroundLuminance = luminance(background);
  const candidates = new Map<string, { color: [number, number, number]; count: number }>();

  for (const pixel of pixels) {
    const delta = luminance(pixel) - backgroundLuminance;
    if ((backgroundLuminance > 128 && delta >= -35) || (backgroundLuminance <= 128 && delta <= 35)) continue;
    const key = pixel.map((channel) => Math.round(channel)).join(',');
    const candidate = candidates.get(key);
    if (candidate) candidate.count += 1;
    else candidates.set(key, { color: [pixel[0], pixel[1], pixel[2]], count: 1 });
  }

  const minimumCommonPixels = Math.max(2, Math.ceil(pixels.length * 0.0005));
  const commonCandidates = [...candidates.values()]
    .filter((candidate) => candidate.count >= minimumCommonPixels)
    .sort((left, right) => luminance(left.color) - luminance(right.color));
  const darkest = commonCandidates[0]?.color;
  if (!darkest) return null;

  const isNearBlack = darkest.every((channel) => channel <= 38);
  if (isNearBlack) {
    return '#000000';
  }

  return `#${darkest.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}
