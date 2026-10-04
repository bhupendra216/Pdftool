import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools, type ToolRecord } from '../artifacts/api-server/src/lib/content.ts';
import { TOOL_SEO_CONTENT } from '../artifacts/pdf-tools/src/data/toolSeoContent.ts';
import { ensureToolFaqs } from '../artifacts/pdf-tools/src/lib/toolSeoContent.ts';
import { resolveToolOgImage, toolsSEO } from '../artifacts/pdf-tools/src/data/seoConfig.js';

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

const GOOGLE_TAG_SNIPPET = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-K58M67QSPV"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-K58M67QSPV');
    </script>`;

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function injectGoogleTagIntoHtml(html: string) {
  const headMatch = html.match(/<head\b[^>]*>/i);
  if (!headMatch) return html;

  const headTag = headMatch[0];
  const deduped = html.replace(new RegExp(escapeRegex(GOOGLE_TAG_SNIPPET), 'gi'), '');
  return deduped.replace(headTag, `${headTag}${GOOGLE_TAG_SNIPPET}`);
}

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

function resolveAbsoluteImageUrl(image: string | undefined, fallback = `${siteUrl}/logo.png`) {
  if (!image) return fallback;
  if (image.startsWith('http')) return image;
  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;
}

function renderToolPageHtml(tool: ToolRecord, assets: { jsPath: string; cssPath: string }) {
  // Prefer explicit TOOL_SEO_CONTENT for richer, prerendered SEO copy.
  const seoEntry = TOOL_SEO_CONTENT[tool.slug];
  const toolOgImage = resolveToolOgImage(tool.slug, `${siteUrl}/logo.png`);
  const ogImageUrl = resolveAbsoluteImageUrl(toolOgImage);

  const steps = (seoEntry?.howItWorks || tool.steps || [])
    .map((step: any) => {
      const text = typeof step === 'string' ? step : step.description || step.title || '';
      return `<li>${escapeHtml(text)}</li>`;
    })
    .join('');

  const whyUseHtml = (seoEntry?.whyUse || [])
    .map((w: any) => `<div><h3>${escapeHtml(w.title)}</h3><p>${escapeHtml(w.description)}</p></div>`)
    .join('');

  const pageFaqs = ensureToolFaqs(
    tool.name,
    tool.slug,
    seoEntry?.faq?.length ? seoEntry.faq : tool.faqs,
  );

  const faqs = pageFaqs
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
    <meta property="og:image" content="${ogImageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.seoDescription)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    
    <!-- React SPA CSS -->
    <link rel="stylesheet" href="${assets.cssPath}" />

    <script>
      (function() {
        try {
          document.documentElement.classList.add('js');
        } catch (e) {
          // ignore
        }
      })();
    </script>
    <style>
      html.js #seo-fallback { display: none !important; }
      html:not(.js) #seo-fallback { display: block !important; }
    </style>
    
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
    <!-- SEO Fallback Content (visible to bots, hidden immediately when JS is enabled) -->
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

    <!-- Keep the SEO content visible for bots / no-JS, but hide it immediately when JS is available. -->
    <noscript>
      <style>#seo-fallback { display: block !important; }</style>
    </noscript>
  </body>
</html>`;

  return injectGoogleTagIntoHtml(html);
}

function renderToolsIndexHtml(assets: { jsPath: string; cssPath: string }) {
  const description =
    'Browse free online PDF tools to merge, split, compress, convert, and organize documents. Pick a secure browser-based workflow and get started with PDFKira.';
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

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDF Tools | PDFKira</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${siteUrl}/tools" />
    <meta property="og:title" content="PDF Tools | PDFKira" />
    <meta property="og:description" content="${description}" />
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

  return injectGoogleTagIntoHtml(html);
}

