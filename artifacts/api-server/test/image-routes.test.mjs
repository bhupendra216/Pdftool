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
