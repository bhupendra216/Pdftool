import fs from 'fs';
import path from 'path';

function collectHtmlFiles(dir: string) {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
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

function run() {
  // Prefer the repository root `public/` if present (used by some CI flows),
  // otherwise point to the Vite output directory inside artifacts/pdf-tools.
  const candidate1 = path.resolve(process.cwd(), 'public');
  const candidate2 = path.resolve(process.cwd(), 'artifacts/pdf-tools/dist/public');
  const publicDir = fs.existsSync(candidate1) ? candidate1 : candidate2;
  const assetsDir = path.join(publicDir, 'assets');
  const htmlFiles = collectHtmlFiles(publicDir);

  const missing: Array<{ html: string; asset: string }> = [];
  const seenAssets = new Set<string>();

  for (const html of htmlFiles) {
    const content = fs.readFileSync(html, 'utf-8');
    const re = /\/(assets\/[^"'\s>]+\.(?:js|css))/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      const assetPath = '/' + m[1];
      const onDisk = path.join(publicDir, assetPath.replace(/^\//, ''));
      seenAssets.add(assetPath);
      if (!fs.existsSync(onDisk)) missing.push({ html, asset: assetPath });
    }
  }

  console.log(`Checked ${htmlFiles.length} HTML files and ${seenAssets.size} asset references.`);
  if (missing.length === 0) {
    console.log('PASS: All referenced assets exist in public/assets/');
    process.exit(0);
  }

  console.error('FAIL: Missing assets referenced by generated HTML:');
  for (const m of missing) console.error(`  - ${m.html} -> ${m.asset}`);
  process.exit(2);
}

if (process.argv[1] && process.argv[1].endsWith('verify-assets.ts')) run();
