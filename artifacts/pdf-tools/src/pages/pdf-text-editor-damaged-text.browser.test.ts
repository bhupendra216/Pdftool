import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import fontkit from '@pdf-lib/fontkit';
import { PDFDict, PDFDocument, PDFName, StandardFonts } from 'pdf-lib';
import { expect, it, vi } from 'vitest';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}". Current text: ${container.textContent?.slice(-1000)}`);
}

async function openParagraphEditor(container: HTMLElement, paragraph: HTMLButtonElement) {
  await act(async () => paragraph.click());
  const editButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
    .find((button) => button.textContent?.trim() === 'Edit selected text');
  expect(editButton).toBeDefined();
  await act(async () => editButton!.click());
}

async function createDamagedTextPdf() {
  const document = await PDFDocument.create();
  const page = document.addPage([612, 792]);
  const font = await document.embedFont(StandardFonts.Helvetica);
  page.drawText('Damaged Z line', { x: 72, y: 700, size: 18, font });
  page.drawText('Second intact line', { x: 72, y: 676, size: 18, font });
  page.drawText('Third intact line', { x: 72, y: 652, size: 18, font });
  await document.flush();

  const fontDictionary = document.context.lookup(font.ref, PDFDict);
  const printableAscii = Array.from({ length: 95 }, (_, index) => index + 32);
  const toUnicode = [
    '/CIDInit /ProcSet findresource begin',
    '12 dict begin',
    'begincmap',
    '/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def',
    '/CMapName /DamagedTextTest def',
    '/CMapType 2 def',
    '1 begincodespacerange',
    '<00> <FF>',
    'endcodespacerange',
    `${printableAscii.length} beginbfchar`,
    ...printableAscii.map((code) =>
      `<${code.toString(16).padStart(2, '0').toUpperCase()}> <${
        code === 90 ? '0000' : code.toString(16).padStart(4, '0').toUpperCase()
      }>`),
    'endbfchar',
    'endcmap',
    'CMapName currentdict /CMap defineresource pop',
    'end',
    'end',
  ].join('\n');
  fontDictionary.set(PDFName.of('ToUnicode'), document.context.register(document.context.flateStream(toUnicode)));
  return document.save();
}

function readCanvasPixels(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Could not read the rendered PDF page.');
  return context.getImageData(0, 0, canvas.width, canvas.height).data;
}

function countDarkPixels(pixels: Uint8ClampedArray, width: number, x: number, y: number, rectWidth: number, rectHeight: number) {
  let count = 0;
  for (let row = y; row < y + rectHeight; row += 1) {
    for (let column = x; column < x + rectWidth; column += 1) {
      const offset = (row * width + column) * 4;
      if (pixels[offset] < 160 && pixels[offset + 1] < 160 && pixels[offset + 2] < 160) count += 1;
    }
  }
  return count;
}

function changedPixels(left: Uint8ClampedArray, right: Uint8ClampedArray, startY: number, endY: number, width: number) {
  let changed = 0;
  for (let y = startY; y < endY; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if ([0, 1, 2].some((channel) => Math.abs(left[offset + channel] - right[offset + channel]) > 2)) changed += 1;
    }
  }
  return changed;
}

it('marks damaged extraction and exports only changed lines while preserving untouched pixels', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:damaged-pdf-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const file = new File([await createDamagedTextPdf()], 'damaged-text.pdf', { type: 'application/pdf' });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    Object.defineProperty(fileInput, 'files', { configurable: true, value: transfer.files });
    await act(async () => {
      fileInput.dispatchEvent(new Event('input', { bubbles: true }));
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    });
    await waitForText(container, 'Editor ready');

    const firstLine = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .find((button) => button.getAttribute('aria-label')?.includes('Damaged ▯ line'))!;
    expect(firstLine).toBeDefined();
    await openParagraphEditor(container, firstLine);
    await waitForText(container, 'in this paragraph could not be read from the PDF');
    expect(container.querySelector('[data-unreadable-placeholder="true"]')?.textContent).toBe('▯');
    expect(container.textContent).toContain('Retype whole paragraph');
    expect(container.textContent).toContain('Edit anyway');

    const editor = container.querySelector<HTMLElement>('[aria-label="Editable PDF text"]')!;
    const originalLines = editor.innerText.split(/\r?\n/);
    expect(originalLines).toHaveLength(3);
    expect(originalLines[0]).toContain('▯');
    const pageElement = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const sourceCanvas = pageElement.querySelectorAll<HTMLCanvasElement>('canvas')[0]!;
    const sourcePixels = readCanvasPixels(sourceCanvas);
    const pdfViewport = (await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise)
      .getPage(1);
    const sourcePage = await pdfViewport;
    const viewport = sourcePage.getViewport({ scale: sourceCanvas.width / 612 });
    const intactLineY = Math.round(viewport.convertToViewportPoint(72, 676)[1]);

    const nextLines = ['Changed line', originalLines[1], originalLines[2], 'Added line'];
    await act(async () => {
      editor.innerText = nextLines.join('\n');
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    });
    const download = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Download PDF'))!;
    await act(async () => download.click());
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    expect(savedBlobs).toHaveLength(1);

    const exportedPdf = await pdfjsLib.getDocument({
      data: new Uint8Array(await savedBlobs[0].arrayBuffer()),
    }).promise;
    const exportedPage = await exportedPdf.getPage(1);
    const extractedItems = (await exportedPage.getTextContent()).items
      .filter((item): item is typeof item & { str: string } => 'str' in item)
    const extractedText = extractedItems
      .map((item) => item.str)
      .join('\n');
    expect(extractedText).toContain('Changed line');
    expect(extractedText).toContain('Added line');
    expect(extractedText).not.toContain('▯');

    const outputCanvas = document.createElement('canvas');
    const outputContext = outputCanvas.getContext('2d', { willReadFrequently: true })!;
    outputCanvas.width = sourceCanvas.width;
    outputCanvas.height = sourceCanvas.height;
    await exportedPage.render({
      canvas: outputCanvas,
      canvasContext: outputContext,
      viewport: exportedPage.getViewport({ scale: sourceCanvas.width / 612 }),
    }).promise;
    const outputPixels = readCanvasPixels(outputCanvas);
    expect(changedPixels(sourcePixels, outputPixels, intactLineY - 12, intactLineY + 19, sourceCanvas.width)).toBe(0);
    expect(outputPixels.some((channel, index) => index % 4 !== 3 && channel < 80)).toBe(true);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);

