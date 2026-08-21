import { memo, useEffect, useState } from 'react';
import styles from './ScrollProgressBar.module.css';

function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setWidth(Math.min(Math.max(progress, 0), 100));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className={styles.bar} style={{ width: `${width}%` }} aria-hidden="true" />;
}

export default memo(ScrollProgressBar);
