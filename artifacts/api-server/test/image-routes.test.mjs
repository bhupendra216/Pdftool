import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import app from "../dist/index.mjs";

function onceServerListening(server) {
  return new Promise((resolve) => {
    server.once("listening", () => resolve(undefined));
  });
}

test("convert-image works locally with Sharp", async () => {
  const server = app.listen(0);
  await onceServerListening(server);

  try {
    const address = server.address();
    assert.ok(address && typeof address === "object" && "port" in address);
    const port = address.port;

    const pngBuffer = await sharp({
      create: {
        width: 2,
        height: 2,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const formData = new FormData();
    formData.append("files", new Blob([pngBuffer], { type: "image/png" }), "sample.png");
    formData.append("outputFormat", "png");

    const response = await fetch(`http://127.0.0.1:${port}/api/convert-image`, {
      method: "POST",
      body: formData,
    });

    assert.equal(response.status, 200);
    const outputBuffer = Buffer.from(await response.arrayBuffer());
    assert.ok(outputBuffer.length > 0);

    const metadata = await sharp(outputBuffer).metadata();
    assert.equal(metadata.format, "png");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve(undefined)));
    });
  }
});

test("convert-image accepts SVG input and rasterizes it", async () => {
  const server = app.listen(0);
  await onceServerListening(server);

  try {
    const address = server.address();
    assert.ok(address && typeof address === "object" && "port" in address);
    const port = address.port;

    const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><rect width="8" height="8" fill="red"/></svg>`);
    const formData = new FormData();
    formData.append("files", new Blob([svgBuffer], { type: "image/svg+xml" }), "sample.svg");
    formData.append("outputFormat", "png");

    const response = await fetch(`http://127.0.0.1:${port}/api/convert-image`, {
      method: "POST",
      body: formData,
    });

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /image\/png/);
    const outputBuffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(outputBuffer).metadata();
    assert.equal(metadata.format, "png");
    assert.ok((metadata.width || 0) > 0);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve(undefined)));
    });
  }
});

test("convert-image can emit SVG output in embed mode", async () => {
  const server = app.listen(0);
  await onceServerListening(server);

  try {
    const address = server.address();
    assert.ok(address && typeof address === "object" && "port" in address);
    const port = address.port;

    const pngBuffer = await sharp({
      create: {
        width: 4,
        height: 4,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const formData = new FormData();
    formData.append("files", new Blob([pngBuffer], { type: "image/png" }), "sample.png");
    formData.append("outputFormat", "svg");
    formData.append("svgMode", "embed");

    const response = await fetch(`http://127.0.0.1:${port}/api/convert-image`, {
      method: "POST",
      body: formData,
    });

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /image\/svg\+xml/);
    const svgText = await response.text();
    assert.match(svgText, /<svg[^>]*xmlns=/);
    assert.match(svgText, /<image[^>]*href="data:image\/png;base64,/);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve(undefined)));
    });
  }
});

test("convert-image can emit SVG output in trace mode", async () => {
  const server = app.listen(0);
  await onceServerListening(server);

  try {
    const address = server.address();
    assert.ok(address && typeof address === "object" && "port" in address);
    const port = address.port;

    const pngBuffer = await sharp({
      create: {
        width: 16,
        height: 16,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite([{ input: Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\"><rect x=\"2\" y=\"2\" width=\"6\" height=\"6\" fill=\"black\"/></svg>"), blend: "over" }])
      .png()
      .toBuffer();

    const formData = new FormData();
    formData.append("files", new Blob([pngBuffer], { type: "image/png" }), "sample.png");
    formData.append("outputFormat", "svg");
    formData.append("svgMode", "trace");

    const response = await fetch(`http://127.0.0.1:${port}/api/convert-image`, {
      method: "POST",
      body: formData,
    });

    assert.equal(response.status, 200);
    const svgText = await response.text();
    assert.match(svgText, /<path/);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve(undefined)));
    });
  }
});
