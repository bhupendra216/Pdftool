export const MAX_PDF_BYTES = 50 * 1024 * 1024;
export const MAX_PDF_SIZE_MB = MAX_PDF_BYTES / (1024 * 1024);
export const MAX_PDF_SIZE_LABEL = `${MAX_PDF_SIZE_MB} MB`;
export const MAX_MARKDOWN_PDF_PAGES = 300;

export const PDF_TO_MARKDOWN_CONTENT = {
  slug: "pdf-to-markdown",
  title: "PDF to Markdown Converter",
  seoTitle: "PDF to Markdown Converter Online Free | PDFKira",
  metaDescription: `Convert PDF to Markdown online for free. Works in your browser, so your PDF is never uploaded. No sign-up, files up to ${MAX_PDF_SIZE_LABEL}.`,
  intro:
    "Convert PDF to Markdown online, free, and in your browser. Your file is never uploaded. Copy the Markdown for notes, documentation, or AI tools like ChatGPT and Claude, or download it as a file.",
  howToHeading: "How to convert PDF to Markdown online",
  howToSteps: [
    `Choose a PDF. Select a text-based PDF from your device (up to ${MAX_PDF_SIZE_LABEL} and ${MAX_MARKDOWN_PDF_PAGES} pages).`,
    "Convert. The tool reads the PDF page by page in your browser and shows progress.",
    "Review the result. Check the Markdown in the preview and compare it with your original, especially tables and columns.",
    'Copy or download. Use "Copy Markdown" to paste the text anywhere, or download the .md file. If the PDF contained images, the download is a ZIP with the Markdown file and an images folder.',
  ],
  useCases: [
    {
      title: "Prepare text for an AI chat",
      description: "Extract text from a text-based report or article before pasting it into an AI chat.",
      example: "Convert a report, then check the output for reading-order changes before using it in ChatGPT or Claude.",
    },
    {
      title: "Move a manual into a docs site",
      description: "Create editable Markdown text for a wiki, documentation site, or knowledge base.",
      example: "Convert a product manual and review its headings and lists before publishing.",
    },
    {
      title: "Make notes from a paper",
      description: "Move text from a lecture handout or paper into Obsidian, Notion, or another Markdown editor.",
      example: "Extract a text-based paper and edit the Markdown into study notes.",
    },
    {
      title: "Prepare text for retrieval workflows",
      description: "Use detected headings as possible boundaries when preparing document text for a RAG workflow.",
      example: "Review the Markdown and choose chunk boundaries manually before indexing it.",
    },
  ],
  technicalSpecs: {
    input: "PDF with a text layer",
    output: "A .md (PDF to MD) file, or a .zip containing the .md file and an images folder when images are extracted",
    maxFileSize: MAX_PDF_SIZE_LABEL,
    maxPages: `${MAX_MARKDOWN_PDF_PAGES} pages`,
    processing: "In your browser; the PDF is not uploaded for conversion",
    cost: "Free to use; no sign-up required",
  },
  privacyText:
    "The conversion runs entirely in your browser. Your PDF and its extracted text are not uploaded to or stored on our servers. Private conversion with no upload required: your PDF stays on your device. This page loads standard analytics for page visits; conversion code does not send the file or extracted text to analytics.",
  limitations: [
    "Scanned or image-only PDFs have no text layer, so OCR is not performed here. Run them through the OCR PDF tool first. If no text or extractable image is found, the tool shows an error instead of offering a blank Markdown file.",
    "Tables are emitted as plain text lines, not reconstructed Markdown tables.",
    "Bold and italic styling is not retained, and multi-column reading order may be inaccurate.",
    "Headings are inferred from relative font size, with limited support for bold all-caps lines. Same-size headings may not be recognized.",
    "Some embedded images, including certain masks or unusual image operators, may not be extractable. Compare the Markdown and ZIP with the original.",
  ],
  faqs: [
    {
      question: "Is my PDF uploaded to a server?",
      answer:
        "No. The conversion runs in your browser, so your PDF and its text are not uploaded or stored on our servers. The page loads standard analytics that record visits, but they do not receive your file or its contents.",
    },
    {
      question: "Can I convert a scanned PDF to Markdown?",
      answer:
        "Not directly. A scanned PDF is made of page images with no text layer, so there is no text to extract. Run the file through the OCR PDF tool first, then convert the searchable result. If image-only pages contain extractable images, the tool still offers them in a ZIP and explains that no text was found. If no text or images can be extracted, it shows an error instead of producing an empty file.",
    },
    {
      question: "What happens to tables?",
      answer:
        "Tables are not converted into Markdown tables. Their contents are extracted as text lines, so you may need to rebuild the table by hand.",
    },
    {
      question: "Are headings, bold, and italics preserved?",
      answer:
        "Headings are inferred from font size, so clearly larger titles may become Markdown headings (#, ##, ###). Limited bold all-caps headings may also be detected. Bold and italic styling is not retained; bullet and numbered list prefixes are kept.",
    },
    {
      question: "What happens to images in my PDF?",
      answer:
        "Some embedded images can be extracted as PNG files and referenced in the Markdown. When images are extracted, the download is a ZIP with the Markdown file and an images folder. If image decoding fails, some images may be skipped; the result reports how many images were extracted and skipped. Images are only in the ZIP; the Copy Markdown button can include or leave out their references.",
    },
    {
      question: "How do I copy the Markdown without downloading?",
      answer:
        "Use the Copy Markdown button after conversion. It copies exactly the text shown in the preview. When images were extracted, use the Include image references checkbox to control whether image-reference lines are copied. Image files themselves are only in the ZIP.",
    },
    {
      question: "Is the output good for ChatGPT, Claude, or RAG pipelines?",
      answer:
        "It can help prepare text-heavy PDFs such as articles, manuals, and reports. Repeated text in page margins and standalone page numbers are filtered when detected, and headings may provide useful chunk boundaries. Review the result because multi-column layouts and tables may need manual cleanup.",
    },
    {
      question: "Is there a file size or page limit?",
      answer:
        `Yes. Each PDF can be up to ${MAX_PDF_SIZE_LABEL} and ${MAX_MARKDOWN_PDF_PAGES} pages. Large or image-heavy files can take longer because processing runs in your browser. Use Extract Pages or Split PDF to process a shorter document.`,
    },
    {
      question: "Is it free?",
      answer:
        "Yes. The tool is free to use, requires no sign-up, and does not add a watermark. The per-file size and page limits still apply.",
    },
    {
      question: "What about password-protected PDFs?",
      answer:
        "Password-protected PDFs cannot be read by this converter. Remove the password first with the Unlock PDF tool, then convert the unlocked file.",
    },
  ],
  relatedTools: [
    {
      slug: "ocr-pdf",
      name: "OCR PDF",
      reason: "Run OCR first when a scanned PDF has no selectable text.",
    },
    {
      slug: "pdf-to-word",
      name: "PDF to Word",
      reason: "Choose this when you need an editable Word document instead of plain Markdown.",
    },
    {
      slug: "ocr-image-to-text",
      name: "OCR Image to Text",
      reason: "Extract text from a screenshot or photo of a document.",
    },
    {
      slug: "extract-pages",
      name: "Extract Pages",
      reason: "Select a smaller set of pages before converting a long PDF.",
    },
  ],
  socialFeatureList: [
    "Runs entirely in your browser",
    "Your PDF is never uploaded",
    "Exports a .md file",
    "Extracts embedded images into a ZIP",
    "Copy Markdown to clipboard",
    "No sign-up",
  ],
} as const;
