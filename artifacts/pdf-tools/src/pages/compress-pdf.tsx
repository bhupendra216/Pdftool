import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function CompressPdfPage() {
  const title = 'Compress PDF Online Free — PDFKira';
  const description = 'Reduce PDF file size without compromising readability. Free, fast, and private — try PDFKira compression.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/compress-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Compress PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="compress-pdf" />;
}
