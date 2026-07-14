import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB limit
const router = Router();

const INPUT_MIMES = new Set([
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/tif",
  "image/gif",
]);

const OUTPUT_FORMATS = new Set(["png", "jpg", "jpeg", "webp", "bmp"]);

function extForFormat(format: string) {
  if (format === "jpg" || format === "jpeg") return "jpg";
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  if (format === "bmp") return "bmp";
  return format;
}

router.post("/convert-image", upload.array("files"), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const outFormatRaw = (req.body && req.body.outputFormat) || "png";
  const outFormat = String(outFormatRaw).toLowerCase();

  if (!files || files.length === 0) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  if (!OUTPUT_FORMATS.has(outFormat)) {
    res.status(400).json({ error: "Unsupported output format" });
    return;
  }

  const file = files[0];

  if (!INPUT_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "Unsupported input file type" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    let transformed: any;
    if (outFormat === "png") {
      transformed = image.png({ quality: 100 });
    } else if (outFormat === "webp") {
      transformed = image.webp({ quality: 90 });
    } else if (outFormat === "jpg" || outFormat === "jpeg") {
      transformed = image.jpeg({ quality: 90 });
    } else if (outFormat === "bmp") {
      transformed = image.bmp();
    } else {
      transformed = image;
    }

    const outBuffer = await transformed.toBuffer();

    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outExt = extForFormat(outFormat);
    const outName = `${base}.${outExt}`;

    // Determine content-type
    const contentType = outFormat === "jpg" || outFormat === "jpeg" ? "image/jpeg" : `image/${outFormat}`;

    res.setHeader("content-type", contentType);
    res.setHeader("content-disposition", `attachment; filename=${outName}`);
    res.send(outBuffer);
  } catch (err: any) {
    console.error("Image conversion failed", err);
    res.status(500).json({ error: err.message || "Conversion failed" });
  }
});

router.post("/image-resize", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const width = parseInt(String(req.body.width || ""), 10);
  const height = parseInt(String(req.body.height || ""), 10);

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (!INPUT_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "Unsupported image type" });
    return;
  }

  if (isNaN(width) && isNaN(height)) {
    res.status(400).json({ error: "Width or height is required" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    const resizeOptions: any = {
      fit: "inside",
      withoutEnlargement: true,
    };
    if (!isNaN(width)) resizeOptions.width = width;
    if (!isNaN(height)) resizeOptions.height = height;

    const outBuffer = await image.resize(resizeOptions).toBuffer();

    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outputName = `${base}-resized${path.extname(file.originalname)}`;
    res.setHeader("content-type", file.mimetype);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: any) {
    console.error("Image resize failed", err);
    res.status(500).json({ error: err.message || "Resize failed" });
  }
});

router.post("/image-compress", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const quality = Math.min(100, Math.max(1, Number(req.body.quality ?? 80)));

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (!INPUT_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "Unsupported image type" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    const mime = file.mimetype.toLowerCase();
    let transformed: any = image;

    if (mime === "image/png") {
      transformed = image.png({ compressionLevel: Math.round((100 - quality) / 10), adaptiveFiltering: true });
    } else if (mime === "image/webp") {
      transformed = image.webp({ quality });
    } else if (mime === "image/jpeg" || mime === "image/jpg") {
      transformed = image.jpeg({ quality });
    } else if (mime === "image/bmp") {
      transformed = image.bmp();
    } else if (mime === "image/tiff" || mime === "image/tif") {
      transformed = image.tiff({ quality });
    } else {
      transformed = image;
    }

    const outBuffer = await transformed.toBuffer();
    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outputName = `${base}-compressed${path.extname(file.originalname)}`;

    res.setHeader("content-type", file.mimetype);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: any) {
    console.error("Image compression failed", err);
    res.status(500).json({ error: err.message || "Compression failed" });
  }
});

router.post("/image-upscale", upload.single("files"), async (req, res) => {
  const file = req.file as Express.Multer.File | undefined;
  const scale = Math.max(1, Number(req.body.scale ?? 2));
  const width = parseInt(String(req.body.width || ""), 10);
  const height = parseInt(String(req.body.height || ""), 10);

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (!INPUT_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "Unsupported image type" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    const metadata = await image.metadata();
    const targetWidth = !isNaN(width) ? width : Math.round((metadata.width || 0) * scale);
    const targetHeight = !isNaN(height) ? height : Math.round((metadata.height || 0) * scale);

    if (!targetWidth || !targetHeight) {
      res.status(400).json({ error: "Width or height is required for upscaling" });
      return;
    }

    const outBuffer = await image.resize({ width: targetWidth, height: targetHeight, fit: "inside", withoutEnlargement: false }).toBuffer();
    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outputName = `${base}-upscaled${path.extname(file.originalname)}`;

    res.setHeader("content-type", file.mimetype);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: any) {
    console.error("Image upscale failed", err);
    res.status(500).json({ error: err.message || "Upscale failed" });
  }
});

export default router;
