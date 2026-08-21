import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { siteUrl } from '@/data/seoConfig';
import { generateCanonicalSlug, truncateString, validateTitle, validateDescription, generateKeywords } from '@/utils/seoUtils';

/**
 * Central SEO metadata for tool pages. This component is intentionally generic so every tool page
 * can reuse the same head tags and structured metadata without duplicating logic.
 */
export default function ToolPageSEO({
  toolSlug,
  toolName = 'PDFKira Tool',
  toolDescription = 'Free online PDF tool from PDFKira.',
  keywords = [],
  ogImage = '/og/default.jpg',
}) {
  const normalizedSlug = toolSlug || 'tools';
  const title = validateTitle(`${toolName} Online Free | PDFKira`, 60);
  const description = validateDescription(toolDescription, 160);
  const keywordList = Array.isArray(keywords) && keywords.length ? keywords : generateKeywords(toolName);
  const canonical = generateCanonicalSlug(`/${normalizedSlug}`);
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordList.join(', ')} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="PDFKira" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}

ToolPageSEO.propTypes = {
  toolSlug: PropTypes.string,
  toolName: PropTypes.string,
  toolDescription: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  ogImage: PropTypes.string,
};
