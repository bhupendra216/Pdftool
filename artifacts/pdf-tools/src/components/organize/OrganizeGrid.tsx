import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Eye, GripVertical, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Page = {
  id: string;
  pageNumber: number;
  rotation: number;
  selected: boolean;
  thumbnailUrl?: string | null;
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
  const [supportsHover, setSupportsHover] = useState(false);
  const [zoomedPageId, setZoomedPageId] = useState<string | null>(null);
  const previewCloseTimerRef = useRef<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [thumbRatios, setThumbRatios] = useState<Record<string, number>>({});
  const scrollTimerRef = useRef<number | null>(null);
  const isRotateMode = mode === "rotate";

  useEffect(() => {
    const mediaQuery = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
    const updateSupportsHover = () => setSupportsHover(Boolean(mediaQuery?.matches));
    updateSupportsHover();
    mediaQuery?.addEventListener?.("change", updateSupportsHover);
    return () => mediaQuery?.removeEventListener?.("change", updateSupportsHover);
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => setIsScrolling(false), 150);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const gap = 8;
  const minCardWidth = Math.max(140, 180 * (zoom / 100));
  const computedColumns = Math.max(1, Math.min(10, Math.floor((Math.max(containerWidth, 1) + gap) / (minCardWidth + gap))));
  const columns = computedColumns || 1;
  // Compute card size dynamically from container width and a fixed aspect ratio
  const cardWidth = Math.floor((Math.max(containerWidth, 1) - gap * (columns - 1)) / columns);
  const aspectRatioWidth = 3; // width
  const aspectRatioHeight = 4; // height (portrait pages)
  const innerThumbHeight = Math.max(100, Math.round((cardWidth * aspectRatioHeight) / aspectRatioWidth));
  // Make navy container just slightly larger than the thumbnail (small padding)
  const navyPadding = 2;
  const scaledThumbHeight = innerThumbHeight + navyPadding; // navy container = thumbnail + small padding
  const footerHeight = 30; // space for rotation badge and labels (reduced)
  const wrapperVerticalPadding = 6; // total top+bottom padding from card wrapper (p-1)
  const rowHeight = scaledThumbHeight + footerHeight + wrapperVerticalPadding;
  const rowCount = Math.max(1, Math.ceil(pages.length / columns));
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => Math.min(rowHeight, 160),
    overscan: 2,
  });

  // Re-measure virtualizer when container width or thumbnail ratios change
  useEffect(() => {
    try {
      virtualizer.measure?.();
    } catch {}
  }, [containerWidth, Object.keys(thumbRatios).length]);

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
    // When dragging from the grid card itself, close any open preview.
    if (zoomedPageId) {
      // if the user started drag on the zoomed preview we'll use a different handler
      setZoomedPageId(null);
    }
    setDragIndex(index);
    try {
      e.dataTransfer?.setData("text/plain", String(index));
    } catch {}
    e.dataTransfer!.effectAllowed = "move";
  };

  const onDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const onDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    const rawFrom = dragIndex !== null ? dragIndex : Number(e.dataTransfer?.getData("text/plain"));
    const from = Number.isFinite(rawFrom) ? rawFrom : index;
    const to = index;
    if (from === to) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...pages].map((page) => ({ ...page }));
    const [item] = next.splice(from, 1);
    if (!item) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    next.splice(to, 0, item);
    onUpdate(next.map((page, pageIndex) => ({ ...page, pageNumber: pageIndex + 1 })));
    setDragIndex(null);
    setOverIndex(null);
    // close any open preview after drop completes
    if (zoomedPageId) setZoomedPageId(null);
  };

  const selectedCount = isRotateMode ? 0 : pages.filter((p) => p.selected).length;
  const selectAll = () => onUpdate(pages.map((page) => ({ ...page, selected: true })));
  const clearSelection = () => onUpdate(pages.map((page) => ({ ...page, selected: false })));
  const zoomPresets = [25, 50, 100, 150, 200];
  const selectedIndexes = isRotateMode ? pages.map((_, index) => index) : pages.map((page, index) => (page.selected ? index : -1)).filter((index) => index >= 0);
  const showActions = alwaysShowActions || isRotateMode || !supportsHover;

  const togglePagePreview = useCallback((pageId: string) => {
    setZoomedPageId((current) => {
      // clear any existing timer whenever toggling
      if (previewCloseTimerRef.current) {
        window.clearTimeout(previewCloseTimerRef.current);
        previewCloseTimerRef.current = null;
      }

      if (current === pageId) {
        return null;
      }

      // when opening a preview, auto-close after ~2s unless user starts dragging
      const id = window.setTimeout(() => {
        previewCloseTimerRef.current = null;
        setZoomedPageId(null);
      }, 2000);
      previewCloseTimerRef.current = id;

      return pageId;
    });
  }, []);

  // Called when the enlarged preview image is used as the drag source.
  const onOverlayDragStart = (index: number, e: React.DragEvent) => {
    // cancel the auto-close timer so preview persists during drag
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }

    setDragIndex(index);
    try {
      e.dataTransfer?.setData("text/plain", String(index));
    } catch {}
    e.dataTransfer!.effectAllowed = "move";
  };

  const onOverlayDragEnd = () => {
    // ensure we clear drag state and close preview after drag ends
    setDragIndex(null);
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }
    setZoomedPageId(null);
  };

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

      <div ref={containerRef} style={{ maxHeight: 640, overflow: "auto" }} className="rounded-[24px] border border-border/60 bg-background/60 p-2" role="list">
        {zoomedPageId && (() => {
          const zoomPage = pages.find((page) => page.id === zoomedPageId);
          const zoomIndex = pages.findIndex((page) => page.id === zoomedPageId);
          const zoomUrl = zoomPage?.thumbnailUrl ?? thumbnailUrls[zoomIndex] ?? null;
          if (!zoomPage || !zoomUrl) return null;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ease-out"
              style={{ opacity: 1 }}
              aria-hidden="true"
            >
              <div className="flex h-[70vh] w-[min(82vw,920px)] items-center justify-center rounded-[28px] border border-border/70 bg-background/90 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.42)]">
                <div
                  draggable={!isRotateMode}
                  onDragStart={(e) => !isRotateMode && onOverlayDragStart(zoomIndex, e)}
                  onDragEnd={() => !isRotateMode && onOverlayDragEnd()}
                  className="max-h-full max-w-full rounded-xl border border-border/60 bg-white object-contain shadow-sm dark:bg-slate-950"
                  style={{ transform: `rotate(${zoomPage.rotation}deg)`, transition: "transform 180ms ease-out", cursor: isRotateMode ? "default" : "grab" }}
                >
                  <img
                    src={zoomUrl}
                    alt={`Page ${zoomPage.pageNumber} preview`}
                    className="max-h-full max-w-full rounded-xl bg-white object-contain"
                    style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        <div className="relative" style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%" }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const startIndex = virtualRow.index * columns;
            const visiblePages = pages.slice(startIndex, startIndex + columns);

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${gap}px` }}>
                  {visiblePages.map((page, offset) => {
                    const index = startIndex + offset;
                    const actualIndex = pages.findIndex((candidate) => candidate.id === page.id);
                    const effectiveIndex = actualIndex >= 0 ? actualIndex : index;
                    const thumbnailUrl = page.thumbnailUrl ?? thumbnailUrls[effectiveIndex] ?? null;
                    const isPreviewZoomed = zoomedPageId === page.id;
                    const shouldHide = Boolean(zoomedPageId) && !isPreviewZoomed;

                    // per-page inner thumbnail height based on actual image aspect ratio when available
                    const pageRatio = thumbRatios[page.id] ?? (aspectRatioHeight / aspectRatioWidth);
                    const pageInnerThumbHeight = Math.max(100, Math.round(cardWidth * (pageRatio)));
                    const pageScaledThumbHeight = pageInnerThumbHeight + navyPadding;

                    return (
                      <div
                        key={page.id}
                        draggable={!isRotateMode}
                        onDragStart={(e) => !isRotateMode && onDragStart(effectiveIndex, e)}
                        onDragOver={(e) => !isRotateMode && onDragOver(effectiveIndex, e)}
                        onDrop={(e) => !isRotateMode && onDrop(effectiveIndex, e)}
                        onClick={(e) => (isRotateMode ? undefined : toggleSelect(effectiveIndex, e as any))}
                        className={`group relative rounded-[24px] border p-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${!isRotateMode && page.selected ? "border-primary/60 bg-primary/10 shadow-[0_18px_60px_-35px_rgba(59,130,246,0.55)]" : "border-border/70 bg-card/95"} ${dragIndex !== null && overIndex === effectiveIndex ? "border-primary/70 ring-2 ring-primary-20" : ""}`}
                        style={{
                          height: `${pageScaledThumbHeight + footerHeight + wrapperVerticalPadding}px`,
                          overflow: "visible",
                          opacity: shouldHide ? 0 : 1,
                          visibility: shouldHide ? "hidden" : "visible",
                          pointerEvents: shouldHide ? "none" : "auto",
                          contain: "layout paint",
                          transition: "opacity 180ms ease-out, visibility 180ms ease-out, box-shadow 180ms ease-out, transform 180ms ease-out",
                        }}
                        role="listitem"
                        aria-selected={page.selected}
                      >
                        {!isRotateMode && (
                          <div className="absolute left-3 top-3 z-10">
                            <input type="checkbox" checked={page.selected} onChange={() => toggleSelect(effectiveIndex)} className="h-4 w-4 rounded border-border accent-primary" />
                          </div>
                        )}

                        <div className={`absolute right-3 top-3 z-10 flex max-w-[calc(100%-3rem)] flex-wrap justify-end gap-1.5 transition-opacity ${showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePagePreview(page.id);
                            }}
                            title={zoomedPageId === page.id ? "Close preview" : "Preview page"}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/95 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
                          >
                            <Eye size={16} />
                          </button>
                          {enableRotateControls && (
                            <>
                              <button type="button" onClick={(e) => { e.stopPropagation(); onRotate([effectiveIndex], -90); }} title="Rotate left" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/95 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"><RotateCcw size={15} /></button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); onRotate([effectiveIndex], 90); }} title="Rotate right" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/95 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"><RotateCw size={15} /></button>
                            </>
                          )}
                          {!isRotateMode && allowPerCardDelete && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); onDelete([page.id]); }} title="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/95 text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground active:scale-95"><Trash2 size={15} /></button>
                          )}
                        </div>

                        <div className="flex h-full flex-col justify-between">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-[18px] border border-border/40 bg-background/60 p-1" style={{ width: "100%", height: `${pageScaledThumbHeight}px` }}>
                            {dragIndex === index && <div className="absolute inset-0 bg-primary/10" />}
                            {thumbnailUrl ? (
                              <div
                                className="relative flex w-full items-center justify-center"
                                style={{
                                  height: `${pageInnerThumbHeight}px`,
                                  transform: `rotate(${page.rotation}deg)`,
                                  transformOrigin: "center center",
                                  zIndex: isPreviewZoomed ? 30 : 1,
                                  willChange: "transform",
                                  transition: "transform 180ms ease-out",
                                  cursor: "grab",
                                }}
                              >
                                <img
                                  src={thumbnailUrl}
                                  alt={`Page ${page.pageNumber}`}
                                  className="max-h-full max-w-full rounded-[14px] bg-white object-contain shadow-sm dark:bg-slate-950"
                                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                  onLoad={(e) => {
                                    try {
                                      const natW = (e.currentTarget as HTMLImageElement).naturalWidth || 1;
                                      const natH = (e.currentTarget as HTMLImageElement).naturalHeight || 1;
                                      const ratio = natH / natW;
                                      if (ratio && Math.abs((thumbRatios[page.id] || 0) - ratio) > 0.01) {
                                        setThumbRatios((prev) => ({ ...prev, [page.id]: ratio }));
                                      }
                                    } catch {}
                                  }}
                                />
                              </div>
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
