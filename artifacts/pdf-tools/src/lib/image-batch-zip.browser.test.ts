import JSZip from "jszip";
import { expect, it } from "vitest";
import { createImageBatchZip, makeUniqueFilename } from "./image-batch-zip";

async function loadArchive(entries: Array<{ fileName: string; content: string }>) {
  const result = await createImageBatchZip(entries.map(({ fileName, content }) => ({
    fileName,
    blob: new Blob([content]),
  })));
  const archive = await JSZip.loadAsync(result.blob);
  return { ...result, archive };
}

it("keeps all converted entries, names duplicate outputs uniquely, and preserves upload order", async () => {
  const { archive, fileNames, entryCount } = await loadArchive([
    { fileName: "photo.png", content: "photo-jpg-pixels" },
    { fileName: "image.png", content: "webp-pixels" },
    { fileName: "image.png", content: "bmp-pixels" },
  ]);
  expect(fileNames).toEqual(["photo.png", "image.png", "image-2.png"]);
  expect(entryCount).toBe(3);
  expect(Object.keys(archive.files)).toEqual(fileNames);
  expect(await archive.file("photo.png")!.async("string")).toBe("photo-jpg-pixels");
  expect(await archive.file("image.png")!.async("string")).toBe("webp-pixels");
  expect(await archive.file("image-2.png")!.async("string")).toBe("bmp-pixels");
});

it("numbers repeated names from different folders in the input order", async () => {
  const { fileNames } = await loadArchive([
    { fileName: "image.png", content: "first" },
    { fileName: "image.png", content: "second" },
    { fileName: "image.png", content: "third" },
  ]);
  expect(fileNames).toEqual(["image.png", "image-2.png", "image-3.png"]);
});

it("treats case-only filename differences as collisions", async () => {
  const { fileNames } = await loadArchive([
    { fileName: "Photo.png", content: "upper" },
    { fileName: "photo.png", content: "lower" },
  ]);
  expect(fileNames).toEqual(["Photo.png", "photo-2.png"]);
});

it("keeps checking generated suffixes against later input filenames", async () => {
  const { fileNames } = await loadArchive([
    { fileName: "image.png", content: "first" },
    { fileName: "image.png", content: "second" },
    { fileName: "image-2.png", content: "third" },
  ]);
  expect(fileNames).toEqual(["image.png", "image-2.png", "image-2-2.png"]);
});

it("strips directory traversal and separators so entries stay at the ZIP root", async () => {
  const { archive, fileNames } = await loadArchive([
    { fileName: "../photo.png", content: "parent" },
    { fileName: "folder\\photo.png", content: "nested" },
    { fileName: "/../../", content: "empty" },
  ]);
  expect(fileNames).toEqual(["photo.png", "photo-2.png", "image"]);
  expect(Object.keys(archive.files).every((name) => !name.includes("/") && !name.includes("\\"))).toBe(true);
});

it("preserves the original filename when there is no collision", () => {
  expect(makeUniqueFilename("photo.png", new Set())).toBe("photo.png");
});
