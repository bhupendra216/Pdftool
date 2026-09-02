import { useState, useRef } from "react";
import { UploadCloud, File, X, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  onError?: (message: string) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  compact?: boolean;
}

export function UploadArea({
  onFilesSelected,
  onError,
  multiple = true,
  accept = "application/pdf",
  maxSizeMB = 50,
  label = "PDF file",
  description = "or drop PDF here.",
  compact = false,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseAcceptTypes = () => {
    return accept
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  };

  const isAcceptableFile = (file: File) => {
    const acceptTypes = parseAcceptTypes();
    if (acceptTypes.length === 0) return true;

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return acceptTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileName.endsWith(type);
      }
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.replace("/*", ""));
      }
      return fileType === type;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (!isAcceptableFile(file)) {
        onError?.(`File ${file.name} is not a supported file type.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        onError?.(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB.`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative rounded-[28px] border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center justify-center text-center bg-card/90 shadow-sm backdrop-blur-sm
        ${compact ? 'p-4 md:p-6' : 'p-6 md:p-14'}
        ${isDragging ? 'border-primary bg-primary/5 shadow-[0_24px_80px_-40px_rgba(59,130,246,0.45)] scale-[1.01]' : 'border-border/80 hover:border-primary/50 hover:bg-secondary/20'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInput}
        multiple={multiple}
        accept={accept}
      />
      
      <div className={`rounded-full transition-all duration-300 ${compact ? 'mb-3 p-2 md:p-3' : 'mb-6 p-3 md:p-5'} ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary/10 text-primary'}`}>
        <UploadCloud className={compact ? 'w-6 h-6 md:w-7 md:h-7' : 'w-10 h-10'} />
      </div>
      
      <h3 className={`font-semibold tracking-tight text-foreground ${compact ? 'text-lg md:text-xl mb-2' : 'text-2xl md:text-3xl mb-3'}`}>
        Select {label}{multiple ? 's' : ''}
      </h3>
      <p className={`text-muted-foreground leading-relaxed max-w-md ${compact ? 'text-xs md:text-sm mb-4' : 'text-sm md:text-base mb-8'}`}>
        {description} Maximum file size is {maxSizeMB}MB.
      </p>
      
      <Button 
        size={compact ? 'default' : 'lg'} 
        className={compact ? 'h-10 rounded-full px-5 text-sm' : 'rounded-full px-8 text-base md:text-lg h-12 md:h-14 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all'}
        onClick={() => fileInputRef.current?.click()}
      >
        Select Files
      </Button>
    </div>
  );
}
