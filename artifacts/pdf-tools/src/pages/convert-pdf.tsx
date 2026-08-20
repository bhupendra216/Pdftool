import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function ConvertPdfPage() {
  const title = 'Convert PDF Online Free — PDFKira';
  const description = 'Convert PDFs to and from popular formats quickly and privately. Free, fast, and secure with PDFKira.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/pdf-to-jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Convert PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="pdf-to-jpg" />;
}
