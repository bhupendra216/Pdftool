import { useSEOAdvanced } from "@/hooks/use-seo";
import { GigPlatformsDirectory } from "@/components/GigPlatformsDirectory";
import { FaqSection } from "@/components/shared/FaqSection";
import { aiJobsFaqs } from "@/data/aiJobsFaqs";

export function AiJobs() {
  useSEOAdvanced({
    title: "AI Jobs",
    description: "Browse remote AI jobs and non-technical paid AI training tasks, data collection gigs, translation, video, photo, and annotation projects.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: aiJobsFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AI Jobs
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Browse remote AI jobs, plus independently operated platforms offering non-technical AI task work.
          </p>
        </div>
      </section>

      <GigPlatformsDirectory />
      <FaqSection
        faqs={aiJobsFaqs}
        description="Understand what non-technical AI task work involves, how pay varies, and how to evaluate platforms before signing up."
      />
    </main>
  );
}
