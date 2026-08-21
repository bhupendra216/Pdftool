import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Sets page metadata on mount and removes it on unmount.
 * This is a lightweight way to keep SEO updates consistent with route changes while remaining simple.
 */
export default function usePageSEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
  ogType = 'website',
  siteName = 'PDFKira',
  keywords = [],
}) {
  useEffect(() => {
    if (!title && !description) return undefined;
    const tag = document.documentElement;

    if (title) {
      document.title = title;
    }

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
    }

    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    if (ogImage) {
      setMeta('meta[property="og:image"]', 'content', ogImage);
    }

    if (keywords.length) {
      setMeta('meta[name="keywords"]', 'content', keywords.join(', '));
    }

    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:site_name"]', 'content', siteName);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');

    return () => {
      if (!tag) return;
      if (title) {
        document.title = 'PDFKira';
      }
    };
  }, [title, description, canonical, ogImage, noindex, ogType, siteName, keywords]);

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
    </Helmet>
  );
}
