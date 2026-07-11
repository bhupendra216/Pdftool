import { Button } from "@/components/ui/button";
import { X, FileText, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  status: "idle" | "processing" | "success";
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
            className="flex items-center gap-4 bg-background border border-border p-4 rounded-2xl shadow-sm relative group"
          >
            <div className="p-3 bg-secondary text-primary rounded-xl shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatBytes(file.size)}
              </p>
            </div>
            
            {status === "idle" && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 w-7 h-7 bg-background border border-border shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            {status === "success" && (
              <div className="text-green-500 mr-2 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
