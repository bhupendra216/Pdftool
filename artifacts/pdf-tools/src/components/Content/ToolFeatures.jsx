import { memo } from 'react';
import { Clock3, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import styles from './ToolFeatures.module.css';

const defaultFeatures = [
  { icon: 'Zap', title: 'Fast Processing', description: 'Get results in a matter of seconds.' },
  { icon: 'ShieldCheck', title: 'Secure Workflow', description: 'Your files stay protected and private.' },
  { icon: 'Clock3', title: 'Time-Saving', description: 'Finish the task without extra steps.' },
  { icon: 'Smartphone', title: 'All Devices', description: 'Use it on desktop, tablet, and mobile.' },
];

const iconMap = { Zap, ShieldCheck, Clock3, Smartphone };

function ToolFeatures({ features = defaultFeatures }) {
  return (
    <section className={styles.section} aria-labelledby="tool-features-title">
      <div className={styles.container}>
        <h2 id="tool-features-title">Why this tool stands out</h2>
        <div className={styles.grid}>
          {features.map(({ icon, title, description }, index) => {
            const Icon = iconMap[icon] || Zap;
            return (
              <article key={`${title}-${index}`} className={styles.card}>
                <div className={styles.iconWrap} aria-hidden="true"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(ToolFeatures);
