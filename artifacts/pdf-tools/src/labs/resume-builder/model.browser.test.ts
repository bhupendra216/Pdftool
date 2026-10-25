import { expect, it, vi } from "vitest";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { cdp, page } from "vitest/browser";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyModeDefaults,
  applyModeOrder,
  buildResumeContactLines,
  clearSampleData,
  createBlankPublication,
  createBlankResume,
  createSampleResume,
  DEFAULT_TYPOGRAPHY,
  equalLanguageLevel,
  findMatchingAuthor,
  isValidProfilePhotoDataUrl,
  isShareableDriveLink,
  HIGHER_STUDY_ORDER,
  INITIAL_VISIBLE_ORDER,
  JOB_ORDER,
  normalizePublicationLink,
  normalizeResumeItemLink,
  PAGE_CONTENT_HEIGHT_MM,
  PAGE_CONTENT_WIDTH_MM,
  PAGE_HEIGHT_MM,
  PAGE_MARGIN_MM,
  PAGE_PAGINATION_BUFFER_MM,
  PAGE_PAGINATION_HEIGHT_MM,
  PAGE_WIDTH_MM,
  parseDescription,
  packResumeHeaderLines,
  publicationAuthorIndices,
  publicationGroups,
  preserveTypography,
  RESUME_TEXT_STYLES,
  sampleItemCount,
  setEuropeanStandard,
  STORAGE_KEY,
  TYPOGRAPHY_FONTS,
  TYPOGRAPHY_RANGES,
  validateResumeImport,
} from "./model";
import { buildLatexResume, createResumeBlocks, createResumeContactItems, Description, getPaperStyle, processProfilePhoto, PublicationCitation, ResumeBuilder } from "./ResumeBuilder";
import { paginateBlocks } from "./pagination";
import { createResumePdf, downloadBlob } from "./pdf-export";
import resumeBuilderCss from "./resume-builder.css?raw";
import { getToolContentRequirements } from "@/data/toolContentRequirements";
import { tools } from "../../../../api-server/src/lib/content";
import demoPhoto from "@/assets/pdfkira-logo.png?inline";

