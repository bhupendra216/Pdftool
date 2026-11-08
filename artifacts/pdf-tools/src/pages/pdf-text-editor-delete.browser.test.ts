import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { expect, it, vi } from 'vitest';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 20));
  }
  throw new Error(`Timed out waiting for "${text}". Current text: ${container.textContent?.slice(-1200)}`);
}

async function makeThreePagePdf() {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const pageTexts = [
    ['Alpha - Page 1', 'Keep - Page 1'],
    ['Beta - Page 2', 'Keep - Page 2'],
    ['Gamma - Page 3', 'Keep - Page 3'],
  ];
  for (const lines of pageTexts) {
    const page = document.addPage([612, 792]);
    page.drawText(lines[0], { x: 72, y: 700, size: 24, font });
    page.drawText(lines[1], { x: 72, y: 640, size: 18, font });
  }
  return new File([await document.save()], 'three-page-text.pdf', { type: 'application/pdf' });
}

async function openEditor(file: File) {
  const container = document.createElement('div');
  container.style.width = '100%';
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => root.render(createElement(PdfTextEditor)));
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  Object.defineProperty(input, 'files', { configurable: true, value: transfer.files });
  await act(async () => {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  });
  await waitForText(container, 'Editor ready');
  return {
    container,
    close: async () => {
      await act(async () => root.unmount());
      container.remove();
    },
  };
}

async function deleteLine(container: HTMLElement, text: string) {
  const line = container.querySelector<HTMLButtonElement>(
    `button[aria-label="Select text ${text}"]`,
  );
  expect(line).not.toBeNull();
  await act(async () => line!.click());
  const deleteButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
    .find((button) => button.textContent?.trim() === 'Delete selected text');
  expect(deleteButton).toBeDefined();
  await act(async () => deleteButton!.click());
}

async function getDownloadedPdf(savedBlobs: Blob[], container: HTMLElement) {
  const downloadButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
    .find((button) => button.textContent?.includes('Download PDF'));
  expect(downloadButton).toBeDefined();
  const start = performance.now();
  await act(async () => downloadButton!.click());
  await waitForText(container, 'Edited PDF downloaded in your browser.');
  expect(performance.now() - start).toBeLessThan(5000);
  expect(savedBlobs).toHaveLength(1);
  const bytes = new Uint8Array(await savedBlobs[0].arrayBuffer());
  expect(new TextDecoder('ascii').decode(bytes.subarray(0, 5))).toBe('%PDF-');
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getPageCount()).toBe(3);
  return bytes;
}

async function pageText(bytes: Uint8Array, pageNumber: number) {
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  return content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
}

async function countDarkPixels(bytes: Uint8Array, pageNumber: number, region: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d')!;
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  const pixels = context.getImageData(region.x, region.y, region.width, region.height).data;
  let dark = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index] < 235 || pixels[index + 1] < 235 || pixels[index + 2] < 235) dark += 1;
  }
  return dark;
}

it('exports visual deletion, combined edits, page-order edits, and undo/redo reliably', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:edit-pdf-delete-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const file = await makeThreePagePdf();
  let editor: Awaited<ReturnType<typeof openEditor>> | undefined;

  try {
    editor = await openEditor(file);
    await deleteLine(editor.container, 'Alpha - Page 1');
    const deleteOnly = await getDownloadedPdf(savedBlobs, editor.container);
    expect(await pageText(deleteOnly, 1)).toBe('');
    expect(await countDarkPixels(deleteOnly, 1, { x: 55, y: 55, width: 340, height: 55 })).toBeLessThan(5);
    expect(await countDarkPixels(deleteOnly, 1, { x: 55, y: 125, width: 340, height: 45 })).toBeGreaterThan(30);
    expect((await pageText(deleteOnly, 2))).toContain('Beta - Page 2');

    await editor.close();
    editor = await openEditor(file);
    const beta = editor.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Select text Beta - Page 2"]',
    )!;
    await act(async () => beta.click());
    const editButton = [...editor.container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Edit selected text');
    expect(editButton).toBeDefined();
    await act(async () => editButton!.click());
    await waitForText(editor.container, 'Font family');
    const textarea = editor.container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    const setValue = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value')?.set;
    await act(async () => {
      setValue?.call(textarea, 'Beta updated - Page 2');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const doneButton = [...editor.container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Done');
    expect(doneButton).toBeDefined();
    await act(async () => doneButton!.click());
    await deleteLine(editor.container, 'Alpha - Page 1');
    savedBlobs.length = 0;
    const combined = await getDownloadedPdf(savedBlobs, editor.container);
    expect(await pageText(combined, 2)).toContain('Beta updated - Page 2');
    expect(await countDarkPixels(combined, 1, { x: 55, y: 55, width: 340, height: 55 })).toBeLessThan(5);

    await editor.close();
    editor = await openEditor(file);
    await deleteLine(editor.container, 'Alpha - Page 1');
    await act(async () => editor!.container.querySelector<HTMLButtonElement>('button[aria-label="Undo"]')!.click());
    const downloadButton = [...editor.container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Download PDF'))!;
    expect(downloadButton.disabled).toBe(true);
    await act(async () => editor!.container.querySelector<HTMLButtonElement>('button[aria-label="Redo"]')!.click());
    expect(downloadButton.disabled).toBe(false);
    savedBlobs.length = 0;
    const redone = await getDownloadedPdf(savedBlobs, editor.container);
    expect(await countDarkPixels(redone, 1, { x: 55, y: 55, width: 340, height: 55 })).toBeLessThan(5);
  } finally {
    if (editor) await editor.close();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);