it('removes unsafe characters from typed text before exporting its hidden text layer', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:sanitized-pdf-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const source = await PDFDocument.create();
  const page = source.addPage([612, 792]);
  const font = await source.embedFont(StandardFonts.Helvetica);
  page.drawText('Plain original line', { x: 72, y: 700, size: 18, font });
  const file = new File([await source.save()], 'sanitized-text.pdf', { type: 'application/pdf' });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    Object.defineProperty(fileInput, 'files', { configurable: true, value: transfer.files });
    await act(async () => {
      fileInput.dispatchEvent(new Event('input', { bubbles: true }));
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    });
    await waitForText(container, 'Editor ready');

    const paragraph = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .find((button) => button.getAttribute('aria-label')?.includes('Plain original line'))!;
    await openParagraphEditor(container, paragraph);
    const editor = container.querySelector<HTMLElement>('[aria-label="Editable PDF text"]')!;
    await act(async () => {
      editor.innerText = `Sanitized line\u0000\uFFFD\uE000`;
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    });
    await act(async () => {
      [...container.querySelectorAll<HTMLButtonElement>('button')]
        .find((button) => button.textContent?.includes('Download PDF'))!
        .click();
    });
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    expect(savedBlobs).toHaveLength(1);

    const output = await pdfjsLib.getDocument({
      data: new Uint8Array(await savedBlobs[0].arrayBuffer()),
    }).promise;
    const exportedPage = await output.getPage(1);
    const textItems = (await exportedPage.getTextContent()).items
      .filter((item): item is typeof item & { str: string } => 'str' in item);
    expect(textItems.find((item) => item.str.includes('Sanitized line'))?.str).toBe('Sanitized line');
    expect(textItems.every((item) => !/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\uFFFD\uE000-\uF8FF]/u.test(item.str))).toBe(true);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);

it('retypes a damaged paragraph over the original lines as a whole paragraph', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:retyped-pdf-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const file = new File([await createDamagedTextPdf()], 'retyped-damaged-text.pdf', { type: 'application/pdf' });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    Object.defineProperty(fileInput, 'files', { configurable: true, value: transfer.files });
    await act(async () => {
      fileInput.dispatchEvent(new Event('input', { bubbles: true }));
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    });
    await waitForText(container, 'Editor ready');

    const firstLine = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .find((button) => button.getAttribute('aria-label')?.includes('Damaged ▯ line'))!;
    const intactLineButtons = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .filter((button) => /Second|Third/u.test(button.getAttribute('aria-label') ?? ''));
    expect(intactLineButtons.length).toBeGreaterThan(0);
    const pageCanvasElement = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const pageRect = pageCanvasElement.getBoundingClientRect();
    const intactLineRects = intactLineButtons.map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        x: rect.left - pageRect.left,
        y: rect.top - pageRect.top,
        width: rect.width,
        height: rect.height,
      };
    });
    await openParagraphEditor(container, firstLine);
    const retypeButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Retype whole paragraph')!;
    await act(async () => retypeButton.click());
    const editor = container.querySelector<HTMLElement>('[aria-label="Editable PDF text"]')!;
    expect(editor.innerText).toBe('');
    await act(async () => {
      editor.innerText = 'Retyped';
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    });
    await act(async () => {
      [...container.querySelectorAll<HTMLButtonElement>('button')]
        .find((button) => button.textContent?.trim() === 'Done')!
        .click();
    });
    await act(async () => {
      [...container.querySelectorAll<HTMLButtonElement>('button')]
        .find((button) => button.textContent?.includes('Download PDF'))!
        .click();
    });
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    expect(savedBlobs).toHaveLength(1);

    const output = await pdfjsLib.getDocument({
      data: new Uint8Array(await savedBlobs[0].arrayBuffer()),
    }).promise;
    const exportedPage = await output.getPage(1);
    const extractedText = (await exportedPage.getTextContent()).items
      .filter((item): item is typeof item & { str: string } => 'str' in item)
      .map((item) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');
    expect(extractedText).toContain('Retyped');

    const sourceCanvas = pageCanvasElement.querySelector<HTMLCanvasElement>('canvas')!;
    const viewport = exportedPage.getViewport({ scale: sourceCanvas.width / 612 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    await exportedPage.render({ canvas, canvasContext: context, viewport }).promise;
    const pixels = readCanvasPixels(canvas);
    for (const rect of intactLineRects) {
      const x = Math.max(0, Math.floor(rect.x * canvas.width / pageRect.width));
      const y = Math.max(0, Math.floor(rect.y * canvas.height / pageRect.height));
      const width = Math.min(canvas.width - x, Math.ceil(rect.width * canvas.width / pageRect.width));
      const height = Math.min(canvas.height - y, Math.ceil(rect.height * canvas.height / pageRect.height));
      expect(countDarkPixels(pixels, canvas.width, x, y, width, height)).toBe(0);
    }
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);
