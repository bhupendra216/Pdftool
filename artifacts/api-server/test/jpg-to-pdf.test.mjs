import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const testDataDir = await mkdtemp(path.join(os.tmpdir(), "jpg-to-pdf-test-"));
process.env.ADMIN_DB_PATH = path.join(testDataDir, "analytics.sqlite3");
const { default: app } = await import("../dist/index.mjs");

let server;
let baseUrl;
let smallJpeg;
let sipsStyleJpeg;
let png;

before(async () => {
  smallJpeg = await makeJpeg(150, 140, false);
  sipsStyleJpeg = await makeJpeg(175, 140, true);
  png = await sharp({
    create: {
      width: 31,
      height: 23,
      channels: 3,
      background: { r: 30, g: 170, b: 240 },
    },
  }).png().toBuffer();

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

async function makeJpeg(width, height, progressive) {
  const pixels = randomBytes(width * height * 3);
  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 90, progressive })
    .toBuffer();
}

async function postImages(images) {
  const formData = new FormData();
  for (const { buffer, filename, contentType } of images) {
    formData.append("files", new Blob([buffer], { type: contentType }), filename);
  }
  return fetch(`${baseUrl}/api/convert-jpg-to-pdf`, { method: "POST", body: formData });
}

async function getPageSizes(response) {
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/pdf/);
  const pdf = await PDFDocument.load(await response.arrayBuffer());
  return pdf.getPages().map((page) => [page.getWidth(), page.getHeight()]);
}

test("50 repeated small JPEG uploads all produce a one-page PDF", async () => {
  assert.ok(smallJpeg.length >= 15 * 1024 && smallJpeg.length <= 30 * 1024);
  for (let index = 0; index < 50; index += 1) {
    const sizes = await getPageSizes(await postImages([
      { buffer: smallJpeg, filename: "repeat.jpg", contentType: "image/jpeg" },
    ]));
    assert.equal(sizes.length, 1, `upload ${index + 1} should have one page`);
    assert.deepEqual(sizes[0], [150, 140]);
  }
});

test("50 repeated progressive JPEG uploads all produce a one-page PDF", async () => {
  assert.ok(sipsStyleJpeg.length >= 15 * 1024 && sipsStyleJpeg.length <= 30 * 1024);
  for (let index = 0; index < 50; index += 1) {
    const sizes = await getPageSizes(await postImages([
      { buffer: sipsStyleJpeg, filename: "sips-style.jpeg", contentType: "image/jpeg" },
    ]));
    assert.equal(sizes.length, 1, `upload ${index + 1} should have one page`);
    assert.deepEqual(sizes[0], [175, 140]);
  }
});

test("parallel small JPEG requests do not mix up uploaded images", async () => {
  const cases = Array.from({ length: 10 }, async (_, index) => {
    const width = 90 + index * 3;
    const height = 80 + index * 2;
    const image = await makeJpeg(width, height, index % 2 === 0);
    const response = await postImages([
      { buffer: image, filename: `parallel-${index}.jpg`, contentType: "image/jpeg" },
    ]);
    return { index, width, height, sizes: await getPageSizes(response) };
  });

  const results = await Promise.all(cases);
  for (const result of results) {
    assert.equal(result.sizes.length, 1);
    assert.deepEqual(result.sizes[0], [result.width, result.height]);
  }
});

test("JPG and PNG inputs retain upload order and each image gets its own page", async () => {
  const sizes = await getPageSizes(await postImages([
    { buffer: smallJpeg, filename: "first.jpg", contentType: "image/jpeg" },
    { buffer: png, filename: "second.png", contentType: "image/png" },
  ]));
  assert.deepEqual(sizes, [[150, 140], [31, 23]]);
});

test("a text file renamed to JPG is rejected with a clean 400", async () => {
  const response = await postImages([
    { buffer: Buffer.from("not an image"), filename: "fake.jpg", contentType: "image/jpeg" },
  ]);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "fake.jpg is not a valid JPG or PNG image.",
  });
});

test("a 12 MB JPEG upload still converts successfully", async () => {
  const largeJpeg = await makeJpeg(4200, 3700, false);
  assert.ok(largeJpeg.length >= 12 * 1024 * 1024, `generated JPEG is ${largeJpeg.length} bytes`);
  const sizes = await getPageSizes(await postImages([
    { buffer: largeJpeg, filename: "large.jpg", contentType: "image/jpeg" },
  ]));
  assert.equal(sizes.length, 1);
  assert.deepEqual(sizes[0], [4200, 3700]);
});
