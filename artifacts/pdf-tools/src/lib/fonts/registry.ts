import { decodePDFRawStream, PDFArray, PDFDict, PDFDocument, PDFName, PDFRawStream, type PDFFont } from 'pdf-lib';
import { createShapingFont, shapeTextByScript, type ShapedTextRun, type ShapingFont } from './text-shaping';

export type EditorFontFamily =
  | 'Liberation Sans' | 'Liberation Serif' | 'Liberation Mono'
  | 'Carlito' | 'Caladea' | 'Gelasio' | 'DejaVu Sans' | 'DejaVu Serif'
  | 'Noto Sans' | 'Noto Serif' | 'Lato' | 'Open Sans' | 'Roboto'
  | 'Source Sans 3' | 'Merriweather' | 'Montserrat'
  | 'Noto Sans Hebrew' | 'Noto Serif Hebrew' | 'Heebo'
  | 'Noto Sans Georgian' | 'Noto Sans Armenian';

export type FontVariant = 'regular' | 'bold' | 'italic' | 'boldItalic';
export type FontDetectionStatus = 'detected' | 'fallback';

export type FontDetectionHints = {
  flags?: number;
  descriptorFlags?: number;
  descriptor?: { flags?: number };
  isSerifFont?: boolean;
  isMonospace?: boolean;
  isBold?: boolean;
  isItalic?: boolean;
  fontObj?: {
    flags?: number;
    descriptor?: { flags?: number };
    isSerifFont?: boolean;
    isMonospace?: boolean;
    isBold?: boolean;
    isItalic?: boolean;
  };
};

export type EditorTextMetrics = {
  widthOfTextAtSize(text: string, size: number): number;
  heightAtSize(size: number): number;
  shapeTextAtSize(text: string, size: number): ShapedTextRun[];
  missingFromPrimary(text: string): string[];
  missingCharacters(text: string): string[];
};

export type PdfTextFontRun = {
  text: string;
  font: PDFFont;
};

