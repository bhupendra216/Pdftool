import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * Homepage WebSite schema with SearchAction for search enabled experiences.
 */
export default function WebSiteSchema({
  siteUrl = 'https://pdfkira.com',
  searchUrl = 'https://pdfkira.com/tools?q={search_term_string}',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'PDFKira',
    potentialAction: {
      '@type': 'SearchAction',
      target: searchUrl,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

WebSiteSchema.propTypes = {
  siteUrl: PropTypes.string,
  searchUrl: PropTypes.string,
};
