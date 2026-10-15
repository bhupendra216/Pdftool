import { useState } from "react";
import {
  Download,
  FileText,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadArea } from "@/components/shared/UploadArea";
import { FaqSection } from "@/components/shared/FaqSection";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import {
  downloadText,
  extractPdfText,
  type ExtractedPage,
} from "@/lib/pdf-extract";

export type AiToolsMode = "review" | "translate" | "quiz" | "invoice";
type Issue = {
  category: string;
  severity: string;
  page: number;
  quote: string;
  suggestion: string;
};
type QuizItem = {
  question: string;
  answer: string;
  explanation: string;
  page_reference: number;
};
type Invoice = {
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  tax: string;
  total: string;
};

const faqs: Record<AiToolsMode, Array<{ question: string; answer: string }>> = {
  review: [
    {
      question: "What can it review?",
      answer:
        "It checks common spelling and formatting issues in resumes, essays, business documents, and general writing.",
    },
    {
      question: "Does it use a language model?",
      answer:
        "No. These are local rule-based checks and do not assess deeper writing style.",
    },
  ],
  translate: [
    {
      question: "Can I translate a scanned PDF?",
      answer: "Run OCR PDF first so the page text can be extracted.",
    },
    {
      question: "Is translation available here?",
      answer:
        "Not currently. This page does not send documents or text to a translation service.",
    },
  ],
  quiz: [
    {
      question: "How are questions created?",
      answer:
        "The current version selects long sentences from the extracted PDF text. It does not generate new questions with a language model.",
    },
    {
      question: "Can I import the cards into Anki?",
      answer:
        "Yes. Export CSV and import it into Anki or another spaced-repetition app.",
    },
  ],
  invoice: [
    {
      question: "What does it extract?",
      answer:
        "Vendor, invoice number, dates, currency, subtotal, tax, and total. Check the values before using them.",
    },
    {
      question: "Does it upload invoices?",
      answer: "No. Extraction runs in your browser.",
    },
  ],
};