const fontFiles: Record<EditorFontFamily, Record<FontVariant, string>> = {
  'Liberation Sans': {
    regular: 'liberation-sans-regular.ttf', bold: 'liberation-sans-bold.ttf',
    italic: 'liberation-sans-italic.ttf', boldItalic: 'liberation-sans-bold-italic.ttf',
  },
  'Liberation Serif': {
    regular: 'liberation-serif-regular.ttf', bold: 'liberation-serif-bold.ttf',
    italic: 'liberation-serif-italic.ttf', boldItalic: 'liberation-serif-bold-italic.ttf',
  },
  'Liberation Mono': {
    regular: 'liberation-mono-regular.ttf', bold: 'liberation-mono-bold.ttf',
    italic: 'liberation-mono-italic.ttf', boldItalic: 'liberation-mono-bold-italic.ttf',
  },
  Carlito: {
    regular: 'carlito-regular.ttf', bold: 'carlito-bold.ttf',
    italic: 'carlito-italic.ttf', boldItalic: 'carlito-bold-italic.ttf',
  },
  Caladea: {
    regular: 'caladea-regular.ttf', bold: 'caladea-bold.ttf',
    italic: 'caladea-italic.ttf', boldItalic: 'caladea-bold-italic.ttf',
  },
  Gelasio: {
    regular: 'gelasio-regular.ttf', bold: 'gelasio-bold.ttf',
    italic: 'gelasio-italic.ttf', boldItalic: 'gelasio-bold-italic.ttf',
  },
  'DejaVu Sans': {
    regular: 'dejavu-sans-regular.ttf', bold: 'dejavu-sans-bold.ttf',
    italic: 'dejavu-sans-italic.ttf', boldItalic: 'dejavu-sans-bold-italic.ttf',
  },
  'DejaVu Serif': {
    regular: 'dejavu-serif-regular.ttf', bold: 'dejavu-serif-bold.ttf',
    italic: 'dejavu-serif-italic.ttf', boldItalic: 'dejavu-serif-bold-italic.ttf',
  },
  'Noto Sans': {
    regular: 'noto-sans-regular.ttf', bold: 'noto-sans-bold.ttf',
    italic: 'noto-sans-italic.ttf', boldItalic: 'noto-sans-bold-italic.ttf',
  },
  'Noto Serif': {
    regular: 'noto-serif-regular.ttf', bold: 'noto-serif-bold.ttf',
    italic: 'noto-serif-italic.ttf', boldItalic: 'noto-serif-bold-italic.ttf',
  },
  Lato: {
    regular: 'lato-regular.ttf', bold: 'lato-bold.ttf',
    italic: 'lato-italic.ttf', boldItalic: 'lato-bold-italic.ttf',
  },
  'Open Sans': {
    regular: 'open-sans-regular.ttf', bold: 'open-sans-bold.ttf',
    italic: 'open-sans-italic.ttf', boldItalic: 'open-sans-bold-italic.ttf',
  },
  Roboto: {
    regular: 'roboto-regular.ttf', bold: 'roboto-bold.ttf',
    italic: 'roboto-italic.ttf', boldItalic: 'roboto-bold-italic.ttf',
  },
  'Source Sans 3': {
    regular: 'source-sans-3-regular.ttf', bold: 'source-sans-3-bold.ttf',
    italic: 'source-sans-3-italic.ttf', boldItalic: 'source-sans-3-bold-italic.ttf',
  },
  Merriweather: {
    regular: 'merriweather-regular.ttf', bold: 'merriweather-bold.ttf',
    italic: 'merriweather-italic.ttf', boldItalic: 'merriweather-bold-italic.ttf',
  },
  Montserrat: {
    regular: 'montserrat-regular.ttf', bold: 'montserrat-bold.ttf',
    italic: 'montserrat-italic.ttf', boldItalic: 'montserrat-bold-italic.ttf',
  },
  'Noto Sans Hebrew': {
    regular: 'noto-sans-hebrew-regular.ttf', bold: 'noto-sans-hebrew-bold.ttf',
    italic: 'noto-sans-hebrew-regular.ttf', boldItalic: 'noto-sans-hebrew-bold.ttf',
  },
  'Noto Serif Hebrew': {
    regular: 'noto-serif-hebrew-regular.ttf', bold: 'noto-serif-hebrew-bold.ttf',
    italic: 'noto-serif-hebrew-regular.ttf', boldItalic: 'noto-serif-hebrew-bold.ttf',
  },
  Heebo: {
    regular: 'heebo-variable.ttf', bold: 'heebo-variable.ttf',
    italic: 'heebo-variable.ttf', boldItalic: 'heebo-variable.ttf',
  },
  'Noto Sans Georgian': {
    regular: 'noto-sans-georgian-regular.ttf', bold: 'noto-sans-georgian-bold.ttf',
    italic: 'noto-sans-georgian-regular.ttf', boldItalic: 'noto-sans-georgian-bold.ttf',
  },
  'Noto Sans Armenian': {
    regular: 'noto-sans-armenian-regular.ttf', bold: 'noto-sans-armenian-bold.ttf',
    italic: 'noto-sans-armenian-regular.ttf', boldItalic: 'noto-sans-armenian-bold.ttf',
  },
};

const fontBytesCache = new Map<string, Promise<Uint8Array>>();
const textMetricsCache = new Map<string, Promise<EditorTextMetrics>>();
const resolvedTextMetrics = new Map<string, EditorTextMetrics>();
const previewFontCache = new Map<string, Promise<void>>();
const registeredFontkitDocuments = new WeakSet<PDFDocument>();
const shapingFontCache = new Map<string, Promise<ShapingFont>>();
const fontsThatRequireFullEmbedding = new Set<EditorFontFamily>([
  'Carlito',
  'Roboto',
  'Source Sans 3',
  'Merriweather',
  'Heebo',
  'Noto Sans Hebrew',
  'Noto Serif Hebrew',
  'Noto Sans Georgian',
  'Noto Sans Armenian',
]);

function fontKey(family: EditorFontFamily, variant: FontVariant) {
  return `${family}:${variant}`;
}

function getFontWeight(variant: FontVariant) {
  return variant === 'bold' || variant === 'boldItalic' ? 700 : 400;
}

