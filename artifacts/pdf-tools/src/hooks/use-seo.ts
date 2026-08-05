import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';

// Use public kira.jpeg as the canonical social image
const logo = '/favicon.png';
const defaultDescription = 'Free online PDF and image tools for merging, splitting, compressing, converting, OCR, signing, and organizing files securely in your browser.';

function updateMeta(selector: string, value: string) {
  let metaTag = document.querySelector(selector);

  if (!metaTag) {
    metaTag = document.createElement("meta");
    const attribute = selector.includes("property=") ? "property" : "name";
    const match = selector.match(/['\"]([^'\"]+)['\"]/);

    if (match?.[1]) {
      metaTag.setAttribute(attribute, match[1]);
    }

    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute("content", value);
}

export function useSEO({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  useEffect(() => {
    const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = pageTitle;

    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[name="twitter:title"]', pageTitle);
    updateMeta('meta[property="og:image"]', logo);
    updateMeta('meta[name="twitter:image"]', logo);
    updateMeta('meta[property="og:site_name"]', SITE_NAME);
    updateMeta('meta[name="twitter:card"]', 'summary_large_image');
    updateMeta('meta[name="robots"]', 'index, follow');

    const resolvedDescription = description || defaultDescription;
    if (resolvedDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', resolvedDescription);

      updateMeta('meta[property="og:description"]', resolvedDescription);
      updateMeta('meta[name="twitter:description"]', resolvedDescription);
    }
  }, [title, description]);
}

export function useSEOAdvanced({
  title,
  description,
  canonical,
  jsonLd,
}: {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | string;
}) {
  useSEO({ title, description });

  useEffect(() => {
    // Prefer explicit canonical, otherwise build from SITE_URL + current path
    const resolvedCanonical = canonical || (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', resolvedCanonical);

    updateMeta('meta[property="og:url"]', resolvedCanonical);
    updateMeta('meta[name="twitter:url"]', resolvedCanonical);

    if (jsonLd) {
      const id = 'structured-data-jsonld';
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', id);
        document.head.appendChild(script);
      }
      script.textContent = typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd);
    }
  }, [canonical, jsonLd, title, description]);
}
