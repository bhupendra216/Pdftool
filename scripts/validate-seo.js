#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'artifacts', 'pdf-tools', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

const errors = [];
const warnings = [];

function checkFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} is missing: ${filePath}`);
  }
}

checkFile(sitemapPath, 'Sitemap');
checkFile(robotsPath, 'Robots');

if (!fs.existsSync(sitemapPath)) {
  console.error('Sitemap missing.');
  process.exit(1);
}

const sitemapText = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemapText.includes('<urlset')) {
  errors.push('sitemap.xml is not valid XML');
}

const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (urls.length !== new Set(urls).size) {
  errors.push('Duplicate URLs detected in sitemap.xml');
}

const titlePattern = /<title>(.*?)<\/title>/gi;
const titles = [...sitemapText.matchAll(titlePattern)].map((match) => match[1]);
if (titles.length) {
  const duplicateTitles = titles.filter((title, index) => titles.indexOf(title) !== index);
  if (duplicateTitles.length) errors.push('Duplicate titles found');
}

const robotsText = fs.readFileSync(robotsPath, 'utf8');
if (!robotsText.includes('User-agent: *') || !robotsText.includes('Sitemap: https://pdfkira.com/sitemap.xml')) {
  errors.push('robots.txt is invalid or missing the sitemap directive');
}

const lines = robotsText.split(/?
/).filter(Boolean);
if (lines.length < 2) errors.push('robots.txt is missing required lines');

const canonicalTags = [...sitemapText.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
for (const url of canonicalTags) {
  if (!url.startsWith('https://pdfkira.com/')) {
    errors.push(`Absolute canonical URL required: ${url}`);
  }
}

if (errors.length) {
  console.error('SEO validation failed.');
  for (const msg of errors) console.error(`- ${msg}`);
  process.exit(1);
}

console.log('SEO validation passed.');
console.log(`Checked ${urls.length} URLs in sitemap.xml.`);
if (warnings.length) {
  console.warn('Warnings:');
  for (const msg of warnings) console.warn(`- ${msg}`);
}
