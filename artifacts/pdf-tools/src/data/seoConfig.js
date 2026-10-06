export const siteName = 'PDFKira';
export const siteUrl = 'https://pdfkira.com';
export const defaultTitle = 'PDFKira – Free Online PDF Tools';
export const defaultDescription = 'Free online PDF tools for merging, splitting, compressing, and converting. Privacy-first, no signup required.';
export const defaultOGImage = 'https://pdfkira.com/logo.png';
export const twitterHandle = '@pdfkira';

export function resolveToolOgImage(slug, fallback = defaultOGImage) {
  if (!slug) return fallback;
  const explicit = toolsSEO[slug]?.ogImage;
  if (explicit) {
    return explicit.startsWith('http') ? explicit : `${siteUrl}${explicit.startsWith('/') ? explicit : `/${explicit}`}`;
  }
  return `${siteUrl}/logo.png?tool=${encodeURIComponent(slug)}`;
}

export const homepageSEO = {
  title: 'PDFKira – Free Online PDF Tools | 22+ Tools, No Signup',
  description: 'Free online PDF tools for merging, splitting, compressing, and converting. 22+ tools, 100% privacy-first, no ads, no signup required.',
  ogImage: defaultOGImage,
};

export const categorySEO = {
  tools: {
    name: 'Tools',
    description: 'Browse PDFKira tools for merging, splitting, converting, compressing, and editing PDF files online for free.',
    toolCount: 26,
  },
  'convert-pdf': {
    name: 'Convert PDF',
    description: 'Convert PDF files into Word, Excel, PowerPoint, images, and other formats without signup.',
    toolCount: 12,
  },
  'edit-pdf': {
    name: 'Edit PDF',
    description: 'Edit, protect, reorder, flatten, watermark, and secure PDFs from anywhere in a browser.',
    toolCount: 10,
  },
};

