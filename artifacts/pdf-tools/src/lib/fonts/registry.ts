import { StandardFonts } from 'pdf-lib';

export type EditorFontFamily =
  | 'Liberation Sans' | 'Liberation Serif' | 'Liberation Mono'
  | 'Carlito' | 'Caladea' | 'Gelasio' | 'DejaVu Sans' | 'DejaVu Serif'
  | 'Noto Sans' | 'Noto Serif' | 'Lato' | 'Open Sans' | 'Roboto'
  | 'Source Sans 3' | 'Merriweather' | 'Montserrat';

export type FontVariant = 'regular' | 'bold' | 'italic' | 'boldItalic';
export type FontDetectionStatus = 'detected' | 'fallback';

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

export function detectEditorFont(name?: string): {
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
  const font = match ?? 'Liberation Sans';
  const registryFont = FONT_REGISTRY.find((entry) => entry.family === font);
  const status = match && !isGeneric && !isLatexFallback ? 'detected' : 'fallback';
  const identityLabel = embeddedIdentityLabels.find(([pattern]) => pattern.test(normalized))?.[1];
  if (!match && import.meta.env?.DEV) {
    console.warn('[font-detect] unresolved:', raw || undefined);
  }
  return {
    font,
    label: isLatexFallback
      ? 'serif (LaTeX fallback)'
      : status === 'fallback'
      ? `Unknown font — closest: ${registryFont?.displayName ?? 'Arial'} (compatible)`
      : identityLabel ?? `${registryFont?.displayName ?? font}${registryFont?.compatible ? ' (compatible)' : ''}`,
    status,
    bold: /bold|bd/i.test(raw),
    italic: /italic|oblique/i.test(raw),
  };
}

export function standardFontFor(family: EditorFontFamily, variant: FontVariant) {
  const serif = family === 'Liberation Serif' || family === 'Caladea' || family === 'Gelasio' || family === 'DejaVu Serif' || family === 'Noto Serif' || family === 'Merriweather';
  const mono = family === 'Liberation Mono';
  if (mono) return variant === 'boldItalic' ? StandardFonts.CourierBoldOblique : variant === 'bold' ? StandardFonts.CourierBold : variant === 'italic' ? StandardFonts.CourierOblique : StandardFonts.Courier;
  if (serif) return variant === 'boldItalic' ? StandardFonts.TimesRomanBoldItalic : variant === 'bold' ? StandardFonts.TimesRomanBold : variant === 'italic' ? StandardFonts.TimesRomanItalic : StandardFonts.TimesRoman;
  return variant === 'boldItalic' ? StandardFonts.HelveticaBoldOblique : variant === 'bold' ? StandardFonts.HelveticaBold : variant === 'italic' ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica;
}

export function cssFamilyFor(family: EditorFontFamily) {
  return `"${family}", ${family.includes('Serif') || ['Caladea', 'Gelasio', 'Merriweather'].includes(family) ? 'serif' : family === 'Liberation Mono' ? 'monospace' : 'sans-serif'}`;
}
