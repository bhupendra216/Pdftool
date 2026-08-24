import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * Article schema for blog posts. Helps Google understand the content as a publishable article.
 */
export default function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName = 'PDFKira',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PDFKira',
        logo: {
        '@type': 'ImageObject',
        url: 'https://pdfkira.com/logo.png',
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

ArticleSchema.propTypes = {
  headline: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  datePublished: PropTypes.string.isRequired,
  dateModified: PropTypes.string,
  authorName: PropTypes.string,
};
