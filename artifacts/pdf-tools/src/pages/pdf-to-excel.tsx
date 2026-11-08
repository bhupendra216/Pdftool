import { useState } from "react";
import { AlertCircle, Download, LoaderCircle, ShieldCheck, Table2 } from "lucide-react";
import { UploadArea } from "@/components/shared/UploadArea";
import { ClientToolPage } from "@/components/tools/ClientToolPage";
import { openPdf, outputBaseName } from "@/lib/client-pdf";
import { createExcelWorkbookBlob, extractPdfTables } from "@/lib/pdf-to-excel";

export default function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetMode, setSheetMode] = useState<"pages" | "single">("pages");
  const [progress, setProgress] = useState(0);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const selectFile = (selected: File[]) => {
    setError(null);
    setComplete(false);
    setProgress(0);
    setFile(selected[0] ?? null);
    if (import.meta.env.DEV && selected[0]) {
      console.debug("[PDF to Excel] Selected PDF", { name: selected[0].name, size: selected[0].size });
    }
  };

  const convert = async () => {
    if (!file) return;
    setWorking(true);
    setError(null);
    setComplete(false);
    setProgress(0);
    let pdf: Awaited<ReturnType<typeof openPdf>> | undefined;

    try {
      pdf = await openPdf(file);
      if (import.meta.env.DEV) {
        console.debug("[PDF to Excel] PDF opened", { pages: pdf.numPages });
      }
      const extracted = await extractPdfTables(pdf, (pageNumber, pageCount) => {
        setProgress(Math.round((pageNumber / pageCount) * 90));
        if (import.meta.env.DEV) {
          console.debug("[PDF to Excel] Page text extracted", { page: pageNumber, pageCount });
        }
      });
      const detectedTablePages = extracted.filter((page) => page.hasTable).length;
      if (import.meta.env.DEV) {
        console.debug("[PDF to Excel] Table extraction complete", {
          pages: extracted.length,
          tablePages: detectedTablePages,
          rows: extracted.reduce((total, page) => total + page.rows.length, 0),
        });
      }

      const blob = createExcelWorkbookBlob(extracted, sheetMode);
      const signatureBytes = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
      if (import.meta.env.DEV) {
        console.debug("[PDF to Excel] Workbook created", {
          bytes: blob.size,
          signature: Array.from(signatureBytes),
        });
      }
      if (
        blob.size === 0 ||
        signatureBytes[0] !== 0x50 ||
        signatureBytes[1] !== 0x4b
      ) {
        throw new Error("Could not create the Excel file. Please try again.");
      }

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      try {
        link.href = downloadUrl;
        link.download = `${outputBaseName(file.name)}-converted.xlsx`;
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
      setProgress(100);
      setComplete(true);
    } catch (conversionError) {
      const message = conversionError instanceof Error ? conversionError.message : "";
      const friendlyMessages = new Set([
        "No tables were found in this PDF.",
        "Could not create the Excel file. Please try again.",
        "This PDF is password-protected. Enter its password or remove protection and try again.",
        "This PDF could not be opened. It may be damaged, encrypted, or unsupported.",
        "This PDF is larger than the 50 MB limit.",
      ]);
      setError(
        friendlyMessages.has(message)
          ? message
          : "The PDF could not be converted. It may be damaged, encrypted, or unsupported.",
      );
      setComplete(false);
    } finally {
      await pdf?.cleanup();
      setWorking(false);
    }
  };

  return (
    <ClientToolPage slug="pdf-to-excel">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card p-5 shadow-sm md:p-8">
        <UploadArea
          multiple={false}
          maxSizeMB={50}
          label="PDF file"
          description="Drop a PDF here or choose a file. Maximum 50 MB and 20 pages."
          onFilesSelected={selectFile}
          onError={setError}
        />
        {file ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 p-4">
            <span className="min-w-0 truncate text-sm font-medium text-foreground">{file.name}</span>
            <button type="button" className="text-sm text-primary underline" onClick={() => selectFile([])}>Choose another file</button>
          </div>
        ) : null}

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-foreground">Worksheet layout</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-4">
              <input type="radio" name="sheet-layout" checked={sheetMode === "pages"} onChange={() => setSheetMode("pages")} />
              <span><strong className="block text-sm">One sheet per page</strong><span className="text-xs text-muted-foreground">Keep each PDF page separate.</span></span>
            </label>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-4">
              <input type="radio" name="sheet-layout" checked={sheetMode === "single"} onChange={() => setSheetMode("single")} />
              <span><strong className="block text-sm">Single sheet</strong><span className="text-xs text-muted-foreground">Append rows from every page.</span></span>
            </label>
          </div>
        </fieldset>

        {working ? (
          <div className="mt-6" role="status">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground"><span>Extracting PDF text and building workbook</span><span>{progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        ) : null}
        {error ? <p className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p> : null}
        {complete ? <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700"><Download className="h-4 w-4" />Workbook downloaded.</p> : null}
        <button type="button" disabled={!file || working} onClick={() => void convert()} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
          {working ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Table2 className="h-4 w-4" />}
          {working ? "Converting locally…" : "Convert to Excel"}
        </button>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />Your file is processed in this browser and is never uploaded.</p>
      </div>
    </ClientToolPage>
  );
}
