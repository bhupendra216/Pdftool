import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { useListTools, useListBlogPosts, useListFaqs } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/shared/ToolCard";
import { BlogCard } from "@/components/shared/BlogCard";
import { FaqSection } from "@/components/shared/FaqSection";
import { ArrowRight, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  useSEO({
    title: "PDFKira – Free Online PDF Tools",
    description: "Use PDFKira to merge, split, compress, convert, and organize PDF files online for free. Choose a tool and finish your document task in minutes."
  });

  const { data: tools, isLoading: loadingTools } = useListTools();
  const { data: posts } = useListBlogPosts();
  const { data: faqs, isLoading: loadingFaqs } = useListFaqs();

  const featuredToolSlugs = [
    "pdf-to-markdown",
    "add-page-numbers",
    "image-converter",
    "qr-code-generator",
  ];

  const featuredTools = Array.isArray(tools)
    ? featuredToolSlugs
        .map((slug) => tools.find((tool) => tool.slug === slug))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
    : [];

  const popularTools = Array.isArray(tools)
    ? tools.filter((tool) => tool.slug !== "edit-pdf" && tool.popular).slice(0, 6)
    : [];

  const latestPosts = Array.isArray(posts)
    ? posts.slice(0, 3)
    : [];

  return (
    <div className="flex flex-col">
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto mb-4 py-1.5 px-4 bg-primary/10 text-primary border-none text-sm font-medium hover:bg-primary/20 transition-colors">
              100% Free & Privacy First
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Every PDF tool you need.<br />
              <span className="text-primary">None of the clutter.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-7">
              Fast, free PDF tools for merging, splitting, compressing, and converting—no signup required.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1">
                <Link href="/tools">Explore All Tools</Link>
              </Button>
              <Button size="default" variant="outline" asChild className="rounded-full px-6 h-12 text-base text-muted-foreground border-muted-foreground/40 hover:border-muted-foreground hover:text-foreground">
                <Link href="/tools/merge-pdf">Merge PDF Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Tools</h2>
              <p className="text-muted-foreground text-base">The tools we prioritize most for clear, useful document workflows.</p>
            </div>
            <Button variant="ghost" asChild className="group text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/tools">
                View all {tools?.length || 0} tools
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {loadingTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredTools.map((tool, index) => (
                <ToolCard key={tool.slug} tool={tool} featured={index === 0} className={index === 0 ? 'xl:col-span-1' : ''} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 md:py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Most Popular Tools</h2>
              <p className="text-muted-foreground text-base">The tools our community uses most.</p>
            </div>
          </div>

          {loadingTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features/Why Us */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why PDFKira?</h2>
            <p className="text-xl text-muted-foreground">Built to be the last PDF utility you'll ever need to bookmark.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">Most operations happen right in your browser. When servers are needed, our highly optimized backend processes files in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">Your files are your business. Uploaded files are processed securely over HTTPS and automatically deleted from our servers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Beautifully Crafted</h3>
              <p className="text-muted-foreground leading-relaxed">No ads, no popups, no confusing interfaces. Just a clean, premium experience that respects your time and attention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser */}
      {latestPosts.length > 0 && (
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
                <p className="text-muted-foreground text-lg">Tips and tricks for document management.</p>
              </div>
              <Button variant="ghost" asChild className="group text-primary hover:bg-primary/10">
                <Link href="/blog">
                  Read the blog
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {(!loadingFaqs && faqs && faqs.length > 0) && (
        <FaqSection faqs={faqs} />
      )}
    </div>
  );
}
