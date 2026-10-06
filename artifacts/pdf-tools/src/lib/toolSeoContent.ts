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
  const sourceFaqs = [...faqs].slice(0, 6);
  const supplementalFaqs: Array<{
    matches: RegExp;
    faq: ToolSeoContent['faq'][number];
  }> = [
    {
      matches: /size|page|limit/i,
      faq: {
        question: `Are there file size or page limits for ${toolName}?`,
        answer:
          'Limits vary by tool and file type. Check the upload controls for the current file-size or page limit before starting; large or complex files may take longer.',
      },
    },
    {
      matches: /browser|https|server|privacy|private|secure|delete/i,
      faq: {
        question: `How does ${toolName} process my file?`,
        answer:
          'Processing depends on the tool: some operations run in your browser, while others use secure server processing over HTTPS. Server-side temporary files are deleted within one hour.',
      },
    },
    {
      matches: /format|quality|layout|preserve|accuracy/i,
      faq: {
        question: `Will ${toolName} preserve my file's formatting and quality?`,
        answer:
          'Results depend on the source file and the operation. Review the downloaded result before relying on it, especially for complex layouts, scanned pages, or image-heavy documents.',
      },
    },
    {
      matches: /free|cost|price|paid/i,
      faq: {
        question: `Can I use ${toolName} for free?`,
        answer:
          'Yes. PDFKira currently offers its core tools free to use, with no account required for this workflow.',
      },
    },
    {
      matches: /install|software/i,
      faq: {
        question: `Do I need to install software to use ${toolName}?`,
        answer:
          'No. You can use this online tool in a current web browser without installing a separate desktop application.',
      },
    },
  ];

  const completeFaqs: ToolSeoContent['faq'] = [];
  for (const supplemental of supplementalFaqs) {
    const matchingFaq = sourceFaqs.find((faq) =>
      supplemental.matches.test(`${faq.question} ${faq.answer}`),
    );
    const faq = matchingFaq || supplemental.faq;
    if (!completeFaqs.some((existing) => existing.question === faq.question)) {
      completeFaqs.push(faq);
    }
  }

  for (const faq of sourceFaqs) {
    if (completeFaqs.length >= 6) break;
    if (!completeFaqs.some((existing) => existing.question === faq.question)) completeFaqs.push(faq);
  }

  return completeFaqs;
}

function completeToolBenefits(
  toolName: string,
  shortDescription: string,
  benefits: ToolSeoContent['whyUse'] = [],
): ToolSeoContent['whyUse'] {
  const complete = [...benefits].slice(0, 3);
  const defaults: ToolSeoContent['whyUse'] = [
    {
      title: `A focused ${toolName} workflow`,
      description: shortDescription,
    },
    {
      title: 'Simple to use in your browser',
      description: `Open ${toolName} in a modern browser, follow the on-screen steps, and download the result without installing a separate application.`,
    },
    {
      title: 'Keep control of your files',
      description: 'The original file is left unchanged; review and save the separate result when the task is complete.',
    },
  ];

  for (const benefit of defaults) {
    if (complete.length >= 3) break;
    if (!complete.some((existing) => existing.title === benefit.title)) complete.push(benefit);
  }

  return complete;
}

export function getToolSeoContent(slug: string): ToolSeoContent | undefined {
  const explicit = (TOOL_SEO_CONTENT as any)[slug];
  if (explicit) {
    const apiTool = apiServerTools.find((tool) => tool.slug === slug);
    return {
      ...explicit,
      whyUse: completeToolBenefits(
        apiTool?.name || explicit.slug || slug,
        apiTool?.shortDescription || '',
        explicit.whyUse,
      ),
      faq: ensureToolFaqs(apiTool?.name || explicit.slug || slug, slug, explicit.faq),
    };
  }

  const raw = (toolContent as any)[slug];
  if (raw) {
    const apiTool = apiServerTools.find((tool) => tool.slug === slug);
    const mapped: ToolSeoContent = {
      slug,
      howItWorks: (raw.howToSteps || raw.steps || []).slice(0, 3).map((s: any) => ({ title: s.title || s, description: s.description || s })),
      whyUse: completeToolBenefits(
        apiTool?.name || raw.name || slug,
        apiTool?.shortDescription || raw.description || '',
        (raw.features || []).slice(0, 3).map((f: any) => ({ title: f.title || f, description: f.description || '' })),
      ),
      faq: (raw.faqs || []).slice(0, 6).map((q: any) => ({ question: q.question, answer: q.answer })),
    };
    return { ...mapped, faq: ensureToolFaqs(apiTool?.name || slug, slug, mapped.faq) };
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
    whyUse: completeToolBenefits(apiTool.name, apiTool.shortDescription),
    faq: (apiTool.faqs || []).slice(0, 6).map((q: any) => ({ question: q.question, answer: q.answer })),
  };

  return { ...mappedFromApi, faq: ensureToolFaqs(slug, slug, mappedFromApi.faq) };
}

export default getToolSeoContent;
