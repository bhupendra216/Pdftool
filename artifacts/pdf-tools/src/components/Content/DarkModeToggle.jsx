import { memo, useEffect, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';
import styles from './DarkModeToggle.module.css';

const THEME_KEY = 'pdfkira-theme';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = saved ? JSON.parse(saved) : prefersDark;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
  }, []);

  const toggleTheme = () => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, JSON.stringify(nextValue));
    }
    document.documentElement.dataset.theme = nextValue ? 'dark' : 'light';
  };

  return (
    <button type="button" className={styles.toggle} onClick={toggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default memo(DarkModeToggle);
