import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSignaturesForPage, parseTargetPages } from './signature-utils.ts';

test('filterSignaturesForPage includes current-page signatures and target pages', () => {
  const signatures = [
    { id: 1, pageNumber: 1, target: 'current', targetPages: [], x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
    { id: 2, pageNumber: 1, target: 'all', targetPages: [], x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
    { id: 3, pageNumber: 2, target: 'pages', targetPages: [2, 4], x: 0.2, y: 0.2, width: 0.2, height: 0.1 },
    { id: 4, pageNumber: 3, target: 'current', targetPages: [], x: 0.3, y: 0.3, width: 0.2, height: 0.1 },
  ];

  const page1 = filterSignaturesForPage(signatures, 1);
  assert.deepEqual(page1.map((item) => item.id).sort(), [1, 2]);

  const page2 = filterSignaturesForPage(signatures, 2);
  assert.deepEqual(page2.map((item) => item.id).sort(), [2, 3]);

  const page3 = filterSignaturesForPage(signatures, 3);
  assert.deepEqual(page3.map((item) => item.id).sort(), [2, 4]);
});

test('parseTargetPages handles open ranges and duplicates correctly', () => {
  assert.deepEqual(parseTargetPages('1,3-4,2,4', 5), [1, 2, 3, 4]);
  assert.deepEqual(parseTargetPages('2-2,5', 5), [2, 5]);
  assert.deepEqual(parseTargetPages('', 5), []);
});
