import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/BrandMark";

const popularLinks = [
  { label: "Merge PDF", href: "/tools/merge-pdf" },
  { label: "Compress PDF", href: "/tools/compress-pdf" },
  { label: "Split PDF", href: "/tools/split-pdf" },
  { label: "Image Converter", href: "/tools/image-converter" },
];

export default function NotFound() {
  useSEO({
    title: "Page Not Found | PDFKira",
    description: "The page you were looking for could not be found on PDFKira.",
  });

  return (
    <div className="min-h-[72vh] bg-background px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/80 p-8 shadow-sm md:p-12">
        <div className="mb-8 flex justify-center">
          <BrandMark className="justify-center" logoClassName="h-10" wordmarkClassName="text-lg" />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">404 Error</p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-foreground sm:text-6xl">Page not found</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The page you were looking for doesn’t exist, may have moved, or may not be available right now.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
              <Link href="/tools">Browse all tools</Link>
            </Button>
          </div>

          <div className="mt-10">
            <p className="text-sm font-medium text-muted-foreground">Popular tools</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {popularLinks.map((tool) => (
                <Link key={tool.href} href={tool.href} className="rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
