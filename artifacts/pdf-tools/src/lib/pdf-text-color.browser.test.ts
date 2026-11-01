import { expect, it } from "vitest";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { darkestCommonPixelColor, getPdfTextFillColors } from "./pdf-text-color";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const sampleText = "The quick brown fox 0123456789";
const fontFiles = [
  { family: "Roboto", file: "roboto-regular.ttf", color: [0, 0, 0] as const },
  { family: "Source Sans 3", file: "source-sans-3-regular.ttf", color: [0.04, 0.08, 0.35] as const },
  { family: "Merriweather", file: "merriweather-regular.ttf", color: [0.68, 0.04, 0.04] as const },
  { family: "Carlito", file: "carlito-regular.ttf", color: [0.38, 0.38, 0.38] as const },
];

function colorChannels(color: string) {
  return color.slice(1).match(/.{2}/g)!.map((channel) => Number.parseInt(channel, 16) / 255);
}

function assertColorClose(actual: string, expected: readonly number[]) {
  colorChannels(actual).forEach((channel, index) => {
    expect(Math.abs(channel - expected[index])).toBeLessThanOrEqual(0.02);
  });
}

async function loadTextContent(page: Awaited<ReturnType<Awaited<ReturnType<typeof openPdf>>["getPage"]>>) {
  const [content, operatorList] = await Promise.all([page.getTextContent(), page.getOperatorList()]);
  const items = content.items.filter((item): item is typeof item & { str: string } => "str" in item && item.str.length > 0);
  const colors = getPdfTextFillColors(items.map((item) => item.str), operatorList, pdfjsLib.OPS);
  return { items, colors };
}

async function openPdf(bytes: Uint8Array) {
  return pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
}

function averageInkDarkness(
  pixels: Uint8ClampedArray,
  canvasWidth: number,
  rect: { x: number; y: number; width: number; height: number },
) {
  let total = 0;
  let count = 0;
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const offset = (y * canvasWidth + x) * 4;
      const luminance = 0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2];
      total += 255 - luminance;
      count += 1;
    }
  }
  return total / Math.max(1, count);
}

it("keeps original RGB fill colors through five repeated text edits", async () => {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const sourceRows: Array<{ family: string; color: readonly [number, number, number]; fontBytes: Uint8Array }> = [];
  const page = document.addPage([680, 792]);

  for (let index = 0; index < fontFiles.length; index += 1) {
    const fontEntry = fontFiles[index];
    const response = await fetch(`/fonts/edit/${fontEntry.file}`);
    expect(response.ok).toBe(true);
    const fontBytes = new Uint8Array(await response.arrayBuffer());
    const font = await document.embedFont(fontBytes, { subset: false });
    const y = 710 - index * 36;
    page.drawText(sampleText, { x: 40, y, size: 12, font, color: rgb(...fontEntry.color) });
    sourceRows.push({ family: fontEntry.family, color: fontEntry.color, fontBytes });
  }

  let currentBytes = await document.save();
  const sourcePdf = await openPdf(currentBytes);
  const sourcePage = await sourcePdf.getPage(1);
  const sourceText = await loadTextContent(sourcePage);
  expect(sourceText.colors).toHaveLength(fontFiles.length);
  sourceText.colors.forEach((color, index) => {
    expect(color).not.toBeNull();
    assertColorClose(color!, sourceRows[index].color);
  });

  for (let iteration = 0; iteration < 5; iteration += 1) {
    const output = await PDFDocument.load(currentBytes);
    output.registerFontkit(fontkit);
    const outputPage = output.getPage(0);
    for (let index = 0; index < sourceRows.length; index += 1) {
      const row = sourceRows[index];
      const font = await output.embedFont(row.fontBytes, { subset: false });
      const sourceColor = sourceText.colors[index]!;
      outputPage.drawText(sampleText, {
        x: 40,
        y: 710 - index * 36,
        size: 12,
        font,
        color: rgb(...colorChannels(sourceColor) as [number, number, number]),
      });
    }
    currentBytes = await output.save();
    const exportedPdf = await openPdf(currentBytes);
    const exportedPage = await exportedPdf.getPage(1);
    const exportedText = await loadTextContent(exportedPage);
    const expectedLineCount = sourceRows.length * (iteration + 2);
    expect(exportedText.colors).toHaveLength(expectedLineCount);
    for (let index = 0; index < expectedLineCount; index += 1) {
      const row = sourceRows[index % sourceRows.length];
      expect(exportedText.items[index].str).toBe(sampleText);
      assertColorClose(exportedText.colors[index]!, row.color);
    }

    if (iteration === 0) {
      const viewport = exportedPage.getViewport({ scale: 2 });
      const canvas = typeof document !== 'undefined' && typeof document.createElement === 'function'
        ? document.createElement('canvas')
        : new OffscreenCanvas(1, 1);
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      expect(context).not.toBeNull();
      await exportedPage.render({ canvas, canvasContext: context!, viewport }).promise;
      const pixels = context!.getImageData(0, 0, canvas.width, canvas.height).data;
      const originalItem = exportedText.items[0];
      const editedItem = exportedText.items[sourceRows.length];
      const rectFor = (item: typeof originalItem) => ({
        x: Math.max(0, Math.floor(item.transform[4] * 2)),
        y: Math.max(0, Math.floor((792 - item.transform[5] - item.height) * 2)),
        width: Math.min(canvas.width, Math.ceil(item.width * 2)),
        height: Math.max(1, Math.ceil(item.height * 2)),
      });
      const originalInk = averageInkDarkness(pixels, canvas.width, rectFor(originalItem));
      const editedInk = averageInkDarkness(pixels, canvas.width, rectFor(editedItem));
      expect(Math.abs(editedInk - originalInk) / originalInk).toBeLessThanOrEqual(0.05);
    }
  }
});

it("uses the darkest common foreground pixel without averaging antialiased edges", () => {
  expect(darkestCommonPixelColor([
    [0, 0, 0], [0, 0, 0], [0, 0, 0],
    [120, 120, 120], [120, 120, 120], [120, 120, 120],
    [255, 255, 255], [255, 255, 255], [255, 255, 255],
  ], [255, 255, 255])).toBe("#000000");
});
