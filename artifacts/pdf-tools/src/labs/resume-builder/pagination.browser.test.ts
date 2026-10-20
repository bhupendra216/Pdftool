import { describe, expect, it } from "vitest";
import { paginateBlocks, type PaginationBlock } from "./pagination";
import { PAGE_CONTENT_HEIGHT_MM, PAGE_PAGINATION_BUFFER_MM, PAGE_PAGINATION_HEIGHT_MM } from "./model";

describe("paginateBlocks", () => {
  it("keeps short content on one page and never adds a trailing page", () => {
    expect(paginateBlocks([{ id: "one", height: 4 }], 10)).toHaveLength(1);
    expect(paginateBlocks([], 10)).toEqual([[]]);
  });

  it("distributes overflow across pages in original order without blank trailing pages", () => {
    const blocks = Array.from({ length: 6 }, (_, index) => ({ id: `block-${index}`, height: 4 }));
    const pages = paginateBlocks(blocks, 10);
    expect(pages).toHaveLength(3);
    expect(pages.at(-1)).not.toEqual([]);
    expect(pages.flat().map((block) => block.id)).toEqual(blocks.map((block) => block.id));
  });

  it("keeps a heading with its first entry and keeps title and organization together", () => {
    const blocks: PaginationBlock[] = [
      { id: "prior", height: 8 },
      { id: "heading", height: 1, keepWithNext: true },
      { id: "title", height: 2, keepWithNext: true, groupId: "entry" },
      { id: "organization", height: 2, keepWithNext: true, groupId: "entry" },
      {
        id: "description",
        height: 8,
        groupId: "entry",
        splittable: { lineHeights: Array(8).fill(1), minLinesPerPage: 2 },
      },
    ];
    const pages = paginateBlocks(blocks, 10);
    expect(pages[0].map((block) => block.id)).toEqual(["prior"]);
    expect(pages[1].map((block) => block.id)).toContain("heading");
    expect(pages[1].map((block) => block.id)).toContain("title");
    expect(pages[1].map((block) => block.id)).toContain("organization");
    expect(pages[1].map((block) => block.id)).toContain("description:lines-0-5");
    expect(pages[2].map((block) => block.id)).toContain("description:lines-5-8");
  });

  it("keeps an entry that fits whole and splits an oversized entry only between blocks", () => {
    const whole = [
      { id: "title", height: 2, keepWithNext: true, groupId: "whole" },
      { id: "organization", height: 2, groupId: "whole" },
      { id: "description", height: 3, groupId: "whole" },
    ];
    const pages = paginateBlocks([
      { id: "prior", height: 5 },
      ...whole,
    ], 10);
    expect(pages).toHaveLength(2);
    expect(pages[1].map((block) => block.id)).toEqual(["title", "organization", "description"]);

    const oversized = paginateBlocks([
      { id: "title", height: 2, keepWithNext: true, groupId: "large" },
      { id: "organization", height: 2, keepWithNext: true, groupId: "large" },
      {
        id: "description",
        height: 8,
        groupId: "large",
        splittable: { lineHeights: Array(8).fill(1), minLinesPerPage: 2 },
      },
    ], 10);
    expect(oversized.flat().map((block) => block.id)).toEqual([
      "title", "organization", "description:lines-0-6", "description:lines-6-8",
    ]);
  });

  it("preserves line boundaries and keeps at least two lines on split paragraph pages", () => {
    const pages = paginateBlocks([
      { id: "prior", height: 8 },
      {
        id: "paragraph",
        height: 8,
        splittable: { lineHeights: Array(8).fill(1), minLinesPerPage: 2 },
      },
    ], 10);
    expect(pages.map((page) => page.filter((block) => block.lineRange).map((block) => block.lineRange))).toEqual([
      [[0, 2]],
      [[2, 8]],
    ]);
  });

  it("avoids a one-line final paragraph fragment and keeps the header on page one only", () => {
    const pages = paginateBlocks([
      { id: "header", height: 0 },
      {
        id: "paragraph",
        height: 11,
        splittable: { lineHeights: Array(11).fill(1), minLinesPerPage: 2 },
      },
    ], 5);
    expect(pages.map((page) => page.filter((block) => block.lineRange).map((block) => block.lineRange))).toEqual([
      [[0, 5]],
      [[5, 9]],
      [[9, 11]],
    ]);
    expect(pages[0].some((block) => block.id === "header")).toBe(true);
    expect(pages.slice(1).flat().some((block) => block.id === "header")).toBe(false);
  });

  it("is deterministic and rejects an impossible paragraph line", () => {
    const blocks = [{
      id: "paragraph",
      height: 12,
      splittable: { lineHeights: [1, 1, 1, 9], minLinesPerPage: 2 },
    }];
    expect(paginateBlocks(blocks, 10)).toEqual(paginateBlocks(blocks, 10));
    expect(() => paginateBlocks([{
      id: "too-tall-line",
      height: 12,
      splittable: { lineHeights: [12] },
    }], 10)).toThrow("taller than the page content area");
  });

  it("uses the fixed 2 mm pagination safety buffer without changing the A4 content box", () => {
    expect(PAGE_CONTENT_HEIGHT_MM).toBe(257);
    expect(PAGE_PAGINATION_BUFFER_MM).toBe(2);
    expect(PAGE_PAGINATION_HEIGHT_MM).toBe(255);
    const blocks = Array.from({ length: 30 }, (_, index) => ({ id: `block-${index}`, height: 31 }));
    const heightPx = PAGE_PAGINATION_HEIGHT_MM * 96 / 25.4;
    expect(paginateBlocks(blocks, heightPx)).toEqual(paginateBlocks(blocks, heightPx));
    expect(paginateBlocks(blocks, heightPx).flat().map((block) => block.id)).toEqual(blocks.map((block) => block.id));
  });
});
