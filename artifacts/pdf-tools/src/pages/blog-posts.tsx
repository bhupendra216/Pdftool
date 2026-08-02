import fs from 'fs';
import path from 'path';

// This module is only used at build-time or by server-side tooling.
export function listLocalBlogPosts() {
  const dir = path.join(process.cwd(), 'artifacts/pdf-tools/content/posts');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const match = raw.match(/---([\s\S]*?)---/);
    let meta = {} as any;
    if (match) {
      const yaml = match[1];
      yaml.split('\n').forEach(line => {
        const [k, ...rest] = line.split(':');
        if (k) meta[k.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
      });
    }
    return { slug: f.replace(/\.md$/, ''), ...meta };
  });
}
