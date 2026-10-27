function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function hasDistinctBlogDescription(title?: string | null, description?: string | null) {
  return Boolean(description?.trim()) && normalizeText(title ?? "") !== normalizeText(description ?? "");
}

export function prepareBlogPostBody(content: string, title: string) {
  let body = content.replace(/^\uFEFF/, "").trimStart();
  const frontMatter = body.match(/^---[ \t]*\r?\n[\s\S]*?^---[ \t]*(?:\r?\n|$)/m);

  if (frontMatter) {
    body = body.slice(frontMatter[0].length);
  } else {
    while (/^(?:title|description|publishedAt):[^\r\n]*(?:\r?\n|$)/i.test(body)) {
      body = body.replace(/^(?:title|description|publishedAt):[^\r\n]*(?:\r?\n|$)/i, "");
    }
  }

  const normalizedTitle = normalizeText(title.replace(/\s*\|\s*PDFKira\s*$/i, ""));
  body = body.trimStart();
  while (body) {
    const firstLine = body.match(/^[^\r\n]*/)?.[0] ?? "";
    const headingText = firstLine
      .trim()
      .replace(/^#\s+/, "")
      .replace(/\s*\|\s*PDFKira\s*$/i, "");
    if (normalizeText(headingText) !== normalizedTitle) break;
    body = body.slice(firstLine.length).replace(/^(?:\r?\n)+/, "").trimStart();
  }

  return body.trimStart();
}
