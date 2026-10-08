/// <reference types="react" />
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PDFPreview from '@/components/PDFPreview';
import DirtyPreview from '@/components/DirtyPreview';
import { processPage, type TransformSettings } from '@/lib/transform/processPage';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_PAGES = 30;

function createSeed() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0];
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function processingError(error: unknown) {
  const failure = error as { name?: string; message?: string };
  const details = `${failure?.name ?? ''} ${failure?.message ?? ''}`.toLowerCase();
  if (failure?.name === 'PasswordException' || /password|encrypted/.test(details)) return 'password';
  if (/memory|allocation|out of memory|quotaexceeded/.test(details)) return 'memory';
  return 'read';
}

export default function DirtyPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const [dpi, setDpi] = useState<100 | 150 | 200>(150);

  // preview controls
  const [brightness, setBrightness] = useState<number>(55);
  const [contrast, setContrast] = useState<number>(55);
  const [sepia, setSepia] = useState<number>(5);
  const [temperature, setTemperature] = useState<number>(10);
  const [vignette, setVignette] = useState<number>(50);
  const [sharpen, setSharpen] = useState<number>(0);
  // advanced controls
  const [paperTone, setPaperTone] = useState<'white'|'cream'|'yellowed'|'blueish'|'gray'|'pinkish'>('yellowed');
  const [paperGrain, setPaperGrain] = useState<number>(30);
  const [paperToneAmount, setPaperToneAmount] = useState<number>(60);
  const [removeLines, setRemoveLines] = useState<boolean>(false);
  const [paperStyle, setPaperStyle] = useState<'plain'|'lined'|'grid'>('plain');
  const [pageRotation, setPageRotation] = useState<number>(2);
  const [foldCrease, setFoldCrease] = useState<number>(40);
  const [tornEdges, setTornEdges] = useState<number>(40);
  const [dogEar, setDogEar] = useState<'none'|'top-left'|'top-right'|'bottom-left'|'bottom-right'>('top-left');
  const [dogEarSize, setDogEarSize] = useState<number>(50);
  const [gamma, setGamma] = useState<number>(1.0);
  const [saturation, setSaturation] = useState<number>(0);
  const [hueShift, setHueShift] = useState<number>(0);
  const [glare, setGlare] = useState<number>(15);
  const [vignetteDarkness, setVignetteDarkness] = useState<number>(30);
  const [stapleHoles, setStapleHoles] = useState<boolean>(false);
  const [paperclipMark, setPaperclipMark] = useState<boolean>(false);
  const [tapeResidue, setTapeResidue] = useState<number>(0);
  const [smudgeIntensity, setSmudgeIntensity] = useState<number>(15);
  const [waterStainDepth, setWaterStainDepth] = useState<number>(15);
  const [jpegArtifacts, setJpegArtifacts] = useState<number>(15);
  const [dpiReduction, setDpiReduction] = useState<number>(15);

  // Ink transformation controls
  const [inkColor, setInkColor] = useState<'black'|'blue'|'brown'|'gray'|'green'|'red'>('black');
  const [inkFading, setInkFading] = useState<number>(0); // 0..100
  const [inkBleeding, setInkBleeding] = useState<number>(0); // 0..100

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.2);

  const [split, setSplit] = useState<number>(50); // percent left pane
  const [rightMode, setRightMode] = useState<'manual'|'restore'>('manual');
  const handleRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  // accordion state
  const [basicOpen, setBasicOpen] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);
  const [damageOpen, setDamageOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [artifactsOpen, setArtifactsOpen] = useState(false);
  const settings = useMemo<TransformSettings>(() => ({
    brightness,
    contrast,
    sepia,
    temperature,
    vignette,
    vignetteDarkness,
    sharpen,
    paperTone,
    paperGrain,
    paperToneAmount,
    removeLines,
    paperStyle,
    pageRotation,
    foldCrease,
    tornEdges,
    dogEar,
    dogEarSize,
    gamma,
    saturation,
    hueShift,
    glare,
    stapleHoles,
    paperclipMark,
    tapeResidue,
    smudgeIntensity,
    waterStainDepth,
    jpegArtifacts,
    dpiReduction,
    inkColor,
    inkFading,
    inkBleeding,
  }), [
    brightness, contrast, sepia, temperature, vignette, vignetteDarkness, sharpen,
    paperTone, paperGrain, paperToneAmount, removeLines, paperStyle, pageRotation,
    foldCrease, tornEdges, dogEar, dogEarSize, gamma, saturation, hueShift, glare,
    stapleHoles, paperclipMark, tapeResidue, smudgeIntensity, waterStainDepth,
    jpegArtifacts, dpiReduction, inkColor, inkFading, inkBleeding,
  ]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const container = handleRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
      setSplit(pct);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  useEffect(() => {
    setDownloadUrl(null);
    setOutputSize(null);
  }, [file, settings, seed, dpi]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadUrl((d) => {
      if (d) URL.revokeObjectURL(d);
      return null;
    });
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(null);
    setErrorMessage('');
    setOutputSize(null);
    setProgress('');
    setPageNumber(1);
    setTotalPages(1);
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setErrorMessage('File too large. Please use a PDF up to 50 MB.');
      e.target.value = '';
      return;
    }
    void (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(await f.arrayBuffer()) });
        const document = await loadingTask.promise;
        if (document.numPages > MAX_PAGES) {
          setErrorMessage('This PDF has more than 30 pages. Please choose a shorter document.');
          await loadingTask.destroy();
          e.target.value = '';
          return;
        }
        setTotalPages(document.numPages);
        await loadingTask.destroy();
        setSeed(createSeed());
        setFile(f);
      } catch (error) {
        const kind = processingError(error);
        setErrorMessage(kind === 'password'
          ? 'This PDF is password-protected — unlock it with our Unlock PDF tool first.'
          : kind === 'memory'
            ? 'File too large, try fewer pages or lower DPI.'
            : 'Couldn’t read this PDF. Check that it is a valid, unencrypted PDF.');
        e.target.value = '';
      }
    })();
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setDownloadUrl(null);
    setOutputSize(null);
    setErrorMessage('');
    setProgress('Starting processing…');
    let destroyPdf: (() => Promise<void>) | undefined;

    try {
      if (file.size > MAX_FILE_BYTES) throw new Error('file-limit');
      const sourceBytes = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(sourceBytes) });
      destroyPdf = () => loadingTask.destroy();
      const pdf = await loadingTask.promise;
      if (pdf.numPages > MAX_PAGES) throw new Error('page-limit');
      const outPdf = await PDFDocument.create();
      outPdf.setCreationDate(new Date(0));
      outPdf.setModificationDate(new Date(0));
      outPdf.setCreator('PDFKira');
      outPdf.setProducer('PDFKira');

      for (let p = 1; p <= pdf.numPages; p++) {
        setProgress(`Processing page ${p} of ${pdf.numPages}…`);
        const page = await pdf.getPage(p);
        const processed = await processPage(page, p, settings, seed, dpi);
        const blob = await new Promise<Blob>((resolve, reject) => {
          processed.toBlob((result) => result ? resolve(result) : reject(new Error('image-encode')), 'image/png');
        });
        const imgBytes = await blob.arrayBuffer();
        const img = await outPdf.embedPng(imgBytes);
        const { width, height } = sourceDoc.getPage(p - 1).getSize();
        const outputPage = outPdf.addPage([width, height]);
        outputPage.drawImage(img, { x: 0, y: 0, width, height });
        processed.width = 0;
        processed.height = 0;
      }

      const outBytes = await outPdf.save();
      const outBlob = new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(outBlob);
      setDownloadUrl(url);
      setOutputSize(outBlob.size);
      setProgress('Finished processing.');
    } catch (error) {
      const kind = processingError(error);
      setErrorMessage(kind === 'password'
        ? 'This PDF is password-protected — unlock it with our Unlock PDF tool first.'
        : kind === 'memory'
          ? 'File too large, try fewer pages or lower DPI.'
          : (error instanceof Error && error.message === 'page-limit')
            ? 'This PDF has more than 30 pages. Please choose a shorter document.'
            : (error instanceof Error && error.message === 'file-limit')
              ? 'File too large. Please use a PDF up to 50 MB.'
              : 'Couldn’t read this PDF. Check that it is a valid, unencrypted PDF.');
      setProgress('');
    } finally {
      if (destroyPdf) await destroyPdf();
      setProcessing(false);
    }
  };

  function restoreOriginalSettings() {
    setBrightness(50);
    setContrast(50);
    setSepia(0);
    setTemperature(0);
    setVignette(0);
    setVignetteDarkness(0);
    setSharpen(0);
    setPaperTone('white');
    setPaperGrain(0);
    setPaperToneAmount(0);
    setRemoveLines(false);
    setPaperStyle('plain');
    setPageRotation(0);
    setFoldCrease(0);
    setTornEdges(0);
    setDogEar('none');
    setDogEarSize(0);
    setGamma(1.0);
    setSaturation(0);
    setHueShift(0);
    setGlare(0);
    setStapleHoles(false);
    setPaperclipMark(false);
    setTapeResidue(0);
    setSmudgeIntensity(0);
    setWaterStainDepth(0);
    setJpegArtifacts(0);
    setDpiReduction(0);
    setDpi(150);
    setInkColor('black');
    setInkFading(0);
    setInkBleeding(0);
  }

  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Make Your PDF Look Old</h1>
      <p className="text-gray-600 mb-6">Apply aged, vintage, and scanned-paper effects to a PDF. Preview and export use the same processing; everything runs locally in your browser.</p>

      <div className="space-y-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border rounded" />
        <p className="text-sm text-muted-foreground">PDF limits: 50 MB and 30 pages. Output is a flattened image PDF — text won’t be selectable or searchable.</p>
        {errorMessage && (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {errorMessage}{' '}
            {errorMessage.startsWith('This PDF is password-protected') && (
              <a className="font-medium underline" href="/tools/unlock-pdf">Unlock it with our Unlock PDF tool</a>
            )}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div />
          <div className="flex items-center gap-2">
            <button onClick={zoomOut} className="px-3 py-2 bg-gray-200 rounded">-</button>
            <div className="text-sm text-gray-600">Zoom {Math.round(zoom * 100)}%</div>
            <button onClick={zoomIn} className="px-3 py-2 bg-gray-200 rounded">+</button>
          </div>
        </div>

        

        {/* Side-by-side preview with draggable handle */}
        <div className="relative border rounded overflow-hidden">
          <div className="flex" style={{ height: 520 }}>
            <div style={{ width: `${split}%` }} className="p-4 bg-gray-50 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Original (Page {pageNumber})</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPageNumber((n) => Math.max(1, n - 1))} className="px-2 py-1 bg-white rounded border">Prev</button>
                  <span className="text-sm">{pageNumber} / {totalPages}</span>
                  <button onClick={() => setPageNumber((n) => Math.min(totalPages, n + 1))} className="px-2 py-1 bg-white rounded border">Next</button>
                </div>
              </div>
              <PDFPreview file={file} pageNumber={pageNumber} scale={zoom} label="Original" onDocumentLoaded={(n) => setTotalPages(n)} />
            </div>

            <div ref={handleRef} onMouseDown={() => (draggingRef.current = true)} className="w-2 cursor-ew-resize bg-gray-200" />

            <div style={{ width: `${100 - split}%` }} className="p-4 bg-gray-50 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Preview (Distressed)</div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">
                    Quality
                    <select value={dpi} onChange={(e) => setDpi(Number(e.target.value) as 100 | 150 | 200)} className="ml-1 rounded border bg-white p-1 text-gray-900">
                      <option value={100}>100 DPI</option>
                      <option value={150}>150 DPI</option>
                      <option value={200}>200 DPI</option>
                    </select>
                  </label>
                  <button onClick={() => setSeed(createSeed())} className="px-2 py-1 bg-white rounded border" title="Choose a new deterministic layout for randomized effects">
                    Shuffle effects
                  </button>
                  <select value={rightMode} onChange={(e) => {
                    const v = e.target.value as any;
                    setRightMode(v);
                    if (v === 'restore') {
                      restoreOriginalSettings();
                      // return to manual after applying
                      setTimeout(() => setRightMode('manual'), 200);
                    }
                  }} className="p-1 border rounded bg-white text-gray-900">
                    <option value="manual">Change yourself</option>
                    <option value="restore">Restore original values</option>
                  </select>
                  <div className="text-sm text-gray-500">Same processing as export</div>
                </div>
              </div>
              <DirtyPreview
                file={file}
                pageNumber={pageNumber}
                settings={settings}
                seed={seed}
                dpi={dpi}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Controls: grouped accordions */}
        <div className="space-y-3">
          {/* Ink Transformation */}
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => { /* reuse basicOpen toggle space */ }}>
              <span className="font-medium">🖊️ Ink Transformation</span>
              <span className="text-sm text-muted-foreground">Configure ink color, fading and bleeding</span>
            </button>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ink Color</label>
                <select value={inkColor} onChange={(e) => setInkColor(e.target.value as any)} className="w-full p-2 border rounded" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                  <option value="black">Black (Original)</option>
                  <option value="blue">Blue</option>
                  <option value="brown">Brown</option>
                  <option value="gray">Gray</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
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

          {/* Basic */}
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => setBasicOpen((v) => !v)}>
              <span className="font-medium">✨ Basic Controls</span>
              <span className="text-sm text-muted-foreground">{basicOpen ? 'Hide' : 'Show'}</span>
            </button>
            {basicOpen && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">☀️ Brightness: {brightness}%</label>
                  <input type="range" min={0} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🌈 Contrast: {contrast}%</label>
                  <input type="range" min={0} max={100} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🟫 Sepia: {sepia}%</label>
                  <input type="range" min={0} max={100} value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🌡 Temperature: {temperature}</label>
                  <input type="range" min={-100} max={100} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🕳 Vignette Size: {vignette}%</label>
                  <input type="range" min={0} max={100} value={vignette} onChange={(e) => setVignette(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vignette Darkness: {vignetteDarkness}%</label>
                  <input type="range" min={0} max={100} value={vignetteDarkness} onChange={(e) => setVignetteDarkness(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">🔍 Sharpen: {sharpen}%</label>
                  <input type="range" min={0} max={100} value={sharpen} onChange={(e) => setSharpen(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => setPaperOpen((v) => !v)}>
              <span className="font-medium">📄 Paper & Texture</span>
              <span className="text-sm text-muted-foreground">{paperOpen ? 'Hide' : 'Show'}</span>
            </button>
            {paperOpen && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Paper Tone</label>
                  <select value={paperTone} onChange={(e) => setPaperTone(e.target.value as any)} className="w-full p-2 border rounded" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                    <option value="white">White</option>
                    <option value="cream">Cream</option>
                    <option value="yellowed">Yellowed</option>
                    <option value="blueish">Blueish</option>
                    <option value="gray">Gray</option>
                    <option value="pinkish">Pinkish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tone Amount: {paperToneAmount}%</label>
                  <input type="range" min={0} max={100} value={paperToneAmount} onChange={(e) => setPaperToneAmount(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paper Style</label>
                  <select value={paperStyle} onChange={(e) => setPaperStyle(e.target.value as any)} className="w-full p-2 border rounded">
                    <option value="plain">Plain A4</option>
                    <option value="lined">Lined</option>
                    <option value="grid">Grid</option>
                  </select>
                  <label className="inline-flex items-center mt-2">
                    <input type="checkbox" className="mr-2" checked={removeLines} onChange={(e) => setRemoveLines(e.target.checked)} />
                    Remove lines (for ruled paper)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paper Grain: {paperGrain}%</label>
                  <input type="range" min={0} max={100} value={paperGrain} onChange={(e) => setPaperGrain(Number(e.target.value))} className="w-full" />
                </div>
                
              </div>
            )}
          </div>

          {/* Color & Lighting */}
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => setColorOpen((v) => !v)}>
              <span className="font-medium">🎨 Color & Lighting</span>
              <span className="text-sm text-muted-foreground">{colorOpen ? 'Hide' : 'Show'}</span>
            </button>
            {colorOpen && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gamma: {gamma.toFixed(2)}</label>
                  <input type="range" min={0.5} max={2.5} step={0.01} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Saturation: {saturation}%</label>
                  <input type="range" min={-100} max={100} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hue Shift: {hueShift}°</label>
                  <input type="range" min={-180} max={180} value={hueShift} onChange={(e) => setHueShift(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Glare: {glare}%</label>
                  <input type="range" min={0} max={100} value={glare} onChange={(e) => setGlare(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hue/Temp: {temperature}</label>
                  <input type="range" min={-100} max={100} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>

          {/* Damage & Artifacts */}
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => setDamageOpen((v) => !v)}>
              <span className="font-medium">🧨 Damage & Artifacts</span>
              <span className="text-sm text-muted-foreground">{damageOpen ? 'Hide' : 'Show'}</span>
            </button>
            {damageOpen && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Rotation: {pageRotation}°</label>
                  <input type="range" min={-5} max={5} step={0.1} value={pageRotation} onChange={(e) => setPageRotation(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fold Crease: {foldCrease}%</label>
                  <input type="range" min={0} max={100} value={foldCrease} onChange={(e) => setFoldCrease(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Torn Edges: {tornEdges}%</label>
                  <input type="range" min={0} max={100} value={tornEdges} onChange={(e) => setTornEdges(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Dog Ear</label>
                  <select value={dogEar} onChange={(e) => setDogEar(e.target.value as any)} className="w-full p-2 border rounded" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                    <option value="none">None</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Dog Ear Size: {dogEarSize}%</label>
                  <input type="range" min={0} max={100} value={dogEarSize} onChange={(e) => setDogEarSize(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>

          {/* Artifacts & Output Quality */}
          <div className="bg-card border border-border rounded-md p-3">
            <button className="w-full text-left flex items-center justify-between" onClick={() => setArtifactsOpen((v) => !v)}>
              <span className="font-medium">⚙️ Artifacts & Output</span>
              <span className="text-sm text-muted-foreground">{artifactsOpen ? 'Hide' : 'Show'}</span>
            </button>
            {artifactsOpen && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Staple Holes</label>
                  <input type="checkbox" checked={stapleHoles} onChange={(e) => setStapleHoles(e.target.checked)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Paperclip Mark</label>
                  <input type="checkbox" checked={paperclipMark} onChange={(e) => setPaperclipMark(e.target.checked)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tape Residue: {tapeResidue}%</label>
                  <input type="range" min={0} max={100} value={tapeResidue} onChange={(e) => setTapeResidue(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Smudge Intensity: {smudgeIntensity}%</label>
                  <input type="range" min={0} max={100} value={smudgeIntensity} onChange={(e) => setSmudgeIntensity(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Water Stain Depth: {waterStainDepth}%</label>
                  <input type="range" min={0} max={100} value={waterStainDepth} onChange={(e) => setWaterStainDepth(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">JPEG Artifacts: {jpegArtifacts}%</label>
                  <input type="range" min={0} max={100} value={jpegArtifacts} onChange={(e) => setJpegArtifacts(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">DPI Reduction: {dpiReduction}%</label>
                  <input type="range" min={0} max={100} value={dpiReduction} onChange={(e) => setDpiReduction(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-amber-800">Output is a flattened image PDF — text won’t be selectable or searchable.</p>
          {progress && <p aria-live="polite" className="text-sm text-muted-foreground">{progress}</p>}
          {outputSize !== null && <p className="text-sm text-muted-foreground">Processed output size: {formatBytes(outputSize)}</p>}
          <div className="flex gap-4">
          <button onClick={handleProcess} disabled={!file || processing} className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Apply & Download'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download="aged-vintage.pdf" className="py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700">
              Download PDF
            </a>
          )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">Processed entirely in your browser — your file never leaves your device.</p>
      </div>
    </div>
  );
}

export { DirtyPDF };