export const toolsSEO = {
  'merge-pdf': {
    title: 'Merge PDF Files Online Free - Combine Multiple PDFs | PDFKira',
    description: 'Merge PDF files online for free. Combine multiple PDFs in seconds, reorder pages, and download a single clean document.',
    keywords: ['merge pdf online free', 'combine pdfs', 'pdf merger free', 'merge multiple pdfs', 'join pdf files'],
    ogImage: '/og/merge-pdf.svg',
    faqs: [
      { q: 'Is PDF merger free to use?', a: 'Yes, PDFKira merge tool is 100% free and does not require an account.' },
      { q: 'Are my files safe when merging PDFs?', a: 'Absolutely. Your files are processed securely in-browser and deleted after use.' },
      { q: 'What is the maximum file size?', a: 'You can merge most everyday PDFs up to 100MB total in the free workflow.' },
      { q: 'Can I rearrange pages before merging?', a: 'Yes, drag and drop files or pages to set the final order before merging.' },
      { q: 'Is there a limit on number of files?', a: 'You can merge up to 20 PDF files at once in one workflow.' },
    ],
  },
  'split-pdf': {
    title: 'Split PDF Online Free - Extract Pages from PDF | PDFKira',
    description: 'Split PDF files online for free. Extract page ranges or separate each page into a clean new PDF quickly.',
    keywords: ['split pdf online free', 'extract pages from pdf', 'pdf splitter', 'cut pdf pages', 'separate pdf pages'],
    ogImage: '/og/split-pdf.svg',
    faqs: [
      { q: 'Can I split by page ranges?', a: 'Yes, choose exact page ranges or split every page into a separate PDF.' },
      { q: 'Is the split tool free?', a: 'Yes, the PDFKira split tool is free and no signup is required.' },
      { q: 'Will the original file stay unchanged?', a: 'Yes, the original PDF remains intact and the split result is a new file.' },
      { q: 'Can I choose page numbers manually?', a: 'Yes, you can set custom page ranges or define them one by one.' },
      { q: 'Does this work on mobile?', a: 'Yes, it works in the browser on mobile, tablet, and desktop devices.' },
    ],
  },
  'compress-pdf': {
    title: 'Compress PDF Online Free - Reduce PDF File Size | PDFKira',
    description: 'Compress PDF files online for free. Reduce file size without losing readability for sharing, emailing, or uploading.',
    keywords: ['compress pdf online free', 'reduce pdf size', 'pdf compressor free', 'make pdf smaller', 'shrink pdf file'],
    ogImage: '/og/compress-pdf.svg',
    faqs: [
      { q: 'Does PDF compression reduce quality?', a: 'It reduces file size while keeping text and images readable for everyday use.' },
      { q: 'Is the tool free?', a: 'Yes, PDFKira offers compression free to all users without a subscription.' },
      { q: 'Can I compress large PDFs?', a: 'Yes, the tool handles large files and helps with email and upload limits.' },
      { q: 'Will scanned PDFs compress well?', a: 'Scanned documents often compress dramatically without major quality loss.' },
      { q: 'Will I keep the same document layout?', a: 'The layout stays intact while the file is reduced for easier sharing.' },
    ],
  },
  'pdf-to-word': {
    title: 'Convert PDF to Word Online Free | PDFKira',
    description: 'Convert PDF to Word online for free. Turn PDFs into editable DOCX files in seconds with no software required.',
    keywords: ['pdf to word free', 'convert pdf to word online', 'editable pdf to word', 'word from pdf', 'pdf to docx'],
    ogImage: '/og/pdf-to-word.svg',
    faqs: [
      { q: 'Can I edit text after converting?', a: 'Yes, the output is an editable Word document suitable for normal editing.' },
      { q: 'Does formatting stay close to the original?', a: 'The PDFKira tool preserves layout as closely as possible for common documents.' },
      { q: 'Is there a signup requirement?', a: 'No. You can convert PDF to Word completely free in the browser.' },
      { q: 'Does it work with scanned PDFs?', a: 'OCR-capable workflows can improve results for scanned or image-heavy documents.' },
      { q: 'Are files secure?', a: 'Yes. Processing is performed in a secure, privacy-first workflow.' },
    ],
  },
  'word-to-pdf': {
    title: 'Convert Word to PDF Online Free | PDFKira',
    description: 'Convert Word to PDF online for free. Turn DOCX files into polished PDFs in seconds with a secure workflow.',
    keywords: ['word to pdf free', 'convert docx to pdf', 'save word as pdf', 'docx to pdf converter', 'word document to pdf'],
    ogImage: '/og/word-to-pdf.svg',
    faqs: [
      { q: 'Is the conversion free?', a: 'Yes. PDFKira converts Word files to PDF without charging for the basic workflow.' },
      { q: 'Will images and formatting stay intact?', a: 'Most common layouts and image placements carry over well when converting to PDF.' },
      { q: 'Does it work on all devices?', a: 'Yes, the browser conversion works on desktop and mobile.' },
      { q: 'Can I use scanned docs?', a: 'You can convert scanned content if the document is readable and OCR is available.' },
      { q: 'Is the workflow safe?', a: 'Yes, your file is processed securely and quickly in-browser.' },
    ],
  },
  'pdf-to-excel': {
    title: 'Convert PDF to Excel Online Free | PDFKira',
    description: 'Convert PDF to Excel online for free. Extract tables into spreadsheet-friendly output in a fast, browser-based workflow.',
    keywords: ['pdf to excel free', 'convert pdf to xlsx', 'extract table from pdf', 'pdf to spreadsheet', 'pdf table to excel'],
    ogImage: '/og/pdf-to-excel.svg',
    faqs: [
      { q: 'Can I convert tabular PDFs to Excel?', a: 'Yes, this is the ideal workflow for extracting tables and rows into spreadsheets.' },
      { q: 'Will the data stay clean?', a: 'Results are strongest for well-structured tables and regular layouts.' },
      { q: 'Is this tool free?', a: 'Yes, the basic PDF to Excel workflow is free and easy to use.' },
      { q: 'Does it support large files?', a: 'Yes, most moderate-size PDFs work very well in this process.' },
      { q: 'Do I need software installed?', a: 'No. It all runs in your browser with no desktop app required.' },
    ],
  },
  'excel-to-pdf': {
    title: 'Convert Excel to PDF Online Free | PDFKira',
    description: 'Convert Excel to PDF online for free. Save spreadsheets as clean, shareable PDF files with layout retained.',
    keywords: ['excel to pdf free', 'xlsx to pdf', 'convert spreadsheet to pdf', 'excel file to pdf', 'save excel as pdf'],
    ogImage: '/og/excel-to-pdf.svg',
    faqs: [
      { q: 'Will the spreadsheet layout be preserved?', a: 'Yes, PDFKira keeps the tabular layout clean and readable in the final PDF.' },
      { q: 'Is it free to convert?', a: 'Yes, Excel to PDF conversion is available for free in the browser.' },
      { q: 'Can I use large spreadsheets?', a: 'Most standard-sized spreadsheets work well in the workflow.' },
      { q: 'Will formulas remain visible?', a: 'The final document is a PDF snapshot rather than an editable spreadsheet.' },
      { q: 'How fast is the conversion?', a: 'Most files are converted in seconds without any signup process.' },
    ],
  },
  'pdf-to-powerpoint': {
    title: 'Convert PDF to PowerPoint Online Free | PDFKira',
    description: 'Convert PDF to PowerPoint online for free. Turn documents into editable presentation slides in a few clicks.',
    keywords: ['pdf to powerpoint free', 'convert pdf to ppt', 'pdf to presentation', 'pptx from pdf', 'slides from pdf'],
    ogImage: '/og/pdf-to-powerpoint.svg',
    faqs: [
      { q: 'Can I turn PDF slides into PPT?', a: 'Yes, the converter is useful for turning reports and decks into editable slides.' },
      { q: 'Is the tool free?', a: 'Yes, PDFKira lets you convert to PowerPoint for free in the browser.' },
      { q: 'Will formatting stay the same?', a: 'It keeps the layout close to the source for common documents and presentations.' },
      { q: 'Does it support large files?', a: 'Most typical business documents work well with the free workflow.' },
      { q: 'Do I need an account?', a: 'No, the conversion process is available without signup.' },
    ],
  },
  'powerpoint-to-pdf': {
    title: 'Convert PowerPoint to PDF Online Free | PDFKira',
    description: 'Convert PowerPoint to PDF online for free. Create shareable, print-ready versions of presentation files.',
    keywords: ['powerpoint to pdf free', 'ppt to pdf', 'convert slides to pdf', 'pptx to pdf', 'presentation to pdf'],
    ogImage: '/og/powerpoint-to-pdf.svg',
    faqs: [
      { q: 'Is it free to convert PPT to PDF?', a: 'Yes, the conversion is free and easy to do in a browser.' },
      { q: 'Will notes and speaker content be preserved?', a: 'The exported PDF keeps the slide content clean and readable for sharing.' },
      { q: 'Does it support large decks?', a: 'Yes, most standard decks convert quickly and reliably.' },
      { q: 'Do I need extra software?', a: 'No, this runs directly in the browser.' },
      { q: 'Can I share the file by email?', a: 'Yes. PDF files are easy to send and print when shared as a final copy.' },
    ],
  },
  'pdf-to-images': {
    title: 'Convert PDF to Images Online Free | PDFKira',
    description: 'Convert PDF pages to images online for free. Export JPG, PNG, or WebP files in seconds for sharing and design work.',
    keywords: ['pdf to image converter', 'pdf to jpg', 'pdf to png', 'convert pdf pages to images', 'pdf image export'],
    ogImage: '/og/pdf-to-images.svg',
    faqs: [
      { q: 'Can I export one page or all pages?', a: 'Yes, you can export specific page ranges or every page in the document.' },
      { q: 'Which formats are supported?', a: 'JPG, PNG, and WebP export are supported for common workflows.' },
      { q: 'Is it free to use?', a: 'Yes, the tool is free for standard use in the browser.' },
      { q: 'Do I need special software?', a: 'No. You can export images directly in the browser.' },
      { q: 'Will the image quality be good?', a: 'The output is optimized for common design, archiving, and sharing use cases.' },
    ],
  },
  'images-to-pdf': {
    title: 'Convert Images to PDF Online Free | PDFKira',
    description: 'Convert images to PDF online for free. Combine JPG, PNG, or WebP images into a single, shareable PDF document.',
    keywords: ['jpg to pdf', 'image to pdf converter', 'png to pdf', 'convert photos to pdf', 'webp to pdf'],
    ogImage: '/og/images-to-pdf.svg',
    faqs: [
      { q: 'Can I combine multiple images in one PDF?', a: 'Yes, you can upload multiple images and convert them into one PDF file.' },
      { q: 'Is there a file size limit?', a: 'Most standard image batches work well within the free workflow.' },
      { q: 'Do I need to pay?', a: 'No. The image-to-PDF workflow is free for regular use.' },
      { q: 'Can I reorder images before export?', a: 'Yes, you can arrange images in the desired order before creating the PDF.' },
      { q: 'Is it safe to upload images?', a: 'Yes. The browser-based process keeps the workflow privacy-first.' },
    ],
  },
  'pdf-to-text': {
    title: 'Extract Text from PDF Online Free | PDFKira',
    description: 'Extract text from PDF online for free. Copy readable text from documents and scanned PDFs with a browser-based workflow.',
    keywords: ['extract text from pdf', 'copy text from pdf', 'pdf text extractor', 'scanned pdf to text', 'ocr pdf text'],
    ogImage: '/og/pdf-to-text.svg',
    faqs: [
      { q: 'Can I pull text from scanned PDFs?', a: 'Yes, OCR support improves results for scanned document workflows.' },
      { q: 'Is the output editable?', a: 'Yes, extracted text can be copied and used in other documents or editors.' },
      { q: 'Is this free?', a: 'Yes. PDFKira keeps the text extraction workflow free to use.' },
      { q: 'Is the text quality high?', a: 'Quality is best on clean, legible PDFs and clear scans.' },
      { q: 'Do I need software?', a: 'No. Everything runs directly in the browser.' },
    ],
  },
  'latex-to-text': {
    title: 'LaTeX to Plain Equation Text Online Free | PDFKira',
    description: 'Convert LaTeX equations to readable plain text, copy MathML for Word, and export a PNG fallback for Google Docs workflows.',
    keywords: ['latex to text', 'latex equation plain text', 'mathml to word', 'latex to unicode equation', 'equation converter'],
    ogImage: '/og/latex-to-text.svg',
    faqs: [
      { q: 'What does the default output do?', a: 'The default option converts LaTeX to readable plain Unicode text that works well in Word, Docs, Notion, and other editors.' },
      { q: 'Why is there a separate Word option?', a: 'Word-specific MathML paste is useful when you want a native equation object, but the plain-text output is the best default for editable content.' },
      { q: 'Is the conversion browser-only?', a: 'Yes. All conversion and export logic runs client-side in the browser with KaTeX and custom conversion logic.' },
      { q: 'When should I use the PNG fallback?', a: 'Use the image export for Google Docs when you need a quick visual equation and the default plain-text option is not the right fit.' },
    ],
  },
  'ocr-pdf': {
    title: 'OCR PDF Online Free - Extract Text from Scanned PDFs | PDFKira',
    description: 'OCR PDF online for free. Extract text from scanned PDFs and images with secure, browser-based recognition.',
    keywords: ['ocr pdf free', 'convert scanned pdf to text', 'pdf ocr online', 'extract text from image pdf', 'scan pdf to text'],
    ogImage: '/og/ocr-pdf.svg',
    faqs: [
      { q: 'Does OCR support scanned PDFs?', a: 'Yes, scanned documents are a primary use case for OCR processing.' },
      { q: 'Is OCR free on PDFKira?', a: 'Yes, the OCR workflow is free and available without a signup.' },
      { q: 'Will it read handwriting?', a: 'It works best with clear printed text and good-quality scans.' },
      { q: 'Can I export the extracted text?', a: 'Yes, the output can be copied or exported as text.' },
      { q: 'Does it work in a browser?', a: 'Yes, OCR runs directly in the browser for convenience and speed.' },
    ],
  },
  'rotate-pdf': {
    title: 'Rotate PDF Pages Online Free | PDFKira',
    description: 'Rotate PDF pages online for free. Fix portrait or landscape orientation in seconds without leaving the browser.',
    keywords: ['rotate pdf pages', 'pdf page rotation', 'fix pdf orientation', 'rotate pages online', 'turn pdf sideways'],
    ogImage: '/og/rotate-pdf.svg',
    faqs: [
      { q: 'Can I rotate all pages at once?', a: 'Yes, you can rotate every page or choose a selected page range.' },
      { q: 'Is the tool free?', a: 'Yes, rotating PDF pages is a free tool on PDFKira.' },
      { q: 'Does it preserve the document layout?', a: 'Yes, the new orientation is applied while the document remains intact.' },
      { q: 'Can I choose 90-degree increments?', a: 'Yes, rotate by 90°, 180°, or 270° as needed.' },
      { q: 'Does it work on tablets?', a: 'Yes, it works on mobile devices and desktop browsers.' },
    ],
  },
  'reorder-pages': {
    title: 'Reorder PDF Pages Online Free | PDFKira',
    description: 'Reorder PDF pages online for free. Drag and drop page thumbnails to build the correct sequence in seconds.',
    keywords: ['reorder pdf pages', 'change pdf page order', 'drag and drop pdf pages', 'sort pdf pages online', 'move pdf pages'],
    ogImage: '/og/reorder-pages.svg',
    faqs: [
      { q: 'Can I reorder a page sequence easily?', a: 'Yes, the drag-and-drop interface makes it simple to build the final order.' },
      { q: 'Is there a limit on number of pages?', a: 'Most normal PDF documents work well with the free workflow.' },
      { q: 'Does it cost money?', a: 'No, it is available free on PDFKira.' },
      { q: 'Can I reorder pages without splitting?', a: 'Yes, the organizer keeps the document as one PDF while you restructure it.' },
      { q: 'Does it require installation?', a: 'No, it runs entirely in the browser.' },
    ],
  },
  'add-watermark': {
    title: 'Add Watermark to PDF Online Free | PDFKira',
    description: 'Add watermark to PDF online for free. Add text or image branding to protect documents and mark ownership.',
    keywords: ['add watermark to pdf', 'watermark pdf online', 'pdf watermark free', 'brand pdf document', 'watermark pdf tool'],
    ogImage: '/og/add-watermark.svg',
    faqs: [
      { q: 'Can I add text watermarks?', a: 'Yes, add custom text such as confidential, draft, or company name.' },
      { q: 'Can I use image watermarks?', a: 'Yes, upload a logo or branding asset and position it as needed.' },
      { q: 'Is it free?', a: 'Yes, watermarking is free on PDFKira.' },
      { q: 'Can I control transparency?', a: 'Yes, you can adjust placement and visibility to keep the PDF readable.' },
      { q: 'Does it work on all pages?', a: 'Yes, the watermark can be applied to every page or selected pages.' },
    ],
  },
  'protect-pdf': {
    title: 'Protect PDF Online Free - Add Password Security | PDFKira',
    description: 'Protect PDF online for free. Add password protection and document security in a simple browser workflow.',
    keywords: ['password protect pdf', 'secure pdf with password', 'pdf encryption free', 'lock pdf file', 'encrypt pdf online'],
    ogImage: '/og/protect-pdf.svg',
    faqs: [
      { q: 'Can I lock a PDF with a password?', a: 'Yes, PDFKira lets you add password security to important documents.' },
      { q: 'Is the tool free?', a: 'Yes, the password protection workflow is free.' },
      { q: 'Can I protect confidential files?', a: 'Yes, it is useful for contracts, statements, and sensitive records.' },
      { q: 'Will the file stay encrypted?', a: 'The final result is secure and protected by the password you set.' },
      { q: 'Does it require an app?', a: 'No, the browser-based security workflow works without installing software.' },
    ],
  },
  'unlock-pdf': {
    title: 'Unlock PDF Online Free | PDFKira',
    description: 'Unlock PDF online for free. Remove password protection from files you own and can legally access.',
    keywords: ['unlock pdf online', 'remove pdf password', 'pdf password remover free', 'decrypt pdf', 'open protected pdf'],
    ogImage: '/og/unlock-pdf.svg',
    faqs: [
      { q: 'Is unlocking a PDF free?', a: 'Yes, the workflow is free on PDFKira.' },
      { q: 'Can I use it for my own documents?', a: 'Yes, only remove restrictions from documents you are legally allowed to access.' },
      { q: 'Does it work with secure files?', a: 'Yes, it is designed to help with legitimate document access workflows.' },
      { q: 'Do I need software?', a: 'No, it is a browser-based service.' },
      { q: 'Is the process safe?', a: 'Yes, PDFKira processes files in a privacy-first environment.' },
    ],
  },
  'sign-pdf': {
    title: 'Sign PDF Online Free - Add Signature to PDF | PDFKira',
    description: 'Sign PDF online for free. Add electronic signatures, initials, or approval marks to your documents in seconds.',
    keywords: ['sign pdf online free', 'add signature to pdf', 'electronic signature pdf', 'pdf signer', 'digital sign pdf'],
    ogImage: '/og/sign-pdf.svg',
    faqs: [
      { q: 'Can I add my signature to a PDF?', a: 'Yes, upload the document and place your signature or initials on the page.' },
      { q: 'Is it free to sign PDFs?', a: 'Yes, the basic signature workflow is free.' },
      { q: 'Does it work on forms?', a: 'Yes, it is useful for approval forms and document sign-off workflows.' },
      { q: 'Can I add multiple signatures?', a: 'Yes, you can place signatures across multiple pages or positions.' },
      { q: 'Is it secure?', a: 'Yes, the signing workflow is safe and browser-based.' },
    ],
  },
  'flatten-pdf': {
    title: 'Flatten PDF Online Free | PDFKira',
    description: 'Flatten PDF online for free. Lock form fields and annotations so documents stay final for sharing and printing.',
    keywords: ['flatten pdf online', 'make pdf uneditable', 'flatten pdf form', 'pdf flattening free', 'lock annotations pdf'],
    ogImage: '/og/flatten-pdf.svg',
    faqs: [
      { q: 'What does flattening do?', a: 'It converts form fields and comments into final static content.' },
      { q: 'Is the tool free?', a: 'Yes, flattening is available free on PDFKira.' },
      { q: 'Why would I flatten a file?', a: 'It prevents later edits before sharing, printing, or archiving.' },
      { q: 'Can I flatten forms?', a: 'Yes, it is commonly used on forms and annotated documents.' },
      { q: 'Will the result stay readable?', a: 'Yes, flattening keeps the document final while preserving layout.' },
    ],
  },
  'pdf-to-pdfa': {
    title: 'Convert PDF to PDF/A Online Free | PDFKira',
    description: 'Convert PDF to PDF/A online for free. Create archival-friendly PDF documents for long-term preservation and compatibility.',
    keywords: ['pdf to pdfa', 'pdfa conversion free', 'archival pdf format', 'pdf a converter', 'convert pdf to archive format'],
    ogImage: '/og/pdf-to-pdfa.svg',
    faqs: [
      { q: 'What is PDF/A?', a: 'PDF/A is a long-term archival format designed for stable document preservation.' },
      { q: 'Why would I use it?', a: 'It is ideal for long-term storage, compliance, and recordkeeping.' },
      { q: 'Is it free to convert?', a: 'Yes, the PDF/A conversion flow is free in the browser.' },
      { q: 'Will the layout stay intact?', a: 'The file is optimized for preservation while preserving readability.' },
      { q: 'Does it require special software?', a: 'No, the workflow is browser-based and easy to use.' },
    ],
  },
  'compress-images': {
    title: 'Compress Images Online Free | PDFKira',
    description: 'Compress images online for free. Reduce file sizes for documents, uploads, and everyday sharing without heavy quality loss.',
    keywords: ['compress images online', 'reduce image size', 'shrink jpg files', 'image compressor free', 'optimize picture size'],
    ogImage: '/og/compress-images.svg',
    faqs: [
      { q: 'Does the tool work on JPG and PNG?', a: 'Yes, common image formats work well in the compression workflow.' },
      { q: 'Is it free?', a: 'Yes, the image optimizer is available free on PDFKira.' },
      { q: 'Will image quality stay acceptable?', a: 'It balances file size reduction with readability and clarity.' },
      { q: 'Can I use it for web uploads?', a: 'Yes, it is useful for email, uploads, and web projects.' },
      { q: 'Does it require signup?', a: 'No, all standard use is available without an account.' },
    ],
  },
};
