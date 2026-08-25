import { useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaqSection } from '@/components/shared/FaqSection';
import { SITE_URL } from '@/lib/site-config';
import { useSEOAdvanced } from '@/hooks/use-seo';

const comparisonFaqs = [
  {
    question: 'Is PDFKira free?',
    answer: 'PDFKira offers a free core set of PDF tools for common workflows such as merging, splitting, compressing, converting, and organizing documents without a mandatory sign-up.',
  },
  {
    question: 'Do I need to sign up?',
    answer: 'No account is required for the core workflow on PDFKira. You can use the tool directly in the browser for quick one-off tasks.',
  },
  {
    question: 'Is iLovePDF better than Smallpdf?',
    answer: 'It depends on the workflow. iLovePDF is known for a large library of tools, while Smallpdf is often chosen for a more polished interface and a more focused document workflow. PDFKira is a straightforward alternative when you want a simple, browser-based experience without a sign-up barrier.',
  },
  {
    question: 'Which tool is better for a quick task?',
    answer: 'For simple, everyday tasks, PDFKira is a strong option if you want a fast and minimal workflow. The best choice depends on whether you need a broad tool library, a polished premium experience, or a quick no-signup tool for basic file work.',
  },
  {
    question: 'When should I prefer PDFKira?',
    answer: 'PDFKira is a good fit when you want a quick PDF workflow without creating an account and prefer a clean, focused experience for common document tasks.',
  },
];

const comparisonRows = [
  ['Free usage limits', 'Daily caps', 'About 2 tasks/day', 'Free core tools'],
  ['Sign up required', 'For some tools', 'For most use', 'No'],
  ['Ads', 'Yes (free tier)', 'Minimal', 'Minimal'],
  ['Speed', 'Good', 'Good', 'Fast and simple'],
  ['File size limits', 'Yes', 'Yes (free tier)', 'Varies by task'],
  ['Privacy / file retention', 'Auto-delete claimed', 'Auto-delete claimed', 'Privacy-first browser workflow'],
  ['Price', 'Paid plan for full access', 'Subscription-based', 'Free'],
  ['No-signup option', 'Partial', 'Partial', 'Yes'],
];

export default function CompareIlovepdfVsSmallpdfVsPdfkiraPage() {
  const canonicalUrl = `${SITE_URL}/compare/ilovepdf-vs-smallpdf-vs-pdfkira`;

  const faqJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: comparisonFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }),
    [],
  );

  useSEOAdvanced({
    title: 'iLovePDF vs Smallpdf vs PDFKira',
    description: 'Compare iLovePDF, Smallpdf, and PDFKira to choose the right free PDF tool for your workflow.',
    canonical: canonicalUrl,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'iLovePDF vs Smallpdf vs PDFKira',
        description: 'Compare iLovePDF, Smallpdf, and PDFKira to choose the right free PDF tool for your workflow.',
        url: canonicalUrl,
      },
      faqJsonLd,
    ],
  });

  return (
    <div className="bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Compare</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">iLovePDF vs Smallpdf vs PDFKira</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
        <section className="mb-12">
          <p className="text-lg leading-8 text-muted-foreground">
            When you are choosing between online PDF tools, the best option depends on whether you need a broad tool library, a polished premium interface, or a simple no-sign-up workflow. This comparison breaks down iLovePDF, Smallpdf, and PDFKira so you can match the tool to the job.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">iLovePDF</h2>
          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-base leading-7 text-muted-foreground">
              iLovePDF is a well-known online PDF platform with a broad library of tools for document tasks. It is often popular with users who want familiar PDF operations in one place, especially when they need to work across mobile and desktop devices.
            </p>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Advantages</h3>
              <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                <li>Large tool library (25+ tools)</li>
                <li>Established brand, widely trusted</li>
                <li>Mobile apps and desktop app available</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Disadvantages</h3>
              <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                <li>Aggressive upsells to premium plan</li>
                <li>Ads on free tier</li>
                <li>Daily task limits without an account</li>
                <li>Some tools require signup</li>
              </ul>
            </div>

            <p className="text-base leading-7 text-muted-foreground">
              <strong className="text-foreground">When it&apos;s preferred:</strong> users who want a large ecosystem of PDF tools or already use iLovePDF regularly across devices.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Smallpdf</h2>
          <div className="space-y-6 rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="text-base leading-7 text-muted-foreground">
              Smallpdf is a popular PDF tool known for a cleaner interface and a more polished user experience. It is often used for common tasks such as compression, conversion, and document cleanup, especially when users want a streamlined workflow.
            </p>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Advantages</h3>
              <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                <li>Clean, minimal UI</li>
                <li>Good OCR quality</li>
                <li>Fast processing for small files</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Disadvantages</h3>
              <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
                <li>Very limited free usage (historically around 2 tasks per day)</li>
                <li>Subscription is often needed for real use</li>
                <li>Some users report frustration with auto-renewing subscription plans</li>
              </ul>
            </div>

            <p className="text-base leading-7 text-muted-foreground">
              <strong className="text-foreground">When it&apos;s preferred:</strong> occasional users who do not mind paying for a polished, ad-light experience and a more highly curated interface.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm md:text-base">
              <thead className="bg-primary/10 text-foreground">
                <tr>
                  <th className="border-b border-border px-4 py-3 font-semibold">Feature</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">iLovePDF</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Smallpdf</th>
                  <th className="border-b border-border px-4 py-3 font-semibold">Pdfkira</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {comparisonRows.map(([feature, left, middle, right], index) => (
                  <tr key={feature} className={index % 2 === 0 ? 'bg-background' : 'bg-card/60'}>
                    <td className="border-b border-border px-4 py-3 font-medium text-foreground">{feature}</td>
                    <td className="border-b border-border px-4 py-3">{left}</td>
                    <td className="border-b border-border px-4 py-3">{middle}</td>
                    <td className="border-b border-border px-4 py-3">{right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Why PDFKira</h2>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
              <li>No signup required</li>
              <li>Free core tools</li>
              <li>Fast, browser-based processing</li>
              <li>Clean, ad-light interface</li>
            </ul>
            {/* TODO: confirm before publishing */}
            <p className="mb-6 text-base leading-7 text-muted-foreground">
              <strong className="text-foreground">When to use:</strong> choose PDFKira when you want a quick document task done without creating an account and prefer a simple, focused workflow for common PDF jobs.
            </p>
            <div className="not-prose">
              <Button size="lg" asChild className="rounded-full px-8">
                <Link href="/tools">
                  Browse all tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <FaqSection faqs={comparisonFaqs} title="Frequently Asked Questions" />
        </section>
      </main>
    </div>
  );
}
