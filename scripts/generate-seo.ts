import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools, type ToolRecord } from '../artifacts/api-server/src/lib/content.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = (process.env.VITE_SITE_URL || 'https://pdfkira.com').replace(/\/+$/, '');
const outDirs = [
  path.resolve(__dirname, '../artifacts/pdf-tools/public'),
  path.resolve(__dirname, '../artifacts/pdf-tools/dist/public'),
].filter((dir, index, list) => list.indexOf(dir) === index);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function renderToolsIndexHtml() {
  const cards = tools
    .map(
      (tool) => `
        <li>
          <a href="${siteUrl}/tools/${tool.slug}" aria-label="Use ${escapeHtml(tool.name)}">
            <h2>${escapeHtml(tool.name)}</h2>
            <p>${escapeHtml(tool.shortDescription)}</p>
          </a>
        </li>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDF Tools | PDFKira</title>
    <meta name="description" content="Free online PDF tools from PDFKira: merge, split, compress, convert, organize, and edit PDFs in your browser." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${siteUrl}/tools" />
    <meta property="og:title" content="PDF Tools | PDFKira" />
    <meta property="og:description" content="Free online PDF tools from PDFKira: merge, split, compress, convert, organize, and edit PDFs in your browser." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${siteUrl}/tools" />
    <meta property="og:image" content="${siteUrl}/favicon.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PDF Tools | PDFKira" />
    <meta name="twitter:description" content="Free online PDF tools from PDFKira: merge, split, compress, convert, organize, and edit PDFs in your browser." />
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'PDFKira tools',
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: tool.name,
            applicationCategory: 'Utility',
            operatingSystem: 'Web',
            url: `${siteUrl}/tools/${tool.slug}`,
          },
        })),
      })}
    </script>
  </head>
  <body>
    <main>
      <h1>PDFKira Tools</h1>
      <p>Free online PDF tools for merging, splitting, compressing, converting, organizing, and editing PDF files.</p>
      <ul>${cards}</ul>
    </main>
  </body>
</html>`;
}

function renderToolPageHtml(tool: ToolRecord) {
  const steps = tool.steps
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('');

  const faqs = tool.faqs
    .map(
      (item) => `
        <li>
          <h3>${escapeHtml(item.question)}</h3>
          <p>${escapeHtml(item.answer)}</p>
        </li>`,
    )
    .join('');

  const toolUrl = `${siteUrl}/tools/${tool.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(tool.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(tool.seoDescription)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${toolUrl}" />
    <meta property="og:title" content="${escapeHtml(tool.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(tool.seoDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${toolUrl}" />
    <meta property="og:image" content="${siteUrl}/favicon.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.seoDescription)}" />
    <script type="application/ld+json">
      ${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.seoDescription,
        operatingSystem: 'Web',
        applicationCategory: 'Utility',
        url: toolUrl,
        offers: {
          '@type': 'Offer',
          price: 0,
          priceCurrency: 'USD',
        },
      })}
    </script>
  </head>
  <body>
    <main>
      <header>
        <p>PDFKira</p>
        <h1>${escapeHtml(tool.name)}</h1>
        <p>${escapeHtml(tool.shortDescription)}</p>
      </header>

      <section>
        <h2>How it works</h2>
        <ol>${steps}</ol>
      </section>

      <section>
        <h2>Frequently asked questions</h2>
        <ul>${faqs}</ul>
      </section>

      <p><a href="/tools">Browse all PDF tools</a></p>
    </main>
  </body>
</html>`;
}

function writeStaticFiles() {
  for (const outDir of outDirs) {
    ensureDir(outDir);
    ensureDir(path.join(outDir, 'tools'));

    fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf-8');

    const sitemapItems = [
      { loc: `${siteUrl}/`, changefreq: 'weekly' },
      { loc: `${siteUrl}/tools`, changefreq: 'weekly' },
      ...tools.map((tool) => ({
        loc: `${siteUrl}/tools/${tool.slug}`,
        changefreq: 'weekly' as const,
      })),
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems
      .map(
        (item) =>
          `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n  </url>`,
      )
      .join('\n')}\n</urlset>`;

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.join(outDir, 'tools', 'index.html'), renderToolsIndexHtml(), 'utf-8');

    const rootAliasSet = new Set<string>();
    for (const tool of tools) {
      rootAliasSet.add(tool.slug);
      const alias = tool.slug.replace(/-pdf$/, '');
      if (alias && alias !== tool.slug) rootAliasSet.add(alias);
    }

    for (const tool of tools) {
      const toolDir = path.join(outDir, 'tools', tool.slug);
      ensureDir(toolDir);
      fs.writeFileSync(path.join(toolDir, 'index.html'), renderToolPageHtml(tool), 'utf-8');
    }

    for (const alias of rootAliasSet) {
      const aliasDir = path.join(outDir, alias);
      ensureDir(aliasDir);
      const targetTool = tools.find((tool) => tool.slug === alias || tool.slug.replace(/-pdf$/, '') === alias);
      if (!targetTool) continue;
      fs.writeFileSync(path.join(aliasDir, 'index.html'), renderToolPageHtml(targetTool), 'utf-8');
    }
  }
}

writeStaticFiles();
console.log('Generated canonical tool pages, root tool aliases, sitemap.xml and robots.txt using site URL:', siteUrl);
