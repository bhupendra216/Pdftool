import { PDFDocument, PDFString, rgb, type PDFImage, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  PAGE_CONTENT_WIDTH_MM,
  PAGE_HEIGHT_MM,
  PAGE_MARGIN_MM,
  PAGE_PAGINATION_HEIGHT_MM,
  PAGE_WIDTH_MM,
  PROFILE_PHOTO_GAP_MM,
  PROFILE_PHOTO_HEIGHT_MM,
  PROFILE_PHOTO_WIDTH_MM,
  LANGUAGE_LEVEL_FIELDS,
  RESUME_TEXT_STYLES,
  TYPOGRAPHY_FONTS,
  parseDescription,
  normalizePublicationLink,
  normalizeResumeItemLink,
  publicationGroups,
  publicationAuthorIndices,
  buildResumeContactLines,
  packResumeHeaderLines,
  equalLanguageLevel,
  validateResumeLink,
  isValidProfilePhotoDataUrl,
  type ResumeDocument,
  type ResumeEntry,
  type ResumeLanguage,
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
  centerWidth?: number;
  rightRuns?: TextRun[];
  rightSize?: number;
  kind?: "space" | "rule" | "table";
  ruleAfter?: boolean;
  indent?: number;
  bullet?: boolean;
  sourceId?: string;
  tableRows?: Array<{ cells: TextRun[][][]; header: boolean; height: number }>;
  columnWidths?: number[];
};

const MM_TO_PT = 72 / 25.4;

