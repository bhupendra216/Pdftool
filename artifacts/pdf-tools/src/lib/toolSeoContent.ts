import type { ToolSeoContent } from '@/components/Content/ToolSeoSection';
import { TOOL_SEO_CONTENT } from '@/data/toolSeoContent';
import { toolContent } from '@/data/toolContent';
// Import tools catalog from api-server as an additional fallback. This file
// is static editorial data and contains no Node-only runtime imports,
// so it is safe to include in the frontend bundle.
import { tools as apiServerTools } from '../../../api-server/src/lib/content';

export function getToolSeoContent(slug: string): ToolSeoContent | undefined {
  const explicit = (TOOL_SEO_CONTENT as any)[slug];
  if (explicit) return explicit;

  const raw = (toolContent as any)[slug];
  if (raw) {
    const mapped: ToolSeoContent = {
      slug,
      howItWorks: (raw.howToSteps || raw.steps || []).slice(0, 3).map((s: any) => ({ title: s.title || s, description: s.description || s })),
      whyUse: (raw.features || []).slice(0, 3).map((f: any) => ({ title: f.title || f, description: f.description || '' })),
      faq: (raw.faqs || []).slice(0, 6).map((q: any) => ({ question: q.question, answer: q.answer })),
    };
    return mapped;
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

  return mappedFromApi;
}

export default getToolSeoContent;
