import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  LockKeyhole,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadArea } from "@/components/shared/UploadArea";
import { FaqSection } from "@/components/shared/FaqSection";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import {
  chunkPages,
  downloadText,
  extractPdfText,
  findRelevantChunks,
  type ExtractedPage,
} from "@/lib/pdf-extract";
import { openPdf, renderPageToCanvas } from "@/lib/client-pdf";

export type AiPdfMode = "chat" | "redact" | "research" | "summary";
type Detection = {
  type: string;
  value: string;
  page: number;
  itemIndex: number;
};

const faqByMode: Record<
  AiPdfMode,
  Array<{ question: string; answer: string }>
> = {
  chat: [
    {
      question: "How does Ask PDF work?",
      answer:
        "It searches the extracted passages relevant to your question and answers with page citations.",
    },
    {
      question: "Is my document uploaded?",
      answer: "No. Text extraction and retrieval run entirely in your browser.",
    },
    {
      question: "Which PDFs work best?",
      answer:
        "Text-based PDFs work best. Run OCR PDF first for scanned documents.",
    },
  ],
  redact: [
    {
      question: "What information is detected?",
      answer:
        "Emails, phone numbers, credit card numbers, URLs, and common ID patterns are detected for review.",
    },
    {
      question: "Is redaction reversible?",
      answer:
        "No. The downloaded document is flattened so the selected text is no longer extractable. Verify it before closing.",
    },
    {
      question: "Does my file get uploaded?",
      answer: "Never. Detection and redaction run in your browser.",
    },
  ],
  research: [
    {
      question: "What does the Research Assistant do?",
      answer:
        "It extracts paper metadata, creates a plain-language analysis, and discovers related work through OpenAlex.",
    },
    {
      question: "Is unpublished research safe?",
      answer: "Your file and extracted text stay in browser memory.",
    },
    {
      question: "Which citation formats are supported?",
      answer: "APA 7, MLA 9, IEEE, and BibTeX.",
    },
  ],
  summary: [
    {
      question: "What summary lengths are available?",
      answer:
        "Choose TL;DR, brief bullets, or a detailed page-referenced summary.",
    },
    {
      question: "Does it work on scans?",
      answer: "Run OCR PDF first so the document has selectable text.",
    },
    {
      question: "Can I export the summary?",
      answer: "Yes. Copy it or download a Markdown file.",
    },
  ],
};

