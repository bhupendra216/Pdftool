import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Mail, Clock } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";

export function Contact() {
  useSEOAdvanced({
    title: "Contact PDFKira",
    description: "Contact PDFKira for support, product feedback, partnerships, or general questions.",
    canonical: `${SITE_URL}/contact`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact PDFKira",
      url: `${SITE_URL}/contact`,
    },
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <BrandMark className="mb-6 justify-center" logoClassName="h-16 w-16" wordmarkClassName="text-xl" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Contact PDFKira</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Send support questions, product feedback, or business inquiries to the team behind PDFKira.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Email</p>
                <p className="mt-1 text-lg font-semibold text-foreground">pdfkiraa@gmail.com</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Support</p>
                <p className="mt-1 text-lg font-semibold text-foreground">pdfkiraa@gmail.com</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <div className="rounded-2xl bg-secondary p-3 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Business Hours</p>
                <p className="mt-1 text-lg font-semibold text-foreground">Monday – Friday</p>
                <p className="text-muted-foreground">9:00 AM – 6:00 PM (UTC)</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Contact note</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Reach the right team</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Use the email address above for general questions, tool feedback, or help with uploads and document processing.
            </p>
            <div className="mt-8 rounded-2xl bg-secondary/40 p-5">
              <p className="text-sm font-medium text-foreground">Quick contact</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Email: <a className="text-primary hover:underline" href="mailto:pdfkiraa@gmail.com">pdfkiraa@gmail.com</a>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Support: <a className="text-primary hover:underline" href="mailto:pdfkiraa@gmail.com">pdfkiraa@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
