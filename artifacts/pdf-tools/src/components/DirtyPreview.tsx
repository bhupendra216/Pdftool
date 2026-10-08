/// <reference types="react" />
import React, { useEffect, useRef, useState } from 'react';
import { processPage, type TransformSettings } from '@/lib/transform/processPage';
import * as pdfjsLib from 'pdfjs-dist';

export interface DirtyPreviewProps {
  file: File | null;
  pageNumber: number;
  settings: TransformSettings;
  seed: number;
  dpi: 100 | 150 | 200;
  className?: string;
  debounceMs?: number;
}

export default function DirtyPreview({
  file,
  pageNumber,
  settings,
  seed,
  dpi,
  className,
  debounceMs = 250,
}: DirtyPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentFile = file;
    if (!currentFile) return;
    const previewFile: File = currentFile;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      void renderPreview();
    }, debounceMs);

    async function renderPreview() {
      setLoading(true);
      setError(null);
      let destroyTask: (() => Promise<void>) | undefined;
      try {
        const bytes = new Uint8Array(await previewFile.arrayBuffer());
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        destroyTask = () => loadingTask.destroy();
        const document = await loadingTask.promise;
        const page = await document.getPage(Math.min(pageNumber, document.numPages));
        const processed = await processPage(page, pageNumber, settings, seed, dpi);
        if (cancelled) {
          processed.width = 0;
          processed.height = 0;
          return;
        }
        const output = canvasRef.current;
        const context = output?.getContext('2d');
        if (!output || !context) throw new Error('Could not display the processed page.');
        output.width = processed.width;
        output.height = processed.height;
        context.drawImage(processed, 0, 0);
        processed.width = 0;
        processed.height = 0;
      } catch (cause) {
        if (!cancelled) {
          const message = cause instanceof Error ? cause.message : 'Could not render this PDF page.';
          setError(message);
        }
      } finally {
        if (destroyTask) await destroyTask();
        if (!cancelled) setLoading(false);
      }
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [file, pageNumber, settings, seed, dpi, debounceMs]);

  return (
    <div className={className}>
      {loading && <div className="mb-2 text-sm text-muted-foreground">Updating preview…</div>}
      {error && <p role="alert" className="mb-2 text-sm text-destructive">{error}</p>}
      <canvas ref={canvasRef} className="block h-auto max-w-full rounded shadow" />
    </div>
  );
}
