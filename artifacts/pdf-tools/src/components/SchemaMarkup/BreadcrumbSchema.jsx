import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * BreadcrumbList structured data for deeper page navigation and better SERP understanding.
 */
export default function BreadcrumbSchema({ items = [] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

BreadcrumbSchema.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      position: PropTypes.number,
    }),
  ),
};
