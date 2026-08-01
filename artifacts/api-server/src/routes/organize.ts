import { Router } from "express";
import multer from "multer";
import { degrees, PDFDocument } from "pdf-lib";
import { buildDefaultPageOrder, loadPdf, parsePageList, parseRotationValues, parseSingleRotationValue, preservePdfMetadata, isPdfFile } from "./pdf-utils";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

async function rotatePdfPages(file: Express.Multer.File, rawRotation: unknown) {
  const srcPdf = await loadPdf(file.buffer);
  const outPdf = await PDFDocument.create();
  preservePdfMetadata(srcPdf, outPdf);

  const totalPages = srcPdf.getPageCount();
  const rotation = parseSingleRotationValue(rawRotation);
  const pageIndices = buildDefaultPageOrder(totalPages).map((pageNumber) => pageNumber - 1);
  const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);

  copiedPages.forEach((page) => {
    if (rotation !== 0) {
      page.setRotation(degrees(rotation));
    }
    outPdf.addPage(page);
  });

  const outBytes = await outPdf.save();
  return Buffer.from(outBytes);
}

router.post("/organize-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const rawPageOrder = req.body?.pageOrder ?? req.body?.pageorder;
  const rawRotations = req.body?.rotations ?? req.body?.pageRotations;

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const totalPages = srcPdf.getPageCount();

    const hasExplicitPageOrder = rawPageOrder != null && String(rawPageOrder).trim() !== "";
    const pageIndices = hasExplicitPageOrder
      ? parsePageList(rawPageOrder, totalPages, "pageOrder", { allowDuplicates: true, required: true })
      : buildDefaultPageOrder(totalPages).map((pageNumber) => pageNumber - 1);

    const rotations = parseRotationValues(rawRotations, pageIndices.length);

    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page, idx) => {
      const rotation = rotations[idx] ?? 0;
      if (rotation !== 0) {
        page.setRotation(degrees(rotation));
      }
      outPdf.addPage(page);
    });

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=organized.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to organize PDF") });
  }
});

router.post("/rotate-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const rawRotation = req.body?.rotation ?? req.body?.rotations ?? req.body?.pageRotations;

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const outBytes = await rotatePdfPages(file, rawRotation);
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=rotated.pdf");
    res.send(outBytes);
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to rotate PDF") });
  }
});

export default router;
