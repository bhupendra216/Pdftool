import test from "node:test";
import assert from "node:assert/strict";
import { getGhostscriptCompressionArgs, parsePdfCompressionLevel } from "../src/routes/office.ts";

test("parsePdfCompressionLevel defaults to balanced and accepts maximum", () => {
  assert.equal(parsePdfCompressionLevel({ compressionLevel: "balanced" }), "balanced");
  assert.equal(parsePdfCompressionLevel({ compressionLevel: "maximum" }), "maximum");
  assert.equal(parsePdfCompressionLevel({}), "balanced");
});

test("getGhostscriptCompressionArgs uses stronger compression settings for maximum", () => {
  const args = getGhostscriptCompressionArgs("/tmp/input.pdf", "/tmp/output.pdf", "maximum");
  assert.ok(args.includes("-dPDFSETTINGS=/screen"));
  assert.ok(args.includes("-sOutputFile=/tmp/output.pdf"));
});
