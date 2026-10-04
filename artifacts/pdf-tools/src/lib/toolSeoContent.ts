import type { ToolSeoContent } from '@/components/Content/ToolSeoSection';
import { TOOL_SEO_CONTENT } from '@/data/toolSeoContent';
import { toolContent } from '@/data/toolContent';
// Import tools catalog from api-server as an additional fallback. This file
// is static editorial data and contains no Node-only runtime imports,
// so it is safe to include in the frontend bundle.
import { tools as apiServerTools } from '../../../api-server/src/lib/content';

export function ensureToolFaqs(
  toolName: string,
  slug: string,
  faqs: ToolSeoContent['faq'] = [],
): ToolSeoContent['faq'] {
  const completeFaqs = [...faqs];
  const supplementalFaqs: ToolSeoContent['faq'] = [
    {
      question: `How do I use ${toolName}?`,
      answer:
        'Open this page in your browser, provide the file or information requested, choose any available options, then start the task and save the result.',
    },
    {
      question: `Do I need to install software to use ${toolName}?`,
      answer:
        'No. You can use this online tool in a current web browser without installing a separate desktop application.',
    },
    {
      question: `Will ${toolName} change my original file?`,
      answer:
        slug === 'qr-code-generator'
          ? 'No. The QR code is created as a separate download, and the URL or text you enter remains unchanged.'
          : 'No. The result is saved as a separate download, so your original file remains unchanged.',
    },
    {
      question: `Can I use ${toolName} for free?`,
      answer:
        'Yes. PDFKira currently offers its core tools free to use, with no account required for this workflow.',
    },
  ];

  for (const faq of supplementalFaqs) {
    if (completeFaqs.length >= 3) break;
    if (!completeFaqs.some((existing) => existing.question === faq.question)) completeFaqs.push(faq);
  }

  return completeFaqs;
}

export function getToolSeoContent(slug: string): ToolSeoContent | undefined {
  const explicit = (TOOL_SEO_CONTENT as any)[slug];
  if (explicit) {
    return { ...explicit, faq: ensureToolFaqs(explicit.slug || slug, slug, explicit.faq) };
  }

  const raw = (toolContent as any)[slug];
  if (raw) {
    const mapped: ToolSeoContent = {
      slug,
      howItWorks: (raw.howToSteps || raw.steps || []).slice(0, 3).map((s: any) => ({ title: s.title || s, description: s.description || s })),
      whyUse: (raw.features || []).slice(0, 3).map((f: any) => ({ title: f.title || f, description: f.description || '' })),
      faq: (raw.faqs || []).slice(0, 6).map((q: any) => ({ question: q.question, answer: q.answer })),
    };
    return { ...mapped, faq: ensureToolFaqs(slug, slug, mapped.faq) };
  }

  // Third fallback: look up the canonical `tools` catalog exported by the
  // api-server. This mirrors the fallback used by scripts/generate-seo.ts so
  // the frontend can map the same content that the prerender uses.
  const apiTool = (apiServerTools as any).find((t: any) => t.slug === slug);
  if (!apiTool) return undefined;

  const mappedFromApi: ToolSeoContent = {
    slug,
    howItWorks: (apiTool.steps || []).slice(0, 3).map((s: any) => {
      if (typeof s === 'string') return { title: s, description: s };
      return { title: s.title || s, description: s.description || s };
    }),
    // apiTool does not provide a dedicated `whyUse` field; leave empty array.
    whyUse: [],
    faq: (apiTool.faqs || []).slice(0, 6).map((q: any) => ({ question: q.question, answer: q.answer })),
  };

  return { ...mappedFromApi, faq: ensureToolFaqs(slug, slug, mappedFromApi.faq) };
}

export default getToolSeoContent;