function getShapingFont(family: EditorFontFamily, variant: FontVariant) {
  const key = fontKey(family, variant);
  const cached = shapingFontCache.get(key);
  if (cached) return cached;
  const pending = loadFontBytes(family, variant).then(async (bytes) => {
    const fontkit = (await import('@pdf-lib/fontkit')).default;
    const parsed = fontkit.create(bytes);
    return createShapingFont(
      key,
      bytes,
      parsed.characterSet,
      family === 'Heebo' ? getFontWeight(variant) : undefined,
    );
  });
  shapingFontCache.set(key, pending);
  void pending.catch(() => shapingFontCache.delete(key));
  return pending;
}

function loadFontBytes(family: EditorFontFamily, variant: FontVariant) {
  const filename = fontFiles[family][variant];
  const cached = fontBytesCache.get(filename);
  if (cached) return cached;
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  const pending = fetch(`${baseUrl}fonts/edit/${filename}`).then(async (response) => {
    if (!response.ok) throw new Error(`Could not load the ${family} font asset.`);
    return new Uint8Array(await response.arrayBuffer());
  });
  fontBytesCache.set(filename, pending);
  void pending.catch(() => fontBytesCache.delete(filename));
  return pending;
}

export function getCachedEditorTextMetrics(
  family: EditorFontFamily,
  variant: FontVariant,
  fallbackFamily: EditorFontFamily = 'Noto Sans',
) {
  return resolvedTextMetrics.get(`${fontKey(family, variant)}:${fallbackFamily}`);
}

export async function loadEditorTextMetrics(
  family: EditorFontFamily,
  variant: FontVariant,
  fallbackFamily: EditorFontFamily = 'Noto Sans',
) {
  const key = `${fontKey(family, variant)}:${fallbackFamily}`;
  const cached = textMetricsCache.get(key);
  if (cached) return cached;
  const pending = (async (): Promise<EditorTextMetrics> => {
    const { PDFDocument: ScratchPdfDocument } = await import('pdf-lib');
    const fontkit = (await import('@pdf-lib/fontkit')).default;
    const scratchDocument = await ScratchPdfDocument.create();
    scratchDocument.registerFontkit(fontkit);
    const [primaryBytes, primaryShapingFont] = await Promise.all([
      loadFontBytes(family, variant),
      getShapingFont(family, variant),
    ]);
    const primary = await scratchDocument.embedFont(primaryBytes, { subset: true });
    const effectiveFallbackFamily = family === fallbackFamily ? undefined : fallbackFamily;
    const [fallback, fallbackShapingFont] = effectiveFallbackFamily
      ? await Promise.all([
        loadFontBytes(effectiveFallbackFamily, variant).then((bytes) => scratchDocument.embedFont(bytes, { subset: true })),
        getShapingFont(effectiveFallbackFamily, variant),
      ])
      : [primary, primaryShapingFont] as const;
    const shapingFonts = effectiveFallbackFamily
      ? [primaryShapingFont, fallbackShapingFont]
      : [primaryShapingFont];
    return {
      widthOfTextAtSize(text, size) {
        if (/^[\u0000-\u007f]*$/u.test(text)) {
          return splitTextForPdf(text, primary, fallback).reduce(
            (width, run) => width + run.font.widthOfTextAtSize(run.text, size),
            0,
          );
        }
        return shapeTextByScript(text, shapingFonts).reduce(
          (width, run) => width + run.advanceWidth / run.unitsPerEm * size,
          0,
        );
      },
      heightAtSize(size) {
        return primary.heightAtSize(size);
      },
      shapeTextAtSize(text, size) {
        return shapeTextByScript(text, shapingFonts).map((run) => ({
          ...run,
          scale: size / run.unitsPerEm,
          glyphs: run.glyphs.map((glyph) => ({
            ...glyph,
            xAdvance: glyph.xAdvance / run.unitsPerEm * size,
            yAdvance: glyph.yAdvance / run.unitsPerEm * size,
            xOffset: glyph.xOffset / run.unitsPerEm * size,
            yOffset: glyph.yOffset / run.unitsPerEm * size,
          })),
          advanceWidth: run.advanceWidth / run.unitsPerEm * size,
        }));
      },
      missingFromPrimary(text) {
        const primaryCharacters = new Set(primary.getCharacterSet());
        return [...new Set([...text]
          .filter((character) => !/\s/u.test(character))
          .filter((character) => !primaryCharacters.has(character.codePointAt(0) ?? 0)))];
      },
      missingCharacters(text) {
        const primaryCharacters = new Set(primary.getCharacterSet());
        const fallbackCharacters = new Set(fallback.getCharacterSet());
        return [...new Set([...text]
          .filter((character) => !/\s/u.test(character))
          .filter((character) => {
            const codePoint = character.codePointAt(0) ?? 0;
            return !primaryCharacters.has(codePoint) && !fallbackCharacters.has(codePoint);
          }))];
      },
    };
  })();
  textMetricsCache.set(key, pending);
  void pending.then((metrics) => resolvedTextMetrics.set(key, metrics));
  void pending.catch(() => textMetricsCache.delete(key));
  return pending;
}

