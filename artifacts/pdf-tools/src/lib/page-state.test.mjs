import test from 'node:test';
import assert from 'node:assert/strict';
import { removePagesById } from './page-state.ts';

test('removes the requested pages and their thumbnails while keeping the rest ordered', () => {
  const pages = [
    { id: 'page-1', pageNumber: 1, rotation: 0, selected: false },
    { id: 'page-2', pageNumber: 2, rotation: 0, selected: false },
    { id: 'page-3', pageNumber: 3, rotation: 0, selected: false },
  ];
  const thumbnails = ['thumb-1', 'thumb-2', 'thumb-3'];

  const result = removePagesById(pages, ['page-2'], thumbnails);

  assert.deepEqual(result.pages, [
    { id: 'page-1', pageNumber: 1, rotation: 0, selected: false },
    { id: 'page-3', pageNumber: 3, rotation: 0, selected: false },
  ]);
  assert.deepEqual(result.thumbnails, ['thumb-1', 'thumb-3']);
});
