import { useEffect } from 'react';
import { SITE_URL, SITE_IMAGE, SITE_NAME } from '@/lib/site-config';

const logo = SITE_IMAGE;
const siteName = SITE_NAME;

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
    const pageTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    document.title = pageTitle;

    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[name="twitter:title"]', pageTitle);
    updateMeta('meta[property="og:image"]', logo);
    updateMeta('meta[name="twitter:image"]', logo);

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      updateMeta('meta[property="og:description"]', description);
      updateMeta('meta[name="twitter:description"]', description);
    }
  }, [title, description]);
}

export function useSEOAdvanced({
  title,
  description,
  canonical,
  jsonLd,
  robots,
}: {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>> | string;
  robots?: string;
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

    if (robots) {
      let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', robots);
    }

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
  }, [canonical, jsonLd, title, description, robots]);
}