function contrastRatio(background: [number, number, number], foreground: [number, number, number]) {
  const luminance = ([hue, saturation, lightness]: [number, number, number]) => {
    const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const section = hue / 60;
    const secondary = chroma * (1 - Math.abs(section % 2 - 1));
    const rgb = section < 1 ? [chroma, secondary, 0]
      : section < 2 ? [secondary, chroma, 0]
      : section < 3 ? [0, chroma, secondary]
      : section < 4 ? [0, secondary, chroma]
      : section < 5 ? [secondary, 0, chroma]
      : [chroma, 0, secondary];
    const offset = lightness / 100 - chroma / 2;
    const linear = rgb.map((channel) => {
      const value = channel + offset;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const values = [luminance(background), luminance(foreground)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const samplePublication = () => createSampleResume().sections.find((section) => section.type === "publications")!.publications[0];

async function waitForProfilePhoto(host: HTMLElement) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (host.querySelector('.rb-paper img[alt="Profile photo"]')) return;
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }
}

it("builds Europass contact lines without empty items or separators", () => {
  const resume = createSampleResume();
  resume.europeanStandard = true;
  expect(buildResumeContactLines(resume).map((line) => line.map((item) => item.text))).toEqual([
    ["casey.example@example.com", "+1 555-010-2040", "LinkedIn", "GitHub"],
    ["Address: 123 Example Street, Portland, OR 97201"],
    ["Nationality: Example nationality", "Date of birth: 2000-01-15"],
  ]);

  resume.contact.address = "";
  expect(buildResumeContactLines(resume).map((line) => line.map((item) => item.text))).toEqual([
    ["casey.example@example.com", "+1 555-010-2040", "LinkedIn", "GitHub", "Portland, OR"],
    ["Nationality: Example nationality", "Date of birth: 2000-01-15"],
  ]);

  resume.contact.email = "";
  resume.contact.phone = "";
  resume.contact.links = [];
  resume.contact.location = "";
  resume.contact.nationality = "";
  resume.contact.dateOfBirth = "";
  expect(buildResumeContactLines(resume)).toEqual([]);

  resume.contact.location = "Portland, OR";
  resume.europeanStandard = false;
  expect(buildResumeContactLines(resume)).toEqual([[{ key: "location", text: "Portland, OR" }]]);
  resume.europeanStandard = true;
  resume.contact.location = "";
  for (const nationality of ["", "Canadian"]) {
    for (const dateOfBirth of ["", "2000-01-15"]) {
      for (const address of ["", "1 Example Road"]) {
        resume.contact.nationality = nationality;
        resume.contact.dateOfBirth = dateOfBirth;
        resume.contact.address = address;
        const lines = buildResumeContactLines(resume);
        expect(lines.every((line) => line.length > 0 && line.every((item) => item.text.trim()))).toBe(true);
        expect(lines.map((line) => line.map((item) => item.text).join(" • ")).join("\n"))
          .not.toMatch(/(^|\n)\s*•|•\s*(\n|$)|•\s*•/);
        if (!nationality && !dateOfBirth && !address) {
          expect(lines.flat().some((item) => /Nationality|Date of birth|Address/.test(item.text))).toBe(false);
        }
      }
    }
  }
});

it("packs whole header items without dangling separators and normalizes photo positions", () => {
  const items = [
    { key: "email", text: "email@example.com" },
    { key: "phone", text: "+1 555 0100" },
    { key: "address", text: "Address: A very long address", breakBefore: true },
  ];
  for (const width of [1, 12, 30, 80]) {
    const packed = packResumeHeaderLines(items, width, (text) => text.length);
    expect(packed.flatMap((line) => line.items.map((item) => item.text))).toEqual(items.map((item) => item.text));
    expect(packed.every((line) => line.items.length > 0)).toBe(true);
    const rendered = packed.map((line) => line.items.map((item) => item.text).join(" • ")).join("\n");
    expect(rendered).not.toMatch(/(^|\n)\s*•|•\s*(\n|$)/);
    expect(packed.find((line) => line.items.some((item) => item.key === "address"))?.items).toHaveLength(1);
  }

  const source = createSampleResume();
  const base = JSON.parse(JSON.stringify(source)) as Record<string, unknown>;
  expect(source.photoPosition).toBe("right");
  for (const position of ["right", "center", "left"] as const) {
    const imported = validateResumeImport({ ...base, photoPosition: position, profilePhotoDataUrl: demoPhoto });
    expect(imported.photoPosition).toBe(position);
    expect(validateResumeImport(JSON.parse(JSON.stringify(imported))).photoPosition).toBe(position);
  }
  expect(validateResumeImport({ ...base, photoPosition: "unknown" }).photoPosition).toBe("right");
  expect(validateResumeImport(base).photoPosition).toBe("right");
  expect(validateResumeImport({ ...base, recentGraduateOrStudent: true })).not.toHaveProperty("recentGraduateOrStudent");
});

function emptyEuropeanResume() {
  const resume = createBlankResume();
  return {
    ...resume,
    contact: {
      ...resume.contact,
      nationality: "Example nationality",
      dateOfBirth: "2000-01-15",
      address: "123 Example Street, Portland, OR 97201",
      sampleFields: ["nationality", "dateOfBirth", "address"] as const,
    },
    sections: resume.sections.map((item) =>
      ["languages", "digitalSkills", "conferences", "grants", "memberships", "drivingLicence"].includes(item.type)
        ? { ...item, europeanSampleSeeded: false }
        : item,
    ),
  };
}

it("keeps Job/Study format separate from the Europass CV checkbox and migrates legacy European mode", () => {
  const resume = createSampleResume();
  expect(resume.mode).toBe("job");
  expect(resume.europeanStandard).toBe(false);
  expect(applyModeOrder(resume.sections, "study", false).map((section) => section.type)).toEqual(HIGHER_STUDY_ORDER);
  expect(applyModeOrder(resume.sections, "job", false).map((section) => section.type)).toEqual(JOB_ORDER);
  expect(applyModeOrder(resume.sections, "job", true).map((section) => section.type)).toEqual([
    "summary",
    "experience",
    "education",
    "languages",
    "digitalSkills",
    "skills",
    "projects",
    "publications",
    "certifications",
    "awards",
    "conferences",
    "grants",
    "memberships",
    "community",
    "drivingLicence",
    "custom",
  ]);
  const europeanDefaults = applyModeDefaults(resume.sections, "job", true);
  expect(europeanDefaults.find((section) => section.type === "drivingLicence")?.visible).toBe(true);
  const explicitlyHidden = resume.sections.map((section) => section.type === "drivingLicence"
    ? { ...section, visible: false, visibilityCustomized: true }
    : section);
  expect(applyModeDefaults(explicitlyHidden, "job", true).find((section) => section.type === "drivingLicence")?.visible).toBe(false);

  const legacy = JSON.parse(JSON.stringify(createSampleResume())) as ReturnType<typeof createSampleResume>;
  legacy.version = 1;
  legacy.mode = "european" as typeof legacy.mode;
  const migrated = validateResumeImport(legacy);
  expect(migrated.mode).toBe("job");
  expect(migrated.europeanStandard).toBe(true);
  expect(migrated.contact.nationality).toBe(legacy.contact.nationality ?? "");
  expect(migrated.sections.find((section) => section.type === "languages")?.visible).toBe(true);

  const oldStudentJson = JSON.parse(JSON.stringify(createSampleResume()));
  oldStudentJson.student = true;
  const importedOldStudent = validateResumeImport(oldStudentJson);
  expect("student" in importedOldStudent).toBe(false);
  expect(applyModeOrder(importedOldStudent.sections, importedOldStudent.mode).map((section) => section.type)).toEqual(JOB_ORDER);
});

it("starts with visible sections in Job order and a single sample publication", () => {
  const resume = createSampleResume();
  expect(resume.sections.filter((section) => section.visible).map((section) => section.type)).toEqual(INITIAL_VISIBLE_ORDER);
  expect(resume.sections.filter((section) => !section.visible).map((section) => section.type)).toEqual([
    "projects",
    "custom",
    "languages",
    "digitalSkills",
    "conferences",
    "grants",
    "memberships",
    "drivingLicence",
  ]);
  const publication = resume.sections.find((section) => section.type === "publications");
  expect(publication?.publications).toHaveLength(1);
  expect(publication?.publications[0]).toMatchObject({
    authors: ["J. Coauthor*", "C. Example*", "R. Researcher"],
    selectedAuthorIndex: 1,
    type: "Conference paper",
    status: "Published",
    title: "Example Title of a Research Paper",
    venue: "Proceedings of the Example Conference",
    year: "2025",
    link: "https://example.com/doi",
    role: "Implemented the experiments and wrote the methods section.",
    sample: true,
  });
  expect(publication?.publicationOptions).toEqual({ numberedStyle: false, groupByType: false, shortenAuthors: false });
  expect(sampleItemCount(resume)).toBe(30);
});

it("includes editable Europass CV sample data and seeds only untouched empty sections", () => {
  const sample = createSampleResume();
  expect(sample.contact).toMatchObject({
    nationality: "Example nationality",
    dateOfBirth: "2000-01-15",
    address: "123 Example Street, Portland, OR 97201",
  });
  expect(sample.contact.sampleFields).toEqual(expect.arrayContaining(["nationality", "dateOfBirth", "address"]));
  expect(sample.sections.find((item) => item.type === "languages")).toMatchObject({
    motherTongues: ["English"],
    languagesSample: true,
    others: [
      { name: "Spanish", listening: "B2", reading: "B2", interactionSpoken: "B2", productionSpoken: "B2", writing: "B2", sample: true },
      { name: "French", listening: "A2", reading: "A2", interactionSpoken: "A2", productionSpoken: "A2", writing: "A2", sample: true },
    ],
  });
  expect(sample.sections.find((item) => item.type === "digitalSkills")?.entries.map((entry) => [entry.title, entry.description, entry.sample]))
    .toEqual([
      ["Spreadsheets and data analysis", "Proficient", true],
      ["Project management tools", "Independent", true],
      ["Presentation and documentation software", "Independent", true],
      ["Basic scripting and automation", "Basic", true],
    ]);
  expect(sample.sections.find((item) => item.type === "memberships")?.entries[0])
    .toMatchObject({ title: "Example Operations Association", organization: "Member", dates: "2023–Present", sample: true });
  expect(sample.sections.find((item) => item.type === "conferences")?.entries[0])
    .toMatchObject({ title: "Regional Operations Summit", organization: "Attendee", dates: "2025", description: "Workshop on workflow improvement", sample: true });
  expect(sample.sections.find((item) => item.type === "grants")?.entries[0])
    .toMatchObject({ title: "Example Community Scholarship", dates: "2022", description: "Merit-based award for academic achievement", sample: true });
  expect(sample.sections.find((item) => item.type === "drivingLicence"))
    .toMatchObject({ drivingLicence: "B", drivingLicenceSample: true, visible: false });
  expect(sampleItemCount(sample)).toBe(30);
  expect(equalLanguageLevel(sample.sections.find((item) => item.type === "languages")!.others![0])).toBe("B2");
  expect(equalLanguageLevel(sample.sections.find((item) => item.type === "languages")!.others![1])).toBe("A2");
  const importedSample = validateResumeImport(JSON.parse(JSON.stringify(sample)));
  expect(equalLanguageLevel(importedSample.sections.find((item) => item.type === "languages")!.others![0])).toBe("B2");

  const eligibleBlank = createBlankResume();
  eligibleBlank.sections = eligibleBlank.sections.map((item) =>
    ["languages", "digitalSkills", "conferences", "grants", "memberships", "drivingLicence"].includes(item.type)
      ? { ...item, europeanSampleSeeded: false }
      : item,
  );
  const seeded = setEuropeanStandard(eligibleBlank, true);
  expect(seeded.sections.find((item) => item.type === "languages")?.motherTongues).toEqual(["English"]);
  expect(seeded.sections.find((item) => item.type === "digitalSkills")?.entries).toHaveLength(4);
  expect(seeded.sections.find((item) => item.type === "conferences")?.entries).toHaveLength(1);
  expect(seeded.sections.find((item) => item.type === "grants")?.entries).toHaveLength(1);
  expect(seeded.sections.find((item) => item.type === "memberships")?.entries).toHaveLength(1);
  expect(seeded.sections.find((item) => item.type === "drivingLicence")?.drivingLicence).toBe("B");
  expect(seeded.sections.find((item) => item.type === "drivingLicence")?.visible).toBe(true);
  expect(seeded.sections.filter((item) => ["languages", "digitalSkills", "conferences", "grants", "memberships"].includes(item.type)).every((item) => item.visible)).toBe(true);
  expect(seeded.sections.find((item) => item.type === "drivingLicence")?.visible).toBe(true);

  const edited = setEuropeanStandard({
    ...eligibleBlank,
    sections: eligibleBlank.sections.map((item) => item.type === "conferences"
      ? { ...item, europeanSampleSeeded: false, entries: [{ id: "user-conference", title: "My event", organization: "", location: "", dates: "", description: "", link: "", sample: false }] }
      : item.type === "memberships" ? { ...item, europeanSampleSeeded: true } : item),
  }, true);
  expect(edited.sections.find((item) => item.type === "conferences")?.entries.map((entry) => entry.title)).toEqual(["My event"]);
  expect(edited.sections.find((item) => item.type === "memberships")?.entries).toEqual([]);

  const blankEnabled = setEuropeanStandard(createBlankResume(), true);
  expect(blankEnabled.sections.find((item) => item.type === "languages")?.others).toEqual([]);
  expect(blankEnabled.sections.find((item) => item.type === "digitalSkills")?.entries).toEqual([]);
  expect(blankEnabled.sections.find((item) => item.type === "drivingLicence")?.drivingLicence).toBe("");
});

it("clears the new Europass sample data and does not reseed it", () => {
  const cleared = clearSampleData(createSampleResume());
  expect(sampleItemCount(cleared)).toBe(0);
  expect(cleared.contact).toMatchObject({ nationality: "", dateOfBirth: "", address: "" });
  expect(cleared.sections.find((item) => item.type === "languages")).toMatchObject({ motherTongues: [], others: [], languagesSample: false });
  for (const type of ["digitalSkills", "conferences", "grants", "memberships"] as const) {
    expect(cleared.sections.find((item) => item.type === type)?.entries).toEqual([]);
  }
  expect(cleared.sections.find((item) => item.type === "drivingLicence"))
    .toMatchObject({ drivingLicence: "", drivingLicenceSample: false });
  const toggled = setEuropeanStandard(setEuropeanStandard(cleared, false), true);
  expect(sampleItemCount(toggled)).toBe(0);
});

it("seeds, counts, preserves, and clears the demo photo without reseeding removed photos", () => {
  const sample = createSampleResume();
  const enabled = setEuropeanStandard(sample, true, demoPhoto);
  expect(enabled.profilePhotoDataUrl).toBe(demoPhoto);
  expect(enabled.profilePhotoSample).toBe(true);
  expect(sampleItemCount(enabled)).toBe(31);
  const hidden = setEuropeanStandard(enabled, false, demoPhoto);
  expect(hidden.profilePhotoDataUrl).toBe(demoPhoto);
  expect(setEuropeanStandard(hidden, true, demoPhoto).profilePhotoDataUrl).toBe(demoPhoto);
  expect(JSON.stringify(hidden)).toContain(demoPhoto);
  const hiddenPreview = renderToStaticMarkup(createElement("div", null,
    ...createResumeBlocks(hidden, createResumeContactItems(hidden)).map((block) => block.content),
  ));
  expect(hiddenPreview).not.toContain('alt="Profile photo"');
  expect(buildLatexResume(hidden)).not.toContain("% photo not included");
  expect(buildLatexResume(enabled)).toContain("% photo not included");

  const { profilePhotoDataUrl: _removedPhoto, ...removed } = enabled;
  const removedPhoto = { ...removed, profilePhotoSample: false, profilePhotoSeedAllowed: false };
  expect(setEuropeanStandard(setEuropeanStandard(removedPhoto, false, demoPhoto), true, demoPhoto).profilePhotoDataUrl).toBeUndefined();
  expect(sampleItemCount(removedPhoto)).toBe(30);

  const cleared = clearSampleData(enabled);
  expect(cleared.profilePhotoDataUrl).toBeUndefined();
  expect(cleared.profilePhotoSeedAllowed).toBe(false);
  expect(sampleItemCount(cleared)).toBe(0);
  expect(setEuropeanStandard(cleared, true, demoPhoto).profilePhotoDataUrl).toBeUndefined();
  expect(createBlankResume().profilePhotoDataUrl).toBeUndefined();

  const userPhoto = { ...enabled, profilePhotoDataUrl: demoPhoto, profilePhotoSample: false, profilePhotoSeedAllowed: false };
  expect(setEuropeanStandard(userPhoto, false, demoPhoto).profilePhotoDataUrl).toBe(demoPhoto);
  expect(clearSampleData(userPhoto).profilePhotoDataUrl).toBe(demoPhoto);
  expect(sampleItemCount(userPhoto)).toBe(30);
});

it("validates photo data URLs safely and downsizes accepted uploads", async () => {
  expect(isValidProfilePhotoDataUrl(demoPhoto)).toBe(true);
  for (const invalid of [
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA==",
    "data:image/png;base64,aGVsbG8=",
    "data:image/png;base64,iVBORw0KGgo=",
    "data:image/png;base64,!",
  ]) {
    const imported = validateResumeImport({ ...createSampleResume(), profilePhotoDataUrl: invalid });
    expect(imported.profilePhotoDataUrl).toBeUndefined();
  }

  const invalidType = new File(["not an image"], "photo.gif", { type: "image/gif" });
  await expect(processProfilePhoto(invalidType)).rejects.toThrow("Choose a PNG, JPEG, or WebP image.");
  const oversized = new File(["x".repeat(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" });
  await expect(processProfilePhoto(oversized)).rejects.toThrow("5 MB or smaller");

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 300;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#357";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const source = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not create test image.")), "image/png"),
  );
  const processed = await processProfilePhoto(new File([source], "photo.png", { type: "image/png" }));
  expect(isValidProfilePhotoDataUrl(processed)).toBe(true);
  const bitmap = await createImageBitmap(await (await fetch(processed)).blob());
  expect(Math.max(bitmap.width, bitmap.height)).toBeLessThanOrEqual(600);
  bitmap.close();
});

it("derives uniform language levels and renders uniform and mixed CEFR levels in preview and PDF", async () => {
  const resume = setEuropeanStandard(createSampleResume(), true);
  const languages = resume.sections.find((item) => item.type === "languages")!;
  expect(equalLanguageLevel(languages.others![0])).toBe("B2");
  expect(equalLanguageLevel(languages.others![1])).toBe("A2");
  const imported = validateResumeImport(JSON.parse(JSON.stringify(resume)));
  expect(equalLanguageLevel(imported.sections.find((item) => item.type === "languages")!.others![0])).toBe("B2");

  const preview = renderToStaticMarkup(createElement("div", null,
    ...createResumeBlocks(resume, createResumeContactItems(resume)).map((block) => block.content),
  ));
  expect(preview).toContain("Spanish: B2");
  expect(preview).toContain("French: A2");

  const spanish = languages.others![0];
  const french = languages.others![1];
  const mixedResume = {
    ...resume,
    sections: resume.sections.map((item) => item.type === "languages"
      ? { ...item, others: item.others!.map((language) => language.id === french.id ? { ...language, listening: "A1" as const } : language) }
      : item),
  };
  expect(equalLanguageLevel(mixedResume.sections.find((item) => item.type === "languages")!.others![1])).toBeNull();
  const mixedPreview = renderToStaticMarkup(createElement("div", null,
    ...createResumeBlocks(mixedResume, createResumeContactItems(mixedResume)).map((block) => block.content),
  ));
  expect(mixedPreview).toContain("Listening");
  expect(mixedPreview).toContain("Spoken interaction");

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await createResumePdf(mixedResume)) }).promise;
  const text = (await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
    (await (await pdf.getPage(index + 1)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []),
  ))).flat().join(" ").replace(/\s+/g, " ");
  expect(text).toContain("Spanish: B2");
  for (const label of ["Listening", "Reading", "Spoken interaction", "Spoken production", "Writing"]) expect(text).toContain(label);
});

it("keeps preview and PDF contact header lines identical", async () => {
  const resume = setEuropeanStandard(createSampleResume(), true);
  const expectedLines = createResumeContactItems(resume).map((line) =>
    line.items.map((item) => item.text).join(" • "),
  );
  const markup = renderToStaticMarkup(createElement("div", null,
    ...createResumeBlocks(resume, createResumeContactItems(resume)).map((block) => block.content),
  ));
  const document = new DOMParser().parseFromString(markup, "text/html");
  const previewLines = Array.from(document.querySelectorAll(".rb-contact-line"))
    .map((line) => line.textContent ?? "");
  expect(previewLines).toEqual(expectedLines);
  expect(previewLines.join("\n")).toContain("casey.example@example.com • +1 555-010-2040");
  expect(previewLines.join("\n")).toContain("LinkedIn • GitHub");
  const previewHeadings = Array.from(document.querySelectorAll("h2")).map((heading) => heading.textContent);
  expect(previewHeadings.indexOf("Summary")).toBeLessThan(previewHeadings.indexOf("Experience"));

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await createResumePdf(resume)) }).promise;
  const extractedItems = (await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
    (await (await pdf.getPage(index + 1)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []),
  ))).flat();
  const text = extractedItems.join(" ").replace(/\s+/g, " ");
  expect(text).toContain("casey.example@example.com • +1 555-010-2040");
  expect(text).toContain("LinkedIn • GitHub");
  expect(text.indexOf("Summary")).toBeLessThan(text.indexOf("Experience"));
  const latex = buildLatexResume(resume);
  expect(latex.indexOf("\\section*{Summary}")).toBeLessThan(latex.indexOf("\\section*{Experience}"));
  expect(latex).toContain("\\noindent Address: 123 Example Street, Portland, OR 97201\\par");
  expect(latex).toContain("\\noindent Nationality: Example nationality \\textbullet Date of birth: 2000-01-15\\par");
  expect(latex).not.toContain("\\textbullet Portland, OR");
}, 30_000);

