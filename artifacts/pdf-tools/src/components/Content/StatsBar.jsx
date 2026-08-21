import { memo } from 'react';
import styles from './StatsBar.module.css';

const stats = [
  { value: '22+', label: 'Free Tools' },
  { value: '100%', label: 'Privacy First' },
  { value: '0', label: 'Signup Required' },
  { value: '< 5s', label: 'Average Processing' },
];

function StatsBar() {
  return (
    <section className={styles.section} aria-label="PDFKira statistics">
      <div className={styles.container}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statItem}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(StatsBar);
