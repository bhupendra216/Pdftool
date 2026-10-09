export interface ClientToolFaq {
  question: string;
  answer: string;
}

export interface ClientToolContent {
  slug: "pdf-to-excel" | "sign-pdf" | "ocr-pdf";
  name: string;
  title: string;
  description: string;
  intro: string;
  steps: [string, string, string];
  benefits: [{ title: string; description: string }, { title: string; description: string }, { title: string; description: string }];
  faqs: [ClientToolFaq, ClientToolFaq, ClientToolFaq, ClientToolFaq, ClientToolFaq];
  related: { label: string; href: string }[];
}

import { getSuppliedToolFaqs } from './toolFaqs';

export const clientToolContent: ClientToolContent[] = [
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    title: "PDF to Excel Online Free — PDFKira",
    description: "Convert PDF tables to Excel spreadsheets in your browser for free. Files stay on your device, with no upload required.",
    intro: "Turn text-based PDF tables into an Excel workbook. Table detection is heuristic, so review the spreadsheet and adjust columns when your PDF has complex layouts.",
    steps: [
      "Choose a PDF or drag it into the upload area.",
      "Select one worksheet per page or combine all pages into one sheet.",
      "Convert locally and download the .xlsx workbook.",
    ],
    benefits: [
      { title: "Private by design", description: "Your PDF is read and converted locally in this browser; it is not sent to PDFKira." },
      { title: "Simple spreadsheet output", description: "Export detected rows and columns, with a text-line fallback when a table is not found." },
      { title: "Review-ready", description: "Keep pages separate or append them together, then make any final spreadsheet adjustments." },
    ],
    faqs: [
      { question: "Does my PDF leave my browser?", answer: "No. PDF rendering, text extraction, table detection, and workbook generation all run locally in your browser." },
      { question: "What are the file limits?", answer: "You can convert a PDF up to 50 MB and 20 pages per file. Encrypted or damaged PDFs may not be readable." },
      { question: "Will table formatting survive PDF to Excel?", answer: "Not always. The converter groups text by approximate row positions and horizontal gaps, so complex tables, merged cells, and scanned pages may need manual cleanup. Scanned PDFs need OCR first." },
      { question: "Can I use it on a phone?", answer: "The page supports mobile browsers and touch, though reviewing and editing a spreadsheet is usually easier on a larger screen." },
      { question: "Is the PDF to Excel converter free?", answer: "Yes. PDFKira's PDF to Excel conversion is free to use, with no account required." },
    ],
    related: [
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
    ],
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    title: "Sign PDF Online Free — PDFKira",
    description: "Sign a PDF online by drawing, typing, or uploading a signature. Place signatures and download locally in your browser.",
    intro: "Add one or more drawn, typed, or uploaded signatures to a PDF, position them on the page, and save the signed document on your device.",
    steps: [
      "Upload a PDF and choose a page to preview.",
      "Draw, type, or upload a signature, then place and position it on the page.",
      "Apply your signatures and download the signed PDF.",
    ],
    benefits: [
      { title: "Three ways to sign", description: "Draw with touch or a mouse, type your name in a handwriting-style font, or upload a signature image." },
      { title: "Position with control", description: "Move and resize each signature, choose a color, and optionally add today's date." },
      { title: "Local processing", description: "Your PDF and signature image are processed in your browser and never uploaded to our servers." },
    ],
    faqs: [
      { question: "Does my PDF or signature leave my browser?", answer: "No. The PDF and signature are processed locally on your device; the file is not uploaded to PDFKira." },
      { question: "What are the file limits?", answer: "You can sign a PDF up to 50 MB and 20 pages. Encrypted, corrupted, or unsupported PDFs cannot be processed." },
      { question: "Are signatures applied here legally binding?", answer: "This tool places a visual signature image in a PDF and does not provide identity verification, audit trails, or a certified electronic-signature workflow. For legally binding e-signatures, use a certified provider." },
      { question: "Can I sign on a phone or tablet?", answer: "Yes. The signature canvas supports touch input, and you can position signatures with touch gestures." },
      { question: "Is this PDF signing tool free?", answer: "Yes. PDFKira's local PDF signing tool is free to use, with no account required." },
    ],
    related: [
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "OCR PDF", href: "/tools/ocr-pdf" },
    ],
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    title: "OCR PDF Online Free — Make Scanned PDFs Searchable — PDFKira",
    description: "Make scanned PDFs searchable with free browser-based OCR. Recognize text locally and download a searchable PDF or plain text.",
    intro: "Recognize text in scanned PDF pages and create a searchable copy that keeps the scan as its visible background. Processing stays in your browser.",
    steps: [
      "Upload a scanned PDF and choose the pages to recognize.",
      "Run English OCR locally and follow per-page progress.",
      "Download a searchable PDF, or save recognized text as a .txt file.",
    ],
    benefits: [
      { title: "Keep scans private", description: "Page rendering and OCR use browser-side PDF.js and Tesseract; files are not sent to a remote service." },
      { title: "Searchable output", description: "Recognized words are added as an invisible text layer over each original page image." },
      { title: "Choose pages", description: "Process a page range when you only need text from part of a document." },
    ],
    faqs: [
      { question: "Does my scanned PDF leave my browser?", answer: "No. PDF rendering, OCR, and searchable-PDF creation run locally in your browser. The OCR engine and English language data are served from PDFKira's own site." },
      { question: "What are the file limits?", answer: "You can OCR a PDF up to 50 MB and 20 pages. Documents over 10 pages may take a few minutes; you can select a page range to process fewer pages." },
      { question: "How accurate is PDF OCR?", answer: "Results depend on scan resolution, contrast, skew, handwriting, and text quality. Clear scans at 150 DPI or higher generally work best; always check important results." },
      { question: "Can I use OCR on a phone?", answer: "The page supports mobile browsers, but OCR is memory- and processor-intensive. A desktop or tablet is recommended for larger scans." },
      { question: "Is OCR PDF free?", answer: "Yes. PDFKira's browser-based OCR is free to use, with no account required." },
    ],
    related: [
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
    ],
  },
];

for (const tool of clientToolContent) {
  const suppliedFaqs = getSuppliedToolFaqs(tool.slug);
  if (suppliedFaqs) tool.faqs = suppliedFaqs as ClientToolContent['faqs'];
}

export function getClientToolContent(slug: string) {
  return clientToolContent.find((tool) => tool.slug === slug);
}
