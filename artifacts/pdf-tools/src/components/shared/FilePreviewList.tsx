import { Button } from "@/components/ui/button";
import { X, CheckCircle2, GripVertical } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function reorderFiles<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (!Array.isArray(items) || items.length < 2) return items;
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return items;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items;
  if (fromIndex === toIndex) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) return items;
  next.splice(toIndex, 0, moved);
  return next;
}

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  status: "idle" | "options" | "processing" | "success";
}

export function FilePreviewList({ files, onRemove, onReorder, status }: FileListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragSourceRef = useRef<number | null>(null);

  useEffect(() => {
    if (draggedIndex === null) return;

    const handlePointerMove = (event: PointerEvent) => {
      const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      const card = target?.closest<HTMLElement>("[data-file-index]");
      if (!card) return;
      const currentIndex = Number(card.dataset.fileIndex);
      if (Number.isFinite(currentIndex) && currentIndex !== draggedIndex) {
        setDropIndex(currentIndex);
      }
    };

    const handlePointerUp = () => {
      if (draggedIndex !== null && dropIndex !== null && dropIndex !== draggedIndex && onReorder) {
        onReorder(draggedIndex, dropIndex);
      }
      setDraggedIndex(null);
      setDropIndex(null);
      dragSourceRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggedIndex, dropIndex, onReorder]);

  const handleMouseDrop = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || !onReorder) return;
    onReorder(fromIndex, toIndex);
    setDraggedIndex(null);
    setDropIndex(null);
    dragSourceRef.current = null;
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-3 mt-8">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Selected Files ({files.length})
      </h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => {
          const isDropTarget = dropIndex === index && draggedIndex !== index;
          const isDragging = draggedIndex === index;

          return (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              data-file-index={index}
              draggable={!!onReorder}
              onDragStart={(event) => {
                if (!onReorder) return;
                dragSourceRef.current = index;
                setDraggedIndex(index);
                setDropIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
              }}
              onDragOver={(event) => {
                if (!onReorder) return;
                event.preventDefault();
                if (draggedIndex !== null && draggedIndex !== index) {
                  setDropIndex(index);
                }
              }}
              onDrop={(event) => {
                if (!onReorder) return;
                event.preventDefault();
                const raw = event.dataTransfer.getData("text/plain");
                const sourceIndex = Number(raw);
                if (Number.isFinite(sourceIndex)) {
                  handleMouseDrop(sourceIndex, index);
                } else if (dragSourceRef.current !== null) {
                  handleMouseDrop(dragSourceRef.current, index);
                }
              }}
              onPointerDown={(event) => {
                if (!onReorder) return;
                if ((event.target as HTMLElement).closest("button")) return;
                if (event.pointerType === "touch" || event.pointerType === "pen") {
                  dragSourceRef.current = index;
                  setDraggedIndex(index);
                  setDropIndex(index);
                }
              }}
              className={[
                "group relative flex items-center gap-4 rounded-2xl border bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                isDragging ? "opacity-70 ring-2 ring-primary/40" : "border-border/70",
                isDropTarget ? "border-primary bg-primary/5" : "",
              ].join(" ")}
              style={{ touchAction: "none" }}
            >
              {isDropTarget && (
                <div className="absolute inset-x-2 -top-1 h-1 rounded-full bg-primary shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" />
              )}

              <div className="shrink-0 rounded-xl bg-primary/10 p-0 overflow-hidden transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <img src="/logo.png" alt="PDFKira" className="w-10 h-10 object-cover rounded-lg" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground" title={file.name}>{file.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>

              {onReorder && (
                <div className="shrink-0 rounded-xl border border-border/70 bg-background/80 p-1 text-muted-foreground cursor-grab active:cursor-grabbing" aria-label={`Drag ${file.name}`}>
                  <GripVertical className="w-4 h-4" />
                </div>
              )}

              {status === "idle" || status === "options" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-7 w-7 rounded-full border border-border/70 bg-background/95 opacity-0 shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive group-hover:opacity-100"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : null}

              {status === "success" && (
                <div className="mr-2 shrink-0 text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
