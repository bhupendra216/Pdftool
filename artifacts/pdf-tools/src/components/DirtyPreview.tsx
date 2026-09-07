/// <reference types="react" />
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { PDFDocument } from 'pdf-lib';
import { applyDirtyEffect, applyPaperToneToCanvas, drawFoldCreaseOnCanvas, drawTornEdgesOnCanvas, drawDogEarOnCanvas, drawStapleHolesOnCanvas, drawPaperclipMarkOnCanvas, drawTapeResidueOnCanvas } from '@/lib/dirtyEffects';
import {
  applyPixelFilters,
  applyVignetteToCtx,
  applyGlareToCtx,
  applyGrainToImageData,
  applyJpegArtifactsToImageData,
  applySharpenToImageData,
  downscaleUpscaleCanvas,
  removeRuledLinesFromImageData,
  applyInkTransformations,
} from '@/lib/canvasFilters';
import { drawSmudgeOnCanvas, drawLinedPaper, drawGridPaper, drawDogEarOnCanvasImproved } from '@/lib/dirtyEffects';

export interface DirtyPreviewProps {
  file: File | null;
  pageNumber?: number;
  intensity: number; // 0..1
  // basic filters
  brightness: number; // 0..100
  contrast: number; // 0..100
  sepia: number; // 0..100
  temperature: number; // -100..100 (negative = cool, positive = warm)
  vignette: number; // 0..100 (size)
  vignetteDarkness?: number; // 0..100
  sharpen: number; // 0..100
  // advanced
  paperTone?: 'white' | 'cream' | 'yellowed' | 'blueish' | 'gray' | 'pinkish';
  paperGrain?: number; // 0..100
  paperToneAmount?: number; // 0..100
  removeLines?: boolean;
  paperStyle?: 'auto'|'plain'|'lined'|'grid';
  smallMarks?: boolean;
  pageRotation?: number; // -5..5 degrees
  perspectiveSkew?: number; // 0..100
  foldCrease?: number; // 0..100
  tornEdges?: number; // 0..100
  dogEar?: 'none'|'top-left'|'top-right'|'bottom-left'|'bottom-right';
  dogEarSize?: number; // 0..100
  gamma?: number; // 0.5..2.5
  saturation?: number; // -100..100
  hue?: number; // -180..180
  glare?: number; // 0..100
  stapleHoles?: boolean;
  paperclipMark?: boolean;
  tapeResidue?: number; // 0..100
  smudgeIntensity?: number; // 0..100
  waterStainDepth?: number; // 0..100
  jpegArtifacts?: number; // 0..100
  dpiReduction?: number; // 0..100
  // ink transformations
  inkColor?: 'black' | 'blue' | 'brown' | 'gray' | 'green' | 'red';
  inkFading?: number; // 0..100
  inkBleeding?: number; // 0..100
  scale?: number;
  className?: string;
  debounceMs?: number;
}

