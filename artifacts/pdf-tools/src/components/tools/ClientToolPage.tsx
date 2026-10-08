import type { ReactNode } from "react";
import { Link } from "wouter";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { getClientToolContent } from "@/data/clientToolContent";

export function ClientToolPage({ slug, children }: { slug: "pdf-to-excel" | "sign-pdf" | "ocr-pdf"; children: ReactNode }) {
  const tool = getClientToolContent(slug);
  if (!tool) throw new Error(`Missing content for client tool: ${slug}`);

  const canonical = `${SITE_URL}/tools/${tool.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        url: canonical,
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  useSEOAdvanced({ title: tool.title, description: tool.description, canonical, jsonLd: structuredData });

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{tool.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{tool.intro}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-10 md:px-6">
        {children}
      </section>

      <section className="border-t border-border/70 bg-card/40 py-14">
        <div className="container mx-auto max-w-6xl space-y-14 px-4 md:px-6">
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {tool.steps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-border/70 bg-card p-5">
                  <span className="text-sm font-semibold text-primary">Step {index + 1}</span>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why use this tool</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {tool.benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-2xl border border-border/70 bg-card p-5">
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {tool.faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-border/70 bg-card p-5">
                  <summary className="cursor-pointer font-medium text-foreground">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <nav aria-label="Related tools">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Related tools</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {tool.related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
