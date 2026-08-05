import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BrandMark } from "@/components/brand/BrandMark";

export function About() {
  useSEOAdvanced({
    title: "About PDFKira",
    description: "Learn why PDFKira exists and how we approach privacy, speed, accuracy, and product quality.",
    canonical: `${SITE_URL}/about`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About PDFKira",
      url: `${SITE_URL}/about`,
      mainEntity: {
        "@type": "Organization",
        name: "PDFKira",
        url: SITE_URL,
      },
    },
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <BrandMark className="mb-6 justify-center" logoClassName="h-16 w-16" wordmarkClassName="text-xl" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Built for people who work with documents every day.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            PDFKira is designed to keep common document tasks simple, private, and reliable without making users install software.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-lg dark:prose-invert">
          <h2>Our mission</h2>
        <p>
          Document work should be straightforward, reliable, and respectful of your time. PDFKira was created to provide a focused set of PDF tools without the clutter or unnecessary friction.
        </p>

          <h2>Why we're different</h2>
        <ul>
          <li><strong>Privacy First:</strong> Your documents are your business. When you upload a file to our servers for processing, it is automatically and permanently deleted immediately after your task is complete. No lingering data, no training AI models.</li>
          <li><strong>Zero Clutter:</strong> We believe in calm, focused interfaces. You won't find banner ads, auto-playing videos, or aggressive upsells here.</li>
          <li><strong>Modern Engineering:</strong> We leverage the latest web technologies to process as much as possible directly in your browser, saving you time and bandwidth.</li>
        </ul>

          <h2>Free for everyone</h2>
        <p>
          We believe basic document tasks should be accessible to everyone. Our core tools will remain free to use without requiring an account.
        </p>


        <div className="mt-12 not-prose text-center">
          <Button size="lg" asChild className="rounded-full px-8">
            <Link href="/tools">Explore Our Tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
