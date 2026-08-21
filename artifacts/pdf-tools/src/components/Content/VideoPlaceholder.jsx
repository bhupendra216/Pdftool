import { memo } from 'react';
import { Play } from 'lucide-react';
import styles from './VideoPlaceholder.module.css';

function VideoPlaceholder({ title = 'How it works', description = 'Coming soon. A short walkthrough will be added here later.' }) {
  return (
    <section className={styles.section} aria-label={`${title} video placeholder`}>
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <div className={styles.playButton} aria-hidden="true">
            <Play size={28} fill="currentColor" />
          </div>
        </div>
        <div className={styles.textBlock}>
          <span className={styles.label}>Video</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default memo(VideoPlaceholder);
