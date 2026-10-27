import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('artifacts/pdf-tools/dist/public');
const htmlFiles = [];
const sitemapPath = path.join(root, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const canonicalPaths = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/pdfkira\.com([^<]*)<\/loc>/g)].map(([, pathname]) => pathname),
);
const redirectRules = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects ?? [];
const redirects = new Map(
  redirectRules
    .filter((rule) => typeof rule.source === 'string' && typeof rule.destination === 'string')
    .map((rule) => [rule.source, rule.destination]),
);
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
}
walk(root);

const failures = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    if (/^https?:\/\/(?:www\.)?pdfkira\.com(?:\/|$)/i.test(href) || /localhost/i.test(href)) {
      failures.add(`Non-relative internal URL ${href} (${path.relative(root, file)})`);
      continue;
    }
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/')) continue;
    const clean = href.split(/[?#]/, 1)[0];
    if (redirects.has(clean)) {
      failures.add(`${clean} redirects to ${redirects.get(clean)} (${path.relative(root, file)})`);
      continue;
    }
    if (!canonicalPaths.has(clean)) {
      failures.add(`Non-canonical or unlisted route ${clean} (${path.relative(root, file)})`);
      continue;
    }
    const target = clean.endsWith('/') ? path.join(root, clean.slice(1), 'index.html') : path.join(root, clean.slice(1));
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) failures.add(`${clean} does not resolve (${path.relative(root, file)})`);
  }
}
if (failures.size) {
  console.error([...failures].join('\n'));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files; all internal links use listed canonical routes.`);
