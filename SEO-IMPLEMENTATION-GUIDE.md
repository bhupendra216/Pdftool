# PDFKira SEO Implementation Guide

## Overview

This project uses a plain React SPA on Vercel with a free-tier architecture. We intentionally avoid SSR/SSG to stay within the free hosting constraints and rely on static HTML fallbacks plus React Helmet Async for metadata injection.

## Architecture

- React SPA with Vite
- Vercel free tier hosting
- Render free tier backend
- Static `public/sitemap.xml` and `public/robots.txt` generated during the PDF-tools build
- React Helmet Async for `head` metadata
- JSON-LD schemas for tools, FAQs, breadcrumbs, and articles
- SEO fallback blocks for crawler-friendly text

## File structure

- `artifacts/pdf-tools/public/robots.txt` — static crawler directives
- `scripts/generate-seo.ts` — generates tool-page HTML and the indexable sitemap
- `artifacts/api-server/src/lib/content.ts` — tool names, descriptions, steps, and FAQs
- `artifacts/pdf-tools/src/hooks/use-seo.ts` — runtime page metadata and self-canonical URLs
- `vercel.json` — permanent redirects from legacy tool URLs to canonical `/tools/` URLs
- `artifacts/pdf-tools/src/components/SEO/` — SEO helpers and header tags
- `artifacts/pdf-tools/src/components/SchemaMarkup/` — JSON-LD schema components
- `artifacts/pdf-tools/src/data/seoConfig.js` — central SEO metadata
- `artifacts/pdf-tools/src/hooks/usePageSEO.js` — metadata lifecycle hook
- `artifacts/pdf-tools/src/utils/seoUtils.js` — title validation and canonical helpers

## How to add SEO for a new tool

1. Add metadata to `src/data/seoConfig.js`.
2. Add the route in the SPA router.
3. Place the tool under `PageWrapper` with the correct page type.
4. Add useful page copy, steps, and at least three relevant FAQs.
5. Create the matching OG image.
6. Run `pnpm --filter @workspace/pdf-tools build`; the build generates the sitemap from canonical tool routes.
7. Run `node scripts/validate-seo.js`.

Only indexable pages with self-referencing canonical URLs belong in the sitemap. Legacy root-level tool URLs should redirect to their `/tools/` canonical URL and must not be added to the sitemap.

## Local testing

```bash
node scripts/validate-seo.js
```

Then open the page and check the HTML source in the browser to confirm meta tags and canonical URLs are present.

## Schema types used

- SoftwareApplication
- FAQPage
- HowTo
- BreadcrumbList
- Organization
- WebSite
- Article

## Common issues

- duplicate titles
- titles longer than 60 characters
- descriptions shorter than 120 or longer than 160 characters
- missing canonical URLs
- robots.txt not at the public root
- sitemap not updated after a route change

## Free SEO monitoring tools

- Google Search Console
- Google Rich Results Test
- PageSpeed Insights
- Lighthouse in Chrome DevTools
- Screaming Frog free tier
