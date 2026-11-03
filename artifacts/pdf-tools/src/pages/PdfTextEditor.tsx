import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ErrorInfo, type PointerEvent as ReactPointerEvent } from 'react';
import { PDFDict, PDFDocument, PDFName, PDFString, rgb, type PDFFont } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import saveAs from 'file-saver';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown, Highlighter, Link2, Plus, Redo2, Italic, Underline, Undo2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { groupTextItemsIntoLines, groupTextLinesIntoBlocks, inferTextMargins, joinPdfTextLines, type PdfTextBlock, type PdfTextLineGroup } from '../lib/pdf-text-lines';
import { replacePdfPagesWithImages, type ReplacementRasterPdfPage } from '../lib/image-only-pdf';
import { getPdfViewportBounds, pdfToViewport, viewportToPdf, type PdfRect } from '../lib/pdf-coords';
import { getOriginalLineMaskRect, getReplacementBaseline, getSafeTextGeometry, medianRgbColor, roundPdfFontSize, validateTextItemGeometry } from '../lib/pdf-text-geometry';
import { darkestCommonPixelColor, getPdfTextFillColors } from '../lib/pdf-text-color';
import { assertEditorFontCoverage, captureEditorGlyphCheck, detectEditorFont, editorFontVariant, embedEditorFont, FONT_MENU_GROUP_ORDER, FONT_REGISTRY, getCachedEditorTextMetrics, getEditorFontCoverageWarning, getEditorFontMenuGroup, getSuggestedDevanagariFont, isDevanagariEditorFont, isLegacyDevanagariFontName, loadEditorPreviewFonts, loadEditorTextMetrics, cssFamilyFor, getEditorFontAliasMatch, looksLikeLegacyDevanagariText, normalizePdfFontName, resolveDevanagariEditorFont, resolveEditorFontFamily, splitTextForPdf, verifyEditorPdfGlyphs, type EditorFontFamily, type FontDetectionHints, type FontDetectionStatus, type PdfTextFontRun } from '../lib/fonts/registry';
import { drawShapedTextOutlines } from '../lib/fonts/draw-shaped-text';
import { containsDevanagariText, getGraphemeBoundaries, getGraphemeSegments, getShapedCaretStops, getUnsupportedScriptCharacters, UnrenderableGlyphError } from '../lib/fonts/text-shaping';
import { transliterateDevanagari } from '../lib/fonts/devanagari-input';
import { drawPdfTextForExtraction } from '../lib/pdf-text-actual-text';
import { countUnreadableTextPlaceholders, getUnreadableTextContext, replaceImpossibleDevanagariSigns, sanitizeEditorText, sanitizeExtractedPdfText, sanitizeTextForRendering, UNREADABLE_TEXT_PLACEHOLDER } from '../lib/pdf-text-sanitize';
import { getToolPath } from '../../../api-server/src/lib/content';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type FontFamily = EditorFontFamily;
type TextAlignment = 'left' | 'center' | 'right' | 'justified';

type PdfJsFontObject = FontDetectionHints & {
  name?: string;
};

type PdfTextStyle = FontDetectionHints & {
  fontFamily?: string;
  fontDetectionHints?: FontDetectionHints;
  ascent?: number;
  descent?: number;
};

type TextItem = {
  id: string;
  pageNumber: number;
  text: string;
  originalText: string;
  pdfRect: PdfRect;
  maskRect?: PdfRect;
  anchorX?: number;
  pdfX: number;
  pdfY: number;
  topLeftX?: number;
  topLeftY?: number;
  originalBaselineY?: number;
  originalLineTexts?: string[];
  originalLineBaselines?: number[];
  originalLineXs?: number[];
  lineRects?: PdfRect[];
  lineMaskRects?: PdfRect[];
  lineMaskColors?: string[];
  lineSpacing?: number;
  wholeParagraph?: boolean;
  damagedBlock?: boolean;
  retypeWholeParagraph?: boolean;
  unreadableCharacterCount?: number;
  replacedGroupIds?: string[];
  width?: number;
  height?: number;
  fontName: string;
  originalFontFamilyName?: string;
  fontDetectionHints?: FontDetectionHints;
  legacyDevanagariText?: boolean;
  fontFamily: FontFamily;
  fallbackFamily?: FontFamily;
  fontDetectionStatus?: FontDetectionStatus;
  fontDetectionLabel?: string;
  fontSize: number;
  color: string;
  sourceFillColor?: string;
  type: 'text' | 'delete';
  groupId?: string;
  isAdded?: boolean;
  maskColor?: string;
  ascent?: number;
  descent?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  highlightColor?: string;
  alignment?: TextAlignment;
  linkUrl?: string;
  manualWidth?: boolean;
};

type PageLayout = {
  pageNumber: number;
  viewport: any;
  viewportWidth: number;
  viewportHeight: number;
  styles: Record<string, any>;
  textItems: TextItem[];
  lineGroups: PdfTextLineGroup[];
  blocks: PdfTextBlock[];
};

function getPageBlock(page: PageLayout, groupId: string) {
  return page.blocks.find((block) =>
    block.id === groupId || block.groups.some((group) => group.id === groupId));
}

function median(values: number[]) {
  if (!values.length) return undefined;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function getBlockLinePitch(page: PageLayout, block: PdfTextBlock | undefined, fontSize: number) {
  const pitchFor = (groups: PdfTextLineGroup[]) => median(groups.slice(1).map((group, index) =>
    Math.abs(group.baselineY - groups[index].baselineY)));
  if (block) {
    const pitch = pitchFor(block.groups);
    if (pitch !== undefined) return pitch;
  }
  const sameSizeNeighborPitches = page.blocks
    .filter((candidate) => candidate !== block &&
      Math.abs(candidate.groups[0].dominantFontSize - fontSize) <= Math.max(0.5, fontSize * 0.02))
    .map((candidate) => pitchFor(candidate.groups))
    .filter((pitch): pitch is number => pitch !== undefined);
  return median(sameSizeNeighborPitches) ?? fontSize * 1.2;
}

function isReplacedByDraft(entry: TextItem, draft: TextItem) {
  return entry.id === draft.id ||
    Boolean(draft.groupId && entry.groupId === draft.groupId) ||
    Boolean(draft.replacedGroupIds?.includes(entry.groupId ?? ''));
}

function getChangedDamagedLineEdits(entry: TextItem): TextItem[] {
  const originalLines = entry.originalLineTexts ?? [];
  return entry.text.split(/\r?\n/).flatMap((line, index) => {
    if (line === originalLines[index]) return [];
    const isOriginalLine = index < originalLines.length;
    if (!isOriginalLine && !sanitizeTextForRendering(line).trim()) return [];
    const x = entry.originalLineXs?.[index] ?? entry.pdfX;
    const y = entry.originalLineBaselines?.[index] ??
      getReplacementBaseline(entry.originalLineBaselines?.[0] ?? entry.pdfY, index, entry.lineSpacing ?? entry.fontSize * 1.2);
    const safeText = sanitizeTextForRendering(line);
    return [{
      ...entry,
      id: entry.id,
      text: safeText,
      originalText: safeText,
      pdfRect: entry.lineRects?.[index] ?? {
        x,
        y: y - entry.fontSize * 0.25,
        width: entry.pdfRect.width,
        height: entry.fontSize,
      },
      maskRect: isOriginalLine ? entry.lineMaskRects?.[index] : undefined,
      pdfX: x,
      pdfY: y,
      originalBaselineY: y,
      originalLineTexts: [safeText],
      originalLineBaselines: [y],
      originalLineXs: [x],
      groupId: isOriginalLine ? entry.replacedGroupIds?.[index] : undefined,
      replacedGroupIds: undefined,
      damagedBlock: false,
      retypeWholeParagraph: false,
      wholeParagraph: true,
      unreadableCharacterCount: 0,
      maskColor: isOriginalLine ? entry.lineMaskColors?.[index] : undefined,
    }];
  });
}

type PageHistory = {
  past: TextItem[][];
  future: TextItem[][];
};

type ResizeState = {
  pointerId: number;
  edge: 'left' | 'right';
  pageLeft: number;
  startViewportRect: PdfRect;
  startPdfRect: PdfRect;
  viewport: any;
};

type MoveState = {
  pointerId: number;
  startX: number;
  startY: number;
  startPdfRect: PdfRect;
  viewport: any;
};

type ExportFailure = {
  editId: string;
  text: string;
  message: string;
  excludedEditIds: string[];
  unreadableText?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MASK_PADDING_PT = 1.5;

function normalizeHex(color: string | null | undefined) {
  if (!color) return '#111111';
  const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
    return `#${full.toLowerCase()}`;
  }
  const channels = color.match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)/i);
  if (channels) return `#${channels.slice(1, 4).map((value) => Math.round(Number(value)).toString(16).padStart(2, '0')).join('')}`;
  return '#111111';
}

function colorToPdf(color: string) {
  const value = Number.parseInt(normalizeHex(color).slice(1), 16);
  return rgb(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
}

function cssFontFamily(family: FontFamily, fallbackFamily: FontFamily | undefined, text: string) {
  const extraFallbacks: FontFamily[] = containsDevanagariText(text) &&
    family !== 'Noto Sans Devanagari' && family !== 'Noto Serif Devanagari' && family !== 'Mukta' &&
    fallbackFamily !== 'Noto Sans Devanagari' && fallbackFamily !== 'Noto Serif Devanagari' && fallbackFamily !== 'Mukta'
    ? ['Noto Sans Devanagari']
    : [];
  return cssFamilyFor(family, fallbackFamily, extraFallbacks);
}

function wrapPdfText(text: string, width: number, measure: (value: string) => number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measure(candidate) > width) {
        lines.push(line);
        line = '';
      }
      if (!line && measure(word) > width) {
        let chunk = '';
        for (const grapheme of getGraphemeSegments(word)) {
          if (chunk && measure(chunk + grapheme) > width) {
            lines.push(chunk);
            chunk = grapheme;
          } else chunk += grapheme;
        }
        line = chunk;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    lines.push(line);
  }
  return lines.length ? lines : [''];
}

function getEntryLines(entry: TextItem, measure: (value: string) => number) {
  if (entry.damagedBlock) return entry.text.split(/\r?\n/);
  if (entry.wholeParagraph && entry.text === entry.originalText && entry.originalLineTexts?.length) {
    return entry.originalLineTexts;
  }
  return wrapPdfText(entry.text, entry.pdfRect.width, measure);
}

function getEditableTextOffset(root: HTMLElement, node: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(root);
  range.setEnd(node, offset);
  return range.toString().length;
}

function setEditableTextWithPlaceholders(root: HTMLElement, text: string) {
  const fragment = document.createDocumentFragment();
  const placeholder = UNREADABLE_TEXT_PLACEHOLDER;
  let start = 0;
  let index = text.indexOf(placeholder);
  while (index >= 0) {
    if (index > start) fragment.append(document.createTextNode(text.slice(start, index)));
    const mark = document.createElement('mark');
    mark.dataset.unreadablePlaceholder = 'true';
    mark.textContent = placeholder;
    mark.style.color = '#111827';
    mark.style.backgroundColor = '#fde68a';
    mark.style.borderRadius = '2px';
    fragment.append(mark);
    start = index + placeholder.length;
    index = text.indexOf(placeholder, start);
  }
  if (start < text.length) fragment.append(document.createTextNode(text.slice(start)));
  root.replaceChildren(fragment);
}

function getEditableTextPoint(root: HTMLElement, offset: number): [Node, number] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  let remaining = offset;
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (remaining <= length) return [node, remaining];
    remaining -= length;
    node = walker.nextNode();
  }
  return [root, root.childNodes.length];
}

function snapDevanagariSelection(root: HTMLElement, text: string, boundaries = getGraphemeBoundaries(text)) {
  if (!containsDevanagariText(text) || root.textContent !== text) return;
  const selection = window.getSelection();
  if (!selection?.rangeCount || !root.contains(selection.anchorNode) || !root.contains(selection.focusNode)) return;
  const anchor = getEditableTextOffset(root, selection.anchorNode!, selection.anchorOffset);
  const focus = getEditableTextOffset(root, selection.focusNode!, selection.focusOffset);
  const floor = (offset: number) => boundaries.filter((boundary) => boundary <= offset).at(-1) ?? 0;
  const ceil = (offset: number) => boundaries.find((boundary) => boundary >= offset) ?? text.length;
  const nearest = (offset: number) => boundaries.reduce((result, boundary) =>
    Math.abs(boundary - offset) < Math.abs(result - offset) ? boundary : result, boundaries[0] ?? 0);
  const snappedAnchor = anchor === focus
    ? nearest(anchor)
    : anchor < focus ? floor(anchor) : ceil(anchor);
  const snappedFocus = anchor === focus
    ? snappedAnchor
    : anchor < focus ? ceil(focus) : floor(focus);
  if (anchor === snappedAnchor && focus === snappedFocus) return;
  const [anchorNode, anchorNodeOffset] = getEditableTextPoint(root, snappedAnchor);
  const [focusNode, focusNodeOffset] = getEditableTextPoint(root, snappedFocus);
  selection.setBaseAndExtent(anchorNode, anchorNodeOffset, focusNode, focusNodeOffset);
}

