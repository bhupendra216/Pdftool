import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * Structured data for each tool page. Google uses this to recognise application-like pages.
 */
export default function SoftwareApplicationSchema({
  toolName,
  toolDescription,
  toolUrl,
  ratingValue = '4.8',
  ratingCount = '1250',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `PDFKira ${toolName}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      ratingCount,
    },
    description: toolDescription,
    url: toolUrl,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

SoftwareApplicationSchema.propTypes = {
  toolName: PropTypes.string.isRequired,
  toolDescription: PropTypes.string.isRequired,
  toolUrl: PropTypes.string.isRequired,
  ratingValue: PropTypes.string,
  ratingCount: PropTypes.string,
};
