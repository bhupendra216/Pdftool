import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { PDFDocument } from 'pdf-lib';
import DirtyPreview from '../components/DirtyPreview';
import { applyDirtyEffect } from '../lib/dirtyEffects';

export function DirtyPDF(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const intensity = 0;
  const [processing, setProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // preview controls (kept minimal here; main app may expose more)
  const [brightness, setBrightness] = useState<number>(55);
  const [contrast, setContrast] = useState<number>(55);

  // paper & style
  const [paperTone, setPaperTone] = useState<'white'|'cream'|'yellowed'|'blueish'|'gray'|'pinkish'>('yellowed');

  // dog ear
  const [dogEar, setDogEar] = useState<'none'|'top-left'|'top-right'|'bottom-left'|'bottom-right'>('top-left');

  // Ink transformation controls (moved to top of accordions)
  const [inkColor, setInkColor] = useState<'black'|'blue'|'brown'|'gray'|'green'|'red'>('black');
  const [inkFading, setInkFading] = useState<number>(0);
  const [inkBleeding, setInkBleeding] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadUrl((d) => {
      if (d) URL.revokeObjectURL(d);
      return null;
    });
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(f);
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setDownloadUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        applyDirtyEffect(page, intensity);
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error processing PDF:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Transform PDF</h1>
      <p className="text-gray-600 mb-6">Make your PDF look aged and handwritten — add paper texture and natural marks. Preview changes in real-time.</p>

      <div className="space-y-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border rounded" />

        {/* Ink Transformation — moved to top */}
        <div className="bg-card border border-border rounded-md p-3">
          <div className="w-full text-left flex items-center justify-between">
            <span className="font-medium">🖊️ Ink Transformation</span>
            <span className="text-sm text-muted-foreground">Color, fading and bleeding</span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ink Color</label>
              <select value={inkColor} onChange={(e) => setInkColor(e.target.value as any)} className="w-full p-2 border rounded bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                <option value="black" className="text-gray-900">Black (Original)</option>
                <option value="blue" className="text-gray-900">Blue</option>
                <option value="brown" className="text-gray-900">Brown</option>
                <option value="gray" className="text-gray-900">Gray</option>
                <option value="green" className="text-gray-900">Green</option>
                <option value="red" className="text-gray-900">Red</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ink Fading: {inkFading}%</label>
              <input type="range" min={0} max={100} value={inkFading} onChange={(e) => setInkFading(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ink Bleeding: {inkBleeding}%</label>
              <input type="range" min={0} max={100} value={inkBleeding} onChange={(e) => setInkBleeding(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>

        {/* Basic Controls */}
        <div className="bg-card border border-border rounded-md p-3">
          <div className="w-full text-left flex items-center justify-between">
            <span className="font-medium">✨ Basic Controls</span>
            <span className="text-sm text-muted-foreground">Show</span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">☀️ Brightness: {brightness}%</label>
              <input type="range" min={0} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🌈 Contrast: {contrast}%</label>
              <input type="range" min={0} max={100} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>

        {/* Paper & Texture */}
        <div className="bg-card border border-border rounded-md p-3">
          <div className="w-full text-left flex items-center justify-between">
            <span className="font-medium">📄 Paper & Texture</span>
            <span className="text-sm text-muted-foreground">Show</span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Paper Tone</label>
              <select value={paperTone} onChange={(e) => setPaperTone(e.target.value as any)} className="w-full p-2 border rounded bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                <option value="white" className="text-gray-900">White</option>
                <option value="cream" className="text-gray-900">Cream</option>
                <option value="yellowed" className="text-gray-900">Yellowed</option>
                <option value="blueish" className="text-gray-900">Blueish</option>
                <option value="gray" className="text-gray-900">Gray</option>
                <option value="pinkish" className="text-gray-900">Pinkish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Color & Lighting */}
        <div className="bg-card border border-border rounded-md p-3">
          <div className="w-full text-left flex items-center justify-between">
            <span className="font-medium">🎨 Color & Lighting</span>
            <span className="text-sm text-muted-foreground">Show</span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Placeholder controls kept minimal */}
            <div>
              <label className="block text-sm font-medium mb-2">Gamma</label>
              <input type="range" min={0.5} max={2.5} step={0.01} defaultValue={1} className="w-full" />
            </div>
          </div>
        </div>

        {/* Damage & Artifacts */}
        <div className="bg-card border border-border rounded-md p-3">
          <div className="w-full text-left flex items-center justify-between">
            <span className="font-medium">🧨 Damage & Artifacts</span>
            <span className="text-sm text-muted-foreground">Show</span>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dog Ear</label>
              <select value={dogEar} onChange={(e) => setDogEar(e.target.value as any)} className="w-full p-2 border rounded bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                <option value="none" className="text-gray-900">None</option>
                <option value="top-left" className="text-gray-900">Top Left</option>
                <option value="top-right" className="text-gray-900">Top Right</option>
                <option value="bottom-left" className="text-gray-900">Bottom Left</option>
                <option value="bottom-right" className="text-gray-900">Bottom Right</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="relative border rounded overflow-hidden">
          <div className="p-4 bg-gray-50 overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Preview (Distressed)</div>
              <div className="text-sm text-gray-500">Preview only</div>
            </div>
            <DirtyPreview
              file={file}
              intensity={0}
              brightness={brightness}
              contrast={contrast}
              paperTone={paperTone}
              inkColor={inkColor}
              inkFading={inkFading}
              inkBleeding={inkBleeding}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button onClick={handleProcess} disabled={!file || processing} className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Apply & Download'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download="transformed.pdf" className="py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700">
              Download Ready PDF
            </a>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">🔒 100% client-side — Your file never leaves your browser.</p>
      </div>
    </div>
  );
}

export default DirtyPDF;
