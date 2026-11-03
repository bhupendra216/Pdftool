import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}".`);
}

async function waitForRenderedPage(container: HTMLElement) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const canvas = container.querySelector<HTMLCanvasElement>('[data-pdf-page-canvas] canvas');
    if (canvas?.width && canvas.height) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error('Timed out waiting for the PDF page preview to render.');
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  setValue?.call(select, value);
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

it('keeps IME and normal typing intact and supports phonetic typing only', async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText('Editable sample', { x: 72, y: 640, size: 24, font });
  const file = new File([await pdf.save()], 'devanagari-input.pdf', { type: 'application/pdf' });
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
    container.querySelector<HTMLElement>('[data-pdf-page-canvas]')?.scrollIntoView({ block: 'center' });
    await waitForRenderedPage(container);

    const textLine = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .find((button) => button.getAttribute('aria-label')?.includes('Editable sample'))!;
    await act(async () => textLine.click());
    const editButton = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Edit selected text')!;
    await act(async () => editButton.click());
    await waitForText(container, 'Font family');

    const fontPicker = [...container.querySelectorAll<HTMLSelectElement>('select')]
      .find((select) => [...select.options].some((option) => option.value === 'Noto Sans Devanagari'))!;
    await act(async () => {
      setSelectValue(fontPicker, 'Noto Sans Devanagari');
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    });
    const expandPanel = container.querySelector<HTMLButtonElement>(
      '[data-pdf-phonetic-panel] button[aria-label="Expand Hindi / Nepali typing panel"]',
    );
    if (expandPanel) await act(async () => expandPanel.click());
    const textarea = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    const phoneticToggle = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Type Devanagari (phonetic)'))!;
    expect(phoneticToggle.getAttribute('aria-pressed')).toBe('false');

    await act(async () => {
      textarea.focus();
      textarea.value = 'a';
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'a' }));
    });
    expect(textarea.value).toBe('a');

    await act(async () => {
      textarea.setRangeText('', 0, textarea.value.length, 'start');
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'deleteContent' }));
      textarea.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
      textarea.value = 'नमस्ते';
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', data: 'नमस्ते', isComposing: true }));
      textarea.dispatchEvent(new CompositionEvent('compositionupdate', { bubbles: true, data: 'नमस्ते' }));
      textarea.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'नमस्ते' }));
    });
    expect(textarea.value).toBe('नमस्ते');
    expect(textarea.selectionStart).toBe('नमस्ते'.length);
    expect(textarea.selectionEnd).toBe('नमस्ते'.length);

    const inlineEditor = container.querySelector<HTMLDivElement>('[contenteditable="true"]')!;
    await act(async () => {
      inlineEditor.focus();
      inlineEditor.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
      inlineEditor.innerText = 'नेपाल';
      inlineEditor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', data: 'नेपाल', isComposing: true }));
      inlineEditor.dispatchEvent(new CompositionEvent('compositionupdate', { bubbles: true, data: 'नेपाल' }));
      inlineEditor.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'नेपाल' }));
    });
    expect(textarea.value).toBe('नेपाल');

    await act(async () => {
      textarea.setRangeText('', 0, textarea.value.length, 'start');
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'deleteContent' }));
      phoneticToggle.click();
    });
    expect(phoneticToggle.getAttribute('aria-pressed')).toBe('true');
    for (const character of 'namaste') {
      let beforeInput: InputEvent | undefined;
      await act(async () => {
        beforeInput = new InputEvent('beforeinput', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: character,
        });
        textarea.dispatchEvent(beforeInput);
      });
      expect(beforeInput?.defaultPrevented).toBe(true);
    }
    expect(textarea.value).toBe('नमस्ते');
    expect(container.textContent).toContain('Phonetic cheat sheet');

    await act(async () => {
      textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
    });
    const literalInput = new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: 'a' });
    await act(async () => {
      textarea.dispatchEvent(literalInput);
      if (!literalInput.defaultPrevented) {
        textarea.setRangeText('a', textarea.selectionStart, textarea.selectionEnd, 'end');
        textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'a' }));
      }
    });
    expect(textarea.value).toBe('नमस्तेa');

    expect(container.querySelector('button[aria-controls="edit-pdf-script-keyboard"]')).toBeNull();
    expect(container.querySelector('#edit-pdf-script-keyboard')).toBeNull();
    expect([...container.querySelectorAll('button')].some((button) => button.textContent?.trim() === 'Keyboard')).toBe(false);
    expect(container.textContent).toContain("Type Hindi or Nepali: turn on phonetic typing, or use your device's Hindi or Nepali keyboard.");

    const cheatSheet = container.querySelector('summary');
    expect(cheatSheet?.textContent).toBe('Phonetic cheat sheet');
    await act(async () => cheatSheet?.click());
    expect(cheatSheet?.parentElement?.tagName).toBe('DETAILS');
    expect((cheatSheet?.parentElement as HTMLDetailsElement).open).toBe(true);

    const examples: Array<[string, string]> = [
      ['namaste', 'नमस्ते'],
      ['nepal', 'नेपाल'],
      ['kshatriya', 'क्षत्रिय'],
      ['gyaan', 'ज्ञान'],
      ['aa', 'आ'],
      ['ii', 'ई'],
      ['M', 'ं'],
      ['~', 'ँ'],
    ];
    for (const [input, expected] of examples) {
      await act(async () => {
        textarea.setRangeText('', 0, textarea.value.length, 'start');
        textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'deleteContent' }));
        for (const character of input) {
          textarea.dispatchEvent(new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: character,
          }));
        }
      });
      expect(textarea.value, input).toBe(expected);
    }
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
}, 60_000);
