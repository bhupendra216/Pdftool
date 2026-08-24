import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * HowTo schema for actionable guides and how-to tool pages.
 */
export default function HowToSchema({ toolName, description, steps = [] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${toolName} with PDFKira`,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name || `Step ${index + 1}`,
      text: step.text,
      image: step.imageUrl || 'https://pdfkira.com/favicon.jpeg',
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

HowToSchema.propTypes = {
  toolName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      text: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    }),
  ),
};