export async function loadEditorPreviewFonts(
  family: EditorFontFamily,
  variant: FontVariant,
  fallbackFamily: EditorFontFamily = 'Noto Sans',
) {
  const families = family === fallbackFamily ? [family] : [family, fallbackFamily];
  await Promise.all(families.map(async (fontFamily) => {
    const key = fontKey(fontFamily, variant);
    const cached = previewFontCache.get(key);
    if (cached) return cached;
    const pending = loadFontBytes(fontFamily, variant).then(async (bytes) => {
      const face = new FontFace(fontFamily, bytes.slice().buffer as ArrayBuffer, {
        weight: fontFamily === 'Heebo' ? '100 900' : String(getFontWeight(variant)),
        style: 'normal',
      });
      await face.load();
      document.fonts.add(face);
    });
    previewFontCache.set(key, pending);
    void pending.catch(() => previewFontCache.delete(key));
    return pending;
  }));
}

export async function embedEditorFont(document: PDFDocument, family: EditorFontFamily, variant: FontVariant) {
  if (!registeredFontkitDocuments.has(document)) {
    const fontkit = (await import('@pdf-lib/fontkit')).default;
    document.registerFontkit(fontkit);
    registeredFontkitDocuments.add(document);
  }
  const bytes = await loadFontBytes(family, variant);
  return document.embedFont(bytes, { subset: !fontsThatRequireFullEmbedding.has(family) });
}

export type EditorGlyphCheck = {
  font: PDFFont;
  family: EditorFontFamily;
  text: string;
  glyphs: Array<{ glyphId: number; codePoints: number[] }>;
};

export async function captureEditorGlyphCheck(
  font: PDFFont,
  family: EditorFontFamily,
  variant: FontVariant,
  text: string,
): Promise<EditorGlyphCheck> {
  const fontkit = (await import('@pdf-lib/fontkit')).default;
  const sourceFont = fontkit.create(await loadFontBytes(family, variant));
  const layoutGlyphs = sourceFont.layout(text).glyphs;
  const encoded = font.encodeText(text).asBytes();
  if (encoded.length !== layoutGlyphs.length * 2) {
    throw new Error(`Could not validate ${family}: the encoded glyph map does not match the edited text.`);
  }

  const glyphs = layoutGlyphs.map((glyph, index) => ({
    glyphId: encoded[index * 2] * 256 + encoded[index * 2 + 1],
    codePoints: [...glyph.codePoints],
  }));
  const coveredCodePoints = new Set(glyphs.flatMap((glyph) => glyph.codePoints));
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (!/\s/u.test(character) && !coveredCodePoints.has(codePoint)) {
      throw new Error(`Could not validate ${family}: no glyph was encoded for U+${codePoint.toString(16).toUpperCase()}.`);
    }
  }

  return { font, family, text, glyphs };
}

async function readEmbeddedFontProgram(stream: PDFRawStream) {
  return decodePDFRawStream(stream).decode();
}

