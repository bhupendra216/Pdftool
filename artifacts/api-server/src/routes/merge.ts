import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post(
  "/merge-pdf",
  upload.array("files"),
  async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const sourcePdf = await PDFDocument.load(file.buffer);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();

      res.setHeader("content-type", "application/pdf");
      res.setHeader(
        "content-disposition",
        "attachment; filename=merged.pdf",
      );
      res.send(Buffer.from(mergedBytes));
    } catch (error) {
      res.status(500).json({ error: "Failed to merge PDFs" });
    }
  },
);

export default router;
