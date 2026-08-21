import { memo } from 'react';
import styles from './TestimonialSection.module.css';

const defaultTestimonials = [
  { quote: 'PDFKira is the only PDF tool I use now. No ads, no signup, just works.', author: 'Sarah K.', role: 'Student', avatar: 'SK' },
  { quote: 'Merged 50 invoices in 2 minutes. Saved me hours on busy tax season.', author: 'Mike R.', role: 'Accountant', avatar: 'MR' },
  { quote: 'Finally a PDF tool that respects privacy and keeps the workflow easy.', author: 'Priya S.', role: 'Lawyer', avatar: 'PS' },
];

function TestimonialSection({ testimonials = defaultTestimonials }) {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.container}>
        <h2 id="testimonials-title">Loved by students, teams, and professionals</h2>
        <div className={styles.grid}>
          {testimonials.map(({ quote, author, role, avatar }) => (
            <article key={`${author}-${role}`} className={styles.card}>
              <div className={styles.quoteMark}>“</div>
              <p className={styles.quote}>{quote}</p>
              <div className={styles.person}>
                <div className={styles.avatar}>{avatar}</div>
                <div>
                  <div className={styles.author}>{author}</div>
                  <div className={styles.role}>{role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(TestimonialSection);
