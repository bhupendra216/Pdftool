import { memo } from 'react';
import styles from './UseCases.module.css';

const defaultUseCases = [
  { title: 'Job Applications', description: 'Combine resume, cover letter, and portfolio into one PDF.', audience: 'Job Seekers' },
  { title: 'Tax Documents', description: 'Bundle receipts, statements, and forms for filing and backup.', audience: 'Small Business' },
  { title: 'Research Papers', description: 'Organize chapters, appendices, and references in one final file.', audience: 'Students' },
];

function UseCases({ useCases = defaultUseCases }) {
  return (
    <section className={styles.section} aria-labelledby="use-cases-title">
      <div className={styles.container}>
        <h2 id="use-cases-title">Real-world use cases</h2>
        <div className={styles.grid}>
          {useCases.map(({ title, description, audience }) => (
            <article key={title} className={styles.card}>
              <span className={styles.badge}>{audience}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(UseCases);
