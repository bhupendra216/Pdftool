import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { loadPdf, parsePageList, preservePdfMetadata, isPdfFile } from "./pdf-utils";
import { getSingleUploadedFile } from "./upload-shape";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/extract-pages", upload.single("files"), async (req, res) => {
  const file = getSingleUploadedFile(req);
  const rawPages = req.body.pages;

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const pageIndices = parsePageList(rawPages, totalPages, "pages", { allowDuplicates: true, required: true });

    if (pageIndices.length === 0) {
      throw new Error("At least one page must be selected for extraction.");
    }

    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page) => outPdf.addPage(page));

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=extracted-pages.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to extract pages") });
  }
});

export default router;
