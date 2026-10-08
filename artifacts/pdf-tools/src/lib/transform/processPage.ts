import {
  applyGrainToImageData,
  applyGlareToCtx,
  applyInkTransformations,
  applyJpegArtifactsToImageData,
  applyPixelFilters,
  applySharpenToImageData,
  applyVignetteToCtx,
  downscaleUpscaleCanvas,
  removeRuledLinesFromImageData,
} from '@/lib/canvasFilters';
import {
  applyPaperToneToCanvas,
  drawDogEarOnCanvas,
  drawFoldCreaseOnCanvas,
  drawGridPaper,
  drawLinedPaper,
  drawPaperclipMarkOnCanvas,
  drawSmudgeOnCanvas,
  drawStapleHolesOnCanvas,
  drawTapeResidueOnCanvas,
  drawTornEdgesOnCanvas,
  drawWaterStainOnCanvas,
} from '@/lib/dirtyEffects';
import type { PDFPageProxy } from 'pdfjs-dist';

export interface TransformSettings {
  brightness: number;
  contrast: number;
  sepia: number;
  temperature: number;
  vignette: number;
  vignetteDarkness: number;
  sharpen: number;
  paperTone: 'white' | 'cream' | 'yellowed' | 'blueish' | 'gray' | 'pinkish';
  paperGrain: number;
  paperToneAmount: number;
  removeLines: boolean;
  paperStyle: 'plain' | 'lined' | 'grid';
  pageRotation: number;
  foldCrease: number;
  tornEdges: number;
  dogEar: 'none' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  dogEarSize: number;
  gamma: number;
  saturation: number;
  hueShift: number;
  glare: number;
  stapleHoles: boolean;
  paperclipMark: boolean;
  tapeResidue: number;
  smudgeIntensity: number;
  waterStainDepth: number;
  jpegArtifacts: number;
  dpiReduction: number;
  inkColor: 'black' | 'blue' | 'brown' | 'gray' | 'green' | 'red';
  inkFading: number;
  inkBleeding: number;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export async function processPage(
  page: PDFPageProxy,
  pageNumber: number,
  settings: TransformSettings,
  seed: number,
  dpi: 100 | 150 | 200,
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale: dpi / 72 });
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = Math.max(1, Math.floor(viewport.width));
  sourceCanvas.height = Math.max(1, Math.floor(viewport.height));
  const sourceContext = sourceCanvas.getContext('2d');
  if (!sourceContext) throw new Error('canvas-context');
  await page.render({ canvas: sourceCanvas, canvasContext: sourceContext, viewport }).promise;

  const random = mulberry32((seed + pageNumber) >>> 0);
  const imageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  if (settings.removeLines || settings.paperStyle === 'plain') {
    removeRuledLinesFromImageData(imageData, 0.7);
  }
  applyPixelFilters(imageData, {
    brightness: settings.brightness,
    contrast: settings.contrast,
    sepia: settings.sepia,
    gamma: settings.gamma,
    saturation: settings.saturation,
    hue: settings.hueShift,
    temperature: settings.temperature,
  });
  applySharpenToImageData(imageData, settings.sharpen);
  applyGrainToImageData(imageData, settings.paperGrain, random);
  applyJpegArtifactsToImageData(imageData, settings.jpegArtifacts, random);
  if (settings.inkColor !== 'black' || settings.inkFading > 0 || settings.inkBleeding > 0) {
    applyInkTransformations(imageData, {
      color: settings.inkColor,
      fading: settings.inkFading,
      bleeding: settings.inkBleeding,
    });
  }
  sourceContext.putImageData(imageData, 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas-context');
  if (settings.pageRotation) {
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((settings.pageRotation * Math.PI) / 180);
    context.translate(-canvas.width / 2, -canvas.height / 2);
  }
  context.drawImage(sourceCanvas, 0, 0);
  context.setTransform(1, 0, 0, 1, 0, 0);

  applyPaperToneToCanvas(context, canvas.width, canvas.height, settings.paperTone, settings.paperToneAmount);
  drawFoldCreaseOnCanvas(context, canvas.width, canvas.height, settings.foldCrease, false, random);
  drawDogEarOnCanvas(context, canvas.width, canvas.height, settings.dogEar, settings.dogEarSize);
  drawStapleHolesOnCanvas(context, canvas.width, canvas.height, settings.stapleHoles);
  drawPaperclipMarkOnCanvas(context, canvas.width, canvas.height, settings.paperclipMark);
  drawTapeResidueOnCanvas(context, canvas.width, canvas.height, settings.tapeResidue, random);
  drawSmudgeOnCanvas(context, canvas.width, canvas.height, settings.smudgeIntensity, random);
  drawWaterStainOnCanvas(context, canvas.width, canvas.height, settings.waterStainDepth, random);
  if (settings.paperStyle === 'lined') drawLinedPaper(context, canvas.width, canvas.height, random);
  if (settings.paperStyle === 'grid') drawGridPaper(context, canvas.width, canvas.height);
  applyGlareToCtx(context, canvas.width, canvas.height, settings.glare);
  applyVignetteToCtx(context, canvas.width, canvas.height, settings.vignette, settings.vignetteDarkness);
  drawTornEdgesOnCanvas(context, canvas.width, canvas.height, settings.tornEdges, random);
  downscaleUpscaleCanvas(canvas, settings.dpiReduction);
  sourceCanvas.width = 0;
  sourceCanvas.height = 0;
  return canvas;
}
