import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools, type ToolRecord } from '../artifacts/api-server/src/lib/content.ts';
import { TOOL_SEO_CONTENT } from '../artifacts/pdf-tools/src/data/toolSeoContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = (process.env.VITE_SITE_URL || 'https://pdfkira.com').replace(/\/+$/, '');
// Prefer the built `dist/public` (hashed assets) first, then the legacy `public`.
const outDirs = [
  path.resolve(__dirname, '../artifacts/pdf-tools/dist/public'),
  path.resolve(__dirname, '../artifacts/pdf-tools/public'),
].filter((dir, index, list) => list.indexOf(dir) === index);

const escapeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&amp;amp;')
    .replace(/&lt;/g, '&amp;lt;')
    .replace(/&gt;/g, '&amp;gt;')
    .replace(/"/g, '&amp;quot;')
    .replace(/'/g, '&amp;#39;');

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

// Read asset paths from the built index.html
function getAssetPaths(outDir: string): { jsPath: string; cssPath: string } {
  const indexPath = path.join(outDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.warn(`index.html not found at ${indexPath}, using fallback asset paths`);
    return { jsPath: '/assets/index.js', cssPath: '/assets/index.css' };
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Extract JS path
  const jsMatch = indexContent.match(/src="(\/assets\/[^"]+\.js)"/);
  const jsPath = jsMatch ? jsMatch[1] : '/assets/index.js';
  
  // Extract CSS path
  const cssMatch = indexContent.match(/href="(\/assets\/[^"]+\.css)"/);
  const cssPath = cssMatch ? cssMatch[1] : '/assets/index.css';
  
  console.log(`Found assets: JS=${jsPath}, CSS=${cssPath}`);
  return { jsPath, cssPath };
}

function renderToolPageHtml(tool: ToolRecord, assets: { jsPath: string; cssPath: string }) {
  // Prefer explicit TOOL_SEO_CONTENT for richer, prerendered SEO copy.
  const seoEntry = TOOL_SEO_CONTENT[tool.slug];

  const steps = (seoEntry?.howItWorks || tool.steps || [])
    .map((step: any) => {
      const text = typeof step === 'string' ? step : step.description || step.title || '';
      return `<li>${escapeHtml(text)}</li>`;
    })
    .join('');

  const whyUseHtml = (seoEntry?.whyUse || [])
    .map((w: any) => `<div><h3>${escapeHtml(w.title)}</h3><p>${escapeHtml(w.description)}</p></div>`)
    .join('');

  const faqs = (seoEntry?.faq?.length ? seoEntry.faq : tool.faqs)
    .map(
      (item: any) => `
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${escapeHtml(tool.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(tool.seoDescription)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${toolUrl}" />
    <meta property="og:title" content="${escapeHtml(tool.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(tool.seoDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${toolUrl}" />
    <meta property="og:image" content="${siteUrl}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.seoDescription)}" />
    
    <!-- React SPA CSS -->
    <link rel="stylesheet" href="${assets.cssPath}" />
    
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
    <!-- SEO Fallback Content (visible to bots, hidden after React hydration) -->
    <div id="seo-fallback" style="display: block;">
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
          <h2>Why use this tool</h2>
          ${whyUseHtml}
        </section>

        <section>
          <h2>Frequently asked questions</h2>
          <ul>${faqs}</ul>
        </section>

        <p><a href="/tools">Browse all PDF tools</a></p>
      </main>
    </div>
    
    <!-- React Mount Point -->
    <div id="root"></div>
    
    <!-- React SPA Bundle -->
    <script type="module" src="${assets.jsPath}"></script>
    
    <!-- Hide SEO fallback after React hydration -->
    <script>
      (function() {
        // Wait until the client has rendered a ToolSeoSection (it sets
        // window.__renderedToolSeo = true before hiding the prerendered
        // SEO fallback. This prevents hiding the SEO copy when the SPA
        // navigates to a prerendered page but fails to render the content.
        var checkInterval = setInterval(function() {
          try {
            var root = document.getElementById('root');
            var rendered = window.__renderedToolSeo === true;
            if (rendered) {
              var fallback = document.getElementById('seo-fallback');
              if (fallback) fallback.style.display = 'none';
              clearInterval(checkInterval);
              return;
            }
            // If React populated the root but didn't render the SEO section,
            // keep the fallback visible so users still see content.
            if (root && root.childNodes.length > 0 && window.__renderedToolSeo !== false) {
              // do nothing yet; wait for explicit flag or the timeout
            }
          } catch (e) {
            // ignore
          }
        }, 100);

        // NOTE: do not hide the prerendered SEO fallback automatically here.
        // The fallback should remain visible until the client explicitly
        // renders the ToolSeoSection component and sets window.__renderedToolSeo = true.
      })();
    </script>
    
    <!-- No-JS fallback: show SEO content if JavaScript is disabled -->
    <noscript>
      <style>#seo-fallback { display: block !important; }</style>
    </noscript>
  </body>
</html>`;
}

function renderToolsIndexHtml(assets: { jsPath: string; cssPath: string }) {
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
    <meta property="og:image" content="${siteUrl}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    
    <!-- React SPA CSS -->
    <link rel="stylesheet" href="${assets.cssPath}" />
    
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
    <!-- SEO Fallback -->
    <div id="seo-fallback" style="display: block;">
      <main>
        <h1>PDFKira Tools</h1>
        <p>Free online PDF tools for merging, splitting, compressing, converting, organizing, and editing PDF files.</p>
        <ul>${cards}</ul>
      </main>
    </div>
    
    <!-- React Mount Point -->
    <div id="root"></div>
    
    <!-- React SPA Bundle -->
    <script type="module" src="${assets.jsPath}"></script>
    
    <!-- Hide SEO fallback after hydration -->
    <script>
      (function() {
        var checkInterval = setInterval(function() {
          var root = document.getElementById('root');
          if (root && root.childNodes.length > 0) {
            var fallback = document.getElementById('seo-fallback');
            if (fallback) fallback.style.display = 'none';
            clearInterval(checkInterval);
          }
        }, 100);
        setTimeout(function() {
          var fallback = document.getElementById('seo-fallback');
          if (fallback) fallback.style.display = 'none';
          clearInterval(checkInterval);
        }, 5000);
      })();
    </script>
    
    <noscript>
      <style>#seo-fallback { display: block !important; }</style>
    </noscript>
  </body>
</html>`;
}

function writeStaticFiles() {
  // Prefer extracting asset paths from the built `dist/public` (first outDir).
  const preferredOut = outDirs[0];
  const preferredAssets = getAssetPaths(preferredOut);

  for (const outDir of outDirs) {
    ensureDir(outDir);
    ensureDir(path.join(outDir, 'tools'));

    // Use the preferred assets (hashed) for all generated pages so we don't
    // accidentally write fallback /assets/index.js/css into any output dir.
    const assets = preferredAssets;

    // Write robots.txt
    fs.writeFileSync(
      path.join(outDir, 'robots.txt'),
      `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
      'utf-8'
    );

    // Write sitemap.xml
    const sitemapItems = [
      { loc: `${siteUrl}/`, changefreq: 'weekly' },
      { loc: `${siteUrl}/tools`, changefreq: 'weekly' },
      { loc: `${siteUrl}/compare/ilovepdf-vs-smallpdf-vs-pdfkira`, changefreq: 'weekly' },
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
    // Write tools index page
    fs.writeFileSync(path.join(outDir, 'tools', 'index.html'), renderToolsIndexHtml(assets), 'utf-8');

    // Write individual tool pages
    for (const tool of tools) {
      const toolDir = path.join(outDir, 'tools', tool.slug);
      ensureDir(toolDir);
      fs.writeFileSync(path.join(toolDir, 'index.html'), renderToolPageHtml(tool, assets), 'utf-8');
    }

    // Write root aliases (e.g., /merge-pdf -> /tools/merge-pdf)
    const rootAliasSet = new Set<string>();
    for (const tool of tools) {
      rootAliasSet.add(tool.slug);
      const alias = tool.slug.replace(/-pdf$/, '');
      if (alias && alias !== tool.slug) rootAliasSet.add(alias);
    }

    for (const alias of rootAliasSet) {
      const aliasDir = path.join(outDir, alias);
      ensureDir(aliasDir);
      const targetTool = tools.find((tool) => tool.slug === alias || tool.slug.replace(/-pdf$/, '') === alias);
      if (!targetTool) continue;
      fs.writeFileSync(path.join(aliasDir, 'index.html'), renderToolPageHtml(targetTool, assets), 'utf-8');
    }

    console.log(`Generated static files in ${outDir}:`);
    console.log(`  - robots.txt`);
    console.log(`  - sitemap.xml (${sitemapItems.length} URLs)`);
    console.log(`  - tools/index.html`);
    console.log(`  - ${tools.length} tool pages`);
    console.log(`  - ${rootAliasSet.size} root aliases`);
  }

  // After writing, verify every generated HTML references real asset files.
  const missingReferences: Array<{ html: string; asset: string }> = [];

  // Ensure secondary outDirs have the preferred assets available so their
  // generated HTML can reference the hashed files. Copy only missing files.
  const preferredAssetsDir = path.join(preferredOut, 'assets');
  if (fs.existsSync(preferredAssetsDir)) {
    for (const outDir of outDirs) {
      if (outDir === preferredOut) continue;
      const targetAssetsDir = path.join(outDir, 'assets');
      ensureDir(targetAssetsDir);
      try {
        const files = fs.readdirSync(preferredAssetsDir);
        for (const file of files) {
          const src = path.join(preferredAssetsDir, file);
          const dst = path.join(targetAssetsDir, file);
          if (!fs.existsSync(dst)) {
            fs.copyFileSync(src, dst);
          }
        }
      } catch (err) {
        console.warn(`Warning: failed to copy preferred assets to ${outDir}: ${String(err)}`);
      }
    }
  }

  function collectHtmlFiles(dir: string) {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectHtmlFiles(full));
      } else if (entry.isFile() && full.endsWith('.html')) {
        results.push(full);
      }
    }
    return results;
  }

  for (const outDir of outDirs) {
    const htmlFiles = collectHtmlFiles(outDir);
    for (const htmlFile of htmlFiles) {
      const content = fs.readFileSync(htmlFile, 'utf-8');
      const assetRegex = /\/(assets\/[^"'\s>]+\.(?:js|css))/g;
      let m: RegExpExecArray | null;
      while ((m = assetRegex.exec(content))) {
        const assetPath = '/' + m[1];
        const assetOnDisk = path.join(outDir, assetPath.replace(/^\//, ''));
        if (!fs.existsSync(assetOnDisk)) {
          missingReferences.push({ html: htmlFile, asset: assetPath });
        }
      }
    }
  }

  if (missingReferences.length > 0) {
    console.error('ERROR: Missing asset files referenced by generated HTML:');
    for (const miss of missingReferences) {
      console.error(`  - HTML: ${miss.html} references missing asset: ${miss.asset}`);
    }
    console.error('\nBuild failed: missing assets referenced from generated static HTML.');
    process.exit(1);
  }

  // If multiple outDirs exist, warn if their asset filename sets differ.
  if (outDirs.length >= 2) {
    const [preferred, other] = outDirs;
    const preferredAssetsDir = path.join(preferred, 'assets');
    const otherAssetsDir = path.join(other, 'assets');
    if (fs.existsSync(preferredAssetsDir) && fs.existsSync(otherAssetsDir)) {
      const preferredFiles = new Set(fs.readdirSync(preferredAssetsDir));
      const otherFiles = new Set(fs.readdirSync(otherAssetsDir));
      const diffA = [...preferredFiles].filter((f) => !otherFiles.has(f));
      const diffB = [...otherFiles].filter((f) => !preferredFiles.has(f));
      if (diffA.length > 0 || diffB.length > 0) {
        console.warn('WARNING: Asset filename mismatch between outDirs:');
        if (diffA.length > 0) console.warn(`  - In ${preferred} only: ${diffA.join(', ')}`);
        if (diffB.length > 0) console.warn(`  - In ${other} only: ${diffB.join(', ')}`);
        console.warn('This may indicate inconsistent builds or stale assets; please investigate.');
      }
    }
  }

}

writeStaticFiles();
console.log('Done! Static files generated with React SPA bundles.');
