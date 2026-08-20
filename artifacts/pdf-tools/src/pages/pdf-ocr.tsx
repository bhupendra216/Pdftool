import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function PdfOcrPage() {
  const title = 'PDF OCR Online Free — PDFKira';
  const description = 'Extract text from scanned PDFs quickly and privately with OCR. Free and secure — try PDFKira OCR.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/ocr-image-to-text`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira OCR Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="ocr-image-to-text" />;
}
