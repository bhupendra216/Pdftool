import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FAQPageSchema from '@/components/SchemaMarkup/FAQPageSchema';
import { FaqSection } from '@/components/shared/FaqSection';

export interface ToolSeoContent {
  slug: string;
  howItWorks: { title: string; description: string }[];
  whyUse: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
}

export function ToolSeoSection({ content }: { content?: ToolSeoContent }) {
  if (!content) return null;

  React.useEffect(() => {
    try {
      (window as any).__renderedToolSeo = true;
    } catch (e) {
      // ignore
    }
    return () => {
      try {
        (window as any).__renderedToolSeo = false;
      } catch (e) {}
    };
  }, []);

  return (
    <div>
      <section className="border-t border-border/70 bg-card/60 py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">How it works</h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">A short, clear walkthrough to get you from upload to result.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.howItWorks.map((step, idx) => (
              <Card key={idx} className="rounded-3xl border-border/70 bg-background/90">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground">{idx + 1}</div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {content.whyUse.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Why use this tool</h2>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">Practical benefits and typical use cases.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {content.whyUse.map((f, i) => (
                <div key={i} className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ: keep interactive accordion plus crawlable h3 markup + JSON-LD */}
      <FAQPageSchema faqs={content.faq as any} />
      <FaqSection faqs={content.faq as any} title={undefined} />

      <div className="sr-only">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          {content.faq.map((q, i) => (
            <div key={i}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="border-t border-border/70 py-8">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge className="rounded-full px-3 py-1 text-xs">Secure processing</Badge>
            <span>·</span>
            <Badge className="rounded-full px-3 py-1 text-xs">Fast</Badge>
            <span>·</span>
            <Badge className="rounded-full px-3 py-1 text-xs">Free</Badge>
            <span>·</span>
            <Badge className="rounded-full px-3 py-1 text-xs">No registration</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ToolSeoSection;
