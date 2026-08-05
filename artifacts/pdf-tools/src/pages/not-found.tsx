import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useSEOAdvanced({
    title: "404 - Page Not Found",
    description: "The page you requested could not be found on PDFKira.",
    canonical: `${SITE_URL}/404`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "404 - Page Not Found",
      url: `${SITE_URL}/404`,
    },
  });
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background min-h-[70vh]">
      <h1 className="text-8xl font-black text-primary mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page not found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg leading-relaxed">
        The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
