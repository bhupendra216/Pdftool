import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import TransformPDF from '@/tools/TransformPDF';

export default function TransformPdfPage() {
  const title = 'PDF Transformer — Transform Any PDF to Look Completely Different';
  const description = 'Change the appearance of any PDF — paper color, damage, scanning artifacts, and more.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/transform-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDF Transformer',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <TransformPDF />;
}
