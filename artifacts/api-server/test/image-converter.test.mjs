import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { Jimp } from "jimp";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "image-converter-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");
let server;
let baseUrl;
let jpeg;
let png;
let webp;
let tiff;
let animatedWebp;

before(async () => {
  const image = sharp({
    create: {
      width: 7,
      height: 5,
      channels: 4,
      background: { r: 220, g: 40, b: 90, alpha: 0.4 },
    },
  });
  [jpeg, png, webp, tiff] = await Promise.all([
    image.clone().jpeg().toBuffer(),
    image.clone().png().toBuffer(),
    image.clone().webp().toBuffer(),
    image.clone().tiff().toBuffer(),
  ]);
  const frames = Buffer.alloc(4 * 10 * 4);
  for (let y = 0; y < 10; y += 1) {
    for (let x = 0; x < 4; x += 1) {
      const offset = (y * 4 + x) * 4;
      frames[offset] = y < 5 ? 255 : 0;
      frames[offset + 1] = y < 5 ? 0 : 255;
      frames[offset + 2] = 30;
      frames[offset + 3] = 255;
    }
  }
  animatedWebp = await sharp(frames, {
    raw: { width: 4, height: 10, channels: 4, pageHeight: 5 },
  }).webp({ lossless: true, loop: 0, delay: [100, 100] }).toBuffer();

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await rm(testDataDir, { recursive: true, force: true });
});

async function postImage(buffer, filename, outputFormat, contentType = "application/octet-stream") {
  const formData = new FormData();
  formData.append("files", new Blob([buffer], { type: contentType }), filename);
  formData.append("outputFormat", outputFormat);
  return fetch(`${baseUrl}/api/convert-image`, { method: "POST", body: formData });
}

async function assertImageResponse(response, format, width = 7, height = 5) {
  assert.equal(response.status, 200);
  const bytes = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(bytes, { animated: true }).metadata();
  assert.equal(metadata.format, format);
  assert.equal(metadata.width, width);
  assert.equal(metadata.height, height);
  return { bytes, metadata };
}

test("publishes only image formats that pass the startup encoder self-test", async () => {
  const response = await fetch(`${baseUrl}/api/image-converter/formats`);
  assert.equal(response.status, 200);
  const { formats } = await response.json();
  assert.ok(formats.some((entry) => entry.format === "png"));
  for (const format of formats) {
    assert.ok(format.extension);
    assert.ok(format.mimeType);
  }
});

test("converts JPEG to GIF with valid signature and dimensions", async () => {
  const response = await postImage(jpeg, "photo.jpg", "gif", "image/jpeg");
  const { bytes } = await assertImageResponse(response, "gif");
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "GIF8");
});

test("preserves animated WebP frame count when converting to GIF", async () => {
  const sourceMetadata = await sharp(animatedWebp, { animated: true }).metadata();
  assert.equal(sourceMetadata.pages, 2);
  const response = await postImage(animatedWebp, "animated.webp", "gif", "image/webp");
  const { metadata } = await assertImageResponse(response, "gif", 4, 10);
  assert.equal(metadata.pages, sourceMetadata.pages);
  assert.equal(metadata.pageHeight, sourceMetadata.pageHeight);
});

test("converts transparent PNG, JPEG, and WebP to valid BMP", async () => {
  for (const [buffer, filename, type] of [
    [png, "transparent.png", "image/png"],
    [jpeg, "photo.jpg", "image/jpeg"],
    [webp, "graphic.webp", "image/webp"],
  ]) {
    const response = await postImage(buffer, filename, "bmp", type);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200);
    assert.equal(bytes.subarray(0, 2).toString("ascii"), "BM");
    assert.match(response.headers.get("content-type") || "", /image\/bmp/);
    const decoded = await Jimp.read(bytes);
    assert.deepEqual([decoded.bitmap.width, decoded.bitmap.height], [7, 5]);
    if (filename === "transparent.png") {
      assert.deepEqual([...decoded.bitmap.data.subarray(0, 4)], [241, 169, 189, 255]);
    }
  }
});

test("preserves PNG, JPEG, WebP, TIFF, and SVG output support", async () => {
  for (const [format, expected, input] of [
    ["png", "png", jpeg],
    ["jpg", "jpeg", png],
    ["webp", "webp", jpeg],
    ["tiff", "tiff", png],
    ["svg", "svg", jpeg],
  ]) {
    const response = await postImage(input, "image-input.png", format, "image/png");
    assert.equal(response.status, 200, `${format} conversion should succeed`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (format === "svg") {
      assert.match(bytes.toString("utf8"), /<svg/);
      assert.match(response.headers.get("content-type") || "", /image\/svg\+xml/);
    } else {
      assert.equal((await sharp(bytes).metadata()).format, expected);
    }
  }

  const gifResponse = await postImage(jpeg, "image.jpg", "gif", "image/jpeg");
  await assertImageResponse(gifResponse, "gif");
  const bmpResponse = await postImage(jpeg, "image.jpg", "bmp", "image/jpeg");
  assert.equal(bmpResponse.status, 200);
  assert.equal((await Jimp.read(Buffer.from(await bmpResponse.arrayBuffer()))).bitmap.width, 7);
  assert.ok(tiff.length > 0);
});

test("unknown output format returns a clean 400 error", async () => {
  const response = await postImage(jpeg, "photo.jpg", "raw-format", "image/jpeg");
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Unsupported output format." });
});

test("corrupt image input returns a clean error without library details", async () => {
  const response = await postImage(Buffer.from("not an image"), "corrupt.jpg", "png", "image/jpeg");
  assert.equal(response.status, 400);
  const result = await response.json();
  assert.deepEqual(result, { error: "The uploaded image could not be read." });
  assert.doesNotMatch(JSON.stringify(result), /VipsOperation|sharp|stack/i);
});
