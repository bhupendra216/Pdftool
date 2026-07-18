import React, { useEffect, useRef, useState, useCallback } from "react";
import { Check, RotateCcw, RotateCw, Trash2, GripVertical } from "lucide-react";

type Page = {
  id: string;
  pageNumber: number;
  rotation: number;
  selected: boolean;
};

type Props = {
  pages: Page[];
  onUpdate: (pages: Page[]) => void;
  onRotate: (indexes: number[], delta: number) => void;
  onDelete: (indexes: number[]) => void;
  onExtract: (indexes: number[]) => void;
  zoom: number;
  setZoom: (z: number) => void;
};

export function OrganizeGrid({ pages, onUpdate, onRotate, onDelete, onExtract, zoom, setZoom }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [selectionAnchor, setSelectionAnchor] = useState<number | null>(null);

  // Simple virtualization: compute visible range
  const [renderRange, setRenderRange] = useState([0, Math.min(100, pages.length)]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const itemHeight = 220 * (zoom / 100);
      const cols = Math.max(1, Math.floor(el.clientWidth / (180 * (zoom / 100))));
      const rowHeight = itemHeight + 32;
      const startRow = Math.floor(scrollTop / rowHeight);
      const visibleRows = Math.ceil(el.clientHeight / rowHeight) + 2;
      const start = Math.max(0, startRow * cols - cols * 2);
      const end = Math.min(pages.length, (startRow + visibleRows) * cols + cols * 2);
      setRenderRange([start, end]);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pages.length, zoom]);

  const toggleSelect = useCallback((index: number, e?: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      const next = [...pages];
      next[index].selected = !next[index].selected;
      onUpdate(next);
      setSelectionAnchor(index);
      return;
    }

    if (e && e.shiftKey && selectionAnchor !== null) {
      const a = Math.min(selectionAnchor, index);
      const b = Math.max(selectionAnchor, index);
      const next = [...pages];
      for (let i = a; i <= b; i++) next[i].selected = true;
      onUpdate(next);
      return;
    }

    const next = pages.map((p, i) => ({ ...p, selected: i === index ? !p.selected : p.selected }));
    onUpdate(next);
    setSelectionAnchor(index);
  }, [pages, onUpdate, selectionAnchor]);

  // Drag handlers
  const onDragStart = (index: number, e: React.DragEvent) => {
    setDragIndex(index);
    try { e.dataTransfer!.setData("text/plain", String(index)); } catch {}
    e.dataTransfer!.effectAllowed = "move";
  };

  const onDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const onDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex !== null ? dragIndex : Number(e.dataTransfer!.getData("text/plain"));
    const to = index;
    if (from === to) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...pages];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onUpdate(next.map((p, i) => ({ ...p })));
    setDragIndex(null);
    setOverIndex(null);
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="relative">
      {/* Zoom controls */}
      <div className="flex items-center gap-2 justify-end mb-4">
        <button onClick={() => setZoom(Math.max(20, zoom - 10))} className="px-3 py-1 border rounded">-</button>
        <button onClick={() => setZoom(100)} className="px-3 py-1 border rounded">Fit</button>
        <button onClick={() => setZoom(Math.min(300, zoom + 10))} className="px-3 py-1 border rounded">+</button>
      </div>

      <div ref={containerRef} style={{ maxHeight: 520 }} className="overflow-auto" role="list">
        <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(120, 140 * (zoom/100))}px, 1fr))`, gap: 16 }}>
          {pages.slice(renderRange[0], renderRange[1]).map((page, idx) => {
            const index = renderRange[0] + idx;
            return (
              <div
                key={page.id}
                draggable
                onDragStart={(e) => onDragStart(index, e)}
                onDragOver={(e) => onDragOver(index, e)}
                onDrop={(e) => onDrop(index, e)}
                onClick={(e) => toggleSelect(index, e as any)}
                className={`relative p-2 rounded-xl border ${page.selected ? "border-primary bg-primary/5" : "border-border bg-white"} transition-shadow hover:shadow-md`}
                style={{ height: 220 * (zoom/100) }}
                role="listitem"
              >
                <div className="absolute top-2 left-2">
                  <input type="checkbox" checked={page.selected} onChange={() => toggleSelect(index)} />
                </div>

                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); onRotate([index], -90); }} title="Rotate left" className="p-2 rounded bg-white/80"> <RotateCcw size={16} /> </button>
                  <button onClick={(e) => { e.stopPropagation(); onRotate([index], 90); }} title="Rotate right" className="p-2 rounded bg-white/80"> <RotateCw size={16} /> </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete([index]); }} title="Delete" className="p-2 rounded bg-white/80"> <Trash2 size={16} /> </button>
                </div>

                <div className="flex items-center justify-center h-full">
                  {/* Thumbnail placeholder */}
                  <div className="bg-white shadow rounded-md w-full h-full flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Page {page.pageNumber}</div>
                  </div>
                </div>

                <div className="mt-2 text-center text-sm text-muted-foreground">Page {page.pageNumber}</div>

                <div className="absolute bottom-2 left-2 cursor-grab" title="Drag to reorder"><GripVertical size={18} /></div>
                {dragIndex === index && <div className="absolute inset-0 bg-primary/10" />}
              </div>
            );
          })}
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 bg-card border border-border rounded-xl shadow-md p-3 flex items-center gap-4">
          <div className="text-sm font-medium">{selectedCount} page{selectedCount>1?"s":""} selected</div>
          <button className="px-3 py-2 bg-white rounded" onClick={() => onRotate(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0), -90)}>Rotate Left</button>
          <button className="px-3 py-2 bg-white rounded" onClick={() => onRotate(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0), 90)}>Rotate Right</button>
          <button className="px-3 py-2 bg-destructive text-white rounded" onClick={() => onDelete(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0))}>Delete</button>
          <button className="px-3 py-2 bg-primary text-white rounded" onClick={() => onExtract(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0))}>Extract</button>
        </div>
      )}

      <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total pages: {pages.length}</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Zoom {zoom}%</div>
          <button className="px-4 py-2 bg-primary text-white rounded">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default OrganizeGrid;
