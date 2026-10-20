import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const publicReferences = [
  "public/sitemap.xml",
  "public/llms.txt",
  "artifacts/api-server/src/lib/content.ts",
  "artifacts/pdf-tools/src/data/toolCategories.ts",
  "artifacts/pdf-tools/src/components/layout/Navbar.tsx",
  "artifacts/pdf-tools/src/components/layout/Footer.tsx",
  "scripts/generate-seo.ts",
];

for (const path of publicReferences) {
  assert.equal(read(path).includes("ask-pdf-ai"), false, `${path} must not mention the lab route`);
}

const vercel = JSON.parse(read("vercel.json")) as {
  rewrites?: Array<{ source: string; destination: string }>;
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};
assert(
  vercel.rewrites?.some((rewrite) =>
    rewrite.source === "/labs/ask-pdf-ai" && rewrite.destination === "/labs/ask-pdf-ai.html",
  ),
  "Vercel must rewrite the clean lab route to its Vite HTML entry",
);
assert(
  vercel.headers?.some((entry) =>
    entry.source === "/labs/(.*)" &&
    entry.headers.some((header) =>
      header.key.toLowerCase() === "x-robots-tag" && header.value === "noindex, nofollow",
    ),
  ),
  "Vercel must apply a route-scoped noindex header to lab pages",
);
assert(
  read("artifacts/pdf-tools/labs/ask-pdf-ai.html").includes('<meta name="robots" content="noindex, nofollow"'),
  "The lab HTML must contain runtime-independent noindex metadata",
);

const builtEntry = resolve(root, "artifacts/pdf-tools/dist/public/labs/ask-pdf-ai.html");
if (existsSync(resolve(root, "artifacts/pdf-tools/dist/public"))) {
  assert(existsSync(builtEntry), "The Vite build must emit the HTML entry under dist/public/labs");
}

console.log("Ask PDF AI remains unlisted and has clean-route rewrite plus noindex protections.");
