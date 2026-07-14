import { Router } from "express";
import multer from "multer";
import { degrees, PDFDocument } from "pdf-lib";
import { loadPdf, parsePageList, parseRotationValues, preservePdfMetadata, isPdfFile } from "./pdf-utils";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/organize-pdf", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const rawPageOrder = req.body.pageOrder;
  const rawRotations = req.body.rotations;

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const pageIndices = parsePageList(rawPageOrder, totalPages, "pageOrder", { allowDuplicates: true, required: true });
    const rotations = parseRotationValues(rawRotations, pageIndices.length);

    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page, idx) => {
      outPdf.addPage(page);
      const rotation = rotations[idx] ?? 0;
      if (rotation !== 0) {
        page.setRotation(degrees(rotation));
      }
    });

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=organized.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to organize PDF") });
  }
});

export default router;