it("renders Europass samples as selectable preview, PDF, and JSON text", async () => {
  const resume = setEuropeanStandard({ ...emptyEuropeanResume(), profilePhotoSeedAllowed: true }, true, demoPhoto);
  const blocks = createResumeBlocks(resume, createResumeContactItems(resume));
  const preview = renderToStaticMarkup(createElement("div", null, ...blocks.map((block) => block.content)));
  expect(preview).toContain("Example nationality");
  expect(preview).toContain('alt="Profile photo"');
  expect(preview).toContain("English");
  expect(preview).toContain("Regional Operations Summit");
  expect(preview).toContain("Example Community Scholarship");
  expect(JSON.stringify(resume)).toContain("Example Operations Association");

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await createResumePdf(resume)) }).promise;
  expect(pdf.numPages).toBeGreaterThan(0);
  const text = (await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
    (await (await pdf.getPage(index + 1)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []),
  ))).flat().join(" ");
  expect(text).toContain("Example nationality");
  expect(text).toContain("Regional Operations Summit");
  expect(text).toContain("Basic scripting and automation");
  const hiddenPdfBytes = await createResumePdf({ ...resume, europeanStandard: false });
  expect(new TextDecoder("latin1").decode(hiddenPdfBytes)).not.toContain("/Subtype /Image");
}, 30_000);

it("keeps the Europass header centered on full content width and aligns the framed photo", async () => {
  const resume = setEuropeanStandard(createSampleResume(), true, demoPhoto);
  resume.contact.address = "Long address line ".repeat(60);
  resume.contact.nationality = "W ".repeat(35);
  resume.contact.phone = "";
  resume.contact.links = [];
  const blocks = createResumeBlocks(resume, createResumeContactItems(resume));
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(createElement("div", {
    className: "rb-paper",
    style: {
      width: "210mm",
      padding: "20mm",
      "--rb-content-width": "170mm",
      "--rb-name-size": "24px",
      "--rb-contact-size": "8px",
      "--rb-weight-name": "700",
      "--rb-weight-body": "400",
      "--rb-style-date": "italic",
    },
  }, createElement("div", { className: "rb-page-content" }, ...blocks.map((block) => block.content))));
  document.body.append(host);
  try {
    const paper = host.querySelector<HTMLElement>(".rb-paper")!;
    const content = host.querySelector<HTMLElement>(".rb-page-content")!;
    const header = host.querySelector<HTMLElement>(".rb-document-header")!;
    const name = host.querySelector<HTMLElement>(".rb-name")!;
    const image = host.querySelector<HTMLImageElement>(".rb-profile-photo")!;
    const longContact = Array.from(host.querySelectorAll<HTMLElement>(".rb-contact-line"))
      .find((line) => line.textContent?.includes("Address:"))!;
    const longContactContent = longContact.querySelector<HTMLElement>(".rb-header-line-content")!;
    await image.decode();
    const centerX = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.left + rect.width / 2;
    };
    const contentRect = content.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    expect(imageRect.width).toBeCloseTo(30 * 96 / 25.4, 0);
    expect(imageRect.height).toBeCloseTo(38 * 96 / 25.4, 0);
    expect(centerX(name)).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
    for (const line of host.querySelectorAll<HTMLElement>(".rb-contact-line")) {
      expect(centerX(line)).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
    }
    expect(imageRect.right).toBeCloseTo(contentRect.right, 0);
    expect(imageRect.top).toBeCloseTo(name.getBoundingClientRect().top, 0);
    expect(imageRect.top).toBeCloseTo(header.getBoundingClientRect().top, 0);
    expect(imageRect.left - longContactContent.getBoundingClientRect().right).toBeGreaterThan(0);
    expect(getComputedStyle(image).objectFit).toBe("cover");
    expect(getComputedStyle(image).backgroundColor).toBe("rgb(255, 255, 255)");
    expect(Number.parseFloat(getComputedStyle(image).borderTopWidth)).toBeGreaterThan(0.5);
    expect(getComputedStyle(host.querySelector(".rb-entry-dates")!).fontStyle).toBe("normal");

    const noPhoto = { ...resume, profilePhotoDataUrl: undefined };
    const noPhotoHeader = renderToStaticMarkup(createResumeBlocks(noPhoto, createResumeContactItems(noPhoto))[0].content);
    const noPhotoHost = document.createElement("div");
    noPhotoHost.innerHTML = noPhotoHeader;
    content.append(noPhotoHost);
    expect(noPhotoHost.querySelector(".rb-profile-photo")).toBeNull();
    expect(noPhotoHost.querySelector(".rb-document-header")?.classList.contains("has-photo")).toBe(false);
    const noPhotoName = noPhotoHost.querySelector<HTMLElement>(".rb-name")!;
    const noPhotoNameRect = noPhotoName.getBoundingClientRect();
    expect(noPhotoNameRect.width).toBeCloseTo(contentRect.width, 0);
    for (const line of noPhotoHost.querySelectorAll<HTMLElement>(".rb-contact-line")) {
      expect(centerX(line)).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
    }

    for (const photoPosition of ["left", "center"] as const) {
      const positioned = { ...resume, photoPosition };
      const positionedHost = document.createElement("div");
      positionedHost.innerHTML = renderToStaticMarkup(createResumeBlocks(
        positioned,
        createResumeContactItems(positioned),
      )[0].content);
      content.append(positionedHost);
      const positionedHeader = positionedHost.querySelector<HTMLElement>(".rb-document-header")!;
      const positionedPhoto = positionedHost.querySelector<HTMLImageElement>(".rb-profile-photo")!;
      const positionedName = positionedHost.querySelector<HTMLElement>(".rb-name")!;
      await positionedPhoto.decode();
      const positionedPhotoRect = positionedPhoto.getBoundingClientRect();
      expect(positionedHeader.dataset.photoPosition).toBe(photoPosition);
      expect(centerX(positionedName)).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
      for (const line of positionedHost.querySelectorAll<HTMLElement>(".rb-contact-line")) {
        expect(centerX(line)).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
      }
      if (photoPosition === "left") {
        expect(positionedPhotoRect.left).toBeCloseTo(contentRect.left, 0);
        expect(positionedPhotoRect.top).toBeCloseTo(positionedName.getBoundingClientRect().top, 0);
      } else {
        expect(positionedPhotoRect.left + positionedPhotoRect.width / 2).toBeCloseTo(contentRect.left + contentRect.width / 2, 0);
        expect(positionedPhotoRect.bottom).toBeLessThanOrEqual(positionedName.getBoundingClientRect().top);
      }
      positionedHost.remove();
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const bytes = await createResumePdf(resume);
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
    const firstPage = await pdf.getPage(1);
    const operatorList = await firstPage.getOperatorList();
    const imageIndex = operatorList.fnArray.findIndex((operation) => operation === pdfjsLib.OPS.paintImageXObject);
    expect(imageIndex).toBeGreaterThan(0);
    const imageTransforms = operatorList.fnArray.slice(0, imageIndex).flatMap((operation, index) =>
      operation === pdfjsLib.OPS.transform ? [operatorList.argsArray[index] as number[]] : [],
    );
    const imageScale = imageTransforms.find(([a, , , d]) => a > 1 && d > 1)!;
    const imagePosition = imageTransforms.findLast(([, , , , x, y]) => x > 0 && y > 0)!;
    const pdfPageWidth = PAGE_WIDTH_MM * 72 / 25.4;
    const pdfPageHeight = PAGE_HEIGHT_MM * 72 / 25.4;
    const margin = PAGE_MARGIN_MM * 72 / 25.4;
    expect(imageScale[0]).toBeCloseTo(30 * 72 / 25.4 - 1, 5);
    expect(imageScale[3]).toBeCloseTo(38 * 72 / 25.4 - 1, 5);
    expect(imagePosition[4] + imageScale[0]).toBeCloseTo(pdfPageWidth - margin - 0.5, 1);
    expect(imagePosition[5] + imageScale[3]).toBeCloseTo(pdfPageHeight - margin - 0.5, 1);
    const pdfText = (await firstPage.getTextContent()).items.flatMap((item) => "str" in item ? [item] : []);
    const pdfName = pdfText.find((item) => item.str === resume.contact.fullName)!;
    expect(pdfName.transform[4] + pdfName.width / 2).toBeCloseTo(pdfPageWidth / 2, 2);
    const pdfEmailLine = pdfText.find((item) => item.str.includes(resume.contact.email))!;
    expect(pdfEmailLine.transform[4] + pdfEmailLine.width / 2).toBeCloseTo(pdfPageWidth / 2, 2);
    const pdfWrappedAddress = pdfText.filter((item) => item.str.includes("Long address line"));
    expect(pdfWrappedAddress.length).toBeGreaterThan(1);
    for (const line of pdfWrappedAddress) {
      expect(Math.abs(line.transform[4] + line.width / 2 - pdfPageWidth / 2)).toBeLessThan(2);
    }
    const nationalityItem = pdfText.find((item) => item.str.includes("Nationality:"))!;
    const pdfNationalityRow = pdfText.filter((item) =>
      Math.abs(item.transform[5] - nationalityItem.transform[5]) < 0.5,
    );
    const nationalityLeft = Math.min(...pdfNationalityRow.map((item) => item.transform[4]));
    const nationalityRight = Math.max(...pdfNationalityRow.map((item) => item.transform[4] + item.width));
    expect(nationalityRight - nationalityLeft).toBeGreaterThan(100 * 72 / 25.4);
    const photoLeft = pdfPageWidth - margin - 30 * 72 / 25.4;
    for (const item of pdfText.filter((textItem) =>
      textItem.transform[5] > imagePosition[5] &&
      textItem.transform[5] < imagePosition[5] + imageScale[3],
    )) {
      expect(item.transform[4] + item.width).toBeLessThanOrEqual(photoLeft + 1);
    }
    const previewRows = createResumeContactItems(resume);
    expect(previewRows.some((line) => line.fullWidth && line.items.some((item) => item.key === "dateOfBirth"))).toBe(true);
    const visibleHeader = Array.from(host.querySelectorAll<HTMLElement>(".rb-contact-line"));
    const photoBottom = image.getBoundingClientRect().bottom;
    expect(visibleHeader.some((line) =>
      (line.querySelector(".rb-header-line-content") as HTMLElement).getBoundingClientRect().top >= photoBottom &&
      line.classList.contains("full-width"),
    )).toBe(true);
    const previewNationalityRow = visibleHeader.find((line) => line.textContent?.includes("Nationality:"))!;
    expect(previewNationalityRow.classList.contains("full-width")).toBe(true);
    expect(previewNationalityRow.querySelector(".rb-header-line-content")?.getBoundingClientRect().width)
      .toBeCloseTo(contentRect.width, 0);
    const noPhotoPdfBytes = await createResumePdf({ ...resume, profilePhotoDataUrl: undefined });
    const noPhotoPdf = await pdfjsLib.getDocument({ data: new Uint8Array(noPhotoPdfBytes) }).promise;
    const noPhotoText = (await (await noPhotoPdf.getPage(1)).getTextContent()).items
      .flatMap((item) => "str" in item ? [item] : []);
    const noPhotoPdfName = noPhotoText.find((item) => item.str === resume.contact.fullName)!;
    expect(noPhotoPdfName.transform[4] + noPhotoPdfName.width / 2).toBeCloseTo(pdfPageWidth / 2, 2);
    for (const photoPosition of ["left", "center"] as const) {
      const positionedBytes = await createResumePdf({ ...resume, photoPosition });
      const positionedPdf = await pdfjsLib.getDocument({ data: new Uint8Array(positionedBytes) }).promise;
      const operators = await (await positionedPdf.getPage(1)).getOperatorList();
      const photoOperatorIndex = operators.fnArray.findIndex((operation) => operation === pdfjsLib.OPS.paintImageXObject);
      const transforms = operators.fnArray.slice(0, photoOperatorIndex).flatMap((operation, index) =>
        operation === pdfjsLib.OPS.transform ? [operators.argsArray[index] as number[]] : [],
      );
      const position = transforms.findLast(([, , , , x, y]) => x > 0 && y > 0)!;
      const scale = transforms.find(([a, , , d]) => a > 1 && d > 1)!;
      const expectedX = photoPosition === "left"
        ? margin + 0.5
        : (pdfPageWidth - 30 * 72 / 25.4) / 2 + 0.5;
      expect(position[4]).toBeCloseTo(expectedX, 1);
      expect(position[5] + scale[3]).toBeCloseTo(pdfPageHeight - margin - 0.5, 1);
    }
  } finally {
    host.remove();
    style.remove();
  }
}, 30_000);

