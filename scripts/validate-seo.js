#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distPublicDir = path.join(projectRoot, 'artifacts', 'pdf-tools', 'dist', 'public');
const sourcePublicDir = path.join(projectRoot, 'artifacts', 'pdf-tools', 'public');
const publicDir = fs.existsSync(distPublicDir) ? distPublicDir : sourcePublicDir;
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');
const errors = [];

function readFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} is missing: ${filePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&#39;/g, "'");
}

const sitemapText = readFile(sitemapPath, 'Sitemap');
const robotsText = readFile(robotsPath, 'Robots');

if (sitemapText && !sitemapText.includes('<urlset')) {
  errors.push('sitemap.xml is not a valid URL set');
}

const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (!urls.length) errors.push('sitemap.xml contains no URLs');
if (urls.length !== new Set(urls).size) errors.push('Duplicate URLs detected in sitemap.xml');

let sitemapOrigin;
try {
  sitemapOrigin = new URL(urls[0]).origin;
} catch {
  errors.push(`Invalid sitemap URL: ${urls[0] || '(none)'}`);
}

if (!robotsText.includes('User-agent: *') || !robotsText.includes(`Sitemap: ${sitemapOrigin}/sitemap.xml`)) {
  errors.push('robots.txt is missing the matching sitemap directive');
}

for (const url of urls) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    errors.push(`Invalid absolute sitemap URL: ${url}`);
    continue;
  }

  if (parsedUrl.protocol !== 'https:') errors.push(`Sitemap URL must use HTTPS: ${url}`);
  if (parsedUrl.search || parsedUrl.hash) errors.push(`Sitemap URL must not contain a query or fragment: ${url}`);
  if (parsedUrl.pathname !== '/' && (parsedUrl.pathname !== parsedUrl.pathname.toLowerCase() || parsedUrl.pathname.endsWith('/'))) {
    errors.push(`Sitemap URL does not use the canonical lowercase slash format: ${url}`);
  }

  const relativePath = parsedUrl.pathname === '/' ? 'index.html' : `${parsedUrl.pathname.slice(1)}/index.html`;
  const pagePath = path.join(publicDir, relativePath);
  const html = readFile(pagePath, `Sitemap page for ${url}`);
  if (!html) continue;

  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  const canonical = canonicalTag && getAttribute(canonicalTag, 'href');
  if (canonical !== url) errors.push(`Canonical mismatch for ${url}: ${canonical || 'missing canonical'}`);

  const descriptionTag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0];
  const description = descriptionTag && getAttribute(descriptionTag, 'content');
  const descriptionLength = description ? decodeHtml(description).length : 0;
  if (descriptionLength < 120 || descriptionLength > 160) {
    errors.push(`Meta description must be 120-160 characters for ${url}; found ${descriptionLength}`);
  }

  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0];
  if (getAttribute(robotsTag || '', 'content') !== 'index, follow') {
    errors.push(`Sitemap page is not explicitly indexable: ${url}`);
  }

  if (parsedUrl.pathname.startsWith('/tools/')) {
    const faqSection = html.match(/<h2>Frequently asked questions<\/h2>([\s\S]*?)<\/section>/i)?.[1] || '';
    const faqCount = [...faqSection.matchAll(/<li>/gi)].length;
    if (faqCount < 3 || faqCount > 5) errors.push(`Tool page must have 3-5 FAQs: ${url} (found ${faqCount})`);

    const mainContent = html.match(/<main>([\s\S]*?)<\/main>/i)?.[1] || '';
    const wordCount = mainContent
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;\s]+;/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (wordCount < 100) errors.push(`Tool page content is too short: ${url} (${wordCount} words)`);
  }
}

if (errors.length) {
  console.error('SEO validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('SEO validation passed.');
console.log(`Checked ${urls.length} sitemap URLs for static pages, canonicals, indexability, and descriptions.`);
