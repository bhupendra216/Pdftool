import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import styles from './CTABanner.module.css';

function CTABanner({ text = 'Love PDFKira? Try our other free tools.', buttonText = 'Browse All Tools', href = '/tools' }) {
  return (
    <section className={styles.banner} aria-label="Call to action">
      <div className={styles.content}>
        <p>{text}</p>
        <Link href={href} className={styles.button}>
          {buttonText} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export default memo(CTABanner);