function extractInvoice(text: string): Invoice {
  const find = (pattern: RegExp) => text.match(pattern)?.[1]?.trim() || "";
  return {
    vendor:
      text
        .split(/\n|\s{2,}/)
        .map((line) => line.trim())
        .find((line) => line.length > 2) || "",
    invoiceNumber: find(
      /(?:invoice|inv)[\s#:#-]*(?:no|number)?[\s:#-]*([A-Z0-9-]+)/i,
    ),
    invoiceDate: find(/(?:invoice|issue)\s*date\s*[:#-]?\s*([^\n]+)/i),
    dueDate: find(/due\s*date\s*[:#-]?\s*([^\n]+)/i),
    currency:
      text
        .match(/\b(USD|EUR|GBP|NPR|INR|CAD|AUD|CNY)\b/i)?.[1]
        ?.toUpperCase() || "",
    subtotal: find(/subtotal\s*[:#-]?\s*([$€£₹]?\s*[\d,.]+)/i),
    tax: find(/(?:tax|vat)\s*[:#-]?\s*([$€£₹]?\s*[\d,.]+)/i),
    total: find(
      /(?:grand\s*total|total\s*due|total)\s*[:#-]?\s*([$€£₹]?\s*[\d,.]+)/i,
    ),
  };
}

function localQuiz(pages: ExtractedPage[], count: number): QuizItem[] {
  return pages
    .flatMap((page) =>
      page.text
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => sentence.length > 45)
        .slice(0, count)
        .map((sentence) => ({
          question: "What is the main point of this passage?",
          answer: sentence.trim(),
          explanation: "Source sentence from the PDF.",
          page_reference: page.pageNumber,
        })),
    )
    .slice(0, count);
}

export function AiToolsWorkspace({ mode }: { mode: AiToolsMode }) {
  const config = {
    review: [
      "AI Review & Proofread",
      "Run basic local spelling and formatting checks.",
      "ai-review-pdf",
    ],
    translate: [
      "AI Translate PDF",
      "Translation is not currently available in this browser-only version.",
      "ai-translate-pdf",
    ],
    quiz: [
      "Quiz & Flashcard Generator",
      "Build simple study prompts from sentences in your PDF.",
      "quiz-generator",
    ],
    invoice: [
      "Invoice & Receipt Extractor",
      "Extract common invoice fields locally and review them before export.",
      "invoice-extractor",
    ],
  }[mode] as [string, string, string];

  useSEOAdvanced({
    title: `${config[0]} Online Free — PDFKira`,
    description: config[1],
    canonical: `${SITE_URL}/tools/${config[2]}`,
  });

  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [reviewType, setReviewType] = useState("General");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [count, setCount] = useState("10");
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceRows, setInvoiceRows] = useState<Invoice[]>([]);

  const upload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");
    setStatus("Starting...");
    try {
      const result = await extractPdfText(file, setStatus);
      setPages(result.pages);
      setStatus(
        `Ready: ${result.pages.length} pages extracted in your browser.`,
      );
      if (mode === "invoice") {
        const found = extractInvoice(
          result.pages.map((page) => page.text).join("\n"),
        );
        setInvoice(found);
        setInvoiceRows([found]);
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not read this PDF.",
      );
      setStatus("");
    }
  };

  const runReview = () => {
    const found: Issue[] = [];
    pages.forEach((page) => {
      if (/\s{2,}/.test(page.text))
        found.push({
          category: "formatting",
          severity: "low",
          page: page.pageNumber,
          quote: page.text.slice(0, 100),
          suggestion: "Review spacing and sentence boundaries.",
        });
      if (/\b(teh|recieve)\b/i.test(page.text))
        found.push({
          category: "spelling",
          severity: "medium",
          page: page.pageNumber,
          quote: page.text.match(/\b(teh|recieve)\b/i)?.[0] || "",
          suggestion: "Check the spelling of the highlighted word.",
        });
    });
    setIssues(found);
  };

  const exportInvoice = async (format: "csv" | "json" | "xlsx") => {
    const rows = invoiceRows.length ? invoiceRows : invoice ? [invoice] : [];
    if (format === "json") {
      downloadText("invoices.json", JSON.stringify(rows, null, 2));
      return;
    }
    if (format === "csv") {
      downloadText(
        "invoices.csv",
        [
          Object.keys(rows[0] || {}).join(","),
          ...rows.map((row) =>
            Object.values(row)
              .map((value) => `"${String(value).replace(/"/g, '""')}"`)
              .join(","),
          ),
        ].join("\n"),
      );
      return;
    }
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Invoices");
    XLSX.writeFile(book, "invoices.xlsx");
  };

  const updateInvoice = (key: keyof Invoice, value: string) => {
    setInvoice((current) => (current ? { ...current, [key]: value } : current));
  };

  return (
    <div className="bg-background pb-20">
      <section className="container mx-auto px-4 pb-10 pt-14 md:px-6 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles />
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {config[0]}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{config[1]}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Processing stays in
            your browser.
          </div>
        </div>
      </section>

      <section className="container mx-auto grid max-w-6xl gap-6 px-4 md:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Choose a PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadArea
              onFilesSelected={upload}
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
              <p className="text-sm text-muted-foreground">
                {pages.length} pages extracted. Scanned PDFs need OCR before
                text tools can use them.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configure and run</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "review" && (
              <>
                <div>
                  <Label>Document type</Label>
                  <Select value={reviewType} onValueChange={setReviewType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["General", "Resume", "Essay", "Business document"].map(
                        (item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Rule-based checks only. They catch common mistakes, not deeper
                  style problems.
                </p>
                <Button onClick={runReview} disabled={!pages.length}>
                  <Lightbulb className="mr-2 h-4 w-4" /> Review document
                </Button>
                {issues.length === 0 && pages.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    No local issues were found by these basic checks.
                  </p>
                )}
                {issues.map((issue, index) => (
                  <article
                    key={`${issue.category}-${index}`}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <strong>{issue.category}</strong>
                      <span className="text-xs uppercase text-muted-foreground">
                        {issue.severity} · p.{issue.page}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">“{issue.quote}”</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {issue.suggestion}
                    </p>
                  </article>
                ))}
              </>
            )}

            {mode === "translate" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Translation requires a language pack, which is not installed
                  in this version.
                </p>
                <p className="text-sm text-muted-foreground">
                  Run OCR PDF first for scanned pages. This page does not upload
                  or send extracted text elsewhere.
                </p>
              </>
            )}

            {mode === "quiz" && (
              <>
                <div>
                  <Label>Question count</Label>
                  <Input
                    type="number"
                    min="5"
                    max="20"
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Simple prompts are selected from longer sentences in your PDF.
                  No new questions are generated.
                </p>
                <Button
                  onClick={() =>
                    setQuiz(
                      localQuiz(
                        pages,
                        Math.min(20, Math.max(5, Number(count) || 10)),
                      ),
                    )
                  }
                  disabled={!pages.length}
                >
                  Generate study set
                </Button>
                {quiz.map((item, index) => (
                  <article
                    key={index}
                    className="rounded-xl border border-border p-4"
                  >
                    <p className="font-medium">
                      {index + 1}. {item.question}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Answer: {item.answer}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      p.{item.page_reference} · {item.explanation}
                    </p>
                  </article>
                ))}
                {quiz.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadText(
                          "study-set.md",
                          quiz
                            .map(
                              (item, index) =>
                                `## ${index + 1}. ${item.question}\n\n${item.answer}\n\n${item.explanation} [p.${item.page_reference}]`,
                            )
                            .join("\n\n"),
                        )
                      }
                    >
                      Markdown
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadText(
                          "study-set.csv",
                          [
                            "question,answer,explanation,page",
                            ...quiz.map((item) =>
                              [
                                item.question,
                                item.answer,
                                item.explanation,
                                item.page_reference,
                              ]
                                .map(
                                  (value) =>
                                    `"${String(value).replace(/"/g, '""')}"`,
                                )
                                .join(","),
                            ),
                          ].join("\n"),
                        )
                      }
                    >
                      CSV for Anki
                    </Button>
                  </div>
                )}
              </>
            )}

            {mode === "invoice" && (
              <>
                {invoice && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(invoice) as Array<keyof Invoice>).map(
                      (key) => (
                        <div key={key}>
                          <Label>{key}</Label>
                          <Input
                            value={invoice[key]}
                            onChange={(event) =>
                              updateInvoice(key, event.target.value)
                            }
                          />
                        </div>
                      ),
                    )}
                  </div>
                )}
                {invoice && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() =>
                        setInvoiceRows((rows) => [...rows, invoice])
                      }
                    >
                      Add to batch
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportInvoice("csv")}
                    >
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportInvoice("xlsx")}
                    >
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportInvoice("json")}
                    >
                      JSON
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Review extracted fields before importing into accounting
                  software.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto mt-8 max-w-6xl px-4 md:px-6">
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Extracted text stays in browser memory for this session.
        </p>
      </section>
      <FaqSection faqs={faqs[mode]} />
    </div>
  );
}
