import { Router } from "express";
import multer from "multer";
import sharp, { type Sharp } from "sharp";
import heicConvert from "heic-convert";
import potrace from "potrace";
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
  "image/svg+xml",
  // don't include heic here; detect by extension or explicit mimetype
]);

const isHeicFile = (file: Express.Multer.File) => {
  const name = (file.originalname || "").toLowerCase();
  const mt = (file.mimetype || "").toLowerCase();
  return name.endsWith(".heic") || name.endsWith(".heif") || mt === "image/heic" || mt === "image/heif";
};

const decodeHeicToPng = async (buffer: Buffer) => {
  // heic-convert expects { buffer, format }
  const out = await heicConvert({ buffer, format: "PNG" });
  return Buffer.from(out);
};

const isSvgFile = (file: Express.Multer.File) => {
  const name = (file.originalname || "").toLowerCase();
  const mt = (file.mimetype || "").toLowerCase();
  return name.endsWith(".svg") || name.endsWith(".svgz") || mt === "image/svg+xml" || mt === "image/svg";
};

const OUTPUT_FORMATS = new Set(["png", "jpg", "jpeg", "webp", "bmp", "tiff", "gif", "svg"]);

function extForFormat(format: string) {
  if (format === "jpg" || format === "jpeg") return "jpg";
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  if (format === "bmp") return "bmp";
  if (format === "tiff" || format === "tif") return "tiff";
  if (format === "gif") return "gif";
  if (format === "svg") return "svg";
  return format;
}

const traceSvg = (buffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    potrace.trace(buffer, { threshold: 128 }, (err, svg) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(svg);
    });
  });
};

