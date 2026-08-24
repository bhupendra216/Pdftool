import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * Core Organization schema used on the homepage to establish the site entity.
 */
export default function OrganizationSchema({
  name = 'PDFKira',
  url = 'https://pdfkira.com',
  logoUrl = 'https://pdfkira.com/logo.png',
  sameAs = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logoUrl,
    sameAs: sameAs.filter(Boolean),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

OrganizationSchema.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  logoUrl: PropTypes.string,
  sameAs: PropTypes.arrayOf(PropTypes.string),
};
