/// <reference types="react" />
import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { PDFDocument } from 'pdf-lib';
import PDFPreview from '@/components/PDFPreview';
import DirtyPreview from '@/components/DirtyPreview';
import { applyPaperToneToCanvas, drawFoldCreaseOnCanvas, drawTornEdgesOnCanvas, drawDogEarOnCanvas, drawStapleHolesOnCanvas, drawPaperclipMarkOnCanvas, drawTapeResidueOnCanvas, setGlobalMarkSizeLimit } from '@/lib/dirtyEffects';
import { applyPixelFilters, applyGrainToImageData, applyJpegArtifactsToImageData, applyGlareToCtx, applyVignetteToCtx, downscaleUpscaleCanvas, removeRuledLinesFromImageData, applyInkTransformations } from '@/lib/canvasFilters';

export default function DirtyPDF() {
  const [file, setFile] = useState<File | null>(null);
  const intensity = 0;
  const [processing, setProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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
  const [paperStyle, setPaperStyle] = useState<'auto'|'plain'|'lined'|'grid'>('auto');
  const [pageRotation, setPageRotation] = useState<number>(2);
  const [perspectiveSkew, setPerspectiveSkew] = useState<number>(0);
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
  const [smallMarks, setSmallMarks] = useState<boolean>(false);

  // Ink transformation controls
  const [inkColor, setInkColor] = useState<'black'|'blue'|'brown'|'gray'|'green'|'red'>('black');
  const [inkFading, setInkFading] = useState<number>(0); // 0..100
  const [inkBleeding, setInkBleeding] = useState<number>(0); // 0..100

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.2);

  const [split, setSplit] = useState<number>(50); // percent left pane
  const handleRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  // accordion state
  const [basicOpen, setBasicOpen] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);
  const [damageOpen, setDamageOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [artifactsOpen, setArtifactsOpen] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadUrl((d) => {
      if (d) URL.revokeObjectURL(d);
      return null;
    });
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(f);
    setPageNumber(1);
    setTotalPages(1);
    if (f) {
      // load to get total pages quickly
      (async () => {
        try {
          const arrayBuffer = await f.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          setTotalPages(pdfDoc.getPageCount());
        } catch (e) {
          // ignore
        }
      })();
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setDownloadUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const outPdf = await PDFDocument.create();

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2 });
        const temp = document.createElement('canvas');
        temp.width = Math.floor(viewport.width);
        temp.height = Math.floor(viewport.height);
        const tctx = temp.getContext('2d');
        if (!tctx) throw new Error('Failed to get temp canvas context');
        await page.render({ canvasContext: tctx, viewport } as any).promise;

        // apply pixel filters
        const imageData = tctx.getImageData(0, 0, temp.width, temp.height);
        // optionally remove ruled lines
        if (removeLines || paperStyle === 'plain') {
          try {
            removeRuledLinesFromImageData(imageData, 0.7);
          } catch (e) {
            console.warn('removeRuledLines failed', e);
          }
        }
        applyPixelFilters(imageData, {
          brightness,
          contrast,
          sepia,
          gamma,
          saturation,
          hue: hueShift,
          temperature,
        });
        applyGrainToImageData(imageData, paperGrain);
        applyJpegArtifactsToImageData(imageData, jpegArtifacts);

        // Ink transformations for export
        if (inkColor !== 'black' || (inkFading ?? 0) > 0 || (inkBleeding ?? 0) > 0) {
          try {
            applyInkTransformations(imageData, {
              color: inkColor,
              fading: inkFading,
              bleeding: inkBleeding,
            });
          } catch (e) {
            console.warn('applyInkTransformations failed', e);
          }
        }
        tctx.putImageData(imageData, 0, 0);

        // overlays and damage
        applyPaperToneToCanvas(tctx, temp.width, temp.height, paperTone, paperTone === 'white' ? 0 : paperToneAmount);
        drawFoldCreaseOnCanvas(tctx, temp.width, temp.height, foldCrease, false);
        drawTornEdgesOnCanvas(tctx, temp.width, temp.height, tornEdges);
        drawDogEarOnCanvas(tctx, temp.width, temp.height, dogEar, dogEarSize);
        drawStapleHolesOnCanvas(tctx, temp.width, temp.height, stapleHoles);
        drawPaperclipMarkOnCanvas(tctx, temp.width, temp.height, paperclipMark);
        drawTapeResidueOnCanvas(tctx, temp.width, temp.height, tapeResidue);
        applyGlareToCtx(tctx, temp.width, temp.height, glare);
        applyVignetteToCtx(tctx, temp.width, temp.height, vignette, vignetteDarkness);

        if (dpiReduction > 0) downscaleUpscaleCanvas(temp, dpiReduction);

        // convert to blob and embed
        const blob: Blob = await new Promise((res) => temp.toBlob((b) => res(b as Blob), 'image/png'));
        const imgBytes = await blob.arrayBuffer();
        const img = await outPdf.embedPng(imgBytes);
        const { width: imgW, height: imgH } = img.scale(1);
        const pageNew = outPdf.addPage([imgW, imgH]);
        pageNew.drawImage(img, { x: 0, y: 0, width: imgW, height: imgH });
      }

      const outBytes = await outPdf.save();
      // ensure we have a plain Uint8Array copy so we can use a standard ArrayBuffer
      const outArray = Uint8Array.from(outBytes as any);
      const outBuffer = outArray.buffer as unknown as ArrayBuffer;
      // tsserver sometimes flags the typed ArrayBuffer as incompatible with BlobPart — silence here
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const outBlob = new Blob([outBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(outBlob);
      setDownloadUrl(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error processing PDF:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Transform PDF</h1>
      <p className="text-gray-600 mb-6">Make your PDF look aged and handwritten — add paper texture and natural marks. Preview changes in real-time.</p>

      <div className="space-y-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border rounded" />

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
                <div className="text-sm text-gray-500">Preview only</div>
              </div>
              <DirtyPreview
                file={file}
                pageNumber={pageNumber}
                intensity={0}
                brightness={brightness}
                contrast={contrast}
                sepia={sepia}
                temperature={temperature}
                vignette={vignette}
                vignetteDarkness={vignetteDarkness}
                sharpen={sharpen}
                gamma={gamma}
                saturation={saturation}
                hue={hueShift}
                paperTone={paperTone}
                paperToneAmount={paperToneAmount}
                paperGrain={paperGrain}
                pageRotation={pageRotation}
                perspectiveSkew={perspectiveSkew}
                foldCrease={foldCrease}
                tornEdges={tornEdges}
                dogEar={dogEar}
                dogEarSize={dogEarSize}
                jpegArtifacts={jpegArtifacts}
                paperclipMark={paperclipMark}
                tapeResidue={tapeResidue}
                stapleHoles={stapleHoles}
                glare={glare}
                // Ink transform props
                inkColor={inkColor}
                inkFading={inkFading}
                inkBleeding={inkBleeding}
                smudgeIntensity={smudgeIntensity}
                waterStainDepth={waterStainDepth}
                dpiReduction={dpiReduction}
                removeLines={removeLines}
                paperStyle={paperStyle}
                smallMarks={smallMarks}
                scale={zoom}
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
                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="mr-2" checked={smallMarks} onChange={(e) => {
                      setSmallMarks(e.target.checked);
                      setGlobalMarkSizeLimit(e.target.checked ? 12 : null);
                    }} />
                    Small Marks (dot-like)
                  </label>
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
                    <option value="auto">Auto (detect)</option>
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
                  <label className="block text-sm font-medium mb-2">Perspective Skew: {perspectiveSkew}%</label>
                  <input type="range" min={0} max={100} value={perspectiveSkew} onChange={(e) => setPerspectiveSkew(Number(e.target.value))} className="w-full" />
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
        <div className="flex gap-4 mt-4">
          <button onClick={handleProcess} disabled={!file || processing} className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {processing ? 'Processing...' : 'Apply & Download'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download="distressed.pdf" className="py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700">
              Download Ready PDF
            </a>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">🔒 100% client-side — Your file never leaves your browser.</p>
      </div>
    </div>
  );
}

export { DirtyPDF };
