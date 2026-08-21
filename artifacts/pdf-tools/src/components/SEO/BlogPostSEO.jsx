import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { siteUrl } from '@/data/seoConfig';
import { generateCanonicalSlug, validateTitle, validateDescription, formatDateForSchema } from '@/utils/seoUtils';

/**
 * Blog article SEO supports article indexing and social sharing cards.
 */
export default function BlogPostSEO({
  slug,
  title = 'PDFKira Blog',
  excerpt = 'Read the latest PDF guides from PDFKira.',
  publishDate,
  modifiedDate,
  author = 'PDFKira',
  featuredImage = '/og/default.jpg',
}) {
  const pageTitle = validateTitle(title, 60);
  const description = validateDescription(excerpt, 160);
  const canonical = generateCanonicalSlug(`/blog/${slug}`);
  const imageUrl = featuredImage.startsWith('http') ? featuredImage : `${siteUrl}${featuredImage}`;
  const publishedTime = publishDate ? formatDateForSchema(publishDate) : undefined;
  const modifiedTime = modifiedDate ? formatDateForSchema(modifiedDate) : publishedTime;

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={imageUrl} />
      <meta property="article:published_time" content={publishedTime} />
      <meta property="article:modified_time" content={modifiedTime} />
      <meta property="article:author" content={author} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}

BlogPostSEO.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string,
  excerpt: PropTypes.string,
  publishDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  modifiedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  author: PropTypes.string,
  featuredImage: PropTypes.string,
};
