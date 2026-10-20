import { PDFDocument, PDFString, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  PAGE_CONTENT_WIDTH_MM,
  PAGE_HEIGHT_MM,
  PAGE_MARGIN_MM,
  PAGE_PAGINATION_HEIGHT_MM,
  PAGE_WIDTH_MM,
  parseDescription,
  normalizePublicationLink,
  normalizeResumeItemLink,
  publicationGroups,
  publicationAuthorIndices,
  validateResumeLink,
  type ResumeDocument,
  type ResumeEntry,
  type ResumePublication,
} from "./model";
import { paginateBlocks, type PaginationBlock } from "./pagination";

type FontStyle = "regular" | "bold" | "italic" | "boldItalic";
type TextRun = { text: string; style: FontStyle; underline?: boolean; href?: string };
type PdfLine = PaginationBlock & {
  runs: TextRun[];
  size: number;
  lineHeight: number;
  align?: "center";
  rightRuns?: TextRun[];
  rightSize?: number;
  kind?: "space" | "rule";
  ruleAfter?: boolean;
  indent?: number;
  bullet?: boolean;
  sourceId?: string;
};

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
      lines[lines.length - 1].push({
        text: word,
        style: run.style,
        underline: run.underline,
        href: run.href,
      });
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
  options: {
    keepWithNext?: boolean;
    groupId?: string;
    maxWidth?: number;
    align?: "center";
    lineHeight?: number;
    ruleAfter?: boolean;
    sourceId?: string;
    underline?: boolean;
  } = {},
) {
  addRuns(blocks, [{ text, style, underline: options.underline }], size, fonts, options);
}

function addRuns(
  blocks: PdfLine[],
  runs: TextRun[],
  size: number,
  fonts: Record<FontStyle, PDFFont>,
  options: {
    keepWithNext?: boolean;
    groupId?: string;
    maxWidth?: number;
    align?: "center";
    lineHeight?: number;
    ruleAfter?: boolean;
    sourceId?: string;
  } = {},
) {
  const width = options.maxWidth ?? PAGE_CONTENT_WIDTH_MM * MM_TO_PT;
  const lineHeight = options.lineHeight ?? size * 1.2;
  const wrapped = wrapRuns(runs, fonts, size, width);
  wrapped.forEach((runs, index) => {
    blocks.push({
      id: `pdf-line-${blocks.length}`,
      height: lineHeight,
      lineHeight,
      size,
      runs,
      align: options.align,
      ruleAfter: options.ruleAfter,
      sourceId: options.sourceId,
      keepWithNext: index === wrapped.length - 1 ? options.keepWithNext : false,
      groupId: options.groupId,
    });
  });
}

function addSpace(blocks: PdfLine[], height: number, keepWithNext = false, sourceId?: string) {
  if (height <= 0) return;
  blocks.push({
    id: `pdf-space-${blocks.length}`,
    height,
    lineHeight: height,
    size: 0,
    runs: [],
    kind: "space",
    keepWithNext,
    sourceId,
  });
}

function addSectionRule(blocks: PdfLine[]) {
  blocks.push({
    id: `pdf-rule-${blocks.length}`,
    height: 12,
    lineHeight: 12,
    size: 0,
    runs: [],
    kind: "rule",
  });
}

