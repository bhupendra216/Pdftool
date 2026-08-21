import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { siteUrl } from '@/data/seoConfig';
import { generateCanonicalSlug, validateTitle, validateDescription } from '@/utils/seoUtils';

/**
 * Category pages are important landing pages for broader PDF workflows and internal link depth.
 */
export default function CategoryPageSEO({ categoryName, categoryDescription, toolCount = 0 }) {
  const title = validateTitle(`${categoryName} | PDFKira`, 60);
  const description = validateDescription(
    categoryDescription || `Browse ${toolCount} PDF tools for ${categoryName.toLowerCase()} workflows from PDFKira.`,
    160,
  );
  const canonical = generateCanonicalSlug(`/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteUrl}/og/default.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/og/default.jpg`} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}

CategoryPageSEO.propTypes = {
  categoryName: PropTypes.string.isRequired,
  categoryDescription: PropTypes.string,
  toolCount: PropTypes.number,
};
