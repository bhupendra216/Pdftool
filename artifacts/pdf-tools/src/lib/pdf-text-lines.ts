export type PdfTextLineGroup = {
  id: string;
  pageNumber: number;
  items: any[];
  text: string;
  baselineY: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  dominantFontSize: number;
  ascent?: number;
  descent?: number;
  runs: Array<{
    str: string;
    fontName?: string;
    fontFamily?: string;
    color?: string | null;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    ascent?: number;
    descent?: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
};

export function groupTextItemsIntoLines(textItems: any[] = [], tolerance = 2) {
  const items = textItems.filter((item) => String(item?.str ?? item?.text ?? '').trim());
  const position = (item: any) => ({
    x: Number(item.pdfX ?? item.transform?.[4] ?? 0),
    y: Number(item.pdfY ?? item.transform?.[5] ?? 0),
  });
  const sorted = [...items].sort((left, right) => {
    const yDelta = position(left).y - position(right).y;
    return Math.abs(yDelta) > 0.0001 ? yDelta : position(left).x - position(right).x;
  });
  const groups: PdfTextLineGroup[] = [];

  for (const item of sorted) {
    const { x, y } = position(item);
    const text = String(item.str ?? item.text ?? '');
    const width = Math.max(1, Number(item.pdfRect?.width ?? item.width) || 1);
    const height = Math.max(1, Number(item.pdfRect?.height ?? item.height) || 1);
    const fontSize = Math.max(1, Number(item.fontSize) || height);
    const fontName = String(item.fontName ?? 'Helvetica');
    const run = {
      str: text,
      fontName,
      fontFamily: String(item.fontFamily ?? fontName),
      color: item.color ?? null,
      fontSize,
      bold: /bold/i.test(fontName),
      italic: /italic|oblique/i.test(fontName),
      ascent: Number.isFinite(item.ascent) ? Number(item.ascent) : undefined,
      descent: Number.isFinite(item.descent) ? Number(item.descent) : undefined,
      x,
      y,
      width,
      height,
    };
    const current = groups.at(-1);
    const sameLine = current && Math.abs(y - current.baselineY) <= tolerance;
    const gap = current ? x - (current.boundingBox.x + current.boundingBox.width) : Infinity;
    const averageCharacterWidth = current ? Math.max(5, current.boundingBox.width / Math.max(1, current.text.length)) : 0;
    if (current && sameLine && gap <= Math.max(20, averageCharacterWidth * 3)) {
      current.items.push(item);
      current.text += gap > 8 ? ` ${text}` : text;
      const right = Math.max(current.boundingBox.x + current.boundingBox.width, x + width);
      const top = Math.max(current.boundingBox.y + current.boundingBox.height, y + height);
      const bottom = Math.min(current.boundingBox.y, y);
      current.boundingBox.x = Math.min(current.boundingBox.x, x);
      current.boundingBox.width = right - current.boundingBox.x;
      current.boundingBox.y = bottom;
      current.boundingBox.height = top - bottom;
      current.runs.push(run);
      current.dominantFontSize = current.runs[Math.floor(current.runs.length / 2)]?.fontSize ?? fontSize;
      if (run.ascent !== undefined) current.ascent = Math.max(current.ascent ?? run.ascent, run.ascent);
      if (run.descent !== undefined) current.descent = Math.min(current.descent ?? run.descent, run.descent);
      continue;
    }

    groups.push({
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      pageNumber: Number(item.pageNumber) || 1,
      items: [item],
      text,
      baselineY: y,
      boundingBox: { x, y, width, height },
      dominantFontSize: fontSize,
      ascent: run.ascent,
      descent: run.descent,
      runs: [run],
    });
  }
  return groups;
}

export function inferTextMargins(groups: PdfTextLineGroup[]) {
  if (!groups.length) return null;
  const fontSizes = groups.map((group) => group.dominantFontSize).sort((left, right) => left - right);
  const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)];
  const bodyLines = groups.filter((group) => group.dominantFontSize <= medianFontSize * 1.35);
  const lines = bodyLines.length ? bodyLines : groups;
  const left = Math.min(...lines.map((group) => group.boundingBox.x));
  const right = Math.max(...lines.map((group) => group.boundingBox.x + group.boundingBox.width));
  return { left, right };
}

export function findOverlappingTextLines(
  candidateRects: Array<{ x: number; y: number; width: number; height: number }>,
  groups: PdfTextLineGroup[],
  excludedGroupId?: string,
) {
  return groups.filter((group) => group.id !== excludedGroupId && candidateRects.some((rect) => {
    const other = group.boundingBox;
    return rect.x < other.x + other.width && rect.x + rect.width > other.x &&
      rect.y < other.y + other.height && rect.y + rect.height > other.y;
  }));
}
