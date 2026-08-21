import PropTypes from 'prop-types';
import { Link } from 'wouter';
import BreadcrumbSchema from '@/components/SchemaMarkup/BreadcrumbSchema';

/**
 * Breadcrumb nav for tools and category pages, plus schema support.
 */
export default function ToolBreadcrumb({ items = [] }) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <span key={`${item.label}-${item.url}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {index > 0 && <span aria-hidden="true">›</span>}
            <Link href={item.url || '/'}>
              <a>{item.label}</a>
            </Link>
          </span>
        ))}
      </nav>
    </>
  );
}

ToolBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
};
