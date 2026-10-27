import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCanonicalToolPaths, getToolPath, tools } from '../artifacts/api-server/src/lib/content';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedPath = path.join(repositoryRoot, 'artifacts/pdf-tools/dist/public/sitemap.xml');
const deployedPath = path.join(repositoryRoot, 'public/sitemap.xml');
const requiredUrls = [
  'https://pdfkira.com/',
  'https://pdfkira.com/tools',
  'https://pdfkira.com/blog',
  'https://pdfkira.com/about',
  'https://pdfkira.com/contact',
  'https://pdfkira.com/privacy',
  'https://pdfkira.com/ai-jobs',
];
const canonicalToolPaths = getCanonicalToolPaths();

function readSitemap(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Sitemap not found: ${path.relative(repositoryRoot, filePath)}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (
    !content.startsWith('<?xml version="1.0" encoding="UTF-8"?>') ||
    !content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') ||
    !content.includes('</urlset>')
  ) {
    throw new Error(`Invalid sitemap XML structure: ${path.relative(repositoryRoot, filePath)}`);
  }

  const urls = [...content.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    throw new Error(`Sitemap is empty: ${path.relative(repositoryRoot, filePath)}`);
  }

  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate URLs in sitemap: ${duplicates.join(', ')}`);
  }

  for (const url of urls) {
    const pathname = new URL(url).pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
      throw new Error(`Non-canonical trailing slash in sitemap URL: ${url}`);
    }
  }

  const nonCanonical = urls.filter((url) => {
    const pathname = new URL(url).pathname;
    return /^\/(edit|merge|split|compress|transform|protect|unlock|rotate|word-to|jpg-to|pdf-to-excel|ocr-pdf|sign-pdf)(?:-pdf)?$/.test(pathname);
  });
  if (nonCanonical.length > 0) {
    throw new Error(`Non-canonical root tool URLs in sitemap: ${nonCanonical.join(', ')}`);
  }

  for (const requiredUrl of requiredUrls) {
    if (!urls.includes(requiredUrl)) {
      throw new Error(`Required URL missing from sitemap: ${requiredUrl}`);
    }
  }

  const toolUrls = urls.filter((url) => new URL(url).pathname.startsWith('/tools/'));
  if (toolUrls.length !== canonicalToolPaths.length) {
    throw new Error(`Expected ${canonicalToolPaths.length} canonical registry tools in sitemap, found ${toolUrls.length}.`);
  }

  for (const tool of tools.filter((entry) => entry.status === 'available')) {
    const canonicalUrl = `https://pdfkira.com${getToolPath(tool.slug)}`;
    if (toolUrls.filter((url) => url === canonicalUrl).length !== 1) {
      throw new Error(`Expected exactly one canonical sitemap URL for registry tool: ${tool.slug}`);
    }
  }

  return { content, urls };
}

const generated = readSitemap(generatedPath);
const deployed = readSitemap(deployedPath);

if (generated.content !== deployed.content) {
  throw new Error('Deployed sitemap differs from the generated dist sitemap. Run copy-dist before deployment.');
}

console.log(`Sitemap verification passed: ${generated.urls.length} unique URLs.`);
