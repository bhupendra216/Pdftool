import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  PAGE_CONTENT_WIDTH_MM,
  PAGE_HEIGHT_MM,
  PAGE_MARGIN_MM,
  PAGE_PAGINATION_HEIGHT_MM,
  PAGE_WIDTH_MM,
  parseDescription,
  publicationGroups,
  publicationAuthorIndices,
  type ResumeDocument,
  type ResumeEntry,
  type ResumePublication,
} from "./model";
import { paginateBlocks, type PaginationBlock } from "./pagination";

type FontStyle = "regular" | "bold" | "italic" | "boldItalic";
type TextRun = { text: string; style: FontStyle };
type PdfLine = PaginationBlock & { runs: TextRun[]; size: number; lineHeight: number; align?: "center" };

const MM_TO_PT = 72 / 25.4;

function fontAssetPrefix(font: ResumeDocument["typography"]["font"]): string {
  switch (font) {
    case "times-new-roman":
    case "cambria":
      return "caladea";
    case "arial":
      return "liberation-sans";
    case "calibri":
      return "carlito";
    case "default":
    case "georgia":
      return "gelasio";
  }
}

async function loadFonts(document: PDFDocument, font: ResumeDocument["typography"]["font"]) {
  document.registerFontkit(fontkit);
  const prefix = fontAssetPrefix(font);
  const styles: FontStyle[] = ["regular", "bold", "italic", "boldItalic"];
  const fontEntries = await Promise.all(styles.map(async (style) => {
    const filename = `${prefix}-${style === "boldItalic" ? "bold-italic" : style}.ttf`;
    const response = await fetch(`${import.meta.env.BASE_URL}fonts/edit/${filename}`);
    if (!response.ok) throw new Error(`Could not load the ${font} font for the PDF download.`);
    return [style, await document.embedFont(await response.arrayBuffer(), { subset: true })] as const;
  }));
  return Object.fromEntries(fontEntries) as Record<FontStyle, PDFFont>;
}

function wrapRuns(
  runs: TextRun[],
  fonts: Record<FontStyle, PDFFont>,
  size: number,
  maxWidth: number,
): TextRun[][] {
  const lines: TextRun[][] = [[]];
  let width = 0;
  for (const run of runs) {
    const words = run.text.match(/\S+\s*|\s+/g) ?? [];
    for (const word of words) {
      const wordWidth = fonts[run.style].widthOfTextAtSize(word, size);
      if (width > 0 && width + wordWidth > maxWidth && word.trim()) {
        lines.push([]);
        width = 0;
      }
      lines[lines.length - 1].push({ text: word, style: run.style });
      width += wordWidth;
    }
  }
  return lines;
}

function addText(
  blocks: PdfLine[],
  text: string,
  style: FontStyle,
  size: number,
  fonts: Record<FontStyle, PDFFont>,
  options: { keepWithNext?: boolean; groupId?: string; maxWidth?: number; align?: "center" } = {},
) {
  const width = options.maxWidth ?? PAGE_CONTENT_WIDTH_MM * MM_TO_PT;
  const lineHeight = size * 1.32;
  const wrapped = wrapRuns([{ text, style }], fonts, size, width);
  wrapped.forEach((runs, index) => {
    blocks.push({
      id: `pdf-line-${blocks.length}`,
      height: lineHeight,
      lineHeight,
      size,
      runs,
      align: options.align,
      keepWithNext: index === wrapped.length - 1 ? options.keepWithNext : false,
      groupId: options.groupId,
    });
  });
}

function addParagraph(
  blocks: PdfLine[],
  text: string,
  fonts: Record<FontStyle, PDFFont>,
  options: { size: number; style?: FontStyle; bullet?: boolean; groupId?: string },
) {
  const style = options.style ?? "regular";
  const prefix = options.bullet ? "• " : "";
  const maxWidth = PAGE_CONTENT_WIDTH_MM * MM_TO_PT;
  const lineHeight = options.size * 1.32;
  const wrapped = wrapRuns([{ text: `${prefix}${text}`, style }], fonts, options.size, maxWidth);
  wrapped.forEach((runs) => blocks.push({
    id: `pdf-line-${blocks.length}`,
    height: lineHeight,
    lineHeight,
    size: options.size,
    runs,
    groupId: options.groupId,
  }));
}

