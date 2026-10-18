import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FAQPageSchema from '@/components/SchemaMarkup/FAQPageSchema';
import { FaqSection } from '@/components/shared/FaqSection';
import { Link } from "wouter";

export interface ToolSeoContent {
  slug: string;
  howItWorks: { title: string; description: string }[];
  whyUse: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  howToSteps?: string[];
  useCases?: { title: string; description: string; example: string }[];
  technicalSpecs?: Record<string, string>;
  privacyText?: string;
  limitations?: string[];
  relatedTools?: { slug: string; name: string; reason: string }[];
}

export function ToolSeoSection({ content }: { content?: ToolSeoContent }) {
  if (!content) return null;

  return (
    <div>
      {content.howToSteps ? (
        <section className="border-t border-border/70 bg-card/60 py-16">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">How to use PDF to Markdown</h2>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              {content.howToSteps.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
          </div>
        </section>
      ) : (
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
      )}

      {content.useCases && (
        <section className="py-16">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Use cases</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {content.useCases.map((item) => (
                <article key={item.title} className="rounded-3xl border border-border/70 bg-card/90 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong>Example:</strong> {item.example}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.technicalSpecs && (
        <section className="border-t border-border/70 py-12">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Technical specifications</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {Object.entries(content.technicalSpecs).map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold text-foreground">{label}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {content.privacyText && (
        <section className="border-t border-border/70 py-12">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Privacy and processing</h2>
            <p className="leading-relaxed text-muted-foreground">{content.privacyText}</p>
          </div>
        </section>
      )}

      {content.limitations && (
        <section className="border-t border-border/70 py-12">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Limitations</h2>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {content.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </div>
        </section>
      )}

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
      {content.slug === "pdf-to-markdown" ? (
        <section className="border-t border-border/70 bg-card/60 py-16">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="space-y-8">
              {content.faq.map((item) => (
                <article key={item.question}>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : <FaqSection faqs={content.faq as any} title={undefined} />}

      {content.slug !== "pdf-to-markdown" && <div className="sr-only">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          {content.faq.map((q, i) => (
            <div key={i}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </div>
          ))}
        </div>
      </div>}

      {content.relatedTools && (
        <section className="border-t border-border/70 py-12">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Related tools</h2>
            <ul className="space-y-3">
              {content.relatedTools.map((item) => (
                <li key={item.slug}>
                  <Link href={`/tools/${item.slug}`} className="font-semibold text-primary underline">{item.name}</Link>
                  <span className="text-muted-foreground"> — {item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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