function handleDevanagariCaretKey(
  event: React.KeyboardEvent<HTMLDivElement>,
  text: string,
  boundaries = getGraphemeBoundaries(text),
) {
  const root = event.currentTarget;
  if (!containsDevanagariText(text) || root.textContent !== text) return;
  const selection = window.getSelection();
  if (!selection?.rangeCount || !root.contains(selection.anchorNode) || !root.contains(selection.focusNode)) return;
  if (!['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(event.key)) return;

  const anchor = getEditableTextOffset(root, selection.anchorNode!, selection.anchorOffset);
  const focus = getEditableTextOffset(root, selection.focusNode!, selection.focusOffset);
  let start = Math.min(anchor, focus);
  let end = Math.max(anchor, focus);
  const nearest = (offset: number) => boundaries.reduce((result, boundary) =>
    Math.abs(boundary - offset) < Math.abs(result - offset) ? boundary : result, boundaries[0] ?? 0);

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const towardPrevious = event.key === 'ArrowLeft';
    const target = event.shiftKey || start === end
      ? boundaries.findLast((boundary) => towardPrevious ? boundary < focus : boundary > focus) ?? focus
      : towardPrevious ? start : end;
    const anchorOffset = event.shiftKey ? nearest(anchor) : target;
    const focusOffset = event.shiftKey ? target : target;
    const [anchorNode, anchorNodeOffset] = getEditableTextPoint(root, anchorOffset);
    const [focusNode, focusNodeOffset] = getEditableTextPoint(root, focusOffset);
    selection.setBaseAndExtent(anchorNode, anchorNodeOffset, focusNode, focusNodeOffset);
    return;
  }

  if (start === end) {
    if (event.key === 'Backspace') start = boundaries.findLast((boundary) => boundary < focus) ?? focus;
    else end = boundaries.find((boundary) => boundary > focus) ?? focus;
  } else {
    start = boundaries.filter((boundary) => boundary <= start).at(-1) ?? start;
    end = boundaries.find((boundary) => boundary >= end) ?? end;
  }
  if (start === end) return;
  event.preventDefault();
  const [startNode, startNodeOffset] = getEditableTextPoint(root, start);
  const [endNode, endNodeOffset] = getEditableTextPoint(root, end);
  selection.setBaseAndExtent(startNode, startNodeOffset, endNode, endNodeOffset);
  selection.deleteFromDocument();
  root.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

function snapTextareaSelection(textarea: HTMLTextAreaElement, boundaries = getGraphemeBoundaries(textarea.value)) {
  const text = textarea.value;
  if (!containsDevanagariText(text)) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const floor = (offset: number) => boundaries.filter((boundary) => boundary <= offset).at(-1) ?? 0;
  const ceil = (offset: number) => boundaries.find((boundary) => boundary >= offset) ?? text.length;
  const nearest = (offset: number) => boundaries.reduce((result, boundary) =>
    Math.abs(boundary - offset) < Math.abs(result - offset) ? boundary : result, boundaries[0] ?? 0);
  if (start === end) textarea.setSelectionRange(nearest(start), nearest(start));
  else textarea.setSelectionRange(floor(start), ceil(end), textarea.selectionDirection);
}

function handleDevanagariTextareaKey(
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  updateText: (text: string) => void,
  boundaries = getGraphemeBoundaries(event.currentTarget.value),
) {
  const textarea = event.currentTarget;
  const text = textarea.value;
  if (!containsDevanagariText(text) || !['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(event.key)) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const floor = (offset: number) => boundaries.filter((boundary) => boundary <= offset).at(-1) ?? 0;
  const ceil = (offset: number) => boundaries.find((boundary) => boundary >= offset) ?? text.length;

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const backward = event.key === 'ArrowLeft';
    const active = textarea.selectionDirection === 'backward' ? start : end;
    const anchor = textarea.selectionDirection === 'backward' ? end : start;
    const target = event.shiftKey || start === end
      ? boundaries.findLast((boundary) => backward ? boundary < active : boundary > active) ?? active
      : backward ? start : end;
    if (event.shiftKey) {
      textarea.setSelectionRange(anchor, target, target < anchor ? 'backward' : 'forward');
    } else textarea.setSelectionRange(target, target);
    return;
  }

  const rangeStart = start === end
    ? event.key === 'Backspace' ? floor(start - 1) : start
    : floor(start);
  const rangeEnd = start === end
    ? event.key === 'Delete' ? ceil(end + 1) : end
    : ceil(end);
  if (rangeStart === rangeEnd) return;
  event.preventDefault();
  textarea.setRangeText('', rangeStart, rangeEnd, 'start');
  updateText(textarea.value);
}

type PhoneticBuffer = { root: HTMLElement; start: number; output: string; input: string };
type TextSelectionSnapshot = { root: HTMLElement; text: string; start: number; end: number };
function measurePdfTextRuns(runs: PdfTextFontRun[], size: number) {
  return runs.reduce((width, run) => width + run.font.widthOfTextAtSize(run.text, size), 0);
}

function sampleRingColor(context: CanvasRenderingContext2D, rect: PdfRect) {
  if (!context.canvas.width || !context.canvas.height) {
    return '#ffffff';
  }
  const left = clamp(Math.floor(rect.x), 0, context.canvas.width - 1);
  const top = clamp(Math.floor(rect.y), 0, context.canvas.height - 1);
  const right = clamp(Math.ceil(rect.x + rect.width), left + 1, context.canvas.width);
  const bottom = clamp(Math.ceil(rect.y + rect.height), top + 1, context.canvas.height);
  const pad = 4;
  const regionLeft = Math.max(0, left - pad);
  const regionTop = Math.max(0, top - pad);
  const regionRight = Math.min(context.canvas.width, right + pad);
  const regionBottom = Math.min(context.canvas.height, bottom + pad);
  const width = regionRight - regionLeft;
  const height = regionBottom - regionTop;
  if (width <= 0 || height <= 0) return '#ffffff';
  const pixels = context.getImageData(regionLeft, regionTop, width, height);
  const colors: Array<[number, number, number]> = [];
  for (let y = regionTop; y < regionBottom; y += 1) {
    for (let x = regionLeft; x < regionRight; x += 1) {
      if (x >= left && x < right && y >= top && y < bottom) continue;
      const index = ((y - regionTop) * pixels.width + x - regionLeft) * 4;
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      colors.push([red, green, blue]);
    }
  }
  const median = medianRgbColor(colors);
  if (!median) throw new Error('The page background could not be sampled around this text.');
  return median;
}

function sampleTextColor(context: CanvasRenderingContext2D, rect: PdfRect, backgroundColor: string) {
  if (!context.canvas.width || !context.canvas.height) return '#111111';
  const left = clamp(Math.floor(rect.x), 0, context.canvas.width - 1);
  const top = clamp(Math.floor(rect.y), 0, context.canvas.height - 1);
  const width = Math.max(1, Math.min(context.canvas.width - left, Math.ceil(rect.width)));
  const height = Math.max(1, Math.min(context.canvas.height - top, Math.ceil(rect.height)));
  if (width <= 0 || height <= 0) return '#111111';
  const pixels = context.getImageData(left, top, width, height).data;
  const bg = normalizeHex(backgroundColor).slice(1);
  const background = [0, 2, 4].map((offset) => Number.parseInt(bg.slice(offset, offset + 2), 16));
  const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const backgroundLuminance = luminance(background[0], background[1], background[2]);
  const candidates: Array<readonly [number, number, number]> = [];
  for (let index = 0; index < pixels.length; index += 4) {
    const color = [pixels[index], pixels[index + 1], pixels[index + 2]] as const;
    const delta = luminance(color[0], color[1], color[2]) - backgroundLuminance;
    if ((backgroundLuminance > 128 && delta < -35) || (backgroundLuminance <= 128 && delta > 35)) {
      candidates.push(color);
    }
  }
  const backgroundRgb = [0, 2, 4].map((offset) => Number.parseInt(bg.slice(offset, offset + 2), 16)) as [number, number, number];
  return darkestCommonPixelColor(candidates, backgroundRgb) ?? '#111111';
}

function inferTextAlignment(group: PdfTextLineGroup, block?: PdfTextBlock, wholeParagraph = false) {
  const alignment = block?.alignment ?? 'left';
  const pdfRect = block
    ? wholeParagraph
      ? { ...block.boundingBox }
      : { ...group.boundingBox, x: block.boundingBox.x, width: block.boundingBox.width }
    : group.boundingBox;
  const anchorX = alignment === 'center'
    ? block ? block.boundingBox.x + block.boundingBox.width / 2 : undefined
    : alignment === 'right' && block
      ? block.boundingBox.x + block.boundingBox.width
      : undefined;
  return { alignment, anchorX, pdfRect };
}

function getTextOverflowWarning(entry: TextItem, page: PageLayout) {
  const metrics = getCachedEditorTextMetrics(entry.fontFamily, editorFontVariant(entry.bold, entry.italic), entry.fallbackFamily, entry.text);
  if (!metrics) return undefined;
  const lines = getEntryLines(entry, (line) => metrics.widthOfTextAtSize(line, entry.fontSize));
  if (lines.length < 2) return undefined;
  const block = entry.groupId
    ? getPageBlock(page, entry.groupId)
    : undefined;
  const blockGroupIds = new Set(block?.groups.map((group) => group.id));
  const excludedIds = blockGroupIds.size > 0 ? blockGroupIds : undefined;
  const originalBottom = (entry.maskRect ?? entry.pdfRect).y;
  const baseline = entry.originalBaselineY ?? entry.pdfY;
  const lineHeight = entry.lineSpacing ?? entry.fontSize * 1.2;
  const textHeight = metrics.heightAtSize(entry.fontSize);
  const overflowRects = lines.flatMap((line, index) => {
    if (index === 0) return [];
    const lineBaseline = entry.wholeParagraph && entry.text === entry.originalText && entry.originalLineBaselines?.[index] !== undefined
      ? entry.originalLineBaselines[index]
      : baseline - index * lineHeight;
    const width = metrics.widthOfTextAtSize(line, entry.fontSize);
    const x = entry.alignment === 'center' && entry.anchorX !== undefined
      ? entry.anchorX - width / 2
      : entry.alignment === 'right' && entry.anchorX !== undefined
        ? entry.anchorX - width
        : entry.pdfRect.x;
    const y = lineBaseline - textHeight * 0.25;
    if (y >= originalBottom) return [];
    return [{ x, y, width, height: textHeight }];
  });
  const overlaps = page.lineGroups.filter((group) => !excludedIds?.has(group.id) && group.id !== entry.groupId && overflowRects.some((rect) => {
    const other = group.boundingBox;
    return rect.x < other.x + other.width && rect.x + rect.width > other.x &&
      rect.y < other.y + other.height && rect.y + rect.height > other.y;
  }));
  const pageBottom = getPdfViewportBounds(page.viewport).y;
  const extendsPastPage = overflowRects.some((rect) => rect.y < pageBottom);
  const selectedIndex = block?.groups.findIndex((group) => group.id === entry.groupId) ?? -1;
  const middleLineOverflow = !entry.wholeParagraph && selectedIndex >= 0 && selectedIndex < (block?.groups.length ?? 0) - 1;
  return overlaps.length || extendsPastPage || middleLineOverflow
    ? middleLineOverflow
      ? 'This line is not the last line of its paragraph. Use “Edit paragraph” to reflow it without overlapping the following line.'
      : 'Wrapped text extends below its original block and overlaps nearby PDF text or the page bottom.'
    : undefined;
}

async function readFileBytes(file: File) {
  const buffer = await file.arrayBuffer();
  if (!buffer.byteLength) throw new Error('The PDF file is empty.');
  return {
    pdfJsBytes: new Uint8Array(buffer.slice(0)),
    sourcePdfBytes: new Uint8Array(buffer.slice(0)),
  };
}

async function loadPageLayouts(pdfJsBytes: Uint8Array) {
  const document = await pdfjsLib.getDocument({ data: new Uint8Array(pdfJsBytes) }).promise;
  const layouts: PageLayout[] = [];
  let documentHasDevanagariText = false;
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const operatorList = await page.getOperatorList();
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const sourceTextItems = content.items.filter((item: any) => typeof item?.str === 'string' && item.str.trim());
    const sourceFillColors = getPdfTextFillColors(
      sourceTextItems.map((item: any) => item.str),
      operatorList,
      pdfjsLib.OPS,
    );
    const styles = Object.fromEntries(Object.entries(content.styles ?? {}).map(([fontId, style]) => {
      let fontObject: PdfJsFontObject | undefined;
      try {
        fontObject = page.commonObjs.get(fontId) as PdfJsFontObject;
      } catch {
        fontObject = undefined;
      }
      return [fontId, fontObject ? {
        ...style,
        fontFamily: fontObject.name ?? style.fontFamily,
        fontDetectionHints: fontObject,
      } : style];
    })) as Record<string, PdfTextStyle>;
    const textItems: TextItem[] = sourceTextItems
      .map((item: any, index: number) => {
        const transform = item.transform ?? [1, 0, 0, 1, 0, 0];
        const safe = getSafeTextGeometry(item, styles, 1);
        const itemWidth = Math.max(1, Number(item.width) || safe.width);
        const itemHeight = Math.max(1, Number(item.height) || safe.height);
        const baselineViewport = pdfToViewport(viewport, {
          x: Number(transform[4] ?? 0), y: Number(transform[5] ?? 0), width: 0, height: 0,
        });
        const baseline = viewportToPdf(viewport, baselineViewport.x, baselineViewport.y, 0, 0);
        const viewportRect = pdfToViewport(viewport, {
          x: baseline.x,
          y: baseline.y - itemHeight,
          width: itemWidth,
          height: itemHeight,
        });
        const pdfRect = viewportToPdf(viewport, viewportRect.x, viewportRect.y, viewportRect.width, viewportRect.height);
        const validation = validateTextItemGeometry(item, styles);
        if (!validation.ok) console.warn('[edit-pdf] using guarded text bounds', validation.reason);
        const fontName = String(item.fontName ?? '');
        const fontStyle = styles[fontName] as { ascent?: number; descent?: number } | undefined;
        const originalFontFamilyName = String(styles[fontName]?.fontFamily ?? fontName);
        const fontDetectionHints = styles[fontName]?.fontDetectionHints;
        const sanitized = sanitizeExtractedPdfText(item.str);
        const textContainsDevanagari = containsDevanagariText(sanitized.text);
        documentHasDevanagariText ||= textContainsDevanagari;
        const devanagariFont = textContainsDevanagari
          ? resolveDevanagariEditorFont(originalFontFamilyName, fontDetectionHints)
          : undefined;
        return {
          id: `page-${pageNumber}-item-${index}`,
          pageNumber,
          text: sanitized.text,
          originalText: sanitized.text,
          pdfRect,
          pdfX: baseline.x,
          pdfY: baseline.y,
          topLeftX: baselineViewport.x,
          topLeftY: baselineViewport.y,
          width: pdfRect.width,
          height: pdfRect.height,
          fontName,
          originalFontFamilyName,
          fontDetectionHints,
          legacyDevanagariText: isLegacyDevanagariFontName(originalFontFamilyName) ||
            looksLikeLegacyDevanagariText(sanitized.text),
          unreadableCharacterCount: sanitized.unreadableCharacterCount,
          fontFamily: devanagariFont?.family ??
            detectEditorFont(originalFontFamilyName, fontDetectionHints).font,
          fontDetectionStatus: devanagariFont?.status ??
            detectEditorFont(originalFontFamilyName, fontDetectionHints).status,
          fontSize: roundPdfFontSize(Number(item.height) || Number(safe.fontSize) || itemHeight),
          ascent: Number.isFinite(fontStyle?.ascent) ? Number(fontStyle?.ascent) * safe.fontSize : undefined,
          descent: Number.isFinite(fontStyle?.descent) ? Number(fontStyle?.descent) * safe.fontSize : undefined,
          color: sourceFillColors[index] ?? '#111111',
          sourceFillColor: sourceFillColors[index] ?? undefined,
          type: 'text' as const,
        };
      });
    const lineGroups = groupTextItemsIntoLines(textItems, 2).map((group) => ({ ...group, pageNumber }));
    layouts.push({
      pageNumber,
      viewport,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      styles,
      textItems,
      lineGroups,
      blocks: groupTextLinesIntoBlocks(lineGroups),
    });
  }
  return { document, layouts, documentHasDevanagariText };
}

type EditorRecoveryState = {
  file: File | null;
  sourcePdfBytes: Uint8Array | null;
  pdfJsBytes: Uint8Array | null;
  pdfDocument: any;
  pageLayouts: PageLayout[];
  edits: TextItem[];
  draft: TextItem | null;
  draftTouched: boolean;
  history: PageHistory;
};

let editorRecoveryState: EditorRecoveryState | null = null;

function PdfTextEditor() {
  if (typeof window !== 'undefined') {
    editorRecoveryState = null;
  }
  const [file, setFile] = useState<File | null>(() => editorRecoveryState?.file ?? null);
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(() => editorRecoveryState?.sourcePdfBytes ?? null);
  const [pdfJsBytes, setPdfJsBytes] = useState<Uint8Array | null>(() => editorRecoveryState?.pdfJsBytes ?? null);
  const [pdfDocument, setPdfDocument] = useState<any>(() => editorRecoveryState?.pdfDocument ?? null);
  const [pageLayouts, setPageLayouts] = useState<PageLayout[]>(() => editorRecoveryState?.pageLayouts ?? []);
  const [edits, setEdits] = useState<TextItem[]>(() => (editorRecoveryState?.edits ?? []).map((entry) => ({
    ...entry,
    fontFamily: resolveEditorFontFamily(entry.fontFamily).family,
    fallbackFamily: entry.fallbackFamily
      ? resolveEditorFontFamily(entry.fallbackFamily).family
      : entry.fallbackFamily,
  })));
  const [draft, setDraft] = useState<TextItem | null>(() => editorRecoveryState?.draft
    ? {
      ...editorRecoveryState.draft,
      fontFamily: resolveEditorFontFamily(editorRecoveryState.draft.fontFamily).family,
      fallbackFamily: editorRecoveryState.draft.fallbackFamily
        ? resolveEditorFontFamily(editorRecoveryState.draft.fallbackFamily).family
        : editorRecoveryState.draft.fallbackFamily,
    }
    : null);
  const [draftTouched, setDraftTouched] = useState(() => editorRecoveryState?.draftTouched ?? false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [addTextMode, setAddTextMode] = useState(false);
  const [pageScale, setPageScale] = useState(1);
  const [activePageNumber, setActivePageNumber] = useState(1);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState<Set<number>>(() => new Set([1]));
  const [status, setStatus] = useState('Waiting for PDF');
  const [error, setError] = useState<string | null>(null);
  const [exportWarnings, setExportWarnings] = useState<string[]>([]);
  const [exportFailure, setExportFailure] = useState<ExportFailure | null>(null);
  const [showDebugTextBoxes, setShowDebugTextBoxes] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [fontCoverageWarning, setFontCoverageWarning] = useState<string | null>(null);
  const [fontFallbackNotice, setFontFallbackNotice] = useState<string | null>(null);
  const [phoneticMode, setPhoneticMode] = useState(false);
  const [literalNext, setLiteralNext] = useState(false);
  const [documentHasDevanagariText, setDocumentHasDevanagariText] = useState(false);
  const [phoneticPanelWasShown, setPhoneticPanelWasShown] = useState(false);
  const [phoneticPanelCollapsed, setPhoneticPanelCollapsed] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.localStorage.getItem('edit-pdf-devanagari-panel-collapsed') === 'true';
    } catch (reason) {
      console.warn('[edit-pdf] could not restore Devanagari panel state', reason);
      return false;
    }
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<PageHistory>(() => editorRecoveryState?.history ?? { past: [], future: [] });
  const [mainAreaWidth, setMainAreaWidth] = useState(0);
  const [propertiesWidth, setPropertiesWidth] = useState(() => {
    const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth;
    const defaultWidth = clamp(viewportWidth * 0.3, 380, 520);
    try {
      const savedWidth = Number(window.localStorage.getItem('edit-pdf-properties-width'));
      return Number.isFinite(savedWidth) && savedWidth > 0
        ? clamp(savedWidth, 320, Math.max(320, viewportWidth * 0.6))
        : defaultWidth;
    } catch (reason) {
      console.warn('[edit-pdf] could not restore properties panel width', reason);
      return defaultWidth;
    }
  });
  const [renderVersion, setRenderVersion] = useState(0);
  const [fontMetricsVersion, setFontMetricsVersion] = useState(0);
  const panelTextRef = useRef<HTMLTextAreaElement | null>(null);
  const workspaceMainRef = useRef<HTMLElement | null>(null);
  const alignmentOverridesRef = useRef(new Map<string, TextAlignment>());
  const baseCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const overlayCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const thumbnailCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const editorRef = useRef<HTMLDivElement | null>(null);
  const composingRef = useRef(false);
  const phoneticBufferRef = useRef<PhoneticBuffer | null>(null);
  const activeTextInputRef = useRef<HTMLElement | null>(null);
  const textSelectionRef = useRef<TextSelectionSnapshot | null>(null);
  const literalNextRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savedTimeoutRef = useRef<number | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const moveRef = useRef<MoveState | null>(null);
  const currentDraftRef = useRef<TextItem | null>(null);
  const renderTasksRef = useRef<Set<{ promise: Promise<void>; cancel: () => void }>>(new Set());
  const phoneticPanelRef = useRef<HTMLDivElement | null>(null);
  const phoneticPanelScrollRef = useRef(0);
  const propertiesResizeRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [phoneticTopOffset, setPhoneticTopOffset] = useState(80);
  currentDraftRef.current = draft;
  editorRecoveryState = {
    file,
    sourcePdfBytes,
    pdfJsBytes,
    pdfDocument,
    pageLayouts,
    edits,
    draft,
    draftTouched,
    history,
  };

  useEffect(() => () => {
    editorRecoveryState = null;
  }, []);

  useEffect(() => {
    const entries = [...edits, ...(draft ? [draft] : [])].filter((entry) => entry.type === 'text');
    const uniqueEntries = new Map(entries.map((entry) => [
      `${entry.fontFamily}:${editorFontVariant(entry.bold, entry.italic)}:${entry.fallbackFamily ?? 'Noto Sans'}:${containsDevanagariText(entry.text)}`,
      entry,
    ]));
    if (!uniqueEntries.size) return;
    let cancelled = false;
    void Promise.all([...uniqueEntries.values()].map(async (entry) => {
      const variant = editorFontVariant(entry.bold, entry.italic);
      await Promise.all([
        loadEditorTextMetrics(entry.fontFamily, variant, entry.fallbackFamily, entry.text),
        loadEditorPreviewFonts(entry.fontFamily, variant, entry.fallbackFamily, entry.text),
      ]);
    })).then(() => {
      if (!cancelled) setFontMetricsVersion((version) => version + 1);
    }).catch((reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : 'Could not load the selected font.');
    });
    return () => { cancelled = true; };
  }, [draft?.fontFamily, draft?.fallbackFamily, draft?.bold, draft?.italic, draft?.text, edits]);

  useEffect(() => {
    if (!draft || draft.type !== 'text') {
      setFontCoverageWarning(null);
      return;
    }
    let cancelled = false;
    void loadEditorTextMetrics(draft.fontFamily, editorFontVariant(draft.bold, draft.italic), draft.fallbackFamily, draft.text)
      .then((metrics) => {
        if (cancelled) return;
        const missing = [...new Set(metrics.missingFromPrimary(draft.text))];
        const unavailable = metrics.missingCharacters(draft.text);
        const unsupported = getUnsupportedScriptCharacters(draft.text)
          .flatMap(({ characters }) => characters);
        const affected = [...new Set([...(unavailable.length ? unavailable : missing), ...unsupported])];
        setFontCoverageWarning(getEditorFontCoverageWarning(draft.fontFamily, affected, unavailable.length === 0));
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Could not load the selected font.');
      });
    return () => { cancelled = true; };
  }, [draft?.fontFamily, draft?.fallbackFamily, draft?.bold, draft?.italic, draft?.text]);

  useEffect(() => {
    try {
      window.localStorage.setItem('edit-pdf-devanagari-panel-collapsed', String(phoneticPanelCollapsed));
    } catch (reason) {
      console.warn('[edit-pdf] could not save Devanagari panel state', reason);
    }
  }, [phoneticPanelCollapsed]);

  useEffect(() => {
    if (!draft || draft.manualWidth || (!draft.isAdded && draft.text === draft.originalText)) return;
    const metrics = getCachedEditorTextMetrics(draft.fontFamily, editorFontVariant(draft.bold, draft.italic), draft.fallbackFamily, draft.text);
    if (!metrics) return;
    const width = Math.max(40, ...draft.text.split(/\r?\n/).map((line) => metrics.widthOfTextAtSize(line, draft.fontSize) + 8));
    if (Math.abs(width - draft.pdfRect.width) < 0.01) return;
    setDraft((current) => {
      if (!current || current.manualWidth) return current;
      const next = { ...current, pdfRect: { ...current.pdfRect, width } };
      currentDraftRef.current = next;
      return next;
    });
  }, [draft, fontMetricsVersion]);

  useEffect(() => () => {
    if (savedTimeoutRef.current !== null) window.clearTimeout(savedTimeoutRef.current);
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      const header = document.querySelector('header');
      const height = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
      setPhoneticTopOffset(height + 16);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    const header = document.querySelector('header');
    const observer = header ? new ResizeObserver(updateOffset) : null;
    if (header && observer) observer.observe(header);
    return () => {
      window.removeEventListener('resize', updateOffset);
      observer?.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (phoneticPanelRef.current) phoneticPanelRef.current.scrollTop = phoneticPanelScrollRef.current;
  }, [draft?.id, phoneticPanelWasShown]);

  useLayoutEffect(() => {
    const node = workspaceMainRef.current;
    if (!node) return;
    const updateWidth = () => setMainAreaWidth(node.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, [file]);

  const pageWidths = useMemo(() => new Map(pageLayouts.map((layout) => [
    layout.pageNumber,
    Math.min(layout.viewportWidth * pageScale, 900, mainAreaWidth > 0 ? Math.max(100, mainAreaWidth - 24) : 900),
  ])), [mainAreaWidth, pageLayouts, pageScale]);

  const makeViewport = useCallback((pageNumber: number, scale: number) => {
    const page = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!pdfDocument || !page) return null;
    return pdfDocument.getPage(pageNumber).then((pdfPage: any) => pdfPage.getViewport({ scale }));
  }, [pageLayouts, pdfDocument]);

  const loadFile = async (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setError('This PDF is larger than the 50 MB file limit.');
      return;
    }
    try {
      const data = await readFileBytes(selected);
      setFile(selected);
      setSourcePdfBytes(data.sourcePdfBytes);
      setPdfJsBytes(data.pdfJsBytes);
      setEdits([]);
      setDraft(null);
      setDraftTouched(false);
      setHistory({ past: [], future: [] });
      setError(null);
      setExportFailure(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read this PDF.');
    }
  };

  const getMaskColor = useCallback((pageNumber: number, rect: PdfRect) => {
    const canvas = baseCanvasRefs.current[pageNumber];
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const layout = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!canvas || !canvas.width || !canvas.height || !context || !layout) {
      return '#f8f8f8';
    }
    const scale = canvas.width / layout.viewportWidth;
    const viewport = layout.viewport.clone({ scale });
    const pixelRect = pdfToViewport(viewport, rect);
    try {
      return sampleRingColor(context, pixelRect);
    } catch (reason) {
      console.warn('[edit-pdf] could not sample page background for mask color', reason);
      return '#f8f8f8';
    }
  }, [pageLayouts, pdfDocument]);

  useEffect(() => {
    if (!pdfJsBytes) return;
    let cancelled = false;
    setStatus('Loading PDF...');
    setError(null);
    void loadPageLayouts(pdfJsBytes).then(({ document, layouts, documentHasDevanagariText: hasDevanagariText }) => {
      if (cancelled) return;
      setPdfDocument(document);
      setPageLayouts(layouts);
      setDocumentHasDevanagariText(hasDevanagariText);
      if (hasDevanagariText) setPhoneticPanelWasShown(true);
      setPhoneticMode(false);
      setLiteralNext(false);
      literalNextRef.current = false;
      phoneticBufferRef.current = null;
      setActivePageNumber(1);
      setVisiblePageNumbers(new Set([1]));
      setStatus('Editor ready');
    }).catch((reason: unknown) => {
      if (cancelled) return;
      const value = reason as { name?: string; code?: number };
      const passwordError = value.name === 'PasswordException' ||
        value.code === pdfjsLib.PasswordResponses.NEED_PASSWORD ||
        value.code === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;
      setError(passwordError
        ? 'This PDF is password-protected — unlock it with our Unlock PDF tool first.'
        : reason instanceof Error ? reason.message : 'This PDF could not be opened.');
      setStatus('Could not open PDF');
    });
    return () => { cancelled = true; };
  }, [pdfJsBytes]);

  useEffect(() => {
    if (!pdfDocument || !pageLayouts.length) return;
    let cancelled = false;
    void (async () => {
      await Promise.all([...renderTasksRef.current].map((task) => task.promise.catch(() => undefined)));
      if (cancelled) return;
      for (const page of pageLayouts) {
        if (cancelled) return;
        const base = baseCanvasRefs.current[page.pageNumber];
        if (!base) continue;
        if (!visiblePageNumbers.has(page.pageNumber)) {
          base.width = 0;
          base.height = 0;
          const overlay = overlayCanvasRefs.current[page.pageNumber];
          if (overlay) {
            overlay.width = 0;
            overlay.height = 0;
          }
          continue;
        }
        const cssScale = (pageWidths.get(page.pageNumber) ?? page.viewportWidth) / page.viewportWidth;
        const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
        const maxDimensionScale = Math.min(1, 4096 / Math.max(page.viewportWidth, page.viewportHeight));
        const scale = Math.max(0.1, cssScale * deviceScale * maxDimensionScale);
        const pdfPage = await pdfDocument.getPage(page.pageNumber);
        const viewport = pdfPage.getViewport({ scale });
        base.width = Math.max(1, Math.ceil(viewport.width));
        base.height = Math.max(1, Math.ceil(viewport.height));
        const context = base.getContext('2d', { willReadFrequently: true });
        if (!context) continue;
        context.clearRect(0, 0, base.width, base.height);
        const pageTask = pdfPage.render({ canvas: base, canvasContext: context, viewport });
        renderTasksRef.current.add(pageTask);
        try {
          await pageTask.promise;
        } catch (reason) {
          if (cancelled || (reason as { name?: string })?.name === 'RenderingCancelledException') return;
          throw reason;
        } finally {
          renderTasksRef.current.delete(pageTask);
        }
        if (cancelled) return;
        const overlay = overlayCanvasRefs.current[page.pageNumber];
        if (overlay) {
          overlay.width = base.width;
          overlay.height = base.height;
        }
        const thumbnail = thumbnailCanvasRefs.current[page.pageNumber];
        if (thumbnail) {
          const thumbViewport = pdfPage.getViewport({ scale: 0.16 });
          thumbnail.width = Math.ceil(thumbViewport.width);
          thumbnail.height = Math.ceil(thumbViewport.height);
          const thumbContext = thumbnail.getContext('2d');
          if (thumbContext) {
            const thumbnailTask = pdfPage.render({ canvas: thumbnail, canvasContext: thumbContext, viewport: thumbViewport });
            renderTasksRef.current.add(thumbnailTask);
            try {
              await thumbnailTask.promise;
            } catch (reason) {
              if (cancelled || (reason as { name?: string })?.name === 'RenderingCancelledException') return;
              throw reason;
            } finally {
              renderTasksRef.current.delete(thumbnailTask);
            }
          }
        }
      }
      if (!cancelled) setRenderVersion((value) => value + 1);
    })().catch((reason) => {
      if (!cancelled) {
        console.error('[edit-pdf] page render failed', reason);
        setError(reason instanceof Error ? reason.message : 'Could not render the PDF page.');
      }
    });
    return () => {
      cancelled = true;
      for (const task of renderTasksRef.current) task.cancel();
    };
  }, [activePageNumber, pageLayouts, pageWidths, pdfDocument, visiblePageNumbers]);

  useEffect(() => {
    if (!pageLayouts.length || !renderVersion) return;
    for (const page of pageLayouts) {
      const canvas = overlayCanvasRefs.current[page.pageNumber];
      const base = baseCanvasRefs.current[page.pageNumber];
      const context = canvas?.getContext('2d');
      const layout = pageLayouts.find((entry) => entry.pageNumber === page.pageNumber);
      if (!canvas || !base || !context || !layout) continue;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const viewport = layout.viewport.clone({ scale: canvas.width / layout.viewportWidth });
      const currentEntries = edits.filter((entry) => entry.pageNumber === page.pageNumber);
      for (const entry of currentEntries) {
        if (draft && isReplacedByDraft(entry, draft)) continue;
        drawPreviewEntry(context, entry, viewport);
      }
      if (draft?.pageNumber === page.pageNumber) drawPreviewEntry(context, draft, viewport);
    }
  }, [draft, edits, fontMetricsVersion, pageLayouts, renderVersion, pdfDocument]);

  useEffect(() => {
    if (!pageLayouts.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      setVisiblePageNumbers((current) => {
        const next = new Set(current);
        for (const entry of entries) {
          const number = Number((entry.target as HTMLElement).dataset.pageNumber);
          if (entry.isIntersecting) next.add(number);
          else next.delete(number);
        }
        return next;
      });
      const visible = visibleEntries
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      const number = Number((visible?.target as HTMLElement | undefined)?.dataset.pageNumber);
      if (Number.isInteger(number) && number > 0) setActivePageNumber(number);
    }, { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    for (const page of pageLayouts) {
      const element = document.getElementById(`pdf-page-${page.pageNumber}`);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pageLayouts.length]);

  const pushHistory = useCallback((next: TextItem[]) => {
    setHistory((current) => ({
      past: [...current.past, edits],
      future: [],
    }));
    setEdits(next);
  }, [edits]);

  const commitDraft = useCallback(() => {
    const current = currentDraftRef.current;
    if (!current) return;
    const alreadyCommitted = edits.some((entry) => entry.id === current.id ||
      (current.groupId && entry.groupId === current.groupId));
    if (!draftTouched && !current.isAdded && !alreadyCommitted) {
      setDraft(null);
      setDraftTouched(false);
      setSelectedGroupId(null);
      return;
    }
    const next = current.type === 'text' && !current.text.trim() && !current.retypeWholeParagraph
      ? edits.filter((entry) => !isReplacedByDraft(entry, current))
      : [...edits.filter((entry) => !isReplacedByDraft(entry, current)), current];
    pushHistory(next);
    setDraft(null);
    setDraftTouched(false);
    setSelectedGroupId(null);
    setStatus('Edits ready to download');
  }, [draftTouched, edits, pushHistory]);

  useEffect(() => {
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!currentDraftRef.current) return;
      if ((event.target as HTMLElement | null)?.closest('[data-pdf-edit-area]')) return;
      commitDraft();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [commitDraft]);

  const getTextColor = useCallback((pageNumber: number, group: PdfTextLineGroup) => {
    const canvas = baseCanvasRefs.current[pageNumber];
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const layout = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!canvas || canvas.width === 0 || canvas.height === 0 || !context || !layout) return '#111111';
    const viewport = layout.viewport.clone({ scale: canvas.width / layout.viewportWidth });
    const rect = pdfToViewport(viewport, group.boundingBox);
    const background = sampleRingColor(context, rect);
    return sampleTextColor(context, rect, background);
  }, [pageLayouts, pdfDocument]);

  const beginGroupEdit = useCallback(async (pageNumber: number, group: PdfTextLineGroup, wholeParagraph = false) => {
    const currentDraft = currentDraftRef.current;
    if (currentDraft && currentDraft.groupId !== group.id) {
      commitDraft();
    }
    const layout = pageLayouts.find((page) => page.pageNumber === pageNumber);
    const block = layout ? getPageBlock(layout, group.id) : undefined;
    const blockLines = block?.groups.map((line) => replaceImpossibleDevanagariSigns(line.text));
    const unreadableCharacterCount = block
      ? block.groups.reduce((count, line, index) =>
        count + line.items.reduce((lineCount, item) =>
          lineCount + Number((item as TextItem).unreadableCharacterCount ?? 0), 0) +
        (blockLines?.[index].unreadableCharacterCount ?? 0), 0)
      : Number(group.items.reduce((count, item) =>
        count + Number((item as TextItem).unreadableCharacterCount ?? 0), 0));
    const damagedBlock = Boolean(block && unreadableCharacterCount > 0);
    const damagedEditGroup = damagedBlock && block && blockLines
      ? {
        ...group,
        id: block.id,
        text: blockLines.map((line) => line.text).join('\n'),
        items: block.groups.flatMap((line) => line.items),
        boundingBox: block.boundingBox,
        baselineY: block.groups[0].baselineY,
        dominantFontSize: block.groups[0].dominantFontSize,
        runs: block.groups.flatMap((line) => line.runs),
        originalLineTexts: blockLines.map((line) => line.text),
        originalLineBaselines: block.groups.map((line) => line.baselineY),
        originalLineXs: block.groups.map((line) => line.boundingBox.x),
        lineRects: block.groups.map((line) => ({ ...line.boundingBox })),
        lineMaskRects: block.groups.map((line) => getOriginalLineMaskRect(
          line.boundingBox,
          line.baselineY,
          line.dominantFontSize,
          { ascent: line.ascent, descent: line.descent },
          MASK_PADDING_PT,
        )),
        lineMaskColors: block.groups.map((line) => getMaskColor(pageNumber, line.boundingBox)),
        replacedGroupIds: block.groups.map((line) => line.id),
        lineSpacing: layout ? getBlockLinePitch(layout, block, group.dominantFontSize) : group.dominantFontSize * 1.2,
        wholeParagraph: false,
        damagedBlock: true,
        unreadableCharacterCount,
      }
      : undefined;
    const editGroup: PdfTextLineGroup & Partial<TextItem> = damagedEditGroup ?? (wholeParagraph && block
      ? {
        ...group,
        id: block.id,
        text: joinPdfTextLines(block.groups),
        items: block.groups.flatMap((line) => line.items),
        boundingBox: block.boundingBox,
        baselineY: block.groups[0].baselineY,
        dominantFontSize: block.groups[0].dominantFontSize,
        runs: block.groups.flatMap((line) => line.runs),
        originalLineTexts: block.groups.map((line) => line.text),
        originalLineBaselines: block.groups.map((line) => line.baselineY),
        originalLineXs: block.groups.map((line) => line.boundingBox.x),
        replacedGroupIds: block.groups.map((line) => line.id),
        lineSpacing: layout ? getBlockLinePitch(layout, block, group.dominantFontSize) : group.dominantFontSize * 1.2,
        wholeParagraph: true,
      }
      : {
        ...group,
        lineSpacing: layout ? getBlockLinePitch(layout, block, group.dominantFontSize) : group.dominantFontSize * 1.2,
      });
    const existing = edits.find((entry) => entry.groupId === editGroup.id && entry.type === 'text');
    const sourceItems = editGroup.items as TextItem[];
    const textItem = containsDevanagariText(editGroup.text)
      ? [...sourceItems].sort((left, right) =>
        [...right.text].filter((character) => /[\u0900-\u097f]/u.test(character)).length -
        [...left.text].filter((character) => /[\u0900-\u097f]/u.test(character)).length)[0]
      : sourceItems[0];
    const spanFontName = textItem?.fontName;
    const resolvedStyle = spanFontName ? layout?.styles[spanFontName] : undefined;
    const rawFontName = textItem?.originalFontFamilyName ?? resolvedStyle?.fontFamily ?? spanFontName ?? '';
    const fontDetectionHints = textItem?.fontDetectionHints ?? resolvedStyle?.fontDetectionHints;
    const normalizedFontName = normalizePdfFontName(rawFontName ?? '');
    const aliasMatch = getEditorFontAliasMatch(rawFontName);
    const detectedFontResult = detectEditorFont(rawFontName, fontDetectionHints);
    const unsupportedScripts = getUnsupportedScriptCharacters(editGroup.text);
    const editContainsDevanagari = containsDevanagariText(editGroup.text);
    const devanagariFont = editContainsDevanagari
      ? resolveDevanagariEditorFont(rawFontName, fontDetectionHints)
      : undefined;
    const legacyDevanagariText = sourceItems.some((item) => item.legacyDevanagariText) ||
      isLegacyDevanagariFontName(rawFontName) || looksLikeLegacyDevanagariText(editGroup.text);
    const detectedFont = editContainsDevanagari && devanagariFont
      ? {
        ...detectedFontResult,
        font: devanagariFont.family,
        status: devanagariFont.status,
        label: devanagariFont.status === 'fallback'
          ? `Closest Devanagari match: ${devanagariFont.family}`
          : detectedFontResult.label,
      }
      : unsupportedScripts.length
        ? {
        ...detectedFontResult,
        font: 'Liberation Sans' as const,
        status: 'fallback' as const,
        label: 'Fallback: Arial (script not supported yet)',
      }
        : detectedFontResult;
    try {
      const variant = editorFontVariant(detectedFont.bold, detectedFont.italic);
      await Promise.all([
        loadEditorPreviewFonts(detectedFont.font, variant, 'Noto Sans', editGroup.text),
        loadEditorTextMetrics(detectedFont.font, variant, 'Noto Sans', editGroup.text),
      ]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load the font for text editing.');
      return;
    }
    setFontFallbackNotice(unsupportedScripts.length
      ? 'This script is not supported in Edit PDF. Export is blocked until the characters are removed.'
      : null);
    if (editContainsDevanagari) setPhoneticPanelWasShown(true);
    const color = existing?.color ?? group.items
      .map((item) => (item as TextItem).sourceFillColor)
      .find((fillColor): fillColor is string => Boolean(fillColor)) ?? getTextColor(pageNumber, group);
    const originalRect = { ...editGroup.boundingBox };
    const maskRect = (editGroup.wholeParagraph || editGroup.damagedBlock) && block
      ? {
        x: block.boundingBox.x - MASK_PADDING_PT,
        y: block.boundingBox.y - MASK_PADDING_PT,
        width: block.boundingBox.width + MASK_PADDING_PT * 2,
        height: block.boundingBox.height + MASK_PADDING_PT * 2,
      }
      : getOriginalLineMaskRect(originalRect, group.baselineY, group.dominantFontSize, {
        ascent: group.ascent,
        descent: group.descent,
      }, MASK_PADDING_PT);
    const detected = inferTextAlignment(editGroup, block, Boolean(editGroup.wholeParagraph));
    const alignmentKey = `${pageNumber}:${block?.id ?? editGroup.id}`;
    const selectedAlignment = alignmentOverridesRef.current.get(alignmentKey) ??
      existing?.alignment ??
      detected.alignment;
    const anchorX = selectedAlignment === 'center' && block
      ? block.boundingBox.x + block.boundingBox.width / 2
      : selectedAlignment === 'right' && block
        ? block.boundingBox.x + block.boundingBox.width
        : undefined;
    const pdfRect = { ...detected.pdfRect };
    const entry: TextItem = {
      ...(existing ?? {
        id: `edit-${Date.now()}`,
        pageNumber,
        groupId: editGroup.id,
        text: editGroup.text,
        originalText: editGroup.text,
        pdfRect,
        maskRect,
        anchorX,
        pdfX: pdfRect.x,
        pdfY: editGroup.baselineY,
        originalBaselineY: editGroup.baselineY,
        fontName: textItem?.fontName ?? 'Helvetica',
        originalFontFamilyName: rawFontName,
        fontDetectionHints,
        legacyDevanagariText,
        fontFamily: detectedFont.font,
        fontSize: roundPdfFontSize(editGroup.dominantFontSize),
        color,
        type: 'text' as const,
        maskColor: getMaskColor(pageNumber, originalRect),
        alignment: selectedAlignment,
        manualWidth: true,
        wholeParagraph: Boolean(editGroup.wholeParagraph),
        unreadableCharacterCount: editGroup.unreadableCharacterCount,
        bold: detectedFont.bold,
        italic: detectedFont.italic,
      }),
      fontDetectionStatus: detectedFont.status,
      fontDetectionLabel: detectedFont.label,
      originalFontFamilyName: rawFontName,
      fontDetectionHints,
      legacyDevanagariText,
      alignment: selectedAlignment,
      anchorX,
      lineSpacing: existing?.lineSpacing ?? editGroup.lineSpacing,
      replacedGroupIds: existing?.replacedGroupIds ??
        (block ? block.groups.map((line) => line.id) : undefined),
      wholeParagraph: existing?.wholeParagraph ?? Boolean(editGroup.wholeParagraph),
      damagedBlock: existing?.damagedBlock ?? editGroup.damagedBlock,
      unreadableCharacterCount: existing?.unreadableCharacterCount ?? editGroup.unreadableCharacterCount,
      originalLineTexts: existing?.originalLineTexts ?? editGroup.originalLineTexts ??
        (wholeParagraph && block ? block.groups.map((line) => line.text) : undefined),
      originalLineBaselines: existing?.originalLineBaselines ?? editGroup.originalLineBaselines ??
        (wholeParagraph && block ? block.groups.map((line) => line.baselineY) : undefined),
      originalLineXs: existing?.originalLineXs ?? editGroup.originalLineXs ??
        (wholeParagraph && block ? block.groups.map((line) => line.boundingBox.x) : undefined),
      lineRects: existing?.lineRects ?? editGroup.lineRects,
      lineMaskRects: existing?.lineMaskRects ?? editGroup.lineMaskRects,
      lineMaskColors: existing?.lineMaskColors ?? editGroup.lineMaskColors,
    };
    if (import.meta.env.DEV) {
      console.trace('[font-detect] selection', JSON.stringify({
          'span.fontName': spanFontName,
          'styles keys on this page (first 5)': Object.keys(layout?.styles ?? {}).slice(0, 5),
          'styles[fontName] resolved': resolvedStyle ? 'hit' : 'MISS',
          'raw fontFamily': rawFontName,
          normalized: normalizedFontName,
          'alias match': aliasMatch,
          'FINAL dropdown value being set': entry.fontFamily,
          'detection status': entry.fontDetectionStatus,
        }));
    }
    currentDraftRef.current = entry;
    setDraft(entry);
    setDraftTouched(false);
    setSelectedGroupId(group.id);
    requestAnimationFrame(() => panelTextRef.current?.focus());
    if (window.innerWidth < 1280) {
      requestAnimationFrame(() => {
        document.getElementById(`pdf-page-${pageNumber}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  }, [commitDraft, edits, getMaskColor, getTextColor, pageLayouts]);

  const setDraftProperty = (update: Partial<TextItem>) => {
    let safeUpdate = typeof update.text === 'string'
      ? { ...update, text: sanitizeEditorText(update.text) }
      : update;
    if (typeof safeUpdate.text === 'string' && getUnsupportedScriptCharacters(safeUpdate.text).length) {
      setFontFallbackNotice('This script is not supported in Edit PDF. Export is blocked until the characters are removed.');
    }
    if ('fontFamily' in update) {
      const resolved = resolveEditorFontFamily(update.fontFamily);
      safeUpdate = { ...update, fontFamily: resolved.family };
      if (isDevanagariEditorFont(resolved.family)) setPhoneticPanelWasShown(true);
      setFontFallbackNotice(resolved.usedFallback && !containsDevanagariText(draft?.text ?? '')
        ? 'This saved font is unavailable in Edit PDF.'
        : null);
    }
    if (update.alignment && draft?.groupId) {
      const page = pageLayouts.find((layout) => layout.pageNumber === draft.pageNumber);
      const block = page ? getPageBlock(page, draft.groupId) : undefined;
      alignmentOverridesRef.current.set(`${draft.pageNumber}:${block?.id ?? draft.groupId}`, update.alignment);
      safeUpdate = {
        ...safeUpdate,
        anchorX: update.alignment === 'center' && block
          ? block.boundingBox.x + block.boundingBox.width / 2
          : update.alignment === 'right' && block
            ? block.boundingBox.x + block.boundingBox.width
            : undefined,
      };
    }
    setDraftTouched(true);
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...safeUpdate };
      if (typeof safeUpdate.fontSize === 'number' && current.lineSpacing !== undefined) {
        next.lineSpacing = current.lineSpacing * next.fontSize / current.fontSize;
      }
      if (typeof safeUpdate.text === 'string' && !current.manualWidth) {
        const metrics = getCachedEditorTextMetrics(current.fontFamily, editorFontVariant(current.bold, current.italic), current.fallbackFamily, safeUpdate.text);
        const width = metrics
          ? Math.max(40, ...safeUpdate.text.split(/\r?\n/).map((line) => metrics.widthOfTextAtSize(line, next.fontSize) + 8))
          : Math.max(40, ...safeUpdate.text.split(/\r?\n/).map((line) => line.length * next.fontSize * 0.52 + 8));
        next.pdfRect = { ...next.pdfRect, width };
      }
      currentDraftRef.current = next;
      return next;
    });
  };

  const startWholeParagraphRetype = () => {
    setDraftProperty({
      text: '',
      damagedBlock: false,
      retypeWholeParagraph: true,
      wholeParagraph: true,
    });
  };

  const continueWholeParagraphEdit = () => {
    setDraftProperty({
      damagedBlock: false,
      retypeWholeParagraph: false,
      wholeParagraph: true,
    });
  };

  const updateTextFromInput = (root: HTMLElement, text: string) => {
    if (composingRef.current) return;
    setDraftProperty({ text });
    textSelectionRef.current = captureTextSelection(root);
    activeTextInputRef.current = root;
  };

  const captureTextSelection = (root: HTMLElement): TextSelectionSnapshot => {
    const isTextarea = root instanceof HTMLTextAreaElement;
    const text = isTextarea ? root.value : root.innerText;
    if (isTextarea) {
      return { root, text, start: root.selectionStart, end: root.selectionEnd };
    }
    const selection = window.getSelection();
    if (selection?.rangeCount && root.contains(selection.anchorNode) && root.contains(selection.focusNode)) {
      return {
        root,
        text,
        start: getEditableTextOffset(root, selection.anchorNode!, selection.anchorOffset),
        end: getEditableTextOffset(root, selection.focusNode!, selection.focusOffset),
      };
    }
    const saved = textSelectionRef.current;
    return saved?.root === root && saved.text === text ? saved : { root, text, start: text.length, end: text.length };
  };

  const rememberTextSelection = (root: HTMLElement) => {
    activeTextInputRef.current = root;
    textSelectionRef.current = captureTextSelection(root);
  };

  const handleTextBeforeInput = (root: HTMLElement, inputEvent: InputEvent) => {
    activeTextInputRef.current = root;
    if (composingRef.current || inputEvent.isComposing ||
      inputEvent.inputType.startsWith('insertComposition') || inputEvent.inputType !== 'insertText') {
      return;
    }
    const data = inputEvent.data;
    if (literalNextRef.current) {
      literalNextRef.current = false;
      setLiteralNext(false);
      phoneticBufferRef.current = null;
      return;
    }
    if (!phoneticMode || !data || !/^[A-Za-z~]$/u.test(data)) {
      phoneticBufferRef.current = null;
      return;
    }
    const isTextarea = root instanceof HTMLTextAreaElement;
    const text = isTextarea ? root.value : root.innerText;
    const start = isTextarea
      ? root.selectionStart
      : (() => {
        const selection = window.getSelection();
        return selection?.rangeCount && root.contains(selection.anchorNode)
          ? getEditableTextOffset(root, selection.anchorNode!, selection.anchorOffset)
          : text.length;
      })();
    const end = isTextarea
      ? root.selectionEnd
      : (() => {
        const selection = window.getSelection();
        return selection?.rangeCount && root.contains(selection.focusNode)
          ? getEditableTextOffset(root, selection.focusNode!, selection.focusOffset)
          : start;
      })();
    const previous = phoneticBufferRef.current;
    const continues = previous?.root === root && start === end &&
      start === previous.start + previous.output.length &&
      text.slice(previous.start, start) === previous.output;
    const romanInput = continues ? `${previous.input}${data}` : data;
    const replacementStart = continues ? previous.start : start;
    const output = transliterateDevanagari(romanInput);
    const next = `${text.slice(0, replacementStart)}${output}${text.slice(end)}`;
    inputEvent.preventDefault();
    phoneticBufferRef.current = { root, start: replacementStart, output, input: romanInput };
    if (isTextarea) {
      root.setRangeText(output, replacementStart, end, 'start');
      root.setSelectionRange(replacementStart + output.length, replacementStart + output.length);
    } else {
      root.innerText = next;
      const [node, offset] = getEditableTextPoint(root, replacementStart + output.length);
      window.getSelection()?.setBaseAndExtent(node, offset, node, offset);
    }
    textSelectionRef.current = {
      root,
      text: next,
      start: replacementStart + output.length,
      end: replacementStart + output.length,
    };
    setDraftProperty({ text: next });
  };

  useEffect(() => {
    const handleBeforeInput = (event: Event) => handleTextBeforeInput(event.currentTarget as HTMLElement, event as InputEvent);
    const targets = [
      ...document.querySelectorAll<HTMLElement>('textarea[aria-label="Text"]'),
      editorRef.current,
    ].filter((target): target is HTMLElement => target !== null);
    for (const target of targets) target.addEventListener('beforeinput', handleBeforeInput);
    return () => {
      for (const target of targets) target.removeEventListener('beforeinput', handleBeforeInput);
    };
  }, [phoneticMode, literalNext]);

  const handleTextCompositionStart = () => {
    composingRef.current = true;
    phoneticBufferRef.current = null;
    literalNextRef.current = false;
    setLiteralNext(false);
  };

  const handleTextCompositionEnd = (root: HTMLElement) => {
    composingRef.current = false;
    phoneticBufferRef.current = null;
    updateTextFromInput(root, root instanceof HTMLTextAreaElement ? root.value : root.innerText);
  };

  const handleTextKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>,
  ) => {
    if (composingRef.current || event.nativeEvent.isComposing) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      redo();
      return;
    }
    if (event.key === 'Escape' && phoneticMode) {
      event.preventDefault();
      literalNextRef.current = true;
      setLiteralNext(true);
      phoneticBufferRef.current = null;
      return;
    }
    if (event.key !== ' ' && event.key.length === 1 && /^[A-Za-z~]$/u.test(event.key)) return;
    phoneticBufferRef.current = null;
    const text = event.currentTarget instanceof HTMLTextAreaElement
      ? event.currentTarget.value
      : event.currentTarget.innerText;
    const metrics = draft
      ? getCachedEditorTextMetrics(draft.fontFamily, editorFontVariant(draft.bold, draft.italic), draft.fallbackFamily, text)
      : undefined;
    const caretBoundaries = draft && metrics
      ? getShapedCaretStops(text, metrics.shapeTextAtSize(text, draft.fontSize)).map((stop) => stop.offset)
      : getGraphemeBoundaries(text);
    if (event.currentTarget instanceof HTMLTextAreaElement) {
      handleDevanagariTextareaKey(
        event as React.KeyboardEvent<HTMLTextAreaElement>,
        (updatedText) => updateTextFromInput(event.currentTarget, updatedText),
        caretBoundaries,
      );
    } else {
      handleDevanagariCaretKey(event as React.KeyboardEvent<HTMLDivElement>, text, caretBoundaries);
    }
  };

  const centerDraftOnPage = async () => {
    if (!draft) return;
    const layout = pageLayouts.find((page) => page.pageNumber === draft.pageNumber);
    if (!layout) return;
    const pageBounds = getPdfViewportBounds(layout.viewport);
    const centerX = pageBounds.x + pageBounds.width / 2;
    const variant = editorFontVariant(draft.bold, draft.italic);
    const metrics = await loadEditorTextMetrics(draft.fontFamily, variant, draft.fallbackFamily, draft.text);
    await loadEditorPreviewFonts(draft.fontFamily, variant, draft.fallbackFamily, draft.text);
    const width = Math.max(1, ...draft.text.split(/\r?\n/).map((line) => metrics.widthOfTextAtSize(line, draft.fontSize)));
    setDraftProperty({
      pdfRect: { ...draft.pdfRect, x: centerX - width / 2, width },
      pdfX: centerX - width / 2,
      anchorX: centerX,
      alignment: 'center',
    });
  };

  const fitDraftToMargins = () => {
    if (!draft) return;
    const layout = pageLayouts.find((page) => page.pageNumber === draft.pageNumber);
    if (!layout) return;
    const block = getPageBlock(layout, draft.groupId ?? '');
    const margins = block
      ? { left: block.boundingBox.x, right: block.boundingBox.x + block.boundingBox.width }
      : inferTextMargins(layout.lineGroups.filter((group) => group.id !== draft.groupId));
    if (!margins) return;
    const pageBounds = getPdfViewportBounds(layout.viewport);
    const left = clamp(margins.left, pageBounds.x, pageBounds.x + pageBounds.width);
    const right = clamp(margins.right, left, pageBounds.x + pageBounds.width);
    const anchorX = draft.alignment === 'center'
      ? left + (right - left) / 2
      : draft.alignment === 'right' ? right : undefined;
    setDraftProperty({
      pdfRect: { ...draft.pdfRect, x: left, width: right - left },
      pdfX: left,
      anchorX,
    });
  };

  const startPropertiesResize = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault();
    propertiesResizeRef.current = { startX: event.clientX, startWidth: propertiesWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePropertiesResize = (event: ReactPointerEvent<HTMLElement>) => {
    const resize = propertiesResizeRef.current;
    if (!resize) return;
    const maxWidth = Math.max(320, window.innerWidth * 0.6);
    setPropertiesWidth(clamp(resize.startWidth - (event.clientX - resize.startX), 320, maxWidth));
  };

  const finishPropertiesResize = () => {
    propertiesResizeRef.current = null;
    try {
      window.localStorage.setItem('edit-pdf-properties-width', String(Math.round(propertiesWidth)));
    } catch (reason) {
      console.warn('[edit-pdf] could not save properties panel width', reason);
    }
  };

  const deleteGroup = (pageNumber: number, group: PdfTextLineGroup) => {
    const pdfRect = { ...group.boundingBox };
    const maskRect = getOriginalLineMaskRect(pdfRect, group.baselineY, group.dominantFontSize, {
      ascent: group.ascent,
      descent: group.descent,
    }, MASK_PADDING_PT);
    const textItem = group.items[0] as TextItem | undefined;
    const deletion: TextItem = {
      id: `delete-${Date.now()}`,
      pageNumber,
      groupId: group.id,
      text: '',
      originalText: group.text,
      pdfRect,
      maskRect,
      pdfX: pdfRect.x,
      pdfY: group.baselineY,
      fontName: textItem?.fontName ?? 'Helvetica',
      fontFamily: textItem?.fontFamily ?? 'Liberation Sans',
      fontSize: group.dominantFontSize,
      color: '#111111',
      type: 'delete',
      maskColor: getMaskColor(pageNumber, pdfRect),
    };
    pushHistory([...edits.filter((entry) => entry.groupId !== group.id), deletion]);
    setSelectedGroupId(null);
    currentDraftRef.current = null;
    setDraft(null);
    setDraftTouched(false);
  };

  const addTextAtPoint = async (pageNumber: number, clientX: number, clientY: number, pageElement: HTMLElement) => {
    const layout = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    const canvas = baseCanvasRefs.current[pageNumber];
    if (!layout || !canvas) return;
    const bounds = pageElement.getBoundingClientRect();
    const scale = bounds.width / layout.viewportWidth;
    const viewport = await makeViewport(pageNumber, scale);
    if (!viewport) return;
    const point = viewportToPdf(viewport, clientX - bounds.left, clientY - bounds.top, 0, 0);
    const pdfRect = { x: point.x, y: point.y - 18, width: 150, height: 18 };
    const sourceColor = layout.textItems
      .filter((item) => item.sourceFillColor)
      .map((item) => {
        const verticalGap = Math.max(item.pdfRect.y - point.y, point.y - item.pdfRect.y - item.pdfRect.height, 0);
        const horizontalGap = Math.max(item.pdfRect.x - point.x, point.x - item.pdfRect.x - item.pdfRect.width, 0);
        return { color: item.sourceFillColor, distance: verticalGap * 2 + horizontalGap };
      })
      .filter(({ distance }) => distance <= 20)
      .sort((left, right) => left.distance - right.distance)[0]?.color;
    const entry: TextItem = {
      id: `added-${Date.now()}`,
      pageNumber,
      text: 'New text',
      originalText: '',
      pdfRect,
      pdfX: point.x,
      pdfY: point.y,
      fontName: 'Helvetica',
      fontFamily: 'Liberation Sans',
      fontSize: 12,
      color: sourceColor ?? '#111111',
      type: 'text',
      isAdded: true,
      alignment: 'left',
    };
    currentDraftRef.current = entry;
    setDraft(entry);
    setDraftTouched(true);
    setAddTextMode(false);
  };

  const undo = () => {
    if (!history.past.length) return;
    const previous = history.past[history.past.length - 1];
    setEdits(previous);
    setHistory({ past: history.past.slice(0, -1), future: [edits, ...history.future] });
    currentDraftRef.current = null;
    setDraft(null);
    setDraftTouched(false);
  };

  const redo = () => {
    if (!history.future.length) return;
    const [next, ...future] = history.future;
    setEdits(next);
    setHistory({ past: [...history.past, edits], future });
    currentDraftRef.current = null;
    setDraft(null);
    setDraftTouched(false);
  };

  const resizeStart = (event: ReactPointerEvent, entry: TextItem, edge: ResizeState['edge']) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const pointerId = event.pointerId;
    const layout = pageLayouts.find((page) => page.pageNumber === entry.pageNumber);
    if (!layout) return;
    const scale = (pageWidths.get(entry.pageNumber) ?? layout.viewportWidth) / layout.viewportWidth;
    const viewport = layout.viewport.clone({ scale });
    const pageCanvas = handle.closest<HTMLElement>('[data-pdf-page-canvas]');
    if (!pageCanvas) return;
    const rect = pdfToViewport(viewport, entry.pdfRect);
    resizeRef.current = {
      pointerId,
      edge,
      pageLeft: pageCanvas.getBoundingClientRect().left,
      startViewportRect: rect,
      startPdfRect: entry.pdfRect,
      viewport,
    };
    handle.setPointerCapture(pointerId);
  };

  const moveStart = (event: ReactPointerEvent, entry: TextItem) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const layout = pageLayouts.find((page) => page.pageNumber === entry.pageNumber);
    if (!layout) return;
    const scale = (pageWidths.get(entry.pageNumber) ?? layout.viewportWidth) / layout.viewportWidth;
    const viewport = layout.viewport.clone({ scale });
    moveRef.current = {
      pointerId,
      startX,
      startY,
      startPdfRect: entry.pdfRect,
      viewport,
    };
    handle.setPointerCapture(pointerId);
  };

  const resizeMove = (event: ReactPointerEvent) => {
    const current = resizeRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const right = current.startViewportRect.x + current.startViewportRect.width;
    const pointerX = event.clientX - current.pageLeft;
    const left = current.edge === 'left'
      ? clamp(pointerX, 0, right - 40)
      : current.startViewportRect.x;
    const rightEdge = current.edge === 'right'
      ? Math.max(pointerX, left + 40)
      : right;
    const resized = viewportToPdf(
      current.viewport,
      left,
      current.startViewportRect.y,
      rightEdge - left,
      current.startViewportRect.height,
    );
    setDraftProperty({
      pdfRect: {
        ...current.startPdfRect,
        x: current.edge === 'left' ? resized.x : current.startPdfRect.x,
        width: resized.width,
      },
      manualWidth: true,
    });
  };

  const moveMove = (event: ReactPointerEvent) => {
    const current = moveRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    const startViewport = pdfToViewport(current.viewport, current.startPdfRect);
    const startPoint = viewportToPdf(current.viewport, startViewport.x, startViewport.y, 0, 0);
    const movedPoint = viewportToPdf(current.viewport, startViewport.x + dx, startViewport.y + dy, 0, 0);
    const deltaX = movedPoint.x - startPoint.x;
    const deltaY = movedPoint.y - startPoint.y;
    setDraftProperty({
      pdfRect: {
        ...current.startPdfRect,
        x: current.startPdfRect.x + deltaX,
        y: current.startPdfRect.y + deltaY,
      },
      anchorX: currentDraftRef.current?.anchorX === undefined
        ? undefined
        : currentDraftRef.current.anchorX + deltaX,
      pdfX: current.startPdfRect.x + deltaX,
      pdfY: current.startPdfRect.y + current.startPdfRect.height + deltaY,
      originalBaselineY: currentDraftRef.current?.originalBaselineY === undefined
        ? undefined
        : currentDraftRef.current.originalBaselineY + deltaY,
    });
  };

  const downloadEditedPdf = async (excludedEditIds = new Set<string>(), editsOverride?: TextItem[]) => {
    if (!sourcePdfBytes || !file) return;
    const requestedEdits = editsOverride ?? (draft
      ? [...edits.filter((entry) => !isReplacedByDraft(entry, draft)), draft]
      : edits);
    if (!requestedEdits.length) return;
    const finalEdits = requestedEdits
      .filter((entry) => !excludedEditIds.has(entry.id))
      .flatMap((entry) => entry.damagedBlock ? getChangedDamagedLineEdits(entry) : [entry]);
    commitDraft();
    setExportWarnings([]);
    setExportFailure(null);
    setError(null);
    setStatus('Preparing edited PDF...');
    setSaved(false);
    let failedEdit: TextItem | null = null;
    let failureMessage = '';
    let failureText = '';
    let unreadableText = '';
    const pendingGlyphRuns: Array<{
      font: PDFFont;
      family: EditorFontFamily;
      variant: ReturnType<typeof editorFontVariant>;
      text: string;
    }> = [];
    try {
      const source = await PDFDocument.load(sourcePdfBytes);
      const output = await PDFDocument.create();
      const fontCache = new Map<string, {
        primary: Awaited<ReturnType<typeof output.embedFont>>;
        fallback: Awaited<ReturnType<typeof output.embedFont>>;
        extraction: Awaited<ReturnType<typeof output.embedFont>>;
        devanagari?: Awaited<ReturnType<typeof output.embedFont>>;
      }>();
      const getFonts = async (entry: TextItem) => {
        const variant = editorFontVariant(entry.bold, entry.italic);
        const fallbackFamily = entry.fallbackFamily ?? 'Noto Sans';
        const needsDevanagariFallback = containsDevanagariText(entry.text) &&
          ![entry.fontFamily, fallbackFamily].some((family) =>
            family === 'Noto Sans Devanagari' || family === 'Noto Serif Devanagari' || family === 'Mukta');
        const key = `${entry.fontFamily}:${variant}:${fallbackFamily}:${needsDevanagariFallback}`;
        const cached = fontCache.get(key);
        if (cached) return cached;
        const primary = await embedEditorFont(output, entry.fontFamily, variant);
        const fallback = entry.fontFamily === fallbackFamily
          ? primary
          : await embedEditorFont(output, fallbackFamily, variant);
        const extraction = entry.fontFamily === 'Noto Sans'
          ? primary
          : fallbackFamily === 'Noto Sans'
            ? fallback
            : await embedEditorFont(output, 'Noto Sans', variant);
        const devanagari = needsDevanagariFallback
          ? await embedEditorFont(output, 'Noto Sans Devanagari', 'regular')
          : undefined;
        const fonts = { primary, fallback, extraction, devanagari };
        fontCache.set(key, fonts);
        return fonts;
      };
      const sourcePages = source.getPages();
      for (let index = 0; index < sourcePages.length; index += 1) {
        const [copied] = await output.copyPages(source, [index]);
        const page = output.addPage(copied);
        const pageEdits = finalEdits.filter((entry) => entry.pageNumber === index + 1);
        for (const entry of pageEdits) {
          try {
            const rect = entry.maskRect ?? getOriginalLineMaskRect(
              entry.pdfRect,
              entry.pdfY,
              entry.fontSize,
              { ascent: entry.ascent, descent: entry.descent },
              MASK_PADDING_PT,
            );
            if (entry.groupId || entry.type === 'delete') {
            if (!entry.maskColor) throw new Error('The original background could not be sampled for this text mask.');
            page.drawRectangle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                color: colorToPdf(entry.maskColor),
                opacity: 1,
                borderWidth: 0,
              });
            }
            if (entry.type === 'delete') continue;
            if (entry.highlightColor) {
              page.drawRectangle({
                x: entry.pdfRect.x,
                y: entry.pdfRect.y,
                width: entry.pdfRect.width,
                height: Math.max(entry.pdfRect.height, entry.fontSize * 1.25),
                color: colorToPdf(entry.highlightColor),
              });
            }
            const fonts = await getFonts(entry);
            const size = entry.fontSize;
            const variant = editorFontVariant(entry.bold, entry.italic);
            const fallbackFamily = entry.fallbackFamily ?? 'Noto Sans';
            const metrics = await loadEditorTextMetrics(entry.fontFamily, variant, fallbackFamily, entry.text);
            assertEditorFontCoverage(metrics, entry.fontFamily, fallbackFamily, entry.text);
            const lines = getEntryLines(entry, (line) => metrics.widthOfTextAtSize(line, size));
            const lineHeight = entry.lineSpacing ?? size * 1.2;
            const baseline = entry.originalBaselineY ?? entry.pdfY ?? (entry.pdfRect.y + entry.pdfRect.height - size);
            const preserveOriginalLines = entry.wholeParagraph && entry.text === entry.originalText &&
              !!entry.originalLineBaselines?.length;
            let paragraphExtractionDrawn = false;
            for (const [lineIndex, line] of lines.entries()) {
              const runs = splitTextForPdf(line, fonts.primary, fonts.fallback);
              const lineWidth = metrics.widthOfTextAtSize(line, size);
              const alignedX = entry.alignment === 'right' && entry.anchorX !== undefined
                ? entry.anchorX - lineWidth
                : entry.alignment === 'center' && entry.anchorX !== undefined
                  ? entry.anchorX - lineWidth / 2
                  : entry.pdfRect.x + (entry.alignment === 'center'
                    ? (entry.pdfRect.width - lineWidth) / 2
                    : entry.alignment === 'right' ? entry.pdfRect.width - lineWidth : 0);
              const x = preserveOriginalLines && entry.originalLineXs?.[lineIndex] !== undefined
                ? entry.originalLineXs[lineIndex]
                : alignedX;
              const y = preserveOriginalLines
                ? entry.originalLineBaselines?.[lineIndex] ?? getReplacementBaseline(baseline, lineIndex, lineHeight)
                : getReplacementBaseline(baseline, lineIndex, lineHeight);
              const color = colorToPdf(entry.color);
              if (/[^\u0000-\u007f]/u.test(line)) {
                drawShapedTextOutlines(page, metrics.shapeTextAtSize(line, size), { x, y, color });
                if (containsDevanagariText(line)) {
                  const extractionFont = fonts.devanagari ??
                    (entry.fontFamily === 'Noto Sans Devanagari' || entry.fontFamily === 'Noto Serif Devanagari' || entry.fontFamily === 'Mukta'
                      ? fonts.primary
                      : fallbackFamily === 'Noto Sans Devanagari' || fallbackFamily === 'Noto Serif Devanagari' || fallbackFamily === 'Mukta'
                        ? fonts.fallback
                        : fonts.extraction);
                  if (entry.wholeParagraph) {
                    if (!paragraphExtractionDrawn) {
                      await drawPdfTextForExtraction(output, page, extractionFont, entry.text, x, y);
                      paragraphExtractionDrawn = true;
                    }
                  } else {
                    await drawPdfTextForExtraction(output, page, extractionFont, line, x, y);
                  }
                } else {
                  let textX = x;
                  for (const run of splitTextForPdf(line, fonts.primary, fonts.fallback)) {
                    page.drawText(run.text, {
                      x: textX,
                      y,
                      size,
                      font: run.font,
                      color,
                      opacity: 0,
                    });
                    pendingGlyphRuns.push({
                      font: run.font,
                      family: run.font === fonts.primary ? entry.fontFamily : fallbackFamily,
                      variant,
                      text: run.text,
                    });
                    textX += run.font.widthOfTextAtSize(run.text, size);
                  }
                }
              } else {
                let runX = x;
                for (const run of runs) {
                  page.drawText(run.text, {
                    x: runX,
                    y,
                    size,
                    font: run.font,
                    color,
                  });
                  pendingGlyphRuns.push({
                    font: run.font,
                    family: run.font === fonts.primary ? entry.fontFamily : fallbackFamily,
                    variant,
                    text: run.text,
                  });
                  runX += run.font.widthOfTextAtSize(run.text, size);
                }
              }
              if (entry.underline) {
                page.drawLine({
                  start: { x, y: y - size * 0.12 },
                  end: { x: x + lineWidth, y: y - size * 0.12 },
                  thickness: Math.max(0.5, size * 0.05),
                  color: colorToPdf(entry.color),
                });
              }
            }
            if (entry.linkUrl) {
              const uri = new URL(entry.linkUrl);
              if (!['http:', 'https:', 'mailto:'].includes(uri.protocol)) throw new Error('Link must use http, https, or mailto.');
              const annotation = output.context.register(output.context.obj({
                Type: 'Annot',
                Subtype: 'Link',
                Rect: [entry.pdfRect.x, entry.pdfRect.y, entry.pdfRect.x + entry.pdfRect.width, entry.pdfRect.y + entry.pdfRect.height],
                Border: [0, 0, 0],
                A: { S: 'URI', URI: PDFString.of(entry.linkUrl) },
              }));
              page.node.addAnnot(annotation);
            }
          } catch (reason) {
            console.error('[edit-pdf] unable to export text edit', reason);
            failedEdit = entry;
            failureMessage = reason instanceof UnrenderableGlyphError
              ? `A character near “${reason.textContext}” could not be rendered.`
              : reason instanceof Error
                ? reason.message
                : 'This text edit could not be exported. Check the text and try again.';
            failureText = reason instanceof UnrenderableGlyphError
              ? reason.textContext
              : entry.text || 'Deleted text';
            unreadableText = reason instanceof UnrenderableGlyphError ? reason.clusterText : '';
            break;
          }
        }
        if (failedEdit) break;
      }

      if (failedEdit) {
        setExportFailure({
          editId: failedEdit.id,
          text: failureText,
          message: `Page ${failedEdit.pageNumber}: ${failureMessage}`,
          excludedEditIds: [...excludedEditIds, failedEdit.id],
          unreadableText,
        });
        setStatus('Export needs your attention.');
        return;
      }
      const glyphChecks = await Promise.all(pendingGlyphRuns.map((run) =>
        captureEditorGlyphCheck(run.font, run.family, run.variant, run.text)));
      let bytes = await output.save();
      await verifyEditorPdfGlyphs(bytes, glyphChecks);
      if (bytes.byteLength > 100 * 1024 * 1024) {
        setExportWarnings((warnings) => [...warnings, 'Output is unexpectedly large — this PDF may have issues']);
      }
      if (bytes.byteLength > sourcePdfBytes.byteLength + 2 * 1024 * 1024) {
        setExportWarnings((warnings) => [...warnings, 'Output is unexpectedly large — this PDF may have issues']);
      }
      if (import.meta.env.DEV) {
        const savedPdf = await PDFDocument.load(bytes);
        const fontCounts = new Map<string, number>();
        for (const [, object] of savedPdf.context.enumerateIndirectObjects()) {
          if (!(object instanceof PDFDict) || object.get(PDFName.of('Type'))?.toString() !== '/Font') continue;
          const subtype = object.get(PDFName.of('Subtype'))?.toString() ?? 'Font';
          fontCounts.set(subtype, (fontCounts.get(subtype) ?? 0) + 1);
        }
        for (const [fontType, count] of fontCounts) {
          if (count > 4) console.error(`[edit-pdf] font cache sanity check: ${fontType} appears ${count} times`);
        }
      }
      if (finalEdits.some((entry) => entry.type === 'delete')) {
        const rendered = await pdfjsLib.getDocument({ data: bytes }).promise;
        const deletionPages = new Set(finalEdits.filter((entry) => entry.type === 'delete').map((entry) => entry.pageNumber));
        const rasterPages: ReplacementRasterPdfPage[] = [];
        for (const pageNumber of deletionPages) {
          const page = await rendered.getPage(pageNumber);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(2, 5000 / Math.max(base.width, base.height));
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error(`Could not flatten page ${pageNumber}.`);
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          rasterPages.push({ pageNumber, imageDataUrl: canvas.toDataURL('image/png'), width: base.width, height: base.height });
        }
        bytes = await replacePdfPagesWithImages(bytes, rasterPages);
      }
      const downloadBytes = new Uint8Array(bytes.length);
      downloadBytes.set(bytes);
      saveAs(new Blob([downloadBytes.buffer], { type: 'application/pdf' }), `${file.name.replace(/\.pdf$/i, '')}-edited.pdf`);
      setStatus('Edited PDF downloaded in your browser.');
      setSaved(true);
      if (savedTimeoutRef.current !== null) window.clearTimeout(savedTimeoutRef.current);
      savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 2200);
    } catch (reason) {
      console.error('[edit-pdf] export failed', reason);
      const message = reason instanceof Error ? reason.message : 'Could not create the edited PDF.';
      setError(message);
      setStatus('Could not create the edited PDF.');
    }
  };

  const selectedGroup = pageLayouts.flatMap((page) => page.lineGroups).find((group) => group.id === selectedGroupId);
  const selectedBlock = selectedGroup
    ? pageLayouts
      .map((page) => ({ page, block: getPageBlock(page, selectedGroup.id) }))
      .find((entry) => entry.block)?.block
    : undefined;
  const draftIsPending = draft && (draftTouched || draft.isAdded ||
    edits.some((entry) => entry.id === draft.id || (draft.groupId && entry.groupId === draft.groupId)));
  const pendingEdits = draftIsPending && draft
    ? [...edits.filter((entry) => !isReplacedByDraft(entry, draft)), draft]
    : edits;
  const pendingCount = pendingEdits.length;
  const draftPage = draft ? pageLayouts.find((page) => page.pageNumber === draft.pageNumber) : undefined;
  const draftOverflowWarning = draft && draftPage ? getTextOverflowWarning(draft, draftPage) : undefined;
  const devanagariFallback = draft && containsDevanagariText(draft.text) &&
    !isDevanagariEditorFont(draft.fontFamily)
    ? getSuggestedDevanagariFont(draft.originalFontFamilyName ?? '', draft.fontDetectionHints)
    : undefined;
  const devanagariFallbackLabel = devanagariFallback
    ? FONT_REGISTRY.find((font) => font.family === devanagariFallback)?.displayName ?? devanagariFallback
    : undefined;
  const draftFontDisplayName = draft
    ? FONT_REGISTRY.find((font) => font.family === draft.fontFamily)?.displayName ?? draft.fontFamily
    : undefined;
  const missingDevanagariCharacters = draft
    ? [...new Set([...draft.text].filter((character) => /[\u0900-\u097f]/u.test(character)))].join(' ')
    : '';
  const draftUnreadableCount = draft ? countUnreadableTextPlaceholders(draft.text) : 0;
  const showPhoneticControls = documentHasDevanagariText || phoneticPanelWasShown;
  const originalFontUnavailable = draft && containsDevanagariText(draft.text) &&
    draft.fontDetectionStatus === 'fallback' && isDevanagariEditorFont(draft.fontFamily)
    ? draft.originalFontFamilyName || draft.fontName
    : undefined;
  const keepPanelInteraction = (event: ReactPointerEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const renderPhoneticControls = (className: string) => showPhoneticControls && (
    <div
      ref={phoneticPanelRef}
      data-pdf-edit-area
      data-pdf-phonetic-panel
      onScroll={(event) => { phoneticPanelScrollRef.current = event.currentTarget.scrollTop; }}
      style={{
        top: phoneticTopOffset,
        maxHeight: `calc(100vh - ${phoneticTopOffset + 16}px)`,
      }}
      className={`sticky w-full min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-lg ${className}`}
    >
      <div className="mb-2 flex min-w-0 items-center justify-between gap-1">
        <h3 className="min-w-0 break-words text-sm font-semibold text-foreground">Hindi / Nepali typing</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="!h-8 !w-8 !min-w-0 !shrink-0 !gap-0 !p-0 overflow-hidden leading-none"
          aria-label={phoneticPanelCollapsed ? 'Expand Hindi / Nepali typing panel' : 'Collapse Hindi / Nepali typing panel'}
          aria-expanded={!phoneticPanelCollapsed}
          onPointerDown={keepPanelInteraction}
          onClick={() => setPhoneticPanelCollapsed((collapsed) => !collapsed)}
        ><span aria-hidden="true" className="block h-4 w-4 overflow-hidden">
          <ChevronDown className={`h-4 w-4 transition-transform ${phoneticPanelCollapsed ? '-rotate-90' : ''}`} />
        </span></Button>
      </div>
      {!phoneticPanelCollapsed && <>
        <p className="mb-2 break-words rounded-md bg-muted px-2 py-1.5 text-xs text-foreground">
          Type Hindi or Nepali: turn on phonetic typing, or use your device&apos;s Hindi or Nepali keyboard.
        </p>
        <div className="flex min-w-0 flex-col gap-2">
          <Button
            type="button"
            variant={phoneticMode ? 'default' : 'outline'}
            size="sm"
            className="h-auto min-h-9 min-w-0 w-full overflow-hidden whitespace-normal break-words pr-4 leading-tight [overflow-wrap:anywhere]"
            aria-pressed={phoneticMode}
            onPointerDown={keepPanelInteraction}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={() => {
              phoneticBufferRef.current = null;
              setPhoneticMode((enabled) => !enabled);
              setLiteralNext(false);
              literalNextRef.current = false;
              setPhoneticPanelWasShown(true);
            }}
          ><span className="min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere]">
            Type Devanagari (phonetic): {phoneticMode ? 'On' : 'Off'}
          </span></Button>
          <span role="status" className="min-w-0 break-words text-xs text-muted-foreground">
            {literalNext ? 'Type one literal Latin character next' : phoneticMode ? 'Phonetic mode on · Esc, then a letter, types it literally' : 'Normal typing · characters are inserted as typed'}
          </span>
        </div>
        <details className="mt-2 min-w-0 rounded-md border border-border px-2 py-1.5 text-xs">
          <summary
            className="cursor-pointer break-words font-medium text-foreground"
            onPointerDown={keepPanelInteraction}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              const details = event.currentTarget.parentElement as HTMLDetailsElement | null;
              if (details) details.open = !details.open;
            }}
          >Phonetic cheat sheet</summary>
          <p className="mt-2 break-words text-muted-foreground">
            namaste → नमस्ते · nepal → नेपाल · kshatriya → क्षत्रिय · gyaan → ज्ञान · aa → आ · ii → ई · M → ं · ~ → ँ
          </p>
        </details>
      </>}
    </div>
  );
  const renderFormatPanel = (className: string, desktopDocked = false) => draft && (
    <div
      data-pdf-edit-area
      className={`relative min-w-0 rounded-2xl border border-border bg-card p-4 shadow-lg ${className}`}
      style={desktopDocked ? { width: propertiesWidth, maxWidth: '60vw' } : undefined}
    >
      {desktopDocked && <div
        role="separator"
        aria-label="Resize Text properties panel"
        aria-orientation="vertical"
        title="Drag to resize"
        tabIndex={0}
        className="absolute -left-2 top-0 z-10 h-full w-1 cursor-col-resize rounded bg-border hover:bg-primary focus-visible:bg-primary"
        onPointerDown={startPropertiesResize}
        onPointerMove={movePropertiesResize}
        onPointerUp={finishPropertiesResize}
        onPointerCancel={finishPropertiesResize}
      />}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Text properties</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" aria-label="Undo" title="Undo" disabled={!history.past.length} onClick={undo}><Undo2 /></Button>
          <Button variant="outline" size="icon" aria-label="Redo" title="Redo" disabled={!history.future.length} onClick={redo}><Redo2 /></Button>
        </div>
      </div>
      {draftOverflowWarning && <p role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">{draftOverflowWarning}</p>}
      {draft?.legacyDevanagariText && <p role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">This PDF uses a legacy Nepali font, so its text cannot be read as Unicode. Edits may not look right.</p>}
      {originalFontUnavailable && <div role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">
        <p>This PDF&apos;s font ({originalFontUnavailable}) is not available. Using {draft!.fontFamily}, the closest match.</p>
        <label className="mt-2 block">Choose another Devanagari font
          <select
            aria-label="Choose another Devanagari font"
            className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
            value={draft!.fontFamily}
            onChange={(event) => setDraftProperty({ fontFamily: resolveEditorFontFamily(event.target.value).family })}
          >
            {FONT_REGISTRY.filter((font) => isDevanagariEditorFont(font.family))
              .map((font) => <option key={font.family} value={font.family}>{font.family}</option>)}
          </select>
        </label>
      </div>}
      {devanagariFallback && <div role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">
        <p>{draftFontDisplayName} does not include Devanagari. Use {devanagariFallbackLabel}.</p>
        <Button type="button" size="sm" className="mt-2" onClick={() => setDraftProperty({ fontFamily: devanagariFallback })}>Switch</Button>
        <details className="mt-2">
          <summary className="cursor-pointer underline">Show characters</summary>
          <p className="mt-1 break-words">{missingDevanagariCharacters}</p>
        </details>
      </div>}
      {fontCoverageWarning && !devanagariFallback && <p role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">{fontCoverageWarning}</p>}
      {fontFallbackNotice && <p role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">{fontFallbackNotice}</p>}
      {renderPhoneticControls('mb-3 min-[900px]:hidden')}
      {draftUnreadableCount > 0 && <p role="status" className="mb-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">
        {draftUnreadableCount} {draftUnreadableCount === 1 ? 'character' : 'characters'} in this paragraph could not be read from the PDF. Check the highlighted spots.
      </p>}
      {draft.damagedBlock && <div className="mb-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={startWholeParagraphRetype}>Retype whole paragraph</Button>
        <Button type="button" variant="outline" size="sm" onClick={continueWholeParagraphEdit}>Edit anyway</Button>
      </div>}
      <label className="mb-3 block text-xs text-muted-foreground">Text
        <textarea
        dir="ltr"
          aria-label="Text"
          placeholder="Select or double-click text on the page to edit it here."
          rows={Math.min(50, Math.max(6, Math.ceil(draft.text.length / 30)))}
          value={draft.text}
          ref={panelTextRef}
          onFocus={(event) => rememberTextSelection(event.currentTarget)}
          onSelect={(event) => rememberTextSelection(event.currentTarget)}
          onInput={(event) => updateTextFromInput(event.currentTarget, event.currentTarget.value)}
          onChange={(event) => updateTextFromInput(event.currentTarget, event.target.value)}
          onCompositionStart={handleTextCompositionStart}
          onCompositionUpdate={() => { composingRef.current = true; }}
          onCompositionEnd={(event) => handleTextCompositionEnd(event.currentTarget)}
          onKeyDown={handleTextKeyDown}
          onMouseUp={(event) => { snapTextareaSelection(event.currentTarget); rememberTextSelection(event.currentTarget); }}
          className="mt-1 min-h-16 w-full resize-none overflow-y-auto rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          style={{ maxHeight: '50vh' }}
        />
      </label>
      <label
        className={`mb-3 block text-xs text-muted-foreground ${draft.fontDetectionStatus === 'fallback' ? 'decoration-dotted underline underline-offset-2' : ''}`}
        title={draft.fontDetectionStatus === 'fallback' ? draft.fontDetectionLabel : undefined}
      >Font family
        <input
          aria-label="Search fonts"
          type="search"
          value={fontSearch}
          onChange={(event) => setFontSearch(event.target.value)}
          placeholder="Search fonts"
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
        />
        <select
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
          value={draft.fontFamily}
          title={draft.fontDetectionStatus === 'fallback'
            ? "This PDF doesn't record its font names, so we can't auto-detect."
            : FONT_REGISTRY.find((font) => font.family === draft.fontFamily)?.compatible
            ? `Uses the metric-identical open font ${draft.fontFamily}.`
            : undefined}
          onChange={(event) => setDraftProperty({ fontFamily: event.target.value as FontFamily })}
        >
          {FONT_MENU_GROUP_ORDER.map((group) => {
            const query = fontSearch.trim().toLowerCase();
            const fonts = FONT_REGISTRY.filter((font) =>
              getEditorFontMenuGroup(font.family) === group &&
              `${font.displayName} ${font.family} ${font.languages}`.toLowerCase().includes(query));
            const label = group === 'Compatible' ? 'Office-compatible' : group;
            return fonts.length > 0 && <optgroup key={group} label={label}>{fonts.map((font) => {
              const label = font.family === draft.fontFamily && draft.fontDetectionStatus === 'fallback'
                ? draft.fontDetectionLabel
                : `${font.displayName}${font.compatible ? ' (compatible)' : ''}`;
              return <option
                key={font.family}
                value={font.family}
                title={`${font.languages}. Sample: ${font.sample}${font.compatible ? `. Uses the metric-identical open font ${font.family}.` : ''}`}
              >{label}</option>;
            })}</optgroup>;
          })}
        </select>
      </label>
      <p className="mb-3 -mt-2 text-xs text-muted-foreground">
        {FONT_REGISTRY.find((font) => font.family === draft.fontFamily)?.languages}: {FONT_REGISTRY.find((font) => font.family === draft.fontFamily)?.sample}
      </p>
      <label className="mb-3 block text-xs text-muted-foreground">Fallback font
        <select
          aria-label="Fallback font"
          className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
          value={draft.fallbackFamily ?? 'Noto Sans'}
          onChange={(event) => setDraftProperty({ fallbackFamily: event.target.value as FontFamily })}
        >
          {FONT_REGISTRY.map((font) => <option key={font.family} value={font.family}>{font.displayName}</option>)}
        </select>
      </label>
      <label className="mb-3 block text-xs text-muted-foreground">Font size (pt)
        <input className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" type="number" min={8} max={72} step={0.01} value={Number(draft.fontSize.toFixed(2))} onChange={(event) => setDraftProperty({ fontSize: clamp(Number(event.target.value) || 8, 8, 72) })} />
      </label>
      <div className="mb-3 flex flex-wrap gap-1">
        <Button type="button" variant={draft.bold ? 'default' : 'outline'} size="icon" aria-label="Bold" onClick={() => setDraftProperty({ bold: !draft.bold })}><Bold /></Button>
        <Button type="button" variant={draft.italic ? 'default' : 'outline'} size="icon" aria-label="Italic" onClick={() => setDraftProperty({ italic: !draft.italic })}><Italic /></Button>
        <Button type="button" variant={draft.underline ? 'default' : 'outline'} size="icon" aria-label="Underline" onClick={() => setDraftProperty({ underline: !draft.underline })}><Underline /></Button>
        <Button type="button" variant={draft.highlightColor ? 'default' : 'outline'} size="icon" aria-label="Highlight background" onClick={() => setDraftProperty({ highlightColor: draft.highlightColor ? undefined : '#fff176' })}><Highlighter /></Button>
        <Button type="button" variant="outline" size="icon" aria-label="Add link" onClick={() => setShowLinkInput((value) => !value)}><Link2 /></Button>
      </div>
      {draft.highlightColor !== undefined && (
        <label className="mb-3 flex items-center justify-between text-xs text-muted-foreground">Highlight color
          <input aria-label="Highlight color" type="color" value={draft.highlightColor || '#fff176'} onChange={(event) => setDraftProperty({ highlightColor: event.target.value })} />
        </label>
      )}
      {showLinkInput && (
        <label className="mb-3 block text-xs text-muted-foreground">Textbox link URL
          <input className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" type="url" placeholder="https://example.com" value={draft.linkUrl ?? ''} onChange={(event) => setDraftProperty({ linkUrl: event.target.value })} />
        </label>
      )}
      <div className="mb-3">
        <p className="mb-1 text-xs text-muted-foreground">Current Color</p>
        <div className="flex flex-wrap items-center gap-2">
          <button aria-label="Current text color" type="button" className="h-8 w-8 rounded border border-border" style={{ backgroundColor: draft.color }} onClick={() => setDraftProperty({ color: draft.color })} />
          <span className="text-xs text-foreground">{normalizeHex(draft.color).toUpperCase()}</span>
          <input aria-label="Custom text color" type="color" value={normalizeHex(draft.color)} onChange={(event) => setDraftProperty({ color: event.target.value })} />
          <Button variant="outline" size="icon" aria-label="Add current color to custom colors" onClick={() => setCustomColors((colors) => [...new Set([...colors, normalizeHex(draft.color)])])}><Plus /></Button>
        </div>
        {!!customColors.length && <div className="mt-2 flex gap-2"><span className="text-xs text-muted-foreground">Custom Colors</span>{customColors.map((color) => <button key={color} type="button" aria-label={`Use ${color}`} className="h-6 w-6 rounded border border-border" style={{ backgroundColor: color }} onClick={() => setDraftProperty({ color })} />)}</div>}
      </div>
      <div className="mb-4 flex items-center gap-1">
        <span className="mr-2 text-xs text-muted-foreground">Align</span>
        {([
          ['left', AlignLeft],
          ['center', AlignCenter],
          ['right', AlignRight],
          ['justified', AlignJustify],
        ] as const).map(([alignment, Icon]) => <Button key={alignment} variant={draft.alignment === alignment ? 'default' : 'outline'} size="icon" aria-label={`Align ${alignment}`} aria-pressed={draft.alignment === alignment} onClick={() => setDraftProperty({ alignment })}><Icon /></Button>)}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => void centerDraftOnPage()}>Center on page</Button>
        <Button type="button" variant="outline" size="sm" onClick={fitDraftToMargins}>Fit to margins</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { currentDraftRef.current = null; setDraft(null); setSelectedGroupId(null); }}>Cancel</Button>
        <Button className="flex-1" onClick={commitDraft}>Done</Button>
      </div>
      <Button variant="link" className="mt-2 w-full text-destructive" onClick={() => {
        const layout = pageLayouts.find((page) => page.pageNumber === draft.pageNumber);
        const group = layout?.lineGroups.find((line) => line.id === draft.groupId);
        if (group) deleteGroup(draft.pageNumber, group);
        else { pushHistory(edits.filter((entry) => entry.id !== draft.id)); currentDraftRef.current = null; setDraft(null); }
      }}>Delete textbox</Button>
    </div>
  );

  return (
    <div className={`min-h-[70vh] rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-sm md:p-6 ${file ? 'pb-24 xl:pb-6' : ''}`}>
      <div data-pdf-edit-area className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">PDFKira — Edit PDF</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Edit text in a PDF</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit runs entirely in your browser — your file never leaves your device.</p>
        </div>
        {file && <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAddTextMode((value) => !value)}>{addTextMode ? 'Cancel Add Text' : 'Add Text'}</Button>
          <Button variant="outline" size="sm" onClick={() => setShowDebugTextBoxes((value) => !value)}>{showDebugTextBoxes ? 'Hide debug boxes' : 'Show debug boxes'}</Button>
          <Button variant="outline" size="icon" aria-label="Undo" title="Undo" disabled={!history.past.length} onClick={undo}><Undo2 /></Button>
          <Button variant="outline" size="icon" aria-label="Redo" title="Redo" disabled={!history.future.length} onClick={redo}><Redo2 /></Button>
        </div>}
      </div>
      {file && !error && !exportFailure && <p className="mb-4 text-sm text-muted-foreground">{status}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-foreground">{error} {error.includes('password-protected') && <a className="underline" href={getToolPath("unlock-pdf")}>Unlock PDF tool</a>}</p>}
      {exportWarnings.length > 0 && <div role="alert" className="mb-4 rounded-xl border border-amber-500/40 p-4 text-sm"><p>Some changes couldn&apos;t be applied: {exportWarnings.join(', ')}. Try converting this PDF with our <a href={getToolPath("compress-pdf")} className="underline">Repair/Compress tool</a> first.</p></div>}
      {exportFailure && <div role="alertdialog" aria-modal="true" aria-labelledby="edit-pdf-export-failure-title" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 text-foreground shadow-2xl">
          <h3 id="edit-pdf-export-failure-title" className="text-lg font-semibold">Could not export this text edit</h3>
          <p className="mt-2 text-sm">{exportFailure.message}</p>
          <p className="mt-4 text-sm font-medium">Text around the problem:</p>
          <pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-sm">{exportFailure.text}</pre>
          <p className="mt-3 text-sm text-muted-foreground">The edit is still in the editor and will not be lost.</p>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button type="button" onClick={() => {
              const target = edits.find((entry) => entry.id === exportFailure.editId) ??
                (draft?.id === exportFailure.editId ? draft : undefined);
              if (!target) {
                setError('The failed edit could not be found. Your PDF and edits are still open.');
                setExportFailure(null);
                return;
              }
              const withoutPlaceholders = sanitizeTextForRendering(target.text);
              const text = withoutPlaceholders !== target.text
                ? withoutPlaceholders
                : exportFailure.unreadableText
                  ? target.text.replace(exportFailure.unreadableText, '')
                  : target.text;
              const next = edits.some((entry) => entry.id === target.id)
                ? edits.map((entry) => entry.id === target.id ? { ...entry, text } : entry)
                : [...edits, { ...target, text }];
              pushHistory(next);
              if (draft?.id === target.id) {
                currentDraftRef.current = null;
                setDraft(null);
                setDraftTouched(false);
              }
              setExportFailure(null);
              void downloadEditedPdf(new Set(), next);
            }}>Remove unreadable characters and continue</Button>
            <Button type="button" onClick={() => {
              const excludedEditIds = new Set(exportFailure.excludedEditIds);
              setExportFailure(null);
              void downloadEditedPdf(excludedEditIds);
            }}>Download without this edit</Button>
            <Button type="button" variant="outline" onClick={() => {
              setExportFailure(null);
              setStatus('Edits ready to download');
            }}>Cancel</Button>
          </div>
        </div>
      </div>}
      {edits.some((entry) => entry.type === 'delete') && <p role="note" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">Visual delete only — the original text may still exist in the file&apos;s data layer. For sensitive content, redact with a dedicated tool.</p>}

      {!file ? (
        <div className="flex min-h-[55vh] w-full items-center justify-center py-6">
          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a PDF or drop it here"
            className={`flex min-h-[340px] w-full flex-col items-center justify-center rounded-[26px] border-2 border-dashed px-5 py-10 text-center transition-colors md:w-[60%] md:min-w-[320px] md:px-10 ${isDragOver ? 'border-primary bg-primary/5' : 'border-border/70 bg-background/80 hover:border-primary/60'}`}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => { event.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragOver(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              const droppedFile = event.dataTransfer.files[0];
              if (droppedFile) void loadFile(droppedFile);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                event.target.value = '';
                if (selected) void loadFile(selected);
              }}
            />
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-8 w-8" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Drop your PDF here</h3>
            <p className="my-3 text-sm text-muted-foreground">or</p>
            <Button type="button" size="lg" onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}>Choose PDF file</Button>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Processed entirely in your browser — your file never leaves your device. Max 50 MB.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-3 min-[900px]:grid-cols-[minmax(0,1fr)_var(--pdf-properties-width)] ${showPhoneticControls
            ? 'min-[1200px]:grid-cols-[clamp(200px,15vw,260px)_minmax(0,1fr)_var(--pdf-properties-width)]'
            : 'min-[1200px]:grid-cols-[minmax(0,1fr)_var(--pdf-properties-width)]'}`}
          style={{ '--pdf-properties-width': `${propertiesWidth}px` } as CSSProperties}
        >
          {showPhoneticControls && <aside
            className="block min-w-0 min-[900px]:hidden min-[1200px]:sticky min-[1200px]:top-[var(--edit-pdf-panel-top)] min-[1200px]:col-start-1 min-[1200px]:flex min-[1200px]:min-h-0 min-[1200px]:flex-col min-[1200px]:overflow-hidden rounded-2xl border border-border bg-background/80 p-3 min-[1200px]:border-0 min-[1200px]:p-0"
            style={{
              '--edit-pdf-panel-top': `${phoneticTopOffset}px`,
              height: `calc(100vh - ${phoneticTopOffset + 16}px)`,
              maxHeight: `calc(100vh - ${phoneticTopOffset + 16}px)`,
            } as CSSProperties}
          >
            {showPhoneticControls && <div className="hidden min-w-0 shrink-0 min-[1200px]:block">
              {renderPhoneticControls('mb-3')}
            </div>}
            <div className="mb-3 flex shrink-0 items-center justify-between min-[1200px]:px-3 min-[1200px]:pt-3"><h3 className="font-semibold">Pages</h3><Badge variant="outline">{pageLayouts.length}</Badge></div>
            <div className="min-w-0 min-[1200px]:min-h-0 min-[1200px]:flex-1 min-[1200px]:overflow-y-auto min-[1200px]:px-3">
              {pageLayouts.map((page) => <button key={page.pageNumber} type="button" className="mb-3 block w-full rounded-xl border border-border p-2 text-left" onClick={() => document.getElementById(`pdf-page-${page.pageNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <canvas ref={(node) => { thumbnailCanvasRefs.current[page.pageNumber] = node; }} className="h-24 w-full bg-white object-contain" />
                <span className="mt-1 flex justify-between text-xs"><span>Page {page.pageNumber}</span><span>{page.textItems.length} items</span></span>
              </button>)}
            </div>
          </aside>}
          <main ref={workspaceMainRef} className={`min-w-0 space-y-4 min-[900px]:col-start-1 ${showPhoneticControls ? 'min-[1200px]:col-start-2' : 'min-[1200px]:col-start-1'}`}>
            {showPhoneticControls && <div className="hidden min-[900px]:block min-[1200px]:hidden">{renderPhoneticControls('mb-3')}</div>}
            <div className="flex items-center gap-2 rounded-xl border border-border p-2">
              <Button variant="outline" size="sm" onClick={() => setPageScale((scale) => Math.max(0.5, scale - 0.1))}>−</Button>
              <span className="min-w-14 text-center text-sm">{Math.round(pageScale * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setPageScale((scale) => Math.min(2, scale + 0.1))}>＋</Button>
              <span className="ml-auto text-xs text-muted-foreground">{addTextMode ? 'Click page to place a textbox' : 'Click a paragraph to select · double-click or Enter to edit'}</span>
            </div>
            {pageLayouts.map((page) => {
              const width = pageWidths.get(page.pageNumber) ?? page.viewportWidth;
              const height = page.viewportHeight * (width / page.viewportWidth);
              const cssViewport = page.viewport.clone({ scale: width / page.viewportWidth });
              return <section key={page.pageNumber} id={`pdf-page-${page.pageNumber}`} data-page-number={page.pageNumber} className="rounded-2xl bg-slate-900 p-3">
                <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-medium text-white">Page {page.pageNumber}</h3><Badge variant="secondary">{page.textItems.length} texts</Badge></div>
                {!page.textItems.length && <p className="mb-2 rounded bg-amber-100 p-2 text-xs text-black">This page appears to be a scanned image — text can&apos;t be selected. Use Whiteout + Add Text, or run OCR first with our <a className="underline" href={getToolPath("ocr-pdf")}>OCR PDF tool</a>.</p>}
                <div data-pdf-edit-area data-pdf-page-canvas className="relative mx-auto overflow-hidden bg-white shadow-lg" style={{ width, height }} onClick={(event) => {
                  if (addTextMode) void addTextAtPoint(page.pageNumber, event.clientX, event.clientY, event.currentTarget);
                }}>
                  <canvas ref={(node) => { baseCanvasRefs.current[page.pageNumber] = node; }} className="absolute inset-0 h-full w-full" />
                  <canvas ref={(node) => { overlayCanvasRefs.current[page.pageNumber] = node; }} className="pointer-events-none absolute inset-0 h-full w-full" />
                  {!addTextMode && page.lineGroups.map((group) => {
                    const rect = cssViewport ? pdfToViewport(cssViewport, group.boundingBox) : group.boundingBox;
                    const block = getPageBlock(page, group.id);
                    const isSelected = block?.groups.some((line) => line.id === selectedGroupId) ?? selectedGroupId === group.id;
                    return <button
                      key={group.id}
                      type="button"
                      aria-label={`Select text ${group.text}`}
                      title={block ? 'Click to select paragraph · double-click to edit paragraph' : 'Click to select text · double-click to edit'}
                      className={`absolute border text-left ${isSelected ? 'border-blue-500 bg-blue-400/10' : showDebugTextBoxes ? 'border-blue-400/70 border-dashed' : 'border-transparent hover:border-blue-400/60'}`}
                      style={{ left: rect.x, top: rect.y, width: rect.width, height: Math.max(12, rect.height) }}
                      onClick={(event) => { event.stopPropagation(); setSelectedGroupId(group.id); }}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        beginGroupEdit(page.pageNumber, group, !event.altKey);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        beginGroupEdit(page.pageNumber, group, true);
                      }}
                    />;
                  })}
                  {draft?.pageNumber === page.pageNumber && cssViewport && (() => {
                    const rect = pdfToViewport(cssViewport, draft.pdfRect);
                    const fontCssSize = draft.fontSize * (width / page.viewportWidth);
                    const draftMetrics = getCachedEditorTextMetrics(draft.fontFamily, editorFontVariant(draft.bold, draft.italic), draft.fallbackFamily, draft.text);
                    const linePitchCss = (draft.lineSpacing ?? draft.fontSize * 1.2) * (width / page.viewportWidth);
                    const editorLines = getEntryLines(draft, (line) => draftMetrics?.widthOfTextAtSize(line, draft.fontSize) ?? line.length * draft.fontSize * 0.52);
                    const editorMinHeight = Math.max(rect.height, fontCssSize * 1.3, editorLines.length * linePitchCss);
                    return <div data-pdf-edit-area data-line-pitch-pt={draft.lineSpacing ?? draft.fontSize * 1.2} className="absolute z-20 border border-blue-500 shadow-sm" style={{
                      left: rect.x,
                      top: rect.y,
                      width: Math.max(40, rect.width),
                      minHeight: editorMinHeight,
                      backgroundColor: 'transparent',
                      color: 'transparent',
                      caretColor: draft.color,
                      fontFamily: cssFontFamily(draft.fontFamily, draft.fallbackFamily, draft.text),
                      fontSize: fontCssSize,
                      fontWeight: draft.bold ? 'bold' : 'normal',
                      fontStyle: draft.italic ? 'italic' : 'normal',
                      fontKerning: 'normal',
                      fontVariantLigatures: 'normal',
                      textDecoration: draft.underline ? 'underline' : 'none',
                      textAlign: draft.alignment === 'justified' ? 'justify' : draft.alignment ?? 'left',
                      direction: 'ltr',
                      lineHeight: (draft.lineSpacing ?? draft.fontSize * 1.2) / draft.fontSize,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}>
                      <div role="textbox" aria-label="Editable PDF text" aria-multiline="true" dir="ltr" contentEditable suppressContentEditableWarning
                        onFocus={(event) => rememberTextSelection(event.currentTarget)}
                        onBlur={(event) => rememberTextSelection(event.currentTarget)}
                        onKeyUp={(event) => rememberTextSelection(event.currentTarget)}
                        onCompositionStart={handleTextCompositionStart}
                        onCompositionUpdate={() => { composingRef.current = true; }}
                        onCompositionEnd={(event) => handleTextCompositionEnd(event.currentTarget)}
                        onKeyDown={handleTextKeyDown}
                        onMouseUp={(event) => {
                          const text = event.currentTarget.innerText;
                          const metrics = getCachedEditorTextMetrics(draft.fontFamily, editorFontVariant(draft.bold, draft.italic), draft.fallbackFamily, text);
                          const boundaries = metrics
                            ? getShapedCaretStops(text, metrics.shapeTextAtSize(text, draft.fontSize)).map((stop) => stop.offset)
                            : getGraphemeBoundaries(text);
                          snapDevanagariSelection(event.currentTarget, text, boundaries);
                          rememberTextSelection(event.currentTarget);
                        }}
                        ref={(element) => {
                        if (element && element.innerText !== draft.text && document.activeElement !== element) {
                          setEditableTextWithPlaceholders(element, draft.text);
                        }
                        editorRef.current = element;
                      }} onInput={(event) => updateTextFromInput(event.currentTarget, event.currentTarget.innerText)} className="min-h-full outline-none" style={{ minHeight: editorMinHeight }} />
                      <button type="button" aria-label="Move textbox" title="Move textbox" className="absolute -left-5 -top-5 h-5 w-5 cursor-move rounded bg-blue-600 text-xs text-white" onPointerDown={(event) => void moveStart(event, draft)} onPointerMove={moveMove} onPointerUp={() => { moveRef.current = null; }}>↔</button>
                      {([
                        ['left', '-left-2 top-1/2 -translate-y-1/2', 'cursor-ew-resize', 'Resize textbox from left'],
                        ['left', '-left-2 -top-2', 'cursor-nwse-resize', 'Resize textbox from top left'],
                        ['left', '-left-2 -bottom-2', 'cursor-nesw-resize', 'Resize textbox from bottom left'],
                        ['right', '-right-2 -top-2', 'cursor-nesw-resize', 'Resize textbox from top right'],
                        ['right', '-right-2 -bottom-2', 'cursor-nwse-resize', 'Resize textbox'],
                      ] as const).map(([edge, position, cursor, label]) => (
                        <button
                          key={label}
                          type="button"
                          aria-label={label}
                          title={label}
                          className={`absolute z-10 h-4 w-4 rounded-sm border border-white bg-blue-600 ${position} ${cursor}`}
                          onPointerDown={(event) => resizeStart(event, draft, edge)}
                          onPointerMove={resizeMove}
                          onPointerUp={() => { resizeRef.current = null; }}
                        />
                      ))}
                    </div>;
                  })()}
                </div>
                {selectedGroup && selectedGroup.pageNumber === page.pageNumber && !draft && <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => beginGroupEdit(page.pageNumber, selectedBlock?.groups[0] ?? selectedGroup, true)}>Edit selected text</Button>
                  <Button variant="outline" size="sm" onClick={() => beginGroupEdit(page.pageNumber, selectedGroup, false)}>Edit single line</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteGroup(page.pageNumber, selectedGroup)}>Delete selected text</Button>
                </div>}
              </section>;
            })}
          </main>
          {renderFormatPanel(`hidden min-[900px]:sticky min-[900px]:top-4 min-[900px]:col-start-2 min-[900px]:block min-[900px]:h-fit ${showPhoneticControls ? 'min-[1200px]:col-start-3' : 'min-[1200px]:col-start-2'}`, true)}
          {renderFormatPanel('fixed inset-x-2 bottom-20 z-40 max-h-[45vh] overflow-y-auto min-[900px]:hidden')}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        {file && <Button variant="outline" size="sm" onClick={() => setShowDebugTextBoxes((value) => !value)}>{showDebugTextBoxes ? 'Hide debug boxes' : 'Show debug boxes'}</Button>}
      </div>
      {file && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur xl:sticky xl:inset-x-auto xl:bottom-0 xl:-mx-6 xl:mt-6 xl:px-6">
          <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {status === 'Preparing edited PDF...'
                ? status
                : pendingCount === 0 ? 'No changes yet' : `${pendingCount} ${pendingCount === 1 ? 'edit' : 'edits'} pending`}
            </p>
            <Button
              onClick={() => void downloadEditedPdf()}
              disabled={!pdfDocument || pendingCount === 0 || status === 'Preparing edited PDF...' || saved}
              title={pendingCount === 0 ? 'Make at least one edit to download' : undefined}
              className="min-w-36"
            >
              {saved ? 'Saved ✓' : 'Download PDF'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function drawPreviewMask(context: CanvasRenderingContext2D, entry: TextItem, viewport: any) {
  const mask = pdfToViewport(viewport, entry.maskRect ?? entry.pdfRect);
  if (!entry.maskColor) return;
  context.save();
  context.fillStyle = entry.maskColor;
  context.fillRect(mask.x, mask.y, mask.width, mask.height);
  context.restore();
}

function drawPreviewEntry(context: CanvasRenderingContext2D, entry: TextItem, viewport: any) {
  if (entry.damagedBlock) {
    for (const [index, line] of entry.text.split(/\r?\n/).entries()) {
      const originalLine = entry.originalLineTexts?.[index];
      if (line === originalLine) continue;
      const existingLine = index < (entry.originalLineTexts?.length ?? 0);
      const x = entry.originalLineXs?.[index] ?? entry.pdfX;
      const y = entry.originalLineBaselines?.[index] ??
        getReplacementBaseline(entry.originalLineBaselines?.[0] ?? entry.pdfY, index, entry.lineSpacing ?? entry.fontSize * 1.2);
      const lineRect = entry.lineRects?.[index] ?? {
        x,
        y: y - entry.fontSize * 0.25,
        width: entry.pdfRect.width,
        height: entry.fontSize,
      };
      drawPreviewEntry(context, {
        ...entry,
        text: sanitizeTextForRendering(line),
        originalText: line,
        pdfX: x,
        pdfY: y,
        pdfRect: lineRect,
        maskRect: existingLine ? entry.lineMaskRects?.[index] : undefined,
        maskColor: existingLine ? entry.lineMaskColors?.[index] : undefined,
        groupId: existingLine ? entry.replacedGroupIds?.[index] : undefined,
        wholeParagraph: true,
        originalLineTexts: [sanitizeTextForRendering(line)],
        originalLineBaselines: [y],
        originalLineXs: [x],
        damagedBlock: false,
        retypeWholeParagraph: false,
      }, viewport);
    }
    return;
  }
  if (entry.groupId || entry.type === 'delete') drawPreviewMask(context, entry, viewport);
  if (entry.type === 'delete') return;
  if (entry.highlightColor) {
    const highlight = pdfToViewport(viewport, entry.pdfRect);
    context.fillStyle = entry.highlightColor;
    context.fillRect(highlight.x, highlight.y, highlight.width, Math.max(highlight.height, entry.fontSize * viewport.scale * 1.25));
  }
  const baseline = pdfToViewport(viewport, { x: entry.pdfX, y: entry.pdfY, width: 0, height: 0 });
  const anchor = entry.anchorX === undefined
    ? baseline.x
    : pdfToViewport(viewport, { x: entry.anchorX, y: entry.pdfY, width: 0, height: 0 }).x;
  const size = entry.fontSize * viewport.scale;
  context.font = `${entry.italic ? 'italic ' : ''}${entry.bold ? 'bold ' : ''}${size}px ${cssFontFamily(entry.fontFamily, entry.fallbackFamily, entry.text)}`;
  context.fillStyle = entry.color;
  context.textBaseline = 'alphabetic';
  const metrics = getCachedEditorTextMetrics(entry.fontFamily, editorFontVariant(entry.bold, entry.italic), entry.fallbackFamily, entry.text);
  const lines = getEntryLines(entry, (line) => metrics
    ? metrics.widthOfTextAtSize(line, entry.fontSize)
    : context.measureText(line).width / viewport.scale);
  const maxWidth = entry.pdfRect.width * viewport.scale;
  const lineHeight = (entry.lineSpacing ?? entry.fontSize * 1.2) * viewport.scale;
  lines.forEach((line, index) => {
    const width = (metrics?.widthOfTextAtSize(line, entry.fontSize) ?? context.measureText(line).width / viewport.scale) * viewport.scale;
    const alignedX = entry.alignment === 'center' && entry.anchorX !== undefined
      ? anchor - width / 2
      : entry.alignment === 'right' && entry.anchorX !== undefined
        ? anchor - width
        : entry.alignment === 'center' ? baseline.x + (maxWidth - width) / 2
          : entry.alignment === 'right' ? baseline.x + maxWidth - width : baseline.x;
    const preserveOriginalLines = entry.wholeParagraph && entry.text === entry.originalText &&
      !!entry.originalLineBaselines?.length;
    const originalBaseline = preserveOriginalLines && entry.originalLineBaselines?.[index] !== undefined
      ? pdfToViewport(viewport, { x: entry.originalLineXs?.[index] ?? entry.pdfX, y: entry.originalLineBaselines[index], width: 0, height: 0 })
      : undefined;
    const x = originalBaseline
      ? originalBaseline.x
      : alignedX;
    const y = originalBaseline
      ? originalBaseline.y
      : baseline.y + index * lineHeight;
    context.fillText(line, x, y);
    if (entry.underline) {
      context.beginPath();
      context.moveTo(x, y + size * 0.08);
      context.lineTo(x + width, y + size * 0.08);
      context.lineWidth = Math.max(1, size * 0.05);
      context.strokeStyle = entry.color;
      context.stroke();
    }
  });
}

class PdfTextEditorErrorBoundary extends Component<
  Record<string, never>,
  { error: Error | null; generation: number }
> {
  state: { error: Error | null; generation: number } = { error: null, generation: 0 };

  static getDerivedStateFromError(reason: unknown) {
    return {
      error: reason instanceof Error ? reason : new Error('The PDF editor encountered an unexpected error.'),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[edit-pdf] editor render failed; preserving the current PDF and edits for recovery', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="m-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p>The editor hit an unexpected error. Your current PDF and edits are retained in this tab.</p>
          <p className="mt-2 text-muted-foreground">{this.state.error.message}</p>
          <button
            type="button"
            className="mt-3 rounded-md border border-border px-3 py-2"
            onClick={() => this.setState((state) => ({ error: null, generation: state.generation + 1 }))}
          >
            Return to editor
          </button>
        </div>
      );
    }
    return <PdfTextEditor key={this.state.generation} />;
  }
}

export default function PdfTextEditorWithErrorBoundary() {
  return <PdfTextEditorErrorBoundary />;
}