function addSplitLine(
  blocks: PdfLine[],
  leftText: string,
  leftStyle: FontStyle,
  leftSize: number,
  rightText: string,
  rightStyle: FontStyle,
  rightSize: number,
  fonts: Record<FontStyle, PDFFont>,
  options: { groupId?: string; keepWithNext?: boolean; sourceId?: string } = {},
) {
  const maxWidth = PAGE_CONTENT_WIDTH_MM * MM_TO_PT;
  const rightWidth = fonts[rightStyle].widthOfTextAtSize(rightText, rightSize);
  const gap = rightText ? 6 : 0;
  const leftRuns = wrapRuns(
    [{ text: leftText, style: leftStyle }],
    fonts,
    leftSize,
    Math.max(1, maxWidth - rightWidth - gap),
  );
  const rightLineHeight = rightSize * 1.2;
  const leftLineHeight = leftSize * 1.2;
  leftRuns.forEach((runs, index) => {
    blocks.push({
      id: `pdf-line-${blocks.length}`,
      height: Math.max(leftLineHeight, rightLineHeight),
      lineHeight: Math.max(leftLineHeight, rightLineHeight),
      size: leftSize,
      runs,
      rightRuns: index === 0 && rightText ? [{ text: rightText, style: rightStyle }] : undefined,
      rightSize,
      groupId: options.groupId,
      sourceId: options.sourceId,
      keepWithNext: index === leftRuns.length - 1 ? options.keepWithNext : false,
    });
  });
}

function addParagraph(
  blocks: PdfLine[],
  text: string,
  fonts: Record<FontStyle, PDFFont>,
  options: {
    size: number;
    style?: FontStyle;
    bullet?: boolean;
    groupId?: string;
    compact?: boolean;
    sourceId?: string;
  },
) {
  const style = options.style ?? "regular";
  const indent = options.bullet ? 15 : 0;
  const lineHeight = options.size * (options.bullet ? 1.35 : 1.42);
  const wrapped = wrapRuns(
    [{ text, style }],
    fonts,
    options.size,
    PAGE_CONTENT_WIDTH_MM * MM_TO_PT - indent,
  );
  addSpace(blocks, options.compact ? 1.5 : options.bullet ? 3.75 : 3, false, options.sourceId);
  wrapped.forEach((runs, index) => blocks.push({
    id: `pdf-line-${blocks.length}`,
    height: lineHeight,
    lineHeight,
    size: options.size,
    runs,
    indent,
    bullet: options.bullet && index === 0,
    groupId: options.groupId,
    sourceId: options.sourceId,
  }));
  addSpace(blocks, options.compact ? 1.5 : 3, false, options.sourceId);
}

function entryHeading(entry: ResumeEntry): string {
  return entry.title || entry.organization;
}

function publicationRuns(
  publication: ResumePublication,
  numbered: boolean,
  number: number,
  shortenAuthors: boolean,
  underlineLinks: boolean,
): TextRun[] {
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
  const linkedTitle = Boolean(normalizePublicationLink(publication.link));
  if (publication.title.trim()) {
    const href = normalizePublicationLink(publication.link) || undefined;
    runs.push({
      text: publication.title,
      style: "regular",
      underline: linkedTitle && underlineLinks,
      href,
    });
    runs.push({ text: ". ", style: "regular" });
  }
  if (publication.venue.trim()) runs.push({ text: `${publication.venue}, `, style: "italic" });
  if (publication.year.trim()) runs.push({ text: publication.year, style: "regular" });
  const status = publication.status === "Accepted" ? " (accepted)"
    : publication.status === "Under review" ? " (under review)"
      : publication.status === "In preparation" ? " (in preparation)" : "";
  if (status) runs.push({ text: status, style: "regular" });
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
  underlineLinks: boolean,
  compact: boolean,
  sourceId: string,
) {
  const lines = wrapRuns(
    publicationRuns(publication, numbered, number, shortenAuthors, underlineLinks),
    fonts,
    bodySize,
    PAGE_CONTENT_WIDTH_MM * MM_TO_PT,
  );
  addSpace(blocks, compact ? 2 : 3, false, sourceId);
  for (const runs of lines) {
    const lineHeight = bodySize * 1.42;
    blocks.push({ id: `pdf-line-${blocks.length}`, height: lineHeight, lineHeight, size: bodySize, runs, groupId, sourceId });
  }
  if (publication.role.trim()) {
    addSpace(blocks, compact ? 0 : 3);
    addParagraph(blocks, publication.role, fonts, {
      size: bodySize,
      style: "italic",
      groupId,
      compact,
      sourceId,
    });
  }
  addSpace(blocks, compact ? 5.25 : 9, false, sourceId);
}