it("shows Europass sample entries and the demo photo when the checkbox is turned on", async () => {
  window.localStorage.removeItem(STORAGE_KEY);
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  const wasDarkMode = document.documentElement.classList.contains("dark");
  const previousPopover = document.documentElement.style.getPropertyValue("--popover");
  const previousPopoverForeground = document.documentElement.style.getPropertyValue("--popover-foreground");
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  document.documentElement.classList.add("dark");
  document.documentElement.style.setProperty("--popover", "220 40% 6%");
  document.documentElement.style.setProperty("--popover-foreground", "40 20% 98%");
  try {
    const currentLogo = new Image();
    currentLogo.src = demoPhoto;
    await currentLogo.decode();
    expect(currentLogo.naturalWidth).toBe(1077);
    expect(currentLogo.naturalHeight).toBe(860);
    await act(async () => root.render(createElement(ResumeBuilder)));
    expect(host.textContent).toContain("Most job applications expect one.");
    const checkbox = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="checkbox"]'))
      .find((item) => item.parentElement?.textContent?.includes("Europass CV"));
    expect(checkbox).not.toBeNull();
    expect(host.textContent).not.toContain("Recent graduate or student");
    expect(host.querySelector(".rb-photo-control")).toBeNull();
    await act(async () => {
      checkbox?.click();
      await waitForProfilePhoto(host);
    });
    expect(checkbox?.getAttribute("aria-checked")).toBe("true");
    expect(host.textContent).toContain("Europass-style CVs usually run 2 pages.");
    expect(host.textContent).not.toContain("Most job applications expect one.");
    expect(host.querySelector('[aria-label="Languages section"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="Digital skills section"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="Driving licence section"]')).not.toBeNull();
    expect(host.querySelector(".rb-contact .rb-photo-control")).not.toBeNull();
    expect(host.textContent).toContain("Stays in your browser. Many employers outside Europe prefer no photo.");
    expect(host.querySelector<HTMLInputElement>('[aria-label="Driving licence section"] .rb-summary-field input')?.value).toBe("B");
    const previewHeadings = Array.from(host.querySelectorAll(".rb-paper h2")).map((heading) => heading.textContent);
    expect(previewHeadings.indexOf("Summary")).toBeLessThan(previewHeadings.indexOf("Experience"));
    const languageSelect = host.querySelector<HTMLButtonElement>('[aria-label="Same level for all five, language 1"]');
    expect(languageSelect?.textContent?.trim()).toBe("B2");
    const frenchSelect = host.querySelector<HTMLButtonElement>('[aria-label="Same level for all five, language 2"]');
    expect(frenchSelect?.textContent?.trim()).toBe("A2");
    expect(host.textContent).toContain("Regional Operations Summit");
    expect(host.textContent).toContain("Example Community Scholarship");
    expect(host.textContent).toContain("Example Operations Association");
    expect(host.querySelector('input[value="Example nationality"]')).not.toBeNull();
    expect(host.textContent).toContain("Not shown in the header while Address is set.");
    const headerLines = Array.from(host.querySelectorAll(".rb-contact-line"))
      .map((line) => line.textContent?.replace(/\s+/g, " ").trim() ?? "");
    expect(headerLines).toContain("Address: 123 Example Street, Portland, OR 97201");
    expect(headerLines).not.toContain("Portland, OR");
    expect(headerLines.every((line) => !/^•|•$|•\s*•/.test(line))).toBe(true);
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).not.toBeNull();
    expect(host.querySelector<HTMLElement>('[aria-label="Photo position"]')?.textContent).toContain("Right");
    expect(host.querySelector(".rb-photo-thumbnail")).not.toBeNull();
    const formatSelect = host.querySelector<HTMLElement>('[aria-label="Resume format"]')!;
    const photoPositionSelect = host.querySelector<HTMLElement>('[aria-label="Photo position"]')!;
    const formatStyle = getComputedStyle(formatSelect);
    const photoStyle = getComputedStyle(photoPositionSelect);
    for (const property of ["backgroundColor", "borderTopColor", "borderTopStyle", "borderTopWidth", "borderRadius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontFamily", "fontSize", "fontWeight", "boxShadow", "height"]) {
      expect(photoStyle[property as keyof CSSStyleDeclaration]).toBe(formatStyle[property as keyof CSSStyleDeclaration]);
    }
    expect(photoStyle.appearance).toBe("none");
    await act(async () => photoPositionSelect.click());
    const photoMenu = document.body.querySelector<HTMLElement>(".rb-photo-position-menu");
    expect(photoMenu).not.toBeNull();
    expect(getComputedStyle(photoMenu!).backgroundColor).toBe("rgb(9, 13, 21)");
    expect(getComputedStyle(photoMenu!).color).toBe("rgb(251, 250, 249)");
    await act(async () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.textContent?.trim() === "Right")?.click());
    const separator = host.querySelector<HTMLElement>(".rb-contact-separator");
    expect(separator?.textContent).toBe(" • ");
    const separatorFontSize = Number.parseFloat(getComputedStyle(separator!).fontSize);
    expect(Number.parseFloat(getComputedStyle(separator!).marginLeft)).toBeCloseTo(separatorFontSize * 0.4, 2);
    expect(Number.parseFloat(getComputedStyle(separator!).marginRight)).toBeCloseTo(separatorFontSize * 0.4, 2);
    expect(host.querySelectorAll(".rb-preview-pane .rb-paper img")).toHaveLength(1);
    expect(Array.from(host.querySelectorAll(".rb-photo-control button"))
      .some((button) => button.textContent?.includes("Upload photo"))).toBe(false);
    expect(Array.from(host.querySelectorAll(".rb-photo-control button"))
      .some((button) => button.textContent?.includes("Replace photo"))).toBe(true);
    expect(host.textContent).toContain("Sample data: 31 sample items remain.");
    const renderedPages = host.querySelectorAll<HTMLElement>(".rb-page-wrap");
    const pageBreakBefore = Array.from(renderedPages).slice(1).flatMap((sheet) => {
      const sourceId = sheet.querySelector<HTMLElement>(".rb-page-block")?.dataset.sourceId;
      return sourceId ? [sourceId] : [];
    });
    const samplePdfBytes = await createResumePdf(
      validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null")),
      pageBreakBefore,
    );
    expect(new TextDecoder("latin1").decode(samplePdfBytes)).toContain("/Subtype /Image");
    const samplePdf = await PDFDocument.load(samplePdfBytes);
    expect(samplePdf.getPageCount()).toBe(renderedPages.length);
    expect(samplePdf.getTitle()).toBe("Casey Example - Europass CV");
    const skillInput = host.querySelector<HTMLInputElement>('[aria-label="Digital skills section"] .rb-entry-form input');
    expect(skillInput).not.toBeNull();
    const setInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setInputValue?.call(skillInput, "My spreadsheet skills");
      skillInput?.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(host.textContent).toContain("Sample data: 30 sample items remain.");
    await act(async () => checkbox?.click());
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).toBeNull();
    const preservedDemoPhoto = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null").profilePhotoDataUrl;
    expect(preservedDemoPhoto).not.toBe(demoPhoto);
    expect(isValidProfilePhotoDataUrl(preservedDemoPhoto)).toBe(true);
    await act(async () => checkbox?.click());
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).not.toBeNull();
    expect(skillInput?.value).toBe("My spreadsheet skills");
    expect(host.textContent).toContain("Sample data: 30 sample items remain.");
    const saved = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
    expect(saved.europeanStandard).toBe(true);
    expect(saved.sections.find((item) => item.type === "memberships")?.entries).toHaveLength(1);
    expect(saved.sections.find((item) => item.type === "digitalSkills")?.entries[0])
      .toMatchObject({ title: "My spreadsheet skills", sample: false });

    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Close Driving licence section"]')?.click());
    await act(async () => checkbox?.click());
    await act(async () => checkbox?.click());
    expect(host.querySelector('[aria-label="Driving licence section"]')).toBeNull();

    const listening = host.querySelector<HTMLButtonElement>('[aria-label="Listening, language 1"]');
    await act(async () => listening?.click());
    const a1Option = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.textContent?.trim() === "A1");
    expect(a1Option).not.toBeUndefined();
    await act(async () => a1Option?.click());
    expect(languageSelect?.textContent?.trim()).toBe("Choose level");

    await act(async () => languageSelect?.click());
    const b1Option = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.textContent?.trim() === "B1");
    expect(b1Option).not.toBeUndefined();
    await act(async () => b1Option?.click());
    expect(languageSelect?.textContent?.trim()).toBe("B1");
    const updated = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
    expect(updated.sections.find((item) => item.type === "languages")?.others?.[0])
      .toMatchObject({ listening: "B1", reading: "B1", interactionSpoken: "B1", productionSpoken: "B1", writing: "B1" });

    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    try {
      await act(async () => Array.from(host.querySelectorAll("button"))
        .find((button) => button.textContent === "Reset to sample")?.click());
      const resetCheckbox = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="checkbox"]'))
        .find((item) => item.parentElement?.textContent?.includes("Europass CV"));
      await act(async () => {
        resetCheckbox?.click();
        await new Promise((resolve) => window.setTimeout(resolve, 1_000));
      });
      expect(host.querySelector<HTMLButtonElement>('[aria-label="Same level for all five, language 1"]')?.textContent?.trim()).toBe("B2");
      expect(host.querySelector<HTMLButtonElement>('[aria-label="Same level for all five, language 2"]')?.textContent?.trim()).toBe("A2");
      expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).not.toBeNull();
      expect(host.textContent).toContain("Sample data: 31 sample items remain.");
      const resetSample = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
      expect(resetSample.profilePhotoSample).toBe(true);
      expect(resetSample.profilePhotoDataUrl).toBe(preservedDemoPhoto);
    } finally {
      confirm.mockRestore();
    }
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    if (!wasDarkMode) document.documentElement.classList.remove("dark");
    if (previousPopover) document.documentElement.style.setProperty("--popover", previousPopover);
    else document.documentElement.style.removeProperty("--popover");
    if (previousPopoverForeground) document.documentElement.style.setProperty("--popover-foreground", previousPopoverForeground);
    else document.documentElement.style.removeProperty("--popover-foreground");
  }
}, 30_000);