export async function verifyEditorPdfGlyphs(bytes: Uint8Array, checks: EditorGlyphCheck[]) {
  if (checks.length === 0) return;
  const document = await PDFDocument.load(bytes);
  const fontkit = (await import('@pdf-lib/fontkit')).default;
  const embeddedFonts = new Map<string, ReturnType<typeof fontkit.create>>();

  for (const check of checks) {
    const fontKey = `${check.font.ref.objectNumber}:${check.font.ref.generationNumber}`;
    let embeddedFont = embeddedFonts.get(fontKey);
    if (!embeddedFont) {
      const fontObject = document.context.lookup(check.font.ref, PDFDict);
      const descendantsRef = fontObject.get(PDFName.of('DescendantFonts'));
      if (!descendantsRef) throw new Error(`Could not verify the embedded ${check.family} font.`);
      const descendants = document.context.lookup(descendantsRef, PDFArray);
      const cidFontRef = descendants.get(0);
      if (!cidFontRef) throw new Error(`Could not verify the embedded ${check.family} font.`);
      const cidFont = document.context.lookup(cidFontRef, PDFDict);
      if (cidFont.get(PDFName.of('CIDToGIDMap'))?.toString() !== '/Identity') {
        throw new Error(`Could not verify the glyph map for the embedded ${check.family} font.`);
      }
      const descriptorRef = cidFont.get(PDFName.of('FontDescriptor'));
      if (!descriptorRef) throw new Error(`Could not read the embedded ${check.family} font descriptor.`);
      const descriptor = document.context.lookup(descriptorRef, PDFDict);
      const fontFileRef = descriptor.get(PDFName.of('FontFile2'));
      if (!fontFileRef) throw new Error(`Could not read the embedded ${check.family} TrueType font.`);
      const fontFileObject = document.context.lookup(fontFileRef);
      if (!(fontFileObject instanceof PDFRawStream)) {
        throw new Error(`Could not read the embedded ${check.family} TrueType font.`);
      }
      const fontFile = fontFileObject;
      const fontProgram = await readEmbeddedFontProgram(fontFile);
      try {
        embeddedFont = fontkit.create(fontProgram);
      } catch (reason) {
        throw new Error(`Could not read the embedded ${check.family} TrueType font.`, { cause: reason });
      }
      embeddedFonts.set(fontKey, embeddedFont);
    }

    for (const glyph of check.glyphs) {
      if (glyph.codePoints.every((codePoint) => /\s/u.test(String.fromCodePoint(codePoint)))) continue;
      const codePoint = glyph.codePoints.find((value) => !/\s/u.test(String.fromCodePoint(value))) ?? 0;
      let hasOutline = false;
      try {
        hasOutline = glyph.glyphId !== 0 && embeddedFont.getGlyph(glyph.glyphId).path.toSVG().length > 0;
      } catch (reason) {
        throw new Error(
          `Edited PDF font ${check.family} has an unreadable outline for U+${codePoint.toString(16).toUpperCase()}.`,
          { cause: reason },
        );
      }
      if (!hasOutline) {
        throw new Error(
          `Edited PDF font ${check.family} has a blank glyph for U+${codePoint.toString(16).toUpperCase()}.`,
        );
      }
    }
  }
}

export function splitTextForPdf(text: string, primary: PDFFont, fallback: PDFFont): PdfTextFontRun[] {
  return splitTextForPdfUsingFonts(text, [primary, fallback]);
}

