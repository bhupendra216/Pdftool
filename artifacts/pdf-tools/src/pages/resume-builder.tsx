import { useSEOAdvanced } from "@/hooks/use-seo";
import { ResumeBuilder } from "@/labs/resume-builder/ResumeBuilder";
import "@/labs/resume-builder/resume-builder.css";
import ToolSeoSection from "@/components/Content/ToolSeoSection";
import { TOOL_SEO_CONTENT } from "@/data/toolSeoContent";
import { resumeBuilderSeo } from "../../../api-server/src/lib/content";
import { SITE_URL } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ResumeBuilderPage() {
  const content = TOOL_SEO_CONTENT["resume-builder"];

  useSEOAdvanced({
    title: resumeBuilderSeo.title,
    description: resumeBuilderSeo.description,
    canonical: `${SITE_URL}/tools/resume-builder`,
    ogImageAlt: resumeBuilderSeo.ogImageAlt,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          name: "Resume & CV Builder",
          description: resumeBuilderSeo.description,
          operatingSystem: "Web",
          applicationCategory: "Utility",
          url: `${SITE_URL}/tools/resume-builder`,
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
            { "@type": "ListItem", position: 3, name: "Resume & CV Builder", item: `${SITE_URL}/tools/resume-builder` },
          ],
        },
      ],
    },
  });

  return (
    <>
      <ResumeBuilder />
      <ToolSeoSection content={content} />
      {content.featuredGuide && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 mb-6 border-none">
              Featured Guide
            </Badge>
            {content.featuredGuide.description !== content.featuredGuide.title && (
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
                {content.featuredGuide.description}
              </p>
            )}
            <Button variant="secondary" size="lg" asChild className="rounded-full px-8 text-primary">
              <Link href={`/blog/${content.featuredGuide.slug}`}>{content.featuredGuide.title}</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
