// Static content catalog for the PDF Tools MVP.
//
// No database is used for this content: tools, blog posts, and FAQs are
// simple editorial data that changes rarely and doesn't need persistence
// or user-generated writes. Keeping it here (instead of the DB) avoids
// unnecessary schema/migrations for content that is effectively static
// config. If this ever needs an admin UI or user-submitted content, it
// can move to `lib/db` without touching the route contracts.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolRecord {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  icon: string;
  popular: boolean;
  status: "available" | "comingSoon";
  seoTitle: string;
  seoDescription: string;
  steps: string[];
  faqs: FaqItem[];
  blogSlug: string | null;
}

export interface BlogPostRecord {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  content: string;
  relatedToolSlug: string | null;
}

export const homepageFaqs: FaqItem[] = [
  {
    question: "Is PDF Tools really free to use?",
    answer:
      "Yes. Every tool on this site is free during our MVP phase, with no account required. We may introduce optional paid plans for heavy or automated use later, but the core tools stay free.",
  },
  {
    question: "Are my files kept private?",
    answer:
      "Files are processed only to perform the action you request and are deleted from our servers shortly afterward. We never inspect, share, or use your documents for anything else.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. PDF Tools runs entirely in your browser and works on desktop, tablet, and mobile without installing an app or plugin.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Each tool enforces a reasonable upload limit to keep processing fast and reliable for everyone. Most everyday documents are well within that limit.",
  },
  {
    question: "Can I use PDF Tools on my phone?",
    answer:
      "Yes. The entire site is designed mobile-first, so every tool works the same way on a phone browser as it does on desktop.",
  },
];

