import { Router } from "express";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import { loadPdf, parsePageList, preservePdfMetadata, isPdfFile } from "./pdf-utils";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
});
const router = Router();

router.post("/delete-pages", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const rawPagesToDelete = req.body.pages || req.body.pagesToDelete;

  if (req.fileValidationError) {
    res.status(413).json({ error: req.fileValidationError });
    return;
  }

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const deleteIndices = parsePageList(rawPagesToDelete, totalPages, "pagesToDelete", { allowDuplicates: true, required: true });

    const uniqueDeleteIndices = new Set(deleteIndices);
    if (uniqueDeleteIndices.size === 0) {
      throw new Error("At least one page must be selected for deletion.");
    }

    if (uniqueDeleteIndices.size >= totalPages) {
      throw new Error("Cannot delete all pages from the PDF.");
    }

    const keepIndices: number[] = [];
    for (let index = 0; index < totalPages; index += 1) {
      if (!uniqueDeleteIndices.has(index)) {
        keepIndices.push(index);
      }
    }

    const outPdf = await PDFDocument.create();
    preservePdfMetadata(srcPdf, outPdf);

    const copiedPages = await outPdf.copyPages(srcPdf, keepIndices);
    copiedPages.forEach((page) => outPdf.addPage(page));

    const outBytes = await outPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=deleted-pages.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to delete pages") });
  }
});

export default router;
