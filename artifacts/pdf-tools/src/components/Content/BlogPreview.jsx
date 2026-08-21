import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import styles from './BlogPreview.module.css';

function BlogPreview({ posts = [] }) {
  const items = posts.length ? posts : [
    { slug: 'how-to-compress-pdf-files', title: 'How to compress PDF files without losing quality', excerpt: 'Learn how to shrink large PDFs for easier sharing and faster uploads.', date: 'Aug 21, 2026', readTime: '4 min read' },
    { slug: 'merge-pdf-guide', title: 'The best way to combine PDF files safely', excerpt: 'A practical guide to assembling forms, reports, and contracts into one polished document.', date: 'Aug 18, 2026', readTime: '5 min read' },
    { slug: 'pdf-security-tips', title: '3 smart PDF security habits for everyday work', excerpt: 'Protect sensitive data without slowing down your document workflow.', date: 'Aug 14, 2026', readTime: '3 min read' },
  ];

  return (
    <section className={styles.section} aria-labelledby="blog-preview-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="blog-preview-title">Latest PDF Tips & Guides</h2>
          <Link href="/blog" className={styles.link}>See all posts <ArrowRight size={16} /></Link>
        </div>

        <div className={styles.grid}>
          {items.map((post) => (
            <article className={styles.card} key={post.slug}>
              <div className={styles.imagePlaceholder} aria-hidden="true">PDF Guide</div>
              <div className={styles.meta}>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>Read more <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(BlogPreview);
