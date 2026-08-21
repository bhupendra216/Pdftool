import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * FAQ schema for tool pages. Helps search engines read common user questions and answers.
 */
export default function FAQPageSchema({ faqs = [] }) {
  const validFaqs = Array.isArray(faqs) ? faqs : [];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

FAQPageSchema.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ),
};
