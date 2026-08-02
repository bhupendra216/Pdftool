import { useEffect } from 'react';
import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function MergePdfPage() {
  const title = 'Merge PDF Online Free — PDFKira';
  const description = 'Merge multiple PDFs quickly and securely for free. Fast, private, and easy to use with PDFKira.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/merge-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Merge PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="merge-pdf" />;
}
