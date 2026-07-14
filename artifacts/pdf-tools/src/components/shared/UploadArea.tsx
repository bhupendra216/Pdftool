import { useState, useRef } from "react";
import { UploadCloud, File, X, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
}

export function UploadArea({
  onFilesSelected,
  multiple = true,
  accept = "application/pdf",
  maxSizeMB = 50,
  label = "PDF file",
  description = "or drop PDF here.",
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
        alert(`File ${file.name} is not a supported file type.`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB.`);
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
      className={`relative rounded-3xl border-2 border-dashed transition-all duration-200 ease-in-out p-10 md:p-16 flex flex-col items-center justify-center text-center bg-card
        ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-secondary/20'}`}
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
      
      <div className={`p-5 rounded-full mb-6 transition-colors duration-300 ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-secondary text-primary'}`}>
        <UploadCloud className="w-10 h-10" />
      </div>
      
      <h3 className="text-2xl font-bold mb-3">
        Select {label}{multiple ? 's' : ''}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-sm">
        {description} Maximum file size is {maxSizeMB}MB.
      </p>
      
      <Button 
        size="lg" 
        className="rounded-full px-8 text-lg h-14 shadow-lg hover:shadow-xl transition-all"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Files
      </Button>
    </div>
  );
}
