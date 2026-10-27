import { useSEO } from "@/hooks/use-seo";
import { ResumeBuilder } from "@/labs/resume-builder/ResumeBuilder";
import "@/labs/resume-builder/resume-builder.css";
import ToolSeoSection from "@/components/Content/ToolSeoSection";
import { TOOL_SEO_CONTENT } from "@/data/toolSeoContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ResumeBuilderPage() {
  const content = TOOL_SEO_CONTENT["resume-builder"];

  useSEO({
    title: "Resume & CV Builder",
    description: "Create and format a resume in your browser. Your resume stays on your device; print or save it as a PDF.",
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
