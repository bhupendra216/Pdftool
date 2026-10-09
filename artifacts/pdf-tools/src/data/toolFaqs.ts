export interface ToolFaq { question: string; answer: string; }

export const suppliedToolFaqs: Record<string, ToolFaq[]> = {
  'merge-pdf': [
    { question: "How many PDFs can I merge at once?", answer: "You can combine as many files as you need in a single session. For very large batches, merging in groups of 10–20 files keeps the browser responsive." },
    { question: "Will the page order inside each PDF be preserved?", answer: "Yes. Pages merge in exactly the order you arrange the files, and each file's internal page order stays untouched." },
    { question: "Can I merge PDFs with different page sizes?", answer: "Yes. A4, Letter, and mixed-orientation files merge into one document; each page keeps its original dimensions." },
    { question: "Does merging reduce quality or add a watermark?", answer: "No. Pages are combined losslessly — no recompression, no watermark, no quality loss." },
    { question: "Is my file uploaded to a server?", answer: "Merging runs entirely in your browser whenever possible. Nothing is stored and no account is needed." },
  ],
  'split-pdf': [
    { question: "How can I split a PDF?", answer: "Choose to extract every page as a separate file, or select specific page ranges — for example, pages 1–5 as one file and pages 6–10 as another." },
    { question: "Is there a page limit for splitting?", answer: "PDFs up to 20 pages split smoothly in your browser. Larger documents may take longer depending on your device." },
    { question: "Will each split file keep the original formatting?", answer: "Yes. Splitting is lossless — every output page is byte-identical in content to the original." },
    { question: "Can I split a password-protected PDF?", answer: "You'll need to unlock it first with our Unlock PDF tool (provided you know the password), then split the unlocked copy." },
  ],
  'compress-pdf': [
    { question: "How much smaller will my PDF get?", answer: "Most documents shrink by 50–80%. Exact results depend on the content — image-heavy PDFs compress the most, while text-only files have less room to shrink." },
    { question: "Will compression hurt quality?", answer: "Our compression targets invisible quality loss: images are re-encoded at a level designed to look identical on screen. For maximum shrink, try the strongest setting and compare before replacing your original." },
    { question: "Can I compress a PDF for email under 2MB?", answer: "Yes. Choose the target size if available, or run the strongest compression — most documents drop under common email limits." },
    { question: "Does compression remove fonts or break forms?", answer: "Standard text, fonts, and form fields are preserved. Review the output if your PDF contains interactive forms or annotations." },
  ],
  'edit-pdf': [
    { question: "What can I edit in a PDF?", answer: "You can replace existing text, add new text, and visually delete text blocks. The download happens directly in your browser." },
    { question: "Will the fonts match my original document?", answer: "Edit PDF uses embedded-compatible fonts matched as closely as possible. Complex layouts or decorative typefaces may not match exactly — review the preview before downloading." },
    { question: "Can I edit a scanned PDF?", answer: "Scanned pages are images, not text. Use OCR PDF first to make the text selectable, then edit." },
    { question: "Does editing work on any PDF?", answer: "PDFs with strong security restrictions may block editing. Unlock the file first if you own it." },
  ],
  'sign-pdf': [
    { question: "How do I add a signature to a PDF?", answer: "Draw with your mouse or finger, type your name in a signature font, or upload an image of your signature. Place and resize it anywhere on the document." },
    { question: "Is a PDFKira signature legally binding?", answer: "A drawn signature marks intent, but legal validity depends on your jurisdiction and whether the document requires a certified digital signature (with certificate). For contracts requiring certification, use a dedicated e-signature service." },
    { question: "Does signing happen in my browser?", answer: "Yes. The signature is applied locally and the file downloads straight from your browser — no upload required." },
    { question: "Can I add the date next to my signature?", answer: "Yes — add a text field alongside your signature and type the date, or include it when typing your signature." },
  ],
  'pdf-to-excel': [
    { question: "How accurate is the table extraction?", answer: "PDF to Excel works best on tables with clear borders and aligned columns. Complex layouts may need light cleanup in Excel after conversion." },
    { question: "Does it work on scanned PDFs?", answer: "Scanned documents have no text layer. Run OCR PDF first, then convert the OCR'd file for best results." },
    { question: "What Excel format do I get?", answer: "Your tables are exported as a standard .xlsx workbook, compatible with Excel, Google Sheets, and LibreOffice Calc." },
    { question: "Are merged cells preserved?", answer: "Simple tables convert cleanly. Heavily merged or nested layouts may flatten — always review the output against the original." },
  ],
  'ocr-pdf': [
    { question: "What languages does OCR support?", answer: "OCR PDF currently supports English and Nepali, with more languages planned. Language availability is shown when you start OCR." },
    { question: "What does OCR actually do?", answer: "It converts scanned pages — which are images of text — into real, selectable, searchable text while keeping the visual appearance of the page." },
    { question: "Will OCR change how my document looks?", answer: "No. The scan stays visually identical; a hidden text layer is added underneath so you can search and copy." },
    { question: "How long does OCR take?", answer: "A typical 10-page scan processes in under a minute in your browser. Longer documents take proportionally longer since everything runs on your device." },
    { question: "Can I OCR a handwritten document?", answer: "OCR is designed for printed text. Neat handwriting may partially work, but expect errors." },
  ],
  'transform-pdf': [
    { question: "What effects can I apply?", answer: "Choose from vintage paper textures, scanned-document looks, creases, and sepia tones to make a PDF look like a physical aged or scanned document." },
    { question: "Why would I want to age a PDF?", answer: "Common uses include design mockups, film/photo props, themed invitations, and presentation styling." },
    { question: "Does the effect change the text content?", answer: "No — text remains selectable and searchable; the effect is a visual layer on top of the pages." },
    { question: "Can I control how strong the effect is?", answer: "Yes, adjust the intensity before applying so the result ranges from subtly worn to heavily aged." },
  ],
  'image-converter': [
    { question: "Which formats can I convert between?", answer: "Convert between JPG, PNG, WEBP, and other common image formats, directly in your browser." },
    { question: "Does converting reduce image quality?", answer: "Converting between lossless formats (PNG, WEBP lossless) keeps full quality. Converting to JPG applies standard compression — choose the highest quality setting for minimal loss." },
    { question: "Can I convert multiple images at once?", answer: "Yes, batch conversion is supported — add all your images and download them individually or as a zip." },
    { question: "Are my images uploaded anywhere?", answer: "No. Conversion runs locally in your browser; your images never leave your device." },
  ],
  'pdf-to-word': [
    { question: "Will the Word document look exactly like my PDF?", answer: "PDF to Word reproduces text, images, and basic layout faithfully. Complex columns, tables, or custom fonts may need minor adjustment after conversion." },
    { question: "Does it handle scanned PDFs?", answer: "Scanned PDFs need OCR first. Run OCR PDF, then convert the resulting file to Word." },
    { question: "What format do I get?", answer: "An editable .docx file compatible with Microsoft Word, Google Docs, and LibreOffice Writer." },
    { question: "Are headers, footers, and page numbers preserved?", answer: "Yes, they're converted as editable text in the Word document." },
  ],
  'pdf-to-markdown': [
    { question: "Why convert a PDF to Markdown?", answer: "Markdown is plain text that's perfect for documentation, note apps, websites, and AI workflows (like pasting into chatbots or knowledge bases)." },
    { question: "What happens to images and tables?", answer: "Text structure converts to Markdown headings, lists, and links. Tables become Markdown tables; images are extracted or referenced depending on the document." },
    { question: "Will formatting like bold and italics survive?", answer: "Yes. Emphasis, headings, and lists are mapped to their Markdown equivalents automatically." },
    { question: "Is it good for AI training data or RAG pipelines?", answer: "Yes — clean Markdown is one of the best formats for feeding documents to AI tools, which is why we built this converter." },
  ],
  'word-to-pdf': [
    { question: "Will my Word formatting survive the conversion?", answer: "Fonts, images, tables, and page layout are converted to match your Word document as closely as possible." },
    { question: "What file types can I convert?", answer: "Upload .docx files for the most accurate conversion. Older .doc files work best if saved as .docx first." },
    { question: "Can I convert multiple Word files at once?", answer: "Yes — batch conversion is supported, and you can merge the results into a single PDF if needed." },
    { question: "Is the output print-ready?", answer: "Yes. The PDF uses standard page dimensions, ready for printing, sharing, or uploading to portals." },
  ],
  'jpg-to-pdf': [
    { question: "Can I combine several JPGs into one PDF?", answer: "Yes. Add images in any order, rearrange them by dragging, and export a single multi-page PDF." },
    { question: "What page size will the PDF use?", answer: "Each image is placed on its own page sized to fit the image. Choose A4 or Letter if you need standard document pages." },
    { question: "Will my images be compressed?", answer: "Images are embedded at their original resolution unless the file would be unnecessarily large — quality is preserved by default." },
    { question: "Can I convert from other formats too?", answer: "Yes — PNG and WEBP images work the same way." },
  ],
  'pdf-to-jpg': [
    { question: "What image quality do I get?", answer: "Pages export as high-resolution JPGs suitable for sharing, printing, and embedding in other documents." },
    { question: "Can I export only some pages?", answer: "Yes. Select specific pages or a range instead of converting the whole document." },
    { question: "What DPI is used?", answer: "Pages export at 150 DPI by default. Higher DPI options are available for print-quality output." },
    { question: "Will each page be a separate image?", answer: "Yes — every page becomes its own JPG file, downloadable individually or as a zip archive." },
  ],
  'image-resize': [
    { question: "Can I resize to exact pixel dimensions?", answer: "Yes. Enter width and height in pixels, or lock the aspect ratio and change one dimension — the other adjusts automatically." },
    { question: "Will resizing make my image blurry?", answer: "Shrinking generally keeps images sharp. Enlarging adds pixels (interpolation) which softens detail — use Image Upscale for enlargements." },
    { question: "Can I resize multiple images at once?", answer: "Yes. Batch resize applies your dimensions to every uploaded image, and you can download them as a zip." },
    { question: "Which formats are supported?", answer: "JPG, PNG, and WEBP images can all be resized in your browser." },
  ],
  'image-compress': [
    { question: "How much smaller will my image get?", answer: "Typical reductions are 60–90% depending on the original format and content." },
    { question: "What's the difference between compress and resize?", answer: "Compress reduces file size by re-encoding; resize changes dimensions. Compressing keeps the exact same pixel dimensions." },
    { question: "Can I choose the quality level?", answer: "Yes — pick a quality preset, and see the resulting file size before downloading." },
    { question: "Does it support WEBP?", answer: "Yes, and converting to WEBP often gives the smallest file sizes with great quality." },
  ],
  'image-upscale': [
    { question: "How much can I enlarge an image?", answer: "Upscale typically increases resolution 2× or 4× depending on the source image and settings available." },
    { question: "How does upscaling work without blurring?", answer: "The upscaler generates new detail using AI-based interpolation, producing sharper enlargements than simple stretching." },
    { question: "What images upscale best?", answer: "Photos and clean graphics upscale well. Very small or heavily compressed images have less source data to work with." },
    { question: "Is there a size limit?", answer: "Images up to 20 MP process in your browser. Larger files may be limited by device memory." },
  ],
  'remove-background': [
    { question: "How does background removal work?", answer: "AI segmentation detects the foreground subject and cuts everything else, producing a transparent PNG." },
    { question: "What images work best?", answer: "Clear subjects with defined edges — people, products, objects — work best. Busy or similarly-colored backgrounds may need a retry." },
    { question: "What format is the output?", answer: "PNG with a transparent background, ready for design tools, marketplaces, or documents." },
    { question: "Can I remove backgrounds from multiple images?", answer: "Yes, batch processing is supported in your browser." },
  ],
  'add-background': [
    { question: "Can I replace a background instead of just removing it?", answer: "Yes. The tool removes the existing background and composites your new background color or image behind the subject." },
    { question: "What background can I add?", answer: "Choose a solid color, a gradient, or upload your own background image." },
    { question: "Will the subject's edges look natural?", answer: "Yes — feathering around edges keeps the cutout looking clean against the new background." },
    { question: "What format is the result?", answer: "A finished JPG or PNG, depending on whether you need transparency." },
  ],
  'rotate-pdf': [
    { question: "Can I rotate just one page?", answer: "Yes. Select individual pages and rotate them 90°, 180°, or 270° — other pages stay untouched." },
    { question: "Can I rotate all pages at once?", answer: "Yes — apply rotation to the entire document in one click." },
    { question: "Is rotation permanent?", answer: "The rotation is baked into the saved file, so it displays correctly in every viewer." },
    { question: "Does rotating change page content?", answer: "No. Rotation only changes orientation; content, quality, and file size are unaffected." },
  ],
  'delete-pages': [
    { question: "Can I delete several pages at once?", answer: "Yes. Select multiple pages — including ranges like 5–12 — and delete them in one action." },
    { question: "Can I undo a deletion before downloading?", answer: "Yes. Deletions apply only to the preview. Restore pages or re-upload if you change your mind before saving." },
    { question: "Will deleting pages renumber the rest?", answer: "Yes. The saved PDF contains only the remaining pages, renumbered automatically." },
    { question: "Does deleting pages reduce file size?", answer: "Yes — removed pages and their content are excluded from the output file." },
  ],
  'extract-pages': [
    { question: "What's the difference between Extract and Split?", answer: "Extract pulls selected pages into one new PDF; Split divides a document into multiple files by ranges or every-page-separate." },
    { question: "Can I extract non-sequential pages?", answer: "Yes — pick pages 1, 4, and 9 and they combine into one new document in that order." },
    { question: "Will extracted pages keep their quality?", answer: "Yes. Extraction is lossless — no recompression or quality change." },
    { question: "Can I extract the same pages into multiple files?", answer: "Run the tool multiple times with different selections, or use Split PDF for multi-output division." },
  ],
  'unlock-pdf': [
    { question: "What does Unlock PDF do?", answer: "It removes a known password (owner password / open password you possess) so you can freely open, print, or edit the file." },
    { question: "Can it recover a password I forgot?", answer: "No. PDFKira never attempts password cracking — that would be a security risk. Unlock only works when you know the current password." },
    { question: "Will unlocking remove editing restrictions?", answer: "Yes. Once unlocked, printing, copying, and editing restrictions are cleared." },
    { question: "Is unlocking someone's encrypted PDF legal?", answer: "Only unlock files you own or have explicit permission to modify." },
  ],
  'protect-pdf': [
    { question: "How strong is the password protection?", answer: "Protect PDF applies standard PDF encryption with your chosen password. Use a long, unique password for sensitive documents." },
    { question: "What can a password-protected PDF still show?", answer: "That depends on the restrictions you set — you can block printing, editing, and copying independently." },
    { question: "Can I remove the password later?", answer: "Yes — use Unlock PDF with your own password whenever you need unrestricted access." },
    { question: "Can recipients open it without special software?", answer: "Yes. Any standard PDF viewer (Acrobat, browsers, Preview) will prompt for the password." },
  ],
  'watermark-pdf': [
    { question: "Can I add both text and image watermarks?", answer: "Yes. Type custom text (with font and color options) or upload a logo/image to stamp across pages." },
    { question: "Can I control watermark position and opacity?", answer: "Yes — set position (center, diagonal, corners), rotation, size, and transparency for a subtle or bold effect." },
    { question: "Will the watermark appear on every page?", answer: "By default, yes. You can also apply it to selected pages only." },
    { question: "Does watermarking protect my document?", answer: "A watermark deters casual misuse and marks ownership, but it's visible deterrence — combine with Protect PDF for real security." },
  ],
  'add-page-numbers': [
    { question: "Where can page numbers be placed?", answer: "Choose corners or center, top or bottom margins — with font size and style options." },
    { question: "Can I skip the first page?", answer: "Yes. Common for cover pages — numbering can start from page 2, or start at any number you choose." },
    { question: "Can I use formats like \"Page 3 of 20\"?", answer: "Yes. Prefix, suffix, and total-count formats (\"3 / 20\") are supported." },
    { question: "Will numbering change my document content?", answer: "No. Numbers are placed in the margin area without overlapping or altering existing content." },
  ],
  'ocr-image-to-text': [
    { question: "Which image formats work?", answer: "JPG, PNG, and WEBP images containing printed text convert to editable text." },
    { question: "How accurate is it?", answer: "Clear, high-contrast images reach high accuracy. Blurry, skewed, or handwritten text reduces accuracy." },
    { question: "Which languages are supported?", answer: "English and Nepali are currently supported, matching our OCR PDF tool." },
    { question: "What can I do with the extracted text?", answer: "Copy it directly, or paste into documents, notes, translators, or AI tools." },
  ],
  'qr-code-generator': [
    { question: "What can I put in a QR code?", answer: "Any link or URL — websites, payment links, social profiles, download links, and more." },
    { question: "What size should I download?", answer: "For screens, standard size is fine. For print (posters, business cards), download the largest size so it scans crisply." },
    { question: "Do the QR codes expire?", answer: "No. QR codes are static images — they work forever and track no one." },
    { question: "Can I customize the color?", answer: "Yes — choose colors that match your brand while keeping enough contrast to scan reliably." },
  ],
};

export function getSuppliedToolFaqs(slug: string): ToolFaq[] | undefined {
  return suppliedToolFaqs[slug];
}
