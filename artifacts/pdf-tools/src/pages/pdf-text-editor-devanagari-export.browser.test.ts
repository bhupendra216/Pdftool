import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import * as pdfjsLib from 'pdfjs-dist';
import fixtureUrl from '../../test-fixtures/dogs-devanagari-clean.pdf?url';
import PdfTextEditor from './PdfTextEditor';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const editedText = 'त्येस्का लागि के के गर्नुपर्छ मलाई त थाहा नै भएन .';

async function containsPdfData(payload: unknown): Promise<boolean> {
  if (typeof payload === 'string') return /%PDF-|JVBERi0/.test(payload);
  if (payload instanceof URL) return containsPdfData(payload.href);
  if (payload instanceof Request) {
    if (await containsPdfData(payload.url)) return true;
    const request = payload.clone();
    return request.body ? containsPdfData(await request.arrayBuffer()) : false;
  }
  if (payload instanceof Blob) return containsPdfData(await payload.arrayBuffer());
  if (payload instanceof ArrayBuffer) return containsPdfData(new Uint8Array(payload));
  if (ArrayBuffer.isView(payload)) {
    const bytes = new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength);
    const header = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 1024)));
    return header.includes('%PDF-');
  }
  if (payload instanceof FormData) {
    for (const [, value] of payload.entries()) {
      if (await containsPdfData(value)) return true;
    }
    return false;
  }
  if (payload instanceof URLSearchParams) return containsPdfData(payload.toString());
  return false;
}

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for "${text}".`);
}

function getDarkPixels(canvas: HTMLCanvasElement, bounds: { left: number; top: number; right: number; bottom: number }) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not inspect the rendered PDF page.');
  const left = Math.max(0, Math.floor(bounds.left));
  const top = Math.max(0, Math.floor(bounds.top));
  const right = Math.min(canvas.width, Math.ceil(bounds.right));
  const bottom = Math.min(canvas.height, Math.ceil(bounds.bottom));
  const { data } = context.getImageData(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
  let darkPixels = 0;
  for (let offset = 0; offset < data.length; offset += 4) {
    if (data[offset] < 180 && data[offset + 1] < 180 && data[offset + 2] < 180) darkPixels += 1;
  }
  return darkPixels;
}

it('keeps PDF bytes local while opening, editing, and exporting Devanagari text', async () => {
  const savedBlobs: Blob[] = [];
  const pdfTransfers: string[] = [];
  const pendingPayloadChecks: Promise<void>[] = [];
  let phase = 'open';
  const inspectPayload = (transport: string, payload: unknown) => {
    const requestPhase = phase;
    const check = containsPdfData(payload).then((containsPdf) => {
      if (containsPdf) pdfTransfers.push(`${requestPhase}:${transport}`);
    });
    pendingPayloadChecks.push(check);
    return check;
  };
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((object) => {
    if (object instanceof Blob) savedBlobs.push(object);
    return 'blob:edit-pdf-test';
  });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const response = await fetch(fixtureUrl);
  expect(response.ok).toBe(true);
  const file = new File([await response.arrayBuffer()], 'dogs-devanagari-clean.pdf', { type: 'application/pdf' });
  const nativeFetch = window.fetch.bind(window);
  const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(async (input, init) => {
    await inspectPayload('fetch', input);
    await inspectPayload('fetch', init?.body);
    return nativeFetch(input, init);
  });
  const xhrUrls = new WeakMap<XMLHttpRequest, string>();
  const nativeXhrOpen = XMLHttpRequest.prototype.open;
  const xhrOpenSpy = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(function (
    this: XMLHttpRequest,
    ...args: Parameters<XMLHttpRequest['open']>
  ) {
    xhrUrls.set(this, String(args[1]));
    return Reflect.apply(nativeXhrOpen, this, args);
  });
  const nativeXhrSend = XMLHttpRequest.prototype.send;
  const xhrSendSpy = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(function (
    this: XMLHttpRequest,
    body: Parameters<XMLHttpRequest['send']>[0],
  ) {
    void inspectPayload('XMLHttpRequest', xhrUrls.get(this));
    void inspectPayload('XMLHttpRequest', body);
    return nativeXhrSend.call(this, body);
  });
  const nativeSendBeacon = navigator.sendBeacon.bind(navigator);
  const sendBeaconSpy = vi.spyOn(navigator, 'sendBeacon').mockImplementation((url, data) => {
    void inspectPayload('sendBeacon', url);
    void inspectPayload('sendBeacon', data);
    return nativeSendBeacon(url, data);
  });
  const nativeWebSocketSend = WebSocket.prototype.send;
  const webSocketSendSpy = vi.spyOn(WebSocket.prototype, 'send').mockImplementation(function (
    this: WebSocket,
    data: Parameters<WebSocket['send']>[0],
  ) {
    void inspectPayload('WebSocket', data);
    return nativeWebSocketSend.call(this, data);
  });
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

    const firstParagraph = container.querySelector<HTMLButtonElement>('button[aria-label^="Select text"]');
    expect(firstParagraph).not.toBeNull();
    phase = 'edit';
    await act(async () => firstParagraph!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    await waitForText(container, 'Font family');
    const textArea = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]');
    expect(textArea).not.toBeNull();
    await act(async () => {
      const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
      setValue?.call(textArea, editedText);
      textArea!.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    });
    expect(textArea!.value).toBe(editedText);

    const done = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.trim() === 'Done');
    expect(done).toBeDefined();
    await act(async () => done!.click());
    expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Text"]')).toBeNull();
    expect([...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Select text"]')]
      .some((button) => button.className.includes('border-blue-500'))).toBe(false);

    const download = [...container.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Download PDF'));
    expect(download).toBeDefined();
    phase = 'export';
    await act(async () => download!.click());
    await waitForText(container, 'Edited PDF downloaded in your browser.');
    await Promise.all(pendingPayloadChecks);
    expect(pdfTransfers).toEqual([]);
    expect(savedBlobs).toHaveLength(1);

    const savedBlob = savedBlobs[0];
    const bytes = new Uint8Array(await savedBlob.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const extractedText = content.items.map((item) => 'str' in item ? item.str : '').join('');
    expect(extractedText, JSON.stringify(content.items.map((item) => 'str' in item ? item.str : ''))).toContain(editedText);
    const editedItem = content.items.find((item) => 'str' in item && item.str.includes(editedText));
    expect(editedItem).toBeDefined();

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d');
    expect(context).not.toBeNull();
    await page.render({ canvas, canvasContext: context!, viewport }).promise;

    const textItem = editedItem!;
    const baseline = viewport.convertToViewportPoint(textItem.transform[4], textItem.transform[5]);
    const lineInk = getDarkPixels(canvas, {
      left: baseline[0] - 4,
      top: baseline[1] - 48,
      right: baseline[0] + Math.max(textItem.width, 36) * viewport.scale + 8,
      bottom: baseline[1] + 4,
    });
    expect(lineInk).toBeGreaterThan(20);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    createObjectURL.mockRestore();
    anchorClick.mockRestore();
    fetchSpy.mockRestore();
    xhrOpenSpy.mockRestore();
    xhrSendSpy.mockRestore();
    sendBeaconSpy.mockRestore();
    webSocketSendSpy.mockRestore();
  }
}, 60_000);