router.post("/convert-image", upload.array("files"), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const outFormatRaw = (req.body && req.body.outputFormat) || "png";
  const outFormat = String(outFormatRaw).toLowerCase();
  const svgModeRaw = req.body && req.body.svgMode;
  const svgMode = typeof svgModeRaw === "string" ? svgModeRaw.toLowerCase() : "embed";

  if (!files || files.length === 0) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const normalizedOutFormat = outFormat === "tif" ? "tiff" : outFormat;

  if (!OUTPUT_FORMATS.has(normalizedOutFormat)) {
    res.status(400).json({ error: "Unsupported output format" });
    return;
  }

  let file = files[0];

  if (isHeicFile(file)) {
    try {
      const pngBuffer = await decodeHeicToPng(file.buffer);
      // replace file buffer and mimetype/name for downstream processing
      file = { ...file, buffer: pngBuffer, mimetype: "image/png", originalname: file.originalname.replace(/\.(heic|heif)$/i, ".png") } as Express.Multer.File;
    } catch (err) {
      console.error("HEIC decode failed", err);
      res.status(500).json({ error: "Unable to decode HEIC image" });
      return;
    }
  }

  if (!INPUT_MIMES.has((file.mimetype || "").toLowerCase()) && !isSvgFile(file)) {
    res.status(400).json({ error: "Unsupported image type" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    let resolvedFormat = normalizedOutFormat;
    let transformed: Sharp = image;

    if (resolvedFormat === "png") {
      transformed = image.png({ quality: 100 });
    } else if (resolvedFormat === "webp") {
      transformed = image.webp({ quality: 90 });
    } else if (resolvedFormat === "jpg" || resolvedFormat === "jpeg") {
      transformed = image.jpeg({ quality: 90 });
    } else if (resolvedFormat === "bmp") {
      transformed = image.bmp();
    } else if (resolvedFormat === "tiff") {
      transformed = image.tiff();
    } else if (resolvedFormat === "gif") {
      transformed = image.gif();
    }

    const metadata = await image.metadata();
    let outBuffer: Buffer;
    let contentType = "image/png";
    let outExt = extForFormat(resolvedFormat);

    if (resolvedFormat === "svg") {
      const rasterBuffer = await image.png({ quality: 100 }).toBuffer();
      const width = Math.max(1, metadata.width || 1);
      const height = Math.max(1, metadata.height || 1);
      const encoded = rasterBuffer.toString("base64");

      if (svgMode === "trace") {
        const traced = await traceSvg(rasterBuffer);
        outBuffer = Buffer.from(traced);
      } else {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:image/png;base64,${encoded}"/></svg>`;
        outBuffer = Buffer.from(svg);
      }

      contentType = "image/svg+xml";
      outExt = "svg";
    } else {
      outBuffer = await transformed.toBuffer();
      if (resolvedFormat === "jpg" || resolvedFormat === "jpeg") {
        contentType = "image/jpeg";
      } else if (resolvedFormat === "bmp") {
        contentType = "image/bmp";
      } else if (resolvedFormat === "tiff") {
        contentType = "image/tiff";
      } else if (resolvedFormat === "gif") {
        contentType = "image/gif";
      } else {
        contentType = `image/${resolvedFormat}`;
      }
    }

    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outName = `${base}.${outExt}`;

    res.setHeader("content-type", contentType);
    res.setHeader("content-disposition", `attachment; filename=${outName}`);
    res.send(outBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Conversion failed";
    console.error("Image conversion failed", err);
    res.status(500).json({ error: message });
  }
});

router.post("/image-resize", upload.single("files"), async (req, res) => {
  const width = parseInt(String(req.body.width || ""), 10);
  const height = parseInt(String(req.body.height || ""), 10);

  let file = req.file as Express.Multer.File | undefined;
  let wasHeic = false;

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (isHeicFile(file)) {
    wasHeic = true;
    try {
      const pngBuffer = await decodeHeicToPng(file.buffer);
      file = { ...file, buffer: pngBuffer, mimetype: "image/png", originalname: file.originalname.replace(/\.(heic|heif)$/i, ".png") } as Express.Multer.File;
    } catch (err) {
      console.error('HEIC decode failed', err);
      res.status(500).json({ error: 'Unable to decode HEIC image' });
      return;
    }
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
    const resizeOptions: Parameters<Sharp["resize"]>[0] = {
      fit: "inside",
      withoutEnlargement: true,
    };
    if (!isNaN(width)) resizeOptions.width = width;
    if (!isNaN(height)) resizeOptions.height = height;

    const outBuffer = await image.resize(resizeOptions).toBuffer();

    const base = path.basename(file.originalname, path.extname(file.originalname));
    const outputExt = path.extname(file.originalname) || '.png';
    const outputName = `${base}-resized${outputExt}`;
    res.setHeader("content-type", file.mimetype);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Resize failed";
    console.error("Image resize failed", err);
    res.status(500).json({ error: message });
  }
});

router.post("/image-compress", upload.single("files"), async (req, res) => {
  const quality = Math.min(100, Math.max(1, Number(req.body.quality ?? 80)));

  let file = req.file as Express.Multer.File | undefined;
  let wasHeic = false;

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (isHeicFile(file)) {
    wasHeic = true;
    try {
      const pngBuffer = await decodeHeicToPng(file.buffer);
      file = { ...file, buffer: pngBuffer, mimetype: "image/png", originalname: file.originalname.replace(/\.(heic|heif)$/i, ".png") } as Express.Multer.File;
    } catch (err) {
      console.error('HEIC decode failed', err);
      res.status(500).json({ error: 'Unable to decode HEIC image' });
      return;
    }
  }

  if (!INPUT_MIMES.has(file.mimetype)) {
    res.status(400).json({ error: "Unsupported image type" });
    return;
  }

  try {
    const image = sharp(file.buffer, { failOnError: true, limitInputPixels: false });
    let mime = file.mimetype.toLowerCase();
    // For original HEIC inputs, prefer to compress to JPEG for better size
    if (wasHeic) mime = 'image/jpeg';
    let transformed: Sharp = image;

    if (mime === "image/png") {
      transformed = image.png({ compressionLevel: Math.round((100 - quality) / 10), adaptiveFiltering: true });
    } else if (mime === "image/webp") {
      transformed = image.webp({ quality });
    } else if (mime === "image/jpeg" || mime === "image/jpg") {
      transformed = image.jpeg({ quality });
    } else if (mime === "image/bmp") {
      transformed = image.png();
    } else if (mime === "image/tiff" || mime === "image/tif") {
      transformed = image.tiff({ quality });
    } else {
      transformed = image;
    }

    const outBuffer = await transformed.toBuffer();
    const base = path.basename(file.originalname, path.extname(file.originalname));
    const ext = mime === 'image/jpeg' ? '.jpg' : path.extname(file.originalname);
    const outputName = `${base}-compressed${ext}`;

    res.setHeader("content-type", mime);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Compression failed";
    console.error("Image compression failed", err);
    res.status(500).json({ error: message });
  }
});

router.post("/image-upscale", upload.single("files"), async (req, res) => {
  const scale = Math.max(1, Number(req.body.scale ?? 2));
  const width = parseInt(String(req.body.width || ""), 10);
  const height = parseInt(String(req.body.height || ""), 10);

  let file = req.file as Express.Multer.File | undefined;
  let wasHeic = false;

  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return;
  }

  if (isHeicFile(file)) {
    wasHeic = true;
    try {
      const pngBuffer = await decodeHeicToPng(file.buffer);
      file = { ...file, buffer: pngBuffer, mimetype: "image/png", originalname: file.originalname.replace(/\.(heic|heif)$/i, ".png") } as Express.Multer.File;
    } catch (err) {
      console.error('HEIC decode failed', err);
      res.status(500).json({ error: 'Unable to decode HEIC image' });
      return;
    }
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
    const ext = wasHeic ? '.png' : path.extname(file.originalname);
    const outputName = `${base}-upscaled${ext}`;

    res.setHeader("content-type", file.mimetype);
    res.setHeader("content-disposition", `attachment; filename=${outputName}`);
    res.send(outBuffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upscale failed";
    console.error("Image upscale failed", err);
    res.status(500).json({ error: message });
  }
});

export default router;