it("uploads, replaces, and removes a photo, closes the preview gap, and prevents reseeding", async () => {
  window.localStorage.removeItem(STORAGE_KEY);
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    const checkbox = Array.from(host.querySelectorAll<HTMLButtonElement>('[role="checkbox"]'))
      .find((item) => item.parentElement?.textContent?.includes("Europass CV"));
    expect(host.querySelector(".rb-photo-control")).toBeNull();
    await act(async () => {
      checkbox?.click();
      await waitForProfilePhoto(host);
    });
    const makePhoto = async (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 180;
      const context = canvas.getContext("2d")!;
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not create test photo.")), "image/png"),
      );
      return new File([blob], "profile.png", { type: "image/png" });
    };
    await act(async () => host.querySelector<HTMLButtonElement>(".rb-photo-control button:last-of-type")?.click());
    expect("profilePhotoDataUrl" in JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null")).toBe(false);
    expect(host.querySelector(".rb-paper .rb-document-header.has-photo")).toBeNull();
    expect(Array.from(host.querySelectorAll(".rb-photo-control button"))
      .some((button) => button.textContent?.includes("Upload photo"))).toBe(true);
    const upload = async (file: File) => {
      const input = host.querySelector<HTMLInputElement>(".rb-photo-control input[type=file]");
      expect(input).not.toBeNull();
      Object.defineProperty(input!, "files", { configurable: true, value: [file] });
      await act(async () => {
        input!.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise((resolve) => window.setTimeout(resolve, 1_000));
      });
    };

    const firstPhoto = await makePhoto("#157");
    await upload(firstPhoto);
    const firstSaved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    expect(firstSaved.profilePhotoDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(firstSaved.profilePhotoSample).toBe(false);
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')?.getAttribute("src")).toBe(firstSaved.profilePhotoDataUrl);
    const replaceButton = Array.from(host.querySelectorAll("button")).find((button) => button.textContent === "Replace photo");
    expect(replaceButton).not.toBeUndefined();
    const secondPhoto = await makePhoto("#a35");
    await upload(secondPhoto);
    const replaced = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    expect(replaced.profilePhotoDataUrl).not.toBe(firstSaved.profilePhotoDataUrl);
    const photoPosition = host.querySelector<HTMLElement>('[aria-label="Photo position"]');
    expect(photoPosition?.textContent).toContain("Right");
    const preservedPhoto = replaced.profilePhotoDataUrl;
    await act(async () => {
      photoPosition!.click();
    });
    await act(async () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.textContent?.trim() === "Left")?.click());
    expect(host.querySelector(".rb-document-header")?.getAttribute("data-photo-position")).toBe("left");
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null").profilePhotoDataUrl).toBe(preservedPhoto);

    await act(async () => Array.from(host.querySelectorAll("button"))
      .find((button) => button.textContent === "Remove photo")?.click());
    const removed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    expect("profilePhotoDataUrl" in removed).toBe(false);
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).toBeNull();
    const previewHeader = host.querySelector<HTMLElement>(".rb-paper .rb-document-header");
    expect(previewHeader?.classList.contains("has-photo")).toBe(false);

    await act(async () => checkbox?.click());
    expect(host.querySelector(".rb-photo-control")).toBeNull();
    expect("profilePhotoDataUrl" in JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null")).toBe(false);
    await act(async () => checkbox?.click());
    expect(host.querySelector('.rb-paper img[alt="Profile photo"]')).toBeNull();
  } finally {
    confirm.mockRestore();
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
}, 30_000);

it("keeps the sample resume fictional, marker-free, and ordered for the selected mode", () => {
  const resume = createSampleResume();
  expect(resume.contact.fullName).toBe("Casey Example");
  expect(resume.contact.email).toBe("casey.example@example.com");
  expect(resume.contact.phone).toBe("+1 555-010-2040");
  expect(resume.sections.find((section) => section.type === "summary")?.summary)
    .toBe("Early-career operations coordinator who improves team workflows and keeps projects moving.");
  expect(resume.sections.flatMap((section) => section.entries).map((entry) => entry.organization)).toContain("Cedar Grove Cooperative");
  expect(resume.contact.links.every((link) => new URL(link.url).hostname.endsWith(".example"))).toBe(true);
  expect(resume.sections.find((section) => section.type === "certifications")?.entries[0]).toMatchObject({
    title: "Project Management Foundations",
    organization: "Example Learning Institute",
    dates: "2024",
    link: "https://drive.google.com/drive/folders/1st88kUbePzHfxMK-8-Jwzd1fFysvf-IG",
    sample: true,
  });
  expect(resume.sections.find((section) => section.type === "awards")?.entries[0]).toMatchObject({
    title: "Community Service Recognition",
    organization: "North Coast College",
    dates: "2023",
    link: "https://drive.google.com/drive/folders/1x1pobVV1iK7PNMCBSDxRW_z8e7WhtsPz",
    sample: true,
  });
  expect(applyModeOrder(resume.sections, "Higher study").map((section) => section.type)).toEqual(HIGHER_STUDY_ORDER);
  expect(applyModeOrder(resume.sections, "Higher study").find((section) => section.type === "publications")?.visible).toBe(true);
});

it("escapes LaTeX-sensitive text and omits hidden sections", () => {
  const resume = createSampleResume();
  resume.contact.fullName = "A & B #1 $100 _alpha {braces} ~tilde ^caret";
  resume.contact.email = "user@example.com";
  resume.sections.find((section) => section.type === "summary")!.visible = false;
  resume.sections.find((section) => section.type === "publications")!.visible = false;
  const latex = buildLatexResume(resume);
  expect(latex).toContain("A \\& B \\#1 \\$100 \\_alpha \\{braces\\} \\textasciitilde tilde \\textasciicircum caret");
  expect(latex).not.toContain("\\section{Summary}");
  expect(latex).not.toContain("\\section{Publications}");
});

it("renders a single Summary textarea without generic entry controls", () => {
  const markup = renderToStaticMarkup(createElement(ResumeBuilder));
  const doc = new DOMParser().parseFromString(markup, "text/html");
  const summaryCard = doc.querySelector('[aria-label="Summary section"]');
  expect(summaryCard).not.toBeNull();
  expect(summaryCard?.querySelectorAll("textarea")).toHaveLength(1);
  expect(summaryCard?.querySelector("textarea")?.getAttribute("placeholder"))
    .toBe("Two or three lines: who you are and what you want next.");
  expect(summaryCard?.textContent).not.toContain("Add entry");
  expect(summaryCard?.textContent).not.toContain("Remove entry");
  expect(summaryCard?.textContent).not.toContain("Move entry");
  expect(markup).not.toContain("i. Early-career");
  expect(markup).toContain("Early-career operations coordinator who improves team workflows and keeps projects moving.");
  expect(markup).toContain("Sample data: 30 sample items remain.");
  expect(markup).toContain("How to list publications");
  expect(markup).toContain("List all authors in the order printed on the paper. Never move yourself up.");
  expect(markup).toContain("Text and fonts");
  expect(markup).toContain("Fonts come from your device. If one isn’t installed, a similar font is used, and the PDF keeps the font you see on screen.");
  expect(markup).toContain("Most resumes use 10 to 12 pt body text.");
});

it("renders summary paragraphs and only turns explicit dash or bullet prefixes into bullets", () => {
  const markup = renderToStaticMarkup(createElement(Description, {
    text: "Plain paragraph\n- A dash bullet\n• A dot bullet\ni. Not a list marker",
  }));
  expect(markup).toContain("<p>Plain paragraph</p>");
  expect(markup).toContain("<li>A dash bullet</li>");
  expect(markup).toContain("<li>A dot bullet</li>");
  expect(markup).toContain("<p>i. Not a list marker</p>");
  expect(parseDescription("- A\nA paragraph\n• B")).toEqual([
    { kind: "bullet", text: "A" },
    { kind: "paragraph", text: "A paragraph" },
    { kind: "bullet", text: "B" },
  ]);
});

it("migrates old Summary and Publications entries without dropping their text", () => {
  const old = JSON.parse(JSON.stringify(createSampleResume())) as ReturnType<typeof createSampleResume>;
  old.version = 1;
  delete (old as Partial<typeof old>).typography;
  for (const item of old.sections) {
    for (const entry of item.entries) delete (entry as Partial<typeof entry>).link;
  }
  const summary = old.sections.find((section) => section.type === "summary")!;
  summary.entries = [
    { id: "summary-sample", title: "", organization: "", location: "", dates: "", description: "i. First sample line", sample: true },
    { id: "summary-empty", title: "", organization: "", location: "", dates: "", description: "  ", sample: false },
    { id: "summary-second", title: "", organization: "", location: "", dates: "", description: "Second paragraph", sample: false },
    { id: "summary-extra", title: "Legacy title text", organization: "", location: "", dates: "", description: "", sample: false },
  ];
  const publications = old.sections.find((section) => section.type === "publications")!;
  publications.entries = [{
    id: "old-publication",
    title: "Old paper title",
    organization: "Old venue",
    location: "Old location",
    dates: "2024",
    description: "Old contribution details",
    sample: false,
  }];
  for (const section of old.sections) {
    delete (section as Partial<typeof section>).summary;
    delete (section as Partial<typeof section>).summarySample;
    delete (section as Partial<typeof section>).publications;
    delete (section as Partial<typeof section>).publicationOptions;
  }
  const migrated = validateResumeImport(old);
  expect(migrated.sections.find((section) => section.type === "summary")).toMatchObject({
    summary: "First sample line\nSecond paragraph\nLegacy title text",
    summarySample: true,
    entries: [],
  });
  expect(migrated.sections.find((section) => section.type === "publications")?.publications[0]).toMatchObject({
    title: "Old paper title",
    venue: "Old venue",
    year: "2024",
    role: "Old contribution details\nLocation: Old location",
  });
  expect(migrated.version).toBe(3);
  expect(migrated.typography).toEqual(DEFAULT_TYPOGRAPHY);
});

it("matches exactly one full or initial-and-surname author and rejects ambiguity", () => {
  expect(findMatchingAuthor(["J. Person", "casey example*"], "Casey Example")).toBe(1);
  expect(findMatchingAuthor(["J. Person", "C. Example†"], "Casey Example")).toBe(1);
  expect(findMatchingAuthor(["Casey Example", "C. Example*"], "Casey Example")).toBeNull();
  expect(findMatchingAuthor(["C. Example"], "Casey Johnson")).toBeNull();
  const imported = JSON.parse(JSON.stringify(createSampleResume())) as ReturnType<typeof createSampleResume>;
  const publication = imported.sections.find((section) => section.type === "publications")!.publications[0];
  publication.authors = ["C. Example*", "R. Researcher"];
  publication.selectedAuthorIndex = null;
  delete (publication as Partial<typeof publication>).selectedAuthorIndex;
  expect(validateResumeImport(imported).sections.find((section) => section.type === "publications")?.publications[0].selectedAuthorIndex).toBe(0);
});

it("keeps publication author order, selected emphasis, author marks, status, and italic venue", () => {
  const publication = {
    ...samplePublication(),
    authors: ["J. Coauthor*", "C. Example†", "R. Researcher"],
    selectedAuthorIndex: 1,
    status: "Under review" as const,
  };
  const markup = renderToStaticMarkup(createElement(PublicationCitation, {
    publication, number: 1, numbered: false, shortenAuthors: false,
  }));
  expect(markup.indexOf("J. Coauthor*")).toBeLessThan(markup.indexOf("C. Example†"));
  expect(markup.indexOf("C. Example†")).toBeLessThan(markup.indexOf("R. Researcher"));
  expect(markup).toContain('<strong class="rb-publication-author">C. Example†</strong>');
  expect(markup).toContain(" (under review).");
  expect(markup).toContain("<em>Proceedings of the Example Conference</em>");
  expect(markup).toContain("2025 (under review)");
});

it("renders all non-published status suffixes", () => {
  const base = samplePublication();
  for (const [status, text] of [
    ["Accepted", "(accepted)"],
    ["Under review", "(under review)"],
    ["In preparation", "(in preparation)"],
  ] as const) {
    const markup = renderToStaticMarkup(createElement(PublicationCitation, {
      publication: { ...base, status }, number: 1, numbered: false, shortenAuthors: false,
    }));
    expect(markup).toContain(text);
  }
});

