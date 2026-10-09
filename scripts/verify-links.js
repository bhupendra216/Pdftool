import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('artifacts/pdf-tools/dist/public');
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
}
walk(root);

const missing = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/')) continue;
    const clean = href.split(/[?#]/, 1)[0];
    const target = clean.endsWith('/') ? path.join(root, clean.slice(1), 'index.html') : path.join(root, clean.slice(1));
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) missing.add(`${clean} (${path.relative(root, file)})`);
  }
}
if (missing.size) {
  console.error([...missing].join('\n'));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files; all internal links resolve.`);
