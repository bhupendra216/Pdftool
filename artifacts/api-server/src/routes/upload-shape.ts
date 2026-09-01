import type { Request } from "express";

export type UploadedFile = Express.Multer.File;

export function getUploadedFiles(req: Pick<Request, "files">): UploadedFile[] {
  const files = req.files;

  if (Array.isArray(files)) {
    return files;
  }

  if (files && typeof files === "object") {
    return Object.values(files).flatMap((value) => {
      if (Array.isArray(value)) {
        return value as UploadedFile[];
      }
      return value ? [value as UploadedFile] : [];
    });
  }

  return [];
}

export function getSingleUploadedFile(req: Pick<Request, "file" | "files">): UploadedFile | undefined {
  if (req.file) {
    return req.file;
  }

  const files = getUploadedFiles(req);
  return files[0];
}
