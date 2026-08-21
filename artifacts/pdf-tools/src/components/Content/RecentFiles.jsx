import { memo, useEffect, useState } from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import styles from './RecentFiles.module.css';

const RECENT_FILES_KEY = 'pdfkira-recent-files';

function RecentFiles({ maxItems = 5 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(RECENT_FILES_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const clearHistory = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(RECENT_FILES_KEY);
    setItems([]);
  };

  if (!items.length) {
    return (
      <section className={styles.section} aria-label="Recent files">
        <div className={styles.container}>
          <h2>Your Recent Files</h2>
          <div className={styles.empty}>No recent files yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Recent files">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Your Recent Files</h2>
          <button type="button" className={styles.clearButton} onClick={clearHistory}>
            <Trash2 size={14} /> Clear history
          </button>
        </div>
        <div className={styles.list}>
          {items.slice(0, maxItems).map((item, index) => (
            <div key={`${item.name}-${index}`} className={styles.item}>
              <div className={styles.nameWrap}>
                <FileText size={18} className={styles.fileIcon} />
                <div>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.meta}>{item.tool} • {item.time}</div>
                </div>
              </div>
              <button type="button" className={styles.downloadButton} aria-label={`Download ${item.name}`}>
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(RecentFiles);
