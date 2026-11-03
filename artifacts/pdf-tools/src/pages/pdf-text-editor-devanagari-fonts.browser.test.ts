import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import fontkit from '@pdf-lib/fontkit';
import { expect, it, vi } from 'vitest';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFArray, PDFDict, PDFDocument, PDFName, StandardFonts } from 'pdf-lib';
import nepaliFixtureUrl from '../../test-fixtures/nepali-sample.pdf?url';
import PdfTextEditor from './PdfTextEditor';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const replacementText = 'नेपाली भाषामा लेखेको नयाँ वाक्य।';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}".`);
}

async function uploadPdf(container: HTMLElement, file: File) {
  const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  Object.defineProperty(fileInput, 'files', { configurable: true, value: transfer.files });
  await act(async () => {
    fileInput.dispatchEvent(new Event('input', { bubbles: true }));
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 150));
  });
  await waitForText(container, 'Editor ready');
}

async function setTextAreaValue(textarea: HTMLTextAreaElement, value: string) {
  await act(async () => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    setValue?.call(textarea, value);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  });
}

function getFontSelect(container: HTMLElement, family: string) {
  return [...container.querySelectorAll<HTMLSelectElement>('select')]
    .find((select) => [...select.options].some((option) => option.value === family));
}

async function setFont(container: HTMLElement, family: string) {
  const select = getFontSelect(container, family);
  expect(select, `Font selector should include ${family}`).toBeDefined();
  await act(async () => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    setValue?.call(select, family);
    select!.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function makeEnglishPdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  page.drawText('An English paragraph for font and layout tests.', { x: 72, y: 680, size: 20, font });
  return new File([await pdf.save()], 'english-times.pdf', { type: 'application/pdf' });
}

async function loadNepaliPdf(name = 'Mangal') {
  const response = await fetch(nepaliFixtureUrl);
  expect(response.ok).toBe(true);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (name === 'Mangal') return new File([bytes], 'nepali-sample.pdf', { type: 'application/pdf' });
  const pdf = await PDFDocument.load(bytes);
  for (const page of pdf.getPages()) {
    const resources = page.node.Resources();
    const fonts = resources?.lookupMaybe(PDFName.of('Font'), PDFDict);
    if (!fonts) continue;
    for (const [, ref] of fonts.entries()) {
      const font = pdf.context.lookup(ref, PDFDict);
      font.set(PDFName.of('BaseFont'), PDFName.of(name));
      const descendants = font.lookupMaybe(PDFName.of('DescendantFonts'), PDFArray);
      if (!descendants?.size()) continue;
      const descendant = pdf.context.lookup(descendants.get(0), PDFDict);
      descendant.set(PDFName.of('BaseFont'), PDFName.of(name));
      descendant.lookupMaybe(PDFName.of('FontDescriptor'), PDFDict)
        ?.set(PDFName.of('FontName'), PDFName.of(name));
    }
  }
  return new File([await pdf.save()], `${name.toLowerCase()}-sample.pdf`, { type: 'application/pdf' });
}

it('omits the panel and left column for English until a Devanagari font is explicitly selected', async () => {
  const file = await makeEnglishPdf();
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    await uploadPdf(container, file);
    expect(container.querySelector('[data-pdf-phonetic-panel]')).toBeNull();
    expect(container.querySelector('aside')).toBeNull();

    const pageCanvas = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const beforeEdit = pageCanvas.getBoundingClientRect();
    const line = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text An English"]')!;
    await act(async () => line.click());
    const edit = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Edit selected text')!;
    await act(async () => edit.click());
    await waitForText(container, 'Font family');

    const beforeFontChange = pageCanvas.getBoundingClientRect();
    expect(beforeFontChange.x).toBe(beforeEdit.x);
    await setFont(container, 'Noto Sans Devanagari');
    expect(container.querySelector('[data-pdf-phonetic-panel]')).not.toBeNull();
    expect(container.querySelector('aside')).not.toBeNull();
    const afterFontChange = pageCanvas.getBoundingClientRect();

    const textArea = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    await setTextAreaValue(textArea, 'English with नमस्ते');
    const afterTyping = pageCanvas.getBoundingClientRect();
    expect(afterTyping.x).toBe(afterFontChange.x);
    expect(afterTyping.width).toBe(afterFontChange.width);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}, 60_000);

it('maps Mangal to Devanagari, shows the original-font notice, and provides a compact Arial switch warning', async () => {
  const file = await loadNepaliPdf();
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    await uploadPdf(container, file);
    expect(container.querySelector('[data-pdf-phonetic-panel]')).not.toBeNull();
    expect(container.querySelector('aside')).not.toBeNull();
    const pageCanvas = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const beforeEdit = pageCanvas.getBoundingClientRect();

    const line = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text नेपाली भाषामा"]')!;
    await act(async () => line.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    await waitForText(container, 'Choose another Devanagari font');
    expect(pageCanvas.getBoundingClientRect().x).toBe(beforeEdit.x);
    expect(container.textContent).toContain("This PDF's font (Mangal) is not available. Using Noto Sans Devanagari, the closest match.");
    expect(container.textContent).not.toContain('Show characters');
    expect(container.querySelector('details[open]')).toBeNull();
    const fontSelect = getFontSelect(container, 'Noto Sans Devanagari');
    expect(fontSelect?.value).toBe('Noto Sans Devanagari');

    await setFont(container, 'Liberation Sans');
    await waitForText(container, 'Arial does not include Devanagari. Use Noto Sans Devanagari.');
    expect(container.textContent).not.toContain('U+');
    const switchButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Switch');
    expect(switchButton).toBeDefined();
    await act(async () => switchButton!.click());
    expect(getFontSelect(container, 'Noto Sans Devanagari')?.value).toBe('Noto Sans Devanagari');
    expect(container.querySelector('[data-pdf-phonetic-panel]')).not.toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}, 60_000);

it('warns when a legacy Nepali font name is present instead of claiming Unicode text is correct', async () => {
  const file = await loadNepaliPdf('Preeti');
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    await uploadPdf(container, file);
    const line = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text नेपाली भाषामा"]')!;
    await act(async () => line.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    await waitForText(container, 'Choose another Devanagari font');
    expect(container.textContent).toContain('This PDF uses a legacy Nepali font, so its text cannot be read as Unicode. Edits may not look right.');
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}, 60_000);

it('edits, exports, and renders the Nepali paragraph with exact hidden Unicode text', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:nepali-export-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const file = await loadNepaliPdf();
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    await uploadPdf(container, file);
    const line = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text नेपाली भाषामा"]')!;
    await act(async () => line.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    await waitForText(container, 'Choose another Devanagari font');
    const pageCanvas = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const beforeTyping = pageCanvas.getBoundingClientRect();
    const textArea = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    await setTextAreaValue(textArea, replacementText);
    expect(textArea.value).toBe(replacementText);
    expect(pageCanvas.getBoundingClientRect().x).toBe(beforeTyping.x);
    expect(pageCanvas.getBoundingClientRect().width).toBe(beforeTyping.width);

    const done = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Done')!;
    await act(async () => done.click());
    const download = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Download PDF'))!;
    await act(async () => download.click());
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    expect(savedBlobs).toHaveLength(1);

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(await savedBlobs[0].arrayBuffer()),
    }).promise;
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const extracted = content.items.map((item) => 'str' in item ? item.str : '').join('');
    expect(extracted).toContain(replacementText);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d');
    expect(context).not.toBeNull();
    await page.render({ canvas, canvasContext: context!, viewport }).promise;
    const { data } = context!.getImageData(80, 120, Math.min(650, canvas.width - 80), Math.min(250, canvas.height - 120));
    let inkPixels = 0;
    for (let offset = 0; offset < data.length; offset += 4) {
      if (data[offset] < 190 && data[offset + 1] < 190 && data[offset + 2] < 190) inkPixels += 1;
    }
    expect(inkPixels).toBeGreaterThan(300);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);
