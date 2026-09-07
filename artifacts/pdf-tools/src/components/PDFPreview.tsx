import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

interface PDFPreviewProps {
  file: File | null;
  pageNumber?: number;
  scale?: number;
  className?: string;
  label?: string;
  onDocumentLoaded?: (numPages: number) => void;
}

export function PDFPreview({ file, pageNumber = 1, scale = 1.2, className, label, onDocumentLoaded }: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      setError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;
        onDocumentLoaded?.(pdf.numPages);
        const p = Math.min(Math.max(1, pageNumber), pdf.numPages);
        const page = await pdf.getPage(p);
        if (cancelled) return;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const renderContext = { canvasContext: ctx, viewport } as any;
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('PDFPreview render error', err);
        setError('Failed to render PDF preview');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [file, pageNumber, scale]);

  return (
    <div className={className}>
      {loading && <div className="text-sm text-gray-500">Loading preview...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <canvas ref={canvasRef} className="w-full h-auto border rounded shadow-sm bg-white" />
      {label && <p className="text-sm text-center text-gray-500 mt-2">{label}</p>}
    </div>
  );
}

export default PDFPreview;