function addEntry(
  blocks: PdfLine[],
  entry: ResumeEntry,
  sectionType: string,
  fonts: Record<FontStyle, PDFFont>,
  sizes: { body: number; subheading: number },
  options: { compact: boolean; underlineLinks: boolean },
) {
  const groupId = `entry-${entry.id}`;
  if (sectionType === "skills") {
    addSpace(blocks, options.compact ? 1 : 1.5, false, `${groupId}-skills`);
    const label = `${entry.title || "Skills"}: `;
    const runs: TextRun[] = [
      { text: label, style: "bold" },
      { text: entry.description, style: "regular" },
    ];
    const wrapped = wrapRuns(runs, fonts, sizes.body, PAGE_CONTENT_WIDTH_MM * MM_TO_PT);
    wrapped.forEach((lineRuns) => blocks.push({
      id: `pdf-line-${blocks.length}`,
      height: sizes.body * 1.42,
      lineHeight: sizes.body * 1.42,
      size: sizes.body,
      runs: lineRuns,
      groupId,
      sourceId: `${groupId}-skills`,
    }));
    addSpace(blocks, options.compact ? 1 : 1.5, true, `${groupId}-skills`);
    return;
  }
  const linkedTitle = ["awards", "certifications"].includes(sectionType) &&
    Boolean(normalizeResumeItemLink(entry.link));
  const titleRuns = entryHeading(entry)
    ? [{
      text: entryHeading(entry),
      style: "bold" as const,
      underline: linkedTitle && options.underlineLinks,
      href: normalizeResumeItemLink(entry.link) || undefined,
    }]
    : [];
  const titleLines = wrapRuns(
    titleRuns,
    fonts,
    sizes.subheading,
    PAGE_CONTENT_WIDTH_MM * MM_TO_PT -
      (entry.dates ? fonts.italic.widthOfTextAtSize(entry.dates, sizes.subheading * 0.8631578947368421) + 6 : 0),
  );
  if (titleLines.length === 0) titleLines.push([]);
  titleLines.forEach((runs, index) => blocks.push({
    id: `pdf-line-${blocks.length}`,
    height: sizes.subheading * 1.2,
    lineHeight: sizes.subheading * 1.2,
    size: sizes.subheading,
    runs,
    rightRuns: index === 0 && entry.dates ? [{ text: entry.dates, style: "italic" }] : undefined,
    rightSize: sizes.subheading * 0.8631578947368421,
    groupId,
    sourceId: `${groupId}-title`,
    keepWithNext: index === titleLines.length - 1,
  }));
  if (entry.organization || entry.location) {
    addSplitLine(
      blocks,
      entry.organization,
      "regular",
      sizes.subheading * 0.9052631578947368,
      entry.location,
      "regular",
      sizes.subheading * 0.9052631578947368,
      fonts,
      { groupId, keepWithNext: Boolean(entry.description.trim()), sourceId: `${groupId}-organization` },
    );
  }
  for (const [index, paragraph] of parseDescription(entry.description).entries()) {
    addParagraph(blocks, paragraph.text, fonts, {
      size: sizes.body,
      bullet: paragraph.kind === "bullet",
      groupId,
      compact: options.compact,
      sourceId: `${groupId}-description-${index}`,
    });
  }
}

