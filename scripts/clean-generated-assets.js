#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlRoots = [
  path.join(root, 'public'),
  path.join(root, 'artifacts/pdf-tools/public'),
];
const assetDirs = htmlRoots.map((directory) => path.join(directory, 'assets'));
const [deployedAssetsDir, sourceAssetsDir] = assetDirs;
const referencedAssets = new Set();

function collectHtmlReferences(directory) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') collectHtmlReferences(filePath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    for (const [, reference] of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
      const asset = reference.split(/[?#]/, 1)[0].match(/(?:^|\/)assets\/([^/]+)$/)?.[1];
      if (asset) referencedAssets.add(asset);
    }
  }
}

for (const directory of htmlRoots) collectHtmlReferences(directory);

if (fs.existsSync(deployedAssetsDir)) {
  fs.mkdirSync(sourceAssetsDir, { recursive: true });
  for (const asset of referencedAssets) {
    const deployedAssetPath = path.join(deployedAssetsDir, asset);
    const sourceAssetPath = path.join(sourceAssetsDir, asset);
    if (fs.existsSync(deployedAssetPath) && !fs.existsSync(sourceAssetPath)) {
      fs.copyFileSync(deployedAssetPath, sourceAssetPath);
    }
  }
}

let removedCount = 0;
for (const assetsDir of assetDirs) {
  if (!fs.existsSync(assetsDir)) continue;

  for (const entry of fs.readdirSync(assetsDir, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:js|css|map)$/.test(entry.name) && !referencedAssets.has(entry.name)) {
      fs.unlinkSync(path.join(assetsDir, entry.name));
      removedCount += 1;
    }
  }
}

console.log(`Removed ${removedCount} unreferenced generated JavaScript, CSS, and source-map assets.`);
