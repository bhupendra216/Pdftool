import { memo, useState } from 'react';
import styles from './NewsletterSignup.module.css';

const STORAGE_KEY = 'pdfkira-newsletter-email';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!valid) {
      setStatus('error');
      setError('Please enter a valid email address.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: trimmed, subscribedAt: new Date().toISOString() }));
    }
    setStatus('success');
    setError('');
    setEmail('');
  };

  return (
    <section className={styles.section} aria-labelledby="newsletter-signup-title">
      <div className={styles.container}>
        <div className={styles.inner}>
          <div>
            <p className={styles.kicker}>Stay in the loop</p>
            <h2 id="newsletter-signup-title">Get PDF tips & new tool alerts</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className={styles.visuallyHidden}>Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              aria-invalid={status === 'error'}
            />
            <button type="submit">Subscribe</button>
          </form>

          {status === 'success' ? (
            <p className={styles.success}>You’re in! A quick PDF tip will land in your inbox soon.</p>
          ) : (
            <p className={styles.helper}>No spam. Unsubscribe anytime.</p>
          )}

          {status === 'error' && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default memo(NewsletterSignup);
