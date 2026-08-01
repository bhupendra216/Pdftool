import { Button } from "@/components/ui/button";
import { X, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  status: "idle" | "options" | "processing" | "success";
}

export function FilePreviewList({ files, onRemove, status }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-3 mt-8">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
        Selected Files ({files.length})
      </h4>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="group relative flex items-center gap-4 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="shrink-0 rounded-xl bg-primary/10 p-0 overflow-hidden transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <img src="/kira.jpeg" alt="PDFKira" className="w-10 h-10 object-cover rounded-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground" title={file.name}>
                {file.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>
            
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
        ))}
      </div>
    </div>
  );
}