it("renders publication titles as links without displaying the raw URL", () => {
  expect(normalizePublicationLink("https://example.com/doi")).toBe("https://example.com/doi");
  expect(normalizePublicationLink("http://example.com/doi")).toBe("http://example.com/doi");
  expect(normalizePublicationLink("  https://example.com/doi  ")).toBe("https://example.com/doi");
  expect(normalizePublicationLink("javascript:alert(1)")).toBeNull();
  expect(normalizePublicationLink("data:text/html,hello")).toBeNull();
  expect(normalizePublicationLink("file:///tmp/resume")).toBeNull();
  expect(normalizePublicationLink("mailto:hello@example.com")).toBeNull();
  expect(normalizePublicationLink("10.1234/example.doi")).toBe("https://doi.org/10.1234/example.doi");
  expect(normalizePublicationLink("doi:10.12345/example.doi")).toBe("https://doi.org/10.12345/example.doi");
  expect(normalizePublicationLink(`https://example.com/${"x".repeat(2_040)}`)).toBeNull();
  const base = samplePublication();
  const safeMarkup = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: { ...base, link: "https://example.com/doi" }, number: 1, numbered: false, shortenAuthors: false,
  }));
  const parsed = new DOMParser().parseFromString(safeMarkup, "text/html");
  expect(parsed.querySelector("a")?.textContent).toBe("Example Title of a Research Paper");
  expect(parsed.querySelector("a")?.getAttribute("href")).toBe("https://example.com/doi");
  expect(parsed.querySelector("a")?.getAttribute("target")).toBe("_blank");
  expect(parsed.querySelector("a")?.getAttribute("rel")).toBe("noopener noreferrer");
  expect(parsed.body.textContent).not.toContain("https://example.com/doi");
  const unsafeMarkup = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: { ...base, link: "javascript:alert(1)" }, number: 1, numbered: false, shortenAuthors: false,
  }));
  expect(new DOMParser().parseFromString(unsafeMarkup, "text/html").querySelector("a")).toBeNull();
  expect(unsafeMarkup).not.toContain("javascript:");
  expect(resumeBuilderCss).toContain(".rb-paper a { color: inherit; text-decoration: var(--rb-link-decoration); }");
  expect(resumeBuilderCss).toContain(".rb-section-rule::before");
  expect(resumeBuilderCss).not.toMatch(/\.rb-paper h2\s*\{[^}]*border-bottom/);
  expect(resumeBuilderCss).not.toMatch(/\.rb-contact-line\s*\{[^}]*border-bottom/);
  expect(resumeBuilderCss).toContain("body.rb-print-mode .rb-paper a { color: #000 !important; text-decoration: none !important;");
  expect(resumeBuilderCss).not.toMatch(/a::after|a:after|attr\\(href\\)/);
});

it("uses fixed A4 dimensions, ignores an old page-size field, and prints fixed-margin sheets", () => {
  expect([PAGE_WIDTH_MM, PAGE_HEIGHT_MM, PAGE_MARGIN_MM, PAGE_CONTENT_WIDTH_MM, PAGE_CONTENT_HEIGHT_MM,
    PAGE_PAGINATION_BUFFER_MM, PAGE_PAGINATION_HEIGHT_MM])
    .toEqual([210, 297, 20, 170, 257, 2, 255]);
  const oldResume = { ...createSampleResume(), pageSize: "Letter" };
  const imported = validateResumeImport(oldResume);
  expect("pageSize" in imported).toBe(false);
  expect(JSON.stringify(imported)).not.toContain("pageSize");
  expect(resumeBuilderCss).toContain("@page { size: A4; margin: 0; }");
  expect(resumeBuilderCss).toContain("width: var(--rb-content-width); height: var(--rb-content-height);");
  expect(resumeBuilderCss).toContain("body.rb-print-mode .rb-page-wrap:last-child");
  const markup = renderToStaticMarkup(createElement(ResumeBuilder));
  expect(markup).not.toContain("Page size");
  expect(markup).not.toContain("Letter");
  expect(markup).toContain("Download file");
  expect(markup).not.toContain("Print or save as PDF");
  expect(markup).not.toContain("In the print dialog choose A4");
});

it("creates a downloadable A4 PDF with the resume name as its filename", async () => {
  const pdfBytes = await createResumePdf(createSampleResume());
  const pdf = await PDFDocument.load(pdfBytes);
  expect(pdf.getPageCount()).toBeGreaterThan(0);
  expect(pdf.getTitle()).toBe("Casey Example - Resume");
  expect(pdf.getPage(0).getSize().width).toBeCloseTo(PAGE_WIDTH_MM * 72 / 25.4, 2);
  expect(pdf.getPage(0).getSize().height).toBeCloseTo(PAGE_HEIGHT_MM * 72 / 25.4, 2);

  const createUrl = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:resume-download");
  const revokeUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  let downloadedFilename = "";
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
    downloadedFilename = this.download;
  });
  try {
    downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), "Casey Example.pdf");
    expect(downloadedFilename).toBe("Casey Example.pdf");
    expect(createUrl).toHaveBeenCalledWith(expect.objectContaining({ type: "application/pdf" }));
    expect(click).toHaveBeenCalledOnce();
  } finally {
    createUrl.mockRestore();
    revokeUrl.mockRestore();
    click.mockRestore();
  }
});

it("keeps downloaded PDF links and entry alignment consistent with the preview", async () => {
  const pdfBytes = await createResumePdf(createSampleResume());
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const pageContents = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
    (await pdf.getPage(index + 1)).getTextContent(),
  ));
  const pages = pageContents.map((content) => content.items.flatMap((item) => "str" in item ? [item] : []));
  const annotations = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) =>
    (await pdf.getPage(index + 1)).getAnnotations(),
  ));
  const items = pages.flat();
  const links = annotations.flat().map((annotation) => annotation.url).filter(Boolean);
  expect(links).toEqual(expect.arrayContaining([
    "mailto:casey.example@example.com",
    "https://linkedin.example/casey-example",
    "https://example.com/doi",
    "https://drive.google.com/drive/folders/1st88kUbePzHfxMK-8-Jwzd1fFysvf-IG",
  ]));
  const text = items.map((item) => item.str).join(" ");
  expect(text).toContain("Summary");
  expect(text).toContain("Early-career operations coordinator");
  expect(text).toContain("LinkedIn");
  expect(text).toContain("GitHub");
  expect(text).toContain("Project Management Foundations");
  expect(text).not.toContain("https://linkedin.example");
  expect(text).not.toContain("drive.google.com");
  expect(text).not.toContain("https://example.com/doi");

  const experienceTitle = items.find((item) => item.str.includes("Operations Assistant"));
  const experienceDate = items.find((item) => item.str.includes("2024–Present"));
  const experienceOrganization = items.find((item) => item.str.includes("Cedar Grove Cooperative"));
  expect(experienceTitle).toBeDefined();
  expect(experienceDate).toBeDefined();
  expect(experienceDate!.str).toBe("2024–Present");
  const regularBodyText = items.find((item) => item.str.startsWith("Early-career operations coordinator"));
  expect(regularBodyText).toBeDefined();
  expect(experienceDate!.fontName).toBe(regularBodyText!.fontName);
  expect(experienceOrganization).toBeDefined();
  expect(experienceDate!.transform[4]).toBeGreaterThan(experienceTitle!.transform[4]);
  expect(Math.abs(experienceDate!.transform[5] - experienceTitle!.transform[5])).toBeLessThan(2);
  expect(experienceOrganization!.transform[5]).toBeLessThan(experienceTitle!.transform[5]);
});

