import { useMemo } from 'react';

/**
 * Development helper reminding maintainers to keep sitemap.xml in sync as routes are added.
 */
export default function SitemapAutoUpdate({ currentPath, sitemapUrls = [] }) {
  if (process.env.NODE_ENV !== 'development') return null;
  const isMissing = useMemo(() => !sitemapUrls.includes(currentPath), [currentPath, sitemapUrls]);

  if (!isMissing) return null;

  return (
    <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.75rem 1rem', borderRadius: 8, margin: '1rem 0' }}>
      Warning: this page is not currently listed in the sitemap.xml file. Update the static sitemap before release.
    </div>
  );
}
