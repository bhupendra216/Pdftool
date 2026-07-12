import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { PDFDocument } from "pdf-lib";
import { useGetTool, useGetBlogPost } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/use-seo";
import { UploadArea } from "@/components/shared/UploadArea";
import { FilePreviewList } from "@/components/shared/FilePreviewList";
import { FaqSection } from "@/components/shared/FaqSection";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Settings2, Download, AlertCircle, Badge } from "lucide-react";

export function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tool, isLoading, isError } = useGetTool(slug);
  const { data: blogPost } = useGetBlogPost(tool?.blogSlug || "", {
    query: { enabled: !!tool?.blogSlug },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "options" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("processed.pdf");
  const [pageRange, setPageRange] = useState("");
  const [pageRangeError, setPageRangeError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const allowsMultipleFiles = tool?.slug === "merge-pdf";
  const requiredFileCount = allowsMultipleFiles ? 2 : 1;

  const actionLabel = tool?.slug === "merge-pdf"
    ? "Merge PDF"
    : tool?.slug === "split-pdf"
    ? "Split PDF"
    : tool?.slug === "compress-pdf"
    ? "Compress PDF"
    : tool?.slug === "rotate-pdf"
    ? "Rotate PDF"
    : tool?.slug === "unlock-pdf"
    ? "Unlock PDF"
    : tool?.slug === "protect-pdf"
    ? "Protect PDF"
    : tool?.slug === "watermark-pdf"
    ? "Watermark PDF"
    : tool?.slug === "add-page-numbers"
    ? "Add Page Numbers"
    : "Process PDF";

  const buttonLabel = status === "options" ? actionLabel : "Process PDF";
  const canProcess = files.length >= requiredFileCount;
  const uploadHint = allowsMultipleFiles
    ? `Upload ${requiredFileCount}+ PDF files to ${actionLabel.toLowerCase()}.`
    : `Upload a single PDF file to ${actionLabel.toLowerCase()}.`;

  // Reset state when slug changes
  useEffect(() => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
    setDownloadFileName("processed.pdf");
  }, [slug]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const mergePdfOnServer = async (filesToMerge: File[]): Promise<Blob> => {
    const formData = new FormData();
    filesToMerge.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/merge-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Merge failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const parsePageRangeInput = (input: string, total: number): number[] => {
    if (!input || input.trim() === "") throw new Error("Empty input");
    const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) throw new Error("Empty input");

    const indices: number[] = [];
    for (const part of parts) {
      const rangeMatch = part.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const a = parseInt(rangeMatch[1], 10);
        const b = parseInt(rangeMatch[2], 10);
        if (isNaN(a) || isNaN(b)) throw new Error("Invalid syntax");
        if (a < 1) throw new Error("Page numbers must be >= 1");
        if (b < a) throw new Error("Range start must be <= range end");
        if (b > total) throw new Error("Page number exceeds total pages");
        for (let i = a; i <= b; i++) indices.push(i - 1);
        continue;
      }

      const numMatch = part.match(/^(\d+)$/);
      if (numMatch) {
        const n = parseInt(numMatch[1], 10);
        if (isNaN(n)) throw new Error("Invalid syntax");
        if (n < 1) throw new Error("Page numbers must be >= 1");
        if (n > total) throw new Error("Page number exceeds total pages");
        indices.push(n - 1);
        continue;
      }

      throw new Error("Invalid syntax");
    }

    return indices;
  };

  const splitPdfOnServer = async (fileToSplit: File, range: string): Promise<Blob> => {
    const formData = new FormData();
    formData.append("files", fileToSplit);
    formData.append("pageRange", range);

    const response = await fetch("/api/split-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      throw new Error(text || `Split failed with HTTP ${response.status}`);
    }

    return await response.blob();
  };

  const prepareLocalDownload = async (): Promise<void> => {
    const rawFile = files[0];
    const baseName = rawFile.name.replace(/\.[^/.]+$/, "");
    let outputName = `${baseName}-${tool?.slug}.pdf`;

    switch (tool?.slug) {
      case "split-pdf":
        outputName = `${baseName}-split.pdf`;
        break;
      case "compress-pdf":
        outputName = `${baseName}-compressed.pdf`;
        break;
      case "rotate-pdf":
        outputName = `${baseName}-rotated.pdf`;
        break;
      case "unlock-pdf":
        outputName = `${baseName}-unlocked.pdf`;
        break;
      case "protect-pdf":
        outputName = `${baseName}-protected.pdf`;
        break;
      case "watermark-pdf":
        outputName = `${baseName}-watermarked.pdf`;
        break;
      case "add-page-numbers":
        outputName = `${baseName}-numbered.pdf`;
        break;
      default:
        outputName = `${baseName}-${tool?.slug}.pdf`;
    }

    const blob = new Blob([await rawFile.arrayBuffer()], {
      type: rawFile.type || "application/pdf",
    });

    setDownloadUrl(URL.createObjectURL(blob));
    setDownloadFileName(outputName);
  };

  useSEO({
    title: tool?.seoTitle || "Loading...",
    description: tool?.seoDescription || "PDF tool"
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !tool) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Tool not found</h1>
        <p className="text-xl text-muted-foreground mb-8">We couldn't find the tool you're looking for.</p>
        <Button asChild><Link href="/tools">Back to All Tools</Link></Button>
      </div>
    );
  }

  const isComingSoon = tool.status === "comingSoon";

  const handleFilesSelected = (newFiles: File[]) => {
    if (!allowsMultipleFiles) {
      const first = newFiles[0];
      setFiles([first]);
      if (tool?.slug === "split-pdf") {
        (async () => {
          try {
            const bytes = await first.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            setTotalPages(pdf.getPageCount());
            setPageRangeError(null);
          } catch (e) {
            setTotalPages(null);
            setPageRangeError("Unable to read PDF pages for validation");
          }
        })();
      }
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }
    setStatus("options");
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      if (updated.length === 0) {
        setStatus("idle");
      }
      return updated;
    });
  };

  const handleProcess = async () => {
    if (!canProcess || !tool) return;

    setStatus("processing");
    setProgress(0);
    setDownloadUrl(null);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(99, prev + Math.floor(Math.random() * 15) + 5));
    }, 400);

    try {
      let blob: Blob;
      let outputName = "processed.pdf";

      if (tool.slug === "merge-pdf") {
        blob = await mergePdfOnServer(files);
        outputName = "merged.pdf";
      } else if (tool.slug === "split-pdf") {
        // Validate page range before sending
        try {
          if (!pageRange || pageRange.trim() === "") throw new Error("Empty input");
          if (!totalPages) throw new Error("Unable to read PDF pages");
          parsePageRangeInput(pageRange, totalPages);
        } catch (err: any) {
          setPageRangeError(err.message || "Invalid page range");
          setStatus("options");
          clearInterval(interval);
          return;
        }

        blob = await splitPdfOnServer(files[0], pageRange);
        outputName = files[0].name.replace(/\.[^/.]+$/, "") + `-split.pdf`;
      } else {
        const rawFile = files[0];
        outputName = rawFile.name.replace(/\.[^/.]+$/, "") + `-${tool.slug}.pdf`;
        blob = new Blob([await rawFile.arrayBuffer()], {
          type: rawFile.type || "application/pdf",
        });
      }

      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadFileName(outputName);
      setStatus("success");
      setProgress(100);
    } catch (error) {
      console.error(error);
      setStatus("options");
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb & Header */}
      <div className="bg-card border-b border-border pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-8">
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground">{tool.name}</span>
          </nav>
          
          <div className="flex items-center gap-5 mb-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-sm">
              <Icon name={tool.icon} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
                {tool.name}
                {isComingSoon && (
                  <span className="text-sm font-medium px-3 py-1 bg-muted text-muted-foreground rounded-full border">
                    Coming Soon
                  </span>
                )}
              </h1>
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl ml-[72px]">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl flex-1">
        
        {isComingSoon ? (
          <div className="bg-secondary/30 rounded-3xl p-12 text-center border border-border">
            <div className="w-20 h-20 bg-secondary text-primary mx-auto rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">We're working on this tool</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              This feature is currently in development and will be available soon. Check back later!
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-3xl shadow-sm border border-border p-6 md:p-10 transition-all">
            
            {status === "idle" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UploadArea
                  onFilesSelected={handleFilesSelected}
                  multiple={allowsMultipleFiles}
                />
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  {uploadHint}
                </p>
              </div>
            )}

            {status === "options" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <FilePreviewList 
                    files={files} 
                    onRemove={handleRemoveFile} 
                    status="idle" 
                  />
                  {tool.slug === "split-pdf" && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Page ranges</label>
                      <input
                        value={pageRange}
                        onChange={(e) => { setPageRange(e.target.value); setPageRangeError(null); }}
                        placeholder="e.g. 1-3,5,7-9"
                        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
                        aria-label="Page ranges"
                      />
                      {pageRangeError && (
                        <p className="text-sm text-destructive mt-2">{pageRangeError}</p>
                      )}
                      {totalPages && (
                        <p className="text-xs text-muted-foreground mt-2">PDF has {totalPages} page{totalPages>1? 's':''}.</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-8 flex gap-4">
                    <Button variant="outline" onClick={() => setStatus("idle")} className="flex-1 rounded-xl h-12">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Add More
                    </Button>
                    <Button
                      onClick={handleProcess}
                      className="flex-[2] rounded-xl h-12 text-lg shadow-md shadow-primary/20"
                      disabled={!canProcess}
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                </div>
                
                <div className="w-full md:w-80 bg-background border rounded-2xl p-6 h-fit shrink-0">
                  <div className="flex items-center gap-2 mb-6 font-semibold pb-4 border-b">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Options
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    In a real implementation, tool-specific options would appear here (e.g., compression level, page ranges to extract).
                  </p>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <div className="h-10 bg-secondary rounded-lg w-full"></div>
                    <div className="h-10 bg-secondary rounded-lg w-full"></div>
                    <div className="h-10 bg-secondary rounded-lg w-2/3"></div>
                  </div>
                </div>
              </div>
            )}

            {status === "processing" && (
              <div className="py-20 text-center animate-in fade-in duration-500 max-w-md mx-auto">
                <Icon name={tool.icon} className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
                <h3 className="text-2xl font-bold mb-6">Processing your files...</h3>
                <Progress value={progress} className="h-3 mb-4" />
                <p className="text-muted-foreground font-medium">{progress}% Complete</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-12 text-center animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Download className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">Task Complete!</h3>
                <p className="text-lg text-muted-foreground mb-10">Your files have been processed successfully and are ready to download.</p>
                
                <Button
                  size="lg"
                  className="w-full rounded-2xl h-16 text-lg mb-6 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform"
                  asChild
                  disabled={!downloadUrl}
                >
                  <a href={downloadUrl ?? "#"} download={downloadFileName}>
                    Download Processed File
                  </a>
                </Button>

                <Button variant="ghost" onClick={() => { setStatus("idle"); setFiles([]); setDownloadUrl(null); }} className="text-muted-foreground">
                  Start Over
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How it works */}
      {tool.steps && tool.steps.length > 0 && (
        <section className="py-20 bg-card border-t border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How to {tool.name.toLowerCase()}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {tool.steps.map((step, index) => (
                <div key={index} className="relative pt-6">
                  <div className="absolute top-0 left-0 w-10 h-10 bg-secondary text-primary font-bold rounded-xl flex items-center justify-center -mt-5 shadow-sm border border-background">
                    {index + 1}
                  </div>
                  <Card className="h-full border-none shadow-none bg-background">
                    <CardContent className="p-6 pt-8">
                      <p className="text-muted-foreground leading-relaxed">{step}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {tool.faqs && tool.faqs.length > 0 && (
        <FaqSection faqs={tool.faqs} title={`${tool.name} FAQ`} />
      )}

      {/* Related Blog Post */}
      {blogPost && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 mb-6 border-none">
              Featured Guide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              {blogPost.excerpt}
            </p>
            <Button variant="secondary" size="lg" asChild className="rounded-full px-8 text-primary">
              <Link href={`/blog/${blogPost.slug}`}>Read the Full Guide</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
