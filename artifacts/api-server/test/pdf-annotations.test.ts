import test from "node:test";
import assert from "node:assert/strict";
import { getTextPositionForPage, getPageNumberPosition } from "../src/routes/pdf-annotations.ts";

test("watermark positions use the requested corner", () => {
  const position = getTextPositionForPage(200, 300, "top-right", 12, 10);
  assert.deepEqual(position, { x: 164, y: 266 });
});

test("page number positions default to the bottom-right corner", () => {
  const position = getPageNumberPosition(400, 600, "bottom-right", 20, 16);
  assert.deepEqual(position, { x: 356, y: 24 });
});