export function splitTextForPdfUsingFonts(text: string, fonts: PDFFont[]): PdfTextFontRun[] {
  if (!fonts.length) throw new Error('No font is available for this text.');
  const runs: PdfTextFontRun[] = [];
  const characterSets = fonts.map((font) => new Set(font.getCharacterSet()));
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0;
    const previous = runs.at(-1)?.font;
    let selectedIndex = characterSets.findIndex((characters) => characters.has(codePoint));
    if (/\s/u.test(character) && previous) {
      const previousIndex = fonts.indexOf(previous);
      if (previousIndex >= 0 && characterSets[previousIndex].has(codePoint)) selectedIndex = previousIndex;
    }
    if (selectedIndex < 0) {
      throw new Error(`No selected or fallback font contains U+${codePoint.toString(16).toUpperCase()}.`);
    }
    let selectedFont = fonts[selectedIndex];
    try {
      selectedFont.encodeText(character);
    } catch (reason) {
      const nextIndex = fonts.findIndex((font, index) => index !== selectedIndex && characterSets[index].has(codePoint));
      if (nextIndex < 0) {
        throw new Error(`The selected fonts cannot encode U+${codePoint.toString(16).toUpperCase()}.`, { cause: reason });
      }
      selectedFont = fonts[nextIndex];
      try {
        selectedFont.encodeText(character);
      } catch (fallbackReason) {
        throw new Error(`The selected fonts cannot encode U+${codePoint.toString(16).toUpperCase()}.`, { cause: fallbackReason });
      }
    }
    if (previous && /\s/u.test(character) &&
      fonts.indexOf(previous) === selectedIndex) {
      selectedFont = previous;
    }
    const last = runs.at(-1);
    if (last?.font === selectedFont) last.text += character;
    else runs.push({ text: character, font: selectedFont });
  }
  return runs;
}

// Registry families use locally bundled/system-compatible metrics. Liberation is
// GPL with Font Exception, DejaVu is Bitstream Vera, and the other listed
// families are SIL OFL. Keep this table independent of network font providers.
export const FONT_REGISTRY: Array<{
  family: EditorFontFamily;
  group: string;
  displayName: string;
  languages: string;
  sample: string;
  compatible?: boolean;
}> = [
  { family: 'Liberation Sans', group: 'Compatible', displayName: 'Arial', languages: 'Latin', sample: 'The quick brown fox', compatible: true },
  { family: 'Liberation Serif', group: 'Compatible', displayName: 'Times New Roman', languages: 'Latin', sample: 'The quick brown fox', compatible: true },
  { family: 'Liberation Mono', group: 'Compatible', displayName: 'Courier New', languages: 'Latin', sample: 'The quick brown fox', compatible: true },
  { family: 'Carlito', group: 'Compatible', displayName: 'Calibri', languages: 'Latin', sample: 'The quick brown fox', compatible: true },
  { family: 'Caladea', group: 'Compatible', displayName: 'Cambria', languages: 'Latin (limited; extended scripts use fallback)', sample: 'The quick brown fox', compatible: true },
  { family: 'Gelasio', group: 'Compatible', displayName: 'Georgia', languages: 'Latin (limited; Greek and Cyrillic use fallback)', sample: 'The quick brown fox', compatible: true },
  { family: 'DejaVu Sans', group: 'Sans-serif', displayName: 'Verdana', languages: 'Latin, Greek, Cyrillic', sample: 'Καλημέρα · Привіт' },
  { family: 'Noto Sans', group: 'Latin Extended', displayName: 'Noto Sans', languages: 'Latin, Vietnamese, Greek, Cyrillic', sample: 'Příliš žluťoučký kůň' },
  { family: 'Lato', group: 'Sans-serif', displayName: 'Lato', languages: 'Latin, Greek, Cyrillic', sample: 'Zażółć gęślą jaźń' },
  { family: 'Open Sans', group: 'Sans-serif', displayName: 'Open Sans', languages: 'Latin, Greek, Cyrillic (West African ɔ uses fallback)', sample: 'Nguyễn Thị Hương' },
  { family: 'Roboto', group: 'Sans-serif', displayName: 'Roboto', languages: 'Latin, Vietnamese, Greek, Cyrillic', sample: 'İstanbul · Καλημέρα' },
  { family: 'Source Sans 3', group: 'Sans-serif', displayName: 'Source Sans 3', languages: 'Latin, Vietnamese, Greek, Cyrillic', sample: 'Příliš žluťoučký kůň' },
  { family: 'DejaVu Serif', group: 'Serif', displayName: 'DejaVu Serif', languages: 'Latin, Greek, Cyrillic', sample: 'Καλημέρα · Привіт' },
  { family: 'Noto Serif', group: 'Serif', displayName: 'Noto Serif', languages: 'Latin, Vietnamese, Greek, Cyrillic', sample: 'Nguyễn Thị Hương' },
  { family: 'Merriweather', group: 'Serif', displayName: 'Merriweather', languages: 'Latin, Vietnamese, Cyrillic (Greek and ɔ use fallback)', sample: 'Zażółć gęślą jaźń' },
  { family: 'Montserrat', group: 'Display', displayName: 'Montserrat', languages: 'Latin, Vietnamese, Cyrillic (Greek uses fallback)', sample: 'Příliš žluťoučký kůň' },
  { family: 'Noto Sans Hebrew', group: 'Hebrew', displayName: 'Noto Sans Hebrew', languages: 'Hebrew', sample: 'שלום עולם' },
  { family: 'Noto Serif Hebrew', group: 'Hebrew', displayName: 'Noto Serif Hebrew', languages: 'Hebrew', sample: 'שלום עולם' },
  { family: 'Heebo', group: 'Hebrew', displayName: 'Heebo', languages: 'Hebrew', sample: 'שלום עולם' },
  { family: 'Noto Sans Georgian', group: 'Georgian', displayName: 'Noto Sans Georgian', languages: 'Georgian', sample: 'გამარჯობა' },
  { family: 'Noto Sans Armenian', group: 'Armenian', displayName: 'Noto Sans Armenian', languages: 'Armenian', sample: 'Բարեւ աշխարհ' },
];