export const DirtyPreview: React.FC<DirtyPreviewProps> = ({
  file,
  pageNumber = 1,
  intensity,
  brightness,
  contrast,
  sepia,
  temperature,
  vignette,
  vignetteDarkness,
  sharpen,
  gamma,
  saturation,
  hue,
  paperTone,
  paperGrain,
  pageRotation,
  perspectiveSkew,
  foldCrease,
  tornEdges,
  dogEar,
  dogEarSize,
  smallMarks,
  smudgeIntensity,
  waterStainDepth,
  paperToneAmount,
  removeLines,
  paperStyle,
  jpegArtifacts,
  paperclipMark,
  tapeResidue,
  stapleHoles,
  glare,
  dpiReduction,
  inkColor = 'black',
  inkFading = 0,
  inkBleeding = 0,
  scale = 1.2,
  className,
  debounceMs = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const modifiedPdfCache = useRef<{ key: string; bytes: Uint8Array | null }>({ key: '', bytes: null });

  useEffect(() => {
    const currentFile = file;
    if (!currentFile) return;
    let cancelled = false;
    const id = setTimeout(() => {
      renderDirty().catch((e) => {
        if (!cancelled) {
          console.error('DirtyPreview render error:', e);
          setError(e?.message ?? String(e));
          setLoading(false);
        }
      });
    }, debounceMs);

    const cachedKeyRef = modifiedPdfCache.current;

    async function renderDirty() {
      const f = currentFile;
      if (!f) return;
      setLoading(true);
      setError(null);
      try {
        const arrayBuffer = await f.arrayBuffer();
        // Avoid re-applying vector overlays on every control change.
          const key = `${f.name}:${f.size}:${f.lastModified}:${intensity}:${String(smallMarks ?? false)}:${String(paperStyle ?? '')}`;
        let modifiedBytes: Uint8Array;
        if (cachedKeyRef.key === key && cachedKeyRef.bytes) {
          modifiedBytes = cachedKeyRef.bytes;
        } else {
          // Load original into pdf-lib, apply effects (in-memory) only when file or intensity changed
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pages = pdfDoc.getPages();
          for (const p of pages) {
            applyDirtyEffect(p, intensity);
          }
          const saved = await pdfDoc.save();
          modifiedBytes = saved as Uint8Array;
          cachedKeyRef.key = key;
          cachedKeyRef.bytes = modifiedBytes;
        }

        // Use pdfjs to render the modified PDF first page to an offscreen canvas
        // pdfjs may transfer/detach ArrayBuffers internally — pass a fresh copy to avoid
        // "ArrayBuffer at index 0 is already detached" errors when reusing cached bytes.
        const pdf = await pdfjsLib.getDocument({ data: modifiedBytes.slice() }).promise;
        const p = Math.min(Math.max(1, pageNumber), pdf.numPages);
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale });

        // offscreen canvas
        const temp = document.createElement('canvas');
        temp.width = Math.floor(viewport.width);
        temp.height = Math.floor(viewport.height);
        const tctx = temp.getContext('2d');
        if (!tctx) throw new Error('Failed to get temp canvas context');

        await page.render({ canvasContext: tctx, viewport } as any).promise;

        // get image data for pixel filters
        const imageData = tctx.getImageData(0, 0, temp.width, temp.height);

        // Optionally remove ruled/lined paper before other filters (stronger algorithm)
        if (removeLines || paperStyle === 'plain') {
          try {
            removeRuledLinesFromImageData(imageData, 0.7);
          } catch (e) {
            console.warn('removeRuledLines failed', e);
          }
        }

        // Apply pixel-level filters using canvasFilters
        applyPixelFilters(imageData, {
          brightness,
          contrast,
          sepia,
          gamma: gamma ?? 1,
          saturation: saturation ?? 0,
          hue: hue ?? 0,
          temperature,
        });

        // sharpen (unsharp mask)
        applySharpenToImageData(imageData, sharpen ?? 0);

        // Grain & jpeg artifacts
        applyGrainToImageData(imageData, paperGrain ?? 0);
        applyJpegArtifactsToImageData(imageData, jpegArtifacts ?? 0);

        // Ink transformations (preview)
        if (inkColor !== 'black' || (inkFading ?? 0) > 0 || (inkBleeding ?? 0) > 0) {
          try {
            applyInkTransformations(imageData, { color: inkColor, fading: inkFading ?? 0, bleeding: inkBleeding ?? 0 });
          } catch (e) {
            console.warn('applyInkTransformations failed', e);
          }
        }

        tctx.putImageData(imageData, 0, 0);

        // draw to final canvas
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');
        canvas.width = temp.width;
        canvas.height = temp.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        // physical transforms: rotation and perspective/skew
        ctx.save();
        // rotation
        if (pageRotation && Math.abs(pageRotation) > 0.01) {
          const rad = (pageRotation * Math.PI) / 180;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rad);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        // draw
        ctx.drawImage(temp, 0, 0);
        ctx.restore();

        // additional overlays
        applyPaperToneToCanvas(ctx, canvas.width, canvas.height, paperTone ?? 'white', paperToneAmount ?? (paperTone && paperTone !== 'white' ? 40 : 0));
        drawFoldCreaseOnCanvas(ctx, canvas.width, canvas.height, foldCrease ?? 0, false);
        drawTornEdgesOnCanvas(ctx, canvas.width, canvas.height, tornEdges ?? 0);
        drawDogEarOnCanvas(ctx, canvas.width, canvas.height, dogEar ?? 'none', dogEarSize ?? (foldCrease ?? 0));
        // improved dog-ear rendering if available
        drawDogEarOnCanvasImproved(ctx, canvas.width, canvas.height, dogEar ?? 'none', dogEarSize ?? (foldCrease ?? 0));
        drawStapleHolesOnCanvas(ctx, canvas.width, canvas.height, stapleHoles ?? false);
        drawPaperclipMarkOnCanvas(ctx, canvas.width, canvas.height, paperclipMark ?? false);
        drawTapeResidueOnCanvas(ctx, canvas.width, canvas.height, tapeResidue ?? 0);
        // paper style overlays (if user requested visible lined/grid paper)
        if (paperStyle === 'lined') drawLinedPaper(ctx, canvas.width, canvas.height);
        if (paperStyle === 'grid') drawGridPaper(ctx, canvas.width, canvas.height);
        // smudge canvas-only effect
        drawSmudgeOnCanvas(ctx, canvas.width, canvas.height, smudgeIntensity ?? 0);

        // glare and vignette
        applyGlareToCtx(ctx, canvas.width, canvas.height, glare ?? 0);
        applyVignetteToCtx(ctx, canvas.width, canvas.height, vignette ?? 30, vignetteDarkness ?? 30);

        // dpi reduction (downscale & upscale)
        if ((dpiReduction ?? 0) > 0) {
          downscaleUpscaleCanvas(canvas, dpiReduction ?? 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [
    file,
    pageNumber,
    intensity,
    brightness,
    contrast,
    sepia,
    temperature,
    vignette,
    vignetteDarkness,
    sharpen,
    gamma,
    saturation,
    hue,
    paperTone,
    paperGrain,
    pageRotation,
    perspectiveSkew,
    foldCrease,
    tornEdges,
    dogEar,
    jpegArtifacts,
    paperclipMark,
    tapeResidue,
    stapleHoles,
    glare,
    dpiReduction,
    paperToneAmount,
    removeLines,
    paperStyle,
    dogEarSize,
    scale,
    debounceMs,
    retryKey,
    smallMarks,
    inkColor,
    inkFading,
    inkBleeding,
    
  ]);

  return (
    <div className={className}>
      {loading && <div className="text-sm text-gray-500">Rendering preview...</div>}
      {error && (
        <div className="text-sm text-red-500 space-y-2">
          <div>{error}</div>
          <div className="flex gap-2">
            <button onClick={() => setRetryKey((k) => k + 1)} className="px-2 py-1 bg-gray-200 rounded">Retry</button>
            <button onClick={() => { navigator.clipboard?.writeText(error).catch(() => {}); }} className="px-2 py-1 bg-gray-100 rounded">Copy Error</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-auto border rounded shadow-sm bg-white" />
    </div>
  );
}

// Use shared implementations from canvasFilters.ts (applyPixelFilters, applyVignetteToCtx, etc.)

export default DirtyPreview;