function renderComparisonPageHtml(assets: { jsPath: string; cssPath: string }) {
  const title = 'iLovePDF vs Smallpdf vs PDFKira';
  const description =
    'Compare iLovePDF, Smallpdf, and PDFKira by features, free access, and privacy to find the right PDF workflow for you. Review options and choose a tool.';
  const canonical = `${siteUrl}/compare/ilovepdf-vs-smallpdf-vs-pdfkira`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <link rel="stylesheet" href="${assets.cssPath}" />
    <script>
      document.documentElement.classList.add('js');
    </script>
    <style>
      html.js #seo-fallback { display: none !important; }
      html:not(.js) #seo-fallback { display: block !important; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <div id="seo-fallback">
      <main>
        <h1>${title}</h1>
        <p>${description}</p>
        <h2>Compare PDF tools for your workflow</h2>
        <p>Consider the tools you need, whether free use meets your needs, how each service handles files, and whether you prefer a quick browser-based task or a larger platform. Features and limits can change, so review each provider's current terms before choosing.</p>
        <ul>
          <li>iLovePDF offers a broad collection of PDF utilities.</li>
          <li>Smallpdf focuses on common document workflows and a polished interface.</li>
          <li>PDFKira provides free core tools for common browser-based tasks without a required account.</li>
        </ul>
        <h2>Frequently asked questions</h2>
        <h3>Is PDFKira free?</h3>
        <p>PDFKira's core tools are currently free to use for common document workflows.</p>
        <h3>Do I need an account to use PDFKira?</h3>
        <p>No account is required for the core browser-based workflows.</p>
        <h3>Which PDF service should I choose?</h3>
        <p>Choose the service that supports your file format, features, privacy needs, and expected usage.</p>
        <p><a href="/tools">Browse PDF tools</a> or try <a href="/tools/merge-pdf">Merge PDF</a>.</p>
      </main>
    </div>
    <script type="module" src="${assets.jsPath}"></script>
    <noscript><style>#seo-fallback { display: block !important; }</style></noscript>
  </body>
</html>`;
}

function renderHomeSeoBlock() {
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

  return `<!-- SEO Fallback -->\n<div id="seo-fallback" style="display: block;">\n  <main>\n    <h1>PDFKira</h1>\n    <p>Free online PDF tools for merging, splitting, compressing, converting, organizing, and editing PDF files.</p>\n    <p><a href="/tools">Browse all PDF tools</a></p>\n    <ul>${cards}</ul>\n  </main>\n</div>`;
}

function patchHomepageHtml(outDir: string) {
  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let content = fs.readFileSync(indexPath, 'utf-8');
  content = content.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${siteUrl}/" />`,
  );
  content = content.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${siteUrl}/" />`,
  );
  if (content.indexOf('id="seo-fallback"') !== -1) {
    fs.writeFileSync(indexPath, content, 'utf-8');
    return;
  }

  content = injectGoogleTagIntoHtml(content);

  // Inject the instant hide JS + CSS into <head> so #seo-fallback is hidden before first paint
  const headCloseIndex = content.search(/<\/head>/i);
  if (headCloseIndex !== -1) {
    const headInjection = `\n    <script>\n      (function() {\n        try { document.documentElement.classList.add('js'); } catch (e) { }\n      })();\n    </script>\n    <style>\n      html.js #seo-fallback { display: none !important; }\n      html:not(.js) #seo-fallback { display: block !important; }\n    </style>\n`;
    content = content.slice(0, headCloseIndex) + headInjection + content.slice(headCloseIndex);
  } else {
    console.warn(`Could not find </head> in ${indexPath}; skipping head injection.`);
  }

  // Find the root mount point (<div ... id="root" ...>...</div>) without assuming exact whitespace
  const openTagMatch = content.match(/<div[^>]*id\s*=\s*["']root["'][^>]*>/i);
  if (!openTagMatch) {
    console.warn(`Could not find a root mount point in ${indexPath}; skipping homepage SEO patch.`);
    return;
  }

  const openTagEnd = content.indexOf(openTagMatch[0]) + openTagMatch[0].length;
  // Find the closing </div> for that root node after the opening tag
  const closeTagIndex = content.indexOf('</div>', openTagEnd);
  if (closeTagIndex === -1) {
    console.warn(`Could not find closing </div> for root in ${indexPath}; skipping homepage SEO patch.`);
    return;
  }

  const insertPos = closeTagIndex + '</div>'.length;

  const seoBlock = renderHomeSeoBlock();

  const patched = content.slice(0, insertPos) + '\n' + seoBlock + content.slice(insertPos);
  fs.writeFileSync(indexPath, patched, 'utf-8');
  console.log(`Patched homepage index.html with SEO fallback: ${indexPath}`);
}

function injectGoogleTagIntoAllHtmlFiles(outDir: string) {
  const stack = [outDir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || !fs.existsSync(current)) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && fullPath.endsWith('.html')) {
        const original = fs.readFileSync(fullPath, 'utf-8');
        const patched = injectGoogleTagIntoHtml(original);
        if (patched !== original) {
          fs.writeFileSync(fullPath, patched, 'utf-8');
        }
      }
    }
  }
}

function writeStaticFiles() {
  // Prefer extracting asset paths from the built `dist/public` (first outDir).
  const preferredOut = outDirs[0];
  const preferredAssets = getAssetPaths(preferredOut);

  for (const outDir of outDirs) {
    ensureDir(outDir);
    ensureDir(path.join(outDir, 'tools'));
    // Inject SEO fallback into the built homepage index.html if needed
    patchHomepageHtml(outDir);

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
      ...tools
        .filter((tool) => tool.status === 'available')
        .map((tool) => ({ loc: `${siteUrl}/tools/${tool.slug}`, changefreq: 'weekly' as const })),
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
    const comparisonDir = path.join(outDir, 'compare', 'ilovepdf-vs-smallpdf-vs-pdfkira');
    ensureDir(comparisonDir);
    fs.writeFileSync(path.join(comparisonDir, 'index.html'), renderComparisonPageHtml(assets), 'utf-8');

    // Write individual tool pages
    for (const tool of tools) {
      const toolDir = path.join(outDir, 'tools', tool.slug);
      ensureDir(toolDir);
      fs.writeFileSync(path.join(toolDir, 'index.html'), renderToolPageHtml(tool, assets), 'utf-8');
    }

    console.log(`Generated static files in ${outDir}:`);
    console.log(`  - robots.txt`);
    console.log(`  - sitemap.xml (${sitemapItems.length} URLs)`);
    console.log(`  - tools/index.html`);
    console.log(`  - ${tools.length} tool pages`);
    console.log(`  - comparison page`);
  }

  for (const outDir of outDirs) {
    injectGoogleTagIntoAllHtmlFiles(outDir);
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
