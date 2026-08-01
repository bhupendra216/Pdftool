export type PageState = {
  id: string;
  pageNumber: number;
  rotation: number;
  selected: boolean;
};

export function removePagesById(pages: PageState[], pageIds: string[], thumbnails: Array<string | null> = []): { pages: PageState[]; thumbnails: Array<string | null> } {
  const idsToRemove = new Set(pageIds);
  const nextPages = pages.filter((page) => !idsToRemove.has(page.id));
  const nextThumbnails = thumbnails.filter((_, index) => !idsToRemove.has(pages[index]?.id ?? ''));
  return { pages: nextPages, thumbnails: nextThumbnails };
}