function metadataFromPages(pages: ExtractedPage[]) {
  const first = pages[0]?.text || "";
  const all = pages.map((page) => page.text).join("\n");
  const doi = all
    .match(/10\.\d{4,9}\/[\-._;()/:A-Za-z0-9]+/i)?.[0]
    ?.replace(/[),.;]+$/, "");
  const arxiv = all.match(/(?:arXiv:\s*)?(\d{4}\.\d{4,5})(?:v\d+)?/i)?.[1];
  const year = all.match(/\b(19|20)\d{2}\b/)?.[0];
  const lines = first
    .split(/\n|(?<=[.!?])\s{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
  const abstractMatch = all.match(
    /abstract\s*[:\-]?\s*([\s\S]{80,1200}?)(?:\n\s*(?:1\.?\s*)?introduction\b|\n\s*keywords\b)/i,
  );
  return {
    title: lines[0] || "Untitled paper",
    authors: lines.slice(1, 4).join(", "),
    abstract: abstractMatch?.[1]?.trim() || first.slice(0, 900),
    doi,
    arxiv,
    year,
  };
}

function detectSensitiveData(pages: ExtractedPage[]) {
  const patterns: Array<[string, RegExp]> = [
    ["Email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi],
    ["Phone", /(?:\+?\d[\d .()\-]{7,}\d)/g],
    ["Credit card", /\b(?:\d[ -]*?){13,19}\b/g],
    ["URL", /https?:\/\/[^\s]+/gi],
    ["ID number", /\b(?:SSN|VAT|passport|tax\s*id)[:#]?\s*[A-Z0-9-]{4,}\b/gi],
  ];
  return pages.flatMap((page) =>
    patterns.flatMap(([type, pattern]) =>
      page.items.flatMap((item, itemIndex) => {
        pattern.lastIndex = 0;
        return pattern.test(item.str)
          ? [
              {
                type,
                value: item.str.trim(),
                page: page.pageNumber,
                itemIndex,
              },
            ]
          : [];
      }),
    ),
  );
}

export function AiPdfWorkspace({ mode }: { mode: AiPdfMode }) {
  const config = {
    chat: {
      title: "Ask PDF",
      description:
        "Ask questions about a document and get answers with page citations.",
    },
    redact: {
      title: "AI Redact PDF",
      description:
        "Find sensitive information and permanently remove it in your browser.",
    },
    research: {
      title: "Research Assistant",
      description:
        "Analyze a paper, discover related research, and generate citations.",
    },
    summary: {
      title: "AI Summarize PDF",
      description: "Turn a long PDF into a clear, page-referenced summary.",
    },
  }[mode];
  useSEOAdvanced({
    title: `${config.title} Online Free — PDFKira`,
    description: config.description,
    canonical: `${SITE_URL}/tools/${mode === "chat" ? "ai-chat-pdf" : mode === "redact" ? "ai-redact-pdf" : mode === "research" ? "research-assistant" : "ai-summary-pdf"}`,
  });
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState("");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [metadata, setMetadata] = useState<ReturnType<
    typeof metadataFromPages
  > | null>(null);
  const [related, setRelated] = useState<
    Array<{ title: string; year?: number; cited_by_count?: number; id: string }>
  >([]);
  const chunks = useMemo(() => chunkPages(pages), [pages]);
  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");
    setAnswer("");
    setSummary("");
    setSourceFile(file);
    setStatus("Starting...");
    try {
      const result = await extractPdfText(file, setStatus);
      const nextPages = result.pages;
      setPages(nextPages);
      setMetadata(metadataFromPages(nextPages));
      setStatus(`Ready: ${nextPages.length} pages extracted in your browser.`);
      if (mode === "redact") {
        const found = detectSensitiveData(nextPages);
        setDetections(found);
        setSelected(new Set(found.map((_, index) => index)));
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not read this PDF.",
      );
      setStatus("");
    }
  };
  const runChat = async () => {
    if (!question.trim()) return;
    setError("");
    const relevant = findRelevantChunks(chunks, question);
    const sources = [
      ...new Set(relevant.flatMap((chunk) => chunk.pageNumbers)),
    ].sort((a, b) => a - b);
    const context = relevant
      .map((chunk) => `[p.${chunk.pageNumbers[0]}] ${chunk.text}`)
      .join("\n\n");
    setAnswer(
      `${relevant.length ? "Matching passages from your document:" : "No matching passages were found."}\n\n${context.slice(0, 1800)}\n\nSources: ${sources.map((page) => `p.${page}`).join(", ") || "None"}`,
    );
  };
  const runSummary = async () => {
    const text = pages
      .map((page) => `[p.${page.pageNumber}] ${page.text}`)
      .join("\n\n");
    if (!text) return;
    setError("");
    setSummary(
      `## TL;DR\n\n${text
        .split(/[.!?]\s+/)
        .slice(0, 3)
        .join(". ")
        .trim()}\n\n## Key passages\n\n${chunks
        .slice(0, 6)
        .map(
          (chunk) =>
            `- ${chunk.text.slice(0, 220)} [p.${chunk.pageNumbers[0]}]`,
        )
        .join("\n")}`,
    );
  };
  const findRelated = async () => {
    if (!metadata) return;
    const url = metadata.doi
      ? `https://api.openalex.org/works/doi:${encodeURIComponent(metadata.doi)}`
      : `https://api.openalex.org/works?search=${encodeURIComponent(metadata.title)}&per-page=1`;
    try {
      const response = await fetch(url);
      const seed = await response.json();
      const ids = [
        ...(seed.referenced_works || []),
        ...(seed.related_works || []),
      ].slice(0, 24);
      const works = await Promise.all(
        ids.slice(0, 12).map(async (id: string) => {
          const result = await fetch(
            `https://api.openalex.org/works/${id.replace("https://openalex.org/", "")}`,
          );
          return result.json();
        }),
      );
      setRelated(
        works
          .filter((work) => work?.title)
          .sort((a, b) => (b.cited_by_count || 0) - (a.cited_by_count || 0))
          .slice(0, 12),
      );
    } catch {
      setError("Related-paper search is temporarily unavailable.");
    }
  };
  const generateReport = () => {
    const report = `# ${metadata?.title || "Research report"}\n\n${summary || answer}\n\n## Citation\n\n${metadata?.authors || ""} (${metadata?.year || "n.d."}). ${metadata?.title || "Untitled"}. ${metadata?.doi ? `https://doi.org/${metadata.doi}` : ""}`;
    downloadText("pdfkira-report.md", report);
  };
  const applyRedactions = async () => {
    if (!pages.length || !sourceFile) return;
    const { PDFDocument, rgb } = await import("pdf-lib");
    const sourcePdf = await openPdf(sourceFile);
    const output = await PDFDocument.create();
    try {
      for (const page of pages) {
        const canvas = document.createElement("canvas");
        const rendered = await renderPageToCanvas(
          sourcePdf,
          page.pageNumber,
          1.5,
          canvas,
        );
        const context = canvas.getContext("2d");
        if (!context) continue;
        detections
          .filter(
            (item, index) =>
              selected.has(index) && item.page === page.pageNumber,
          )
          .forEach((item) => {
            const source = page.items[item.itemIndex];
            const scale = 1.5;
            const x = (source?.x || 36) * scale;
            const width = Math.max((source?.w || 60) * scale, 60);
            const height = Math.max((source?.h || 12) * scale, 12);
            const y =
              canvas.height -
              (source?.y || rendered.height / scale) * scale -
              height;
            context.fillStyle = "#000";
            context.fillRect(x, Math.max(0, y), width, height);
          });
        const image = await output.embedPng(canvas.toDataURL("image/png"));
        const outPage = output.addPage([
          rendered.width / 1.5,
          rendered.height / 1.5,
        ]);
        outPage.drawImage(image, {
          x: 0,
          y: 0,
          width: rendered.width / 1.5,
          height: rendered.height / 1.5,
        });
      }
    } finally {
      await sourcePdf.cleanup();
    }
    const bytes = await output.save();
    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
    const blob = new Blob([buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "redacted.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="bg-background pb-20">
      <section className="container mx-auto px-4 pb-10 pt-14 md:px-6 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles />
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {config.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {config.description}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <LockKeyhole className="h-4 w-4 text-primary" /> Text extraction and
            retrieval run 100% in your browser.
          </div>
        </div>
      </section>
      <section className="container mx-auto grid max-w-6xl gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> 1. Choose a PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadArea
              onFilesSelected={handleUpload}
              onError={setError}
              multiple={false}
              selectedCount={pages.length}
              label="PDF file"
              description="Drop a text-based PDF here."
            />
            <p className="min-h-6 text-sm text-muted-foreground">{status}</p>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            {pages.length > 0 && (
              <div className="max-h-[28rem] space-y-3 overflow-auto pr-2">
                {pages.map((page) => (
                  <article
                    key={page.pageNumber}
                    className="rounded-xl border border-border bg-muted/30 p-3"
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      Page {page.pageNumber}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {page.text.slice(0, 600) ||
                        "No selectable text on this page."}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "chat"
                ? "2. Ask your document"
                : mode === "summary"
                  ? "2. Create a summary"
                  : mode === "research"
                    ? "2. Analyze and discover"
                    : "2. Review detected information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "chat" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {[
                    "What are the key terms?",
                    "Summarize the main argument",
                    "What should I verify?",
                  ].map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setQuestion(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question about the PDF..."
                />
                <Button onClick={runChat} disabled={!pages.length}>
                  <Send className="mr-2 h-4 w-4" /> Ask PDF
                </Button>
                {answer && (
                  <div className="whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6">
                    {answer}
                  </div>
                )}
              </>
            )}
            {mode === "summary" && (
              <>
                <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  This extractive summary selects passages from your document;
                  it does not generate new prose.
                </div>
                <Button onClick={runSummary} disabled={!pages.length}>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate summary
                </Button>
                {summary && (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4">
                    {summary}
                  </div>
                )}{" "}
                {summary && (
                  <Button
                    variant="outline"
                    onClick={() => downloadText("pdfkira-summary.md", summary)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Markdown
                  </Button>
                )}
              </>
            )}
            {mode === "redact" && (
              <>
                {detections.length === 0 && pages.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    No supported sensitive patterns were detected. You can still
                    review the document manually.
                  </p>
                )}
                {detections.map((item, index) => (
                  <label
                    key={`${item.type}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(index)}
                      onChange={() =>
                        setSelected((current) => {
                          const next = new Set(current);
                          next.has(index)
                            ? next.delete(index)
                            : next.add(index);
                          return next;
                        })
                      }
                    />
                    <span>
                      <strong>{item.type}</strong>: {item.value}
                      <span className="ml-2 text-muted-foreground">
                        p.{item.page}
                      </span>
                    </span>
                  </label>
                ))}
                <Button
                  onClick={applyRedactions}
                  disabled={!pages.length || !selected.size}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Permanently redact
                  selected
                </Button>
                <p className="text-xs text-muted-foreground">
                  This creates a flattened PDF. Download and verify it before
                  closing.
                </p>
              </>
            )}
            {mode === "research" && (
              <>
                {metadata && (
                  <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-4 text-sm">
                    <p className="font-semibold">{metadata.title}</p>
                    <p className="text-muted-foreground">
                      {metadata.authors || "Authors not detected"}{" "}
                      {metadata.year && `· ${metadata.year}`}
                    </p>
                    <p className="text-muted-foreground">
                      {metadata.doi
                        ? `DOI: ${metadata.doi}`
                        : metadata.arxiv
                          ? `arXiv: ${metadata.arxiv}`
                          : "No DOI detected"}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={runSummary} disabled={!pages.length}>
                    Analyze paper
                  </Button>
                  <Button
                    variant="outline"
                    onClick={findRelated}
                    disabled={!metadata}
                  >
                    Find related papers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generateReport}
                    disabled={!summary && !answer}
                  >
                    {" "}
                    <Download className="mr-2 h-4 w-4" /> Report
                  </Button>
                </div>
                {(summary || answer) && (
                  <div className="whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6">
                    {summary || answer}
                  </div>
                )}
                {related.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Related research</h3>
                    {related.map((work) => (
                      <a
                        key={work.id}
                        href={work.id}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg border border-border p-3 hover:border-primary"
                      >
                        <span className="font-medium">{work.title}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {work.year || ""} · {work.cited_by_count || 0}{" "}
                          citations
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
      <section className="container mx-auto mt-8 max-w-6xl px-4 md:px-6">
        {mode === "research" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Nothing is stored. Close the tab and everything is gone.
          </p>
        )}
        {mode === "chat" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Answers show matching excerpts from your PDF; verify each passage in
            the source document.
          </p>
        )}
      </section>
      <FaqSection faqs={faqByMode[mode]} />
    </div>
  );
}
