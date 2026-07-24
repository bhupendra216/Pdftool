import React, { useEffect, useRef, useState, useCallback } from "react";
import { Check, RotateCcw, RotateCw, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  onSaveChanges: () => void;
  zoom: number;
  setZoom: (z: number) => void;
};

export function OrganizeGrid({ pages, onUpdate, onRotate, onDelete, onExtract, onSaveChanges, zoom, setZoom }: Props) {
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
    <div className="relative space-y-4 rounded-3xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
      {/* Zoom controls */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="rounded-full px-3" onClick={() => setZoom(Math.max(20, zoom - 10))}>-</Button>
        <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => setZoom(100)}>Fit</Button>
        <Button variant="outline" size="sm" className="rounded-full px-3" onClick={() => setZoom(Math.min(300, zoom + 10))}>+</Button>
      </div>

      <div ref={containerRef} style={{ maxHeight: 520 }} className="overflow-auto rounded-2xl border border-border/60 bg-background/60 p-3" role="list">
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
                className={`group relative rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${page.selected ? "border-primary/60 bg-primary/10 shadow-[0_18px_60px_-35px_rgba(59,130,246,0.55)]" : "border-border/70 bg-card/95"}`}
                style={{ height: 220 * (zoom/100) }}
                role="listitem"
                aria-selected={page.selected}
              >
                <div className="absolute left-3 top-3 z-10">
                  <input type="checkbox" checked={page.selected} onChange={() => toggleSelect(index)} className="h-4 w-4 rounded border-border accent-primary" />
                </div>

                <div className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); onRotate([index], -90); }} title="Rotate left" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"> <RotateCcw size={16} /> </button>
                  <button onClick={(e) => { e.stopPropagation(); onRotate([index], 90); }} title="Rotate right" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"> <RotateCw size={16} /> </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete([index]); }} title="Delete" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-colors hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"> <Trash2 size={16} /> </button>
                </div>

                <div className="flex h-full items-center justify-center">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-background to-muted/40 shadow-inner">
                    {dragIndex === index && <div className="absolute inset-0 bg-primary/10" />}
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                        Page {page.pageNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">Thumbnail preview</div>
                    </div>
                    <Badge variant="secondary" className="absolute bottom-3 left-3 rounded-full bg-background/90 text-xs text-muted-foreground shadow-sm">
                      {page.rotation}°
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 text-center text-sm font-medium text-foreground">Page {page.pageNumber}</div>

                <div className="absolute bottom-3 left-3 cursor-grab text-muted-foreground/80 transition-colors hover:text-foreground" title="Drag to reorder"><GripVertical size={18} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-xl backdrop-blur-md">
          <div className="text-sm font-medium text-foreground">{selectedCount} page{selectedCount>1?"s":""} selected</div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0), -90)}>Rotate Left</Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0), 90)}>Rotate Right</Button>
          <Button variant="destructive" size="sm" className="rounded-full" onClick={() => onDelete(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0))}>Delete</Button>
          <Button size="sm" className="rounded-full" onClick={() => onExtract(pages.map((p,i)=>p.selected?i:-1).filter(i=>i>=0))}>Extract</Button>
        </div>
      )}

      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-border/70 bg-card/95 p-3 backdrop-blur-md">
        <div className="text-sm text-muted-foreground">Total pages: {pages.length}</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Zoom {zoom}%</div>
          <Button className="rounded-full px-4" onClick={onSaveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

export default OrganizeGrid;
