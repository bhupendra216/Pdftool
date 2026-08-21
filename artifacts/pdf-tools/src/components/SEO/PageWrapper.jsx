import { useEffect } from 'react';
import PropTypes from 'prop-types';
import usePageSEO from '@/hooks/usePageSEO';
import schemaManager from '@/components/SchemaMarkup/SchemaManager';
import { siteUrl } from '@/data/seoConfig';
import SEOFallback from '@/components/SEO/SEOFallback';

/**
 * Shared wrapper for route-level SEO and schema injection. It is intentionally generic so all pages
 * inherit the same metadata lifecycle without per-page duplication.
 */
export default function PageWrapper({ children, pageType = 'home', pageData = {} }) {
  const seo = {
    title: pageData.title,
    description: pageData.description,
    canonical: pageData.canonical || (pageData.slug ? `${siteUrl}/${pageData.slug}` : siteUrl),
    ogImage: pageData.ogImage || `${siteUrl}/og/default.jpg`,
    noindex: pageData.noindex || false,
    ogType: pageType === 'blog' ? 'article' : 'website',
    keywords: pageData.keywords || [],
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageType, pageData.slug]);

  usePageSEO(seo);

  return (
    <>
      {pageType === 'tool' && pageData && (
        <SEOFallback toolSlug={pageData.slug} toolData={pageData} />
      )}
      {children}
      {pageData.schema && pageData.schema}
    </>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node,
  pageType: PropTypes.oneOf(['tool', 'blog', 'category', 'home']),
  pageData: PropTypes.object,
};
