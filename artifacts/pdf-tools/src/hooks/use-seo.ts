import { useEffect } from 'react';

// Use public kira.jpeg as the canonical social image
const logo = '/favicon.png';

const siteName = "PDFKira";

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
