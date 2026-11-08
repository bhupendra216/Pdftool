export function withPageMarkers(pages: string[], includePageMarkers: boolean) {
  return pages.map((page, index) => {
    if (!includePageMarkers) return page;
    return `<!-- Page ${index + 1} -->\n\n${page}`;
  }).join("\n\n");
}

export function markdownForDisplay(markdown: string, includeImageReferences: boolean) {
  if (includeImageReferences) return markdown;
  return markdown.split("\n")
    .filter((line) => !/^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}
