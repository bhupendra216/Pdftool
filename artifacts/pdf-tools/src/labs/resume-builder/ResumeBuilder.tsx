import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  applyModeDefaults,
  buildResumeContactLines,
  packResumeHeaderLines,
  clearSampleData as clearResumeSampleData,
  createBlankLanguage,
  createBlankPublication,
  createBlankResume,
  createSampleResume,
  DEFAULT_TYPOGRAPHY,
  equalLanguageLevel,
  findMatchingAuthor,
  LANGUAGE_LEVEL_FIELDS,
  LANGUAGE_LEVELS,
  isShareableDriveLink,
  normalizePublicationLink,
  normalizeResumeItemLink,
  isNonEmptyEntry,
  parseDescription,
  preserveTypography,
  publicationAuthorIndices,
  publicationGroups,
  PUBLICATION_STATUSES,
  PUBLICATION_TYPES,
  RESUME_TEXT_STYLES,
  TYPOGRAPHY_FONTS,
  TYPOGRAPHY_RANGES,
  sampleItemCount,
  setEuropeanStandard,
  isValidProfilePhotoDataUrl,
  STORAGE_KEY,
  validateResumeImport,
  validateResumeLink,
  PAGE_CONTENT_HEIGHT_MM,
  PAGE_CONTENT_WIDTH_MM,
  PAGE_HEIGHT_MM,
  PAGE_MARGIN_MM,
  PAGE_PAGINATION_HEIGHT_MM,
  PAGE_WIDTH_MM,
  PROFILE_PHOTO_MAX_BYTES,
  PROFILE_PHOTO_GAP_MM,
  PROFILE_PHOTO_HEIGHT_MM,
  PROFILE_PHOTO_WIDTH_MM,
  type PublicationStatus,
  type PublicationType,
  type ResumeDocument,
  type ResumeEntry,
  type ResumeLanguage,
  type ResumeMode,
  type ResumePublication,
  type ResumeSection,
  type SectionType,
  type TypographySettings,
} from "./model";
import { paginateBlocks, type PaginationBlock } from "./pagination";
import { createResumePdf, downloadBlob } from "./pdf-export";
import pdfKiraDemoPhoto from "@/assets/pdfkira-logo.png?inline";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LABELS: Record<SectionType, string> = {
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  languages: "Languages",
  digitalSkills: "Digital skills",
  projects: "Projects",
  publications: "Publications",
  skills: "Skills",
  certifications: "Certifications",
  awards: "Awards",
  conferences: "Conferences",
  grants: "Grants",
  memberships: "Memberships",
  community: "Community involvement",
  drivingLicence: "Driving licence",
  custom: "Custom section",
};
const JOB_GUIDANCE = "Lead with relevant experience and measurable outcomes. Keep the most relevant details easy to scan.";
const STUDY_GUIDANCE = "Lead with education, projects, and research. Include relevant coursework, publications, and academic work.";
const EMPTY_ENTRY = (): ResumeEntry => ({
  id: crypto.randomUUID(),
  title: "",
  organization: "",
  location: "",
  dates: "",
  description: "",
  link: "",
  sample: false,
});
const PUBLICATION_GUIDANCE = "Add one paper per entry. Authors go in the order printed on the paper.";
const PUBLICATION_HELP = [
  "List all authors in the order printed on the paper. Never move yourself up.",
  "Choose which author you are, and your name will appear in bold.",
  "Add * for equal contribution or † for corresponding author only if the paper marks it.",
  "Say where each paper stands: published, accepted, under review or in preparation. Don’t list an unaccepted paper as published.",
  "Add a DOI or link when you have one.",
  "Applying for higher study? Add one line on your role in the key papers.",
];
const PUBLICATION_LINK_HELP = "Paste a link to your certificate or award letter from Google Drive, Dropbox, OneDrive or your own site. Make sure sharing is set to ‘Anyone with the link can view’, or reviewers won’t be able to open it. This tool never uploads your files. Don’t link to documents that show your ID number, address or grades unless the application asks for them.";
const SHARE_LINK_HINT = "Check that sharing is set to ‘Anyone with the link can view’.";
const POINTS_PER_CSS_PIXEL = 1.333;
let resumeHeaderMeasureContext: CanvasRenderingContext2D | null | undefined;

function measureHeaderText(font: string, fontSize: number) {
  resumeHeaderMeasureContext ??= document.createElement("canvas").getContext("2d");
  if (resumeHeaderMeasureContext) resumeHeaderMeasureContext.font = `${fontSize}px ${font}`;
  return (text: string) => resumeHeaderMeasureContext?.measureText(text).width ?? text.length * fontSize * 0.5;
}

type PaperStyle = CSSProperties & {
  "--rb-font-family": string;
  "--rb-name-size": string;
  "--rb-section-size": string;
  "--rb-subheading-size": string;
  "--rb-body-size": string;
  "--rb-contact-size": string;
  "--rb-organization-size": string;
  "--rb-location-size": string;
  "--rb-date-size": string;
  "--rb-link-decoration": string;
  "--rb-weight-name": string;
  "--rb-weight-heading": string;
  "--rb-weight-entry-title": string;
  "--rb-weight-entry-subtitle": string;
  "--rb-weight-date": string;
  "--rb-weight-body": string;
  "--rb-weight-label": string;
  "--rb-weight-publication-author": string;
  "--rb-weight-table-header": string;
  "--rb-weight-table-row-header": string;
  "--rb-style-date": string;
  "--rb-style-publication-group": string;
};

export function getPaperStyle(settings: TypographySettings): PaperStyle {
  const font = TYPOGRAPHY_FONTS.find((option) => option.id === settings.font) ?? TYPOGRAPHY_FONTS[0];
  const pixels = (points: number) => `${points * POINTS_PER_CSS_PIXEL}px`;
  return {
    "--rb-font-family": font.stack,
    "--rb-name-size": pixels(settings.namePt),
    "--rb-section-size": pixels(settings.sectionHeadingPt),
    "--rb-subheading-size": pixels(settings.subheadingPt),
    "--rb-body-size": pixels(settings.bodyPt),
    "--rb-contact-size": "calc(var(--rb-body-size) * 0.82)",
    "--rb-organization-size": "calc(var(--rb-subheading-size) * 0.9052631578947368)",
    "--rb-location-size": "calc(var(--rb-subheading-size) * 0.9052631578947368)",
    "--rb-date-size": "calc(var(--rb-subheading-size) * 0.8631578947368421)",
    "--rb-link-decoration": settings.underlineLinks ? "underline" : "none",
    "--rb-weight-name": String(RESUME_TEXT_STYLES.name.weight),
    "--rb-weight-heading": String(RESUME_TEXT_STYLES.heading.weight),
    "--rb-weight-entry-title": String(RESUME_TEXT_STYLES.entryTitle.weight),
    "--rb-weight-entry-subtitle": String(RESUME_TEXT_STYLES.entrySubtitle.weight),
    "--rb-weight-date": String(RESUME_TEXT_STYLES.date.weight),
    "--rb-weight-body": String(RESUME_TEXT_STYLES.body.weight),
    "--rb-weight-label": String(RESUME_TEXT_STYLES.label.weight),
    "--rb-weight-publication-author": String(RESUME_TEXT_STYLES.publicationAuthor.weight),
    "--rb-weight-table-header": String(RESUME_TEXT_STYLES.tableHeader.weight),
    "--rb-weight-table-row-header": String(RESUME_TEXT_STYLES.tableRowHeader.weight),
    "--rb-style-date": RESUME_TEXT_STYLES.date.fontStyle,
    "--rb-style-publication-group": RESUME_TEXT_STYLES.publicationGroup.fontStyle,
  };
}

function displayPoints(value: number): number {
  return Math.round(value * 2) / 2;
}

type MobileView = "edit" | "preview";
export type DocumentBlock = PaginationBlock & {
  content: ReactNode;
  text?: string;
  sourceId?: string;
  lineRanges?: Array<[number, number]>;
  paragraphMargins?: [number, number];
};

export function createResumeContactItems(resume: ResumeDocument): Array<{
  fullWidth: boolean;
  items: Array<{ key: string; text: string; content: ReactNode }>;
}> {
  const font = TYPOGRAPHY_FONTS.find((option) => option.id === resume.typography.font) ?? TYPOGRAPHY_FONTS[0];
  const fontSize = resume.typography.bodyPt * POINTS_PER_CSS_PIXEL * 0.82;
  const measure = measureHeaderText(font.stack, fontSize);
  const hasSidePhoto = resume.europeanStandard && Boolean(resume.profilePhotoDataUrl) && resume.photoPosition !== "center";
  const fullWidth = PAGE_CONTENT_WIDTH_MM * 96 / 25.4;
  const sideWidth = (PAGE_CONTENT_WIDTH_MM - (PROFILE_PHOTO_WIDTH_MM + PROFILE_PHOTO_GAP_MM) * 2) * 96 / 25.4;
  const nameHeight = resume.contact.fullName.trim()
    ? resume.typography.namePt * POINTS_PER_CSS_PIXEL * 1.2 + 5
    : 0;
  const headerItems = buildResumeContactLines(resume).flatMap((line, lineIndex) => line.map((item, itemIndex) => ({
    ...item,
    breakBefore: item.breakBefore || (lineIndex > 0 && itemIndex === 0),
  })));
  const packedLines = packResumeHeaderLines(headerItems, hasSidePhoto ? sideWidth : fullWidth, measure, {
    ...(hasSidePhoto ? { fullWidth, photoBottom: PROFILE_PHOTO_HEIGHT_MM * 96 / 25.4 } : {}),
    initialHeight: nameHeight,
    lineHeight: fontSize * 1.2 + 6,
  });
  return packedLines.map((line) => ({
    fullWidth: line.fullWidth,
    items: line.items.map((item) => ({
      key: item.key,
      text: item.text,
      content: item.href
        ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>
        : <span>{item.text}</span>,
    })),
  }));
}

