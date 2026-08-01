import test from "node:test";
import assert from "node:assert/strict";
import { buildDefaultPageOrder, parseSingleRotationValue } from "../src/routes/pdf-utils.ts";

test("buildDefaultPageOrder returns the original page ordering", () => {
  assert.deepEqual(buildDefaultPageOrder(4), [1, 2, 3, 4]);
});

test("parseSingleRotationValue accepts a single document rotation", () => {
  assert.equal(parseSingleRotationValue(90), 90);
  assert.equal(parseSingleRotationValue("270"), 270);
});

test("parseSingleRotationValue rejects unsupported rotations", () => {
  assert.throws(() => parseSingleRotationValue(45), /one of 0, 90, 180, or 270/);
});
