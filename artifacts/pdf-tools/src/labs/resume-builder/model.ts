export const SECTION_TYPES = [
  "summary",
  "education",
  "experience",
  "projects",
  "publications",
  "skills",
  "certifications",
  "awards",
  "community",
  "custom",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];
export type ResumeMode = "Job" | "Higher study";
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const PAGE_MARGIN_MM = 20;
export const PAGE_CONTENT_WIDTH_MM = PAGE_WIDTH_MM - PAGE_MARGIN_MM * 2;
export const PAGE_CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - PAGE_MARGIN_MM * 2;
export const PAGE_PAGINATION_BUFFER_MM = 2;
export const PAGE_PAGINATION_HEIGHT_MM = PAGE_CONTENT_HEIGHT_MM - PAGE_PAGINATION_BUFFER_MM;
export const PUBLICATION_TYPES = [
  "Journal article",
  "Conference paper",
  "Preprint",
  "Book chapter",
  "Thesis",
  "Other",
] as const;
export const PUBLICATION_STATUSES = ["Published", "Accepted", "Under review", "In preparation"] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export const TYPOGRAPHY_FONTS = [
  { id: "default", label: "Default (current)", stack: "Georgia, serif" },
  { id: "times-new-roman", label: "Times New Roman", stack: '"Times New Roman", Times, serif' },
  { id: "georgia", label: "Georgia", stack: 'Georgia, "Times New Roman", serif' },
  { id: "cambria", label: "Cambria", stack: "Cambria, Georgia, serif" },
  { id: "arial", label: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "calibri", label: "Calibri", stack: 'Calibri, Carlito, "Segoe UI", Arial, sans-serif' },
] as const;
export type TypographyFontId = (typeof TYPOGRAPHY_FONTS)[number]["id"];

export type TypographySettings = {
  font: TypographyFontId;
  namePt: number;
  sectionHeadingPt: number;
  subheadingPt: number;
  bodyPt: number;
  underlineLinks: boolean;
};

const CSS_PX_PER_PT = 1.333;
export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  font: "default",
  namePt: 24.8 / CSS_PX_PER_PT,
  sectionHeadingPt: 16 / CSS_PX_PER_PT,
  subheadingPt: 15.2 / CSS_PX_PER_PT,
  bodyPt: 16 / CSS_PX_PER_PT,
  underlineLinks: true,
};

export const TYPOGRAPHY_RANGES = {
  namePt: { min: 16, max: 40 },
  sectionHeadingPt: { min: 10, max: 20 },
  subheadingPt: { min: 9, max: 16 },
  bodyPt: { min: 8, max: 14 },
} as const;

export type ResumePublication = {
  id: string;
  title: string;
  authors: string[];
  selectedAuthorIndex: number | null;
  type: PublicationType;
  status: PublicationStatus;
  venue: string;
  year: string;
  link: string;
  role: string;
  sample: boolean;
};

export type PublicationOptions = {
  numberedStyle: boolean;
  groupByType: boolean;
  shortenAuthors: boolean;
};

export type ResumeLink = {
  id: string;
  label: string;
  url: string;
  sample: boolean;
};

export type ResumeContact = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  links: ResumeLink[];
  sampleFields: string[];
};

export type ResumeEntry = {
  id: string;
  title: string;
  organization: string;
  location: string;
  dates: string;
  description: string;
  link: string;
  sample: boolean;
};

export type ResumeSection = {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  entries: ResumeEntry[];
  summary: string;
  summarySample: boolean;
  publications: ResumePublication[];
  publicationOptions: PublicationOptions;
};

export type ResumeDocument = {
  version: 2;
  mode: ResumeMode;
  compactSpacing: boolean;
  student: boolean;
  contact: ResumeContact;
  sections: ResumeSection[];
  typography: TypographySettings;
};

export const JOB_ORDER: SectionType[] = [
  "summary", "experience", "skills", "education", "projects", "certifications", "awards", "publications", "community", "custom",
];
export const HIGHER_STUDY_ORDER: SectionType[] = [
  "summary", "education", "projects", "experience", "skills", "publications", "awards", "certifications", "community", "custom",
];
export const INITIAL_VISIBLE_ORDER: SectionType[] = [
  "summary", "experience", "skills", "education", "certifications", "awards", "publications", "community",
];

