import PropTypes from 'prop-types';

/**
 * Internal checklist to help track SEO implementation and deployment readiness.
 */
export default function SEOChecklist({ items = [] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
      {items.map((item) => (
        <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: item.done ? 'green' : 'red' }}>{item.done ? '✅' : '❌'}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

SEOChecklist.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      done: PropTypes.bool,
    }),
  ),
};
