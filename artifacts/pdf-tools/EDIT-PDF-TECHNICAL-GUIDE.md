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
| `harfbuzzjs` | Shapes non-ASCII text into glyph IDs, outlines, advances, and offsets. |
| `bidi-js` | Resolves bidirectional levels for supported mixed text; Devanagari-containing edits preserve logical left-to-right order. |
| `svgpath` | Scales and positions HarfBuzz glyph outlines as PDF vector paths. |
| `file-saver` | Saves the generated PDF as `<original-name>-edited.pdf`. |
| `lucide-react` | Supplies the editor toolbar icons. |

The editor's supporting code groups text into lines in [`pdf-text-lines.ts`](src/lib/pdf-text-lines.ts), converts between PDF points and preview coordinates in [`pdf-coords.ts`](src/lib/pdf-coords.ts), and handles image-only PDF creation in [`image-only-pdf.ts`](src/lib/image-only-pdf.ts).

PDF.js text items are grouped from top-left page geometry, not content-stream
order: baselines are compared with a font-size-relative tolerance, items are
sorted left-to-right, and lines are sorted top-to-bottom. Word spaces are
inferred from font-relative horizontal gaps while touching punctuation and
grapheme clusters stay joined. Paragraph-like blocks use baseline spacing,
font-size compatibility, horizontal overlap, and shared centers. An indented
first line can remain in its paragraph, while a differently sized heading and
each bullet item remain separate. A single click selects a whole block;
double-click or Enter edits and masks the paragraph. **Edit single line** is
available for labels, headings, and table cells. Unchanged paragraph text keeps
its original line strings, x positions, and baselines; changed text reflows
inside the block using its original line spacing and warns before overlapping
another block or the page bottom.

Alignment is inferred from every line in its own block using a 0.5-point
minimum edge tolerance (scaled to 1.5% of the smallest line font size). Shared
left edges, including an indented first line, take precedence over page or
column margins; right and centered alignment require matching right edges or
centers respectively, while justified blocks require matching left and right
edges on all but the final line. Ambiguous and single-line blocks default to
left alignment. Alignment overrides are retained for the block during the
editor session. Devanagari editing is explicitly left-to-right and does not
reorder its runs through bidi processing.

Visible page canvases render at a capped device scale (two device pixels per CSS
pixel and a 4096-pixel maximum dimension). Intersection-based virtualization
releases canvases outside the viewport. The Hindi/Nepali typing panel and its
Pages column are initially omitted unless the opened document contains
Devanagari text or the user explicitly selects a Devanagari font. Once shown,
the column remains for the rest of that editor session so selecting another
page or typing cannot shift the workspace. The desktop page workspace uses the
available width between a 240–300px Devanagari/pages column and a resizable Text properties panel;
the panel defaults to a responsive 380–520px width and persists its custom
width. The Devanagari panel is collapsible and remembers its state; the Pages
list below it scrolls independently. The on-screen keyboard is placed at the
end of the page workspace in normal flow so it cannot cover an active text box.
Narrow layouts keep the properties panel below the page.

## How a document moves through the editor

1. The user chooses or drops a PDF. The editor checks the file type and rejects files larger than 50 MB. Password-protected PDFs are not opened; the interface directs users to the Unlock PDF tool first.
2. PDF.js reads the file in the browser, extracts text spans and their geometry, and renders pages and thumbnails to canvas. Text spans close to one another on the same baseline are grouped into editable lines.
3. A click selects the paragraph block under that line. Double-click or Enter opens its editor; **Edit single line** edits only the clicked line. The user can also choose **Add Text** and click on a page. Edits are held in React state; undo and redo track committed changes.
4. On download, `pdf-lib` copies the source pages and draws the changes over them. Replacement or deleted text is covered by an opaque rectangle whose color is sampled from the nearby rendered page. Replacement or added text is drawn over that mask using the selected style and position. Non-ASCII lines use shaped glyph outlines for visible text and an invisible text layer for extraction and search.
5. The output bytes are saved locally through FileSaver.js. No Edit PDF API request is involved in this flow.

