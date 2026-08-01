import React, { useEffect, useRef, useState, useCallback } from "react";
import { Check, RotateCcw, RotateCw, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  onDelete: (pageIds: string[]) => void;
  onExtract: (indexes: number[]) => void;
  onSaveChanges: () => void;
  zoom: number;
  setZoom: (z: number) => void;
  alwaysShowActions?: boolean;
  mode?: "organize" | "rotate";
  thumbnailUrls?: Array<string | null>;
  /**
   * When false, hide all rotation controls and rotation badges.
   * Useful for flows like Delete Pages where rotation isn't relevant.
   */
  enableRotateControls?: boolean;
  /**
   * When false, hide the per-card delete icon. Deletion should be performed
   * only via the primary action (e.g. "Delete Pages") to avoid accidental
   * per-card removals.
   */
  allowPerCardDelete?: boolean;
};

export function OrganizeGrid({ pages, onUpdate, onRotate, onDelete, onExtract, onSaveChanges, zoom, setZoom, alwaysShowActions = false, mode = "organize", thumbnailUrls = [], enableRotateControls = true, allowPerCardDelete = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [selectionAnchor, setSelectionAnchor] = useState<number | null>(null);
  const [renderRange, setRenderRange] = useState([0, Math.min(100, pages.length)]);
  const isRotateMode = mode === "rotate";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollTop = el.scrollTop;
      const itemHeight = 280 * (zoom / 100);
      const cols = Math.max(1, Math.floor(el.clientWidth / (220 * (zoom / 100))));
      const rowHeight = itemHeight + 24;
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
    onUpdate(next.map((p) => ({ ...p })));
    setDragIndex(null);
    setOverIndex(null);
  };

  const selectedCount = isRotateMode ? 0 : pages.filter((p) => p.selected).length;
  const selectAll = () => onUpdate(pages.map((page) => ({ ...page, selected: true })));
  const clearSelection = () => onUpdate(pages.map((page) => ({ ...page, selected: false })));
  const zoomPresets = [25, 50, 100, 150, 200];
  const selectedIndexes = isRotateMode ? pages.map((_, index) => index) : pages.map((page, index) => (page.selected ? index : -1)).filter((index) => index >= 0);

  return (
    <div className="relative space-y-4 rounded-[28px] border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {isRotateMode ? "Rotate preview" : "Page preview"}
          </Badge>
          {!isRotateMode && (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs text-muted-foreground">
              {selectedCount > 0 ? `${selectedCount} selected` : "Tap pages to select"}
            </Badge>
          )}
        </div>

        {!isRotateMode && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={selectAll}>Select all</Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={clearSelection}>Clear</Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {zoomPresets.map((value) => (
            <Button key={value} variant={zoom === value ? "default" : "outline"} size="sm" className="rounded-full px-3" onClick={() => setZoom(value)}>
              {value}%
            </Button>
          ))}
          <Button variant={zoom === 90 ? "default" : "outline"} size="sm" className="rounded-full px-3" onClick={() => setZoom(90)}>Fit Width</Button>
          <Button variant={zoom === 70 ? "default" : "outline"} size="sm" className="rounded-full px-3" onClick={() => setZoom(70)}>Fit Page</Button>
        </div>

        {isRotateMode && enableRotateControls && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(selectedIndexes, -90)}>90° Left</Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(selectedIndexes, 90)}>90° Right</Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(selectedIndexes, 180)}>180°</Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => onRotate(selectedIndexes, 0)}>Reset</Button>
          </div>
        )}
      </div>

      <div ref={containerRef} style={{ maxHeight: 640 }} className="overflow-auto rounded-[24px] border border-border/60 bg-background/60 p-3" role="list">
        <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(180, 200 * (zoom / 100))}px, 1fr))`, gap: 16 }}>
          {pages.slice(renderRange[0], renderRange[1]).map((page, idx) => {
            const index = renderRange[0] + idx;
            const actualIndex = pages.findIndex((candidate) => candidate.id === page.id);
            const effectiveIndex = actualIndex >= 0 ? actualIndex : index;
            const thumbnailUrl = thumbnailUrls[effectiveIndex];
            return (
              <div
                key={page.id}
                draggable={!isRotateMode}
                onDragStart={(e) => !isRotateMode && onDragStart(effectiveIndex, e)}
                onDragOver={(e) => !isRotateMode && onDragOver(effectiveIndex, e)}
                onDrop={(e) => !isRotateMode && onDrop(effectiveIndex, e)}
                onClick={(e) => (isRotateMode ? undefined : toggleSelect(effectiveIndex, e as any))}
                className={`group relative rounded-[24px] border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${!isRotateMode && page.selected ? "border-primary/60 bg-primary/10 shadow-[0_18px_60px_-35px_rgba(59,130,246,0.55)]" : "border-border/70 bg-card/95"}`}
                style={{ minHeight: 300 * (zoom / 100) }}
                role="listitem"
                aria-selected={page.selected}
              >
                {!isRotateMode && (
                  <div className="absolute left-3 top-3 z-10">
                    <input type="checkbox" checked={page.selected} onChange={() => toggleSelect(effectiveIndex)} className="h-4 w-4 rounded border-border accent-primary" />
                  </div>
                )}

                <div className={`absolute right-3 top-3 z-10 flex gap-1.5 transition-opacity ${alwaysShowActions || isRotateMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  {enableRotateControls && (
                    <>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onRotate([effectiveIndex], -90); }} title="Rotate left" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"> <RotateCcw size={16} /> </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); onRotate([effectiveIndex], 90); }} title="Rotate right" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"> <RotateCw size={16} /> </button>
                    </>
                  )}
                  {!isRotateMode && allowPerCardDelete && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); onDelete([page.id]); }} title="Delete" className="rounded-full border border-border/70 bg-background/95 p-2 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground active:scale-95"> <Trash2 size={16} /> </button>
                  )}
                </div>

                <div className="flex h-full flex-col justify-between pt-8">
                  <div className="relative flex h-full min-h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-border/70 bg-gradient-to-b from-background to-muted/30 p-2 shadow-inner">
                    {dragIndex === index && <div className="absolute inset-0 bg-primary/10" />}
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="max-h-full max-w-full rounded-xl border border-border/60 bg-white object-contain shadow-sm dark:bg-slate-950"
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-border/60 bg-background/70 p-4 text-center">
                        <div className="w-full space-y-2">
                          <Skeleton className="h-24 w-full rounded-xl" />
                          <div className="flex gap-2">
                            <Skeleton className="h-3 w-3/4 rounded-full" />
                            <Skeleton className="h-3 w-1/4 rounded-full" />
                          </div>
                        </div>
                        <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Loading preview</div>
                      </div>
                    )}
                    {enableRotateControls && (
                      <Badge variant="secondary" className="absolute bottom-3 left-3 rounded-full bg-background/90 text-xs text-muted-foreground shadow-sm">
                        {page.rotation}°
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-foreground">Page {page.pageNumber}</div>
                    {!isRotateMode ? (page.selected ? <Badge className="rounded-full bg-primary/10 text-primary">Selected</Badge> : <Badge variant="outline" className="rounded-full">Ready</Badge>) : <Badge variant="outline" className="rounded-full">Ready</Badge>}
                  </div>
                </div>

                {!isRotateMode && (
                  <div className="absolute bottom-3 left-3 cursor-grab text-muted-foreground/80 transition-colors hover:text-foreground" title="Drag to reorder"><GripVertical size={18} /></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-border/70 bg-card/95 p-3 backdrop-blur-md">
        <div className="text-sm text-muted-foreground">{isRotateMode ? `Ready to rotate ${pages.length} page${pages.length === 1 ? "" : "s"}` : `Total pages: ${pages.length}`}</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Zoom {zoom}%</div>
          <Button className="rounded-full px-4" onClick={onSaveChanges}>{mode === "rotate" ? "Download Rotated PDF" : "Save Changes"}</Button>
        </div>
      </div>
    </div>
  );
}

export default OrganizeGrid;
