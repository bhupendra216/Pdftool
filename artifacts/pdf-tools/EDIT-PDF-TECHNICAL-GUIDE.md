# Edit PDF: Technical Guide

This guide describes the current PDFKira Edit PDF implementation in `artifacts/pdf-tools`. It is based on the code in the repository; it is not a promise that every PDF feature or font will be preserved perfectly.

## At a glance

Edit PDF is a browser-side React tool for changing text on existing PDF pages, adding text, and visually removing text. It uses PDF.js to inspect and render the source document, `pdf-lib` to create the edited PDF, and FileSaver.js to download the result. The selected PDF is read into browser memory and is not uploaded by this editor. The current file-size limit is 50 MB.

The page is served at `/tools/edit-pdf`. The route loads [`edit-pdf.tsx`](src/pages/edit-pdf.tsx), which renders [`edit-pdf-mvp.tsx`](src/pages/edit-pdf-mvp.tsx); that file re-exports [`PdfTextEditor.tsx`](src/pages/PdfTextEditor.tsx), where the editor behavior lives.

## Libraries and responsibilities

| Library | Use in Edit PDF |
| --- | --- |
| React | Editor state, controls, and page interaction. |
| `pdfjs-dist` (PDF.js) | Opens the source PDF, extracts text items and font metadata, and renders page previews and thumbnails to canvas. Its worker is configured from `pdf.worker.min.mjs`. |
| `pdf-lib` | Loads and copies source pages, embeds subsetted TTF fonts through fontkit, draws masks and replacement text, adds highlights, underlines and link annotations, and serializes the output PDF. |
| `@pdf-lib/fontkit` | Parses bundled fonts and supports custom-font embedding in `pdf-lib`. |
| `file-saver` | Saves the generated PDF as `<original-name>-edited.pdf`. |
| `lucide-react` | Supplies the editor toolbar icons. |

The editor's supporting code groups text into lines in [`pdf-text-lines.ts`](src/lib/pdf-text-lines.ts), converts between PDF points and preview coordinates in [`pdf-coords.ts`](src/lib/pdf-coords.ts), and handles image-only PDF creation in [`image-only-pdf.ts`](src/lib/image-only-pdf.ts).

## How a document moves through the editor

1. The user chooses or drops a PDF. The editor checks the file type and rejects files larger than 50 MB. Password-protected PDFs are not opened; the interface directs users to the Unlock PDF tool first.
2. PDF.js reads the file in the browser, extracts text spans and their geometry, and renders pages and thumbnails to canvas. Text spans close to one another on the same baseline are grouped into editable lines.
3. The user selects a line to edit, double-clicks to open its text editor, or chooses **Add Text** and clicks on a page. Edits are held in React state; undo and redo track committed changes.
4. On download, `pdf-lib` copies the source pages and draws the changes over them. Replacement or deleted text is covered by an opaque rectangle whose color is sampled from the nearby rendered page. Replacement or added text is drawn over that mask using the selected style and position.
5. The output bytes are saved locally through FileSaver.js. No Edit PDF API request is involved in this flow.

PDF coordinates are measured in points, while the interactive preview is rendered at scaled pixel dimensions. The coordinate helpers convert between those spaces so moving and resizing a textbox remains aligned with the page.

## Editing and formatting

The editor supports changing extracted text, adding a new text box, moving and resizing text boxes, setting alignment, changing text color and size, bold and italic styles, underline, highlight color, and adding an HTTP, HTTPS, or mailto link. Existing font sizes are preserved and rounded to two decimals; values typed by the user are constrained to 8–72 points. **Center on page** centers measured text width on the visible page bounds, while **Fit to margins** uses margins inferred from body-sized text lines. A line edit replaces the grouped line as one edit rather than preserving each original text run independently. Wrapping and positioning use the selected embedded font's metrics.

Undo and redo apply to committed edits. The page preview is a rendered canvas with a separate overlay for pending changes; it is not a full in-place reconstruction of the original PDF content stream.

## Fonts: picker names and embedded files

The font picker and font detection logic are in [`registry.ts`](src/lib/fonts/registry.ts). The picker offers these family names or compatibility aliases:

- Compatible aliases: Liberation Sans (Arial), Liberation Serif (Times New Roman), Liberation Mono (Courier New), Carlito (Calibri), Caladea (Cambria), and Gelasio (Georgia).
- Sans-serif: DejaVu Sans, Noto Sans, Lato, Open Sans, Roboto, and Source Sans 3.
- Serif: DejaVu Serif, Noto Serif, and Merriweather.
- Display: Montserrat.

Font detection normalizes common PDF font names and maps aliases to one of those choices. For unknown names it first uses PDF.js font flags (serif, monospace, bold, and italic), then serif/monospace name hints, and finally Liberation Sans. The UI keeps a fallback marker and names the selected family and reason.

Every picker family has bundled regular, bold, italic, and bold-italic TTF assets under `public/fonts/edit/`. Fonts load only when a selected family/style is needed, are embedded as subsets through `@pdf-lib/fontkit`, and use the same `pdf-lib` metrics in preview and export. Characters missing from the selected face are emitted with the bundled Noto Sans fallback. Font files and license notices ship with the app; no runtime font-provider request is made.

## Deletion, flattening, and document fidelity

Text replacement masks the original line's full horizontal bounds using its baseline-relative ascent/descent, with 1.5 pt padding. The background color is sampled from an exterior pixel ring using per-channel medians. Replacement text is drawn on the original PDF baseline; wrapped lines advance using the selected font's measured line height. Replacement does not rewrite the source text object, so the editor is not a secure redaction tool. Use a dedicated redaction workflow for sensitive information and verify the resulting file independently.

When an edit is marked as a deletion, only pages containing deletions are rendered as image-only pages. Other pages are copied as PDF pages, so their text remains selectable. Affected pages lose normal searchable/selectable text and may lose interactive or structural PDF features. The interface continues to warn that deletion is visual only and recommends a dedicated redaction tool for sensitive content.

More generally, the export path is designed for common text changes, not for preserving every advanced PDF feature. Complex layouts, scanned pages without an OCR text layer, forms, annotations, unusual encodings, and embedded/custom fonts require careful review after download. Scanned page images have no selectable text for this editor to identify; use OCR before editing if you need to work with their text.

## Key source files

- [`src/pages/edit-pdf.tsx`](src/pages/edit-pdf.tsx): route-level page metadata and page composition.
- [`src/pages/edit-pdf-mvp.tsx`](src/pages/edit-pdf-mvp.tsx): compatibility re-export for the active editor.
- [`src/pages/PdfTextEditor.tsx`](src/pages/PdfTextEditor.tsx): file loading, rendering, editing state, controls, and PDF export.
- [`src/lib/fonts/registry.ts`](src/lib/fonts/registry.ts): font aliases, fallback detection, lazy font loading, fontkit embedding, and shared text metrics.
- [`src/lib/pdf-text-lines.ts`](src/lib/pdf-text-lines.ts): grouping extracted text spans into edit lines.
- [`src/lib/pdf-coords.ts`](src/lib/pdf-coords.ts): PDF-point and viewport coordinate conversion.
- [`src/lib/image-only-pdf.ts`](src/lib/image-only-pdf.ts): replacement-page rasterization while copying non-deletion pages unchanged.
- [`src/lib/pdf-text-fidelity.test.ts`](src/lib/pdf-text-fidelity.test.ts): Node canvas/PDF.js checks for font rendering, baseline preservation, and descender masks.