export function escapeLatex(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde ")
    .replace(/\^/g, "\\textasciicircum ");
}

export async function processProfilePhoto(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new Error("The photo must be 5 MB or smaller.");
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This image could not be read. Choose a valid PNG, JPEG, or WebP photo.");
  }
  const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("The photo could not be prepared in this browser.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, 0.88));
  if (!blob || blob.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new Error("The prepared photo is too large. Choose a smaller image.");
  }
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The photo could not be read."));
    reader.onerror = () => reject(new Error("The photo could not be read."));
    reader.readAsDataURL(blob);
  });
}

let demoPhotoPromise: Promise<string> | undefined;

function loadDemoPhotoDataUrl(): Promise<string> {
  if (!demoPhotoPromise) {
    demoPhotoPromise = (async () => {
      const match = pdfKiraDemoPhoto.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!match) throw new Error("The bundled demo photo has an invalid image format.");
      const imageBytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
      const image = new Blob([imageBytes], { type: `image/${match[1]}` });
      return processProfilePhoto(new File([image], "pdfkira-logo.png", { type: image.type }));
    })().catch((error: unknown) => {
      demoPhotoPromise = undefined;
      throw error;
    });
  }
  return demoPhotoPromise;
}

function isRecordValue(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function discardUndecodableImportedPhoto(value: unknown) {
  if (!isRecordValue(value) || !isValidProfilePhotoDataUrl(value.profilePhotoDataUrl)) return;
  const match = value.profilePhotoDataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return;
  const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
  try {
    const bitmap = await createImageBitmap(new Blob([bytes], { type: `image/${match[1]}` }));
    bitmap.close();
  } catch {
    delete value.profilePhotoDataUrl;
    value.profilePhotoSample = false;
  }
}

export function buildLatexResume(resume: ResumeDocument): string {
  const visibleSections = resume.sections.filter((section) => section.visible);
  const maybeLines = (lines: string[]) => lines.filter((line) => line.trim().length > 0);
  const sectionHeader = (title: string) => `\\section*{${escapeLatex(title)}}`;
  const paragraphBlocks = (text: string) => {
    const textLines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const output: string[] = [];
    for (const line of textLines) {
      if (/^(?:-|•)\s*/.test(line)) output.push(`\\item ${escapeLatex(line.replace(/^(?:-|•)\s*/, ""))}`);
      else output.push(escapeLatex(line));
    }
    return output;
  };

  const lines: string[] = [
    "% compile with xelatex",
    "\\documentclass[11pt]{article}",
    "\\usepackage[a4paper,margin=20mm]{geometry}",
    "\\usepackage{fontspec}",
    "\\setmainfont{Georgia}",
    "\\begin{document}",
  ];

  if (resume.europeanStandard && resume.profilePhotoDataUrl) lines.push("% photo not included");
  const latexFontSize = 11 * POINTS_PER_CSS_PIXEL;
  const measure = measureHeaderText("Georgia", latexFontSize);
  const headerItems = buildResumeContactLines(resume).flatMap((line, lineIndex) => line.map((item, itemIndex) => ({
    ...item,
    breakBefore: item.breakBefore || (lineIndex > 0 && itemIndex === 0),
  })));
  const hasSidePhoto = resume.europeanStandard && Boolean(resume.profilePhotoDataUrl) && resume.photoPosition !== "center";
  const latexFullWidth = 170 * 96 / 25.4;
  const latexSideWidth = (170 - 2 * (PROFILE_PHOTO_WIDTH_MM + PROFILE_PHOTO_GAP_MM)) * 96 / 25.4;
  const contactLines = packResumeHeaderLines(headerItems, hasSidePhoto ? latexSideWidth : latexFullWidth, measure, {
    ...(hasSidePhoto ? {
      fullWidth: latexFullWidth,
      photoBottom: PROFILE_PHOTO_HEIGHT_MM * 96 / 25.4,
    } : {}),
    initialHeight: resume.contact.fullName.trim() ? 11 * POINTS_PER_CSS_PIXEL * 1.2 : 0,
    lineHeight: latexFontSize * 1.2,
  });
  const hasHeader = Boolean(resume.contact.fullName.trim()) || contactLines.length > 0;
  if (hasHeader) lines.push("\\begin{center}");
  if (resume.contact.fullName.trim()) {
    lines.push(`\\textbf{\\Large ${escapeLatex(resume.contact.fullName)}}`);
  }
  for (const contactLine of contactLines) {
    const items = contactLine.items.map((item) => item.key === "email"
      ? `\\texttt{${escapeLatex(item.text)}}`
      : escapeLatex(item.text));
    lines.push(`\\noindent ${items.join(" \\textbullet ")}\\par`);
  }
  if (hasHeader) lines.push("\\end{center}");

  for (const section of visibleSections) {
    if (!section.title.trim()) continue;
    if (section.type === "languages") {
      const motherTongues = (section.motherTongues ?? []).map((name) => name.trim()).filter(Boolean);
      const languages = (section.others ?? []).filter((language) =>
        language.name.trim() || language.certificate.trim() || LANGUAGE_LEVEL_FIELDS.some((field) => language[field]),
      );
      if (!motherTongues.length && !languages.length) continue;
      lines.push(sectionHeader(section.title));
      if (motherTongues.length) {
        lines.push(`\\textbf{Mother tongues:} ${escapeLatex(motherTongues.join(", "))}`);
      }
      for (const language of languages) {
        const level = equalLanguageLevel(language);
        const suffix = language.certificate.trim() ? ` (${escapeLatex(language.certificate.trim())})` : "";
        const line = `${escapeLatex(language.name.trim() || "Language")}: ${level ? escapeLatex(level) : ""}${suffix}`;
        lines.push(line);
      }
      continue;
    }
    if (section.type === "summary") {
      const summaryLines = parseDescription(section.summary);
      if (!summaryLines.length) continue;
      lines.push(sectionHeader(section.title));
      for (const line of summaryLines) {
        if (line.kind === "bullet") lines.push(`\\begin{itemize}\\item ${escapeLatex(line.text)}\\end{itemize}`);
        else lines.push(escapeLatex(line.text));
      }
      continue;
    }
    if (section.type === "publications") {
      const publications = section.publications.filter((publication) =>
        publication.title.trim().length > 0 || publication.authors.some((author) => author.trim().length > 0),
      );
      if (!publications.length) continue;
      lines.push(sectionHeader(section.title));
      for (const publication of publications) {
        const authors = publication.authors.map((author) => escapeLatex(author)).join(", ");
        const venue = publication.venue.trim() ? `\\emph{${escapeLatex(publication.venue)}}` : "";
        const year = publication.year.trim() ? escapeLatex(publication.year) : "";
        const title = publication.title.trim() ? `${escapeLatex(publication.title.trim())}. ` : "";
        lines.push(`\\textbf{${authors}}. ${title}${venue}${year ? `, ${year}` : ""}`);
      }
      continue;
    }
    const entries = section.entries.filter(isNonEmptyEntry);
    if (!entries.length) continue;
    lines.push(sectionHeader(section.title));
    for (const entry of entries) {
      const title = entry.title.trim() ? escapeLatex(entry.title.trim()) : "";
      const organization = entry.organization.trim() ? escapeLatex(entry.organization.trim()) : "";
      const details = [organization, entry.location.trim() ? escapeLatex(entry.location.trim()) : "", entry.dates.trim() ? escapeLatex(entry.dates.trim()) : ""].filter(Boolean).join(" -- ");
      if (title) lines.push(`\\textbf{${title}}${details ? ` -- ${details}` : ""}`);
      else if (details) lines.push(details);
      if (entry.description.trim()) {
        for (const line of paragraphBlocks(entry.description)) {
          if (/^\\item/.test(line)) lines.push(`\\begin{itemize}${line}\\end{itemize}`);
          else lines.push(line);
        }
      }
    }
  }

  lines.push("\\end{document}");
  return lines.join("\n");
}

export function createResumeBlocks(
  resume: ResumeDocument,
  contactItems: Array<{
    fullWidth: boolean;
    items: Array<{ key: string; text: string; content: ReactNode }>;
  }>,
): DocumentBlock[] {
  const blocks: DocumentBlock[] = [{
    id: "resume-header",
    height: 0,
    content: (
      <header
        className={`rb-document-header${resume.europeanStandard && resume.profilePhotoDataUrl ? " has-photo" : ""}`}
        data-photo-position={resume.europeanStandard && resume.profilePhotoDataUrl ? resume.photoPosition : undefined}
      >
        {resume.europeanStandard && resume.profilePhotoDataUrl && resume.photoPosition === "center" && (
          <img className="rb-profile-photo" src={resume.profilePhotoDataUrl} alt="Profile photo" />
        )}
        <div className="rb-header-copy">
          {resume.contact.fullName.trim() && (
            <h1 className="rb-name">
              <span className="rb-header-line-content">{resume.contact.fullName}</span>
            </h1>
          )}
          {contactItems.map((line, lineIndex) => (
            <div className={`rb-contact-line${line.fullWidth ? " full-width" : ""}`} key={`contact-line-${lineIndex}`}>
              <span className="rb-header-line-content">
                {line.items.map((item, index) => (
                  <span className="rb-contact-item" key={item.key}>
                    {index > 0 && <span className="rb-contact-separator" aria-hidden="true"> • </span>}
                    {item.content}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        {resume.europeanStandard && resume.profilePhotoDataUrl && resume.photoPosition !== "center" && (
          <img className="rb-profile-photo" src={resume.profilePhotoDataUrl} alt="Profile photo" />
        )}
      </header>
    ),
  }];

  const addDescription = (text: string, groupId: string) => {
    const descriptionBlocks: DocumentBlock[] = [];
    parseDescription(text).forEach((item, index) => {
      const id = `${groupId}-description-${index}`;
      descriptionBlocks.push({
        id,
        groupId,
        height: 0,
        text: item.text,
        splittable: item.kind === "paragraph" ? { lineHeights: [] } : undefined,
        content: item.kind === "paragraph"
          ? <p data-paragraph-block={id}>{item.text}</p>
          : <ul className="rb-bullets"><li>{item.text}</li></ul>,
      });
    });
    return descriptionBlocks;
  };

  for (const section of resume.sections.filter((item) => item.visible)) {
    if (!section.title.trim()) continue;
    const sectionBlocks: DocumentBlock[] = [];
    if (section.type === "languages") {
      const motherTongues = (section.motherTongues ?? []).map((name) => name.trim()).filter(Boolean);
      const languages = (section.others ?? []).filter((language) =>
        language.name.trim() || language.certificate.trim() || LANGUAGE_LEVEL_FIELDS.some((field) => language[field]),
      );
      if (!motherTongues.length && !languages.length) continue;
      sectionBlocks.push({
        id: `${section.id}-heading`,
        height: 0,
        keepWithNext: true,
        content: <h2>{section.title}</h2>,
      });
      if (motherTongues.length) {
        sectionBlocks.push({
          id: `${section.id}-mother-tongues`,
          height: 0,
          content: <p className="rb-language-mother-tongues">{motherTongues.length === 1 ? "Mother tongue" : "Mother tongues"}: {motherTongues.join(", ")}</p>,
        });
      }
      const tableLanguages: ResumeLanguage[] = [];
      for (const language of languages) {
        const level = equalLanguageLevel(language);
        if (level) {
          sectionBlocks.push({
            id: `${section.id}-language-${language.id}`,
            height: 0,
            content: <p>{language.name}: {level}{language.certificate.trim() ? ` (${language.certificate.trim()})` : ""}</p>,
          });
        } else {
          tableLanguages.push(language);
        }
      }
      if (tableLanguages.length) {
        sectionBlocks.push({
          id: `${section.id}-language-table`,
          height: 0,
          keepWithNext: true,
          content: (
            <table className="rb-language-table">
              <thead><tr><th>Language</th><th>Listening</th><th>Reading</th><th>Spoken interaction</th><th>Spoken production</th><th>Writing</th></tr></thead>
              <tbody>{tableLanguages.map((language) => (
                <tr key={language.id}>
                  <th scope="row">{language.name}{language.certificate.trim() ? ` (${language.certificate.trim()})` : ""}</th>
                  {LANGUAGE_LEVEL_FIELDS.map((field) => <td key={field}>{language[field]}</td>)}
                </tr>
              ))}</tbody>
            </table>
          ),
        });
      }
      sectionBlocks.push({
        id: `${section.id}-language-legend`,
        height: 0,
        content: <p className="rb-language-legend">Levels: A1/A2 basic user, B1/B2 independent user, C1/C2 proficient user (CEFR).</p>,
      });
    } else if (section.type === "drivingLicence") {
      if (!section.drivingLicence?.trim()) continue;
      sectionBlocks.push({
        id: `${section.id}-heading`,
        height: 0,
        keepWithNext: true,
        content: <h2>{section.title}</h2>,
      }, {
        id: `${section.id}-driving-licence`,
        height: 0,
        content: <p>{section.drivingLicence}</p>,
      });
    } else if (section.type === "summary") {
      const lines = parseDescription(section.summary);
      if (lines.length === 0) continue;
      sectionBlocks.push({
        id: `${section.id}-heading`,
        height: 0,
        keepWithNext: true,
        content: <h2>{section.title}</h2>,
      });
      lines.forEach((line, index) => {
        const id = `${section.id}-summary-${index}`;
        sectionBlocks.push({
          id,
          height: 0,
          text: line.text,
          splittable: line.kind === "paragraph" ? { lineHeights: [] } : undefined,
          content: line.kind === "paragraph"
            ? <p data-paragraph-block={id}>{line.text}</p>
            : <ul className="rb-bullets"><li>{line.text}</li></ul>,
        });
      });
    } else if (section.type === "publications") {
      const publications = section.publications.filter((publication) =>
        publication.title.trim().length > 0 || publication.authors.some((author) => author.trim().length > 0),
      );
      if (publications.length === 0) continue;
      sectionBlocks.push({
        id: `${section.id}-heading`,
        height: 0,
        keepWithNext: true,
        content: <h2>{section.title}</h2>,
      });
      const groups = section.publicationOptions.groupByType
        ? publicationGroups(publications)
        : [{ type: null, label: "", entries: publications }];
      let publicationNumber = 0;
      for (const group of groups) {
        if (group.label) {
          sectionBlocks.push({
            id: `${section.id}-group-${group.type}`,
            height: 0,
            keepWithNext: true,
            content: <h3 className="rb-publication-group">{group.label}</h3>,
          });
        }
        for (const publication of group.entries) {
          publicationNumber += 1;
          sectionBlocks.push({
            id: `publication-${publication.id}`,
            height: 0,
            content: (
              <PublicationCitation
                publication={publication}
                number={publicationNumber}
                numbered={section.publicationOptions.numberedStyle}
                shortenAuthors={section.publicationOptions.shortenAuthors}
              />
            ),
          });
        }
      }
    } else {
      const entries = section.entries.filter(isNonEmptyEntry);
      if (entries.length === 0) continue;
      sectionBlocks.push({
        id: `${section.id}-heading`,
        height: 0,
        keepWithNext: true,
        content: <h2>{section.title}</h2>,
      });
      for (const entry of entries) {
        const groupId = `entry-${entry.id}`;
        if (section.type === "skills" || section.type === "digitalSkills") {
          sectionBlocks.push({
            id: `${groupId}-skills`,
            groupId,
            height: 0,
            content: <p className="rb-skill-subsection"><strong className="rb-role-label">{entry.title || "Skills"}:</strong> {entry.description}</p>,
          });
          continue;
        }
        const title = section.type === "awards" || section.type === "certifications" || section.type === "conferences"
          ? renderLinkedEntryTitle(entry, true)
          : section.type === "education"
            ? renderLinkedEntryTitle(entry, false)
            : entry.title || entry.organization;
        sectionBlocks.push({
          id: `${groupId}-title`,
          groupId,
          height: 0,
          keepWithNext: true,
          content: (
            <div className="rb-entry-heading">
              <h3>{title}</h3>
              <span className="rb-entry-right rb-entry-dates">{entry.dates}</span>
            </div>
          ),
        });
        sectionBlocks.push({
          id: `${groupId}-organization`,
          groupId,
          height: 0,
          keepWithNext: Boolean(entry.description.trim()),
          content: (
            <div className="rb-entry-subheading">
              <span>{entry.organization}</span>
              <span className="rb-entry-right">{entry.location}</span>
            </div>
          ),
        });
        sectionBlocks.push(...addDescription(entry.description, groupId));
      }
    }
    sectionBlocks.push({
      id: `${section.id}-rule`,
      height: 0,
      content: <div className="rb-section-rule" aria-hidden="true" />,
    });
    blocks.push(...sectionBlocks);
  }
  return blocks;
}

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeDocument>(() => createSampleResume());
  const [storageNotice, setStorageNotice] = useState("");
  const [liveMessage, setLiveMessage] = useState("");
  const [linkError, setLinkError] = useState("");
  const [importError, setImportError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("edit");
  const [publicationHelpOpen, setPublicationHelpOpen] = useState(true);
  const [addHintDismissed, setAddHintDismissed] = useState(false);
  const [undoState, setUndoState] = useState<{ sectionId: string; previousVisible: boolean } | null>(null);
  const [pages, setPages] = useState<PaginationBlock[][]>([]);
  const [pageScale, setPageScale] = useState(1);
  const undoTimer = useRef<number | null>(null);
  const addSectionRef = useRef<HTMLDetailsElement>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const importInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.add("rb-print-mode");
    return () => {
      document.body.classList.remove("rb-print-mode");
      if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      setStorageNotice("");
    } catch {
      setStorageNotice("Browser storage is unavailable. Your latest edits are only in this open tab.");
    }
  }, [resume]);

  const sampleCount = useMemo(() => sampleItemCount(resume), [resume]);
  const hiddenSections = resume.sections.filter((item) => !item.visible);

  function updateResume(updater: (current: ResumeDocument) => ResumeDocument) {
    setResume(updater);
  }

  function updateContact(field: "fullName" | "email" | "phone" | "location" | "nationality" | "dateOfBirth" | "address", value: string) {
    updateResume((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
        sampleFields: current.contact.sampleFields.filter((name) => name !== field),
      },
    }));
  }

  function updateEntry(sectionId: string, entryId: string, field: keyof Omit<ResumeEntry, "id" | "sample">, value: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id !== sectionId ? item : {
        ...item,
        europeanSampleSeeded: true,
        entries: item.entries.map((entry) => entry.id !== entryId ? entry : { ...entry, [field]: value, sample: false }),
      }),
    }));
  }

  function updateSection(sectionId: string, patch: Partial<Pick<ResumeSection, "title" | "visible" | "publicationOptions">>) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id === sectionId ? {
        ...item,
        ...patch,
        visibilityCustomized: patch.visible === undefined ? item.visibilityCustomized : true,
        europeanSampleSeeded: true,
      } : item),
    }));
  }

  function updateSummary(sectionId: string, summary: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) =>
        item.id === sectionId ? { ...item, summary, summarySample: false, europeanSampleSeeded: true } : item,
      ),
    }));
  }

  function updateTypography<K extends keyof TypographySettings>(key: K, value: TypographySettings[K]) {
    setResume((current) => ({
      ...current,
      typography: { ...current.typography, [key]: value },
    }));
  }

  function stepTypography(key: keyof typeof TYPOGRAPHY_RANGES, direction: -1 | 1) {
    const range = TYPOGRAPHY_RANGES[key];
    setResume((current) => ({
      ...current,
      typography: {
        ...current.typography,
        [key]: Math.min(range.max, Math.max(range.min, Math.round((current.typography[key] + direction * 0.5) * 10) / 10)),
      },
    }));
  }

  function changeTypographyInput(key: keyof typeof TYPOGRAPHY_RANGES, rawValue: string) {
    if (!rawValue.trim()) return;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    const range = TYPOGRAPHY_RANGES[key];
    const steppedValue = Math.round(value * 2) / 2;
    updateTypography(key, Math.min(range.max, Math.max(range.min, steppedValue)));
  }

  function updatePublication(sectionId: string, publicationId: string, patch: Partial<ResumePublication>) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id !== sectionId ? item : {
        ...item,
        europeanSampleSeeded: true,
        publications: item.publications.map((publication) =>
          publication.id === publicationId ? { ...publication, ...patch, sample: false } : publication,
        ),
      }),
    }));
  }

  function updateLanguage(sectionId: string, languageId: string, patch: Partial<Omit<ResumeLanguage, "id" | "sample">>) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.type !== "languages" || item.id !== sectionId ? item : {
        ...item,
        europeanSampleSeeded: true,
        languagesSample: false,
        others: (item.others ?? []).map((language) => language.id === languageId
          ? { ...language, ...patch, sample: false }
          : language),
      }),
    }));
  }

  function addLanguage(sectionId: string) {
    const language = createBlankLanguage();
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.type === "languages" && item.id === sectionId
        ? { ...item, europeanSampleSeeded: true, others: [...(item.others ?? []), language], languagesSample: false }
        : item),
    }));
    setLiveMessage("Language added.");
  }

  function removeLanguage(sectionId: string, languageId: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.type === "languages" && item.id === sectionId
        ? { ...item, europeanSampleSeeded: true, others: (item.others ?? []).filter((language) => language.id !== languageId), languagesSample: false }
        : item),
    }));
    setLiveMessage("Language removed.");
  }

  function updateMotherTongue(sectionId: string, index: number, value: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => {
        if (item.type !== "languages" || item.id !== sectionId) return item;
        const motherTongues = [...(item.motherTongues ?? [])];
        motherTongues[index] = value;
        return { ...item, europeanSampleSeeded: true, motherTongues, languagesSample: false };
      }),
    }));
  }

  function addMotherTongue(sectionId: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.type === "languages" && item.id === sectionId
        ? { ...item, europeanSampleSeeded: true, motherTongues: [...(item.motherTongues ?? []), ""], languagesSample: false }
        : item),
    }));
  }

  function removeMotherTongue(sectionId: string, index: number) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.type === "languages" && item.id === sectionId
        ? { ...item, europeanSampleSeeded: true, motherTongues: (item.motherTongues ?? []).filter((_, tongueIndex) => tongueIndex !== index), languagesSample: false }
        : item),
    }));
  }

  function addPublication(sectionId: string) {
    const publication = createBlankPublication();
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) =>
        item.id === sectionId ? { ...item, europeanSampleSeeded: true, publications: [...item.publications, publication] } : item,
      ),
    }));
    setLiveMessage("Publication added.");
  }

  function removePublication(sectionId: string, publicationId: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id !== sectionId ? item : {
        ...item,
        europeanSampleSeeded: true,
        publications: item.publications.filter((publication) => publication.id !== publicationId),
      }),
    }));
    setLiveMessage("Publication removed.");
  }

  function movePublication(sectionId: string, publicationId: string, direction: -1 | 1) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => {
        if (item.id !== sectionId) return item;
        const index = item.publications.findIndex((publication) => publication.id === publicationId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= item.publications.length) return item;
        const publications = [...item.publications];
        [publications[index], publications[target]] = [publications[target], publications[index]];
        return { ...item, europeanSampleSeeded: true, publications };
      }),
    }));
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    updateResume((current) => {
      const visible = current.sections.filter((item) => item.visible);
      const index = visible.findIndex((item) => item.id === sectionId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= visible.length) return current;
      [visible[index], visible[target]] = [visible[target], visible[index]];
      const reordered = visible.map((item) => ({ ...item, europeanSampleSeeded: true }));
      let visibleIndex = 0;
      const sections = [...current.sections];
      for (let slot = 0; slot < sections.length; slot += 1) {
        if (sections[slot].visible) sections[slot] = reordered[visibleIndex++];
      }
      return { ...current, sections };
    });
  }

  function toggleSection(section: ResumeSection) {
    if (!section.visible) {
      updateSection(section.id, { visible: true });
      setUndoState(null);
      setLiveMessage(`${section.title} section restored.`);
      requestAnimationFrame(() => sectionRefs.current.get(section.id)?.focus());
      return;
    }
    const sectionIndex = resume.sections.findIndex((item) => item.id === section.id);
    const nextSection = resume.sections.slice(sectionIndex + 1).find((item) => item.visible);
    updateSection(section.id, { visible: false });
    setUndoState({ sectionId: section.id, previousVisible: true });
    setLiveMessage(`${section.title} section hidden. Its data is kept.`);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndoState(null), 8_000);
    requestAnimationFrame(() => {
      if (nextSection) sectionRefs.current.get(nextSection.id)?.focus();
      else addSectionRef.current?.querySelector("summary")?.focus();
    });
  }

  function undoHide() {
    if (!undoState) return;
    updateSection(undoState.sectionId, { visible: undoState.previousVisible });
    const restored = resume.sections.find((item) => item.id === undoState.sectionId);
    setLiveMessage(`${restored?.title ?? "Section"} removal undone.`);
    if (undoTimer.current !== null) window.clearTimeout(undoTimer.current);
    setUndoState(null);
    requestAnimationFrame(() => sectionRefs.current.get(undoState.sectionId)?.focus());
  }

  function addSection(type: SectionType) {
    const section = resume.sections.find((item) => item.type === type);
    if (!section) return;
    updateSection(section.id, { visible: true });
    if (type === "custom" && !section.title.trim()) updateSection(section.id, { title: "Custom section" });
    setLiveMessage(`${LABELS[type]} section added.`);
    if (addSectionRef.current) addSectionRef.current.open = false;
    requestAnimationFrame(() => sectionRefs.current.get(section.id)?.focus());
  }

  function addEntry(sectionId: string) {
    const nextEntry = EMPTY_ENTRY();
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) =>
        item.id === sectionId ? { ...item, europeanSampleSeeded: true, entries: [...item.entries, nextEntry] } : item,
      ),
    }));
    setLiveMessage("Entry added.");
  }

  function removeEntry(sectionId: string, entryId: string) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id !== sectionId ? item : {
        ...item,
        europeanSampleSeeded: true,
        entries: item.entries.filter((entry) => entry.id !== entryId),
      }),
    }));
    setLiveMessage("Entry removed.");
  }

  function moveEntry(sectionId: string, entryId: string, direction: -1 | 1) {
    updateResume((current) => ({
      ...current,
      sections: current.sections.map((item) => {
        if (item.id !== sectionId) return item;
        const index = item.entries.findIndex((entry) => entry.id === entryId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= item.entries.length) return item;
        const entries = [...item.entries];
        [entries[index], entries[target]] = [entries[target], entries[index]];
        return { ...item, europeanSampleSeeded: true, entries };
      }),
    }));
  }

  function addLink() {
    const labelInput = document.getElementById("rb-link-label") as HTMLInputElement | null;
    const urlInput = document.getElementById("rb-link-url") as HTMLInputElement | null;
    const label = labelInput?.value.trim() ?? "";
    const url = urlInput?.value.trim() ?? "";
    if (!label || !validateResumeLink(url)) {
      setLinkError("Enter a label and a valid http, https, or mailto link.");
      return;
    }
    if (resume.contact.links.length >= 10) {
      setLinkError("You can add up to 10 links.");
      return;
    }
    updateResume((current) => ({
      ...current,
      contact: { ...current.contact, links: [...current.contact.links, { id: crypto.randomUUID(), label, url, sample: false }] },
    }));
    setLinkError("");
    if (labelInput) labelInput.value = "";
    if (urlInput) urlInput.value = "";
  }

  function removeLink(id: string) {
    updateResume((current) => ({
      ...current,
      contact: { ...current.contact, links: current.contact.links.filter((item) => item.id !== id) },
    }));
    setLiveMessage("Link removed.");
  }

  function changeMode(mode: ResumeMode) {
    updateResume((current) => ({
      ...current,
      mode,
      sections: applyModeDefaults(current.sections.map((section) => {
        return section.type !== "summary" ? section : {
          ...section,
          title: section.title === (current.mode === "study" ? "Research interests" : "Summary")
            ? mode === "study" ? "Research interests" : "Summary"
            : section.title,
        };
      }), mode, current.europeanStandard),
    }));
  }

  function changeEuropeanStandard(checked: boolean) {
    if (checked && resume.profilePhotoSeedAllowed && !resume.profilePhotoDataUrl) {
      updateResume((current) => setEuropeanStandard(current, checked));
      void (async () => {
        try {
          const demoPhotoDataUrl = await loadDemoPhotoDataUrl();
          updateResume((current) => current.europeanStandard && current.profilePhotoSeedAllowed && !current.profilePhotoDataUrl
            ? { ...current, profilePhotoDataUrl: demoPhotoDataUrl, profilePhotoSample: true, profilePhotoSeedAllowed: false }
            : current);
        } catch (error) {
          setPhotoError(error instanceof Error ? error.message : "The bundled demo photo could not be prepared.");
        }
      })();
      return;
    }
    updateResume((current) => setEuropeanStandard(current, checked));
  }

  async function changeProfilePhoto(file?: File) {
    if (!file) return;
    try {
      const profilePhotoDataUrl = await processProfilePhoto(file);
      setResume((current) => ({
        ...current,
        profilePhotoDataUrl,
        profilePhotoSample: false,
        profilePhotoSeedAllowed: false,
      }));
      setPhotoError("");
      setLiveMessage(resume.profilePhotoDataUrl ? "Profile photo replaced." : "Profile photo added.");
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "The photo could not be prepared.");
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  function removeProfilePhoto() {
    setResume((current) => {
      const { profilePhotoDataUrl: _profilePhotoDataUrl, ...withoutPhoto } = current;
      return { ...withoutPhoto, profilePhotoSample: false, profilePhotoSeedAllowed: false };
    });
    setPhotoError("");
    setLiveMessage("Profile photo removed.");
  }

  function changePhotoPosition(position: string) {
    if (position !== "right" && position !== "center" && position !== "left") return;
    updateResume((current) => ({ ...current, photoPosition: position }));
  }

  function resetToSample() {
    if (!window.confirm("Replace your current resume with the fictional sample?")) return;
    setResume(preserveTypography(createSampleResume(), resume.typography));
    setLiveMessage("Fictional sample resume restored.");
  }

  function startBlank() {
    if (sampleCount > 0 && !window.confirm("Start with a blank resume and remove the sample data?")) return;
    setResume(preserveTypography(createBlankResume(), resume.typography));
    setLiveMessage("Started a blank resume.");
  }

  function clearSampleData() {
    if (!window.confirm(`Clear all ${sampleCount} remaining sample items?`)) return;
    setResume((current) => clearResumeSampleData(current));
    setLiveMessage("All remaining sample data cleared.");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resume-data.json";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  function exportLatex() {
    const latex = buildLatexResume(resume);
    const blob = new Blob([latex], { type: "application/x-tex" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resume.tex";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  async function importJson(file?: File) {
    if (!file) return;
    try {
      if (file.size > 7_200_000) throw new Error("Resume JSON files must be 7 MB or smaller.");
      const parsed: unknown = JSON.parse(await file.text());
      await discardUndecodableImportedPhoto(parsed);
      const imported = validateResumeImport(parsed);
      setResume(imported);
      setImportError("");
      setLiveMessage("Resume imported.");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import this resume JSON.");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  async function downloadResume() {
    setIsDownloading(true);
    setDownloadError("");
    try {
      const pageBreakBefore = currentPages.slice(1).flatMap((page) => {
        const firstBlock = page[0] as DocumentBlock | undefined;
        return firstBlock ? [firstBlock.sourceId ?? firstBlock.id] : [];
      });
      const bytes = await createResumePdf(resume, pageBreakBefore);
      const safeName = resume.contact.fullName.trim().replace(/[\\/:*?"<>|]/g, "").slice(0, 80);
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), `${safeName || "Resume"}${resume.europeanStandard ? "-Europass-CV" : ""}.pdf`);
      setLiveMessage("Resume PDF downloaded.");
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Could not create the resume PDF.");
      setLiveMessage("Resume PDF download failed.");
    } finally {
      setIsDownloading(false);
    }
  }

  const sortedSections = resume.sections;
  const contactItems = createResumeContactItems(resume);
  const documentBlocks = createResumeBlocks(resume, contactItems);
  const currentBlockIds = new Set(documentBlocks.map((block) => block.id));
  const currentPages = pages
    .map((page) => page.filter((block) => currentBlockIds.has((block as DocumentBlock).sourceId ?? block.id)))
    .filter((page) => page.length > 0);
  const pageCount = currentPages.length || 1;
  const pageWarning = resume.mode === "job" ? pageCount > 1 : resume.mode === "study" && pageCount > 2;
  const paperStyle = getPaperStyle(resume.typography);
  const paperDimensions: CSSProperties = {
    width: `${PAGE_WIDTH_MM}mm`,
    height: `${PAGE_HEIGHT_MM}mm`,
    padding: `${PAGE_MARGIN_MM}mm`,
  };
  const contentDimensions: CSSProperties = {
    width: `${PAGE_CONTENT_WIDTH_MM}mm`,
    height: `${PAGE_CONTENT_HEIGHT_MM}mm`,
  };
  const renderBlock = (pageBlock: PaginationBlock) => {
    const sourceId = (pageBlock as DocumentBlock).sourceId ?? pageBlock.id;
    const source = documentBlocks.find((block) => block.id === sourceId);
    if (!source) throw new Error(`Missing source resume block ${sourceId}.`);
    const lineRange = pageBlock.lineRange;
    const content = lineRange && source.text && source.lineRanges
      ? (
        <p style={{
          marginTop: lineRange[0] === 0 ? source.paragraphMargins?.[0] : 0,
          marginBottom: lineRange[1] === source.lineRanges.length ? source.paragraphMargins?.[1] : 0,
        }}>
          {source.text.slice(source.lineRanges[lineRange[0]][0], source.lineRanges[lineRange[1] - 1][1])}
        </p>
      )
      : source.content;
    return <div className="rb-page-block" data-source-id={sourceId} key={pageBlock.id}>{content}</div>;
  };

  useEffect(() => {
    let timer = 0;
    let active = true;
    const paginate = () => {
      const measuring = measureRef.current;
      if (!measuring) return;
      const measureBlocks = measuring.querySelectorAll<HTMLElement>("[data-measure-index]");
      const measured = documentBlocks.map((block, index): DocumentBlock => {
        const node = measureBlocks.item(index);
        if (!(node instanceof HTMLElement)) {
          throw new Error(`Missing measuring element for resume block ${block.id}.`);
        }
        const height = node.getBoundingClientRect().height;
        if (!block.text || !block.splittable) return { ...block, height, sourceId: block.id };
        const paragraph = node.querySelector<HTMLElement>("[data-paragraph-block]");
        const textNode = paragraph?.firstChild;
        if (!paragraph || !textNode || textNode.nodeType !== Node.TEXT_NODE) return { ...block, height, sourceId: block.id };
        const range = document.createRange();
        const lineRanges: Array<[number, number]> = [];
        let lineTop: number | undefined;
        let lineStart = 0;
        for (let offset = 0; offset < block.text.length; offset += 1) {
          range.setStart(textNode, offset);
          range.setEnd(textNode, offset + 1);
          const rect = range.getBoundingClientRect();
          if (lineTop !== undefined && Math.abs(rect.top - lineTop) > 1) {
            lineRanges.push([lineStart, offset]);
            lineStart = offset;
          }
          lineTop = rect.top;
        }
        lineRanges.push([lineStart, block.text.length]);
        const computed = getComputedStyle(paragraph);
        const lineHeight = Number.parseFloat(computed.lineHeight) ||
          Number.parseFloat(computed.fontSize) * 1.2;
        const marginTop = Number.parseFloat(computed.marginTop) || 0;
        const marginBottom = Number.parseFloat(computed.marginBottom) || 0;
        const lineHeights = lineRanges.map((_, lineIndex) =>
          lineHeight + (lineIndex === 0 ? marginTop : 0) +
          (lineIndex === lineRanges.length - 1 ? marginBottom : 0),
        );
        return {
          ...block,
          height,
          sourceId: block.id,
          lineRanges,
          paragraphMargins: [marginTop, marginBottom],
          splittable: { lineHeights, minLinesPerPage: 2 },
        };
      });
      if (!active) return;
      setPages(paginateBlocks(measured, PAGE_PAGINATION_HEIGHT_MM * 96 / 25.4));
    };
    const schedule = () => {
      if (!active) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(paginate, 100);
    };
    schedule();
    void document.fonts.ready.then(schedule);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [resume, documentBlocks.length]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const updateScale = () => {
      const availableWidth = preview.clientWidth;
      const naturalWidth = PAGE_WIDTH_MM * 96 / 25.4;
      setPageScale(Math.min(1, availableWidth / naturalWidth));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <style>{`@page { size: A4; margin: 0; }`}</style>
      <div className="rb-root" style={{
        "--rb-page-width": `${PAGE_WIDTH_MM}mm`,
        "--rb-page-height": `${PAGE_HEIGHT_MM}mm`,
        "--rb-page-margin": `${PAGE_MARGIN_MM}mm`,
        "--rb-content-width": `${PAGE_CONTENT_WIDTH_MM}mm`,
        "--rb-content-height": `${PAGE_CONTENT_HEIGHT_MM}mm`,
      } as CSSProperties}>
      <main className="rb-shell">
        <header className="rb-header">
          <div>
            <h1>Resume &amp; CV Builder</h1>
            <p>Draft a clear resume, then print or save it as a PDF.</p>
          </div>
          <div className="rb-privacy">Your resume stays in this browser. Nothing is uploaded.</div>
        </header>

        {(sampleCount > 0 || (hiddenSections.length > 0 && !addHintDismissed)) && (
          <Alert className="rb-notice" role="status">
            <AlertDescription className="rb-notice-content">
              {sampleCount > 0 && <span>Sample data: {sampleCount} sample items remain. Replace them with your own details before sharing.</span>}
              {hiddenSections.length > 0 && !addHintDismissed && (
                <span className="rb-mode-hint">
                  {resume.mode === "job" ? "Add a summary or projects section if they strengthen your application." : "Add projects or publications to highlight academic work."}
                  <Button variant="outline" size="sm" type="button" onClick={() => setAddHintDismissed(true)}>Dismiss hint</Button>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
        {storageNotice && <Alert className="rb-notice" role="status"><AlertDescription>{storageNotice}</AlertDescription></Alert>}
        {importError && <Alert variant="destructive" className="rb-notice"><AlertDescription>{importError}</AlertDescription></Alert>}
        {downloadError && <Alert variant="destructive" className="rb-notice"><AlertDescription>{downloadError}</AlertDescription></Alert>}
        <div className="rb-live" aria-live="polite" aria-atomic="true">{liveMessage}</div>

        <div className="rb-toolbar" aria-label="Resume actions">
          <Card className="rb-toolbar-group">
            <CardHeader><CardTitle>Format and page</CardTitle></CardHeader>
            <CardContent className="rb-toolbar-controls">
              <label className="rb-control-label">
                <span>Format</span>
                <Select value={resume.mode} onValueChange={(value) => changeMode(value as ResumeMode)}>
                  <SelectTrigger className="rb-format-select" aria-label="Resume format"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="study">Higher study</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="rb-check-label"><Checkbox checked={resume.europeanStandard} onCheckedChange={(checked) => changeEuropeanStandard(checked === true)} /> Europass CV</label>
              <label className="rb-check-label"><Checkbox checked={resume.compactSpacing} onCheckedChange={(checked) => setResume((current) => ({ ...current, compactSpacing: checked === true }))} /> Compact spacing</label>
            </CardContent>
          </Card>

          <Card className="rb-toolbar-group">
            <CardHeader><CardTitle>File</CardTitle></CardHeader>
            <CardContent className="rb-toolbar-controls">
              <Button type="button" onClick={() => void downloadResume()} disabled={isDownloading}>
                {isDownloading ? "Preparing PDF…" : "Download file"}
              </Button>
              <Button hidden variant="outline" type="button" onClick={exportLatex}>Export LaTeX</Button>
              <Button variant="outline" type="button" onClick={exportJson}>Export JSON</Button>
              <Button variant="outline" type="button" onClick={() => importInputRef.current?.click()}>Import JSON</Button>
            </CardContent>
          </Card>

          <Card className="rb-toolbar-group">
            <CardHeader><CardTitle>Reset</CardTitle></CardHeader>
            <CardContent className="rb-toolbar-controls">
              <Button variant="secondary" type="button" onClick={resetToSample}>Reset to sample</Button>
              <Button variant="secondary" type="button" onClick={startBlank}>Start blank</Button>
              {sampleCount > 0 && <Button variant="secondary" type="button" onClick={clearSampleData}>Clear all sample data</Button>}
            </CardContent>
          </Card>

          <input ref={importInputRef} className="rb-hidden-input" type="file" accept="application/json,.json" aria-label="Choose resume JSON file" onChange={(event) => void importJson(event.target.files?.[0])} />
          <p className="rb-estimate" role="status" aria-live="polite" aria-atomic="true">
            {pageCount} {pageCount === 1 ? "page" : "pages"}
            {pageWarning ? ` — This resume is ${pageCount} pages.` : ""}
            {" "}{resume.europeanStandard ? "Europass-style CVs usually run 2 pages." : resume.mode === "job" ? "Most job applications expect one." : "Most higher study applications expect two."}
          </p>
        </div>

        <details className="rb-typography-card">
          <summary>Text and fonts</summary>
          <div className="rb-typography-controls">
            <label className="rb-typography-font" htmlFor="rb-typography-font">
              Font
              <Select value={resume.typography.font} onValueChange={(value) => updateTypography("font", value as TypographySettings["font"])}>
                <SelectTrigger id="rb-typography-font" aria-label="Font"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPOGRAPHY_FONTS.map(({ id, label }) => <SelectItem key={id} value={id}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
              <span>Fonts come from your device. If one isn’t installed, a similar font is used, and the PDF keeps the font you see on screen.</span>
            </label>
            {([
              ["namePt", "Name size"],
              ["sectionHeadingPt", "Section heading size"],
              ["subheadingPt", "Sub-heading size"],
              ["bodyPt", "Body size"],
            ] as const).map(([key, label]) => (
              <div className="rb-typography-size" key={key}>
                <label htmlFor={`rb-${key}`}>{label} (pt)</label>
                <div className="rb-typography-size-control">
                  <Button type="button" variant="outline" aria-label={`Decrease ${label}`} disabled={displayPoints(resume.typography[key]) <= TYPOGRAPHY_RANGES[key].min} onClick={() => stepTypography(key, -1)}>−</Button>
                  <Input
                    id={`rb-${key}`}
                    type="number"
                    min={TYPOGRAPHY_RANGES[key].min}
                    max={TYPOGRAPHY_RANGES[key].max}
                    step={0.5}
                    value={displayPoints(resume.typography[key])}
                    onChange={(event) => changeTypographyInput(key, event.target.value)}
                  />
                  <Button type="button" variant="outline" aria-label={`Increase ${label}`} disabled={displayPoints(resume.typography[key]) >= TYPOGRAPHY_RANGES[key].max} onClick={() => stepTypography(key, 1)}>+</Button>
                </div>
                {key === "bodyPt" && <span>Most resumes use 10 to 12 pt body text.</span>}
              </div>
            ))}
            <label className="rb-typography-underline">
              <Checkbox checked={resume.typography.underlineLinks} onCheckedChange={(checked) => updateTypography("underlineLinks", checked === true)} />
              Underline links
            </label>
            <Button type="button" variant="secondary" onClick={() => setResume((current) => ({
              ...current,
              typography: { ...DEFAULT_TYPOGRAPHY },
            }))}>Reset text and fonts</Button>
          </div>
        </details>

        {resume.mode === "job"
          ? <p className="rb-guidance">{JOB_GUIDANCE}</p>
          : <p className="rb-guidance">{STUDY_GUIDANCE}</p>}

        <div className="rb-mobile-toggle" role="group" aria-label="Mobile editor view">
          <Button variant="outline" type="button" aria-pressed={mobileView === "edit"} onClick={() => setMobileView("edit")}>Edit</Button>
          <Button variant="outline" type="button" aria-pressed={mobileView === "preview"} onClick={() => setMobileView("preview")}>Preview</Button>
        </div>

        <div className="rb-layout" data-mobile-view={mobileView}>
          <section className="rb-edit-pane" aria-label="Resume editor">
            <Card className="rb-contact" aria-labelledby="rb-contact-title">
              <CardHeader><CardTitle id="rb-contact-title">Contact information</CardTitle></CardHeader>
              <CardContent>
              <div className="rb-contact-grid">
                <label>Full name<Input autoComplete="name" maxLength={200} value={resume.contact.fullName} onChange={(event) => updateContact("fullName", event.target.value)} /></label>
                <label>Email<Input type="email" autoComplete="email" maxLength={320} value={resume.contact.email} onChange={(event) => updateContact("email", event.target.value)} /></label>
                <label>Phone<Input type="tel" autoComplete="tel" maxLength={80} value={resume.contact.phone} onChange={(event) => updateContact("phone", event.target.value)} /></label>
                <label>Location<Input autoComplete="address-level2" maxLength={200} value={resume.contact.location} onChange={(event) => updateContact("location", event.target.value)} />
                  {resume.europeanStandard && resume.contact.address.trim() && <small className="rb-contact-hint">Not shown in the header while Address is set.</small>}
                </label>
                {resume.europeanStandard && <>
                  <label>Nationality<Input maxLength={100} value={resume.contact.nationality} onChange={(event) => updateContact("nationality", event.target.value)} /></label>
                  <label>Date of birth<Input maxLength={100} placeholder="12 March 1998" value={resume.contact.dateOfBirth} onChange={(event) => updateContact("dateOfBirth", event.target.value)} /></label>
                  <label>Address<Input maxLength={500} value={resume.contact.address} onChange={(event) => updateContact("address", event.target.value)} /></label>
                  <div className="rb-photo-control">
                    <span className="rb-photo-label">Profile photo</span>
                    {!resume.profilePhotoDataUrl && <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}>Upload photo</Button>}
                    {resume.profilePhotoDataUrl && <>
                      <img className="rb-photo-thumbnail" src={resume.profilePhotoDataUrl} alt="" />
                      <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}>Replace photo</Button>
                      <Button type="button" variant="outline" onClick={removeProfilePhoto}>Remove photo</Button>
                      <label className="rb-photo-position"><span>Photo position</span>
                        <Select value={resume.photoPosition} onValueChange={changePhotoPosition}>
                          <SelectTrigger className="rb-photo-position-trigger" aria-label="Photo position"><SelectValue /></SelectTrigger>
                          <SelectContent
                            className="rb-photo-position-menu"
                            style={{ backgroundColor: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }}
                          >
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="center">Top center</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </label>
                    </>}
                    <input
                      ref={photoInputRef}
                      className="rb-hidden-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      aria-label={resume.profilePhotoDataUrl ? "Replace profile photo" : "Upload profile photo"}
                      onChange={(event) => void changeProfilePhoto(event.target.files?.[0])}
                    />
                    <small>Stays in your browser. Many employers outside Europe prefer no photo.</small>
                    {photoError && <span className="rb-photo-error" role="alert">{photoError}</span>}
                  </div>
                </>}
              </div>
              <div className="rb-links">
                <strong>Links</strong>
                {resume.contact.links.map((link) => (
                  <div className="rb-link-item" key={link.id}>
                    <span>{link.label}: {link.url}</span>
                    <Button variant="outline" size="sm" type="button" aria-label={`Remove ${link.label} link`} onClick={() => removeLink(link.id)}>Remove</Button>
                  </div>
                ))}
                <div className="rb-link-form">
                  <label>Link label<Input id="rb-link-label" maxLength={100} placeholder="Portfolio" /></label>
                  <label>Link URL<Input id="rb-link-url" maxLength={2000} placeholder="https://example.com" /></label>
                  <Button variant="outline" type="button" onClick={addLink}>Add link</Button>
                </div>
                {linkError && <Alert variant="destructive"><AlertDescription>{linkError}</AlertDescription></Alert>}
              </div>
              </CardContent>
            </Card>

            {sortedSections.filter((item) => item.visible).length === 0 && (
              <div className="rb-empty">No sections are visible. Add a section to begin your resume.</div>
            )}
            {sortedSections.filter((item) => item.visible).map((item, sectionIndex, visibleSections) => (
              <Card
                className="rb-section"
                key={item.id}
                tabIndex={-1}
                aria-label={`${item.title} section`}
                ref={(node) => { if (node) sectionRefs.current.set(item.id, node); }}
              >
                <div className="rb-section-header">
                  <label className="sr-only" htmlFor={`section-title-${item.id}`}>Section name</label>
                  <Input id={`section-title-${item.id}`} maxLength={100} value={item.title} onChange={(event) => updateSection(item.id, { title: event.target.value })} />
                  <Button variant="outline" size="sm" type="button" aria-label={`Move ${item.title} section up`} disabled={sectionIndex === 0} onClick={() => moveSection(item.id, -1)}>Move up</Button>
                  <Button variant="outline" size="sm" type="button" aria-label={`Move ${item.title} section down`} disabled={sectionIndex === visibleSections.length - 1} onClick={() => moveSection(item.id, 1)}>Move down</Button>
                  <Button variant="outline" size="sm" type="button" aria-label={`Close ${item.title} section`} onClick={() => toggleSection(item)}>Close</Button>
                </div>
                {item.type === "languages" ? (
                  <div className="rb-language-editor">
                    <div className="rb-language-mother-editor">
                      <strong>Mother tongues</strong>
                      {(item.motherTongues ?? []).map((name, index) => (
                        <div className="rb-language-mother-item" key={`mother-${index}`}>
                          <Input aria-label={`Mother tongue ${index + 1}`} maxLength={100} value={name} onChange={(event) => updateMotherTongue(item.id, index, event.target.value)} />
                          <Button variant="outline" size="sm" type="button" aria-label={`Remove mother tongue ${index + 1}`} onClick={() => removeMotherTongue(item.id, index)}>Remove</Button>
                        </div>
                      ))}
                      {(item.motherTongues ?? []).length < 10 && <Button variant="outline" type="button" onClick={() => addMotherTongue(item.id)}>Add mother tongue</Button>}
                    </div>
                    {(item.others ?? []).map((language, languageIndex) => (
                      <div className="rb-language-form" key={language.id}>
                        <label>Language<Input maxLength={100} value={language.name} onChange={(event) => updateLanguage(item.id, language.id, { name: event.target.value })} /></label>
                        <label className="rb-language-same-level">Same level for all five
                          <Select value={equalLanguageLevel(language) ?? "choose-level"} onValueChange={(value) => {
                            if (value === "choose-level") return;
                            const level = value as ResumeLanguage[typeof LANGUAGE_LEVEL_FIELDS[number]];
                            updateLanguage(item.id, language.id, Object.fromEntries(LANGUAGE_LEVEL_FIELDS.map((field) => [field, level])));
                          }}>
                            <SelectTrigger aria-label={`Same level for all five, language ${languageIndex + 1}`}><SelectValue placeholder="Choose level" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="choose-level">Choose level</SelectItem>
                              {LANGUAGE_LEVELS.filter(Boolean).map((level) => <SelectItem value={level} key={level}>{level}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </label>
                        <div className="rb-language-levels">
                          {LANGUAGE_LEVEL_FIELDS.map((field) => {
                            const label = field === "interactionSpoken" ? "Spoken interaction"
                              : field === "productionSpoken" ? "Spoken production"
                                : field[0].toUpperCase() + field.slice(1);
                            return <label key={field}>{label}
                              <Select value={language[field] || "not-set"} onValueChange={(value) => updateLanguage(item.id, language.id, { [field]: value === "not-set" ? "" : value as ResumeLanguage[typeof field] })}>
                                <SelectTrigger aria-label={`${label}, language ${languageIndex + 1}`}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-set">Not set</SelectItem>
                                  {LANGUAGE_LEVELS.filter(Boolean).map((level) => <SelectItem value={level} key={level}>{level}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </label>;
                          })}
                        </div>
                        <label>Certificate (optional)<Input maxLength={200} value={language.certificate} onChange={(event) => updateLanguage(item.id, language.id, { certificate: event.target.value })} /></label>
                        <div className="rb-entry-actions">
                          <Button variant="outline" size="sm" type="button" aria-label={`Remove language ${languageIndex + 1}`} onClick={() => removeLanguage(item.id, language.id)}>Remove language</Button>
                        </div>
                      </div>
                    ))}
                    {(item.others ?? []).length < 50 && <Button variant="outline" type="button" onClick={() => addLanguage(item.id)}>Add language</Button>}
                  </div>
                ) : item.type === "drivingLicence" ? (
                  <label className="rb-summary-field">Driving licence
                    <Input maxLength={100} value={item.drivingLicence ?? ""} onChange={(event) => updateResume((current) => ({
                      ...current,
                      sections: current.sections.map((section) => section.id === item.id
                        ? { ...section, europeanSampleSeeded: true, drivingLicence: event.target.value, drivingLicenceSample: false }
                        : section),
                    }))} />
                  </label>
                ) : item.type === "publications" ? (
                  <>
                    <p className="rb-guidance">{PUBLICATION_GUIDANCE}</p>
                    <details
                      className="rb-publication-help"
                      open={publicationHelpOpen}
                      onToggle={(event) => setPublicationHelpOpen(event.currentTarget.open)}
                    >
                      <summary>How to list publications</summary>
                      <ul>
                        {PUBLICATION_HELP.map((line) => <li key={line}>{line}</li>)}
                      </ul>
                    </details>
                    <div className="rb-publication-options" role="group" aria-label="Publication display options">
                      <label><Checkbox checked={item.publicationOptions.numberedStyle} onCheckedChange={(checked) => updateSection(item.id, { publicationOptions: { ...item.publicationOptions, numberedStyle: checked === true } })} /> Numbered style</label>
                      <label><Checkbox checked={item.publicationOptions.groupByType} onCheckedChange={(checked) => updateSection(item.id, { publicationOptions: { ...item.publicationOptions, groupByType: checked === true } })} /> Group by type</label>
                      <label><Checkbox checked={item.publicationOptions.shortenAuthors} onCheckedChange={(checked) => updateSection(item.id, { publicationOptions: { ...item.publicationOptions, shortenAuthors: checked === true } })} /> Shorten long author lists</label>
                    </div>
                    {item.publications.map((publication, publicationIndex) => (
                      <div className="rb-publication-form" key={publication.id}>
                        <label>Title<Input maxLength={500} value={publication.title} onChange={(event) => updatePublication(item.id, publication.id, { title: event.target.value })} /></label>
                        <label>Authors (one author per line)<Textarea maxLength={30_000} value={publication.authors.join("\n")} onChange={(event) => {
                          const authors = event.target.value.split(/\r?\n/).filter((author) => author.trim().length > 0);
                          updatePublication(item.id, publication.id, {
                            authors,
                            selectedAuthorIndex: findMatchingAuthor(authors, resume.contact.fullName),
                          });
                        }} /></label>
                        <label>Which author are you?
                          <Select
                            value={publication.selectedAuthorIndex === null ? "none" : String(publication.selectedAuthorIndex)}
                            onValueChange={(value) => updatePublication(item.id, publication.id, {
                              selectedAuthorIndex: value === "none" ? null : Number(value),
                            })}
                          >
                            <SelectTrigger aria-label="Which author are you?"><SelectValue placeholder="Select an author" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Select an author</SelectItem>
                              {publication.authors.map((author, authorIndex) => (
                                <SelectItem value={String(authorIndex)} key={`${authorIndex}-${author}`}>{author}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </label>
                        <label>Type
                          <Select value={publication.type} onValueChange={(value) => updatePublication(item.id, publication.id, { type: value as PublicationType })}>
                            <SelectTrigger aria-label="Publication type"><SelectValue /></SelectTrigger>
                            <SelectContent>{PUBLICATION_TYPES.map((type) => <SelectItem value={type} key={type}>{type}</SelectItem>)}</SelectContent>
                          </Select>
                        </label>
                        <label>Status
                          <Select value={publication.status} onValueChange={(value) => updatePublication(item.id, publication.id, { status: value as PublicationStatus })}>
                            <SelectTrigger aria-label="Publication status"><SelectValue /></SelectTrigger>
                            <SelectContent>{PUBLICATION_STATUSES.map((status) => <SelectItem value={status} key={status}>{status}</SelectItem>)}</SelectContent>
                          </Select>
                        </label>
                        <label>Venue<Input maxLength={500} value={publication.venue} onChange={(event) => updatePublication(item.id, publication.id, { venue: event.target.value })} /></label>
                        <label>Year<Input maxLength={100} value={publication.year} onChange={(event) => updatePublication(item.id, publication.id, { year: event.target.value })} /></label>
                        <label>Link or DOI<Input value={publication.link} onChange={(event) => updatePublication(item.id, publication.id, { link: event.target.value })} /></label>
                        {publication.link && normalizePublicationLink(publication.link) === null && (
                          <p className="rb-publication-error" role="alert">Enter a valid http or https link or DOI (up to 2048 characters).</p>
                        )}
                        <label>Your role (optional)<Input maxLength={10_000} value={publication.role} onChange={(event) => updatePublication(item.id, publication.id, { role: event.target.value })} /></label>
                        <div className="rb-entry-actions">
                          <Button variant="outline" size="sm" type="button" aria-label={`Move publication ${publicationIndex + 1} up`} disabled={publicationIndex === 0} onClick={() => movePublication(item.id, publication.id, -1)}>Move up</Button>
                          <Button variant="outline" size="sm" type="button" aria-label={`Move publication ${publicationIndex + 1} down`} disabled={publicationIndex === item.publications.length - 1} onClick={() => movePublication(item.id, publication.id, 1)}>Move down</Button>
                          <Button variant="outline" size="sm" type="button" aria-label={`Remove publication ${publicationIndex + 1}`} onClick={() => removePublication(item.id, publication.id)}>Remove entry</Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" type="button" onClick={() => addPublication(item.id)}>Add entry</Button>
                  </>
                ) : item.type === "summary" ? (
                  <label className="rb-summary-field">
                    {resume.mode === "study" ? "Research interests" : "Summary"}
                    <Textarea
                      maxLength={10_000}
                      placeholder={resume.mode === "study"
                        ? "The fields you want to research and the background that prepared you."
                        : "Two or three lines: who you are and what you want next."}
                      value={item.summary}
                      onChange={(event) => updateSummary(item.id, event.target.value)}
                    />
                  </label>
                ) : (
                  <>
                    <p className="rb-guidance">{item.type === "skills" || item.type === "digitalSkills" ? "Use subsections to group your abilities." : "Add concise details; lines starting with - or • appear as bullets."}</p>
                    {item.entries.map((entry, entryIndex) => (
                  <div className="rb-entry-form" key={entry.id}>
                    <label>{item.type === "skills" || item.type === "digitalSkills" ? "Skill subsection" : "Title"}<Input maxLength={300} value={entry.title} onChange={(event) => updateEntry(item.id, entry.id, "title", event.target.value)} /></label>
                    {(item.type === "awards" || item.type === "certifications" || item.type === "conferences") && (
                      <>
                        <label>Link (optional)<Input value={entry.link} onChange={(event) => updateEntry(item.id, entry.id, "link", event.target.value)} /></label>
                        <p className="rb-publication-link-help">
                          {PUBLICATION_LINK_HELP}
                          {entry.link && normalizeResumeItemLink(entry.link) && isShareableDriveLink(normalizeResumeItemLink(entry.link) ?? "")
                            ? <><br />{SHARE_LINK_HINT}</>
                            : null}
                        </p>
                        {entry.link && normalizeResumeItemLink(entry.link) === null && (
                          <p className="rb-publication-error" role="alert">Enter a valid http or https link up to 2048 characters.</p>
                        )}
                      </>
                    )}
                    {item.type !== "skills" && item.type !== "digitalSkills" && <label>Organization{item.type === "conferences" ? "/event" : ""}<Input maxLength={300} value={entry.organization} onChange={(event) => updateEntry(item.id, entry.id, "organization", event.target.value)} /></label>}
                    {item.type !== "skills" && item.type !== "digitalSkills" && item.type !== "grants" && item.type !== "memberships" && <label>Location<Input maxLength={200} value={entry.location} onChange={(event) => updateEntry(item.id, entry.id, "location", event.target.value)} /></label>}
                    {item.type !== "skills" && item.type !== "digitalSkills" && <label>Dates<Input maxLength={100} value={entry.dates} onChange={(event) => updateEntry(item.id, entry.id, "dates", event.target.value)} /></label>}
                    <label>Description<Textarea maxLength={10_000} value={entry.description} onChange={(event) => updateEntry(item.id, entry.id, "description", event.target.value)} /></label>
                    <div className="rb-entry-actions">
                      <Button variant="outline" size="sm" type="button" aria-label={`Move entry ${entryIndex + 1} up`} disabled={entryIndex === 0} onClick={() => moveEntry(item.id, entry.id, -1)}>Move up</Button>
                      <Button variant="outline" size="sm" type="button" aria-label={`Move entry ${entryIndex + 1} down`} disabled={entryIndex === item.entries.length - 1} onClick={() => moveEntry(item.id, entry.id, 1)}>Move down</Button>
                      <Button variant="outline" size="sm" type="button" aria-label={`Remove entry ${entryIndex + 1}`} onClick={() => removeEntry(item.id, entry.id)}>Remove entry</Button>
                    </div>
                  </div>
                ))}
                    <Button variant="outline" type="button" onClick={() => addEntry(item.id)}>Add entry</Button>
                  </>
                )}
              </Card>
            ))}

            <details className="rb-add-menu" ref={addSectionRef}>
              <summary className="rb-action">Add section</summary>
              <div className="rb-menu-items" role="group" aria-label="Hidden sections">
                {hiddenSections.map((item) => (
                  <Button variant="outline" type="button" key={item.id} onClick={() => addSection(item.type)}>{LABELS[item.type]}</Button>
                ))}
                {hiddenSections.length === 0 && <span>All sections are visible.</span>}
              </div>
            </details>
            {undoState && (
              <Alert className="rb-notice" role="status"><AlertDescription>Section hidden. <Button variant="outline" size="sm" type="button" onClick={undoHide}>Undo</Button></AlertDescription></Alert>
            )}
          </section>

          <section className="rb-preview-pane" aria-label="Resume preview" ref={previewRef}>
            <div className="rb-preview-label">
              <strong>Preview</strong>
              <span>{resume.compactSpacing ? "Compact" : "Regular"} spacing</span>
              <span className="rb-page-count" aria-live="polite" aria-atomic="true">{pageCount} {pageCount === 1 ? "page" : "pages"}</span>
            </div>
            <div className="rb-pages" style={{ "--rb-page-scale": pageScale } as CSSProperties}>
              {currentPages.map((page, pageIndex) => (
                <div
                  className="rb-page-wrap"
                  key={`page-${pageIndex + 1}`}
                  style={{
                    width: `${PAGE_WIDTH_MM * pageScale}mm`,
                    height: `${PAGE_HEIGHT_MM * pageScale}mm`,
                  }}
                >
                  <span className="rb-page-label">Page {pageIndex + 1} of {pageCount}</span>
                  <article
                    className={`rb-paper${resume.compactSpacing ? " compact" : ""}`}
                    aria-label={`Printable resume page ${pageIndex + 1}`}
                    style={{ ...paperStyle, ...paperDimensions }}
                  >
                    <div className="rb-page-content" style={contentDimensions}>{page.map(renderBlock)}</div>
                  </article>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div
          className={`rb-paper rb-measure-paper${resume.compactSpacing ? " compact" : ""}`}
          aria-hidden="true"
          inert
          style={{ ...paperStyle, ...paperDimensions }}
          ref={measureRef}
        >
          <div className="rb-page-content" style={contentDimensions}>
            {documentBlocks.map((block, index) => (
              <div className="rb-page-block" data-measure-index={index} key={block.id}>{block.content}</div>
            ))}
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

export function Description({ text }: { text: string }) {
  const blocks = parseDescription(text);
  return (
    <>
      {blocks.map((block, index) => block.kind === "paragraph"
        ? <p key={`p-${index}`}>{block.text}</p>
        : <ul className="rb-bullets" key={`b-${index}`}><li>{block.text}</li></ul>)}
    </>
  );
}

export function PublicationCitation({
  publication,
  number,
  numbered,
  shortenAuthors,
}: {
  publication: ResumePublication;
  number: number;
  numbered: boolean;
  shortenAuthors: boolean;
}) {
  const indices = publicationAuthorIndices(publication, shortenAuthors);
  const shorten = shortenAuthors && publication.authors.length > 6;
  const selectedOutsideFirstThree = shorten &&
    publication.selectedAuthorIndex !== null && publication.selectedAuthorIndex > 2;
  const statusSuffix: Partial<Record<PublicationStatus, string>> = {
    Accepted: " (accepted)",
    "Under review": " (under review)",
    "In preparation": " (in preparation)",
  };
  return (
    <div className="rb-preview-entry rb-publication-citation">
      <p>
        {numbered && <span>[{number}] </span>}
        {indices.map((authorIndex, index) => (
          <span key={authorIndex}>
            {index > 0 && ", "}
            {publication.selectedAuthorIndex === authorIndex
              ? <strong className="rb-publication-author">{publication.authors[authorIndex]}</strong>
              : publication.authors[authorIndex]}
          </span>
        ))}
        {shorten && (
          <>
              {indices.length > 0 && ", "}
              <span>…</span>
            {selectedOutsideFirstThree && publication.selectedAuthorIndex !== null && (
              <>
                , <strong className="rb-publication-author">{publication.authors[publication.selectedAuthorIndex]}</strong>
              </>
            )}
            , et al.
          </>
        )}
        {!shorten && indices.length > 0 && ". "}
        {shorten && indices.length > 0 && " "}
        {publication.title.trim() && (
          <>
            {normalizePublicationLink(publication.link)
              ? <a href={normalizePublicationLink(publication.link) ?? undefined} target="_blank" rel="noopener noreferrer">{publication.title}</a>
              : publication.title}.{" "}
          </>
        )}
        {publication.venue && <><em>{publication.venue}</em>{publication.year ? ", " : "."}</>}
        {publication.year && <>{publication.year}{statusSuffix[publication.status] ?? ""}.</>}
      </p>
      {publication.role.trim() && <p className="rb-publication-role"><em>{publication.role}</em></p>}
    </div>
  );
}

function renderLinkedEntryTitle(entry: ResumeEntry, supportsLinks: boolean): ReactNode {
  const href = supportsLinks ? normalizeResumeItemLink(entry.link) : "";
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{entry.title}</a>;
  return entry.title;
}
