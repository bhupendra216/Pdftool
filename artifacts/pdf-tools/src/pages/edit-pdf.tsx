import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import EditPdfMvp from './edit-pdf-mvp';
import ToolSeoSection from '@/components/Content/ToolSeoSection';
import { getToolSeoContent } from '@/lib/toolSeoContent';

export default function EditPdfPage() {
  const title = 'Edit PDF Online Free — PDFKira';
  const description = 'Edit PDF text in your browser with a privacy-first client-side workflow. No upload to the server.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/edit-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Edit PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return (
    <>
      <EditPdfMvp />
      <ToolSeoSection content={getToolSeoContent('edit-pdf')} />
    </>
  );
}
