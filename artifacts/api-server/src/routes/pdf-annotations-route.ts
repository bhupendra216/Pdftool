import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { loadPdf, preservePdfMetadata, isPdfFile } from "./pdf-utils";
import { applyImageWatermarkToPdf, applyPageNumbersToPdf, applyWatermarkToPdf } from "./pdf-annotations";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/watermark-pdf", upload.fields([{ name: "files", maxCount: 1 }, { name: "logo", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req, res) => {
  const files = (req.files as { files?: Express.Multer.File[]; logo?: Express.Multer.File[]; file?: Express.Multer.File[] } | undefined) || {};
  const file = files.files?.[0] || files.file?.[0];
  const logoFile = files.logo?.[0];
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  const position = typeof req.body.position === "string" ? req.body.position.trim() : "bottom-right";

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, Array.from({ length: srcPdf.getPageCount() }, (_, index) => index));
    copiedPages.forEach((page) => outPdf.addPage(page));

    if (logoFile?.buffer?.length) {
      await applyImageWatermarkToPdf(outPdf, logoFile.buffer, position as any, 0.35);
    } else if (text) {
      await applyWatermarkToPdf(outPdf, text, position as any);
    }

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=watermarked.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to watermark PDF") });
  }
});

router.post("/add-page-numbers", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const startNumber = Number(req.body.startNumber ?? 1);
  const position = String(req.body.position || "bottom-right").trim();

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, Array.from({ length: srcPdf.getPageCount() }, (_, index) => index));
    copiedPages.forEach((page) => outPdf.addPage(page));

    await applyPageNumbersToPdf(outPdf, Number.isFinite(startNumber) ? startNumber : 1, position as any);

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=numbered.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to add page numbers") });
  }
});

export default router;