export const tools: ToolRecord[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDFs into a single organized file.",
    category: "Organize",
    icon: "Merge",
    popular: true,
    status: "available",
    seoTitle: "Merge PDF Files Online Free | PDF Tools",
    seoDescription:
      "Combine two or more PDF files into one document in seconds. Free, fast, and works on any device.",
    steps: [
      "Upload the PDF files you want to combine.",
      "Drag to reorder the files into the order you want them merged.",
      "Click Merge and download your combined PDF.",
    ],
    faqs: [
      {
        question: "How many PDFs can I merge at once?",
        answer:
          "You can merge as many files as you need in a single batch. For very large batches, splitting into a couple of merges keeps things fast.",
      },
      {
        question: "Will the page order be preserved?",
        answer:
          "Yes, pages are merged in exactly the order you arrange the files, and each file's internal page order is preserved.",
      },
    ],
    blogSlug: "how-to-merge-pdfs",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Break a PDF into separate files or page ranges.",
    category: "Organize",
    icon: "Scissors",
    popular: true,
    status: "available",
    seoTitle: "Split PDF Online Free | PDF Tools",
    seoDescription:
      "Extract or divide pages from a PDF into separate files. Free and easy to use, right in your browser.",
    steps: [
      "Upload the PDF you want to split.",
      "Choose how to split it: by page ranges or every page separately.",
      "Click Split and download your new files.",
    ],
    faqs: [
      {
        question: "Can I split by custom page ranges?",
        answer:
          "Yes, you can specify exact page ranges, or split every page into its own file.",
      },
    ],
    blogSlug: null,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortDescription: "Reduce PDF file size while keeping good quality.",
    category: "Optimize",
    icon: "FileArchive",
    popular: true,
    status: "available",
    seoTitle: "Compress PDF Online Free | PDF Tools",
    seoDescription:
      "Shrink large PDF files for easier sharing and storage without losing readability.",
    steps: [
      "Upload the PDF you want to shrink.",
      "Pick a compression level: balanced, or maximum compression.",
      "Click Compress and download your smaller PDF.",
    ],
    faqs: [
      {
        question: "How much smaller will my file get?",
        answer:
          "It depends on the content: PDFs with lots of high-resolution images shrink the most, while text-only PDFs are already small.",
      },
    ],
    blogSlug: "best-free-pdf-compressor",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    shortDescription: "Convert images between popular formats while maintaining high quality.",
    category: "Convert",
    icon: "Image",
    popular: true,
    status: "available",
    seoTitle: "Convert Images Online Free | PDF Tools",
    seoDescription:
      "Quickly convert images between PNG, JPG, WEBP, BMP and more while preserving quality.",
    steps: [
      "Upload an image using drag & drop or the Browse button.",
      "Choose the desired output format and click Convert.",
      "Download the converted image when ready.",
    ],
    faqs: [
      {
        question: "Which formats are supported?",
        answer:
          "We accept PNG, JPG, JPEG, WEBP, BMP, TIFF, and GIF for input, and can output PNG, JPG, JPEG, WEBP, and BMP.",
      },
    ],
    blogSlug: null,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    shortDescription: "Convert a PDF into an editable Word document.",
    category: "Convert",
    icon: "FileText",
    popular: true,
    status: "available",
    seoTitle: "Convert PDF to Word Online Free | PDF Tools",
    seoDescription:
      "Turn a PDF into an editable .docx file while preserving layout and formatting.",
    steps: [
      "Upload the PDF you want to convert.",
      "Wait while we convert your file to Word format.",
      "Download your editable .docx document.",
    ],
    faqs: [
      {
        question: "Will formatting be preserved?",
        answer:
          "We aim to preserve text, layout, and images as closely as possible, though very complex layouts may need minor cleanup.",
      },
    ],
    blogSlug: "how-to-convert-pdf-to-word",
  },
  {
    slug: "pdf-to-markdown",
    name: "PDF to Markdown",
    shortDescription: "Turn a PDF into clean Markdown text in your browser.",
    category: "Convert",
    icon: "FileText",
    popular: false,
    status: "available",
    seoTitle: "Convert PDF to Markdown Online Free | PDF Tools",
    seoDescription:
      "Extract text from a PDF and export it as Markdown without uploading your document.",
    steps: [
      "Upload the PDF you want to convert.",
      "Review the generated Markdown output.",
      "Download the .md file or copy the text.",
    ],
    faqs: [
      {
        question: "Does this upload my PDF to a server?",
        answer:
          "No. The conversion runs entirely in your browser, and your PDF never leaves your device.",
      },
      {
        question: "Can it preserve headings and lists?",
        answer:
          "It preserves text layout as Markdown-friendly text, including basic headings and lists when detected.",
      },
    ],
    blogSlug: null,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    shortDescription: "Convert a Word document into a shareable PDF.",
    category: "Convert",
    icon: "FileOutput",
    popular: false,
    status: "available",
    seoTitle: "Convert Word to PDF Online Free | PDF Tools",
    seoDescription:
      "Turn a .docx or .doc file into a polished, shareable PDF in seconds.",
    steps: [
      "Upload the Word document you want to convert.",
      "Wait while we generate your PDF.",
      "Download your finished PDF file.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortDescription: "Turn one or more images into a single PDF file.",
    category: "Convert",
    icon: "Image",
    popular: true,
    status: "available",
    seoTitle: "Convert JPG to PDF Online Free | PDF Tools",
    seoDescription:
      "Combine JPG or PNG images into one PDF document, in the order you choose.",
    steps: [
      "Upload the images you want to convert.",
      "Arrange them in the order they should appear.",
      "Click Convert and download your PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortDescription: "Export each PDF page as a high-quality JPG image.",
    category: "Convert",
    icon: "ImageDown",
    popular: false,
    status: "available",
    seoTitle: "Convert PDF to JPG Online Free | PDF Tools",
    seoDescription:
      "Turn PDF pages into individual JPG images you can use anywhere.",
    steps: [
      "Upload the PDF you want to convert.",
      "Choose image quality.",
      "Download your images as a zip file.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "image-resize",
    name: "Image Resize",
    shortDescription: "Resize image dimensions while preserving quality.",
    category: "Images",
    icon: "Crop",
    popular: false,
    status: "available",
    seoTitle: "Resize Images Online Free | PDF Tools",
    seoDescription:
      "Resize images to new dimensions while keeping them sharp and ready for web or print.",
    steps: [
      "Upload the image you want to resize.",
      "Enter a width, height, or both.",
      "Download the resized image.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "image-compress",
    name: "Image Compress",
    shortDescription: "Reduce image file size with minimal quality loss.",
    category: "Images",
    icon: "Image",
    popular: false,
    status: "available",
    seoTitle: "Compress Images Online Free | PDF Tools",
    seoDescription:
      "Shrink image file sizes for faster loading without sacrificing visual quality.",
    steps: [
      "Upload your image.",
      "Choose a compression quality.",
      "Download the compressed image.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "image-upscale",
    name: "Image Upscale",
    shortDescription: "Increase image resolution for larger displays.",
    category: "Images",
    icon: "Zap",
    popular: false,
    status: "available",
    seoTitle: "Upscale Images Online Free | PDF Tools",
    seoDescription:
      "Enlarge images with sharp results so they look great at higher resolutions.",
    steps: [
      "Upload the image you want to upscale.",
      "Choose an upscale factor.",
      "Download the larger image.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortDescription: "Correct page orientation quickly and keep your document presentation polished.",
    category: "Edit",
    icon: "RotateCw",
    popular: false,
    status: "available",
    seoTitle: "Rotate PDF Pages Online Free | PDF Tools",
    seoDescription:
      "Rotate one or all pages of a PDF and save a corrected copy with the right orientation.",
    steps: [
      "Upload the PDF you want to fix.",
      "Choose which pages to rotate and by how much.",
      "Click Rotate and download your corrected PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    shortDescription: "Reorder, add, or remove pages visually.",
    category: "Organize",
    icon: "LayoutGrid",
    popular: false,
    status: "available",
    seoTitle: "Organize PDF Pages Online Free | PDF Tools",
    seoDescription:
      "Drag and drop to reorder pages, or remove the ones you don't need.",
    steps: [
      "Upload the PDF you want to organize.",
      "Drag pages into the order you want, or remove unwanted pages.",
      "Click Save and download the reorganized PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "delete-pages",
    name: "Delete Pages",
    shortDescription: "Remove specific pages from a PDF file.",
    category: "Organize",
    icon: "FileMinus",
    popular: false,
    status: "available",
    seoTitle: "Delete PDF Pages Online Free | PDF Tools",
    seoDescription:
      "Select and remove unwanted pages from any PDF document.",
    steps: [
      "Upload your PDF.",
      "Select the pages you want to remove.",
      "Click Delete and download your updated PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "extract-pages",
    name: "Extract Pages",
    shortDescription: "Pull specific pages out into a new PDF file.",
    category: "Organize",
    icon: "FilePlus2",
    popular: false,
    status: "available",
    seoTitle: "Extract PDF Pages Online Free | PDF Tools",
    seoDescription:
      "Select and export a subset of pages from a PDF into a brand new document.",
    steps: [
      "Upload your PDF.",
      "Select the pages you want to extract.",
      "Click Extract and download the new PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortDescription: "Remove a known password from a protected PDF.",
    category: "Security",
    icon: "LockOpen",
    popular: false,
    status: "available",
    seoTitle: "Unlock PDF Online Free | PDF Tools",
    seoDescription:
      "Remove password protection from a PDF you own the password to.",
    steps: [
      "Upload the protected PDF.",
      "Enter the current password.",
      "Click Unlock and download the unprotected PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortDescription: "Add a password to keep a PDF private.",
    category: "Security",
    icon: "Lock",
    popular: false,
    status: "available",
    seoTitle: "Password Protect PDF Online Free | PDF Tools",
    seoDescription:
      "Add a password to a PDF so only people you share it with can open it.",
    steps: [
      "Upload the PDF you want to protect.",
      "Set a password.",
      "Click Protect and download your secured PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    shortDescription: "Stamp text or a logo across every page.",
    category: "Edit",
    icon: "Stamp",
    popular: false,
    status: "available",
    seoTitle: "Add Watermark to PDF Online Free | PDF Tools",
    seoDescription:
      "Add a text or image watermark to every page of a PDF document.",
    steps: [
      "Upload your PDF.",
      "Choose a text or image watermark and adjust its position.",
      "Click Apply and download your watermarked PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    shortDescription: "Number every page automatically.",
    category: "Edit",
    icon: "Hash",
    popular: false,
    status: "available",
    seoTitle: "Add Page Numbers to PDF Online Free | PDF Tools",
    seoDescription:
      "Automatically insert page numbers into a PDF with your choice of position and style.",
    steps: [
      "Upload your PDF.",
      "Choose a position and starting number.",
      "Click Apply and download your numbered PDF.",
    ],
    faqs: [],
    blogSlug: null,
  },
  {
    slug: "ocr-image-to-text",
    name: "OCR Image to Text",
    shortDescription: "Extract editable text from images and scanned PDFs.",
    category: "AI",
    icon: "Type",
    popular: false,
    status: "available",
    seoTitle: "OCR Image to Text | Extract Text from Images Online Free",
    seoDescription:
      "Extract editable text from images and scanned PDFs. Supports English and Nepali OCR. Free online OCR tool.",
    steps: [
      "Upload an image or scanned PDF.",
      "Wait while the document is processed with OCR.",
      "Edit, copy, or download the extracted text.",
    ],
    faqs: [
      {
        question: "What is OCR?",
        answer: "OCR (Optical Character Recognition) converts images of text into editable, searchable text.",
      },
      {
        question: "Does OCR support Nepali?",
        answer: "Yes — this tool supports English and Nepali recognition (eng+nep) using Tesseract.",
      },
      {
        question: "Can OCR read handwritten notes?",
        answer: "Handwritten text has mixed results; clear printed text or high-quality scans work best.",
      },
      {
        question: "Does OCR work on scanned PDFs?",
        answer: "Yes. Upload a scanned PDF and we convert pages to images before running OCR.",
      },
      {
        question: "Is my uploaded file private?",
        answer: "Files are processed temporarily and removed from our servers shortly after processing.",
      },
    ],
    blogSlug: "how-to-convert-image-to-text-using-ocr",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortDescription: "Create printable QR codes for any link or URL in seconds.",
    category: "Create",
    icon: "QrCode",
    popular: true,
    status: "available",
    seoTitle: "QR Code Generator Online Free | PDFKira",
    seoDescription:
      "Generate high-quality QR codes from any URL with live preview, instant download, and print-ready PNG or PDF output.",
    steps: [
      "Enter the URL you want to turn into a QR code.",
      "Add an optional project name for the download label.",
      "Preview, download, or share the generated QR code.",
    ],
    faqs: [
      {
        question: "What formats can I download in?",
        answer: "You can download your QR code as a high-resolution PNG or a print-ready PDF.",
      },
      {
        question: "Do I need to provide a project name?",
        answer: "No. The project name is optional and is only used to create a cleaner download filename.",
      },
    ],
    blogSlug: null,
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    shortDescription: "Place handwritten, typed, or image signatures on any page of a PDF.",
    category: "Edit",
    icon: "FileSignature",
    popular: true,
    status: "available",
    seoTitle: "Sign PDF Online Free | PDFKira",
    seoDescription:
      "Add signatures to PDFs by drawing, typing, or uploading an image and place them precisely on any page.",
    steps: [
      "Upload the PDF you want to sign.",
      "Choose draw, type, or image mode and place your signature on the page.",
      "Download the signed PDF with your signature positioned exactly where you placed it.",
    ],
    faqs: [
      {
        question: "Can I sign any page in the document?",
        answer: "Yes. You can place signatures on any page and move them around before downloading the finished PDF.",
      },
      {
        question: "Which signature methods are supported?",
        answer: "You can draw a signature with your pointer, type a signature and pick a handwriting style, or upload a PNG or JPEG signature image.",
      },
    ],
    blogSlug: null,
  },
];

export const blogPosts: BlogPostRecord[] = [
  {
    slug: "how-to-merge-pdfs",
    title: "How to Merge PDFs (Free and Fast)",
    excerpt:
      "A quick guide to combining multiple PDF files into one document without installing any software.",
    category: "Guides",
    publishedAt: "2026-05-04T09:00:00.000Z",
    readingMinutes: 4,
    relatedToolSlug: "merge-pdf",
    content: `Merging PDFs is one of the most common document tasks, whether you're combining scanned pages, assembling a report, or putting together a portfolio.

## Why merge PDFs?

Sending a single organized file is almost always better than sending several separate attachments. It's easier for the recipient to review, print, and archive.

## Steps to merge your PDFs

1. Upload every PDF file you want to combine.
2. Drag the files into the order you want them to appear in the final document.
3. Click **Merge** and download the combined PDF.

## Tips

- Double-check page order before merging — it's much faster than fixing it afterward.
- If a file is very large, consider compressing it first so the merged file stays a manageable size.

Merging your files takes seconds and works entirely in your browser, with your files removed from our servers shortly after processing.`,
  },
  {
    slug: "best-free-pdf-compressor",
    title: "Best Free PDF Compressor: How to Shrink File Size",
    excerpt:
      "Learn how PDF compression works and how to reduce file size without losing readability.",
    category: "Guides",
    publishedAt: "2026-05-11T09:00:00.000Z",
    readingMinutes: 5,
    relatedToolSlug: "compress-pdf",
    content: `Large PDF files are frustrating to email, upload, or store. Here's how compression works and how to get the best results.

## What makes a PDF large?

Most bloated PDFs are large because of high-resolution images, embedded fonts, or scanned pages saved at unnecessarily high quality.

## How compression helps

A good PDF compressor reduces image resolution and re-encodes embedded assets while keeping text sharp and legible.

## Choosing a compression level

- **Balanced** — noticeably smaller file size with virtually no visible quality loss. Good for most documents.
- **Maximum compression** — the smallest possible file, best for documents that are mostly text or will only be viewed on screen.

Compressing a PDF takes just a few seconds and can often cut file size by more than half.`,
  },
  {
    slug: "how-to-convert-pdf-to-word",
    title: "How to Convert PDF to Word",
    excerpt:
      "Turn a PDF into an editable Word document while keeping your formatting intact.",
    category: "Guides",
    publishedAt: "2026-05-18T09:00:00.000Z",
    readingMinutes: 4,
    relatedToolSlug: "pdf-to-word",
    content: `Sometimes you need to edit a document that only exists as a PDF. Converting it to Word makes that possible.

## When you need this

Common cases include editing a contract, updating an old resume, or repurposing content from a report.

## What to expect

Conversion tools work best on PDFs that were originally created from text documents. Scanned PDFs may need OCR for accurate results.

## Steps

1. Upload your PDF file.
2. Wait a moment while the conversion runs.
3. Download your new, editable .docx file.

Once it's back in Word, you can edit freely and export to PDF again whenever you need to share it.`,
  },
  {
    slug: "tips-for-reducing-pdf-size",
    title: "5 Tips for Reducing PDF Size Before You Compress",
    excerpt:
      "Simple habits that keep your PDFs small from the start, so you spend less time compressing later.",
    category: "Tips",
    publishedAt: "2026-05-25T09:00:00.000Z",
    readingMinutes: 3,
    relatedToolSlug: "compress-pdf",
    content: `Compression tools help after the fact, but a few habits keep your files small in the first place.

1. **Scan at a reasonable resolution.** 200–300 DPI is plenty for most documents; higher resolutions mostly add file size, not clarity.
2. **Avoid embedding unnecessary fonts.** Stick to standard fonts when you can.
3. **Resize images before inserting them.** A 4000px-wide photo doesn't need to stay that large inside a document.
4. **Export instead of print-to-PDF when possible.** Native exports are usually more efficient than print drivers.
5. **Compress once you're done editing.** Repeatedly compressing an already-compressed file has diminishing returns.

Combine these habits with our Compress PDF tool for the smallest, cleanest files.`,
  },
  {
    slug: "how-to-convert-image-to-text-using-ocr",
    title: "How to Convert Image to Text Using OCR",
    excerpt: "A practical guide to extracting editable text from images and scanned PDFs using OCR.",
    category: "Guides",
    publishedAt: "2026-07-13T09:00:00.000Z",
    readingMinutes: 4,
    relatedToolSlug: "ocr-image-to-text",
    content: `Optical Character Recognition (OCR) turns images of text into editable text you can copy, search, and save.

## Steps to extract text from images or scanned PDFs

1. Upload a clear image or a scanned PDF.
2. Wait while OCR processes each page — we auto-rotate and enhance images for better accuracy.
3. Edit or copy the extracted text, or download it as a TXT file.

## Tips for best results

- Use high-contrast scans (200–300 DPI) for printed text.
- Crop out margins and non-text areas where possible.
- Handwritten notes are harder to recognize; typed text works best.

Our OCR tool supports English and Nepali (eng+nep) and processes scanned PDFs by converting pages to images before recognition.
`,
  },
];

export function findTool(slug: string): ToolRecord | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findBlogPost(slug: string): BlogPostRecord | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
