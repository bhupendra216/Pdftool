import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import fixtureUrl from '../../test-fixtures/dogs-devanagari-clean.pdf?url';
import PdfTextEditor from './PdfTextEditor';

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}".`);
}

it('keeps the phonetic panel and page workspace in sync with a reference-only keyboard dock', async () => {
  window.localStorage.removeItem('edit-pdf-devanagari-panel-collapsed');
  window.sessionStorage.removeItem('edit-pdf-phonetic-keyboard-open');
  const response = await fetch(fixtureUrl);
  const file = new File([await response.arrayBuffer()], 'dogs-devanagari-clean.pdf', { type: 'application/pdf' });
  const container = document.createElement('div');
  container.style.width = '100%';
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
    }, 60_000);
    await waitForText(container, 'Editor ready');

    const firstLine = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text कुƺे"]')!;
    await act(async () => firstLine.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    await waitForText(container, 'Font family');
    await waitForText(container, 'Hindi / Nepali typing');
    expect(container.querySelector<HTMLButtonElement>('button[aria-label="Align left"]')?.getAttribute('aria-pressed')).toBe('true');
    const editBox = container.querySelector<HTMLElement>('[data-line-pitch-pt]');
    expect(editBox).not.toBeNull();
    expect(Math.abs(Number(editBox?.dataset.linePitchPt) - 51)).toBeLessThanOrEqual(0.3);

    const visiblePanel = [...container.querySelectorAll<HTMLElement>('[data-pdf-phonetic-panel]')]
      .find((panel) => panel.getBoundingClientRect().width > 0)!;
    expect(visiblePanel.getBoundingClientRect().width).toBeGreaterThanOrEqual(200);
    for (const control of visiblePanel.querySelectorAll<HTMLElement>('button, summary')) {
      expect(control.scrollWidth).toBeLessThanOrEqual(control.clientWidth);
    }
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);

    await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Align center"]')?.click());
    await act(async () => [...container.querySelectorAll<HTMLButtonElement>('button')].find((button) => button.textContent?.trim() === 'Done')?.click());
    await act(async () => firstLine.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    expect(container.querySelector<HTMLButtonElement>('button[aria-label="Align center"]')?.getAttribute('aria-pressed')).toBe('true');

    const showKeyboard = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="edit-pdf-phonetic-keyboard-dock"]',
    )!;
    const editText = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')!;
    const pageCanvas = container.querySelector<HTMLElement>('[data-pdf-page-canvas]')!;
    const pageLeftBefore = pageCanvas.getBoundingClientRect().left;
    editText.focus();
    await act(async () => {
      showKeyboard.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      showKeyboard.click();
    });
    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 600)));
    const dock = container.querySelector<HTMLElement>('[data-phonetic-keyboard-dock]')!;
    expect(showKeyboard.getAttribute('aria-expanded')).toBe('true');
    expect(dock.hasAttribute('hidden')).toBe(false);
    expect(document.activeElement).toBe(editText);
    expect(pageCanvas.getBoundingClientRect().left).toBe(pageLeftBefore);
    const editRect = editText.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    expect(
      editRect.bottom <= dockRect.top || editRect.top >= dockRect.bottom,
      `edit box ${JSON.stringify(editRect.toJSON())} overlaps dock ${JSON.stringify(dockRect.toJSON())}`,
    ).toBe(true);
    expect(dock.querySelectorAll('.phonetic-key').length).toBeGreaterThan(0);
    expect(dock.querySelectorAll('button[aria-label*="types"]')).toHaveLength(0);

    const pagesList = visiblePanel.closest('aside')?.querySelector<HTMLElement>(':scope > div:last-child');
    const pagesHeightBeforeCollapse = pagesList?.clientHeight ?? 0;
    const collapse = visiblePanel.querySelector<HTMLButtonElement>('button[aria-label="Collapse Hindi / Nepali typing panel"]')!;
    await act(async () => collapse.click());
    expect(collapse.getAttribute('aria-expanded')).toBe('false');
    expect([...container.querySelectorAll('aside h3')].at(-1)?.textContent).toBe('Pages');
    if (window.innerWidth >= 1200) expect(pagesList!.clientHeight).toBeGreaterThan(pagesHeightBeforeCollapse);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
