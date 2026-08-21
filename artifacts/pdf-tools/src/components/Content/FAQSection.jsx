import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQSection.module.css';
import FAQPageSchema from '@/components/SchemaMarkup/FAQPageSchema';

function FAQSection({ faqs = [] }) {
  const faqList = faqs.length ? faqs : [
    { question: 'Is PDFKira free to use?', answer: 'Yes. PDFKira keeps the core tool experience free and no signup is needed.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. The browser-based tools work on desktop, tablet, and mobile devices.' },
    { question: 'Are my files secure?', answer: 'Yes. Processing is privacy-first and your files are handled securely in the browser workflow.' },
  ];

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <FAQPageSchema faqs={faqList} />
      <div className={styles.container}>
        <h2 id="faq-title">Frequently Asked Questions</h2>
        <div className={styles.list}>
          {faqList.map((faq, index) => (
            <details key={`${faq.question}-${index}`} className={styles.item}>
              <summary>
                <span>{faq.question}</span>
                <ChevronDown size={18} className={styles.chevron} />
              </summary>
              <div className={styles.answer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(FAQSection);
