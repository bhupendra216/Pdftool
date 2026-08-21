import PropTypes from 'prop-types';
import { Link } from 'wouter';
import { toolsSEO } from '@/data/seoConfig';

/**
 * Useful internal-linking component displayed near each tool page footer.
 */
export default function RelatedTools({ currentToolSlug }) {
  const related = Object.entries(toolsSEO)
    .filter(([slug]) => slug !== currentToolSlug)
    .slice(0, 4)
    .map(([slug, metadata]) => ({
      slug,
      name: metadata.title.replace(' | PDFKira', '').replace(' Online Free', '').trim(),
      description: metadata.description,
    }));

  return (
    <section aria-label="Related tools" style={{ marginTop: '2rem' }}>
      <h3>Related tools</h3>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {related.map((tool) => (
          <Link key={tool.slug} href={`/${tool.slug}`}>
            <a style={{ display: 'block', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
              <div style={{ fontWeight: 700 }}>{tool.name}</div>
              <p style={{ margin: '0.5rem 0 0', color: '#475569' }}>{tool.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}

RelatedTools.propTypes = {
  currentToolSlug: PropTypes.string.isRequired,
};