it("paginates the downloaded sample resume to the same page count as the preview", async () => {
  const resume = createSampleResume();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    const previewResume = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
    const previewPageCount = Number(host.querySelector(".rb-page-count")?.textContent?.match(/\d+/)?.[0]);
    const secondPageFirstBlock = host.querySelectorAll(".rb-page-wrap")[1]?.querySelector(".rb-page-block");
    const secondPageFirstSource = secondPageFirstBlock?.getAttribute("data-source-id");
    const secondPageFirstText = secondPageFirstBlock?.textContent?.trim();
    if (!secondPageFirstSource || !secondPageFirstText) throw new Error("The preview must have a text source block at the start of page two.");
    const pdfBytes = await createResumePdf(previewResume, [secondPageFirstSource]);
    const pdf = await PDFDocument.load(pdfBytes);
    expect(pdf.getPageCount()).toBe(previewPageCount);
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const parsedPdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
    const firstPageText = (await (await parsedPdf.getPage(1)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []).join(" ");
    const secondPageText = (await (await parsedPdf.getPage(2)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []).join(" ");
    expect(secondPageText, JSON.stringify({ secondPageFirstSource, secondPageFirstText, firstPageText, secondPageText })).toContain(secondPageFirstText);
    expect(firstPageText).not.toContain(secondPageFirstText);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

it("renders a long resume into measured A4 sheets without overflowing page content", async () => {
  window.localStorage.removeItem(STORAGE_KEY);
  const resume = createSampleResume();
  const summary = resume.sections.find((section) => section.type === "summary");
  if (!summary) throw new Error("The sample resume must include Summary.");
  summary.summary = "Experienced coordinator who improves team workflows and keeps projects moving. ".repeat(700);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    await act(async () => Promise.resolve());
    const previewButton = Array.from(host.querySelectorAll("button")).find((button) => button.textContent?.trim() === "Preview");
    expect(previewButton).toBeDefined();
    await act(async () => previewButton?.click());
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    await act(async () => Promise.resolve());
    const sheets = host.querySelectorAll<HTMLElement>(".rb-page-wrap");
    const count = Number(host.querySelector(".rb-page-count")?.textContent?.match(/\d+/)?.[0]);
    expect(count).toBeGreaterThan(1);
    expect(sheets).toHaveLength(count);
    expect(host.querySelector(".rb-page-label")?.textContent).toBe(`Page 1 of ${count}`);
    const measureContent = host.querySelector<HTMLElement>(".rb-measure-paper .rb-page-content");
    expect(measureContent?.style.width).toBe("170mm");
    expect(measureContent?.style.height).toBe("257mm");
    const sheet = host.querySelector<HTMLElement>(".rb-page-wrap .rb-paper");
    expect(sheet?.style.width).toBe("210mm");
    expect(sheet?.style.height).toBe("297mm");
    expect(sheet?.style.padding).toBe("20mm");
    for (const sheet of sheets) {
      const content = sheet.querySelector<HTMLElement>(".rb-page-content");
      expect(content).not.toBeNull();
      expect(content!.scrollHeight).toBeLessThanOrEqual(content!.clientHeight);
      const contentTop = content!.getBoundingClientRect().top;
      const contentBottom = Math.max(...Array.from(
        content!.querySelectorAll<HTMLElement>(".rb-page-block"),
        (block) => block.getBoundingClientRect().bottom,
      ));
      expect(contentBottom - contentTop).toBeLessThanOrEqual(PAGE_PAGINATION_HEIGHT_MM * 96 / 25.4);
    }
    const bufferedHeight = PAGE_PAGINATION_HEIGHT_MM * 96 / 25.4;
    const simpleBlocks = [{ id: "under-one-page", height: 40 }];
    expect(paginateBlocks(simpleBlocks, bufferedHeight)).toHaveLength(1);
    expect(paginateBlocks(simpleBlocks, bufferedHeight)).toEqual(paginateBlocks(simpleBlocks, bufferedHeight));
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

it("measures at natural width while Edit is active and the narrow preview pane is hidden", async () => {
  await page.viewport(390, 844);
  window.localStorage.removeItem(STORAGE_KEY);
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const layout = host.querySelector<HTMLElement>(".rb-layout");
    const preview = host.querySelector<HTMLElement>(".rb-preview-pane");
    const measuring = host.querySelector<HTMLElement>(".rb-measure-paper");
    const measuredContent = measuring?.querySelector<HTMLElement>(".rb-page-content");
    const paper = host.querySelector<HTMLElement>(".rb-preview-pane .rb-paper");
    expect(layout?.dataset.mobileView).toBe("edit");
    expect(preview).not.toBeNull();
    expect(getComputedStyle(preview!).display).toBe("none");
    expect(measuring?.getAttribute("aria-hidden")).toBe("true");
    expect(measuring?.hasAttribute("inert")).toBe(true);
    expect(getComputedStyle(measuring!).display).not.toBe("none");
    expect(measuring!.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(measuredContent?.style.width).toBe("170mm");
    expect(measuredContent!.getBoundingClientRect().width).toBeCloseTo(170 * 96 / 25.4, 0);
    expect(getComputedStyle(measuring!).getPropertyValue("--rb-body-size"))
      .toBe(getComputedStyle(paper!).getPropertyValue("--rb-body-size"));
    expect(host.querySelectorAll(".rb-page-wrap").length).toBeGreaterThan(0);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    await page.viewport(1280, 900);
  }
});

it("prints visible sheets while Edit is active at a narrow viewport", async () => {
  await page.viewport(390, 844);
  window.localStorage.removeItem(STORAGE_KEY);
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const session = cdp();
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const layout = host.querySelector<HTMLElement>(".rb-layout");
    const preview = host.querySelector<HTMLElement>(".rb-preview-pane");
    expect(layout?.dataset.mobileView).toBe("edit");
    expect(getComputedStyle(preview!).display).toBe("none");

    await session.send("Emulation.setEmulatedMedia", { media: "print" });
    expect(window.matchMedia("print").matches).toBe(true);
    expect(getComputedStyle(preview!).display).toBe("block");
    expect(getComputedStyle(preview!).visibility).toBe("visible");
    const sheets = host.querySelectorAll<HTMLElement>(".rb-page-wrap");
    expect(sheets.length).toBeGreaterThan(0);
    for (const sheet of sheets) {
      const paper = sheet.querySelector<HTMLElement>(".rb-paper");
      expect(paper).not.toBeNull();
      expect(getComputedStyle(paper!).visibility).toBe("visible");
      expect(getComputedStyle(paper!).display).toBe("block");
      expect(getComputedStyle(paper!).transform).toBe("none");
    }
  } finally {
    await session.send("Emulation.setEmulatedMedia", { media: "screen" });
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    await page.viewport(1280, 900);
  }
});

it("renders award and certification titles as safe clickable links and preserves phone as text", () => {
  const markup = renderToStaticMarkup(createElement(ResumeBuilder));
  const doc = new DOMParser().parseFromString(markup, "text/html");
  const certLink = "https://drive.google.com/drive/folders/1st88kUbePzHfxMK-8-Jwzd1fFysvf-IG";
  const awardLink = "https://drive.google.com/drive/folders/1x1pobVV1iK7PNMCBSDxRW_z8e7WhtsPz";
  expect(doc.querySelector(`a[href="${certLink}"]`)?.textContent).toBe("Project Management Foundations");
  expect(doc.querySelector(`a[href="${awardLink}"]`)?.textContent).toBe("Community Service Recognition");
  expect(doc.querySelector(`a[href="${certLink}"]`)?.getAttribute("target")).toBe("_blank");
  expect(doc.querySelector(`a[href="${awardLink}"]`)?.getAttribute("rel")).toBe("noopener noreferrer");
  expect(doc.body.textContent).not.toContain(certLink);
  expect(doc.body.textContent).not.toContain(awardLink);
  expect(doc.body.textContent).toContain("Paste a link to your certificate or award letter from Google Drive, Dropbox, OneDrive or your own site.");
  expect(doc.body.textContent).toContain("Check that sharing is set to ‘Anyone with the link can view’.");
  expect(doc.querySelector('a[href^="tel:"]')).toBeNull();
  expect(doc.querySelector('a[href="mailto:casey.example@example.com"]')?.getAttribute("rel")).toBe("noopener noreferrer");
  expect(isShareableDriveLink(certLink)).toBe(true);
  expect(isShareableDriveLink("https://example.com")).toBe(false);
  expect(normalizeResumeItemLink(" https://example.com/certificate ")).toBe("https://example.com/certificate");
  for (const invalid of ["javascript:alert(1)", "data:text/html,x", "file:///tmp/x", "mailto:person@example.com"]) {
    expect(normalizeResumeItemLink(invalid)).toBeNull();
  }
});

it("removes resume entries and publications without a render error", async () => {
  window.localStorage.removeItem(STORAGE_KEY);
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const experience = host.querySelector('[aria-label="Experience section"]');
    expect(experience?.querySelectorAll(".rb-entry-form")).toHaveLength(1);
    const removeExperience = experience?.querySelector<HTMLButtonElement>('[aria-label="Remove entry 1"]');
    expect(removeExperience).not.toBeNull();
    await act(async () => removeExperience?.click());
    expect(experience?.querySelectorAll(".rb-entry-form")).toHaveLength(0);

    const publications = host.querySelector('[aria-label="Publications section"]');
    const removePublication = publications?.querySelector<HTMLButtonElement>('[aria-label="Remove publication 1"]');
    expect(removePublication).not.toBeNull();
    await act(async () => removePublication?.click());
    expect(publications?.querySelectorAll(".rb-publication-form")).toHaveLength(0);
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    const saved = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
    expect(saved.sections.find((section) => section.type === "experience")?.entries).toHaveLength(0);
    expect(saved.sections.find((section) => section.type === "publications")?.publications).toHaveLength(0);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

it("starts with and saves a fresh sample when a saved draft exists before refresh", async () => {
  const oldDraft = createBlankResume();
  oldDraft.contact.fullName = "Previously saved user";
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(oldDraft));
  const host = document.createElement("div");
  const style = document.createElement("style");
  style.textContent = resumeBuilderCss;
  document.head.append(style);
  document.body.append(host);
  const root = createRoot(host);
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => root.render(createElement(ResumeBuilder)));
    expect(host.querySelector(".rb-name")?.textContent).toBe("Casey Example");
    expect(host.textContent).toContain("Sample data: 30 sample items remain.");
    const persisted = validateResumeImport(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
    expect(persisted.contact.fullName).toBe("Casey Example");
    expect(sampleItemCount(persisted)).toBe(30);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    style.remove();
    window.localStorage.removeItem(STORAGE_KEY);
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

it("preserves sample link fields through sample actions and validates link fields in JSON", () => {
  const resume = createSampleResume();
  expect(resume.sections.find((section) => section.type === "certifications")?.entries[0].sample).toBe(true);
  expect(resume.sections.find((section) => section.type === "awards")?.entries[0].sample).toBe(true);
  const cleared = clearSampleData(resume);
  expect(cleared.sections.find((section) => section.type === "certifications")?.entries).toEqual([]);
  expect(cleared.sections.find((section) => section.type === "awards")?.entries).toEqual([]);
  expect(createBlankResume().sections.find((section) => section.type === "certifications")?.entries).toEqual([]);
  expect(createBlankResume().sections.find((section) => section.type === "awards")?.entries).toEqual([]);

  const json = JSON.parse(JSON.stringify(resume));
  json.sections.find((section: { type: string }) => section.type === "awards").entries[0].link = "javascript:alert(1)";
  expect(() => validateResumeImport(json)).toThrow("must use http or https and be at most 2048 characters");
  json.sections.find((section: { type: string }) => section.type === "awards").entries[0].link = `https://example.com/${"x".repeat(2048)}`;
  expect(() => validateResumeImport(json)).toThrow("at most 2048 characters");
});

it("supports numbering, type grouping order, and short author lists", () => {
  const base = samplePublication();
  const numbered = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: base, number: 3, numbered: true, shortenAuthors: false,
  }));
  expect(numbered).toContain("[3]");

  const publications = [
    { ...base, type: "Other" as const, id: "other" },
    { ...base, type: "Journal article" as const, id: "journal" },
    { ...base, type: "Thesis" as const, id: "thesis" },
    { ...base, type: "Conference paper" as const, id: "conference" },
  ];
  expect(publicationGroups(publications).map((group) => group.type)).toEqual([
    "Journal article", "Conference paper", "Thesis", "Other",
  ]);
  expect(publicationAuthorIndices({ ...base, authors: ["A", "B", "C", "D", "E", "F", "G"], selectedAuthorIndex: 5 }, true))
    .toEqual([0, 1, 2]);
  expect(publicationAuthorIndices({ ...base, authors: ["A", "B", "C", "D", "E", "F", "G"], selectedAuthorIndex: null }, true))
    .toEqual([0, 1, 2]);
  const shortened = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: { ...base, authors: ["A One", "B Two", "C Three", "D Four", "E Five", "F Six", "G Seven"], selectedAuthorIndex: 5 },
    number: 1, numbered: false, shortenAuthors: true,
  }));
  expect(shortened).toContain("…");
  expect(shortened).toContain('<strong class="rb-publication-author">F Six</strong>');
  expect(shortened).toContain("et al.");
  const shortenedWithoutSelection = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: { ...base, authors: ["A One", "B Two", "C Three", "D Four", "E Five", "F Six", "G Seven"], selectedAuthorIndex: null },
    number: 1, numbered: false, shortenAuthors: true,
  }));
  expect(new DOMParser().parseFromString(shortenedWithoutSelection, "text/html").body.textContent)
    .toContain("A One, B Two, C Three, …, et al. Example Title of a Research Paper");
  expect(shortenedWithoutSelection).not.toContain("<strong>");
});

it("counts sample publications, clears their content, and keeps blank starts and entries empty", () => {
  const sample = createSampleResume();
  const cleared = clearSampleData(sample);
  expect(cleared.sections.find((section) => section.type === "publications")).toMatchObject({
    visible: true,
    publications: [],
  });
  expect(sampleItemCount(cleared)).toBe(0);
  const blank = createBlankResume();
  expect(blank.sections.find((section) => section.type === "publications")).toMatchObject({
    visible: true,
    publications: [],
  });
  expect(blank.sections.find((section) => section.type === "summary")).toMatchObject({ summary: "", summarySample: false });
  expect(sampleItemCount(createSampleResume())).toBe(sampleItemCount(clearSampleData(createBlankResume())) + 30);
  expect(createBlankPublication()).toMatchObject({
    title: "", authors: [], selectedAuthorIndex: null, venue: "", year: "", link: "", role: "", sample: false,
  });
});

it("drops unknown import fields and rejects invalid publication data and overlong text", () => {
  const valid = createSampleResume();
  expect(validateResumeImport(JSON.parse(JSON.stringify(valid)))).toEqual(valid);
  const unknownFields = JSON.parse(JSON.stringify(valid));
  unknownFields.unexpected = true;
  unknownFields.contact.unexpected = "discard";
  const sanitized = validateResumeImport(unknownFields);
  expect(sanitized).not.toHaveProperty("unexpected");
  expect(sanitized.contact).not.toHaveProperty("unexpected");
  const invalidLink = JSON.parse(JSON.stringify(valid));
  invalidLink.sections.find((section: { type: string }) => section.type === "publications").publications[0].link = "data:text/html,hello";
  expect(() => validateResumeImport(invalidLink)).toThrow("http or https URL or a valid DOI");
  invalidLink.sections.find((section: { type: string }) => section.type === "publications").publications[0].link = "javascript:alert(1)";
  expect(() => validateResumeImport(invalidLink)).toThrow("http or https URL or a valid DOI");
  const invalidType = JSON.parse(JSON.stringify(valid));
  invalidType.sections.find((section: { type: string }) => section.type === "publications").publications[0].type = "Magazine";
  expect(() => validateResumeImport(invalidType)).toThrow("supported publication type");
  const invalidStatus = JSON.parse(JSON.stringify(valid));
  invalidStatus.sections.find((section: { type: string }) => section.type === "publications").publications[0].status = "Rejected";
  expect(() => validateResumeImport(invalidStatus)).toThrow("supported publication status");
  const tooLong = JSON.parse(JSON.stringify(valid));
  tooLong.sections.find((section: { type: string }) => section.type === "publications").publications[0].title = "x".repeat(501);
  expect(() => validateResumeImport(tooLong)).toThrow("at most 500 characters");
});

