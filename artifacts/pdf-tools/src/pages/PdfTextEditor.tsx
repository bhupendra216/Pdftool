import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { PDFDocument, PDFName, PDFString, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import saveAs from 'file-saver';
import { AlignCenter, AlignLeft, AlignRight, Bold, Highlighter, Link2, Plus, Redo2, Italic, Underline, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { groupTextItemsIntoLines, type PdfTextLineGroup } from '../lib/pdf-text-lines';
import { createImageOnlyPdf, type RasterPdfPage } from '../lib/image-only-pdf';
import { pdfToViewport, viewportToPdf, type PdfRect } from '../lib/pdf-coords';
import { getSafeTextGeometry, validateTextItemGeometry } from '../lib/pdf-text-geometry';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type FontFamily = 'Helvetica' | 'Times Roman' | 'Courier';
type TextAlignment = 'left' | 'center' | 'right';

type TextItem = {
  id: string;
  pageNumber: number;
  text: string;
  originalText: string;
  pdfRect: PdfRect;
  pdfX: number;
  pdfY: number;
  width?: number;
  height?: number;
  fontName: string;
  fontFamily: FontFamily;
  fontSize: number;
  color: string;
  type: 'text' | 'delete';
  groupId?: string;
  isAdded?: boolean;
  maskColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  highlightColor?: string;
  alignment?: TextAlignment;
  linkUrl?: string;
};

type PageLayout = {
  pageNumber: number;
  viewport: any;
  viewportWidth: number;
  viewportHeight: number;
  styles: Record<string, any>;
  textItems: TextItem[];
  lineGroups: PdfTextLineGroup[];
};

type PageHistory = {
  past: TextItem[][];
  future: TextItem[][];
};

type ResizeState = {
  pointerId: number;
  startX: number;
  startWidth: number;
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MASK_PADDING_PT = 2;

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

function pdfFontFamily(fontName: string): FontFamily {
  const name = fontName.toLowerCase();
  if (name.includes('sans') || name.includes('helvetica') || name.includes('arial')) return 'Helvetica';
  if (name.includes('times') || name.includes('serif')) return 'Times Roman';
  if (name.includes('courier') || name.includes('mono')) return 'Courier';
  return 'Helvetica';
}

function cssFontFamily(family: FontFamily) {
  if (family === 'Times Roman') return '"Times New Roman", Times, serif';
  if (family === 'Courier') return '"Courier New", Courier, monospace';
  return 'Helvetica, Arial, sans-serif';
}

function resolvePdfFont(family: FontFamily, bold: boolean, italic: boolean) {
  if (family === 'Times Roman') {
    return bold
      ? italic ? StandardFonts.TimesRomanBoldItalic : StandardFonts.TimesRomanBold
      : italic ? StandardFonts.TimesRomanItalic : StandardFonts.TimesRoman;
  }
  if (family === 'Courier') {
    return bold
      ? italic ? StandardFonts.CourierBoldOblique : StandardFonts.CourierBold
      : italic ? StandardFonts.CourierOblique : StandardFonts.Courier;
  }
  return bold
    ? italic ? StandardFonts.HelveticaBoldOblique : StandardFonts.HelveticaBold
    : italic ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica;
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
        for (const character of word) {
          if (chunk && measure(chunk + character) > width) {
            lines.push(chunk);
            chunk = character;
          } else chunk += character;
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

function getMaskRect(rect: PdfRect): PdfRect {
  return {
    x: rect.x - MASK_PADDING_PT,
    y: rect.y - MASK_PADDING_PT,
    width: rect.width + MASK_PADDING_PT * 2,
    height: rect.height + MASK_PADDING_PT * 2,
  };
}

function sampleRingColor(context: CanvasRenderingContext2D, rect: PdfRect) {
  const left = clamp(Math.floor(rect.x), 0, context.canvas.width - 1);
  const top = clamp(Math.floor(rect.y), 0, context.canvas.height - 1);
  const right = clamp(Math.ceil(rect.x + rect.width), left + 1, context.canvas.width);
  const bottom = clamp(Math.ceil(rect.y + rect.height), top + 1, context.canvas.height);
  const pad = 2;
  const regionLeft = Math.max(0, left - pad);
  const regionTop = Math.max(0, top - pad);
  const regionRight = Math.min(context.canvas.width, right + pad);
  const regionBottom = Math.min(context.canvas.height, bottom + pad);
  const pixels = context.getImageData(regionLeft, regionTop, regionRight - regionLeft, regionBottom - regionTop);
  const channels = [0, 0, 0];
  let count = 0;
  const addPixel = (x: number, y: number) => {
    if (x < regionLeft || y < regionTop || x >= regionRight || y >= regionBottom) return;
    const index = ((y - regionTop) * pixels.width + x - regionLeft) * 4;
    channels[0] += pixels.data[index];
    channels[1] += pixels.data[index + 1];
    channels[2] += pixels.data[index + 2];
    count += 1;
  };
  for (let x = left; x < right; x += 2) {
    addPixel(x, top - pad);
    addPixel(x, bottom + pad - 1);
  }
  for (let y = top; y < bottom; y += 2) {
    addPixel(left - pad, y);
    addPixel(right + pad - 1, y);
  }
  if (!count) {
    const sample = context.getImageData(clamp(left, 0, context.canvas.width - 1), clamp(top, 0, context.canvas.height - 1), 1, 1).data;
    return normalizeHex(`#${[sample[0], sample[1], sample[2]].map((value) => value.toString(16).padStart(2, '0')).join('')}`);
  }
  return `#${channels.map((value) => Math.round(value / count).toString(16).padStart(2, '0')).join('')}`;
}

function sampleTextColor(context: CanvasRenderingContext2D, rect: PdfRect, backgroundColor: string) {
  const left = clamp(Math.floor(rect.x), 0, context.canvas.width - 1);
  const top = clamp(Math.floor(rect.y), 0, context.canvas.height - 1);
  const width = Math.max(1, Math.min(context.canvas.width - left, Math.ceil(rect.width)));
  const height = Math.max(1, Math.min(context.canvas.height - top, Math.ceil(rect.height)));
  const pixels = context.getImageData(left, top, width, height).data;
  const bg = normalizeHex(backgroundColor).slice(1);
  const background = [0, 2, 4].map((offset) => Number.parseInt(bg.slice(offset, offset + 2), 16));
  const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const backgroundLuminance = luminance(background[0], background[1], background[2]);
  const candidates: Array<{ color: number[]; contrast: number }> = [];
  for (let index = 0; index < pixels.length; index += 4) {
    const color = [pixels[index], pixels[index + 1], pixels[index + 2]];
    const delta = luminance(color[0], color[1], color[2]) - backgroundLuminance;
    if ((backgroundLuminance > 128 && delta < -35) || (backgroundLuminance <= 128 && delta > 35)) {
      candidates.push({ color, contrast: Math.abs(delta) });
    }
  }
  if (!candidates.length) return '#111111';
  const strongestContrast = Math.max(...candidates.map((candidate) => candidate.contrast));
  const foregroundPixels = candidates.filter((candidate) => candidate.contrast >= strongestContrast * 0.85);
  const average = [0, 1, 2].map((channel) =>
    Math.round(foregroundPixels.reduce((total, candidate) => total + candidate.color[channel], 0) / foregroundPixels.length));
  return `#${average.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
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
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const styles = content.styles ?? {};
    const textItems: TextItem[] = content.items
      .filter((item: any) => typeof item?.str === 'string' && item.str.trim())
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
        return {
          id: `page-${pageNumber}-item-${index}`,
          pageNumber,
          text: item.str,
          originalText: item.str,
          pdfRect,
          pdfX: baseline.x,
          pdfY: baseline.y,
          width: pdfRect.width,
          height: pdfRect.height,
          fontName,
          fontFamily: pdfFontFamily(String(styles[fontName]?.fontFamily ?? fontName)),
          fontSize: clamp(Number(safe.fontSize) || itemHeight, 8, 72),
          color: '#111111',
          type: 'text' as const,
        };
      });
    layouts.push({
      pageNumber,
      viewport,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      styles,
      textItems,
      lineGroups: groupTextItemsIntoLines(textItems, 2).map((group) => ({ ...group, pageNumber })),
    });
  }
  return { document, layouts };
}

function PdfTextEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(null);
  const [pdfJsBytes, setPdfJsBytes] = useState<Uint8Array | null>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [pageLayouts, setPageLayouts] = useState<PageLayout[]>([]);
  const [edits, setEdits] = useState<TextItem[]>([]);
  const [draft, setDraft] = useState<TextItem | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [addTextMode, setAddTextMode] = useState(false);
  const [pageScale, setPageScale] = useState(1);
  const [activePageNumber, setActivePageNumber] = useState(1);
  const [status, setStatus] = useState('Waiting for PDF');
  const [error, setError] = useState<string | null>(null);
  const [exportWarnings, setExportWarnings] = useState<string[]>([]);
  const [showDebugTextBoxes, setShowDebugTextBoxes] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [history, setHistory] = useState<PageHistory>({ past: [], future: [] });
  const [renderVersion, setRenderVersion] = useState(0);
  const baseCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const overlayCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const thumbnailCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const editorRef = useRef<HTMLDivElement | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const moveRef = useRef<MoveState | null>(null);
  const currentDraftRef = useRef<TextItem | null>(null);
  const renderTasksRef = useRef<Set<{ promise: Promise<void>; cancel: () => void }>>(new Set());
  currentDraftRef.current = draft;

  const pageWidths = useMemo(() => new Map(pageLayouts.map((layout) => [
    layout.pageNumber,
    Math.min(layout.viewportWidth * pageScale, 900),
  ])), [pageLayouts, pageScale]);

  const makeViewport = useCallback((pageNumber: number, scale: number) => {
    const page = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!pdfDocument || !page) return null;
    return pdfDocument.getPage(pageNumber).then((pdfPage: any) => pdfPage.getViewport({ scale }));
  }, [pageLayouts, pdfDocument]);

  const getMaskColor = useCallback((pageNumber: number, rect: PdfRect) => {
    const canvas = baseCanvasRefs.current[pageNumber];
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    const layout = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!canvas || !context || !layout) throw new Error('Wait for the PDF page preview to finish rendering before editing text.');
    const scale = canvas.width / layout.viewportWidth;
    const viewport = layout.viewport.clone({ scale });
    const pixelRect = pdfToViewport(viewport, rect);
    return sampleRingColor(context, pixelRect);
  }, [pageLayouts, pdfDocument]);

  useEffect(() => {
    if (!pdfJsBytes) return;
    let cancelled = false;
    setStatus('Loading PDF...');
    setError(null);
    void loadPageLayouts(pdfJsBytes).then(({ document, layouts }) => {
      if (cancelled) return;
      setPdfDocument(document);
      setPageLayouts(layouts);
      setActivePageNumber(1);
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
        const cssScale = (pageWidths.get(page.pageNumber) ?? page.viewportWidth) / page.viewportWidth;
        const scale = cssScale * (window.devicePixelRatio || 1) * (page.pageNumber === activePageNumber ? 1 : 0.35);
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
  }, [activePageNumber, pageLayouts, pageWidths, pdfDocument]);

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
        if (draft?.groupId && draft.groupId === entry.groupId) continue;
        drawPreviewEntry(context, entry, viewport);
      }
      if (draft?.pageNumber === page.pageNumber) drawPreviewEntry(context, draft, viewport);
    }
  }, [draft, edits, pageLayouts, renderVersion, pdfDocument]);

  useEffect(() => {
    if (!pageLayouts.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
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
    const next = current.type === 'text' && !current.text.trim()
      ? edits.filter((entry) => entry.id !== current.id && entry.groupId !== current.groupId)
      : [...edits.filter((entry) => entry.id !== current.id && !(current.groupId && entry.groupId === current.groupId)), current];
    pushHistory(next);
    setDraft(null);
    setStatus('Edits ready to download');
  }, [edits, pushHistory]);

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
    if (!canvas || !context || !layout) return '#111111';
    const viewport = layout.viewport.clone({ scale: canvas.width / layout.viewportWidth });
    const rect = pdfToViewport(viewport, group.boundingBox);
    const background = sampleRingColor(context, rect);
    return sampleTextColor(context, rect, background);
  }, [pageLayouts, pdfDocument]);

  const beginGroupEdit = useCallback((pageNumber: number, group: PdfTextLineGroup) => {
    const existing = edits.find((entry) => entry.groupId === group.id && entry.type === 'text');
    const textItem = group.items[0] as TextItem | undefined;
    const color = existing?.color ?? getTextColor(pageNumber, group);
    const pdfRect = { ...group.boundingBox };
    const entry: TextItem = existing ?? {
      id: `edit-${Date.now()}`,
      pageNumber,
      groupId: group.id,
      text: group.text,
      originalText: group.text,
      pdfRect,
      pdfX: pdfRect.x,
      pdfY: group.baselineY,
      fontName: textItem?.fontName ?? 'Helvetica',
      fontFamily: textItem?.fontFamily ?? 'Helvetica',
      fontSize: clamp(group.dominantFontSize, 8, 72),
      color,
      type: 'text',
      maskColor: getMaskColor(pageNumber, pdfRect),
      alignment: 'left',
    };
    currentDraftRef.current = entry;
    setDraft(entry);
    setSelectedGroupId(group.id);
    if (window.innerWidth < 1280) {
      requestAnimationFrame(() => {
        document.getElementById(`pdf-page-${pageNumber}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  }, [edits, getMaskColor, getTextColor]);

  const setDraftProperty = (update: Partial<TextItem>) => {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, ...update };
      currentDraftRef.current = next;
      return next;
    });
  };

  const deleteGroup = (pageNumber: number, group: PdfTextLineGroup) => {
    const pdfRect = { ...group.boundingBox };
    const textItem = group.items[0] as TextItem | undefined;
    const deletion: TextItem = {
      id: `delete-${Date.now()}`,
      pageNumber,
      groupId: group.id,
      text: '',
      originalText: group.text,
      pdfRect,
      pdfX: pdfRect.x,
      pdfY: group.baselineY,
      fontName: textItem?.fontName ?? 'Helvetica',
      fontFamily: textItem?.fontFamily ?? 'Helvetica',
      fontSize: group.dominantFontSize,
      color: '#111111',
      type: 'delete',
      maskColor: getMaskColor(pageNumber, pdfRect),
    };
    pushHistory([...edits.filter((entry) => entry.groupId !== group.id), deletion]);
    setSelectedGroupId(null);
    currentDraftRef.current = null;
    setDraft(null);
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
    const entry: TextItem = {
      id: `added-${Date.now()}`,
      pageNumber,
      text: 'New text',
      originalText: '',
      pdfRect,
      pdfX: point.x,
      pdfY: point.y,
      fontName: 'Helvetica',
      fontFamily: 'Helvetica',
      fontSize: 12,
      color: '#111111',
      type: 'text',
      isAdded: true,
      alignment: 'left',
    };
    currentDraftRef.current = entry;
    setDraft(entry);
    setAddTextMode(false);
  };

  const undo = () => {
    if (!history.past.length) return;
    const previous = history.past[history.past.length - 1];
    setEdits(previous);
    setHistory({ past: history.past.slice(0, -1), future: [edits, ...history.future] });
    currentDraftRef.current = null;
    setDraft(null);
  };

  const redo = () => {
    if (!history.future.length) return;
    const [next, ...future] = history.future;
    setEdits(next);
    setHistory({ past: [...history.past, edits], future });
    currentDraftRef.current = null;
    setDraft(null);
  };

  const resizeStart = (event: ReactPointerEvent, entry: TextItem) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const layout = pageLayouts.find((page) => page.pageNumber === entry.pageNumber);
    if (!layout) return;
    const scale = (pageWidths.get(entry.pageNumber) ?? layout.viewportWidth) / layout.viewportWidth;
    const viewport = layout.viewport.clone({ scale });
    const rect = pdfToViewport(viewport, entry.pdfRect);
    resizeRef.current = {
      pointerId,
      startX,
      startWidth: rect.width,
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
    const widthPx = Math.max(40, current.startWidth + event.clientX - current.startX);
    const delta = viewportToPdf(current.viewport, 0, 0, widthPx, 0);
    setDraftProperty({ pdfRect: { ...current.startPdfRect, width: Math.max(delta.width, delta.height) } });
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
      pdfX: current.startPdfRect.x + deltaX,
      pdfY: current.startPdfRect.y + current.startPdfRect.height + deltaY,
    });
  };

  const downloadEditedPdf = async () => {
    if (!sourcePdfBytes || !file) return;
    commitDraft();
    const finalEdits = draft
      ? [...edits.filter((entry) => entry.id !== draft.id && !(draft.groupId && entry.groupId === draft.groupId)), draft]
      : edits;
    setExportWarnings([]);
    setStatus('Preparing edited PDF...');
    const failures: string[] = [];
    try {
      const source = await PDFDocument.load(sourcePdfBytes);
      const output = await PDFDocument.create();
      const sourcePages = source.getPages();
      for (let index = 0; index < sourcePages.length; index += 1) {
        const [copied] = await output.copyPages(source, [index]);
        const page = output.addPage(copied);
        const pageEdits = finalEdits.filter((entry) => entry.pageNumber === index + 1);
        for (const entry of pageEdits) {
          try {
            const rect = getMaskRect(entry.pdfRect);
            if (entry.groupId || entry.type === 'delete') {
            if (!entry.maskColor) throw new Error('The original background could not be sampled for this text mask.');
            page.drawRectangle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                color: colorToPdf(entry.maskColor),
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
            const font = await output.embedFont(resolvePdfFont(entry.fontFamily, Boolean(entry.bold), Boolean(entry.italic)));
            const size = clamp(entry.fontSize, 8, 72);
            const lines = wrapPdfText(entry.text, entry.pdfRect.width, (line) => font.widthOfTextAtSize(line, size));
            const lineHeight = size * 1.2;
            const baseline = entry.pdfY || (entry.pdfRect.y + entry.pdfRect.height - size);
            lines.forEach((line, lineIndex) => {
              const lineWidth = font.widthOfTextAtSize(line, size);
              const xOffset = entry.alignment === 'center'
                ? (entry.pdfRect.width - lineWidth) / 2
                : entry.alignment === 'right' ? entry.pdfRect.width - lineWidth : 0;
              const y = baseline - lineIndex * lineHeight;
              page.drawText(line, {
                x: entry.pdfRect.x + xOffset,
                y,
                size,
                font,
                color: colorToPdf(entry.color),
              });
              if (entry.underline) {
                page.drawLine({
                  start: { x: entry.pdfRect.x + xOffset, y: y - size * 0.12 },
                  end: { x: entry.pdfRect.x + xOffset + lineWidth, y: y - size * 0.12 },
                  thickness: Math.max(0.5, size * 0.05),
                  color: colorToPdf(entry.color),
                });
              }
            });
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
            failures.push(`Page ${index + 1}: ${entry.text.slice(0, 45) || 'deleted text'}`);
          }
        }
      }

      let bytes = await output.save();
      if (finalEdits.some((entry) => entry.type === 'delete')) {
        const rendered = await pdfjsLib.getDocument({ data: bytes }).promise;
        const rasterPages: RasterPdfPage[] = [];
        for (let pageNumber = 1; pageNumber <= rendered.numPages; pageNumber += 1) {
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
          rasterPages.push({ imageDataUrl: canvas.toDataURL('image/png'), width: base.width, height: base.height });
        }
        bytes = await createImageOnlyPdf(rasterPages);
      }
      const downloadBytes = new Uint8Array(bytes.length);
      downloadBytes.set(bytes);
      saveAs(new Blob([downloadBytes.buffer], { type: 'application/pdf' }), `${file.name.replace(/\.pdf$/i, '')}-edited.pdf`);
      setExportWarnings(failures);
      setStatus('Edited PDF downloaded in your browser.');
    } catch (reason) {
      console.error('[edit-pdf] export failed', reason);
      setStatus(reason instanceof Error ? reason.message : 'Could not create the edited PDF.');
    }
  };

  const selectedGroup = pageLayouts.flatMap((page) => page.lineGroups).find((group) => group.id === selectedGroupId);
  const renderFormatPanel = (className: string) => draft && (
    <div data-pdf-edit-area className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Text properties</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" aria-label="Undo" title="Undo" disabled={!history.past.length} onClick={undo}><Undo2 /></Button>
          <Button variant="outline" size="icon" aria-label="Redo" title="Redo" disabled={!history.future.length} onClick={redo}><Redo2 /></Button>
        </div>
      </div>
      <label className="mb-3 block text-xs text-muted-foreground">Font family
        <select className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" value={draft.fontFamily} onChange={(event) => setDraftProperty({ fontFamily: event.target.value as FontFamily })}>
          <option>Helvetica</option><option>Times Roman</option><option>Courier</option>
        </select>
      </label>
      <label className="mb-3 block text-xs text-muted-foreground">Font size (pt)
        <input className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" type="number" min={8} max={72} step={0.001} value={draft.fontSize} onChange={(event) => setDraftProperty({ fontSize: clamp(Number(event.target.value) || 8, 8, 72) })} />
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
        ] as const).map(([alignment, Icon]) => <Button key={alignment} variant={draft.alignment === alignment ? 'default' : 'outline'} size="icon" aria-label={`Align ${alignment}`} onClick={() => setDraftProperty({ alignment })}><Icon /></Button>)}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { currentDraftRef.current = null; setDraft(null); }}>Cancel</Button>
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
    <div className="min-h-[70vh] rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-sm md:p-6">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">PDFKira — Edit PDF</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Edit text in a PDF</h2>
          <p className="mt-1 text-sm text-muted-foreground">Edit runs entirely in your browser — your file never leaves your device.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-md border border-border px-3 py-2 text-xs font-medium">
            Open PDF<input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={async (event) => {
              const selected = event.target.files?.[0];
              if (!selected) return;
              try {
                const data = await readFileBytes(selected);
                setFile(selected);
                setSourcePdfBytes(data.sourcePdfBytes);
                setPdfJsBytes(data.pdfJsBytes);
                setEdits([]);
                setDraft(null);
                setHistory({ past: [], future: [] });
                setError(null);
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : 'Could not read this PDF.');
              }
            }} />
          </label>
          <Button variant="outline" size="sm" onClick={() => setAddTextMode((value) => !value)}>{addTextMode ? 'Cancel Add Text' : 'Add Text'}</Button>
          <Button variant="outline" size="sm" onClick={() => setShowDebugTextBoxes((value) => !value)}>{showDebugTextBoxes ? 'Hide debug boxes' : 'Show debug boxes'}</Button>
          <Button variant="outline" size="icon" aria-label="Undo" title="Undo" disabled={!history.past.length} onClick={undo}><Undo2 /></Button>
          <Button variant="outline" size="icon" aria-label="Redo" title="Redo" disabled={!history.future.length} onClick={redo}><Redo2 /></Button>
          <Button size="sm" onClick={downloadEditedPdf} disabled={!file || !pdfDocument}>Download PDF</Button>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{status}</p>
      {error && <p role="alert" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-foreground">{error} {error.includes('password-protected') && <a className="underline" href="/tools/unlock-pdf">Unlock PDF tool</a>}</p>}
      {exportWarnings.length > 0 && <div role="alert" className="mb-4 rounded-xl border border-amber-500/40 p-4 text-sm"><p>Some changes couldn&apos;t be applied: {exportWarnings.join(', ')}. Try converting this PDF with our <a href="/tools/compress-pdf" className="underline">Repair/Compress tool</a> first.</p></div>}
      {edits.some((entry) => entry.type === 'delete') && <p role="note" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">Visual delete only — the original text may still exist in the file&apos;s data layer. For sensitive content, redact with a dedicated tool.</p>}

      {!file ? (
        <div className="rounded-[26px] border border-dashed border-border/70 bg-background/80 p-6 text-center">
          <p className="text-lg font-semibold">Upload a PDF to start editing</p>
          <p className="mt-1 text-sm text-muted-foreground">Select text, change its formatting, add text boxes, and download locally.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)_270px]">
          <aside className="rounded-2xl border border-border bg-background/80 p-3">
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Pages</h3><Badge variant="outline">{pageLayouts.length}</Badge></div>
            {pageLayouts.map((page) => <button key={page.pageNumber} type="button" className="mb-3 block w-full rounded-xl border border-border p-2 text-left" onClick={() => document.getElementById(`pdf-page-${page.pageNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              <canvas ref={(node) => { thumbnailCanvasRefs.current[page.pageNumber] = node; }} className="h-24 w-full bg-white object-contain" />
              <span className="mt-1 flex justify-between text-xs"><span>Page {page.pageNumber}</span><span>{page.textItems.length} items</span></span>
            </button>)}
          </aside>
          <main className="min-w-0 space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-border p-2">
              <Button variant="outline" size="sm" onClick={() => setPageScale((scale) => Math.max(0.5, scale - 0.1))}>−</Button>
              <span className="min-w-14 text-center text-sm">{Math.round(pageScale * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setPageScale((scale) => Math.min(2, scale + 0.1))}>＋</Button>
              <span className="ml-auto text-xs text-muted-foreground">{addTextMode ? 'Click page to place a textbox' : 'Click text to select · double-click to edit'}</span>
            </div>
            {pageLayouts.map((page) => {
              const width = pageWidths.get(page.pageNumber) ?? page.viewportWidth;
              const height = page.viewportHeight * (width / page.viewportWidth);
              const cssViewport = page.viewport.clone({ scale: width / page.viewportWidth });
              return <section key={page.pageNumber} id={`pdf-page-${page.pageNumber}`} data-page-number={page.pageNumber} className="rounded-2xl bg-slate-900 p-3">
                <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-medium text-white">Page {page.pageNumber}</h3><Badge variant="secondary">{page.textItems.length} texts</Badge></div>
                {!page.textItems.length && <p className="mb-2 rounded bg-amber-100 p-2 text-xs text-black">This page appears to be a scanned image — text can&apos;t be selected. Use Whiteout + Add Text, or run OCR first with our <a className="underline" href="/ocr-pdf">OCR PDF tool</a>.</p>}
                <div data-pdf-edit-area className="relative mx-auto overflow-hidden bg-white shadow-lg" style={{ width, height }} onClick={(event) => {
                  if (addTextMode) void addTextAtPoint(page.pageNumber, event.clientX, event.clientY, event.currentTarget);
                }}>
                  <canvas ref={(node) => { baseCanvasRefs.current[page.pageNumber] = node; }} className="absolute inset-0 h-full w-full" />
                  <canvas ref={(node) => { overlayCanvasRefs.current[page.pageNumber] = node; }} className="pointer-events-none absolute inset-0 h-full w-full" />
                  {!addTextMode && page.lineGroups.map((group) => {
                    const rect = cssViewport ? pdfToViewport(cssViewport, group.boundingBox) : group.boundingBox;
                    const isSelected = selectedGroupId === group.id;
                    return <button key={group.id} type="button" aria-label={`Select text ${group.text}`} className={`absolute border text-left ${isSelected ? 'border-blue-500 bg-blue-400/10' : showDebugTextBoxes ? 'border-blue-400/70 border-dashed' : 'border-transparent hover:border-blue-400/60'}`} style={{ left: rect.x, top: rect.y, width: rect.width, height: Math.max(12, rect.height) }} onClick={(event) => { event.stopPropagation(); if (isSelected) beginGroupEdit(page.pageNumber, group); else setSelectedGroupId(group.id); }} onDoubleClick={(event) => { event.stopPropagation(); beginGroupEdit(page.pageNumber, group); }} />;
                  })}
                  {draft?.pageNumber === page.pageNumber && cssViewport && (() => {
                    const rect = pdfToViewport(cssViewport, draft.pdfRect);
                    const fontCssSize = draft.fontSize * (width / page.viewportWidth);
                    return <div data-pdf-edit-area className="absolute z-20 border border-blue-500 shadow-sm" style={{
                      left: rect.x,
                      top: rect.y,
                      width: Math.max(40, rect.width),
                      minHeight: Math.max(rect.height, fontCssSize * 1.3),
                      backgroundColor: 'transparent',
                      color: 'transparent',
                      caretColor: draft.color,
                      fontFamily: cssFontFamily(draft.fontFamily),
                      fontSize: fontCssSize,
                      fontWeight: draft.bold ? 'bold' : 'normal',
                      fontStyle: draft.italic ? 'italic' : 'normal',
                      textDecoration: draft.underline ? 'underline' : 'none',
                      textAlign: draft.alignment ?? 'left',
                      lineHeight: 1.2,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}>
                      <div role="textbox" aria-label="Editable PDF text" aria-multiline="true" contentEditable suppressContentEditableWarning ref={(element) => {
                        if (element && element.innerText !== draft.text && document.activeElement !== element) element.innerText = draft.text;
                        editorRef.current = element;
                      }} onInput={(event) => setDraftProperty({ text: event.currentTarget.innerText })} className="min-h-full outline-none" style={{ minHeight: Math.max(rect.height, fontCssSize * 1.3) }} />
                      <button type="button" aria-label="Move textbox" title="Move textbox" className="absolute -left-5 -top-5 h-5 w-5 cursor-move rounded bg-blue-600 text-xs text-white" onPointerDown={(event) => void moveStart(event, draft)} onPointerMove={moveMove} onPointerUp={() => { moveRef.current = null; }}>↔</button>
                      <button type="button" aria-label="Resize textbox" title="Resize textbox" className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border border-white bg-blue-600" onPointerDown={(event) => void resizeStart(event, draft)} onPointerMove={resizeMove} onPointerUp={() => { resizeRef.current = null; }} />
                    </div>;
                  })()}
                </div>
                {selectedGroup && selectedGroup.pageNumber === page.pageNumber && !draft && <div className="mt-2 flex justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => beginGroupEdit(page.pageNumber, selectedGroup)}>Edit selected text</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteGroup(page.pageNumber, selectedGroup)}>Delete selected text</Button>
                </div>}
              </section>;
            })}
          </main>
          {renderFormatPanel('hidden xl:block xl:sticky xl:top-4 xl:h-fit')}
          {renderFormatPanel('fixed inset-x-2 bottom-2 z-40 max-h-[45vh] overflow-y-auto xl:hidden')}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setShowDebugTextBoxes((value) => !value)}>{showDebugTextBoxes ? 'Hide debug boxes' : 'Show debug boxes'}</Button>
      </div>
    </div>
  );
}

function drawPreviewMask(context: CanvasRenderingContext2D, entry: TextItem, viewport: any) {
  const mask = pdfToViewport(viewport, getMaskRect(entry.pdfRect));
  if (!entry.maskColor) return;
  context.save();
  context.fillStyle = entry.maskColor;
  context.fillRect(mask.x, mask.y, mask.width, mask.height);
  context.restore();
}

function drawPreviewEntry(context: CanvasRenderingContext2D, entry: TextItem, viewport: any) {
  if (entry.groupId || entry.type === 'delete') drawPreviewMask(context, entry, viewport);
  if (entry.type === 'delete') return;
  if (entry.highlightColor) {
    const highlight = pdfToViewport(viewport, entry.pdfRect);
    context.fillStyle = entry.highlightColor;
    context.fillRect(highlight.x, highlight.y, highlight.width, Math.max(highlight.height, entry.fontSize * viewport.scale * 1.25));
  }
  const baseline = pdfToViewport(viewport, { x: entry.pdfX, y: entry.pdfY, width: 0, height: 0 });
  const size = entry.fontSize * viewport.scale;
  context.font = `${entry.italic ? 'italic ' : ''}${entry.bold ? 'bold ' : ''}${size}px ${cssFontFamily(entry.fontFamily)}`;
  context.fillStyle = entry.color;
  context.textBaseline = 'alphabetic';
  const lines: string[] = [];
  const maxWidth = pdfToViewport(viewport, entry.pdfRect).width;
  let current = '';
  for (const paragraph of entry.text.split(/\r?\n/)) {
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && context.measureText(candidate).width > maxWidth) {
        lines.push(current);
        current = word;
      } else current = candidate;
    }
    lines.push(current);
    current = '';
  }
  lines.forEach((line, index) => {
    const width = context.measureText(line).width;
    const x = entry.alignment === 'center' ? baseline.x + (maxWidth - width) / 2
      : entry.alignment === 'right' ? baseline.x + maxWidth - width : baseline.x;
    const y = baseline.y + index * size * 1.2;
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

export default PdfTextEditor;
