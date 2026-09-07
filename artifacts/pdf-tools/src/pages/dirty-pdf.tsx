import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import DirtyPDF from '@/tools/DirtyPDF';
import ToolSeoSection from '@/components/Content/ToolSeoSection';
import { getToolSeoContent } from '@/lib/toolSeoContent';

export default function DirtyPdfPage() {
  const title = 'Transform PDF — Make pages look aged and handwritten';
  const description = 'Apply distressed, handwritten-looking effects to a PDF in your browser — remove polished machine prints and add natural paper texture and marks.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/transform-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Transform Handwritten PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
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
