import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

function parsePageRange(pageRange: string, totalPages: number): number[] {
  if (!pageRange || pageRange.trim() === "") throw new Error("Empty input");
  const parts = pageRange.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) throw new Error("Empty input");

  const indices: number[] = [];
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const a = parseInt(rangeMatch[1], 10);
      const b = parseInt(rangeMatch[2], 10);
      if (isNaN(a) || isNaN(b)) throw new Error("Invalid syntax");
      if (a < 1) throw new Error("Page numbers must be >= 1");
      if (b < a) throw new Error("Range start must be <= range end");
      if (b > totalPages) throw new Error("Page number exceeds total pages");
      for (let i = a; i <= b; i++) indices.push(i - 1);
      continue;
    }

    const numMatch = part.match(/^(\d+)$/);
    if (numMatch) {
      const n = parseInt(numMatch[1], 10);
      if (isNaN(n)) throw new Error("Invalid syntax");
      if (n < 1) throw new Error("Page numbers must be >= 1");
      if (n > totalPages) throw new Error("Page number exceeds total pages");
      indices.push(n - 1);
      continue;
    }

    throw new Error("Invalid syntax");
  }

  return indices;
}

router.post(
  "/split-pdf",
  upload.array("files"),
  async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const pageRange = (req.body && req.body.pageRange) || "";

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    try {
      const file = files[0];
      const src = await PDFDocument.load(file.buffer);
      const total = src.getPageCount();
      const indices = parsePageRange(String(pageRange), total);

      const outPdf = await PDFDocument.create();
      const copied = await outPdf.copyPages(src, indices);
      copied.forEach((p) => outPdf.addPage(p));

      const outBytes = await outPdf.save();

      res.setHeader("content-type", "application/pdf");
      res.setHeader("content-disposition", "attachment; filename=split.pdf");
      res.send(Buffer.from(outBytes));
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Failed to split PDF" });
    }
  },
);

export default router;
