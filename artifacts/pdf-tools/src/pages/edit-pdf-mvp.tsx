import { useEffect, useMemo, useRef, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { init as initPdfium, DEFAULT_PDFIUM_WASM_URL } from '@embedpdf/pdfium';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSafeTextGeometry, validateTextItemGeometry } from '../lib/pdf-text-geometry';

type TextOverlayItem = {
  id: string;
  pageNumber: number;
  text: string;
  originalText?: string;
  pdfX: number;
  pdfY: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
  color: string;
  isAdded?: boolean;
  isEdited?: boolean;
};

type TextLineGroup = {
  id: string;
  pageNumber: number;
  items: any[];
  text: string;
  baselineY: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  dominantFontSize: number;
  runs: Array<{ str: string; fontName?: string; fontSize?: number; bold?: boolean; italic?: boolean; x: number; y: number; width: number; height: number }>;
};

type PageLayout = {
  pageNumber: number;
  viewportWidth: number;
  viewportHeight: number;
  styles: Record<string, any>;
  textItems: TextOverlayItem[];
  lineGroups: TextLineGroup[];
};

type EditorDraft = {
  pageNumber: number;
  x: number;
  y: number;
  value: string;
  mode: 'edit' | 'add';
  id?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const rgbaToCss = (rgba?: number[]) => {
  if (!rgba || rgba.length < 3) return '#111827';
  const [r, g, b] = rgba;
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
};

const extractPdfItemColor = (item: any): string => {
  const rgba = item?.color ?? item?.fontColor ?? item?.style?.color ?? item?.fillColor ?? item?.strokeColor;
  if (Array.isArray(rgba)) return rgbaToCss(rgba);
  if (typeof rgba === 'string') return rgba;
  return '#111827';
};

const resolveCanvasFontFamily = (fontName?: string) => {
  const value = (fontName || '').toLowerCase();
  if (value.includes('times')) return 'Times New Roman';
  if (value.includes('courier')) return 'Courier New';
  if (value.includes('symbol')) return 'Symbol';
  return 'Helvetica';
};

const isBoldFontName = (fontName?: string) => {
  const value = (fontName || '').toLowerCase();
  return value.includes('bold') || value.includes('heavy') || value.includes('semibold') || value.includes('black') || value.includes('demi');
};

const resolvePdfLibFont = async (pdfDoc: any, fontName?: string) => {
  const value = (fontName || '').toLowerCase();
  if (value.includes('times')) return pdfDoc.embedFont(StandardFonts.TimesRoman);
  if (value.includes('courier')) return pdfDoc.embedFont(StandardFonts.Courier);
  if (value.includes('bold') || value.includes('heavy') || value.includes('semibold') || value.includes('black') || value.includes('demi')) {
    return pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }
  return pdfDoc.embedFont(StandardFonts.Helvetica);
};

const getPdfJsTextRunBaseline = (item: any) => {
  const transform = Array.isArray(item?.transform) ? item.transform : [1, 0, 0, 1, 0, 0];
  const baselineX = Number(transform[4] ?? 0);
  const baselineY = Number(transform[5] ?? 0);
  return {
    x: Number.isFinite(baselineX) ? baselineX : 0,
    y: Number.isFinite(baselineY) ? baselineY : 0,
  };
};

const getPdfLibTextPosition = (item: TextOverlayItem, pageWidth: number, pageHeight: number) => {
  const { x: baselineX, y: baselineY } = getPdfJsTextRunBaseline(item as any);
  const safePageWidth = Math.max(0, pageWidth);
  const safePageHeight = Math.max(0, pageHeight);
  return {
    // PDF.js baseline Y is in a coordinate system where origin is top-left of the page viewport.
    // pdf-lib expects coordinates with origin at the bottom-left. Convert accordingly.
    x: Math.min(Math.max(baselineX, 0), safePageWidth),
    y: Math.min(Math.max(safePageHeight - baselineY, 0), safePageHeight),
  };
};

const readPdfFileBytes = async (file: File) => {
  const sourceBuffer = await file.arrayBuffer();
  if (!sourceBuffer || sourceBuffer.byteLength === 0) {
    throw new Error('The PDF file is empty, i.e. its size is zero bytes.');
  }

  const pdfJsBytes = new Uint8Array(sourceBuffer.byteLength);
  pdfJsBytes.set(new Uint8Array(sourceBuffer));

  const pdfiumBytes = new Uint8Array(sourceBuffer.byteLength);
  pdfiumBytes.set(new Uint8Array(sourceBuffer));

  console.debug('[edit-pdf]', {
    fileName: file.name,
    fileSize: file.size,
    arrayBufferByteLength: sourceBuffer.byteLength,
    pdfJsByteLength: pdfJsBytes.byteLength,
    pdfiumByteLength: pdfiumBytes.byteLength,
  });

  return { sourceBuffer, pdfJsBytes, pdfiumBytes, fileSize: file.size };
};

const parseTextItem = (item: any, pageNumber: number, styles: Record<string, any> = {}): TextOverlayItem => {
  const transform = Array.isArray(item?.transform) ? item.transform : [1, 0, 0, 1, 0, 0];
  const { x, y } = getPdfJsTextRunBaseline(item);
  const text = String(item?.str ?? '');

  const safeGeometry = getSafeTextGeometry(item, styles, 1);
  const width = Number.isFinite(Number(item?.width)) && Number(item.width) > 0 ? Number(item.width) : safeGeometry.width;
  const height = Number.isFinite(Number(item?.height)) && Number(item.height) > 0 ? Number(item.height) : safeGeometry.height;

  const validation = validateTextItemGeometry(item, styles);
  if (validation.status === 'suspect') {
    console.warn('[edit-pdf] guarded text geometry for suspect item', {
      str: text,
      transform,
      reason: validation.reason,
      fallbackWidth: safeGeometry.width,
      fallbackHeight: safeGeometry.height,
      fallbackFontSize: safeGeometry.fontSize,
    });
  }

  return {
    id: `page-${pageNumber}-item-${Math.random().toString(36).slice(2, 9)}`,
    pageNumber,
    text,
    originalText: text,
    pdfX: x,
    pdfY: y,
    width: Math.max(12, width),
    height: Math.max(10, height),
    fontName: item?.fontName ?? 'Unknown font',
    fontSize: Math.max(6, Number(safeGeometry.fontSize) || 12),
    color: extractPdfItemColor(item),
    isAdded: false,
    isEdited: false,
  };
};

const clampTextFontSize = (fontSize: number, pageItems: TextOverlayItem[]) => {
  const numericSizes = pageItems.map((item) => Number(item.fontSize)).filter((value) => Number.isFinite(value) && value > 0);
  if (!numericSizes.length) return fontSize;

  const median = [...numericSizes].sort((a, b) => a - b)[Math.floor(numericSizes.length / 2)] ?? numericSizes[0];
  const limit = median * 3;

  if (fontSize > limit) {
    console.warn('[edit-pdf] suspicious oversized text font size; clamping to median guard', {
      fontSize,
      median,
      limit,
      pageItems: pageItems.map((item) => ({ text: item.text, fontSize: item.fontSize })),
    });
    return limit;
  }

  return fontSize;
};

const shouldRenderUpdatedText = (item: TextOverlayItem) => {
  const nextText = String(item.text ?? '');
  const originalText = String(item.originalText ?? '');
  return Boolean(item.isAdded || item.isEdited || nextText !== originalText);
};

const getRunFontSize = (item: any) => {
  const transform = Array.isArray(item?.transform) ? item.transform : [1, 0, 0, 1, 0, 0];
  const a = Number(transform[0] ?? 1);
  const b = Number(transform[1] ?? 0);
  const c = Number(transform[2] ?? 0);
  const d = Number(transform[3] ?? 1);
  const size = Math.hypot(a, b) || Math.hypot(c, d) || 1;
  return Number.isFinite(size) ? size : 1;
};

export function groupTextItemsIntoLines(textItems: any[] = [], tolerance = 2) {
  if (!Array.isArray(textItems) || textItems.length === 0) return [] as TextLineGroup[];

  const sorted = [...textItems].filter(Boolean).sort((a, b) => {
    const yDelta = (Number(a?.transform?.[5] ?? 0) - Number(b?.transform?.[5] ?? 0));
    if (Math.abs(yDelta) > 0.0001) return yDelta;
    return (Number(a?.transform?.[4] ?? 0) - Number(b?.transform?.[4] ?? 0));
  });

  const lineGroups: TextLineGroup[] = [];

  for (const item of sorted) {
    const runText = String(item?.str ?? '');
    const x = Number(item?.transform?.[4] ?? 0);
    const y = Number(item?.transform?.[5] ?? 0);
    const itemHeight = Math.max(Number(item?.height ?? 0), 1);
    const itemWidth = Math.max(Number(item?.width ?? 0), 1);
    const visualTop = y - itemHeight;
    const currentLine = lineGroups[lineGroups.length - 1];

    const buildGroup = (groupItems: any[], groupText: string, baseline: number, groupX: number, groupY: number, groupWidth: number, groupHeight: number, groupRuns: any[]) => ({
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      pageNumber: 1,
      items: groupItems,
      text: groupText,
      baselineY: baseline,
      boundingBox: {
        x: groupX,
        y: groupY,
        width: groupWidth,
        height: groupHeight,
      },
      dominantFontSize: groupRuns.reduce((acc, entry) => Math.max(acc, Number(entry.fontSize) || 12), 12),
      runs: groupRuns,
    });

    if (!currentLine) {
      const groupRuns = [{
        str: runText,
        fontName: item?.fontName,
        fontSize: Number(item?.fontSize) || getRunFontSize(item) * (Number(item?.fontSize) || 12),
        bold: /bold/i.test(String(item?.fontName ?? '')),
        italic: /italic/i.test(String(item?.fontName ?? '')),
        x,
        y,
        width: itemWidth,
        height: itemHeight,
      }];
      const group = buildGroup([item], runText, y, x, visualTop, itemWidth, itemHeight, groupRuns);
      lineGroups.push(group);
      continue;
    }

    const sameBaseline = Math.abs(y - currentLine.baselineY) <= tolerance;
    const xGap = x - (currentLine.boundingBox.x + currentLine.boundingBox.width);
    const avgCharWidth = Math.max(5, currentLine.boundingBox.width / Math.max(1, currentLine.text.length));
    const gapThreshold = Math.max(20, avgCharWidth * 3);
    const shouldAppend = sameBaseline && xGap <= gapThreshold;

    if (shouldAppend) {
      currentLine.items.push(item);
      const pad = xGap > 0 && xGap > 8 ? ' ' : '';
      currentLine.text = `${currentLine.text}${pad}${runText}`;
      const nextX = Math.min(currentLine.boundingBox.x, x);
      const nextRight = Math.max(currentLine.boundingBox.x + currentLine.boundingBox.width, x + itemWidth);
      const nextTop = Math.min(currentLine.boundingBox.y, visualTop);
      const nextBottom = Math.max(currentLine.boundingBox.y + currentLine.boundingBox.height, y + itemHeight * 0.2);
      currentLine.boundingBox = {
        x: nextX,
        y: nextTop,
        width: Math.max(1, nextRight - nextX),
        height: Math.max(1, nextBottom - nextTop),
      };
      currentLine.runs.push({
        str: runText,
        fontName: item?.fontName,
        fontSize: Number(item?.fontSize) || getRunFontSize(item) * (Number(item?.fontSize) || 12),
        bold: /bold/i.test(String(item?.fontName ?? '')),
        italic: /italic/i.test(String(item?.fontName ?? '')),
        x,
        y,
        width: itemWidth,
        height: itemHeight,
      });
      const weights = currentLine.runs.map((entry) => Number(entry.fontSize) || 12);
      const maxValue = [...weights].sort((a, b) => b - a)[0] ?? 12;
      const counts = new Map<number, number>();
      for (const value of weights) {
        const key = Math.round(value * 10) / 10;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      currentLine.dominantFontSize = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? maxValue;
      console.debug('[edit-pdf] grouped N runs into line:', { text: currentLine.text, baselineY: currentLine.baselineY, count: currentLine.items.length });
    } else {
      const groupRuns = [{
        str: runText,
        fontName: item?.fontName,
        fontSize: Number(item?.fontSize) || getRunFontSize(item) * (Number(item?.fontSize) || 12),
        bold: /bold/i.test(String(item?.fontName ?? '')),
        italic: /italic/i.test(String(item?.fontName ?? '')),
        x,
        y,
        width: itemWidth,
        height: itemHeight,
      }];
      lineGroups.push(buildGroup([item], runText, y, x, visualTop, itemWidth, itemHeight, groupRuns));
    }
  }

  return lineGroups;
}

const getOverlayBoundsForItem = (item: TextOverlayItem, page: PageLayout, pageWidth: number, pageHeight: number) => {
  const scaleX = pageWidth / page.viewportWidth;
  const scaleY = pageHeight / page.viewportHeight;
  const safeGeometry = getSafeTextGeometry(item, page.styles ?? {}, 1);
  const width = Math.max(12, safeGeometry.width * scaleX);
  const height = Math.max(12, safeGeometry.height * scaleY);
  const left = Math.max(0, item.pdfX * scaleX);
  const top = Math.max(0, (page.viewportHeight - item.pdfY - safeGeometry.height) * scaleY);

  console.debug('[edit-pdf] overlay bounds', {
    text: item.text,
    pdfTransform: { x: item.pdfX, y: item.pdfY, width: item.width, height: item.height },
    safeGeometry,
    cssBounds: { left, top, width, height },
    pageScale: { pageWidth, pageHeight, viewportWidth: page.viewportWidth, viewportHeight: page.viewportHeight, scaleX, scaleY },
  });

  return { left, top, width, height };
};

const getOverlayBoundsForLineGroup = (group: TextLineGroup, page: PageLayout, pageWidth: number, pageHeight: number) => {
  const scaleX = pageWidth / page.viewportWidth;
  const scaleY = pageHeight / page.viewportHeight;
  const padX = 10;
  const padY = 12;
  const left = Math.max(0, (group.boundingBox.x - padX) * scaleX);
  const top = Math.max(0, (page.viewportHeight - (group.boundingBox.y + group.boundingBox.height + padY)) * scaleY);
  const width = Math.max(24, (group.boundingBox.width + padX * 2) * scaleX);
  const height = Math.max(20, (group.boundingBox.height + padY * 2) * scaleY);
  return { left, top, width, height };
};

async function loadPdfLayout(file: File, pdfJsBytes: Uint8Array) {
  const pdfDocument = await pdfjsLib.getDocument({ data: pdfJsBytes }).promise;
  const layouts: PageLayout[] = [];

  for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex += 1) {
    const page = await pdfDocument.getPage(pageIndex);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();

    const styles = textContent.styles ?? {};
    const textItems = (textContent.items || []).map((item: any, index: number) => {
      const parsed = parseTextItem(item, pageIndex, styles);
      return {
        ...parsed,
        id: `page-${pageIndex}-item-${index}-${Math.random().toString(36).slice(2, 7)}`,
      };
    });

    const lineGroups = groupTextItemsIntoLines(textItems, 2);
    layouts.push({
      pageNumber: pageIndex,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      styles,
      textItems,
      lineGroups,
    });
  }

  return { pdfDocument, layouts };
}

function EditPdfMvp() {
  const [file, setFile] = useState<File | null>(null);
  const [pageLayouts, setPageLayouts] = useState<PageLayout[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState('Upload a PDF to start editing.');
  const [error, setError] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [editorDraft, setEditorDraft] = useState<EditorDraft | null>(null);
  const [addTextMode, setAddTextMode] = useState(false);
  const [pageScale, setPageScale] = useState(1);
  const [showDebugTextBoxes, setShowDebugTextBoxes] = useState(false);
  const [pdfiumReady, setPdfiumReady] = useState(false);
  const [pdfiumMessage, setPdfiumMessage] = useState('Preparing the PDF editor...');
  const [pdfJsBytes, setPdfJsBytes] = useState<Uint8Array | null>(null);
  const [pdfiumBytes, setPdfiumBytes] = useState<Uint8Array | null>(null);
  const pdfDocumentRef = useRef<any>(null);
  const mainCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const thumbnailCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  useEffect(() => {
    let active = true;

    const initializePdfium = async () => {
      try {
        const response = await fetch(DEFAULT_PDFIUM_WASM_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDFium wasm: ${response.status}`);
        }

        const wasmBinary = await response.arrayBuffer();
        const pdfiumModule = await initPdfium({ wasmBinary });
        if (!active) return;

        setPdfiumReady(true);
        setPdfiumMessage('PDFium runtime ready.');
        pdfiumModule.PDFiumExt_Init();
      } catch (innerError) {
        console.error('PDFium init failed', innerError);
        if (!active) return;
        setPdfiumReady(false);
        setPdfiumMessage('PDFium WASM could not be initialized in this build.');
      }
    };

    void initializePdfium();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pdfJsBytes || !file) return;

    let cancelled = false;
    const renderPdf = async () => {
      try {
        setStatus('loading');
        setError(null);
        setMessage('Loading PDF and preparing the editor...');

        const { pdfDocument, layouts } = await loadPdfLayout(file, pdfJsBytes);
        if (cancelled) return;

        pdfDocumentRef.current = pdfDocument;
        setPageLayouts(layouts);
        setStatus('ready');
        setMessage('Editor ready. Select text and double-click to edit it.');
      } catch (innerError) {
        console.error('[edit-pdf]', innerError);
        if (!cancelled) {
          setStatus('error');
          setError('This PDF could not be opened in the browser editor.');
        }
      }
    };

    void renderPdf();
    return () => {
      cancelled = true;
    };
  }, [file, pdfJsBytes]);

  const renderPageToCanvas = async (pageNumber: number, canvas: HTMLCanvasElement, scale: number) => {
    const pdfDocument = pdfDocumentRef.current;
    if (!pdfDocument || !pdfJsBytes) return;

    const page = await pdfDocument.getPage(pageNumber);
    const deviceScale = (window.devicePixelRatio || 1) * scale;
    const viewport = page.getViewport({ scale: deviceScale });
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = Math.max(1, Math.ceil(viewport.width));
    canvas.height = Math.max(1, Math.ceil(viewport.height));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const pageLayout = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!pageLayout) return;

    const editedItems = pageLayout.textItems.filter(shouldRenderUpdatedText);

    editedItems.forEach((item) => {
      const x = (item.pdfX / pageLayout.viewportWidth) * canvas.width;
      const y = canvas.height - (item.pdfY / pageLayout.viewportHeight) * canvas.height;
      const boxWidth = Math.max(18, (item.width / pageLayout.viewportWidth) * canvas.width + 10);
      const boxHeight = Math.max(18, (item.height / pageLayout.viewportHeight) * canvas.height + 10);
      const displayText = item.text && item.text.trim() ? item.text : item.originalText ?? '';

      context.save();
      context.fillStyle = '#ffffff';
      context.fillRect(x - 4, y - boxHeight + 2, boxWidth, boxHeight);

      if (!displayText || !displayText.trim()) {
        context.restore();
        return;
      }

      const fontWeight = isBoldFontName(item.fontName) ? 'bold' : 'normal';
      context.font = `${fontWeight} ${Math.max(10, item.fontSize)}px ${resolveCanvasFontFamily(item.fontName)}`;
      context.fillStyle = item.color || '#111827';
      context.textBaseline = 'alphabetic';
      context.fillText(displayText, x, y);
      context.restore();
    });
  };

  useEffect(() => {
    if (!pdfJsBytes || !pageLayouts.length) return;

    const renderPages = async () => {
      for (const page of pageLayouts) {
        const mainCanvas = mainCanvasRefs.current[page.pageNumber];
        if (mainCanvas) {
          await renderPageToCanvas(page.pageNumber, mainCanvas, pageScale);
        }

        const thumbCanvas = thumbnailCanvasRefs.current[page.pageNumber];
        if (thumbCanvas) {
          await renderPageToCanvas(page.pageNumber, thumbCanvas, 0.18);
        }
      }
    };

    void renderPages();
  }, [pageLayouts, pageScale, pdfJsBytes]);

  const selectedText = useMemo(() => {
    if (!selectedTextId) return null;
    for (const page of pageLayouts) {
      const match = page.lineGroups.find((group) => group.id === selectedTextId);
      if (match) return match;
    }
    return null;
  }, [pageLayouts, selectedTextId]);

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    try {
      const { pdfJsBytes: nextPdfJsBytes, pdfiumBytes: nextPdfiumBytes } = await readPdfFileBytes(selected);
      setFile(selected);
      setPdfJsBytes(nextPdfJsBytes);
      setPdfiumBytes(nextPdfiumBytes);
      setSelectedTextId(null);
      setEditorDraft(null);
      setAddTextMode(false);
      setError(null);
      setMessage('Loading PDF and preparing the editor...');
    } catch (innerError: any) {
      console.error('[edit-pdf] file read error', innerError);
      setStatus('error');
      setError(innerError?.message || 'This PDF could not be opened in the browser editor.');
    }
  };

  const updateTextItem = (pageNumber: number, itemId: string, nextText: string) => {
    console.log('[edit-pdf] updateTextItem called', { pageNumber, itemId, nextText });
    setPageLayouts((current) =>
      current.map((page) => {
        if (page.pageNumber !== pageNumber) return page;
        const targetGroup = page.lineGroups.find((group) => group.id === itemId);
        if (!targetGroup) return page;
        const groupStartX = targetGroup.boundingBox.x;
        const groupEndX = targetGroup.boundingBox.x + targetGroup.boundingBox.width;
        const replacement: TextOverlayItem = {
          id: `line-edited-${Date.now()}`,
          pageNumber,
          text: nextText,
          originalText: targetGroup.text,
          pdfX: groupStartX,
          pdfY: targetGroup.baselineY,
          width: Math.max(40, groupEndX - groupStartX),
          height: Math.max(12, targetGroup.boundingBox.height),
          fontName: targetGroup.runs[0]?.fontName ?? 'Helvetica',
          fontSize: targetGroup.dominantFontSize,
          color: '#111827',
          isAdded: false,
          isEdited: true,
        };

        const remainingTextItems = page.textItems.filter((item) => !targetGroup.items.some((run) => run === item));
        return {
          ...page,
          textItems: [...remainingTextItems, replacement],
        };
      }),
    );
    setSelectedTextId(null);
    setEditorDraft(null);
  };

  const deleteTextItem = (pageNumber: number, itemId: string) => {
    console.log('[edit-pdf] deleteTextItem called', { pageNumber, itemId });
    setPageLayouts((current) =>
      current.map((page) => {
        if (page.pageNumber !== pageNumber) return page;
        return {
          ...page,
          textItems: page.textItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  text: '',
                  isEdited: true,
                  isAdded: false,
                }
              : item,
          ),
        };
      }),
    );
    setSelectedTextId(null);
    setEditorDraft(null);
  };

  const addTextAtPoint = (pageNumber: number, x: number, y: number, textValue = 'New text') => {
    const nextId = `draft-${Date.now()}`;
    console.log('[edit-pdf] addTextAtPoint called', { pageNumber, x, y, nextId });
    const newItem: TextOverlayItem = {
      id: nextId,
      pageNumber,
      text: textValue,
      originalText: textValue,
      pdfX: x,
      pdfY: y,
      width: 120,
      height: 18,
      fontName: 'Helvetica',
      fontSize: 12,
      color: '#111827',
      isAdded: true,
      isEdited: false,
    };

    setPageLayouts((current) =>
      current.map((page) =>
        page.pageNumber === pageNumber ? { ...page, textItems: [...page.textItems, newItem] } : page,
      ),
    );
    setSelectedTextId(nextId);
    setEditorDraft({ pageNumber, x, y, value: textValue, mode: 'add', id: nextId });
    setAddTextMode(false);
  };

  const handlePageClick = (pageNumber: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!addTextMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const page = pageLayouts.find((entry) => entry.pageNumber === pageNumber);
    if (!page) return;

    const xRatio = clamp(relativeX / rect.width, 0, 1);
    const yRatio = clamp(relativeY / rect.height, 0, 1);
    const pdfX = xRatio * page.viewportWidth;
    const pdfY = yRatio * page.viewportHeight;
    addTextAtPoint(pageNumber, pdfX, pdfY);
  };

  const downloadEditedPdf = async () => {
    if (!pdfiumBytes) return;

    console.log('[edit-pdf] downloadEditedPdf started, pageLayouts:', pageLayouts.length);
    for (const page of pageLayouts) {
      console.log('[edit-pdf]   page', page.pageNumber, 'textItems:', page.textItems.length);
      for (const item of page.textItems) {
        const willRender = shouldRenderUpdatedText(item);
        console.log('[edit-pdf]     item:', { id: item.id.slice(0, 20), text: item.text, orig: item.originalText, edited: item.isEdited, added: item.isAdded, willRender });
      }
    }

    const source = await PDFDocument.load(pdfiumBytes);
    const output = await PDFDocument.create();
    const existingPages = source.getPages();

    const pagesWithEdits: Array<{ pageNumber: number; count: number }> = [];
    const drawErrors: Array<{ pageNumber: number; text: string; error: any }> = [];

    for (let pageIndex = 0; pageIndex < existingPages.length; pageIndex += 1) {
      const sourcePage = source.getPages()[pageIndex];
      const pageSize = sourcePage.getSize();
      const [copiedPage] = await output.copyPages(source, [pageIndex]);
      const target = output.addPage(copiedPage);
      const pageNumber = pageIndex + 1;
      const pageEntries = (pageLayouts.find((page) => page.pageNumber === pageNumber)?.textItems ?? []).filter(shouldRenderUpdatedText);

      pagesWithEdits.push({ pageNumber, count: pageEntries.length });
      console.log('[edit-pdf] pageEntries for page', pageNumber, ':', pageEntries.length);

      if (!pageEntries.length) continue;

      for (const item of pageEntries) {
        console.log('[edit-pdf] drawing item on page', pageNumber, ':', {
          id: item.id,
          text: item.text,
          originalText: item.originalText,
          isEdited: item.isEdited,
          isAdded: item.isAdded,
        });
        const safeText = item.text && item.text.trim() ? item.text : item.originalText ?? '';
        if (!safeText || !safeText.trim()) {
          console.log('[edit-pdf] SKIPPED: empty text after trim');
          continue;
        }

        const pageStyles = pageLayouts.find((page) => page.pageNumber === pageNumber)?.styles ?? {};
        const safeGeometry = getSafeTextGeometry(item, pageStyles, 1);
        const color = item.color || '#111827';
        const rgbColor = (() => {
          if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const normal = hex.length === 3 ? hex.split('').map((ch) => ch + ch).join('') : hex;
            const value = Number.parseInt(normal, 16);
            const r = ((value >> 16) & 255) / 255;
            const g = ((value >> 8) & 255) / 255;
            const b = (value & 255) / 255;
            return rgb(r, g, b);
          }
          return rgb(0.07, 0.12, 0.18);
        })();

        try {
          const font = await resolvePdfLibFont(output, item.fontName);
          const originalFontSize = Number(item.fontSize) > 0 ? Number(item.fontSize) : Number(safeGeometry.fontSize) || 12;
          const transformedFontSize = clampTextFontSize(originalFontSize, pageEntries);
          // Keep heading text near its original size while preventing giant exports.
          const absoluteMax = Math.min(48, Math.max(18, pageSize.height * 0.1));
          const cappedFontSize = Math.min(transformedFontSize, absoluteMax);
          if (cappedFontSize !== transformedFontSize) {
            console.warn('[edit-pdf] capped oversized font size', { pageNumber, original: transformedFontSize, capped: cappedFontSize, pageHeight: pageSize.height });
          }
          const boxWidth = Math.max(18, safeGeometry.width || 24);
          const boxHeight = Math.max(18, safeGeometry.height || cappedFontSize);
          // Convert PDF.js viewport coordinates into pdf-lib page coordinates
          const pageLayout = pageLayouts.find((p) => p.pageNumber === pageNumber);
          const viewportW = pageLayout?.viewportWidth || pageSize.width;
          const viewportH = pageLayout?.viewportHeight || pageSize.height;
          const scaleX = pageSize.width / viewportW;
          const scaleY = pageSize.height / viewportH;

          const x = item.pdfX * scaleX;
          // Map PDF.js viewport Y into PDF units. Using y = item.pdfY * scaleY aligns the
          // overlay math used for in-browser rendering with pdf-lib coordinates.
          const y = item.pdfY * scaleY;

          const scaledFontSize = cappedFontSize * scaleY;
          const boxWidthScaled = Math.max(18, safeGeometry.width || 24) * scaleX;
          const boxHeightScaled = Math.max(18, safeGeometry.height || cappedFontSize) * scaleY;

          console.log('[edit-pdf] export draw item', {
            pageNumber,
            text: safeText,
            transform: [item.pdfX, item.pdfY, item.width, item.height],
            width: item.width,
            height: item.height,
            safeGeometry,
            inputFontSize: item.fontSize,
            resolvedFontSize: transformedFontSize,
            pdfLibPosition: { x, y },
            boxWidthScaled,
            boxHeightScaled,
            scaledFontSize,
            fontName: item.fontName,
          });

          // Mask original PDF text for edited items by drawing a white rectangle behind it.
          if (item.isEdited && !item.isAdded) {
            try {
              // Prefer masking exactly the original text span so we don't erase
              // unrelated content when the new text is longer than the original.
              const original = String(item.originalText ?? '');
              const maskText = original || safeText;
              const maskWidth = Math.max(4, font.widthOfTextAtSize(maskText, scaledFontSize));
              const padding = Math.max(4, Math.round(scaledFontSize * 0.12));

              // Estimate ascent/descent so the rectangle aligns with glyph metrics
              const ascentEst = scaledFontSize * 0.75;
              const descentEst = Math.max(2, Math.round(scaledFontSize * 0.25));

              const rectX = Math.max(0, x - padding);
              // baseline y; rectangle bottom should be baseline - descent - padding
              const rectY = Math.max(0, y - descentEst - padding);
              const rectWidth = Math.min(pageSize.width - rectX, maskWidth + padding * 2);
              const rectHeight = Math.min(pageSize.height - rectY, Math.round(ascentEst + descentEst + padding * 2));

              target.drawRectangle({
                x: rectX,
                y: rectY,
                width: rectWidth,
                height: rectHeight,
                color: rgb(1, 1, 1),
              });
            } catch (maskErr) {
              console.warn('[edit-pdf] failed to draw mask rectangle for edited text', maskErr);
            }
          }

          // Wrap the text into multiple lines if it exceeds the available width.
          const rightMargin = 40; // leave some room to page edge
          const maxWidth = Math.max(24, Math.min(pageSize.width - x - rightMargin, pageSize.width - x));
          const words = String(safeText).split(/\s+/);
          const lines: string[] = [];
          let currentLine = '';
          for (const word of words) {
            const test = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(test, scaledFontSize);
            if (testWidth <= maxWidth) {
              currentLine = test;
              continue;
            }
            if (currentLine) lines.push(currentLine);
            // long single word fallback: split by characters
            if (font.widthOfTextAtSize(word, scaledFontSize) > maxWidth) {
              let chunk = '';
              for (const ch of word) {
                const ctest = chunk + ch;
                if (font.widthOfTextAtSize(ctest, scaledFontSize) <= maxWidth) {
                  chunk = ctest;
                } else {
                  if (chunk) lines.push(chunk);
                  chunk = ch;
                }
              }
              currentLine = chunk;
            } else {
              currentLine = word;
            }
          }
          if (currentLine) lines.push(currentLine);

          const lineHeight = Math.max(scaledFontSize * 1.15, scaledFontSize + 2);
          const totalHeight = lines.length * lineHeight;
          const descentEst = Math.max(2, Math.round(scaledFontSize * 0.25));
          const padding = Math.max(4, Math.round(scaledFontSize * 0.12));

          // Rectangle should cover all wrapped lines. y is the baseline of the first (top) line.
          const rectX = Math.max(0, x - padding);
          const rectY = Math.max(0, y - descentEst - (lines.length - 1) * lineHeight - padding);
          const measuredLineWidths = lines.map((l) => font.widthOfTextAtSize(l, scaledFontSize));
          const rectWidth = Math.min(pageSize.width - rectX, Math.max(...measuredLineWidths, 0) + padding * 2);
          const rectHeight = Math.min(pageSize.height - rectY, totalHeight + padding * 2);

          if (item.isEdited && !item.isAdded) {
            try {
              target.drawRectangle({ x: rectX, y: rectY, width: rectWidth, height: rectHeight, color: rgb(1, 1, 1) });
            } catch (maskErr) {
              console.warn('[edit-pdf] failed to draw mask rectangle for edited text', maskErr);
            }
          }

          if (showDebugTextBoxes) {
            target.drawRectangle({ x: rectX, y: rectY, width: rectWidth, height: rectHeight, borderColor: rgb(0.2, 0.5, 1), borderWidth: 1, color: rgb(0.2, 0.5, 1) });
          }

          // Draw each wrapped line, stepping down by lineHeight per line.
          for (let i = 0; i < lines.length; i += 1) {
            const lineText = lines[i];
            const lineY = y - i * lineHeight;
            target.drawText(lineText, { x, y: lineY, size: scaledFontSize, font, color: rgbColor });
          }
        } catch (drawError) {
          console.warn('[edit-pdf] skipped unsupported text draw:', safeText, drawError);
          drawErrors.push({ pageNumber, text: safeText, error: drawError });
        }
      }
    }

    console.log('[edit-pdf] pagesWithEdits', pagesWithEdits.filter((p) => p.count > 0));
    if (drawErrors.length) console.log('[edit-pdf] drawErrors', drawErrors.slice(0, 10));

    const bytes = await output.save();
    console.log('[edit-pdf] output.save() completed, bytes type:', bytes.constructor.name, 'length:', bytes.length || bytes.byteLength);

    // Convert Uint8Array to base64 in chunks to avoid call stack limits for large files
    const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const chunkSize = 0x8000; // 32KB
    let binary = '';
    for (let i = 0; i < uint8.length; i += chunkSize) {
      const slice = uint8.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.prototype.slice.call(slice));
    }
    const base64 = btoa(binary);

    // Visible logs so users can inspect before the network call
    console.log('[edit-pdf] sending edited PDF to server', { filename: (file?.name ? file.name.replace(/\.pdf$/i, '') : 'edited') + '-edited.pdf', byteLength: uint8.length, base64Length: base64.length });
    setMessage('Uploading edited PDF to server...');

    // Prefer sending the edited PDF as a binary Blob to avoid base64/JSON overhead.
    const filenameHeader = (file?.name ? file.name.replace(/\.pdf$/i, '') : 'edited') + '-edited.pdf';
    const blobBytes = new Uint8Array(uint8);
    const blob = new Blob([blobBytes], { type: 'application/pdf' });
    try {
      const apiResp = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf', 'X-Filename': filenameHeader },
        body: blob,
      });

      if (!apiResp.ok) {
        let msg = 'Failed to download edited PDF';
        try {
          const j = await apiResp.json();
          msg = j?.error || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const respBlob = await apiResp.blob();
      // Compute SHA-256 of the response in the browser to verify integrity
      let finalBlob = respBlob;
      try {
        const arrBuf = await respBlob.arrayBuffer();
        const hashBuf = await (window.crypto.subtle || crypto.subtle).digest('SHA-256', arrBuf);
        const hashHex = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
        console.log('[edit-pdf] response SHA256', hashHex, 'responseBytes', arrBuf.byteLength);
        finalBlob = new Blob([arrBuf], { type: 'application/pdf' });
      } catch (e) {
        console.warn('[edit-pdf] failed to compute response hash', e);
      }
      const url = URL.createObjectURL(finalBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      // try to parse filename from content-disposition header if present
      const cd = apiResp.headers.get('content-disposition') || '';
      let filename = (file?.name ? file.name.replace(/\.pdf$/i, '') : 'edited') + '-edited.pdf';
      const m = cd.match(/filename\*=?(?:UTF-8''?)?"?([^";]+)"?/i);
      if (m && m[1]) filename = decodeURIComponent(m[1]);
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage('Modified PDF downloaded.');
    } catch (err: any) {
      console.error('[edit-pdf] download via server failed', err);
      // fallback to client-side download if server call fails
      try {
        const blobBytes = new Uint8Array(uint8);
        const blob = new Blob([blobBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = (file?.name ? file.name.replace(/\.pdf$/i, '') : 'edited') + '-edited.pdf';
        anchor.click();
        URL.revokeObjectURL(url);
        setMessage('Modified PDF downloaded (client fallback).');
      } catch (inner) {
        setMessage('Could not download modified PDF.');
      }
    }
  };

  return (
    <div className="min-h-[70vh] rounded-[28px] border border-border/70 bg-card/90 p-4 md:p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">PDFKira — Edit PDF</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">Text-only editing MVP</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {pdfiumReady ? 'PDFium ready' : 'PDFium loading'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setAddTextMode((value) => !value)}>
            {addTextMode ? 'Cancel Add Text' : 'Add Text'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDebugTextBoxes((value) => !value)}>
            {showDebugTextBoxes ? 'Hide debug boxes' : 'Show debug boxes'}
          </Button>
          <Button size="sm" onClick={downloadEditedPdf} disabled={!file || status !== 'ready'}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{pdfiumMessage}</span>
        <span>•</span>
        <span>{status === 'ready' ? 'Editor ready' : status === 'loading' ? 'Loading PDF...' : 'Waiting for PDF'}</span>
      </div>

      {!file ? (
        <div className="rounded-[26px] border border-dashed border-border/70 bg-background/80 p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-6 py-10 text-center">
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileSelected} />
            <div className="text-3xl">📄</div>
            <div>
              <p className="text-lg font-semibold text-foreground">Upload a PDF</p>
              <p className="mt-1 text-sm text-muted-foreground">This MVP is text-only. Images are ignored.</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-border/70 bg-background/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pages</h3>
              <Badge variant="outline" className="rounded-full px-2 py-1 text-[10px]">
                {pageLayouts.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {pageLayouts.map((page) => (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => document.getElementById(`pdf-page-${page.pageNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className={`w-full rounded-2xl border p-2 text-left transition ${selectedText?.pageNumber === page.pageNumber ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/70 bg-card/80 hover:border-primary/35'}`}
                >
                  <div className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-inner">
                    <canvas
                      ref={(element) => {
                        thumbnailCanvasRefs.current[page.pageNumber] = element;
                      }}
                      width={200}
                      height={260}
                      className="block h-20 w-full object-contain bg-white"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">Page {page.pageNumber}</span>
                    <span className="text-[10px] text-muted-foreground">{page.textItems.length} items</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedText && (
              <div className="mt-5 rounded-2xl border border-border/70 bg-card p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Text properties</p>
                <div className="mt-3 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Font</span><span className="font-medium">{selectedText.runs[0]?.fontName ?? 'Mixed'}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Size</span><span className="font-medium">{(selectedText.dominantFontSize ?? selectedText.runs[0]?.fontSize ?? 12).toFixed(1)} pt</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Color</span><span className="font-medium">Mixed</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Y</span><span className="font-medium">{Math.round(selectedText.baselineY)}</span></div>
                </div>
              </div>
            )}
          </aside>

          <div className="space-y-4">
            {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            {!error && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-3">
                <Button variant="outline" size="sm" onClick={() => setPageScale((value) => Math.max(0.45, Number((value - 0.15).toFixed(2))))}>−</Button>
                <span className="min-w-[62px] text-center text-sm font-medium text-foreground">{(pageScale * 100).toFixed(0)}%</span>
                <Button variant="outline" size="sm" onClick={() => setPageScale((value) => Math.min(2.2, Number((value + 0.15).toFixed(2))))}>＋</Button>
              </div>
            )}

            {pageLayouts.map((page) => {
              const pageWidth = Math.min(page.viewportWidth * pageScale, 900);
              const pageHeight = page.viewportHeight * (pageWidth / page.viewportWidth);

              return (
                <div key={page.pageNumber} id={`pdf-page-${page.pageNumber}`} className="rounded-[28px] border border-border/70 bg-[#10151d] p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Page {page.pageNumber}</h3>
                    <Badge variant="secondary" className="rounded-full border border-border/70 bg-card px-2 py-1 text-[10px]">
                      {page.textItems.length} texts
                    </Badge>
                  </div>

                  <div className="flex justify-center">
                    <div
                      className="relative overflow-hidden rounded-[18px] border border-[#dee4eb] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                      style={{ width: `${pageWidth}px`, height: `${pageHeight}px` }}
                      onClick={(event) => handlePageClick(page.pageNumber, event)}
                    >
                      <canvas
                        ref={(element) => {
                          mainCanvasRefs.current[page.pageNumber] = element;
                        }}
                        style={{ width: '100%', height: '100%', display: 'block', background: '#fff' }}
                      />

                      {page.lineGroups.map((group) => {
                        const isSelected = selectedTextId === group.id;
                        const overlayBounds = getOverlayBoundsForLineGroup(group, page, pageWidth, pageHeight);

                        return (
                          <button
                            key={group.id}
                            type="button"
                            aria-label={`Select text on page ${page.pageNumber}`}
                            title="Select PDF text"
                            onMouseDown={(event) => {
                              event.stopPropagation();
                              setSelectedTextId(group.id);
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedTextId(group.id);
                            }}
                            onDoubleClick={(event) => {
                              event.stopPropagation();
                              setEditorDraft({
                                pageNumber: page.pageNumber,
                                x: group.boundingBox.x,
                                y: group.baselineY,
                                value: group.text,
                                mode: 'edit',
                                id: group.id,
                              });
                              setSelectedTextId(group.id);
                            }}
                            className="absolute cursor-text rounded-md border transition"
                            style={{
                              left: `${overlayBounds.left}px`,
                              top: `${overlayBounds.top}px`,
                              width: `${overlayBounds.width}px`,
                              height: `${overlayBounds.height}px`,
                              zIndex: 12,
                              background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(148,163,184,0.06)',
                              border: isSelected ? '1px solid rgba(59,130,246,0.8)' : '1px solid rgba(148,163,184,0.32)',
                              boxSizing: 'border-box',
                              color: 'transparent',
                              fontSize: '0',
                              lineHeight: '1',
                              padding: '0',
                              userSelect: 'none',
                              pointerEvents: 'auto',
                              transform: 'translateY(0)',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {selectedTextId && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const target = pageLayouts.flatMap((pageEntry) => pageEntry.lineGroups).find((group) => group.id === selectedTextId);
                        if (!target) return;
                        setEditorDraft({ pageNumber: target.pageNumber, x: target.boundingBox.x, y: target.baselineY, value: target.text, mode: 'edit', id: target.id });
                      }}>
                        Edit selected text
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => {
                        const target = pageLayouts.flatMap((pageEntry) => pageEntry.lineGroups).find((group) => group.id === selectedTextId);
                        if (!target) return;
                        const targetItem = pageLayouts.flatMap((pageEntry) => pageEntry.textItems).find((item) => target.items.includes(item));
                        if (!targetItem) return;
                        deleteTextItem(target.pageNumber, targetItem.id);
                      }}>
                        Delete selected text
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {editorDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-border/70 bg-card p-5 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {editorDraft.mode === 'edit' ? 'Edit existing text' : 'Add text'}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">Text editor</h3>
            <textarea
              value={editorDraft.value}
              onChange={(event) => setEditorDraft((current) => current ? { ...current, value: event.target.value } : current)}
              className="mt-4 min-h-[110px] w-full rounded-2xl border border-border/70 bg-background/90 px-3 py-2 text-foreground outline-none ring-0"
            />

            <div className="mt-4 flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>Page {editorDraft.pageNumber}</span>
              <span>X {Math.round(editorDraft.x)}, Y {Math.round(editorDraft.y)}</span>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditorDraft(null)}>Cancel</Button>
              <Button onClick={() => {
                if (!editorDraft) return;
                if (editorDraft.mode === 'edit' && editorDraft.id) {
                  updateTextItem(editorDraft.pageNumber, editorDraft.id, editorDraft.value);
                } else {
                  addTextAtPoint(editorDraft.pageNumber, editorDraft.x, editorDraft.y, editorDraft.value);
                }
                setEditorDraft(null);
              }}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Status:</strong> {message}</p>
        <p className="mt-2">This first version is text-only. It ignores image content and focuses on selecting, editing, adding, and downloading text in the browser.</p>
      </div>
    </div>
  );
}

export default EditPdfMvp;
