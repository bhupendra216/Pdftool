import { memo } from 'react';
import styles from './HomepageContent.module.css';
import StatsBar from './StatsBar';
import WhyPDFKira from './WhyPDFKira';
import BlogPreview from './BlogPreview';
import TestimonialSection from './TestimonialSection';
import NewsletterSignup from './NewsletterSignup';
import ToolGrid from './ToolGrid';

function HomepageContent({ tools = [], posts = [] }) {
  return (
    <div className={styles.homepage}>
      <StatsBar />
      <ToolGrid tools={tools} />
      <WhyPDFKira />
      <BlogPreview posts={posts} />
      <TestimonialSection />
      <NewsletterSignup />
    </div>
  );
}

export default memo(HomepageContent);
