import { memo } from 'react';
import { BadgeCheck, Clock3, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import styles from './WhyPDFKira.module.css';

const items = [
  { icon: WalletCards, title: '100% Free', description: 'No hidden fees. No credit card. Use forever.' },
  { icon: ShieldCheck, title: 'Privacy First', description: 'Files processed securely. Auto-deleted after processing.' },
  { icon: BadgeCheck, title: 'No Signup', description: 'Start instantly. No account creation needed.' },
  { icon: Clock3, title: 'Lightning Fast', description: 'Most operations complete in under 5 seconds.' },
  { icon: Sparkles, title: 'No Ads', description: 'Clean interface. No distractions. No popups.' },
];

function WhyPDFKira() {
  return (
    <section className={styles.section} aria-labelledby="why-pdfkira-title">
      <div className={styles.container}>
        <div className={styles.headingWrap}>
          <p className={styles.kicker}>Why people choose us</p>
          <h2 id="why-pdfkira-title">Why PDFKira</h2>
        </div>
        <div className={styles.grid}>
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className={styles.item}>
              <div className={styles.iconWrap} aria-hidden="true">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(WhyPDFKira);
