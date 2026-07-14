import test from "node:test";
import assert from "node:assert/strict";
import { buildDefaultPageOrder } from "../src/routes/pdf-utils.ts";

test("buildDefaultPageOrder returns the original page ordering", () => {
  assert.deepEqual(buildDefaultPageOrder(4), [1, 2, 3, 4]);
});