function entryHeading(entry: ResumeEntry): string {
  return entry.title || entry.organization;
}

function publicationRuns(publication: ResumePublication, numbered: boolean, number: number, shortenAuthors: boolean): TextRun[] {
  const runs: TextRun[] = [];
  if (numbered) runs.push({ text: `[${number}] `, style: "regular" });
  const indices = publicationAuthorIndices(publication, shortenAuthors);
  const shortened = shortenAuthors && publication.authors.length > 6;
  indices.forEach((authorIndex, index) => {
    if (index > 0) runs.push({ text: ", ", style: "regular" });
    runs.push({
      text: publication.authors[authorIndex],
      style: authorIndex === publication.selectedAuthorIndex ? "bold" : "regular",
    });
  });
  if (shortened) {
    runs.push({ text: ", …", style: "regular" });
    if (publication.selectedAuthorIndex !== null && publication.selectedAuthorIndex > 2) {
      runs.push({ text: ", ", style: "regular" });
      runs.push({ text: publication.authors[publication.selectedAuthorIndex], style: "bold" });
    }
    runs.push({ text: ", et al. ", style: "regular" });
  } else if (publication.authors.length) {
    runs.push({ text: ". ", style: "regular" });
  }
  if (publication.title.trim()) runs.push({ text: `${publication.title}. `, style: "regular" });
  if (publication.venue.trim()) runs.push({ text: `${publication.venue}, `, style: "italic" });
  if (publication.year.trim()) runs.push({ text: publication.year, style: "regular" });
  const status = publication.status === "Accepted" ? " (accepted)"
    : publication.status === "Under review" ? " (under review)"
      : publication.status === "In preparation" ? " (in preparation)" : "";
  if (status) runs.push({ text: status, style: "regular" });
  if (publication.link.trim()) runs.push({ text: ` ${publication.link}`, style: "regular" });
  return runs;
}

function addPublication(
  blocks: PdfLine[],
  publication: ResumePublication,
  fonts: Record<FontStyle, PDFFont>,
  number: number,
  numbered: boolean,
  shortenAuthors: boolean,
  groupId: string,
  bodySize: number,
) {
  const lines = wrapRuns(
    publicationRuns(publication, numbered, number, shortenAuthors),
    fonts,
    bodySize,
    PAGE_CONTENT_WIDTH_MM * MM_TO_PT,
  );
  for (const runs of lines) {
    const lineHeight = bodySize * 1.32;
    blocks.push({ id: `pdf-line-${blocks.length}`, height: lineHeight, lineHeight, size: bodySize, runs, groupId });
  }
  if (publication.role.trim()) addText(blocks, publication.role, "italic", bodySize, fonts, { groupId });
}

function addEntry(
  blocks: PdfLine[],
  entry: ResumeEntry,
  sectionType: string,
  fonts: Record<FontStyle, PDFFont>,
  sizes: { body: number; subheading: number },
) {
  const groupId = `entry-${entry.id}`;
  if (sectionType === "skills") {
    const prefix = `${entry.title || "Skills"}: `;
    addText(blocks, prefix + entry.description, "regular", sizes.body, fonts, { groupId });
    return;
  }
  addText(blocks, entryHeading(entry), "bold", sizes.subheading, fonts, {
    groupId,
    keepWithNext: true,
  });
  if (entry.link.trim()) addText(blocks, entry.link, "regular", sizes.body, fonts, { groupId, keepWithNext: true });
  const details = [entry.organization, entry.location, entry.dates].filter(Boolean).join(" · ");
  if (details) addText(blocks, details, "italic", sizes.body, fonts, { groupId, keepWithNext: Boolean(entry.description.trim()) });
  for (const paragraph of parseDescription(entry.description)) {
    addParagraph(blocks, paragraph.text, fonts, {
      size: sizes.body,
      bullet: paragraph.kind === "bullet",
      groupId,
    });
  }
}