const sectionTitles: Record<SectionType, string> = {
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  publications: "Publications",
  skills: "Skills",
  certifications: "Certifications",
  awards: "Awards",
  community: "Community involvement",
  custom: "Custom section",
};

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `resume-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function section(type: SectionType, visible: boolean, entries: ResumeEntry[] = []): ResumeSection {
  return {
    id: newId(),
    type,
    title: sectionTitles[type],
    visible,
    entries,
    summary: "",
    summarySample: false,
    publications: [],
    publicationOptions: { numberedStyle: false, groupByType: false, shortenAuthors: false },
  };
}

function entry(
  title: string,
  organization: string,
  location: string,
  dates: string,
  description: string,
  sample = true,
  link = "",
): ResumeEntry {
  return { id: newId(), title, organization, location, dates, description, link, sample };
}

export function normalizePublicationLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 2_048) return null;
  const doi = trimmed.match(/^(?:doi:\s*)?(10\.\d{4,9}\/\S+)$/i)?.[1];
  if (doi) return `https://doi.org/${doi}`;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

export function normalizeResumeItemLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 2_048) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

export function isShareableDriveLink(value: string): boolean {
  try {
    return ["drive.google.com", "docs.google.com", "dropbox.com", "onedrive.live.com", "1drv.ms"]
      .includes(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function createSampleResume(): ResumeDocument {
  const visible = new Set<SectionType>(INITIAL_VISIBLE_ORDER);
  const summary = section("summary", visible.has("summary"));
  summary.summary = "Early-career operations coordinator who improves team workflows and keeps projects moving.";
  summary.summarySample = true;
  const publications = section("publications", visible.has("publications"));
  publications.publications = [{
    id: newId(),
    title: "Example Title of a Research Paper",
    authors: ["J. Coauthor*", "C. Example*", "R. Researcher"],
    selectedAuthorIndex: 1,
    type: "Conference paper",
    status: "Published",
    venue: "Proceedings of the Example Conference",
    year: "2025",
    link: "https://example.com/doi",
    role: "Implemented the experiments and wrote the methods section.",
    sample: true,
  }];
  const resume: ResumeDocument = {
    version: 2,
    mode: "Job",
    compactSpacing: false,
    student: false,
    contact: {
      fullName: "Casey Example",
      email: "casey.example@example.com",
      phone: "+1 555-010-2040",
      location: "Portland, OR",
      links: [
        { id: newId(), label: "LinkedIn", url: "https://linkedin.example/casey-example", sample: true },
        { id: newId(), label: "GitHub", url: "https://github.example/casey-example", sample: true },
      ],
      sampleFields: ["fullName", "email", "phone", "location"],
    },
    typography: { ...DEFAULT_TYPOGRAPHY },
    sections: [
      summary,
      section("education", visible.has("education"), [entry("B.A. Communication", "North Coast College", "Portland, OR", "2020–2024", "Graduated with honors. Relevant Coursework: Organizational Communication, Research Methods, Data Analysis.", true)]),
      section("experience", visible.has("experience"), [entry("Operations Assistant", "Cedar Grove Cooperative", "Portland, OR", "2024–Present", "- Coordinated schedules and documentation for a 12-person team.\n- Reduced recurring handoff delays by creating a shared checklist.", true)]),
      section("projects", visible.has("projects"), [entry("Volunteer Scheduling Guide", "Community project", "Portland, OR", "2023", "Created a reusable onboarding guide for volunteer coordinators.", true)]),
      publications,
      section("skills", visible.has("skills"), [
        entry("Hard Skills", "", "", "", "Google Workspace, Excel, Notion, data analysis", true),
        entry("Soft Skills", "", "", "", "Communication, organization, collaboration, problem solving", true),
      ]),
      section("certifications", visible.has("certifications"), [entry("Project Management Foundations", "Example Learning Institute", "", "2024", "", true, "https://drive.google.com/drive/folders/1st88kUbePzHfxMK-8-Jwzd1fFysvf-IG")]),
      section("awards", visible.has("awards"), [entry("Community Service Recognition", "North Coast College", "", "2023", "", true, "https://drive.google.com/drive/folders/1x1pobVV1iK7PNMCBSDxRW_z8e7WhtsPz")]),
      section("community", visible.has("community"), [entry("Volunteer Coordinator", "Neighborhood Seed Library", "Portland, OR", "2022–2024", "Organized monthly shifts and maintained a simple inventory guide.", true)]),
      section("custom", visible.has("custom")),
    ],
  };
  resume.sections = applyModeOrder(resume.sections, resume.mode, resume.student);
  return resume;
}

export function createBlankResume(): ResumeDocument {
  const resume = createSampleResume();
  return {
    ...resume,
    contact: { fullName: "", email: "", phone: "", location: "", links: [], sampleFields: [] },
    sections: resume.sections.map((item) => ({
      ...item,
      entries: [],
      summary: "",
      summarySample: false,
      publications: [],
    })),
  };
}

export function clearSampleData(resume: ResumeDocument): ResumeDocument {
  return {
    ...resume,
    contact: {
      ...resume.contact,
      fullName: resume.contact.sampleFields.includes("fullName") ? "" : resume.contact.fullName,
      email: resume.contact.sampleFields.includes("email") ? "" : resume.contact.email,
      phone: resume.contact.sampleFields.includes("phone") ? "" : resume.contact.phone,
      location: resume.contact.sampleFields.includes("location") ? "" : resume.contact.location,
      sampleFields: [],
      links: resume.contact.links.filter((link) => !link.sample),
    },
    sections: resume.sections.map((item) => ({
      ...item,
      entries: item.entries.filter((entryValue) => !entryValue.sample),
      summary: item.summarySample ? "" : item.summary,
      summarySample: false,
      publications: item.publications.filter((publication) => !publication.sample),
    })),
  };
}

export function preserveTypography(resume: ResumeDocument, typography: TypographySettings): ResumeDocument {
  return { ...resume, typography: { ...typography } };
}

function normalizePersonName(value: string): string[] {
  return value
    .replace(/[＊*†]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function matchesAuthorName(author: string, fullName: string): boolean {
  const authorParts = normalizePersonName(author);
  const nameParts = normalizePersonName(fullName);
  if (!authorParts.length || !nameParts.length) return false;
  if (authorParts.join(" ") === nameParts.join(" ")) return true;
  return authorParts.length === 2 &&
    authorParts[0].length === 1 &&
    authorParts[0] === nameParts[0][0] &&
    authorParts[1] === nameParts[nameParts.length - 1];
}

export function findMatchingAuthor(authors: string[], fullName: string): number | null {
  const matches = authors.reduce<number[]>((indices, author, index) => {
    if (matchesAuthorName(author, fullName)) indices.push(index);
    return indices;
  }, []);
  return matches.length === 1 ? matches[0] : null;
}

export function createBlankPublication(): ResumePublication {
  return {
    id: newId(),
    title: "",
    authors: [],
    selectedAuthorIndex: null,
    type: "Journal article",
    status: "Published",
    venue: "",
    year: "",
    link: "",
    role: "",
    sample: false,
  };
}

export function publicationAuthorIndices(publication: ResumePublication, shorten: boolean): number[] {
  if (!shorten || publication.authors.length <= 6) {
    return publication.authors.map((_, index) => index);
  }
  return [0, 1, 2];
}

export function publicationGroups(publications: ResumePublication[]): Array<{ type: PublicationType; label: string; entries: ResumePublication[] }> {
  const labels: Record<PublicationType, string> = {
    "Journal article": "Journal articles",
    "Conference paper": "Conference papers",
    Preprint: "Preprints",
    "Book chapter": "Book chapters",
    Thesis: "Theses",
    Other: "Other",
  };
  return PUBLICATION_TYPES
    .map((type) => ({ type, label: labels[type], entries: publications.filter((publication) => publication.type === type) }))
    .filter((group) => group.entries.length > 0);
}

export function applyModeOrder(sections: ResumeSection[], mode: ResumeMode, student: boolean): ResumeSection[] {
  const order = mode === "Job" ? JOB_ORDER : HIGHER_STUDY_ORDER;
  const preferred = student && mode === "Job"
    ? ["education", "projects", "experience", "skills", "certifications", "awards", "publications", "community", "summary", "custom"] as SectionType[]
    : order;
  const rank = new Map(preferred.map((type, index) => [type, index]));
  return sections
    .map((item, index) => ({ item, index }))
    .sort((left, right) =>
      (rank.get(left.item.type) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(right.item.type) ?? Number.MAX_SAFE_INTEGER) ||
      left.index - right.index,
    )
    .map(({ item }) => item);
}

export function parseDescription(text: string): Array<{ kind: "paragraph" | "bullet"; text: string }> {
  const blocks: Array<{ kind: "paragraph" | "bullet"; text: string }> = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const bullet = trimmed.match(/^(?:- |• )(.*)$/);
    blocks.push({ kind: bullet ? "bullet" : "paragraph", text: bullet ? bullet[1] : trimmed });
  }
  return blocks;
}

export function validateResumeLink(value: string): boolean {
  try {
    const parsed = new URL(value);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

const MAX_SECTIONS = 20;
const MAX_ENTRIES_PER_SECTION = 100;
const MAX_LINKS = 10;
const MAX_TEXT = 10_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textField(value: unknown, path: string, max = MAX_TEXT): string {
  if (typeof value !== "string" || value.length > max) {
    throw new Error(`${path} must be text with at most ${max} characters.`);
  }
  return value;
}

function boolField(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") throw new Error(`${path} must be true or false.`);
  return value;
}

export function validateResumeImport(input: unknown): ResumeDocument {
  if (!isRecord(input)) throw new Error("The JSON file must contain a resume object.");
  if (input.version !== 1 && input.version !== 2) throw new Error("This resume file version is not supported.");
  if (input.mode !== "Job" && input.mode !== "Higher study") throw new Error("Resume mode is invalid.");
  if (!Array.isArray(input.sections) || input.sections.length > MAX_SECTIONS) {
    throw new Error(`Resume must contain at most ${MAX_SECTIONS} sections.`);
  }
  if (!isRecord(input.contact)) throw new Error("Contact information is missing or invalid.");
  if (!Array.isArray(input.contact.links) || input.contact.links.length > MAX_LINKS) {
    throw new Error(`Contact may contain at most ${MAX_LINKS} links.`);
  }
  if (!Array.isArray(input.contact.sampleFields) || input.contact.sampleFields.length > 4 ||
    !input.contact.sampleFields.every((field) => ["fullName", "email", "phone", "location"].includes(String(field)))) {
    throw new Error("Contact sample markers are invalid.");
  }
  if (new Set(input.contact.sampleFields).size !== input.contact.sampleFields.length) {
    throw new Error("Contact sample markers must be unique.");
  }
  const contact = {
    fullName: textField(input.contact.fullName, "contact.fullName", 200),
    email: textField(input.contact.email, "contact.email", 320),
    phone: textField(input.contact.phone, "contact.phone", 80),
    location: textField(input.contact.location, "contact.location", 200),
    sampleFields: input.contact.sampleFields as string[],
    links: input.contact.links.map((value, index) => {
      const path = `contact.links[${index}]`;
      if (!isRecord(value)) throw new Error(`${path} is invalid.`);
      const url = textField(value.url, `${path}.url`, 2_000);
      if (!validateResumeLink(url)) throw new Error(`${path}.url must use http, https, or mailto.`);
      return {
        id: textField(value.id, `${path}.id`, 100),
        label: textField(value.label, `${path}.label`, 100),
        url,
        sample: boolField(value.sample, `${path}.sample`),
      };
    }),
  };
  const sections = input.sections.map((value, index): ResumeSection => {
    const path = `sections[${index}]`;
    if (!isRecord(value)) throw new Error(`${path} is invalid.`);
    if (!SECTION_TYPES.includes(value.type as SectionType)) throw new Error(`${path}.type is invalid.`);
    if (!Array.isArray(value.entries) || value.entries.length > MAX_ENTRIES_PER_SECTION) {
      throw new Error(`${path} may contain at most ${MAX_ENTRIES_PER_SECTION} entries.`);
    }
    const entries = value.entries.map((entryValue, entryIndex): ResumeEntry => {
      const entryPath = `${path}.entries[${entryIndex}]`;
      if (!isRecord(entryValue)) throw new Error(`${entryPath} is invalid.`);
      const link = textField(entryValue.link ?? "", `${entryPath}.link`, 2_048);
      const normalizedLink = normalizeResumeItemLink(link);
      if (normalizedLink === null) throw new Error(`${entryPath}.link must use http or https and be at most 2048 characters.`);
      return {
        id: textField(entryValue.id, `${entryPath}.id`, 100),
        title: textField(entryValue.title, `${entryPath}.title`, 300),
        organization: textField(entryValue.organization, `${entryPath}.organization`, 300),
        location: textField(entryValue.location, `${entryPath}.location`, 200),
        dates: textField(entryValue.dates, `${entryPath}.dates`, 100),
        description: textField(entryValue.description, `${entryPath}.description`),
        link: normalizedLink,
        sample: boolField(entryValue.sample, `${entryPath}.sample`),
      };
    });
    const summaryEntries = value.type === "summary" ? entries : [];
    const summary = value.type === "summary"
      ? value.summary === undefined
        ? summaryEntries
          .map((entryValue) => {
            const text = entryValue.description;
            const description = entryValue.sample ? text.replace(/^i\.\s+/i, "") : text;
            return [
              entryValue.title,
              entryValue.organization,
              entryValue.location,
              entryValue.dates,
              description,
            ].filter((field) => field.trim().length > 0).join("\n");
          })
          .filter((text) => text.trim().length > 0)
          .join("\n")
        : textField(value.summary, `${path}.summary`)
      : value.summary === undefined ? "" : textField(value.summary, `${path}.summary`);
    const summarySample = value.type === "summary"
      ? value.summarySample === undefined
        ? summaryEntries.some((entryValue) => entryValue.sample && isNonEmptyEntry(entryValue))
        : boolField(value.summarySample, `${path}.summarySample`)
      : value.summarySample === undefined ? false : boolField(value.summarySample, `${path}.summarySample`);
    const oldPublicationEntries = value.type === "publications" ? entries : [];
    let publications: ResumePublication[];
    if (value.type === "publications" && value.publications === undefined) {
      publications = oldPublicationEntries.map((entryValue) => ({
        id: entryValue.id,
        title: entryValue.title,
        authors: [],
        selectedAuthorIndex: null,
        type: "Journal article",
        status: "Published",
        venue: entryValue.organization,
        year: entryValue.dates,
        link: "",
        role: [
          entryValue.description,
          entryValue.location ? `Location: ${entryValue.location}` : "",
        ].filter((text) => text.trim().length > 0).join("\n"),
        sample: entryValue.sample,
      }));
    } else if (value.type === "publications") {
      if (!Array.isArray(value.publications) || value.publications.length > MAX_ENTRIES_PER_SECTION) {
        throw new Error(`${path}.publications may contain at most ${MAX_ENTRIES_PER_SECTION} entries.`);
      }
      publications = value.publications.map((publicationValue, publicationIndex): ResumePublication => {
        const publicationPath = `${path}.publications[${publicationIndex}]`;
        if (!isRecord(publicationValue)) throw new Error(`${publicationPath} is invalid.`);
        if (!Array.isArray(publicationValue.authors) || publicationValue.authors.length > 100) {
          throw new Error(`${publicationPath}.authors must contain at most 100 author lines.`);
        }
        const authors = publicationValue.authors.map((author, authorIndex) =>
          textField(author, `${publicationPath}.authors[${authorIndex}]`, 300),
        );
        let selectedAuthorIndex: number | null;
        if (publicationValue.selectedAuthorIndex === undefined) {
          selectedAuthorIndex = findMatchingAuthor(authors, contact.fullName);
        } else if (publicationValue.selectedAuthorIndex === null) {
          selectedAuthorIndex = null;
        } else if (Number.isInteger(publicationValue.selectedAuthorIndex) &&
          (publicationValue.selectedAuthorIndex as number) >= 0 &&
          (publicationValue.selectedAuthorIndex as number) < authors.length) {
          selectedAuthorIndex = publicationValue.selectedAuthorIndex as number;
        } else {
          throw new Error(`${publicationPath}.selectedAuthorIndex must identify an author line or be null.`);
        }
        if (!PUBLICATION_TYPES.includes(publicationValue.type as PublicationType)) {
          throw new Error(`${publicationPath}.type must be a supported publication type.`);
        }
        if (!PUBLICATION_STATUSES.includes(publicationValue.status as PublicationStatus)) {
          throw new Error(`${publicationPath}.status must be a supported publication status.`);
        }
        const rawLink = textField(publicationValue.link, `${publicationPath}.link`, 2_048);
        const link = normalizePublicationLink(rawLink);
        if (link === null) throw new Error(`${publicationPath}.link must be an http or https URL or a valid DOI, at most 2048 characters.`);
        return {
          id: textField(publicationValue.id, `${publicationPath}.id`, 100),
          title: textField(publicationValue.title, `${publicationPath}.title`, 500),
          authors,
          selectedAuthorIndex,
          type: publicationValue.type as PublicationType,
          status: publicationValue.status as PublicationStatus,
          venue: textField(publicationValue.venue, `${publicationPath}.venue`, 500),
          year: textField(publicationValue.year, `${publicationPath}.year`, 100),
          link,
          role: textField(publicationValue.role, `${publicationPath}.role`),
          sample: boolField(publicationValue.sample, `${publicationPath}.sample`),
        };
      });
    } else {
      publications = [];
    }
    let publicationOptions: PublicationOptions = { numberedStyle: false, groupByType: false, shortenAuthors: false };
    if (value.publicationOptions !== undefined) {
      if (!isRecord(value.publicationOptions)) throw new Error(`${path}.publicationOptions is invalid.`);
      publicationOptions = {
        numberedStyle: value.publicationOptions.numberedStyle === undefined ? false : boolField(value.publicationOptions.numberedStyle, `${path}.publicationOptions.numberedStyle`),
        groupByType: value.publicationOptions.groupByType === undefined ? false : boolField(value.publicationOptions.groupByType, `${path}.publicationOptions.groupByType`),
        shortenAuthors: value.publicationOptions.shortenAuthors === undefined ? false : boolField(value.publicationOptions.shortenAuthors, `${path}.publicationOptions.shortenAuthors`),
      };
    }
    return {
      id: textField(value.id, `${path}.id`, 100),
      type: value.type as SectionType,
      title: textField(value.title, `${path}.title`, 100),
      visible: boolField(value.visible, `${path}.visible`),
      entries: value.type === "summary" || value.type === "publications" ? [] : entries,
      summary,
      summarySample,
      publications,
      publicationOptions,
    };
  });
  const importedTypes = sections.map((item) => item.type);
  if (new Set(importedTypes).size !== SECTION_TYPES.length ||
    SECTION_TYPES.some((type) => !importedTypes.includes(type))) {
    throw new Error("Resume must include each supported section exactly once.");
  }
  const ids = [
    ...contact.links.map((link) => link.id),
    ...sections.flatMap((item) => [
      item.id,
      ...item.entries.map((entry) => entry.id),
      ...item.publications.map((publication) => publication.id),
    ]),
  ];
  if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length) {
    throw new Error("Resume item IDs must be present and unique.");
  }
  let typography = { ...DEFAULT_TYPOGRAPHY };
  if (input.typography !== undefined) {
    if (!isRecord(input.typography)) throw new Error("typography must be an object.");
    const typographyInput = input.typography;
    const font = TYPOGRAPHY_FONTS.some((option) => option.id === typographyInput.font)
      ? typographyInput.font as TypographyFontId
      : DEFAULT_TYPOGRAPHY.font;
    const numberSetting = (key: keyof typeof TYPOGRAPHY_RANGES): number => {
      const value = typographyInput[key];
      if (value === undefined) return DEFAULT_TYPOGRAPHY[key];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`typography.${key} must be a number.`);
      }
      return Math.min(TYPOGRAPHY_RANGES[key].max, Math.max(TYPOGRAPHY_RANGES[key].min, value));
    };
    const underlineLinks = typographyInput.underlineLinks === undefined
      ? DEFAULT_TYPOGRAPHY.underlineLinks
      : boolField(typographyInput.underlineLinks, "typography.underlineLinks");
    typography = {
      font,
      namePt: numberSetting("namePt"),
      sectionHeadingPt: numberSetting("sectionHeadingPt"),
      subheadingPt: numberSetting("subheadingPt"),
      bodyPt: numberSetting("bodyPt"),
      underlineLinks,
    };
  }
  return {
    version: 2,
    mode: input.mode,
    compactSpacing: boolField(input.compactSpacing, "compactSpacing"),
    student: boolField(input.student, "student"),
    contact,
    sections,
    typography,
  };
}

export function sampleItemCount(resume: ResumeDocument): number {
  return resume.contact.sampleFields.length +
    resume.contact.links.filter((item) => item.sample).length +
    resume.sections.reduce((total, item) =>
      total + (item.summarySample ? 1 : 0) +
      item.entries.filter((value) => value.sample).length +
      item.publications.filter((publication) => publication.sample).length, 0);
}

export function isNonEmptyEntry(entryValue: ResumeEntry): boolean {
  return [entryValue.title, entryValue.organization, entryValue.location, entryValue.dates, entryValue.description]
    .some((value) => value.trim().length > 0);
}

export const STORAGE_KEY = "pdfkira-resume-builder-v1";