function fontAssetPrefix(font: ResumeDocument["typography"]["font"]): string {
  return TYPOGRAPHY_FONTS.find((option) => option.id === font)?.pdfPrefix ?? TYPOGRAPHY_FONTS[0].pdfPrefix;
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

const fontCharacterSets = new WeakMap<PDFFont, Set<number>>();

function assertFontSupportsText(font: PDFFont, text: string) {
  let characterSet = fontCharacterSets.get(font);
  if (!characterSet) {
    characterSet = new Set(font.getCharacterSet());
    fontCharacterSets.set(font, characterSet);
  }
  const missing = [...new Set([...text].filter((character) => !characterSet.has(character.codePointAt(0)!)))];
  if (missing.length) throw new Error(`The selected PDF font does not support: ${missing.join(" ")}. Choose another font or replace its bundled font files.`);
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
    assertFontSupportsText(fonts[run.style], run.text);
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
    centerWidth?: number;
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
    centerWidth?: number;
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
      centerWidth: options.centerWidth,
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
  const style = options.style ?? RESUME_TEXT_STYLES.body.pdfFace;
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
      style: authorIndex === publication.selectedAuthorIndex
        ? RESUME_TEXT_STYLES.publicationAuthor.pdfFace
        : RESUME_TEXT_STYLES.body.pdfFace,
    });
  });
  if (shortened) {
    runs.push({ text: ", …", style: "regular" });
    if (publication.selectedAuthorIndex !== null && publication.selectedAuthorIndex > 2) {
      runs.push({ text: ", ", style: "regular" });
      runs.push({ text: publication.authors[publication.selectedAuthorIndex], style: RESUME_TEXT_STYLES.publicationAuthor.pdfFace });
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

function addLanguageTable(
  blocks: PdfLine[],
  languages: ResumeLanguage[],
  fonts: Record<FontStyle, PDFFont>,
  size: number,
  sourceId: string,
) {
  const headings = ["Language", "Listening", "Reading", "Spoken interaction", "Spoken production", "Writing"];
  const widths = [0.23, 0.13, 0.13, 0.18, 0.18, 0.15].map((fraction) => PAGE_CONTENT_WIDTH_MM * MM_TO_PT * fraction);
  const lineHeight = size * 1.2;
  const rows = [
    { cells: headings.map((heading, index) => wrapRuns([{ text: heading, style: RESUME_TEXT_STYLES.tableHeader.pdfFace }], fonts, size * 0.78, widths[index] - 6)), header: true },
    ...languages.map((language) => ({
      cells: [
        `${language.name}${language.certificate.trim() ? ` (${language.certificate.trim()})` : ""}`,
        ...LANGUAGE_LEVEL_FIELDS.map((field) => language[field]),
      ].map((text, index) => wrapRuns([{
        text,
        style: index === 0 ? RESUME_TEXT_STYLES.tableRowHeader.pdfFace : RESUME_TEXT_STYLES.body.pdfFace,
      }], fonts, size * 0.78, widths[index] - 6)),
      header: false,
    })),
  ].map((row) => ({
    ...row,
    height: Math.max(1, ...row.cells.map((cellLines) => cellLines.length)) * lineHeight + 6,
  }));
  const height = rows.reduce((total, row) => total + row.height, 0) + rows.length + 1;
  blocks.push({
    id: `pdf-language-table-${blocks.length}`,
    height,
    lineHeight: height,
    size,
    runs: [],
    kind: "table",
    tableRows: rows,
    columnWidths: widths,
    sourceId,
  });
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
  if (sectionType === "skills" || sectionType === "digitalSkills") {
    addSpace(blocks, options.compact ? 1 : 1.5, false, `${groupId}-skills`);
    const label = `${entry.title || "Skills"}: `;
    const runs: TextRun[] = [
      { text: label, style: RESUME_TEXT_STYLES.label.pdfFace },
      { text: entry.description, style: RESUME_TEXT_STYLES.body.pdfFace },
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
  const linkedTitle = ["awards", "certifications", "conferences"].includes(sectionType) &&
    Boolean(normalizeResumeItemLink(entry.link));
  const titleRuns = entryHeading(entry)
    ? [{
      text: entryHeading(entry),
      style: RESUME_TEXT_STYLES.entryTitle.pdfFace,
      underline: linkedTitle && options.underlineLinks,
      href: normalizeResumeItemLink(entry.link) || undefined,
    }]
    : [];
  const titleLines = wrapRuns(
    titleRuns,
    fonts,
    sizes.subheading,
    PAGE_CONTENT_WIDTH_MM * MM_TO_PT -
      (entry.dates ? fonts.regular.widthOfTextAtSize(entry.dates, sizes.subheading * 0.8631578947368421) + 6 : 0),
  );
  if (titleLines.length === 0) titleLines.push([]);
  titleLines.forEach((runs, index) => blocks.push({
    id: `pdf-line-${blocks.length}`,
    height: sizes.subheading * 1.2,
    lineHeight: sizes.subheading * 1.2,
    size: sizes.subheading,
    runs,
    rightRuns: index === 0 && entry.dates ? [{ text: entry.dates, style: "regular" }] : undefined,
    rightSize: sizes.subheading * 0.8631578947368421,
    groupId,
    sourceId: `${groupId}-title`,
    keepWithNext: index === titleLines.length - 1,
  }));
  if (entry.organization || entry.location) {
    addSplitLine(
      blocks,
      entry.organization,
      RESUME_TEXT_STYLES.entrySubtitle.pdfFace,
      sizes.subheading * 0.9052631578947368,
      entry.location,
      RESUME_TEXT_STYLES.entrySubtitle.pdfFace,
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
  document.setTitle(`${resume.contact.fullName.trim() || "Resume"} - ${resume.europeanStandard ? "Europass CV" : "Resume"}`);
  const profilePhoto = resume.europeanStandard && resume.profilePhotoDataUrl
    ? await embedProfilePhoto(document, resume.profilePhotoDataUrl)
    : undefined;
  const fonts = await loadFonts(document, resume.typography.font);
  const sizes = {
    name: resume.typography.namePt,
    section: resume.typography.sectionHeadingPt,
    subheading: resume.typography.subheadingPt,
    body: resume.typography.bodyPt,
  };
  const blocks: PdfLine[] = [];
  const compact = resume.compactSpacing;
  const headerBlocks: PdfLine[] = [];
  const headerWidth = PAGE_CONTENT_WIDTH_MM * MM_TO_PT;
  const photoTextWidth = (PAGE_CONTENT_WIDTH_MM - 2 * (PROFILE_PHOTO_WIDTH_MM + PROFILE_PHOTO_GAP_MM)) * MM_TO_PT;
  const hasSidePhoto = Boolean(profilePhoto && resume.photoPosition !== "center");
  const headerItems = buildResumeContactLines(resume).flatMap((line, lineIndex) => line.map((item, itemIndex) => ({
    ...item,
    breakBefore: item.breakBefore || (lineIndex > 0 && itemIndex === 0),
  })));
  const nameLineHeight = sizes.name * 1.2 + 3.75;
  const contactLineHeight = sizes.body * 0.82 * 1.2 + 5;
  const contactLines = packResumeHeaderLines(
    headerItems,
    hasSidePhoto ? photoTextWidth : headerWidth,
    (text) => fonts.regular.widthOfTextAtSize(text, sizes.body * 0.82),
    {
      ...(hasSidePhoto ? {
        fullWidth: headerWidth,
        photoBottom: PROFILE_PHOTO_HEIGHT_MM * MM_TO_PT,
      } : {}),
      initialHeight: resume.contact.fullName.trim() ? nameLineHeight : 0,
      lineHeight: contactLineHeight,
    },
  );
  const photoPosition = resume.photoPosition;

  if (profilePhoto && photoPosition === "center") {
    addSpace(blocks, (PROFILE_PHOTO_HEIGHT_MM + PROFILE_PHOTO_GAP_MM) * MM_TO_PT);
  }
  if (resume.contact.fullName.trim()) {
    addText(headerBlocks, resume.contact.fullName, RESUME_TEXT_STYLES.name.pdfFace, sizes.name, fonts, {
      keepWithNext: true,
      align: "center",
      centerWidth: headerWidth,
      maxWidth: hasSidePhoto ? photoTextWidth : headerWidth,
      lineHeight: nameLineHeight,
    });
  }
  for (const contactLine of contactLines) {
    if (profilePhoto && contactLine.fullWidth) {
      addSpace(headerBlocks, 0.5 * MM_TO_PT);
    }
    const contactRuns = contactLine.items.flatMap((item, index) => [
      ...(index > 0 ? [{ text: " • ", style: "regular" as const }] : []),
      {
        text: item.text,
        style: "regular" as const,
        underline: Boolean(item.underline) && resume.typography.underlineLinks,
        href: item.href,
      },
    ]);
    addRuns(headerBlocks, contactRuns, sizes.body * 0.82, fonts, {
      align: "center",
      centerWidth: headerWidth,
      maxWidth: contactLine.fullWidth ? headerWidth : hasSidePhoto ? photoTextWidth : headerWidth,
      lineHeight: contactLineHeight,
    });
  }
  if (profilePhoto) {
    const textHeight = headerBlocks.reduce((height, block) => height + block.lineHeight, 0);
    blocks.push(...headerBlocks);
    if (photoPosition !== "center") {
      addSpace(blocks, Math.max(0, PROFILE_PHOTO_HEIGHT_MM * MM_TO_PT - textHeight));
    }
  } else {
    blocks.push(...headerBlocks);
  }
  if (contactLines.length) {
    addSpace(blocks, 4.5);
  }

  for (const section of resume.sections.filter((item) => item.visible && item.title.trim())) {
    const sectionBlocks: PdfLine[] = [];
    if (section.type === "languages") {
      const motherTongues = (section.motherTongues ?? []).map((name) => name.trim()).filter(Boolean);
      const languages = (section.others ?? []).filter((language) =>
        language.name.trim() || language.certificate.trim() || LANGUAGE_LEVEL_FIELDS.some((field) => language[field]),
      );
      if (!motherTongues.length && !languages.length) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, RESUME_TEXT_STYLES.heading.pdfFace, sizes.section, fonts, {
        keepWithNext: true,
        lineHeight: sizes.section * 1.2 + 2.25,
        sourceId: `${section.id}-heading`,
      });
      addSpace(sectionBlocks, compact ? 3.75 : 4.5);
      if (motherTongues.length) {
        addParagraph(sectionBlocks, `${motherTongues.length === 1 ? "Mother tongue" : "Mother tongues"}: ${motherTongues.join(", ")}`, fonts, {
          size: sizes.body,
          compact,
          sourceId: `${section.id}-mother-tongues`,
        });
      }
      const tableLanguages: ResumeLanguage[] = [];
      for (const language of languages) {
        const level = equalLanguageLevel(language);
        if (level) {
          addParagraph(sectionBlocks, `${language.name}: ${level}${language.certificate.trim() ? ` (${language.certificate.trim()})` : ""}`, fonts, {
            size: sizes.body,
            compact,
            sourceId: `${section.id}-language-${language.id}`,
          });
        } else {
          tableLanguages.push(language);
        }
      }
      if (tableLanguages.length) addLanguageTable(sectionBlocks, tableLanguages, fonts, sizes.body, `${section.id}-language-table`);
      addParagraph(sectionBlocks, "Levels: A1/A2 basic user, B1/B2 independent user, C1/C2 proficient user (CEFR).", fonts, {
        size: sizes.body * 0.85,
        compact,
        sourceId: `${section.id}-language-legend`,
      });
    } else if (section.type === "drivingLicence") {
      if (!section.drivingLicence?.trim()) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, RESUME_TEXT_STYLES.heading.pdfFace, sizes.section, fonts, {
        keepWithNext: true,
        lineHeight: sizes.section * 1.2 + 2.25,
        sourceId: `${section.id}-heading`,
      });
      addParagraph(sectionBlocks, section.drivingLicence, fonts, {
        size: sizes.body,
        compact,
        sourceId: `${section.id}-driving-licence`,
      });
    } else if (section.type === "summary") {
      const paragraphs = parseDescription(section.summary);
      if (!paragraphs.length) continue;
      addSpace(sectionBlocks, compact ? 10.5 : 11.25, true, `${section.id}-heading`);
      addText(sectionBlocks, section.title, RESUME_TEXT_STYLES.heading.pdfFace, sizes.section, fonts, {
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
      addText(sectionBlocks, section.title, RESUME_TEXT_STYLES.heading.pdfFace, sizes.section, fonts, {
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
          addText(sectionBlocks, group.label, RESUME_TEXT_STYLES.publicationGroup.pdfFace, sizes.subheading * 0.92, fonts, { keepWithNext: true });
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
      addText(sectionBlocks, section.title, RESUME_TEXT_STYLES.heading.pdfFace, sizes.section, fonts, {
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
  pages.forEach((pageBlocks, pageIndex) => {
    const page = document.addPage([pageWidth, sheetHeight]);
    if (profilePhoto && pageIndex === 0) {
      const photoWidth = PROFILE_PHOTO_WIDTH_MM * MM_TO_PT;
      const photoX = photoPosition === "left"
        ? margin
        : photoPosition === "center"
          ? (pageWidth - photoWidth) / 2
          : pageWidth - margin - photoWidth;
      const photoY = sheetHeight - margin - PROFILE_PHOTO_HEIGHT_MM * MM_TO_PT;
      const photoHeight = PROFILE_PHOTO_HEIGHT_MM * MM_TO_PT;
      page.drawRectangle({
        x: photoX,
        y: photoY,
        width: photoWidth,
        height: photoHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.82, 0.84, 0.86),
        borderWidth: 0.5,
      });
      page.drawImage(profilePhoto, {
        x: photoX + 0.5,
        y: photoY + 0.5,
        width: photoWidth - 1,
        height: photoHeight - 1,
      });
      page.drawRectangle({
        x: photoX,
        y: photoY,
        width: photoWidth,
        height: photoHeight,
        borderColor: rgb(0.82, 0.84, 0.86),
        borderWidth: 0.5,
      });
    }
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
      if (block.kind === "table" && block.tableRows && block.columnWidths) {
        let rowTop = top;
        page.drawLine({
          start: { x: margin, y: rowTop },
          end: { x: pageWidth - margin, y: rowTop },
          thickness: 0.45,
          color: rgb(0.25, 0.25, 0.25),
        });
        for (const row of block.tableRows) {
          let cellX = margin;
          row.cells.forEach((cellLines, cellIndex) => {
            const size = block.size * 0.78;
            cellLines.forEach((runs, lineIndex) => {
              let textX = cellX + 3;
              for (const run of runs) {
                page.drawText(run.text, {
                  x: textX,
                  y: rowTop - 3 - size - lineIndex * size * 1.2,
                  size,
                  font: fonts[row.header ? RESUME_TEXT_STYLES.tableHeader.pdfFace : run.style],
                  color: rgb(0.05, 0.05, 0.05),
                });
                textX += fonts[row.header ? RESUME_TEXT_STYLES.tableHeader.pdfFace : run.style].widthOfTextAtSize(run.text, size);
              }
            });
            cellX += block.columnWidths![cellIndex];
          });
          rowTop -= row.height;
          page.drawLine({
            start: { x: margin, y: rowTop },
            end: { x: pageWidth - margin, y: rowTop },
            thickness: 0.35,
            color: rgb(0.45, 0.45, 0.45),
          });
        }
        let columnX = margin;
        page.drawLine({ start: { x: columnX, y: top }, end: { x: columnX, y: rowTop }, thickness: 0.35, color: rgb(0.45, 0.45, 0.45) });
        for (const width of block.columnWidths) {
          columnX += width;
          page.drawLine({ start: { x: columnX, y: top }, end: { x: columnX, y: rowTop }, thickness: 0.35, color: rgb(0.45, 0.45, 0.45) });
        }
        top = rowTop - 4;
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
      if (block.align === "center") {
        x = margin + ((block.centerWidth ?? PAGE_CONTENT_WIDTH_MM * MM_TO_PT) - lineWidth) / 2;
      }
      for (const run of block.runs) {
        const baseline = top - block.size;
        assertFontSupportsText(fonts[run.style], run.text);
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
          assertFontSupportsText(fonts[run.style], run.text);
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
        assertFontSupportsText(fonts.regular, "•");
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

async function embedProfilePhoto(document: PDFDocument, dataUrl: string): Promise<PDFImage> {
  if (!isValidProfilePhotoDataUrl(dataUrl)) throw new Error("The profile photo data is invalid.");
  const match = dataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error("The profile photo format is not supported.");
  const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes], { type: `image/${match[1]}` }));
  } catch {
    throw new Error("The profile photo could not be decoded in this browser.");
  }
  const canvas = globalThis.document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 540;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("The profile photo could not be prepared for the PDF.");
  }
  const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const cropWidth = canvas.width / scale;
  const cropHeight = canvas.height / scale;
  context.drawImage(bitmap, (bitmap.width - cropWidth) / 2, (bitmap.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const outputType = match[1] === "png" ? "image/png" : "image/jpeg";
  const imageBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, 0.88));
  if (!imageBlob) throw new Error("The profile photo could not be converted for the PDF.");
  const imageBytes = await imageBlob.arrayBuffer();
  return outputType === "image/png" ? document.embedPng(imageBytes) : document.embedJpg(imageBytes);
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
