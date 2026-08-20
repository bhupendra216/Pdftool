import { useEffect } from 'react';
import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function SplitPdfPage() {
  const title = 'Split PDF Online Free — PDFKira';
  const description = 'Split large PDFs into smaller files quickly and privately. Free, fast, and secure with PDFKira.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/split-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Split PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="split-pdf" />;
}