export async function createResumePdf(resume: ResumeDocument): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  document.setTitle(`${resume.contact.fullName.trim() || "Resume"} - Resume`);
  const fonts = await loadFonts(document, resume.typography.font);
  const sizes = {
    name: resume.typography.namePt,
    section: resume.typography.sectionHeadingPt,
    subheading: resume.typography.subheadingPt,
    body: resume.typography.bodyPt,
  };
  const blocks: PdfLine[] = [];
  if (resume.contact.fullName.trim()) {
    addText(blocks, resume.contact.fullName, "bold", sizes.name, fonts, { keepWithNext: true, align: "center" });
  }
  const contactLine = [
    resume.contact.email,
    resume.contact.phone,
    ...resume.contact.links.filter((link) => link.label || link.url).map((link) =>
      link.label && link.url ? `${link.label}: ${link.url}` : link.label || link.url,
    ),
    resume.contact.location,
  ].filter((value) => value.trim()).join("  •  ");
  if (contactLine) addText(blocks, contactLine, "regular", sizes.body * 0.82, fonts);

  for (const section of resume.sections.filter((item) => item.visible && item.title.trim())) {
    const sectionBlocks: PdfLine[] = [];
    if (section.type === "summary") {
      const paragraphs = parseDescription(section.summary);
      if (!paragraphs.length) continue;
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, { keepWithNext: true });
      for (const paragraph of paragraphs) addParagraph(sectionBlocks, paragraph.text, fonts, {
        size: sizes.body,
        bullet: paragraph.kind === "bullet",
      });
    } else if (section.type === "publications") {
      const publications = section.publications.filter((item) => item.title.trim() || item.authors.some((author) => author.trim()));
      if (!publications.length) continue;
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, { keepWithNext: true });
      const groups = section.publicationOptions.groupByType
        ? publicationGroups(publications)
        : [{ type: null, label: "", entries: publications }];
      let index = 0;
      for (const group of groups) {
        if (group.label) addText(sectionBlocks, group.label, "bold", sizes.subheading, fonts, { keepWithNext: true });
        for (const publication of group.entries) {
          index += 1;
          addPublication(
            sectionBlocks,
            publication,
            fonts,
            index,
            section.publicationOptions.numberedStyle,
            section.publicationOptions.shortenAuthors,
            `publication-${publication.id}`,
            sizes.body,
          );
        }
      }
    } else {
      const entries = section.entries.filter((entry) =>
        Boolean(entry.title.trim() || entry.organization.trim() || entry.location.trim() || entry.dates.trim() || entry.description.trim()),
      );
      if (!entries.length) continue;
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, { keepWithNext: true });
      for (const entry of entries) addEntry(sectionBlocks, entry, section.type, fonts, sizes);
    }
    blocks.push(...sectionBlocks);
  }

  const pageHeight = PAGE_PAGINATION_HEIGHT_MM * MM_TO_PT;
  const pages = paginateBlocks(blocks, pageHeight);
  const pageWidth = PAGE_WIDTH_MM * MM_TO_PT;
  const sheetHeight = PAGE_HEIGHT_MM * MM_TO_PT;
  const margin = PAGE_MARGIN_MM * MM_TO_PT;
  pages.forEach((pageBlocks) => {
    const page = document.addPage([pageWidth, sheetHeight]);
    let top = sheetHeight - margin;
    for (const block of pageBlocks as PdfLine[]) {
      const lineWidth = block.runs.reduce(
        (sum, run) => sum + fonts[run.style].widthOfTextAtSize(run.text, block.size),
        0,
      );
      let x = margin;
      if (block.align === "center") x = (pageWidth - lineWidth) / 2;
      for (const run of block.runs) {
        page.drawText(run.text, {
          x,
          y: top - block.size,
          size: block.size,
          font: fonts[run.style],
          color: rgb(0.05, 0.05, 0.05),
        });
        x += fonts[run.style].widthOfTextAtSize(run.text, block.size);
      }
      top -= block.lineHeight;
    }
  });
  return document.save();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