it("escapes user text in summaries and every publication field", () => {
  const unsafe = "<img onerror=alert(1)>";
  const summaryMarkup = renderToStaticMarkup(createElement(Description, { text: unsafe }));
  const publicationMarkup = renderToStaticMarkup(createElement(PublicationCitation, {
    publication: { ...samplePublication(), title: unsafe, authors: [unsafe], venue: unsafe, year: unsafe, link: "", role: unsafe },
    number: 1, numbered: false, shortenAuthors: false,
  }));
  expect(summaryMarkup).toContain("&lt;img onerror=alert(1)&gt;");
  expect(publicationMarkup.match(/&lt;img onerror=alert\(1\)&gt;/g)).toHaveLength(5);
  expect(publicationMarkup).not.toContain("<img");
});

it("generates accurate public-page copy for the browser-only resume builder", () => {
  const tool = tools.find(({ slug }) => slug === "resume-builder");
  if (!tool) throw new Error("Resume Builder is missing from the public tool catalog.");
  const content = getToolContentRequirements(tool);

  expect(content.privacyModel.type).toBe("browser-only");
  expect(content.uniqueIntro).toContain("not uploaded");
  expect(content.technicalSpecs.outputFormats).toContain("Browser print dialog / Save as PDF");
  expect(content.technicalSpecs.maxFileSize).toContain("2 MB");
  expect(content.howToSteps.map(({ title }) => title)).toContain("Print or save as PDF");
  expect(content.uniqueIntro).not.toContain("choose a document");
});

it("keeps primary text token contrast at WCAG AA in both themes", () => {
  const themePairs: Array<[string, [number, number, number], [number, number, number]]> = [
    ["light foreground on background", [40, 20, 98], [220, 40, 15]],
    ["light muted text on background", [40, 20, 98], [220, 15, 45]],
    ["light card text", [0, 0, 100], [220, 40, 15]],
    ["light primary button", [222, 47, 20], [0, 0, 100]],
    ["light secondary button", [150, 20, 92], [150, 40, 20]],
    ["dark foreground on background", [220, 40, 4], [40, 20, 98]],
    ["dark muted text on background", [220, 40, 4], [220, 15, 65]],
    ["dark card text", [220, 40, 6], [40, 20, 98]],
    ["dark primary button", [222, 47, 80], [220, 40, 4]],
    ["dark secondary button", [220, 20, 15], [40, 20, 98]],
  ];
  for (const [pair, background, foreground] of themePairs) {
    expect(contrastRatio(background, foreground), pair).toBeGreaterThanOrEqual(4.5);
  }
});

it("uses baseline typography defaults that reproduce the existing pixel sizes", () => {
  const style = getPaperStyle(DEFAULT_TYPOGRAPHY);
  expect(style["--rb-font-family"]).toBe('"Resume Gelasio", Georgia, serif');
  expect(style["--rb-name-size"]).toBe("24.8px");
  expect(style["--rb-section-size"]).toBe("16px");
  expect(style["--rb-subheading-size"]).toBe("15.2px");
  expect(style["--rb-body-size"]).toBe("16px");
  expect(style["--rb-contact-size"]).toBe("calc(var(--rb-body-size) * 0.82)");
  expect(style["--rb-organization-size"]).toBe("calc(var(--rb-subheading-size) * 0.9052631578947368)");
  expect(style["--rb-location-size"]).toBe("calc(var(--rb-subheading-size) * 0.9052631578947368)");
  expect(style["--rb-date-size"]).toBe("calc(var(--rb-subheading-size) * 0.8631578947368421)");
  expect(style["--rb-link-decoration"]).toBe("underline");
  for (const [key, role] of Object.entries({
    "--rb-weight-name": RESUME_TEXT_STYLES.name,
    "--rb-weight-heading": RESUME_TEXT_STYLES.heading,
    "--rb-weight-entry-title": RESUME_TEXT_STYLES.entryTitle,
    "--rb-weight-entry-subtitle": RESUME_TEXT_STYLES.entrySubtitle,
    "--rb-weight-date": RESUME_TEXT_STYLES.date,
    "--rb-weight-body": RESUME_TEXT_STYLES.body,
    "--rb-weight-label": RESUME_TEXT_STYLES.label,
    "--rb-weight-publication-author": RESUME_TEXT_STYLES.publicationAuthor,
    "--rb-weight-table-header": RESUME_TEXT_STYLES.tableHeader,
    "--rb-weight-table-row-header": RESUME_TEXT_STYLES.tableRowHeader,
  })) expect(style[key as keyof typeof style]).toBe(String(role.weight));
  expect(DEFAULT_TYPOGRAPHY.namePt * 1.333).toBeCloseTo(24.8, 8);
  expect(DEFAULT_TYPOGRAPHY.sectionHeadingPt * 1.333).toBeCloseTo(16, 8);
  expect(DEFAULT_TYPOGRAPHY.subheadingPt * 1.333).toBeCloseTo(15.2, 8);
  expect(DEFAULT_TYPOGRAPHY.bodyPt * 1.333).toBeCloseTo(16, 8);
  expect(Math.round(DEFAULT_TYPOGRAPHY.namePt * 2) / 2).toBe(18.5);
  expect(Math.round(DEFAULT_TYPOGRAPHY.sectionHeadingPt * 2) / 2).toBe(12);
  expect(Math.round(DEFAULT_TYPOGRAPHY.subheadingPt * 2) / 2).toBe(11.5);
  expect(Math.round(DEFAULT_TYPOGRAPHY.bodyPt * 2) / 2).toBe(12);
  expect(resumeBuilderCss).toContain("font-size: var(--rb-name-size)");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-section-size)");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-subheading-size)");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-body-size)");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-contact-size) !important");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-organization-size) !important");
  expect(resumeBuilderCss).toContain("font-size: var(--rb-date-size) !important");
  expect(resumeBuilderCss.slice(resumeBuilderCss.indexOf("@media print"))).not.toMatch(/font-size:\s*[\d.]+(?:px|rem|pt)/);
});

it("renders every shared text role at its PDF weight in all resume formats", async () => {
  const styleElement = document.createElement("style");
  styleElement.textContent = resumeBuilderCss;
  document.head.append(styleElement);
  const paper = document.createElement("div");
  paper.className = "rb-paper";
  for (const [property, value] of Object.entries(getPaperStyle(DEFAULT_TYPOGRAPHY))) {
    paper.style.setProperty(property, String(value));
  }
  paper.innerHTML = `<h1 class="rb-name">Name</h1><h2>Section heading</h2><h3>Entry title</h3><div class="rb-entry-subheading">Entry subtitle</div><span class="rb-entry-dates">Date</span><p class="rb-test-body">Body</p><p><strong class="rb-role-label">Label</strong></p><p><strong class="rb-publication-author">Author</strong></p><h3 class="rb-publication-group">Publication group</h3><table class="rb-language-table"><thead><tr><th>Column</th></tr></thead><tbody><tr><th>Row</th></tr></tbody></table>`;
  document.body.append(paper);
  try {
    const roles: Array<[string, number]> = [
      [".rb-name", RESUME_TEXT_STYLES.name.weight],
      ["h2", RESUME_TEXT_STYLES.heading.weight],
      ["h3:not(.rb-publication-group)", RESUME_TEXT_STYLES.entryTitle.weight],
      [".rb-entry-subheading", RESUME_TEXT_STYLES.entrySubtitle.weight],
      [".rb-entry-dates", RESUME_TEXT_STYLES.date.weight],
      [".rb-test-body", RESUME_TEXT_STYLES.body.weight],
      [".rb-role-label", RESUME_TEXT_STYLES.label.weight],
      [".rb-publication-author", RESUME_TEXT_STYLES.publicationAuthor.weight],
      [".rb-language-table thead th", RESUME_TEXT_STYLES.tableHeader.weight],
      [".rb-language-table tbody th", RESUME_TEXT_STYLES.tableRowHeader.weight],
      [".rb-publication-group", RESUME_TEXT_STYLES.publicationGroup.weight],
    ];
    for (const [selector, weight] of roles) {
      expect(getComputedStyle(paper.querySelector(selector)!).fontWeight, selector).toBe(String(weight));
    }

    for (const font of TYPOGRAPHY_FONTS) {
      const family = font.stack.split(",")[0];
      const loaded = await document.fonts.load(`700 12px ${family}`);
      expect(loaded.length, family).toBeGreaterThan(0);
      expect(document.fonts.check(`700 12px ${family}`), family).toBe(true);
    }

    for (const [mode, europeanStandard] of [["job", false], ["study", false], ["job", true], ["study", true]] as const) {
      const resume = { ...createSampleResume(), mode, europeanStandard };
      const markup = renderToStaticMarkup(createElement("div", null,
        ...createResumeBlocks(resume, createResumeContactItems(resume)).map((block) => block.content),
      ));
      const doc = new DOMParser().parseFromString(markup, "text/html");
      expect(doc.querySelector("h2")).not.toBeNull();
      expect(doc.querySelector("h2")?.tagName).toBe("H2");
    }
  } finally {
    paper.remove();
    styleElement.remove();
  }
});

it("applies every system font choice and validates persisted typography safely", () => {
  expect(TYPOGRAPHY_FONTS.map(({ id }) => id)).toEqual([
    "default", "times-new-roman", "georgia", "cambria", "arial", "calibri",
  ]);
  const resume = createSampleResume();
  for (const font of TYPOGRAPHY_FONTS) {
    expect(getPaperStyle({ ...DEFAULT_TYPOGRAPHY, font: font.id })["--rb-font-family"]).toBe(font.stack);
  }
  const imported = validateResumeImport(JSON.parse(JSON.stringify(resume)));
  expect(imported.typography).toEqual(DEFAULT_TYPOGRAPHY);
  const changed = JSON.parse(JSON.stringify(resume));
  changed.typography = {
    font: "not-a-font",
    namePt: 100,
    sectionHeadingPt: 5,
    subheadingPt: 12.5,
    bodyPt: 20,
    underlineLinks: false,
    ignored: true,
  };
  const normalized = validateResumeImport(changed);
  expect(normalized.typography).toEqual({
    font: DEFAULT_TYPOGRAPHY.font,
    namePt: TYPOGRAPHY_RANGES.namePt.max,
    sectionHeadingPt: TYPOGRAPHY_RANGES.sectionHeadingPt.min,
    subheadingPt: 12.5,
    bodyPt: TYPOGRAPHY_RANGES.bodyPt.max,
    underlineLinks: false,
  });
  const invalidSize = JSON.parse(JSON.stringify(resume));
  invalidSize.typography.bodyPt = "large";
  expect(() => validateResumeImport(invalidSize)).toThrow("typography.bodyPt must be a number");
  expect(getPaperStyle({ ...DEFAULT_TYPOGRAPHY, underlineLinks: false })["--rb-link-decoration"]).toBe("none");
});

it("preserves typography across resume resets", () => {
  const changed = { ...DEFAULT_TYPOGRAPHY, bodyPt: 14, font: "arial" as const };
  expect(preserveTypography(createSampleResume(), changed).typography).toEqual(changed);
  expect(preserveTypography(createBlankResume(), changed).typography).toEqual(changed);
  const longResume = createSampleResume();
  longResume.sections.find((section) => section.type === "summary")!.summary = "A".repeat(7_000);
  expect(preserveTypography(clearSampleData(longResume), changed).typography).toEqual(changed);
  const restoredDefaults = validateResumeImport({
    ...longResume,
    typography: {
      ...changed,
      font: "invalid-font",
      ignored: "dropped",
    },
  });
  expect(restoredDefaults.typography.font).toBe(DEFAULT_TYPOGRAPHY.font);
});
