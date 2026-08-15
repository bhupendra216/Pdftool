import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools } from '../artifacts/api-server/src/lib/content.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = (process.env.VITE_SITE_URL || 'https://pdfkira.vercel.app').replace(/\/+$/, '');
const outDir = path.resolve(__dirname, '../artifacts/pdf-tools/public');

const sitemapItems = [
  { loc: `${siteUrl}/`, changefreq: 'weekly' },
  { loc: `${siteUrl}/tools`, changefreq: 'weekly' },
];

for (const tool of tools) {
  sitemapItems.push({
    loc: `${siteUrl}/tools/${tool.slug}`,
    changefreq: 'weekly',
  });
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems
  .map(
    (item) =>
      `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n  </url>`,
  )
  .join('\n')}\n</urlset>`;

fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf-8');

const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt, 'utf-8');

console.log('Generated sitemap.xml and robots.txt using site URL:', siteUrl);
