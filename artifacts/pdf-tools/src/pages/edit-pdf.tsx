import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import EditPdfMvp from './edit-pdf-mvp';
import ToolSeoSection from '@/components/Content/ToolSeoSection';
import { getToolSeoContent } from '@/lib/toolSeoContent';
import {
  EDIT_PDF_APPLICATION_DESCRIPTION,
  EDIT_PDF_META_DESCRIPTION,
  EDIT_PDF_SEO_TITLE,
} from '../data/toolSeoContent';

export default function EditPdfPage() {
  const title = EDIT_PDF_SEO_TITLE;
  const description = EDIT_PDF_META_DESCRIPTION;

  useSEOAdvanced({
    title,
    description: EDIT_PDF_APPLICATION_DESCRIPTION,
    canonical: `${SITE_URL}/tools/edit-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Edit PDF',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      description,
      url: `${SITE_URL}/tools/edit-pdf`,
    },
  });

  return (
    <>
      <EditPdfMvp />
      <ToolSeoSection content={getToolSeoContent('edit-pdf')} />
    </>
  );
}
