import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}".`);
}

function renderPagePixels(page: HTMLElement) {
  const [base, overlay] = [...page.querySelectorAll<HTMLCanvasElement>('canvas')];
  if (!base || !overlay) throw new Error('The rendered page canvases are unavailable.');
  const composite = document.createElement('canvas');
  composite.width = base.width;
  composite.height = base.height;
  const context = composite.getContext('2d');
  if (!context) throw new Error('Could not compare the rendered page.');
  context.drawImage(base, 0, 0);
  context.drawImage(overlay, 0, 0);
  return context.getImageData(0, 0, composite.width, composite.height).data;
}

function changedPixels(left: Uint8ClampedArray, right: Uint8ClampedArray) {
  if (left.length !== right.length) return Number.POSITIVE_INFINITY;
  let changed = 0;
  for (let index = 0; index < left.length; index += 4) {
    if ([0, 1, 2].some((channel) => Math.abs(left[index + channel] - right[index + channel]) > 2)) changed += 1;
  }
  return changed;
}

async function captureStablePagePixels(page: HTMLElement) {
  let previous: Uint8ClampedArray | null = null;
  let stableFrames = 0;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const [base, overlay] = [...page.querySelectorAll<HTMLCanvasElement>('canvas')];
    if (!base?.width || !base.height || !overlay?.width || !overlay.height) {
      await new Promise((resolve) => window.setTimeout(resolve, 50));
      continue;
    }
    const current = renderPagePixels(page);
    if (previous && changedPixels(previous, current) === 0) stableFrames += 1;
    else stableFrames = 0;
    if (stableFrames >= 2) return current;
    previous = current;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error('The rendered page did not settle.');
}

it('selects, edits, and no-op commits a full paragraph without changing rendered pixels', async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText('An indented first line', { x: 90, y: 700, size: 18, font });
  page.drawText('Paragraph continues', { x: 72, y: 678, size: 18, font });
  page.drawText('and ends on this line.', { x: 72, y: 656, size: 18, font });
  const file = new File([await pdf.save()], 'paragraph-noop.pdf', { type: 'application/pdf' });
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
      .find((button) => button.getAttribute('aria-label')?.includes('An indented first line'))!;
    const lineButtons = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .filter((button) => /An indented first line|Paragraph continues|and ends on this line/u.test(button.getAttribute('aria-label') ?? ''));
    expect(lineButtons).toHaveLength(3);
    await act(async () => firstLine.click());
    expect(lineButtons.every((button) => button.className.includes('border-blue-500'))).toBe(true);

    const pageElement = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    pageElement.scrollIntoView({ block: 'center' });
    const before = await captureStablePagePixels(pageElement);
    await act(async () => {
      firstLine.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    });
    await waitForText(container, 'Font family');
    const textArea = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    expect(textArea.value).toBe('An indented first line Paragraph continues and ends on this line.');
    expect(container.querySelector<HTMLSelectElement>('select')?.value).toBe('Liberation Sans');

    const done = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Done')!;
    await act(async () => {
      done.click();
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    });
    expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')).toBeNull();
    expect(lineButtons.some((button) => button.className.includes('border-blue-500'))).toBe(false);
    expect(container.textContent).toContain('No changes yet');
    expect(changedPixels(before, await captureStablePagePixels(pageElement))).toBeLessThanOrEqual(5);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
