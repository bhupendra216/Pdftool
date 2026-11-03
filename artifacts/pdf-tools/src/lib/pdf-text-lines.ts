export type PdfTextLineGroup = {
  id: string;
  pageNumber: number;
  items: any[];
  text: string;
  baselineY: number;
  topLeftY?: number;
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

export type PdfTextBlock = {
  id: string;
  groups: PdfTextLineGroup[];
  boundingBox: { x: number; y: number; width: number; height: number };
  column: { left: number; right: number; center: number };
  alignment: 'left' | 'center' | 'right' | 'justified';
};

export type WordSpaceGapThreshold = {
  thresholdEm: number;
  medianWithinWordGapEm: number | null;
  medianBetweenWordGapEm: number | null;
};

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function inferWordSpaceGapThreshold(
  textItems: any[] = [],
  tolerance = 2,
): WordSpaceGapThreshold {
  const items = textItems.filter((item) => String(item?.str ?? item?.text ?? '').trim());
  const position = (item: any) => ({
    x: Number(item.pdfX ?? item.transform?.[4] ?? 0),
    y: Number(item.pdfY ?? item.transform?.[5] ?? 0),
    fontSize: Math.max(1, Number(item.fontSize ?? item.height) || 1),
  });
  const sorted = [...items].sort((left, right) => {
    const a = position(left);
    const b = position(right);
    return Math.abs(a.y - b.y) > 0.0001 ? b.y - a.y : a.x - b.x;
  });
  const gaps: number[] = [];
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const left = position(previous);
    const right = position(current);
    if (Math.abs(left.y - right.y) > Math.max(tolerance, Math.min(left.fontSize, right.fontSize) * 0.22)) continue;
    if (/\s$/u.test(String(previous.str ?? previous.text ?? '')) ||
      /^\s/u.test(String(current.str ?? current.text ?? ''))) continue;
    const previousWidth = Math.max(1, Number(previous.pdfRect?.width ?? previous.width) || 1);
    const gap = right.x - (left.x + previousWidth);
    if (gap > 0) gaps.push(gap / Math.min(left.fontSize, right.fontSize));
  }
  const ordered = [...gaps].sort((left, right) => left - right);
  let bestSplit: { ratio: number; within: number; between: number } | undefined;
  for (let split = 1; split < ordered.length; split += 1) {
    const within = median(ordered.slice(0, split));
    const between = median(ordered.slice(split));
    if (within === null || between === null || within <= 0) continue;
    const ratio = between / within;
    if (ratio >= 1.6 && (!bestSplit || ratio > bestSplit.ratio)) {
      bestSplit = { ratio, within, between };
    }
  }
  if (bestSplit) {
    return {
      thresholdEm: (bestSplit.within + bestSplit.between) / 2,
      medianWithinWordGapEm: bestSplit.within,
      medianBetweenWordGapEm: bestSplit.between,
    };
  }
  return {
    thresholdEm: 0.15,
    medianWithinWordGapEm: median(ordered),
    medianBetweenWordGapEm: null,
  };
}

function isGraphemeBoundary(previousText: string, nextText: string) {
  if (typeof Intl.Segmenter === 'undefined') return true;
  const boundary = previousText.length;
  let offset = 0;
  for (const { segment } of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(previousText + nextText)) {
    offset += segment.length;
    if (offset === boundary) return true;
    if (offset > boundary) return false;
  }
  return true;
}

