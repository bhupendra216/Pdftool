import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import DirtyPDF from '@/tools/DirtyPDF';
import ToolSeoSection from '@/components/Content/ToolSeoSection';
import { getToolSeoContent } from '@/lib/toolSeoContent';

export default function DirtyPdfPage() {
  const title = 'Make PDF Look Old — Aged, Vintage & Scanned Paper Effects | PDFKira';
  const description = 'Make a PDF look old with vintage paper tones, grain, creases, and scanned-paper effects. Process locally in your browser and export a flattened image PDF.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/transform-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Aged & Scanned PDF Effects',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      url: `${SITE_URL}/tools/transform-pdf`,
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });
  return (
    <>
      <DirtyPDF />
      <ToolSeoSection content={getToolSeoContent('transform-pdf')} />
    </>
  );
}
