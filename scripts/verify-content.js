#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = process.env.CONTENT_PAGES_DIR
  ? path.resolve(root, process.env.CONTENT_PAGES_DIR)
  : path.join(root, 'public');
const toolsDir = path.join(outputDir, 'tools');
const minimumWords = 500;

function countWords(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

if (!fs.existsSync(toolsDir)) {
  throw new Error(`Generated tools directory not found: ${toolsDir}`);
}

const pages = fs.readdirSync(toolsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const file = path.join(toolsDir, entry.name, 'index.html');
    const words = fs.existsSync(file) ? countWords(fs.readFileSync(file, 'utf8')) : 0;
    return { slug: entry.name, words };
  })
  .sort((a, b) => a.words - b.words);

const thinPages = pages.filter((page) => page.words < minimumWords);
for (const page of pages) {
  console.log(`${page.words >= minimumWords ? 'PASS' : 'WARN'} ${page.words} words /tools/${page.slug}`);
}
console.log(`Checked ${pages.length} generated tool pages; ${thinPages.length} below ${minimumWords} words.`);

if (thinPages.length > 0) {
  process.exitCode = 1;
}
