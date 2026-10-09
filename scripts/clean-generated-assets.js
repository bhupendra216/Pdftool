#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'artifacts/pdf-tools/public/assets');

if (fs.existsSync(assetsDir)) {
  for (const entry of fs.readdirSync(assetsDir, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:js|css|map)$/.test(entry.name)) {
      fs.unlinkSync(path.join(assetsDir, entry.name));
    }
  }
}

console.log('Removed stale generated JavaScript, CSS, and source-map assets.');
