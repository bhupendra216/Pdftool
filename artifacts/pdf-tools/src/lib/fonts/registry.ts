import type { PDFDocument, PDFFont } from 'pdf-lib';

export type EditorFontFamily =
  | 'Liberation Sans' | 'Liberation Serif' | 'Liberation Mono'
  | 'Carlito' | 'Caladea' | 'Gelasio' | 'DejaVu Sans' | 'DejaVu Serif'
  | 'Noto Sans' | 'Noto Serif' | 'Lato' | 'Open Sans' | 'Roboto'
  | 'Source Sans 3' | 'Merriweather' | 'Montserrat';

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
};

const fontBytesCache = new Map<string, Promise<Uint8Array>>();
const textMetricsCache = new Map<string, Promise<EditorTextMetrics>>();
const resolvedTextMetrics = new Map<string, EditorTextMetrics>();
const previewFontCache = new Map<string, Promise<void>>();
const registeredFontkitDocuments = new WeakSet<PDFDocument>();

function fontKey(family: EditorFontFamily, variant: FontVariant) {
  return `${family}:${variant}`;
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

export function getCachedEditorTextMetrics(family: EditorFontFamily, variant: FontVariant) {
  return resolvedTextMetrics.get(fontKey(family, variant));
}

export async function loadEditorTextMetrics(family: EditorFontFamily, variant: FontVariant) {
  const key = fontKey(family, variant);
  const cached = textMetricsCache.get(key);
  if (cached) return cached;
  const pending = (async (): Promise<EditorTextMetrics> => {
    const { PDFDocument: ScratchPdfDocument } = await import('pdf-lib');
    const fontkit = (await import('@pdf-lib/fontkit')).default;
    const scratchDocument = await ScratchPdfDocument.create();
    scratchDocument.registerFontkit(fontkit);
    const primary = await scratchDocument.embedFont(await loadFontBytes(family, variant), { subset: true });
    const fallback = family === 'Noto Sans'
      ? primary
      : await scratchDocument.embedFont(await loadFontBytes('Noto Sans', variant), { subset: true });
    return {
      widthOfTextAtSize(text, size) {
        return splitTextForPdf(text, primary, fallback).reduce((width, run) =>
          width + run.font.widthOfTextAtSize(run.text, size), 0);
      },
      heightAtSize(size) {
        return primary.heightAtSize(size);
      },
    };
  })();
  textMetricsCache.set(key, pending);
  void pending.then((metrics) => resolvedTextMetrics.set(key, metrics));
  void pending.catch(() => textMetricsCache.delete(key));
  return pending;
}

export async function loadEditorPreviewFonts(family: EditorFontFamily, variant: FontVariant) {
  const families = family === 'Noto Sans' ? [family] : [family, 'Noto Sans' as const];
  await Promise.all(families.map(async (fontFamily) => {
    const key = fontKey(fontFamily, variant);
    const cached = previewFontCache.get(key);
    if (cached) return cached;
    const pending = loadFontBytes(fontFamily, variant).then(async (bytes) => {
      const face = new FontFace(fontFamily, bytes.slice().buffer as ArrayBuffer, {
        weight: variant === 'bold' || variant === 'boldItalic' ? '700' : '400',
        style: variant === 'italic' || variant === 'boldItalic' ? 'italic' : 'normal',
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
  return document.embedFont(bytes, { subset: true });
}

export function splitTextForPdf(text: string, primary: PDFFont, fallback: PDFFont): PdfTextFontRun[] {
  const runs: PdfTextFontRun[] = [];
  const primaryCharacters = new Set(primary.getCharacterSet());
  const fallbackCharacters = new Set(fallback.getCharacterSet());
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0;
    let selectedFont = primaryCharacters.has(codePoint) ? primary : fallback;
    let outputCharacter = character;
    if (selectedFont === fallback && !fallbackCharacters.has(codePoint)) {
      outputCharacter = fallbackCharacters.has(0xfffd) ? '\uFFFD' : '?';
    }
    try {
      selectedFont.encodeText(outputCharacter);
    } catch {
      selectedFont = fallback;
      try {
        selectedFont.encodeText(outputCharacter);
      } catch {
        outputCharacter = '?';
        selectedFont.encodeText(outputCharacter);
      }
    }
    const last = runs.at(-1);
    if (last?.font === selectedFont) last.text += outputCharacter;
    else runs.push({ text: outputCharacter, font: selectedFont });
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
  compatible?: boolean;
}> = [
  { family: 'Liberation Sans', group: 'Compatible', displayName: 'Arial', compatible: true },
  { family: 'Liberation Serif', group: 'Compatible', displayName: 'Times New Roman', compatible: true },
  { family: 'Liberation Mono', group: 'Compatible', displayName: 'Courier New', compatible: true },
  { family: 'Carlito', group: 'Compatible', displayName: 'Calibri', compatible: true },
  { family: 'Caladea', group: 'Compatible', displayName: 'Cambria', compatible: true },
  { family: 'Gelasio', group: 'Compatible', displayName: 'Georgia', compatible: true },
  { family: 'DejaVu Sans', group: 'Sans-serif', displayName: 'Verdana' },
  { family: 'Noto Sans', group: 'Sans-serif', displayName: 'Noto Sans' },
  { family: 'Lato', group: 'Sans-serif', displayName: 'Lato' },
  { family: 'Open Sans', group: 'Sans-serif', displayName: 'Open Sans' },
  { family: 'Roboto', group: 'Sans-serif', displayName: 'Roboto' },
  { family: 'Source Sans 3', group: 'Sans-serif', displayName: 'Source Sans 3' },
  { family: 'DejaVu Serif', group: 'Serif', displayName: 'DejaVu Serif' },
  { family: 'Noto Serif', group: 'Serif', displayName: 'Noto Serif' },
  { family: 'Merriweather', group: 'Serif', displayName: 'Merriweather' },
  { family: 'Montserrat', group: 'Display', displayName: 'Montserrat' },
];

const aliases: Array<[RegExp, EditorFontFamily]> = [
  // Embedded clone names are identities, not fallbacks. Keep these before
  // broader aliases such as "serif" or "mono".
  [/liberation\s*sans/, 'Liberation Sans'], [/liberation\s*serif/, 'Liberation Serif'],
  [/liberation\s*mono/, 'Liberation Mono'], [/carlito/, 'Carlito'], [/caladea/, 'Caladea'],
  [/gelasio/, 'Gelasio'], [/dejavu\s*sans/, 'DejaVu Sans'], [/dejavu\s*serif/, 'DejaVu Serif'],
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

export function cssFamilyFor(family: EditorFontFamily) {
  const fallbackFamily = family === 'Noto Sans' ? '' : ', "Noto Sans"';
  const generic = family.includes('Serif') || ['Caladea', 'Gelasio', 'Merriweather'].includes(family)
    ? 'serif'
    : family === 'Liberation Mono' ? 'monospace' : 'sans-serif';
  return `"${family}"${fallbackFamily}, ${generic}`;
}
