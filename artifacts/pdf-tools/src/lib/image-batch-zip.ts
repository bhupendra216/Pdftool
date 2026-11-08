import JSZip from "jszip";

export type ImageBatchZipEntry = {
  fileName: string;
  blob: Blob;
};

function sanitizeFilename(name: string) {
  const basename = name.replace(/\\/gu, "/").split("/").at(-1) ?? "";
  const cleaned = basename
    .replace(/[\u0000-\u001f\u007f-\u009f]/gu, "")
    .replace(/\.\.+/gu, "")
    .replace(/[\\/]/gu, "")
    .trim()
    .replace(/^\.+|\.+$/gu, "");
  const lastDot = cleaned.lastIndexOf(".");
  const extension = lastDot > 0 ? cleaned.slice(lastDot) : "";
  const rawStem = lastDot > 0 ? cleaned.slice(0, lastDot) : cleaned;
  const stem = rawStem.trim().replace(/[. ]+$/gu, "") || "image";
  const safeExtension = extension.replace(/[^.a-zA-Z0-9_-]/gu, "").slice(0, 20);
  const maxStemLength = Math.max(1, 180 - safeExtension.length);
  return `${stem.slice(0, maxStemLength)}${safeExtension}`;
}

export function makeUniqueFilename(name: string, usedNames: Set<string>) {
  const sanitized = sanitizeFilename(name);
  const dot = sanitized.lastIndexOf(".");
  const stem = dot > 0 ? sanitized.slice(0, dot) : sanitized;
  const extension = dot > 0 ? sanitized.slice(dot) : "";
  let candidate = sanitized;
  let suffix = 2;
  while (usedNames.has(candidate.toLocaleLowerCase("en-US"))) {
    const suffixText = `-${suffix}`;
    candidate = `${stem.slice(0, Math.max(1, 180 - extension.length - suffixText.length))}${suffixText}${extension}`;
    suffix += 1;
  }
  usedNames.add(candidate.toLocaleLowerCase("en-US"));
  return candidate;
}

export async function createImageBatchZip(entries: ImageBatchZipEntry[]) {
  const zip = new JSZip();
  const usedNames = new Set<string>();
  const fileNames = entries.map(({ fileName }) => makeUniqueFilename(fileName, usedNames));
  entries.forEach((entry, index) => {
    zip.file(fileNames[index]!, entry.blob);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const builtZip = await JSZip.loadAsync(blob);
  const archiveEntries = Object.values(builtZip.files).filter((entry) => !entry.dir);
  if (
    archiveEntries.length !== entries.length ||
    new Set(archiveEntries.map((entry) => entry.name.toLocaleLowerCase("en-US"))).size !== entries.length
  ) {
    throw new Error("Could not package every converted image. Please try again.");
  }

  return {
    blob,
    fileNames,
    entryCount: archiveEntries.length,
  };
}
