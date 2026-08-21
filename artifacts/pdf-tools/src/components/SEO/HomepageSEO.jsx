import { Helmet } from 'react-helmet-async';

/**
 * Homepage metadata for the main landing page. This keeps the home page distinct from tool pages.
 */
export default function HomepageSEO() {
  const title = 'PDFKira – Free Online PDF Tools | 22+ Tools, No Signup';
  const description = 'Free online PDF tools for merging, splitting, compressing, and converting. 22+ tools, 100% privacy-first, no ads, no signup required.';

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://pdfkira.com/" />
      <meta property="og:image" content="https://pdfkira.com/og/default.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://pdfkira.com/og/default.jpg" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://pdfkira.com/" />
    </Helmet>
  );
}
