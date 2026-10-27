import { describe, expect, it } from "vitest";
import { blogPosts } from "../../../api-server/src/lib/content";
import { hasDistinctBlogDescription, prepareBlogPostBody } from "./blog-content";

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
      expect(prepareBlogPostBody(post.content, post.title)).toBe(post.content.trimStart());
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
});