PDF coordinates are measured in points, while the interactive preview is rendered at scaled pixel dimensions. The coordinate helpers convert between those spaces so moving and resizing a textbox remains aligned with the page.

## Editing and formatting

The editor supports changing extracted text, adding a new text box, moving and resizing text boxes, setting alignment, changing text color and size, bold and italic styles, underline, highlight color, and adding an HTTP, HTTPS, or mailto link. Existing font sizes are preserved and rounded to two decimals; values typed by the user are constrained to 8–72 points. **Center on page** centers measured text width on the visible page bounds, while **Fit to margins** uses margins inferred from body-sized text lines. A line edit replaces the grouped line as one edit rather than preserving each original text run independently. Wrapping and positioning use the selected embedded font's metrics.

Undo and redo apply to committed edits. The page preview is a rendered canvas with a separate overlay for pending changes; it is not a full in-place reconstruction of the original PDF content stream. Text layout, wrapping, and export use the same selected-font and fallback-font metrics.

## Fonts: picker names and embedded files

The font picker and font detection logic are in [`registry.ts`](src/lib/fonts/registry.ts). The picker offers these family names or compatibility aliases:

- Compatible aliases: Liberation Sans (Arial), Liberation Serif (Times New Roman), Liberation Mono (Courier New), Carlito (Calibri), Caladea (Cambria), and Gelasio (Georgia).
- Broad coverage: DejaVu Sans, Noto Sans, DejaVu Serif, and Noto Serif.
- Sans-serif: Lato, Open Sans, Roboto, and Source Sans 3.
- Serif: Merriweather.
- Display: Montserrat.
- Devanagari (Hindi, Nepali, Marathi): Noto Sans Devanagari, Noto Serif Devanagari, and Mukta.

The menu is ordered Office-compatible, Devanagari, broad coverage, then style groups. Font detection normalizes common PDF font names and maps aliases to the available choices. For Devanagari-containing blocks, the original embedded family is retained for matching after removing PDF subset prefixes and style suffixes. The editor picks a covering registry Devanagari font when available; otherwise it uses the closest family below and preserves a Latin fallback for Latin text in the same block.

| Normalized PDF font name or hint | Devanagari family |
| --- | --- |
| Noto Serif Devanagari, Sanskrit Text, Kokila, Aparajita | Noto Serif Devanagari |
| Mukta, Utsaah, or a light/humanist name | Mukta |
| Noto Sans Devanagari, Mangal, Nirmala UI, Kalimati, Sagarmatha, Arial Unicode MS, Sakal Bharati, Lohit Devanagari, Gargi, Samanata | Noto Sans Devanagari |
| Unknown name with serif PDF font flags | Noto Serif Devanagari |
| Unknown sans-serif or unclassified name | Noto Sans Devanagari |

Preeti, Kantipur, Himali, Kruti Dev, DevLys, Chanakya, and Shusha are recognized as legacy Nepali/Hindi font names; the editor warns that extracted legacy-encoded text may not be correct Unicode. A user-selected font without Devanagari coverage receives a one-line warning and a one-click switch to the suggested Devanagari family; the full missing-character list stays collapsed. Unknown or obsolete saved font identifiers outside a Devanagari block resolve to Liberation Sans and show a one-time notice.

Fonts load from `public/fonts/edit/` only when needed; no runtime font-provider request is made. The editor warns when text uses fallback glyphs or an unsupported script. Hebrew, Georgian, and Armenian text opens without crashing, but editing/export is blocked with the affected characters listed because those scripts are not supported yet. For non-ASCII edited lines, HarfBuzz shapes script and direction runs, and glyph outlines are read from the same HarfBuzz font object and font bytes used for shaping. Legitimately blank whitespace and join-control glyphs are skipped; a missing outline for other text is an export failure. Devanagari fonts are loaded only for a Devanagari selection or text requiring that script. Devanagari's invisible extraction layer uses a custom ToUnicode mapping so ligatures, conjuncts, join controls, whitespace, and punctuation copy as the original Unicode text. If an individual edit cannot be exported, the editor identifies the text and offers to download without that edit or cancel; the edit remains available in the editor either way. The shared bidi and run-segmentation pipeline remains in place. Static font families use regular, bold, italic, and bold-italic files where supplied. A small set of historically problematic edit fonts is embedded without subsetting.

