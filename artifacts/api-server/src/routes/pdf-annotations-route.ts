import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { loadPdf, preservePdfMetadata, isPdfFile } from "./pdf-utils";
import {
  applyImageWatermarkToPdf,
  applyPageNumbersToPdf,
  applyWatermarkToPdf,
  type WatermarkPosition,
} from "./pdf-annotations";
import { getSingleUploadedFile } from "./upload-shape";
import { assertSamePdfPageCount, getPdfPageCount, PdfValidationError } from "../lib/pdf-validation";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const watermarkPositions = new Set([
  "top-left", "top-center", "top-right",
  "center-left", "center", "center-right",
  "bottom-left", "bottom-center", "bottom-right",
]);
const isWatermarkPosition = (value: string): value is WatermarkPosition => watermarkPositions.has(value);

router.post("/watermark-pdf", upload.fields([{ name: "files", maxCount: 1 }, { name: "logo", maxCount: 1 }, { name: "file", maxCount: 1 }]), async (req, res) => {
  const fieldFiles = (req.files as Record<string, Express.Multer.File[] | undefined> | undefined) || {};
  const file = fieldFiles.files?.[0] || fieldFiles.file?.[0] || getSingleUploadedFile(req);
  const logoFile = fieldFiles.logo?.[0];
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  const position = typeof req.body.position === "string" ? req.body.position.trim() : "bottom-right";
  const rotation = Number(req.body.rotation ?? -30);
  const fontSize = Number(req.body.fontSize ?? 24);
  const opacity = Number(req.body.opacity ?? 0.12);

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }
  if (!logoFile?.buffer?.length && !text) {
    res.status(400).json({ error: "Enter the watermark text." });
    return;
  }
  if (text.length > 100) {
    res.status(400).json({ error: "Watermark text must be 100 characters or fewer." });
    return;
  }
  if (!isWatermarkPosition(position)) {
    res.status(400).json({ error: "Choose a valid watermark position." });
    return;
  }

  try {
    const inputPageCount = await getPdfPageCount(file.buffer);
    const srcPdf = await loadPdf(file.buffer);
    if (srcPdf.getPageCount() !== inputPageCount) {
      throw new Error("PDF page count could not be verified.");
    }
    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, Array.from({ length: srcPdf.getPageCount() }, (_, index) => index));
    copiedPages.forEach((page) => outPdf.addPage(page));

    if (logoFile?.buffer?.length) {
      await applyImageWatermarkToPdf(outPdf, logoFile.buffer, position, 0.35);
    } else {
      await applyWatermarkToPdf(outPdf, text, position, fontSize, undefined, opacity, rotation);
    }

    const outBytes = await outPdf.save();
    const outputBuffer = Buffer.from(outBytes);
    await assertSamePdfPageCount(file.buffer, outputBuffer);
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=watermarked.pdf");
    res.send(outputBuffer);
  } catch (error) {
    console.error("PDF watermark failed", error);
    const message = error instanceof Error ? error.message : "";
    const isPageMismatch = message.includes("page count");
    const isWatermarkValidationError = error instanceof Error && error.name === "WatermarkValidationError";
    const isPdfInputError = error instanceof PdfValidationError;
    const status = isWatermarkValidationError || isPdfInputError ? 400 : 500;
    res.status(isPageMismatch ? 500 : status).json({
      error: isPageMismatch
        ? "PDF watermarking changed the page count. No output was returned."
        : isWatermarkValidationError
          ? message
          : isPdfInputError
            ? "The uploaded PDF could not be watermarked."
            : "Could not apply the watermark. Please try again.",
    });
  }
});

router.post("/add-page-numbers", upload.single("files"), async (req, res) => {
  const file = getSingleUploadedFile(req);
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
