import PropTypes from 'prop-types';
import SoftwareApplicationSchema from './SoftwareApplicationSchema';
import FAQPageSchema from './FAQPageSchema';
import BreadcrumbSchema from './BreadcrumbSchema';
import HowToSchema from './HowToSchema';
import OrganizationSchema from './OrganizationSchema';
import WebSiteSchema from './WebSiteSchema';
import ArticleSchema from './ArticleSchema';

/**
 * Central router for schema injection based on page context.
 */
export default function SchemaManager({ pageType, pageData = {} }) {
  switch (pageType) {
    case 'tool':
      return (
        <>
          <SoftwareApplicationSchema
            toolName={pageData.toolName || 'PDF Tool'}
            toolDescription={pageData.toolDescription || 'Free PDF tool'}
            toolUrl={pageData.toolUrl || 'https://pdfkira.com'}
          />
          {pageData.faqs && <FAQPageSchema faqs={pageData.faqs} />}
          {pageData.howTo && <HowToSchema toolName={pageData.toolName || 'PDFKira Tool'} description={pageData.toolDescription || 'PDF tool'} steps={pageData.howTo} />}
          {pageData.breadcrumbs && <BreadcrumbSchema items={pageData.breadcrumbs} />}
        </>
      );
    case 'blog':
      return (
        <ArticleSchema
          headline={pageData.headline || 'PDFKira Blog'}
          description={pageData.description || 'PDFKira article'}
          image={pageData.image || 'https://pdfkira.com/og/default.jpg'}
          datePublished={pageData.datePublished || '2026-08-21'}
          dateModified={pageData.dateModified || pageData.datePublished || '2026-08-21'}
          authorName={pageData.authorName || 'PDFKira'}
        />
      );
    case 'category':
      return pageData.breadcrumbs ? <BreadcrumbSchema items={pageData.breadcrumbs} /> : null;
    case 'home':
      return (
        <>
          <OrganizationSchema
            name="PDFKira"
            url="https://pdfkira.com"
            logoUrl="https://pdfkira.com/logo.png"
            sameAs={['https://www.linkedin.com', 'https://x.com', 'https://facebook.com']}
          />
          <WebSiteSchema siteUrl="https://pdfkira.com" searchUrl="https://pdfkira.com/tools?q={search_term_string}" />
        </>
      );
    default:
      return null;
  }
}

SchemaManager.propTypes = {
  pageType: PropTypes.oneOf(['tool', 'blog', 'category', 'home']),
  pageData: PropTypes.object,
};
