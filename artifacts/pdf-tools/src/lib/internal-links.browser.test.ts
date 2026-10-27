import { describe, expect, it } from "vitest";
import {
  blogPosts,
  getCanonicalToolPaths,
  getToolPath,
  resolveBlogToolLinks,
  tools,
} from "../../../api-server/src/lib/content";
import { clientToolContent } from "../data/clientToolContent";
import { TOOL_SEO_CONTENT } from "../data/toolSeoContent";
import { toolContent } from "../data/toolContent";
import { getToolContentRequirements } from "../data/toolContentRequirements";

const registeredToolSlugs = new Set(
  tools.filter((tool) => tool.status === "available").map((tool) => tool.slug),
);
const staticRoutes = new Set([
  "/",
  "/tools",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/ai-jobs",
  "/compare/ilovepdf-vs-smallpdf-vs-pdfkira",
]);

describe("internal links", () => {
  it("uses only relative, registered, canonical links in every blog body", () => {
    for (const post of blogPosts) {
      for (const [, target] of post.content.matchAll(/\]\(([^)]+)\)/g)) {
        expect(target).not.toMatch(/^https?:\/\/(?:www\.)?pdfkira\.com(?:\/|$)/i);
        expect(target).not.toMatch(/localhost/i);

        if (target.startsWith("tool:")) {
          const slug = target.slice("tool:".length);
          expect(registeredToolSlugs.has(slug)).toBe(true);
          expect(getToolPath(slug)).toBe(`/tools/${slug}`);
          continue;
        }

        expect(target.startsWith("/")).toBe(true);
        expect(target.startsWith("/tools/")).toBe(false);
        expect(staticRoutes.has(target) || target.startsWith("/blog/") || target.startsWith("/categories/")).toBe(true);
      }

      const renderedBody = resolveBlogToolLinks(post.content);
      for (const [, target] of renderedBody.matchAll(/\]\(([^)]+)\)/g)) {
        if (!target.startsWith("/tools/")) continue;
        const slug = target.slice("/tools/".length);
        expect(getToolPath(slug)).toBe(target);
      }
    }
  });

  it("keeps all authored related-tool links registry-backed", () => {
    for (const content of Object.values(toolContent)) {
      for (const slug of content.relatedTools ?? []) {
        expect(registeredToolSlugs.has(slug)).toBe(true);
        expect(getToolPath(slug)).toBe(`/tools/${slug}`);
      }
    }

    for (const content of clientToolContent) {
      for (const item of content.related) {
        expect(registeredToolSlugs.has(item.toolSlug)).toBe(true);
        expect(getToolPath(item.toolSlug)).toBe(`/tools/${item.toolSlug}`);
      }
    }

    for (const content of Object.values(TOOL_SEO_CONTENT)) {
      for (const item of content.relatedTools ?? []) {
        expect(registeredToolSlugs.has(item.slug)).toBe(true);
        expect(getToolPath(item.slug)).toBe(`/tools/${item.slug}`);
      }
    }

    for (const tool of tools.filter((entry) => entry.status === "available")) {
      for (const item of getToolContentRequirements(tool).relatedTools) {
        expect(registeredToolSlugs.has(item.toolSlug)).toBe(true);
        expect(getToolPath(item.toolSlug)).toBe(`/tools/${item.toolSlug}`);
      }
    }
  });

  it("assigns every available registry tool one canonical sitemap path", () => {
    const canonicalPaths = getCanonicalToolPaths();

    expect(canonicalPaths).toHaveLength(registeredToolSlugs.size);
    expect(new Set(canonicalPaths).size).toBe(canonicalPaths.length);

    for (const slug of registeredToolSlugs) {
      const path = getToolPath(slug);
      expect(canonicalPaths.filter((canonicalPath) => canonicalPath === path)).toHaveLength(1);
    }
  });
});
