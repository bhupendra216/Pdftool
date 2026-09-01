import assert from "node:assert/strict";
import { getSingleUploadedFile, getUploadedFiles } from "../src/routes/upload-shape.ts";

const arrayFiles = [
  { fieldname: "files", originalname: "a.pdf", buffer: Buffer.from("A") },
  { fieldname: "files", originalname: "b.pdf", buffer: Buffer.from("B") },
] as any;

const fieldFiles = {
  files: [
    { fieldname: "files", originalname: "c.pdf", buffer: Buffer.from("C") },
  ],
} as any;

assert.deepEqual(getUploadedFiles({ files: arrayFiles } as any), arrayFiles);
assert.deepEqual(getUploadedFiles({ files: fieldFiles } as any), fieldFiles.files);
assert.equal(getSingleUploadedFile({ files: fieldFiles } as any)?.originalname, "c.pdf");
assert.equal(getSingleUploadedFile({ file: arrayFiles[0] } as any)?.originalname, "a.pdf");

console.log("upload-shape tests passed");