The Edit PDF text controls preserve native browser input and IME composition. Devanagari phonetic (ITRANS-style) typing is optional, off by default, and reset to off when a new document is opened; Escape makes the next character literal Latin. The on-screen script keyboard is closed by default, uses locally bundled JSON layout data, and inserts Unicode at the caret or replaces the current selection. Its Devanagari InScript base/Shift letter mappings follow the BIS layout and match the installed XKB `deva` map. The UI presents digits as an explicit Devanagari/Latin toggle rather than a physical number row, and adds separate virama, joiner, non-joiner, navigation, deletion, and conjunct controls. No Windows installation is available in this environment for a live OS-level comparison. Both input methods produce Unicode text that follows the same shaping and PDF extraction path as directly typed text. Keyboard insertion has draft-level undo/redo; Backspace operates on grapheme boundaries.

The supported shaping scope is Latin and Latin Extended (including Vietnamese), Greek, Cyrillic, and Devanagari. Hebrew, Georgian, and Armenian are recognized for clear unsupported-script warnings and export blocking. Arabic joining, full Arabic/Persian/Urdu bidi behavior, CJK, Thai, and other scripts are not included in this phase.

## Deletion, flattening, and document fidelity

Text replacement masks the original line's full horizontal bounds using its baseline-relative ascent/descent, with 1.5 pt padding. The background color is sampled from an exterior pixel ring using per-channel medians. Replacement text is drawn on the original PDF baseline; wrapped lines advance using the selected font's measured line height. Replacement does not rewrite the source text object, so the editor is not a secure redaction tool. Use a dedicated redaction workflow for sensitive information and verify the resulting file independently.

When an edit is marked as a deletion, only pages containing deletions are rendered as image-only pages. Other pages are copied as PDF pages, so their text remains selectable. Affected pages lose normal searchable/selectable text and may lose interactive or structural PDF features. The interface continues to warn that deletion is visual only and recommends a dedicated redaction tool for sensitive content.

More generally, the export path is designed for common text changes, not for preserving every advanced PDF feature. Complex layouts, scanned pages without an OCR text layer, forms, annotations, unusual encodings, and embedded/custom fonts require careful review after download. Scanned page images have no selectable text for this editor to identify; use OCR before editing if you need to work with their text.

## Key source files

- [`src/pages/edit-pdf.tsx`](src/pages/edit-pdf.tsx): route-level page metadata and page composition.
- [`src/pages/edit-pdf-mvp.tsx`](src/pages/edit-pdf-mvp.tsx): compatibility re-export for the active editor.
- [`src/pages/PdfTextEditor.tsx`](src/pages/PdfTextEditor.tsx): file loading, rendering, editing state, controls, and PDF export.
- [`src/lib/fonts/registry.ts`](src/lib/fonts/registry.ts): font aliases, fallback detection, lazy font loading, fontkit embedding, and shared text metrics.
- [`src/lib/fonts/text-shaping.ts`](src/lib/fonts/text-shaping.ts): script/direction runs, bidi ordering, and HarfBuzz glyph shaping.
- [`src/lib/fonts/draw-shaped-text.ts`](src/lib/fonts/draw-shaped-text.ts): shaped outline placement in the exported PDF.
- [`src/lib/pdf-text-lines.ts`](src/lib/pdf-text-lines.ts): grouping extracted text spans into edit lines.
- [`src/lib/pdf-coords.ts`](src/lib/pdf-coords.ts): PDF-point and viewport coordinate conversion.
- [`src/lib/image-only-pdf.ts`](src/lib/image-only-pdf.ts): replacement-page rasterization while copying non-deletion pages unchanged.
- [`src/lib/pdf-text-fidelity.test.ts`](src/lib/pdf-text-fidelity.test.ts): Node canvas/PDF.js checks for font rendering, baseline preservation, and descender masks.