const aliases: Array<[RegExp, EditorFontFamily]> = [
  // Embedded clone names are identities, not fallbacks. Keep these before
  // broader aliases such as "serif" or "mono".
  [/liberation\s*sans/, 'Liberation Sans'], [/liberation\s*serif/, 'Liberation Serif'],
  [/liberation\s*mono/, 'Liberation Mono'], [/carlito/, 'Carlito'], [/caladea/, 'Caladea'],
  [/gelasio/, 'Gelasio'], [/dejavu\s*sans/, 'DejaVu Sans'], [/dejavu\s*serif/, 'DejaVu Serif'],
  [/noto\s*sans\s*hebrew/, 'Noto Sans Hebrew'], [/noto\s*serif\s*hebrew/, 'Noto Serif Hebrew'],
  [/heebo/, 'Heebo'], [/noto\s*sans\s*georgian/, 'Noto Sans Georgian'],
  [/noto\s*sans\s*armenian/, 'Noto Sans Armenian'],
  [/noto\s*sans/, 'Noto Sans'], [/noto\s*serif/, 'Noto Serif'], [/open\s?sans/, 'Open Sans'],
  [/source\s?sans/, 'Source Sans 3'], [/lato/, 'Lato'], [/roboto/, 'Roboto'],
  [/merriweather/, 'Merriweather'], [/montserrat/, 'Montserrat'],
  [/symbol|zapfdingbats/, 'Liberation Sans'], // Base-14 Symbol fonts have no free metric-identical clone.
  [/arial|helvetica/, 'Liberation Sans'], [/times-roman|times/, 'Liberation Serif'],
  [/courier|mono|monaco|consolas/, 'Liberation Mono'], [/calibri/, 'Carlito'],
  [/cambria/, 'Caladea'], [/georgia/, 'Gelasio'], [/verdana|tahoma|geneva/, 'DejaVu Sans'],
  [/trebuchet/, 'DejaVu Sans'], [/lucida/, 'Noto Sans'],
  [/source\s?sans/, 'Source Sans 3'], [/cmu|latin modern|computer modern|lm roman/, 'Liberation Serif'],
];

export function getEditorFontAliasMatch(name?: string): EditorFontFamily | undefined {
  const normalized = normalizePdfFontName(name ?? '');
  return aliases.find(([pattern]) => pattern.test(normalized))?.[1];
}

export function normalizePdfFontName(name: string) {
  return name
    .replace(/^[^+]*\+/, '')
    .replace(/(?:[-, ]?(?:bolditalic|bold|italic|oblique|semibold|medium|light|regular|psmt|mt|ps|bd))+$/i, '')
    .trim()
    .toLowerCase();
}

