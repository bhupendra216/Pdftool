import { ToolDetail } from './ToolDetail';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

export default function OrganizePdfPage() {
  const title = 'Organize PDF Online Free — PDFKira';
  const description = 'Reorder, rotate, and manage pages easily. Free, private, and fast — organize PDFs with PDFKira.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/tools/organize-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Organize PDF Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  return <ToolDetail forcedSlug="organize-pdf" />;
}
