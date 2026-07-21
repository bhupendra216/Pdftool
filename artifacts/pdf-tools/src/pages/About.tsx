import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function About() {
  useSEO({
    title: "About Us",
    description: "Learn why we built PDF Tools and our commitment to privacy, speed, and craftsmanship."
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Built for Craft.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We were tired of ad-ridden, slow, and privacy-invasive PDF tools. So we built the one we wanted to use.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-lg dark:prose-invert">
        <h2>Our Mission</h2>
        <p>
          Document management shouldn't be a chore, and it definitely shouldn't mean compromising your privacy or clicking through popups. 
          PDF Tools was created with a simple mission: provide the absolute best PDF utility experience on the web.
        </p>

        <h2>Why We're Different</h2>
        <ul>
          <li><strong>Privacy First:</strong> Your documents are your business. When you upload a file to our servers for processing, it is automatically and permanently deleted immediately after your task is complete. No lingering data, no training AI models.</li>
          <li><strong>Zero Clutter:</strong> We believe in calm, focused interfaces. You won't find banner ads, auto-playing videos, or aggressive upsells here.</li>
          <li><strong>Modern Engineering:</strong> We leverage the latest web technologies to process as much as possible directly in your browser, saving you time and bandwidth.</li>
        </ul>

        <h2>Free for Everyone</h2>
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
