import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { parsePageRanges } from "@workspace/pdf-pages";
import { getUploadedFiles } from "./upload-shape";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post(
  "/split-pdf",
  upload.array("files"),
  async (req, res) => {
    const files = getUploadedFiles(req);
    const pageRange = (req.body && req.body.pageRange) || "";

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    try {
      const file = files[0];
      const src = await PDFDocument.load(file.buffer);
      const total = src.getPageCount();
      const indices = parsePageRanges(String(pageRange), total);

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
