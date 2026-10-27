import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { expect, it } from "vitest";
import { blogPosts, tools } from "../../../api-server/src/lib/content";
import ResumeBuilderPage from "./resume-builder";
import resumeGuideMarkdown from "../../content/posts/2026-10-27-job-resume-vs-europass-cv-what-to-include-and-how-to-format-each.md?raw";
import { TOOL_SEO_CONTENT } from "@/data/toolSeoContent";
import { prepareBlogPostBody } from "@/lib/blog-content";

const guide = TOOL_SEO_CONTENT["resume-builder"].featuredGuide!;

it("renders all resume page content, links only registered tools, and publishes a unique guide", async () => {
  const frontmatter = resumeGuideMarkdown.match(/^---\n([\s\S]*?)\n---/);
  expect(frontmatter).not.toBeNull();
  const title = frontmatter?.[1].match(/^title: "(.+)"$/m)?.[1];
  const description = frontmatter?.[1].match(/^description: "(.+)"$/m)?.[1];
  expect(title).toBe(guide.title);
  expect(description).toBe(guide.description);
  expect(title).not.toBe(description);
  const publishedPosts = blogPosts.filter((post) => post.slug === guide.slug);
  expect(publishedPosts).toHaveLength(1);
  expect(publishedPosts[0].title).toBe(title);
  expect(publishedPosts[0].excerpt).toBe(description);
  expect(publishedPosts[0].content.trim()).toBe(prepareBlogPostBody(resumeGuideMarkdown, title).trim());
  expect(blogPosts.filter((post) => post.title === title)).toHaveLength(1);
  expect(blogPosts.filter((post) => post.excerpt === description)).toHaveLength(1);
  const availableToolSlugs = new Set(tools.filter((tool) => tool.status === "available").map((tool) => tool.slug));
  const blogToolLinks = [...resumeGuideMarkdown.matchAll(/\]\(\/tools\/([^)\s]+)\)/g)].map((match) => match[1]);
  expect(blogToolLinks).toHaveLength(2);
  for (const slug of blogToolLinks) {
    expect(availableToolSlugs.has(slug)).toBe(true);
  }

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(createElement(HelmetProvider, null, createElement(ResumeBuilderPage)));
    });

    const headings = [...container.querySelectorAll("h2")].map((heading) => heading.textContent?.trim());
    expect(headings).toContain("How it works");
    expect(headings).toContain("Why use this tool");
    expect(headings).toContain("Frequently Asked Questions");
    expect(headings).toContain("Related tools");

    const visibleText = container.textContent?.toLowerCase() ?? "";
    expect(visibleText).not.toContain("resume-builder");
    for (const element of container.querySelectorAll("[alt]")) {
      expect(element.getAttribute("alt")?.toLowerCase() ?? "").not.toContain("resume-builder");
    }

    const relatedSection = [...container.querySelectorAll("section")].find(
      (section) => section.querySelector("h2")?.textContent?.trim() === "Related tools",
    );
    expect(relatedSection).toBeDefined();
    const relatedLinks = [...(relatedSection?.querySelectorAll('a[href^="/tools/"]') ?? [])];
    expect(relatedLinks).toHaveLength(4);
    for (const link of relatedLinks) {
      const slug = link.getAttribute("href")?.split("/").at(-1);
      expect(availableToolSlugs.has(slug ?? "")).toBe(true);
    }

    const guideLink = container.querySelector(`a[href="/blog/${guide.slug}"]`);
    expect(guideLink?.textContent?.trim()).toBe(guide.title);
    const guideDescription = guideLink?.closest("section")?.querySelector("p")?.textContent?.trim();
    expect(guideDescription).toBe(guide.description);
    expect(guideDescription).not.toBe(guide.title);
  } finally {
    root.unmount();
    container.remove();
  }
});
