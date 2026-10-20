export interface PaginationBlock {
  id: string;
  height: number;
  keepWithNext?: boolean;
  groupId?: string;
  sourceId?: string;
  splittable?: {
    lineHeights: number[];
    minLinesPerPage?: number;
  };
  lineRange?: [number, number];
}

export function paginateBlocks(blocks: PaginationBlock[], pageHeight: number): PaginationBlock[][] {
  if (!Number.isFinite(pageHeight) || pageHeight <= 0) {
    throw new Error("Page content height must be a positive number.");
  }
  if (blocks.some((block) => !Number.isFinite(block.height) || block.height < 0)) {
    throw new Error("Pagination block heights must be non-negative numbers.");
  }

  const pages: PaginationBlock[][] = [[]];
  let remaining = pageHeight;
  const nextPage = () => {
    if (pages[pages.length - 1].length > 0) {
      pages.push([]);
      remaining = pageHeight;
    }
  };
  const append = (block: PaginationBlock) => {
    pages[pages.length - 1].push(block);
    remaining -= block.height;
  };
  const appendSplittable = (block: PaginationBlock) => {
    const lines = block.splittable?.lineHeights ?? [];
    if (lines.some((height) => height > pageHeight)) {
      throw new Error(`Paragraph line in block ${block.id} is taller than the page content area.`);
    }
    if (lines.length === 0) {
      if (block.height > remaining) nextPage();
      append(block);
      return;
    }
    let lineOffset = block.lineRange?.[0] ?? 0;
    while (lineOffset < lines.length) {
      const minLines = block.splittable?.minLinesPerPage ?? 2;
      let fitCount = 0;
      let fitHeight = 0;
      while (lineOffset + fitCount < lines.length &&
        fitHeight + lines[lineOffset + fitCount] <= remaining) {
        fitHeight += lines[lineOffset + fitCount];
        fitCount += 1;
      }
      const linesRemaining = lines.length - lineOffset;
      if (fitCount < linesRemaining && linesRemaining - fitCount < minLines) {
        const adjustedCount = linesRemaining - minLines;
        const adjustedHeight = lines.slice(lineOffset, lineOffset + adjustedCount)
          .reduce((sum, height) => sum + height, 0);
        if (adjustedCount < minLines || adjustedHeight > remaining) {
          if (pages[pages.length - 1].length === 0) {
            throw new Error(`Paragraph block ${block.id} cannot fit the required widow/orphan lines.`);
          }
          nextPage();
          continue;
        }
        fitCount = adjustedCount;
        fitHeight = adjustedHeight;
      }
      if (fitCount < linesRemaining && fitCount < minLines) {
        if (pages[pages.length - 1].length === 0) {
          throw new Error(`Paragraph block ${block.id} cannot fit the required widow/orphan lines.`);
        }
        nextPage();
        continue;
      }
      if (fitCount === 0) {
        if (pages[pages.length - 1].length === 0) {
          throw new Error(`Paragraph line in block ${block.id} is taller than the page content area.`);
        }
        nextPage();
        continue;
      }
      const end = lineOffset + fitCount;
      append({
        ...block,
        id: `${block.id}:lines-${lineOffset}-${end}`,
        height: fitHeight,
        lineRange: [lineOffset, end],
        splittable: undefined,
      });
      lineOffset = end;
      if (lineOffset < lines.length) nextPage();
    }
  };
  const appendOversizedGroup = (group: PaginationBlock[]) => {
    let offset = 0;
    while (offset < group.length) {
      let end = offset + 1;
      while (end < group.length && group[end - 1].keepWithNext) end += 1;
      const linked = group.slice(offset, end);
      const linkedHeight = linked.reduce((sum, block) => sum + block.height, 0);
      if (linkedHeight <= pageHeight && linkedHeight > remaining) nextPage();
      if (linkedHeight > pageHeight) {
        if (linked.some((block) => block.keepWithNext) && pages[pages.length - 1].length > 0) nextPage();
        for (const block of linked) {
          if (block.splittable) {
            appendSplittable(block);
          } else {
            if (block.height > remaining) nextPage();
            append(block);
          }
        }
      } else {
        for (const block of linked) append(block);
      }
      offset = end;
    }
  };

  let index = 0;
  while (index < blocks.length) {
    const first = blocks[index];
    let end = index + 1;
    if (first.groupId) {
      while (end < blocks.length && blocks[end].groupId === first.groupId) end += 1;
    }
    let group = blocks.slice(index, end);

    if (first.keepWithNext && end < blocks.length) {
      const nextStart = end;
      let nextEnd = nextStart + 1;
      if (blocks[nextStart].groupId) {
        while (nextEnd < blocks.length && blocks[nextEnd].groupId === blocks[nextStart].groupId) nextEnd += 1;
      }
      const nextGroup = blocks.slice(nextStart, nextEnd);
      const firstSplittable = nextGroup.findIndex((block) => block.splittable);
      const prefixEnd = firstSplittable >= 0
        ? firstSplittable + 1
        : Math.min(nextGroup.length, 2);
      const withWholeNext = blocks.slice(index, nextEnd);
      group = withWholeNext.reduce((sum, block) => sum + block.height, 0) <= pageHeight
        ? withWholeNext
        : [...group, ...nextGroup.slice(0, prefixEnd)];
      end = index + group.length;
    }

    const groupHeight = group.reduce((sum, block) => sum + block.height, 0);
    if (group.length === 1 && group[0].splittable && groupHeight > remaining) {
      appendSplittable(group[0]);
    } else if (groupHeight <= pageHeight) {
      if (groupHeight > remaining) nextPage();
      for (const block of group) append(block);
    } else {
      if (first.keepWithNext && pages[pages.length - 1].length > 0) nextPage();
      appendOversizedGroup(group);
    }
    index = end;
  }

  if (pages.length > 1 && pages[pages.length - 1].length === 0) pages.pop();
  return pages;
}