export async function createResumePdf(resume: ResumeDocument, pageBreakBefore: string[] = []): Promise<Uint8Array> {
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
  const compact = resume.compactSpacing;
  if (resume.contact.fullName.trim()) {
    addText(blocks, resume.contact.fullName, "bold", sizes.name, fonts, {
      keepWithNext: true,
      align: "center",
      lineHeight: sizes.name * 1.2 + 3.75,
    });
  }
  const contactItems: Array<{ text: string; href?: string; underline: boolean }> = [
    ...(resume.contact.email.trim() ? [{
      text: resume.contact.email,
      href: `mailto:${resume.contact.email}`,
      underline: true,
    }] : []),
    ...(resume.contact.phone.trim() ? [{ text: resume.contact.phone, underline: false }] : []),
    ...resume.contact.links
      .filter((link) => link.label || link.url)
      .map((link) => ({
        text: validateResumeLink(link.url) ? link.label || link.url : link.label || (link.url ? `${link.label}: ${link.url}` : ""),
        href: validateResumeLink(link.url) ? link.url : undefined,
        underline: validateResumeLink(link.url),
      })),
    ...(resume.contact.location.trim() ? [{ text: resume.contact.location, underline: false }] : []),
  ];
  const contactRuns = contactItems.flatMap((item, index) => [
    ...(index > 0 ? [{ text: "  •  ", style: "regular" as const }] : []),
    {
      text: item.text,
      style: "regular" as const,
      underline: item.underline && resume.typography.underlineLinks,
      href: item.href,
    },
  ]);
  if (contactRuns.length) {
    addRuns(blocks, contactRuns, sizes.body * 0.82, fonts, {
      align: "center",
      lineHeight: sizes.body * 0.82 * 1.2 + 5,
    });
    addSpace(blocks, 4.5);
  }

  for (const section of resume.sections.filter((item) => item.visible && item.title.trim())) {
    const sectionBlocks: PdfLine[] = [];
    if (section.type === "summary") {
      const paragraphs = parseDescription(section.summary);
      if (!paragraphs.length) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, {
        keepWithNext: true,
        lineHeight: sizes.section * 1.2 + 2.25,
        sourceId: `${section.id}-heading`,
      });
      addSpace(sectionBlocks, compact ? 3.75 : 4.5);
      for (const [index, paragraph] of paragraphs.entries()) addParagraph(sectionBlocks, paragraph.text, fonts, {
        size: sizes.body,
        bullet: paragraph.kind === "bullet",
        compact,
        sourceId: `${section.id}-summary-${index}`,
      });
    } else if (section.type === "publications") {
      const publications = section.publications.filter((item) => item.title.trim() || item.authors.some((author) => author.trim()));
      if (!publications.length) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, {
        keepWithNext: true,
        lineHeight: sizes.section * 1.2 + 2.25,
        sourceId: `${section.id}-heading`,
      });
      addSpace(sectionBlocks, compact ? 3.75 : 4.5);
      const groups = section.publicationOptions.groupByType
        ? publicationGroups(publications)
        : [{ type: null, label: "", entries: publications }];
      let index = 0;
      for (const group of groups) {
        if (group.label) {
          addSpace(sectionBlocks, 7.5);
          addText(sectionBlocks, group.label, "italic", sizes.subheading * 0.92, fonts, { keepWithNext: true });
        }
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
            resume.typography.underlineLinks,
            compact,
            `publication-${publication.id}`,
          );
        }
      }
    } else {
      const entries = section.entries.filter((entry) =>
        Boolean(entry.title.trim() || entry.organization.trim() || entry.location.trim() || entry.dates.trim() || entry.description.trim()),
      );
      if (!entries.length) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, "bold", sizes.section, fonts, {
        keepWithNext: true,
        lineHeight: sizes.section * 1.2 + 2.25,
        sourceId: `${section.id}-heading`,
      });
      addSpace(sectionBlocks, compact ? 3.75 : 4.5);
      for (const entry of entries) addEntry(sectionBlocks, entry, section.type, fonts, sizes, {
        compact,
        underlineLinks: resume.typography.underlineLinks,
      });
    }
    addSectionRule(sectionBlocks);
    blocks.push(...sectionBlocks);
  }

  const pageHeight = PAGE_PAGINATION_HEIGHT_MM * MM_TO_PT;
  const forcedBreaks = new Set(pageBreakBefore);
  const blockRanges: PdfLine[][] = [];
  let currentRange: PdfLine[] = [];
  for (const block of blocks) {
    if (block.sourceId && forcedBreaks.has(block.sourceId) && currentRange.length > 0) {
      blockRanges.push(currentRange);
      currentRange = [];
      forcedBreaks.delete(block.sourceId);
    }
    currentRange.push(block);
  }
  if (currentRange.length > 0) blockRanges.push(currentRange);
  const pages = blockRanges.flatMap((range) => paginateBlocks(range, pageHeight));
  const pageWidth = PAGE_WIDTH_MM * MM_TO_PT;
  const sheetHeight = PAGE_HEIGHT_MM * MM_TO_PT;
  const margin = PAGE_MARGIN_MM * MM_TO_PT;
  pages.forEach((pageBlocks) => {
    const page = document.addPage([pageWidth, sheetHeight]);
    let top = sheetHeight - margin;
    for (const block of pageBlocks as PdfLine[]) {
      if (block.kind === "space") {
        top -= block.lineHeight;
        continue;
      }
      if (block.kind === "rule") {
        const ruleY = top - block.lineHeight / 2;
        page.drawLine({
          start: { x: margin, y: ruleY },
          end: { x: pageWidth - margin, y: ruleY },
          thickness: 0.55,
          color: rgb(0.2, 0.2, 0.2),
        });
        top -= block.lineHeight;
        continue;
      }
      const lineWidth = block.runs.reduce(
        (sum, run) => sum + fonts[run.style].widthOfTextAtSize(run.text, block.size),
        0,
      );
      const rightWidth = block.rightRuns?.reduce(
        (sum, run) => sum + fonts[run.style].widthOfTextAtSize(run.text, block.rightSize ?? block.size),
        0,
      ) ?? 0;
      let x = margin + (block.indent ?? 0);
      if (block.align === "center") x = (pageWidth - lineWidth) / 2;
      for (const run of block.runs) {
        const baseline = top - block.size;
        page.drawText(run.text, {
          x,
          y: baseline,
          size: block.size,
          font: fonts[run.style],
          color: rgb(0.05, 0.05, 0.05),
        });
        const runWidth = fonts[run.style].widthOfTextAtSize(run.text, block.size);
        if (run.underline) {
          page.drawLine({
            start: { x, y: top - block.size - 1 },
            end: { x: x + runWidth, y: top - block.size - 1 },
            thickness: 0.45,
            color: rgb(0.05, 0.05, 0.05),
          });
        }
        if (run.href) {
          const annotation = document.context.register(document.context.obj({
            Type: "Annot",
            Subtype: "Link",
            Rect: [x, baseline - 2, x + runWidth, top + 2],
            Border: [0, 0, 0],
            A: { S: "URI", URI: PDFString.of(run.href) },
          }));
          page.node.addAnnot(annotation);
        }
        x += runWidth;
      }
      if (block.rightRuns?.length) {
        const rightSize = block.rightSize ?? block.size;
        let rightX = pageWidth - margin - rightWidth;
        for (const run of block.rightRuns) {
          page.drawText(run.text, {
            x: rightX,
            y: top - rightSize,
            size: rightSize,
            font: fonts[run.style],
            color: rgb(0.05, 0.05, 0.05),
          });
          rightX += fonts[run.style].widthOfTextAtSize(run.text, rightSize);
        }
      }
      if (block.ruleAfter) {
        const ruleY = top - block.size - 2.25;
        page.drawLine({
          start: { x: margin, y: ruleY },
          end: { x: pageWidth - margin, y: ruleY },
          thickness: 0.55,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
      if (block.bullet) {
        page.drawText("•", {
          x: margin,
          y: top - block.size,
          size: block.size,
          font: fonts.regular,
          color: rgb(0.05, 0.05, 0.05),
        });
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
