import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument } from 'pdf-lib';
import { expect, it, vi } from 'vitest';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}". Current text: ${container.textContent?.slice(0, 1000)}`);
}

it('shows one recoverable export failure and retains the unsupported edit', async () => {
  const savedBlobs: Blob[] = [];
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:edit-pdf-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const response = await fetch('/fonts/edit/dejavu-sans-regular.ttf');
  expect(response.ok).toBe(true);
  const font = await pdf.embedFont(new Uint8Array(await response.arrayBuffer()));
  const text = 'שלום עולם · გამარჯობა · Բարեւ աշխարհ';
  pdf.addPage([612, 792]).drawText(text, {
    x: 72,
    y: 640,
    size: 24,
    font,
  });
  const file = new File([await pdf.save()], 'unsupported-script-sample.pdf', { type: 'application/pdf' });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(createElement(PdfTextEditor)));
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(fileInput).not.toBeNull();
    const transfer = new DataTransfer();
    transfer.items.add(file);
    Object.defineProperty(fileInput, 'files', { configurable: true, value: transfer.files });
    await act(async () => {
      fileInput!.dispatchEvent(new Event('input', { bubbles: true }));
      fileInput!.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    });
    await waitForText(container, 'Editor ready');

    const paragraph = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .find((button) => button.getAttribute('aria-label')?.includes('שלום עולם'));
    expect(paragraph).toBeDefined();
    await act(async () => paragraph!.click());
    await waitForText(container, 'Edit selected text');
    const editButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Edit selected text');
    expect(editButton).toBeDefined();
    await act(async () => editButton!.click());
    await waitForText(container, 'Font family');

    const fontPicker = [...container.querySelectorAll<HTMLSelectElement>('select')]
      .find((select) => [...select.options].some((option) => option.value === 'Liberation Sans'));
    expect(fontPicker).toBeDefined();
    const groups = [...fontPicker!.querySelectorAll('optgroup')].map((group) => group.label);
    expect(groups).toEqual([
      'Office-compatible',
      'Devanagari (Hindi, Nepali, Marathi)',
      'Broad coverage',
      'Sans-serif',
      'Serif',
      'Display',
    ]);
    expect(fontPicker!.value).toBe('Liberation Sans');

    const textInput = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]');
    expect(textInput).not.toBeNull();
    await act(async () => {
      const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
      setValue?.call(textInput, `${text}!`);
      textInput!.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 300));
    });
    await waitForText(container, 'scripts are not supported yet');
    expect(container.textContent).toContain('Fallback: Arial (script not supported yet)');

    const downloadButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Download PDF'));
    expect(downloadButton).toBeDefined();
    await act(async () => downloadButton!.click());
    await waitForText(container, 'Could not export this text edit');
    const failureDialog = container.querySelector<HTMLElement>('[role="alertdialog"]');
    expect(failureDialog).not.toBeNull();
    expect(container.querySelectorAll('[role="alertdialog"]')).toHaveLength(1);
    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
    expect(failureDialog?.textContent).toContain(`${text}!`);
    expect(failureDialog?.textContent).toContain('Cannot export text: Hebrew script is not supported yet');
    expect(failureDialog?.textContent).not.toContain('Could not draw glyph');
    const failureActions = [...failureDialog!.querySelectorAll<HTMLButtonElement>('button')]
      .map((button) => button.textContent?.trim());
    expect(failureActions).toEqual([
      'Remove unreadable characters and continue',
      'Download without this edit',
      'Cancel',
    ]);
    const cancelButton = [...failureDialog!.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Cancel');
    const downloadWithoutEdit = [...failureDialog!.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Download without this edit');
    expect(cancelButton).toBeDefined();
    expect(downloadWithoutEdit).toBeDefined();
    await act(async () => downloadWithoutEdit!.click());
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    expect(savedBlobs).toHaveLength(1);
    expect(container.querySelector('[role="alertdialog"]')).toBeNull();

    await act(async () => paragraph!.click());
    await waitForText(container, 'Edit selected text');
    const reopenEditButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Edit selected text');
    expect(reopenEditButton).toBeDefined();
    await act(async () => reopenEditButton!.click());
    const retainedText = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]');
    expect(retainedText?.value).toBe(`${text}!`);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
  }
}, 60_000);
