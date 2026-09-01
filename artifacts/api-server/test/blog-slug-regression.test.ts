import test from "node:test";
import assert from "node:assert/strict";

import { findBlogPost } from "../src/lib/content.ts";

test("legacy tool blog slugs resolve to real blog posts", () => {
  assert.ok(findBlogPost("how-to-merge-pdfs"));
  assert.ok(findBlogPost("best-free-pdf-compressor"));
  assert.ok(findBlogPost("how-to-convert-pdf-to-word"));
  assert.ok(findBlogPost("how-to-convert-image-to-text-using-ocr"));
});
