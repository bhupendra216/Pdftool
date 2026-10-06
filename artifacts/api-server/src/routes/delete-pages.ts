import { Router } from "express";
import multer from "multer";
import { removePdfPagesByIndex } from "@workspace/pdf-pages";
import { loadPdf, parsePageList, isPdfFile } from "./pdf-utils";
import { getSingleUploadedFile } from "./upload-shape";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/delete-pages", upload.single("files"), async (req, res) => {
  const file = getSingleUploadedFile(req);
  const rawPagesToDelete = req.body.pages || req.body.pagesToDelete;

  if (!isPdfFile(file)) {
    res.status(400).json({ error: "No PDF file uploaded" });
    return;
  }

  try {
    const srcPdf = await loadPdf(file.buffer);
    const totalPages = srcPdf.getPageCount();
    const deleteIndices = parsePageList(rawPagesToDelete, totalPages, "pagesToDelete", { allowDuplicates: true, required: true });

    removePdfPagesByIndex(srcPdf, deleteIndices);
    const outBytes = await srcPdf.save();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", "attachment; filename=deleted-pages.pdf");
    res.send(Buffer.from(outBytes));
  } catch (error: any) {
    res.status(400).json({ error: String(error?.message || "Failed to delete pages") });
  }
});

export default router;