export function groupTextItemsIntoLines(textItems: any[] = [], tolerance = 2) {
  const items = textItems.filter((item) => String(item?.str ?? item?.text ?? '').trim());
  const wordSpaceGapThreshold = inferWordSpaceGapThreshold(items, tolerance).thresholdEm;
  const position = (item: any) => ({
    x: Number(item.pdfX ?? item.transform?.[4] ?? 0),
    y: Number(item.pdfY ?? item.transform?.[5] ?? 0),
    topLeftX: Number(item.topLeftX ?? item.pdfX ?? item.transform?.[4] ?? 0),
    topLeftY: Number(item.topLeftY ?? -(item.pdfY ?? item.transform?.[5] ?? 0)),
  });
  const sorted = [...items].sort((left, right) => {
    const leftPosition = position(left);
    const rightPosition = position(right);
    const yDelta = leftPosition.topLeftY - rightPosition.topLeftY;
    return Math.abs(yDelta) > 0.0001 ? yDelta : leftPosition.topLeftX - rightPosition.topLeftX;
  });
  const groups: PdfTextLineGroup[] = [];

  for (const item of sorted) {
    const { x, y, topLeftY } = position(item);
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
    const lineTolerance = Math.max(tolerance, Math.min(fontSize, current?.dominantFontSize ?? fontSize) * 0.22);
    const sameLine = current && Math.abs(topLeftY - (current.topLeftY ?? -current.baselineY)) <= lineTolerance;
    const gap = current ? x - (current.boundingBox.x + current.boundingBox.width) : Infinity;
    const previousText = current?.items.at(-1)?.str ?? current?.items.at(-1)?.text ?? '';
    const averageCharacterWidth = current
      ? Math.max(5, current.boundingBox.width / Math.max(1, current.text.length))
      : 0;
    const needsWordSpace = current && gap > fontSize * wordSpaceGapThreshold &&
      !/\s$/u.test(String(previousText)) &&
      !/^\s/u.test(text) &&
      !/^[,،;:!?।॥]/u.test(text) &&
      !/\p{M}/u.test(text[0] ?? '') &&
      !/[़्‌‍]$/u.test(String(previousText)) &&
      isGraphemeBoundary(String(previousText), text);
    if (current && sameLine && gap <= Math.max(20, averageCharacterWidth * 3)) {
      current.items.push(item);
      current.text += `${needsWordSpace ? ' ' : ''}${text}`;
      const right = Math.max(current.boundingBox.x + current.boundingBox.width, x + width);
      const top = Math.max(current.boundingBox.y + current.boundingBox.height, y + height);
      const bottom = Math.min(current.boundingBox.y, y);
      current.boundingBox.x = Math.min(current.boundingBox.x, x);
      current.boundingBox.width = right - current.boundingBox.x;
      current.boundingBox.y = bottom;
      current.boundingBox.height = top - bottom;
      current.runs.push(run);
      current.dominantFontSize = current.runs[Math.floor(current.runs.length / 2)]?.fontSize ?? fontSize;
      current.topLeftY = Math.min(current.topLeftY ?? topLeftY, topLeftY);
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
      topLeftY,
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

export function joinPdfTextLines(groups: PdfTextLineGroup[]) {
  return groups.map((group) => group.text.trim()).filter(Boolean).join(' ');
}

function rectRight(group: PdfTextLineGroup) {
  return group.boundingBox.x + group.boundingBox.width;
}

function rectCenter(group: PdfTextLineGroup) {
  return group.boundingBox.x + group.boundingBox.width / 2;
}

export function inferTextBlockAlignment(groups: PdfTextLineGroup[]) {
  if (groups.length < 2) return 'left' as const;

  const ordered = [...groups].sort((a, b) =>
    (a.topLeftY ?? -a.baselineY) - (b.topLeftY ?? -b.baselineY));
  const tolerance = Math.max(0.5, Math.min(...ordered.map((group) => group.dominantFontSize)) * 0.015);
  const lefts = ordered.map((group) => group.boundingBox.x);
  const rights = ordered.map(rectRight);
  const centers = ordered.map(rectCenter);
  const range = (values: number[]) => Math.max(...values) - Math.min(...values);
  const common = (values: number[]) => range(values) <= tolerance;
  const firstLineIndented = Math.abs(lefts[0] - lefts.slice(1).sort((a, b) => a - b)[Math.floor((lefts.length - 1) / 2)]) > tolerance;
  const leftAligned = common(firstLineIndented ? lefts.slice(1) : lefts);
  const rightAligned = common(rights) && lefts.filter((left) =>
    Math.abs(left - lefts[0]) > tolerance).length >= Math.min(2, ordered.length - 1);
  const centered = common(centers) && range(lefts) > tolerance && range(rights) > tolerance;
  const last = ordered.at(-1)!;
  const preceding = ordered.slice(0, -1);
  const justified = ordered.length >= 3 &&
    common(preceding.map((group) => group.boundingBox.x)) &&
    common(preceding.map(rectRight)) &&
    Math.abs(last.boundingBox.x - preceding[0].boundingBox.x) <= tolerance &&
    Math.abs(rectRight(last) - rectRight(preceding[0])) > tolerance;

  if (justified) return 'justified' as const;
  if (rightAligned && !leftAligned) return 'right' as const;
  if (centered) return 'center' as const;
  if (leftAligned) return 'left' as const;
  return 'left' as const;
}

/**
 * Finds paragraph-like blocks without assuming every line starts at the same x.
 * Font size and baseline spacing are intentionally strict so headings do not
 * get absorbed into the body paragraph below them.
 */
export function groupTextLinesIntoBlocks(groups: PdfTextLineGroup[]): PdfTextBlock[] {
  const top = (group: PdfTextLineGroup) => group.topLeftY ?? -group.baselineY;
  const sorted = [...groups].sort((a, b) => top(a) - top(b) || a.boundingBox.x - b.boundingBox.x);
  const columns: PdfTextLineGroup[][] = [];
  for (const group of sorted) {
    const column = columns.find((candidate) => {
      const left = Math.min(...candidate.map((item) => item.boundingBox.x));
      const right = Math.max(...candidate.map(rectRight));
      const overlap = Math.min(rectRight(group), right) - Math.max(group.boundingBox.x, left);
      return overlap > -Math.max(group.dominantFontSize * 2, 24) ||
        Math.abs(rectCenter(group) - (left + right) / 2) < Math.max(group.dominantFontSize * 3, 40);
    });
    (column ?? columns[columns.push([]) - 1]).push(group);
  }

  const blocks: PdfTextBlock[] = [];
  for (const columnGroups of columns) {
    const columnLeft = Math.min(...columnGroups.map((group) => group.boundingBox.x));
    const columnRight = Math.max(...columnGroups.map(rectRight));
    const columnCenter = (columnLeft + columnRight) / 2;
    const ordered = [...columnGroups].sort((a, b) => top(a) - top(b));
    let current: PdfTextLineGroup[] = [];
    const flush = () => {
      if (!current.length) return;
      const left = Math.min(...current.map((group) => group.boundingBox.x));
      const right = Math.max(...current.map(rectRight));
      const alignment = inferTextBlockAlignment(current);
      blocks.push({
        id: `block-${current[0].id}`,
        groups: current,
        boundingBox: {
          x: left,
          y: Math.min(...current.map((group) => group.boundingBox.y)),
          width: right - left,
          height: Math.max(...current.map((group) => group.boundingBox.y + group.boundingBox.height)) -
            Math.min(...current.map((group) => group.boundingBox.y)),
        },
        column: { left: columnLeft, right: columnRight, center: columnCenter },
        alignment,
      });
      current = [];
    };
    for (const group of ordered) {
      const previous = current.at(-1);
      const startsListItem = /^(?:[•◦▪‣*-]|\d+[.)]|[०-९]+[.)])\s/u.test(group.text);
      const lineGap = previous ? Math.abs(group.baselineY - previous.baselineY) : 0;
      const expected = previous?.dominantFontSize ?? group.dominantFontSize;
      const sizeCompatible = !previous || Math.abs(group.dominantFontSize - expected) <= Math.max(1.5, expected * 0.12);
      const spacingCompatible = !previous || (lineGap > expected * 0.65 && lineGap < expected * 2.2);
      const horizontalOverlap = !previous ||
        Math.min(rectRight(group), rectRight(previous)) - Math.max(group.boundingBox.x, previous.boundingBox.x) > -expected * 2;
      const commonCenter = previous && Math.abs(rectCenter(group) - rectCenter(previous)) <= expected * 2;
      if (previous && (startsListItem ||
        !sizeCompatible || !spacingCompatible || (!horizontalOverlap && !commonCenter))) flush();
      current.push(group);
    }
    flush();
  }
  return blocks;
}

export function findTextBlockForLine(groups: PdfTextLineGroup[], groupId: string) {
  return groupTextLinesIntoBlocks(groups).find((block) => block.groups.some((group) => group.id === groupId));
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
