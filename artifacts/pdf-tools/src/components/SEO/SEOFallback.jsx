import PropTypes from 'prop-types';
import styles from './SEOFallback.module.css';

/**
 * Enhanced fallback section designed to keep readable semantic HTML in the DOM for crawlers.
 * This is visible as an informational section and does not hide the content from Googlebot.
 */
export default function SEOFallback({ toolSlug, toolData = {} }) {
  const name = toolData.name || 'PDF Tool';
  const description = toolData.description || 'Free PDF tool from PDFKira.';
  const steps = Array.isArray(toolData.steps) && toolData.steps.length ? toolData.steps : [
    'Upload your file to PDFKira.',
    'Customize the document settings.',
    'Download the final file in seconds.',
  ];
  const faqs = Array.isArray(toolData.faqs) ? toolData.faqs : [
    { question: 'Is this tool free?', answer: 'Yes, PDFKira’s core PDF tools are free to use.' },
    { question: 'Do I need an account?', answer: 'No, you can use the tool in your browser without signup.' },
  ];

  return (
    <section className={styles.seofallback} aria-label={`${name} overview`}>
      <div className={styles.wrapper}>
        <h2>{name} Online Free</h2>
        <p>{description}</p>
        <h3>How to {name} with PDFKira</h3>
        <ol>
          {steps.map((step, index) => (
            <li key={`${toolSlug}-step-${index}`}>{step}</li>
          ))}
        </ol>
        <h3>Frequently Asked Questions</h3>
        <dl>
          {faqs.map((faq, index) => (
            <div key={`${toolSlug}-faq-${index}`} className={styles.faqItem}>
              <dt>{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

SEOFallback.propTypes = {
  toolSlug: PropTypes.string,
  toolData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.string),
    faqs: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string,
        answer: PropTypes.string,
      }),
    ),
  }),
};
