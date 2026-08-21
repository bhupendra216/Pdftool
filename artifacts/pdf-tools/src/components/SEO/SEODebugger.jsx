import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Development-only SEO helper. It surfaces important metadata and warnings without affecting production builds.
 */
export default function SEODebugger() {
  if (process.env.NODE_ENV !== 'development') return null;

  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const ogTags = Array.from(document.head.querySelectorAll('meta[property^="og:"]')).map((tag) => tag.outerHTML);
  const schemas = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).length;

  const warnings = useMemo(() => {
    const items = [];
    if (title.length > 60) items.push('Title exceeds 60 characters');
    if (description.length > 160) items.push('Description exceeds 160 characters');
    if (!canonical.startsWith('https://')) items.push('Canonical URL is missing or not absolute');
    if (!schemas) items.push('No JSON-LD blocks found');
    return items;
  }, [description, canonical, schemas, title]);

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, maxWidth: 420, background: '#0f172a', color: '#fff', borderRadius: 12, padding: 12, fontSize: 12 }}>
      <Helmet />
      <strong>SEO Debug</strong>
      <div>Title: {title}</div>
      <div>Description: {description}</div>
      <div>Canonical: {canonical}</div>
      <div>Schema blocks: {schemas}</div>
      {warnings.length ? (
        <ul>
          {warnings.map((warning) => <li key={warning}>{warning}</li>)}
        </ul>
      ) : (
        <div>No warnings.</div>
      )}
      <div>{ogTags.length} OG tags present</div>
    </div>
  );
}
