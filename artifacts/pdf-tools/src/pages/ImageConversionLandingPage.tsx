import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ToolDetail } from "@/pages/ToolDetail";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { FaqSection } from "@/components/shared/FaqSection";
import { IMAGE_CONVERSION_PAGES } from "@/lib/image-conversion-pages";

export function ImageConversionLandingPage({ slug }: { slug: string }) {
  const page = IMAGE_CONVERSION_PAGES[slug];

  if (!page) {
    return <ToolDetail forcedSlug="image-converter" />;
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `PDFKira ${page.title}`,
      description: page.description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/convert/${page.slug}`,
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Image Converter", item: `${SITE_URL}/tools/image-converter` },
        { "@type": "ListItem", position: 3, name: page.title, item: `${SITE_URL}/convert/${page.slug}` },
      ],
    },
  ];

  useSEOAdvanced({ title: page.title, description: page.description, canonical: `${SITE_URL}/convert/${page.slug}`, jsonLd });

  return (
    <>
      <ToolDetail
        forcedSlug="image-converter"
        forcedToolName={page.title}
        forcedOutputFormat={page.target.toLowerCase() === "jpg" ? "jpeg" : page.target.toLowerCase()}
      />
      <article className="border-t border-border/70 bg-card/50" aria-labelledby="conversion-guide-heading">
        <div className="container mx-auto max-w-5xl space-y-16 px-4 py-20 md:px-6">
          <header className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{page.source} to {page.target} guide</p>
            <h2 id="conversion-guide-heading" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Convert {page.source} to {page.target} with a clear browser workflow</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{page.description}</p>
          </header>

          <div className="grid gap-10 md:grid-cols-2">
            <section aria-labelledby="what-is-heading">
              <h2 id="what-is-heading" className="text-2xl font-bold text-foreground">What is {page.source}?</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{page.whatIs}</p>
            </section>
            <section aria-labelledby="why-convert-heading">
              <h2 id="why-convert-heading" className="text-2xl font-bold text-foreground">Why convert {page.source} to {page.target}?</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{page.whyConvert}</p>
            </section>
          </div>

          <section aria-labelledby="how-to-heading">
            <h2 id="how-to-heading" className="text-2xl font-bold text-foreground">How to convert {page.source} to {page.target}</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {page.howTo.map((step, index) => (
                <li key={step} className="rounded-2xl border border-border/70 bg-background p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-hidden="true">{index + 1}</span>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-2xl font-bold text-foreground">Features</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {page.features.map((feature) => <li key={feature} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-5 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{feature}</li>)}
            </ul>
          </section>

          <FaqSection faqs={page.faqs} />

          <section aria-labelledby="related-tools-heading">
            <h2 id="related-tools-heading" className="text-2xl font-bold text-foreground">Related tools</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {page.related.map((related) => <Link key={related.href} href={related.href} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-background p-5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"><span>{related.label}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>)}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
