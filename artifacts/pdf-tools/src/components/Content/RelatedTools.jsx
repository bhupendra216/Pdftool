import { memo } from 'react';
import { ArrowRight, FileText, Scissors, ShieldCheck, Wand2 } from 'lucide-react';
import { Link } from 'wouter';
import styles from './RelatedTools.module.css';
import { toolsSEO } from '@/data/seoConfig';
import { toolContent } from '@/data/toolContent';

const iconMap = {
  FileText,
  Scissors,
  ShieldCheck,
  Wand2,
};

function RelatedTools({ currentToolSlug }) {
  const currentContent = toolContent[currentToolSlug] || {};
  const relatedSlugs = currentContent.relatedTools || ['split-pdf', 'compress-pdf', 'reorder-pages', 'pdf-to-word'];

  const related = relatedSlugs.slice(0, 4).map((slug) => {
    const seo = toolsSEO[slug] || { title: slug, description: 'Free PDF tool from PDFKira.' };
    const title = seo.title.replace(/\s*\|\s*PDFKira.*$/, '').trim();
    const description = seo.description || 'A free, fast PDF tool from PDFKira.';
    const Icon = iconMap[title.split(' ')[0]] || FileText;
    return { slug, title, description, Icon };
  });

  return (
    <section className={styles.section} aria-labelledby="related-tools-title">
      <div className={styles.container}>
        <h2 id="related-tools-title">You might also need:</h2>
        <div className={styles.grid}>
          {related.map(({ slug, title, description, Icon }) => (
            <Link key={slug} href={`/tools/${slug}`} className={styles.card}>
              <div className={styles.iconWrap} aria-hidden="true">
                <Icon size={22} />
              </div>
              <div className={styles.content}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className={styles.linkText}>
                Open tool <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(RelatedTools);
