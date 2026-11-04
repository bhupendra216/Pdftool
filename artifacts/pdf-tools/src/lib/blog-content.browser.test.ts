import { describe, expect, it } from "vitest";
import {
  blogPosts,
  getToolPath,
  resolveBlogToolLinks,
  tools,
} from "../../../api-server/src/lib/content";
import { hasDistinctBlogDescription, prepareBlogPostBody } from "./blog-content";
import hindiNepaliGuideMarkdown from "../../content/posts/2026-11-04-how-to-edit-hindi-and-nepali-text-in-a-pdf.md?raw";

describe("blog catalog content", () => {
  it("keeps every post body and its metadata free of repeated or leaked content", () => {
    const titles = blogPosts.map((post) => post.title.trim().toLocaleLowerCase());
    const descriptions = blogPosts.map((post) => post.excerpt.trim().toLocaleLowerCase());

    expect(new Set(titles).size).toBe(blogPosts.length);
    expect(new Set(descriptions).size).toBe(blogPosts.length);

    for (const post of blogPosts) {
      const leadingHeading = post.content
        .trimStart()
        .match(/^#\s+([^\r\n]+)/)?.[1]
        ?.replace(/\s*\|\s*PDFKira\s*$/i, "");
      expect(post.content.trimStart().toLowerCase()).not.toMatch(/^title:/);
      expect(post.content).not.toContain("publishedAt:");
      expect(leadingHeading?.trim().toLocaleLowerCase()).not.toBe(post.title.trim().toLocaleLowerCase());
      expect(post.content.toLowerCase()).not.toContain("[screenshot placeholder");
      expect(hasDistinctBlogDescription(post.title, post.excerpt)).toBe(true);
      expect(post.excerpt.length).toBeGreaterThanOrEqual(50);
      expect(post.excerpt.length).toBeLessThanOrEqual(200);
      expect(post.title).not.toMatch(/\s\|\s*PDFKira\s*$/i);
      expect(prepareBlogPostBody(post.content, post.title)).toBe(
        resolveBlogToolLinks(post.content.trimStart()),
      );
    }
  });

  it("strips leaked front matter and a duplicate leading title before rendering", () => {
    const body = `title: "Format a PDF"
description: "A distinct summary"
publishedAt: "2026-10-27"
# Format a PDF

Start by checking the page layout.`;

    expect(prepareBlogPostBody(body, "Format a PDF")).toBe("Start by checking the page layout.");
  });

  it("strips fenced front matter and a repeated H1 before rendering", () => {
    const body = `---
title: "Organize pages"
description: "A separate useful description"
publishedAt: "2026-10-27"
---

# Organize pages

Review the page sequence before saving.`;

    expect(prepareBlogPostBody(body, "Organize pages")).toBe(
      "Review the page sequence before saving.",
    );
  });

  it("compares visible descriptions after trimming and ignoring case", () => {
    expect(hasDistinctBlogDescription("  A Post ", " a post  ")).toBe(false);
    expect(hasDistinctBlogDescription("A Post", "A useful summary")).toBe(true);
    expect(hasDistinctBlogDescription("A Post", "  ")).toBe(false);
  });

  it("publishes the Hindi and Nepali editing guide with unique metadata and registered relative links", () => {
    const guide = blogPosts.find(
      (post) => post.slug === "2026-11-04-how-to-edit-hindi-and-nepali-text-in-a-pdf",
    );
    expect(guide).toBeDefined();
    if (!guide) throw new Error("Missing Hindi and Nepali editing guide.");

    expect(guide.title).toBe("How to Edit Hindi and Nepali Text in a PDF");
    expect(guide.excerpt).toContain("selectable Hindi and Nepali Devanagari text");
    expect(blogPosts.filter((post) => post.title === guide.title)).toHaveLength(1);
    expect(blogPosts.filter((post) => post.excerpt === guide.excerpt)).toHaveLength(1);
    expect(prepareBlogPostBody(hindiNepaliGuideMarkdown, guide.title).trimEnd()).toBe(
      resolveBlogToolLinks(guide.content.trim()),
    );

    const resolvedContent = resolveBlogToolLinks(guide.content);
    const links = [...resolvedContent.matchAll(/\]\(([^)]+)\)/g)].map(([, target]) => target);
    expect(links.length).toBeGreaterThanOrEqual(3);
    expect(links.length).toBeLessThanOrEqual(8);
    for (const target of links) {
      expect(target).toMatch(/^\//);
      if (target.startsWith("/tools/")) {
        expect(getToolPath(target.slice("/tools/".length))).toBe(target);
      } else {
        expect(target).toBe("/tools");
      }
    }
    expect(tools.some((tool) => tool.slug === "edit-pdf" && tool.status === "available")).toBe(true);
    expect(resolvedContent).not.toContain("publishedAt:");
    expect(resolvedContent.toLowerCase()).not.toContain("screenshot");
  });
});
