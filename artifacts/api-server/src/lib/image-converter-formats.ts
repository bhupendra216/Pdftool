import sharp from "sharp";
import potrace from "potrace";

export type ImageOutputFormat = "png" | "jpg" | "jpeg" | "webp" | "bmp" | "tiff" | "gif" | "svg";
export type SvgOutputMode = "embed" | "trace";

type ImageFormatDefinition = {
  extension: string;
  mimeType: string;
  encode: (input: Buffer, svgMode: SvgOutputMode) => Promise<Buffer>;
};

export const MAX_IMAGE_CONVERTER_PIXELS = 40_000_000;

function traceSvg(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, { threshold: 128 }, (error, svg) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(Buffer.from(svg ?? ""));
    });
  });
}

async function encodeBmp(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input, { failOn: "error", limitInputPixels: MAX_IMAGE_CONVERTER_PIXELS })
    .rotate()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (!width || !height || width * height > MAX_IMAGE_CONVERTER_PIXELS || channels !== 3) {
    throw new Error("Unsupported BMP dimensions.");
  }

  const rowStride = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowStride * height;
  const output = Buffer.alloc(54 + pixelDataSize);
  output.write("BM", 0, "ascii");
  output.writeUInt32LE(output.length, 2);
  output.writeUInt32LE(54, 10);
  output.writeUInt32LE(40, 14);
  output.writeInt32LE(width, 18);
  output.writeInt32LE(height, 22);
  output.writeUInt16LE(1, 26);
  output.writeUInt16LE(24, 28);
  output.writeUInt32LE(pixelDataSize, 34);
  output.writeInt32LE(2835, 38);
  output.writeInt32LE(2835, 42);

  for (let y = 0; y < height; y += 1) {
    const sourceRow = y * width * 3;
    const targetRow = 54 + (height - y - 1) * rowStride;
    for (let x = 0; x < width; x += 1) {
      const sourceIndex = sourceRow + x * 3;
      const targetIndex = targetRow + x * 3;
      output[targetIndex] = data[sourceIndex + 2];
      output[targetIndex + 1] = data[sourceIndex + 1];
      output[targetIndex + 2] = data[sourceIndex];
    }
  }
  return output;
}

const sharpBuffer = (
  format: "png" | "jpeg" | "webp" | "tiff" | "gif",
  quality?: number,
) => async (input: Buffer) => {
  const image = sharp(input, {
    failOn: "error",
    limitInputPixels: MAX_IMAGE_CONVERTER_PIXELS,
    ...(format === "gif" ? { animated: true } : {}),
  });
  if (format === "png") return image.png({ quality: 100 }).toBuffer();
  if (format === "jpeg") return image.jpeg({ quality: quality ?? 90 }).toBuffer();
  if (format === "webp") return image.webp({ quality: quality ?? 90 }).toBuffer();
  if (format === "tiff") return image.tiff().toBuffer();
  return image.gif().toBuffer();
};

function encodeSvg(input: Buffer, svgMode: SvgOutputMode): Promise<Buffer> {
  return (async () => {
    const raster = await sharp(input, { failOn: "error", limitInputPixels: MAX_IMAGE_CONVERTER_PIXELS })
      .png({ quality: 100 })
      .toBuffer();
    if (svgMode === "trace") return traceSvg(raster);
    const metadata = await sharp(raster).metadata();
    const width = Math.max(1, metadata.width || 1);
    const height = Math.max(1, metadata.height || 1);
    const encoded = raster.toString("base64");
    return Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:image/png;base64,${encoded}"/></svg>`,
    );
  })();
}

export const IMAGE_OUTPUT_FORMATS: Record<ImageOutputFormat, ImageFormatDefinition> = {
  png: { extension: "png", mimeType: "image/png", encode: sharpBuffer("png") },
  jpg: { extension: "jpg", mimeType: "image/jpeg", encode: sharpBuffer("jpeg") },
  jpeg: { extension: "jpg", mimeType: "image/jpeg", encode: sharpBuffer("jpeg") },
  webp: { extension: "webp", mimeType: "image/webp", encode: sharpBuffer("webp") },
  bmp: { extension: "bmp", mimeType: "image/bmp", encode: encodeBmp },
  tiff: { extension: "tiff", mimeType: "image/tiff", encode: sharpBuffer("tiff") },
  gif: { extension: "gif", mimeType: "image/gif", encode: sharpBuffer("gif") },
  svg: { extension: "svg", mimeType: "image/svg+xml", encode: encodeSvg },
};

let supportedFormats: ImageOutputFormat[] = [];
let selfTest: Promise<void> | undefined;

export async function initializeImageConverterFormats(): Promise<void> {
  if (!selfTest) {
    selfTest = (async () => {
      console.info("Image converter Sharp runtime", {
        sharp: sharp.versions.sharp,
        vips: sharp.versions.vips,
        gifBufferOutput: sharp.format.gif.output.buffer,
      });
      let sample: Buffer;
      try {
        sample = await sharp({
          create: {
            width: 2,
            height: 2,
            channels: 4,
            background: { r: 25, g: 100, b: 200, alpha: 0.5 },
          },
        }).png().toBuffer();
      } catch (error) {
        console.error("Image converter self-test could not create its sample image", error);
        supportedFormats = [];
        return;
      }

      const formats = Object.keys(IMAGE_OUTPUT_FORMATS) as ImageOutputFormat[];
      supportedFormats = [];
      for (const format of formats) {
        try {
          const output = await IMAGE_OUTPUT_FORMATS[format].encode(sample, "embed");
          if (!output.length) throw new Error("Encoder returned an empty image.");
          if (format === "gif" && !output.subarray(0, 4).equals(Buffer.from("GIF8"))) {
            throw new Error("Encoder returned an invalid GIF.");
          }
          if (format === "bmp" && !output.subarray(0, 2).equals(Buffer.from("BM"))) {
            throw new Error("Encoder returned an invalid BMP.");
          }
          if (format === "bmp") {
            if (output.readUInt32LE(18) !== 2 || output.readInt32LE(22) !== 2) {
              throw new Error("Encoder returned invalid BMP dimensions.");
            }
          } else {
            const metadata = await sharp(output, { animated: format === "gif" }).metadata();
            if (metadata.width !== 2 || metadata.height !== 2) {
              throw new Error("Encoder returned invalid image dimensions.");
            }
          }
          supportedFormats.push(format);
          console.info(`Image converter format self-test passed: ${format}`);
        } catch (error) {
          console.error(`Image converter format self-test failed: ${format}`, error);
        }
      }
    })();
  }
  await selfTest;
}

export function getSupportedImageConverterFormats() {
  return supportedFormats.map((format) => ({
    format,
    extension: IMAGE_OUTPUT_FORMATS[format].extension,
    mimeType: IMAGE_OUTPUT_FORMATS[format].mimeType,
  }));
}

export function isImageOutputFormat(value: string): value is ImageOutputFormat {
  return value in IMAGE_OUTPUT_FORMATS;
}
