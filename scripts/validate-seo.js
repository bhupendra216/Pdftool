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

const lines = robotsText.split(/
?
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
  #!/usr/bin/env node

  const fs = require('fs');
  const path = require('path');

  const projectRoot = path.resolve(__dirname, '..');
  // Check both public and dist/public directories
  const publicDir = path.join(projectRoot, 'artifacts', 'pdf-tools', 'public');
  const distPublicDir = path.join(projectRoot, 'artifacts', 'pdf-tools', 'dist', 'public');

  // Use dist/public if it exists (after build), otherwise fall back to public
  const checkDir = fs.existsSync(distPublicDir) ? distPublicDir : publicDir;

  const sitemapPath = path.join(checkDir, 'sitemap.xml');
  const robotsPath = path.join(checkDir, 'robots.txt');

  const errors = [];
  const warnings = [];

  function checkFile(filePath, label) {
    if (!fs.existsSync(filePath)) {
      errors.push(`${label} is missing: ${filePath}`);
      return false;
    }
    return true;
  }

  // Check sitemap
  const hasSitemap = checkFile(sitemapPath, 'Sitemap');
  const hasRobots = checkFile(robotsPath, 'Robots');

  if (!hasSitemap) {
    console.error('❌ Sitemap missing. Run "npm run build" first, then "npx tsx scripts/generate-seo.ts"');
    process.exit(1);
  }

  const sitemapText = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemapText.includes('<urlset')) {
    errors.push('sitemap.xml is not valid XML');
  }

  const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    errors.push('sitemap.xml contains no URLs');
  }
  if (urls.length !== new Set(urls).size) {
    errors.push('Duplicate URLs detected in sitemap.xml');
  }

  // Check robots.txt
  if (hasRobots) {
    const robotsText = fs.readFileSync(robotsPath, 'utf8');
    if (!robotsText.includes('User-agent: *') || !robotsText.includes('Sitemap: https://pdfkira.com/sitemap.xml')) {
      errors.push('robots.txt is invalid or missing the sitemap directive');
    }

    const lines = robotsText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) errors.push('robots.txt is missing required lines');
  }

  // Check canonical URLs
  const canonicalTags = [...sitemapText.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const url of canonicalTags) {
    if (!url.startsWith('https://pdfkira.com/')) {
      errors.push(`Absolute canonical URL required: ${url}`);
    }
  }

  // NEW: Check that generated tool pages have React bundles
  const toolsDir = path.join(checkDir, 'tools');
  if (fs.existsSync(toolsDir)) {
    const toolDirs = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory());
  
    for (const toolSlug of toolDirs) {
      const toolPagePath = path.join(toolsDir, toolSlug, 'index.html');
      if (!fs.existsSync(toolPagePath)) {
        errors.push(`Tool page missing: tools/${toolSlug}/index.html`);
        continue;
      }
    
      const toolPageContent = fs.readFileSync(toolPagePath, 'utf8');
    
      if (!toolPageContent.includes('id="root"')) {
        errors.push(`Tool page missing React mount point: tools/${toolSlug}/index.html`);
      }
    
      if (!toolPageContent.includes('src="/assets/')) {
        errors.push(`Tool page missing React JS bundle: tools/${toolSlug}/index.html`);
      }
    
      if (!toolPageContent.includes('href="/assets/')) {
        warnings.push(`Tool page may be missing CSS bundle: tools/${toolSlug}/index.html`);
      }
    }
  } else {
    warnings.push('tools/ directory not found in build output');
  }

  // Report results
  if (errors.length) {
    console.error('❌ SEO validation failed.');
    for (const msg of errors) console.error(`   - ${msg}`);
    process.exit(1);
  }

  console.log('✅ SEO validation passed.');
  console.log(`   Checked ${urls.length} URLs in sitemap.xml.`);
  console.log(`   Checked ${fs.readdirSync(toolsDir).length} tool pages for React bundles.`);

  if (warnings.length) {
    console.warn('⚠️  Warnings:');
    for (const msg of warnings) console.warn(`   - ${msg}`);
  }
