import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { blogPosts, tools, type ToolRecord } from '../artifacts/api-server/src/lib/content.ts';
import { getToolSeoContent } from '../artifacts/pdf-tools/src/lib/toolSeoContent.ts';
import { resolveToolOgImage, toolsSEO } from '../artifacts/pdf-tools/src/data/seoConfig.js';
import { clientToolContent } from '../artifacts/pdf-tools/src/data/clientToolContent';
import { aiJobsFaqs } from '../artifacts/pdf-tools/src/data/aiJobsFaqs.ts';
import { gigCategorySections, gigPlatforms } from '../data/gig-platforms.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = 'https://pdfkira.com';
// Prefer the built `dist/public` (hashed assets) first, then the legacy `public`.
const outDirs = [
  path.resolve(__dirname, '../artifacts/pdf-tools/dist/public'),
  path.resolve(__dirname, '../artifacts/pdf-tools/public'),
].filter((dir, index, list) => list.indexOf(dir) === index);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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

function formatArticleDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function blogMarkdown(article: (typeof blogPosts)[number]) {
  return article.content
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
    .replace(/^#\s+.+\n+/, '');
}

function blogDescription(article: (typeof blogPosts)[number]) {
  if (article.seoDescription) return article.seoDescription;
  if (article.excerpt && article.excerpt !== article.title) return article.excerpt;

  const firstParagraph = blogMarkdown(article)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/[#*_`[\]]/g, '').replace(/\s+/g, ' ').trim())
    .find(Boolean);
  if (!firstParagraph) return article.title;
  return firstParagraph.length > 160 ? `${firstParagraph.slice(0, 157).trimEnd()}...` : firstParagraph;
}

function renderBlogArticleBody(article: (typeof blogPosts)[number]) {
  const markdown = blogMarkdown(article);
  const articleHtml = marked.parse(markdown);
  const publishedDate = formatArticleDate(article.publishedAt);
  const updatedDate = article.updatedAt ? formatArticleDate(article.updatedAt) : '';

  return `<article>
  <div class="article-meta">
    <time datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(publishedDate)}</time>
    <span>By PDFKira Team</span>
    <span>${article.readingMinutes} min read</span>
    ${updatedDate ? `<span>Updated ${escapeHtml(updatedDate)}</span>` : ''}
  </div>
  <div class="article-content">${articleHtml}</div>
  <footer>
    <p>Published: <time datetime="${escapeHtml(article.publishedAt)}">${escapeHtml(publishedDate)}</time></p>
    ${updatedDate ? `<p>Updated: <time datetime="${escapeHtml(article.updatedAt ?? '')}">${escapeHtml(updatedDate)}</time></p>` : ''}
    <nav aria-label="Article navigation">
      <a href="/blog">← All Articles</a>
      <a href="/tools">Try Our PDF Tools →</a>
    </nav>
  </footer>
</article>`;
}

function toolPageUrl(slug: string) {
  return `${siteUrl}/tools/${slug}`;
}

function renderToolPageHtml(tool: ToolRecord, assets: { jsPath: string; cssPath: string }) {
  const seoEntry = getToolSeoContent(tool.slug);
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

  const pageFaqs = seoEntry?.faq?.length ? seoEntry.faq : tool.faqs;

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
        '@graph': [
          {
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
          },
          {
            '@type': 'FAQPage',
            mainEntity: pageFaqs.map((faq: any) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ],
      }).replace(/</g, '\\u003c')}
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

        ${steps ? `<section><h2>How it works</h2><ol>${steps}</ol></section>` : ''}
        ${whyUseHtml ? `<section><h2>Why use this tool</h2>${whyUseHtml}</section>` : ''}
        ${faqs ? `<section><h2>Frequently asked questions</h2><ul>${faqs}</ul></section>` : ''}

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

function renderClientToolPageHtml(tool: (typeof clientToolContent)[number], assets: { jsPath: string; cssPath: string }) {
  const canonical = `${siteUrl}/tools/${tool.slug}`;
  const benefits = tool.benefits
    .map((benefit) => `<article><h3>${escapeHtml(benefit.title)}</h3><p>${escapeHtml(benefit.description)}</p></article>`)
    .join('');
  const faqs = tool.faqs
    .map((faq) => `<li><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></li>`)
    .join('');
  const related = tool.related
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join('');
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        url: canonical,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(tool.title)}</title>
    <meta name="description" content="${escapeHtml(tool.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:image" content="${siteUrl}/logo.png" />
    <link rel="stylesheet" href="${assets.cssPath}" />
    <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
    <script>document.documentElement.classList.add('js');</script>
    <style>html.js #seo-fallback { display: none !important; } html:not(.js) #seo-fallback { display: block !important; }</style>
  </head>
  <body>
    <div id="seo-fallback" style="display:block">
      <main>
        <p><a href="/">PDFKira</a></p>
        <h1>${escapeHtml(tool.name)}</h1>
        <p>${escapeHtml(tool.intro)}</p>
        <section><h2>How it works</h2><ol>${tool.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section>
        <section><h2>Why use this tool</h2>${benefits}</section>
        <section><h2>Frequently asked questions</h2><ul>${faqs}</ul></section>
        <nav aria-label="Related tools"><h2>Related tools</h2><ul>${related}</ul></nav>
      </main>
    </div>
    <div id="root"></div>
    <script type="module" src="${assets.jsPath}"></script>
    <noscript><style>#seo-fallback { display:block !important; }</style></noscript>
  </body>
</html>`;
}

function renderToolsIndexHtml(assets: { jsPath: string; cssPath: string }) {
  const description =
    'Browse free online PDF tools to merge, split, compress, convert, and organize documents. Pick a secure browser-based workflow and get started with PDFKira.';
  const cards = tools
    .map(
      (tool) => `
        <li>
          <a href="${toolPageUrl(tool.slug)}" aria-label="Use ${escapeHtml(tool.name)}">
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
            url: toolPageUrl(tool.slug),
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
    <meta property="og:image" content="${siteUrl}/logo.png" />
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

function renderEditorialPageHtml(
  page: {
    path: string;
    title: string;
    description: string;
    body: string;
    heading?: string;
    jsonLd?: Record<string, unknown>;
  },
  assets: { jsPath: string; cssPath: string },
) {
  const canonical = `${siteUrl}${page.path}`;
  const title = page.title.endsWith('| PDFKira') ? page.title : `${page.title} | PDFKira`;
  const jsonLd = page.jsonLd
    ? `<script id="structured-data-jsonld" type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:image" content="${siteUrl}/logo.png" />
${jsonLd ? `    ${jsonLd}\n` : ''}    <link rel="stylesheet" href="${assets.cssPath}" />
    <script>document.documentElement.classList.add('js');</script>
    <style>html.js #seo-fallback { display: none !important; } html:not(.js) #seo-fallback { display: block !important; }</style>
  </head>
  <body>
    <div id="seo-fallback" style="display:block"><main><h1>${escapeHtml(page.heading || page.title)}</h1>${page.body}</main></div>
    <div id="root"></div>
    <script type="module" src="${assets.jsPath}"></script>
    <noscript><style>#seo-fallback { display:block !important; }</style></noscript>
  </body>
</html>`;
}

function renderGigPlatformsDirectory() {
  const platformAnchor = (name: string) =>
    `gig-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const categoryFilters = gigCategorySections
    .map((category) => `<button type="button" aria-pressed="false" class="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">${escapeHtml(category.title.replace(/^[^ ]+ /, ''))}</button>`)
    .join('');
  const categorySectionsHtml = gigCategorySections.map((category) => {
    const matchingPlatforms = gigPlatforms.filter((platform) => platform.categories.includes(category.id));
    if (matchingPlatforms.length === 0) return '';

    const cards = matchingPlatforms.map((platform) => {
      const isPrimaryCategory = platform.categories[0] === category.id;
      const visitUrl = platform.referralUrl || platform.signupUrl;
      const beginnerBadge = platform.beginnerFriendly
        ? '<span class="rounded-full border border-border px-2.5 py-1 text-xs font-medium">Beginner friendly</span>'
        : '';
      const ratingNote = platform.ratingNote
        ? `<span class="w-full text-xs text-muted-foreground">${escapeHtml(platform.ratingNote)}</span>`
        : '';
      const referralLabel = platform.referralUrl
        ? '<span class="text-xs text-muted-foreground">(referral)</span>'
        : '';
      const anchor = isPrimaryCategory ? ` id="${platformAnchor(platform.name)}"` : '';
      return `<article${anchor} class="flex h-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-foreground"><a href="${escapeHtml(platform.signupUrl)}" target="_blank" rel="noopener noreferrer" class="text-primary underline-offset-4 hover:underline">${escapeHtml(platform.name)}</a></h3>
  <p class="mt-2 flex-1 text-sm leading-6 text-muted-foreground">${escapeHtml(platform.description)}</p>
  <ul class="mt-4 list-disc space-y-1 pl-5 text-sm leading-5 text-foreground">${platform.taskExamples.map((example) => `<li>${escapeHtml(example)}</li>`).join('')}</ul>
  <div class="mt-4 flex min-w-0 flex-wrap gap-2"><span class="max-w-full whitespace-normal break-words rounded-full bg-secondary px-2.5 py-1 text-left text-xs font-medium leading-4 text-secondary-foreground">${escapeHtml(platform.payRange)}</span>${beginnerBadge}${ratingNote}</div>
  <div class="mt-5 flex items-center gap-2"><a href="${escapeHtml(visitUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Visit site →</a>${referralLabel}</div>
</article>`;
    }).join('');

    return `<section class="mb-12" aria-labelledby="category-${category.id}">
  <h2 id="category-${category.id}" class="mb-5 text-2xl font-semibold tracking-tight text-foreground">${escapeHtml(category.title)}</h2>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${cards}</div>
</section>`;
  }).join('');

  return `<section class="container mx-auto max-w-6xl px-4 py-12 md:px-6" aria-labelledby="gig-platforms-title">
  <div class="mb-8 max-w-3xl">
    <h2 id="gig-platforms-title" class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Non-Technical AI Gig Platforms</h2>
    <p class="mt-4 text-base leading-7 text-muted-foreground md:text-lg">Explore remote AI tasks and data collection projects across translation, video recording, photo collection, handwriting, and response review. Some projects are suitable for beginners, though screening, task availability, and qualifications vary by platform.</p>
  </div>
  <div class="mb-8 flex flex-wrap gap-2" aria-label="Filter platforms by task category">
    <button type="button" aria-pressed="true" class="rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">All</button>
    ${categoryFilters}
  </div>
  ${categorySectionsHtml}
</section>`;
}

function renderAiJobsFaqs() {
  return `<section class="container mx-auto max-w-3xl px-4 py-16 md:px-6" aria-labelledby="faq-title">
  <h2 id="faq-title" class="text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
  <div class="mt-8 space-y-4">${aiJobsFaqs.map((faq) => `<details class="rounded-xl border border-border/70 bg-card p-5">
    <summary class="cursor-pointer text-lg font-medium text-foreground">${escapeHtml(faq.question)}</summary>
    <p class="mt-4 text-base leading-7 text-muted-foreground">${escapeHtml(faq.answer)}</p>
  </details>`).join('')}</div>
</section>`;
}

function renderAiJobsPageBody() {
  return `${renderGigPlatformsDirectory()}
${renderAiJobsFaqs()}`;
}

function getStaticPages() {
  const pages = [
    {
      path: '/about',
      title: 'About Us',
      description: 'Learn about PDFKira and our commitment to useful, privacy-conscious PDF tools.',
      body: '<h2>Our Mission</h2><p>PDFKira provides a focused set of PDF tools designed to make document work straightforward and accessible.</p><h2>Privacy First</h2><p>Many tools work directly in your browser. For server-assisted processing, files are transferred securely and temporary copies are removed within one hour.</p><h2>Free for Everyone</h2><p>Core PDFKira tools are available without an account.</p>',
    },
    {
      path: '/blog',
      title: 'Blog and Guides',
      description: 'Guides and practical advice for working with PDFs and document tools.',
      body: `<ul>${blogPosts.map((post) => `<li><a href="${siteUrl}/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a><p>${escapeHtml(post.excerpt)}</p></li>`).join('')}</ul>`,
    },
    {
      path: '/ai-jobs',
      title: 'AI Jobs – Latest Remote AI & Machine Learning Jobs',
      heading: 'AI Jobs',
      description: 'Browse remote AI jobs and non-technical paid AI training tasks, data collection gigs, translation, video, photo, and annotation projects.',
      body: renderAiJobsPageBody(),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: aiJobsFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    },
    {
      path: '/contact',
      title: 'Contact Us',
      description: 'Contact PDFKira for support, feedback, or business inquiries.',
      body: '<p>For general questions, feedback, or business inquiries, email <a href="mailto:contact@pdfkira.com">contact@pdfkira.com</a>. For support with tools and document processing, email <a href="mailto:support@pdfkira.com">support@pdfkira.com</a>.</p>',
    },
    {
      path: '/privacy',
      title: 'Privacy Policy',
      description: 'How PDFKira handles uploaded files, analytics, cookies, and personal information.',
      body: '<h2>File processing and storage</h2><p>Many PDFKira tools process files locally in your browser. Where a tool requires server-side processing, files are transmitted over HTTPS. Uploaded and generated temporary files are automatically deleted from our servers within one hour after processing.</p><h2>Analytics and cookies</h2><p>PDFKira uses Google Analytics to understand site usage and improve the service. Google Analytics may use cookies or similar technologies under its own policies. The site also stores limited preferences in your browser. You can manage or delete cookies and browser storage through your browser settings.</p><h2>Personal information</h2><p>PDFKira does not sell personal information. Do not upload documents unless you have the right to process them and are comfortable using the selected tool.</p><h2>Contact</h2><p>Questions about this policy can be sent to <a href="mailto:contact@pdfkira.com">contact@pdfkira.com</a>.</p>',
    },
    {
      path: '/terms',
      title: 'Terms of Service',
      description: 'Terms that apply when using PDFKira tools and services.',
      body: '<h2>Acceptance and lawful use</h2><p>By using PDFKira, you agree to these terms and to use the service only for lawful purposes without infringing others’ rights or disrupting their use.</p><h2>Your files</h2><p>You retain ownership of your documents. You are responsible for having the rights and permissions needed to process files you provide.</p><h2>Availability and results</h2><p>The service is provided “as is” and “as available.” Access may be interrupted, and outputs should be reviewed for accuracy and suitability before use.</p><h2>Changes</h2><p>PDFKira may update, suspend, or discontinue features. Continued use after updated terms are posted constitutes acceptance of the updated terms.</p><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:contact@pdfkira.com">contact@pdfkira.com</a>.</p>',
    },
  ];

  const articles = blogPosts.map((post) => {
    const canonical = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
    return {
      path: `/blog/${encodeURIComponent(post.slug)}`,
      title: post.title,
      description: blogDescription(post),
      body: renderBlogArticleBody(post),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: blogDescription(post),
        author: {
          '@type': 'Organization',
          name: 'PDFKira',
          url: siteUrl,
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical,
        },
        image: resolveAbsoluteImageUrl(post.coverImage, `${siteUrl}/logo.png`),
      },
    };
  });

  return [...pages, ...articles];
}

function renderHomeSeoBlock() {
  const visibleTools = tools.filter((tool) => tool.status === 'available');
  const featuredSlugs = ['pdf-to-markdown', 'add-page-numbers', 'image-converter', 'qr-code-generator'];
  const featuredTools = featuredSlugs
    .map((slug) => visibleTools.find((tool) => tool.slug === slug))
    .filter((tool): tool is ToolRecord => Boolean(tool));
  const popularTools = visibleTools.filter((tool) => tool.popular).slice(0, 6);
  const renderCards = (items: ToolRecord[], label: string) =>
    items
      .map(
        (tool) => `
          <li>
            <a href="${toolPageUrl(tool.slug)}" aria-label="Use ${escapeHtml(tool.name)}">
              <h3>${escapeHtml(tool.name)}</h3>
              <p>${escapeHtml(tool.shortDescription)}</p>
            </a>
          </li>`,
      )
      .join('') || `<li>${escapeHtml(label)} are being updated. Browse <a href="${siteUrl}/tools">all tools</a>.</li>`;

  return `<!-- SEO Fallback -->
<div id="seo-fallback" style="display: block;">
  <main>
    <h1>PDFKira — Free Online PDF Tools</h1>
    <p>Free online PDF tools for merging, splitting, compressing, converting, organizing, and editing PDF files.</p>
    <section>
      <h2>Featured Tools</h2>
      <ul>${renderCards(featuredTools, 'Featured tools')}</ul>
    </section>
    <section>
      <h2>Most Popular Tools</h2>
      <ul>${renderCards(popularTools, 'Popular tools')}</ul>
    </section>
    <p><a href="/tools">View all ${visibleTools.length} tools</a></p>
  </main>
</div>`;
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
    content = content.replace(/<!-- SEO Fallback -->[\s\S]*?<\/div>/, renderHomeSeoBlock());
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
        const firstPathSegment = path.relative(outDir, fullPath).split(path.sep)[0];
        if (clientToolContent.some((tool) => tool.slug === firstPathSegment)) continue;
        const original = fs.readFileSync(fullPath, 'utf-8');
        const patched = injectGoogleTagIntoHtml(original);
        if (patched !== original) {
          fs.writeFileSync(fullPath, patched, 'utf-8');
        }
      }
    }
  }
}

function collectHtmlFiles(dir: string): string[] {
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

function verifyGeneratedSeo(
  outDir: string,
  sitemapItems: Array<{ loc: string; changefreq: string }>,
  requireHomepage: boolean,
) {
  const vercelConfigPath = path.resolve(__dirname, '../vercel.json');
  let vercelConfig: { redirects?: unknown } = {};
  if (fs.existsSync(vercelConfigPath)) {
    try {
      vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8')) as { redirects?: unknown };
    } catch (error) {
      throw new Error(
        `Could not parse ${vercelConfigPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  const redirects = Array.isArray(vercelConfig.redirects) ? vercelConfig.redirects : [];
  if (redirects.length === 0) {
    console.warn(
      `Warning: ${vercelConfigPath} does not define a redirects array; skipping redirect validation.`,
    );
  } else {
    const wwwRedirect = redirects.find(
      (redirect: any) =>
        redirect?.has?.some(
          (condition: any) => condition.type === 'host' && condition.value === 'www.pdfkira.com',
        ),
    ) as { destination?: string; statusCode?: number } | undefined;
    if (wwwRedirect?.destination !== `${siteUrl}/:path*` || wwwRedirect.statusCode !== 301) {
      throw new Error('Vercel must permanently redirect www.pdfkira.com to the canonical HTTPS host.');
    }
  }

  const sitemapPath = path.join(outDir, 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  if (!sitemap.startsWith('<?xml') || !sitemap.includes('<urlset') || !sitemap.includes('</urlset>')) {
    throw new Error(`Generated sitemap is not a valid urlset: ${sitemapPath}`);
  }
  if ((sitemap.match(/<url>/g) || []).length !== sitemapItems.length) {
    throw new Error(`Generated sitemap URL count does not match its route list: ${sitemapPath}`);
  }

  for (const { loc } of sitemapItems) {
    if (new URL(loc).origin !== siteUrl) {
      throw new Error(`Sitemap URL does not use the canonical origin: ${loc}`);
    }
    const pathname = new URL(loc).pathname;
    const routePath = pathname.endsWith('/') ? pathname : `${pathname}/`;
    const htmlPath = path.join(outDir, routePath, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      if (pathname === '/' && !requireHomepage) continue;
      throw new Error(`Sitemap route has no generated HTML (would be a static-host 404): ${loc}`);
    }

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    if (!title || /404\s*-\s*Page Not Found/i.test(title)) {
      throw new Error(`Valid sitemap route has an empty or 404 title: ${loc}`);
    }
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (canonical !== loc) {
      throw new Error(`Canonical mismatch on ${loc}; received ${canonical || 'none'}`);
    }
  }

  const robots = fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf-8');
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    throw new Error(`robots.txt does not reference the canonical sitemap: ${outDir}`);
  }

  const clientToolSlugs = new Set(clientToolContent.map((tool) => tool.slug));
  for (const tool of tools.filter((entry) => entry.status === 'available' && !clientToolSlugs.has(entry.slug))) {
    const aliasRedirect = redirects.find(
      (redirect: any) =>
        redirect?.source === `/${tool.slug}` && redirect?.destination === `/tools/${tool.slug}`,
    );
    if (
      redirects.length > 0 &&
      !clientToolContent.some((clientTool) => clientTool.slug === tool.slug) &&
      !aliasRedirect
    ) {
      throw new Error(`Missing legacy route redirect for tool: ${tool.slug}`);
    }

    const htmlPath = path.join(outDir, 'tools', tool.slug, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const faqScript = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i)?.[1];
    if (!faqScript) throw new Error(`Missing structured data for tool route: ${tool.slug}`);

    let structuredData: any;
    try {
      structuredData = JSON.parse(faqScript);
    } catch {
      throw new Error(`Invalid JSON-LD on tool route: ${tool.slug}`);
    }
    const faqPage = structuredData['@graph']?.find((entry: any) => entry['@type'] === 'FAQPage');
    if (!faqPage || faqPage.mainEntity.length < 4 || faqPage.mainEntity.length > 6) {
      throw new Error(`Tool route must have 4-6 structured FAQ entries: ${tool.slug}`);
    }
    if (!html.includes('<h2>Why use this tool</h2>') || (html.match(/<div><h3>/g) || []).length < 3) {
      throw new Error(`Tool route is missing its three benefit blocks: ${tool.slug}`);
    }
  }

  for (const tool of clientToolContent) {
    const htmlPath = path.join(outDir, 'tools', tool.slug, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    if (!html.includes(`<h1>${escapeHtml(tool.name)}</h1>`) || !html.includes('<h2>How it works</h2>') ||
        !html.includes('<h2>Why use this tool</h2>') || !html.includes('<h2>Frequently asked questions</h2>') ||
        !html.includes('<h2>Related tools</h2>')) {
      throw new Error(`Client tool SEO HTML is missing required content: ${tool.slug}`);
    }
    const structuredDataScript = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
    if (!structuredDataScript) throw new Error(`Missing structured data for client tool: ${tool.slug}`);
    const structuredData = JSON.parse(structuredDataScript);
    const faqPage = structuredData['@graph']?.find((entry: any) => entry['@type'] === 'FAQPage');
    if (!faqPage || faqPage.mainEntity.length !== 5) {
      throw new Error(`Client tool must have five structured FAQ entries: ${tool.slug}`);
    }
  }

  for (const htmlPath of collectHtmlFiles(outDir)) {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
    if (/404\s*-\s*Page Not Found/i.test(title)) {
      throw new Error(`Generated HTML contains a 404 title: ${htmlPath}`);
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
    const editorialPages = getStaticPages();
    const clientToolSlugs = new Set(clientToolContent.map((tool) => tool.slug));
    const sitemapItems = [
      { loc: `${siteUrl}/`, changefreq: 'weekly' },
      { loc: `${siteUrl}/tools`, changefreq: 'weekly' },
      { loc: `${siteUrl}/compare/ilovepdf-vs-smallpdf-vs-pdfkira`, changefreq: 'weekly' },
      ...clientToolContent.map((tool) => ({ loc: `${siteUrl}/tools/${tool.slug}`, changefreq: 'weekly' as const })),
      ...tools
        .filter((tool) => tool.status === 'available' && !clientToolSlugs.has(tool.slug))
        .map((tool) => ({ loc: `${siteUrl}/tools/${tool.slug}`, changefreq: 'weekly' as const })),
      ...editorialPages.map((page) => ({ loc: `${siteUrl}${page.path}`, changefreq: 'monthly' as const })),
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems
      .map(
        (item) =>
          `  <url>\n    <loc>${escapeHtml(item.loc)}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${item.changefreq}</changefreq>\n  </url>`,
      )
      .join('\n')}\n</urlset>`;

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    // Write tools index page
    fs.writeFileSync(path.join(outDir, 'tools', 'index.html'), renderToolsIndexHtml(assets), 'utf-8');
    const comparisonDir = path.join(outDir, 'compare', 'ilovepdf-vs-smallpdf-vs-pdfkira');
    ensureDir(comparisonDir);
    fs.writeFileSync(path.join(comparisonDir, 'index.html'), renderComparisonPageHtml(assets), 'utf-8');

    for (const page of editorialPages) {
      const pagePath = path.join(outDir, page.path.replace(/^\//, ''), 'index.html');
      ensureDir(path.dirname(pagePath));
      fs.writeFileSync(pagePath, renderEditorialPageHtml(page, assets), 'utf-8');
    }

    for (const tool of clientToolContent) {
      const toolDir = path.join(outDir, 'tools', tool.slug);
      ensureDir(toolDir);
      fs.writeFileSync(path.join(toolDir, 'index.html'), renderClientToolPageHtml(tool, assets), 'utf-8');
    }

    // Write individual tool pages
    for (const tool of tools.filter((entry) => !clientToolSlugs.has(entry.slug))) {
      const toolDir = path.join(outDir, 'tools', tool.slug);
      ensureDir(toolDir);
      fs.writeFileSync(path.join(toolDir, 'index.html'), renderToolPageHtml(tool, assets), 'utf-8');
    }

    verifyGeneratedSeo(outDir, sitemapItems, outDir === preferredOut);

    console.log(`Generated static files in ${outDir}:`);
    console.log(`  - robots.txt`);
    console.log(`  - sitemap.xml (${sitemapItems.length} URLs)`);
    console.log(`  - tools/index.html`);
    console.log(`  - ${tools.length} tool pages`);
    console.log(`  - ${editorialPages.length} editorial pages`);
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