const genericFontNames = new Set(['sans-serif', 'serif', 'monospace', 'helvetica', 'times-roman', 'courier']);
const latexFontPattern = /cmu|latin modern|computer modern|lm roman/i;
const serifNamePattern = /times|serif|garamond|charter/i;
const monoNamePattern = /mono|courier|consolas/i;
const embeddedIdentityLabels: Array<[RegExp, string]> = [
  [/liberation\s*sans/, 'Arial (compatible)'],
  [/liberation\s*serif/, 'Times New Roman (compatible)'],
  [/liberation\s*mono/, 'Courier New (compatible)'],
  [/carlito/, 'Calibri (compatible)'],
  [/caladea/, 'Cambria (compatible)'],
  [/gelasio/, 'Georgia (compatible)'],
  [/dejavu\s*sans/, 'DejaVu Sans'],
  [/dejavu\s*serif/, 'DejaVu Serif'],
  [/source\s?sans/, 'Source Sans'],
];

export function detectEditorFont(name?: string, hints: FontDetectionHints = {}): {
  font: EditorFontFamily;
  label: string;
  status: FontDetectionStatus;
  bold: boolean;
  italic: boolean;
} {
  const raw = name?.trim() ?? '';
  const normalized = normalizePdfFontName(raw);
  const match = getEditorFontAliasMatch(raw);
  const isGeneric = !raw || genericFontNames.has(normalized);
  const isLatexFallback = latexFontPattern.test(normalized);
  const descriptorFlags = hints.flags ?? hints.descriptorFlags ?? hints.descriptor?.flags ??
    hints.fontObj?.flags ?? hints.fontObj?.descriptor?.flags ?? 0;
  const serifFlag = hints.isSerifFont ?? hints.fontObj?.isSerifFont ?? Boolean(descriptorFlags & 2);
  const monospaceFlag = hints.isMonospace ?? hints.fontObj?.isMonospace ?? Boolean(descriptorFlags & 1);
  const boldFlag = hints.isBold ?? hints.fontObj?.isBold ?? Boolean(descriptorFlags & 262144);
  const italicFlag = hints.isItalic ?? hints.fontObj?.isItalic ?? Boolean(descriptorFlags & 64);
  const nameFallback = monoNamePattern.test(raw)
    ? 'Liberation Mono'
    : serifNamePattern.test(raw) ? 'Liberation Serif' : undefined;
  const flagFallback = monospaceFlag ? 'Liberation Mono' : serifFlag ? 'Liberation Serif' : undefined;
  const font = match ?? flagFallback ?? nameFallback ?? 'Liberation Sans';
  const registryFont = FONT_REGISTRY.find((entry) => entry.family === font);
  const status = match && !isGeneric && !isLatexFallback ? 'detected' : 'fallback';
  const identityLabel = embeddedIdentityLabels.find(([pattern]) => pattern.test(normalized))?.[1];
  const fallbackReason = flagFallback
    ? 'PDF font flags'
    : nameFallback ? 'font name hints'
    : boldFlag || italicFlag ? 'PDF font style flags'
    : 'default fallback';
  if (!match && import.meta.env?.DEV) {
    console.warn('[font-detect] unresolved:', raw || undefined);
  }
  return {
    font,
    label: isLatexFallback
      ? 'Fallback: Liberation Serif (LaTeX serif font name)'
      : status === 'fallback'
      ? `Fallback: ${font} (${fallbackReason})`
      : identityLabel ?? `${registryFont?.displayName ?? font}${registryFont?.compatible ? ' (compatible)' : ''}`,
    status,
    bold: boldFlag || /bold|bd/i.test(raw),
    italic: italicFlag || /italic|oblique/i.test(raw),
  };
}

export function editorFontVariant(bold: boolean | undefined, italic: boolean | undefined): FontVariant {
  return bold ? italic ? 'boldItalic' : 'bold' : italic ? 'italic' : 'regular';
}

export function cssFamilyFor(family: EditorFontFamily, fallbackFamily: EditorFontFamily = 'Noto Sans') {
  const fallback = family === fallbackFamily ? '' : `, "${fallbackFamily}"`;
  const generic = family.includes('Serif') || ['Caladea', 'Gelasio', 'Merriweather', 'Noto Serif Hebrew'].includes(family)
    ? 'serif'
    : family === 'Liberation Mono' ? 'monospace' : 'sans-serif';
  return `"${family}"${fallback}, ${generic}`;
}
