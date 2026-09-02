import { memo } from 'react';
import styles from './ToolPageLayout.module.css';
import HowToUseSection from './HowToUseSection';
import ToolFeatures from './ToolFeatures';
import UseCases from './UseCases';
import WhyPDFKira from './WhyPDFKira';
import FAQSection from './FAQSection';
import RelatedTools from './RelatedTools';
import ToolComparisonTable from './ToolComparisonTable';
import CTABanner from './CTABanner';
import SocialShare from './SocialShare';
import { toolContent } from '@/data/toolContent';
import { toolsSEO } from '@/data/seoConfig';

function ToolPageLayout({ toolSlug, toolName, children }) {
  const content = toolContent[toolSlug] || {
    howToSteps: [],
    features: [],
    useCases: [],
    relatedTools: [],
  };
  const seoMeta = toolsSEO[toolSlug] || { description: 'Free PDF tool from PDFKira.', faqs: [] };

  return (
    <div className={styles.page}>
      <div className={styles.toolArea}>{children}</div>
      <HowToUseSection toolName={toolName || toolSlug} toolSlug={toolSlug} steps={content.howToSteps} />
      <ToolFeatures features={content.features} />
      <UseCases useCases={content.useCases} />
      <WhyPDFKira />
      <FAQSection faqs={seoMeta.faqs || []} />
      <RelatedTools currentToolSlug={toolSlug} />
      <ToolComparisonTable toolName={toolName || 'PDFKira Tool'} />
      <CTABanner text={`Love ${toolName || 'PDFKira'}? Try our other free tools.`} buttonText="Browse All Tools" href="/tools" />
      <SocialShare url={`https://pdfkira.com/tools/${toolSlug}`} title={toolName || 'PDFKira'} description={seoMeta.description || 'Free PDF tool from PDFKira.'} />
    </div>
  );
}

export default memo(ToolPageLayout);
