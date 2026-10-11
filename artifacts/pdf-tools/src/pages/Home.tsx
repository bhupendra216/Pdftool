import { useMemo, useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { useListTools, useListBlogPosts, useListFaqs } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/shared/ToolCard";
import { BlogCard } from "@/components/shared/BlogCard";
import { FaqSection } from "@/components/shared/FaqSection";
import { ArrowRight, Search, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { tools as toolCatalog } from "../../../api-server/src/lib/content";

const categoryGroups = [
  { id: "pdf-editing", name: "Edit PDF", icon: "✏️", slugs: ["edit-pdf", "delete-pages", "organize-pdf", "rotate-pdf"] },
  { id: "pdf-conversion", name: "Convert PDF", icon: "🔄", slugs: ["pdf-to-word", "pdf-to-excel", "pdf-to-markdown", "word-to-pdf"] },
  { id: "pdf-merging", name: "Merge & Split", icon: "📄", slugs: ["merge-pdf", "split-pdf", "extract-pages"] },
  { id: "pdf-security", name: "Security", icon: "🔒", slugs: ["protect-pdf", "unlock-pdf", "sign-pdf", "watermark-pdf"] },
  { id: "image-tools", name: "Image Tools", icon: "🖼️", slugs: ["jpg-to-pdf", "pdf-to-jpg", "image-converter", "image-upscale"] },
  { id: "optimization", name: "Optimize & OCR", icon: "⚡", slugs: ["compress-pdf", "ocr-pdf", "ocr-image-to-text", "pdf-to-text", "add-page-numbers"] },
];

const quickActions = [
  ["Merge PDF", "/tools/merge-pdf", "📄"],
  ["Compress", "/tools/compress-pdf", "🗜️"],
  ["Sign PDF", "/tools/sign-pdf", "✍️"],
  ["OCR PDF", "/tools/ocr-pdf", "🔎"],
];

export function Home() {
  useSEO({
    title: "PDFKira – Free Online PDF Tools",
    description: "Merge, split, compress, convert, sign, and edit PDFs online for free. No signup required and privacy-first processing.",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const { data: tools, isLoading: loadingTools } = useListTools();
  const { data: posts } = useListBlogPosts();
  const { data: faqs, isLoading: loadingFaqs } = useListFaqs();

  const catalogTools = Array.isArray(tools) && tools.length > 0 ? tools : toolCatalog;
  const visibleTools = catalogTools.filter((tool) => tool.status === "available");
  const toolBySlug = useMemo(() => new Map(catalogTools.map((tool) => [tool.slug, tool])), [catalogTools]);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return visibleTools.filter((tool) =>
      `${tool.name} ${tool.shortDescription} ${tool.category}`.toLowerCase().includes(query),
    ).slice(0, 6);
  }, [searchQuery, visibleTools]);

  const trendingTools = ["sign-pdf", "ocr-pdf", "edit-pdf", "merge-pdf"]
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
  const latestPosts = Array.isArray(posts) ? posts.slice(0, 3) : [];

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mx-auto mb-5 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
              100% free · privacy first
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
              Free Online PDF Tools
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-xl">
              Merge, split, compress &amp; convert PDFs — no signup, 100% private.
            </p>

            <div className="relative mx-auto mt-8 max-w-2xl text-left">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${visibleTools.length} PDF tools...`}
                aria-label="Search PDF tools"
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-5 text-base shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
                  {searchResults.length > 0 ? searchResults.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block rounded-xl px-4 py-3 hover:bg-secondary">
                      <span className="font-semibold text-foreground">{tool.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{tool.shortDescription}</span>
                    </Link>
                  )) : <p className="px-4 py-3 text-sm text-muted-foreground">No matching tools found.</p>}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {quickActions.map(([label, href, icon]) => (
                <Button key={href} variant="outline" asChild className="rounded-full">
                  <Link href={href}><span aria-hidden="true">{icon}</span><span className="ml-2">{label}</span></Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Trending tools</h2>
              <p className="mt-2 text-muted-foreground">Popular ways to finish a document task quickly.</p>
            </div>
            <Button variant="ghost" asChild className="hidden text-primary sm:inline-flex">
              <Link href="/tools">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          {loadingTools && !tools ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-52 rounded-2xl" />)}</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold md:text-4xl">Browse by category</h2>
            <p className="mt-2 text-muted-foreground">Find the right tool without scanning the entire catalog.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((category) => {
              const categoryTools = category.slugs.map((slug) => toolBySlug.get(slug)).filter(Boolean);
              return (
                <Link key={category.id} href={`/categories/${category.id}`} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden="true">{category.icon}</span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold group-hover:text-primary">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{categoryTools.length} tools to help with this workflow.</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30 py-12 md:py-16">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2 md:px-6">
          {[
            { icon: "💼", title: "For work", text: "Prepare business documents in fewer steps.", links: [["Merge reports", "/tools/merge-pdf"], ["Sign contracts", "/tools/sign-pdf"], ["Convert to Excel", "/tools/pdf-to-excel"]] },
            { icon: "🎓", title: "For students", text: "Organize assignments, notes, and scanned textbooks.", links: [["Combine assignments", "/tools/merge-pdf"], ["OCR textbooks", "/tools/ocr-pdf"], ["Compress notes", "/tools/compress-pdf"]] },
          ].map((useCase) => (
            <div key={useCase.title} className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-bold">{useCase.icon} {useCase.title}</h2>
              <p className="mt-2 text-muted-foreground">{useCase.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {useCase.links.map(([label, href]) => <Button key={href} variant="outline" size="sm" asChild><Link href={href}>{label} <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Why PDFKira?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Straightforward document tools built around speed, privacy, and a clean experience.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              [Zap, "Lightning fast", "Most everyday operations finish in your browser without a queue."],
              [ShieldCheck, "Privacy first", "Files are processed securely and deleted from our servers shortly afterward."],
              [HeartHandshake, "Free to use", "No signup, no watermarks, and no hidden fee for the core tools."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-8 w-8" /></div>
                <h3 className="text-xl font-bold">{title as string}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div><h2 className="text-3xl font-bold md:text-4xl">Latest insights</h2><p className="mt-2 text-muted-foreground">Practical tips for working with documents.</p></div>
              <Button variant="ghost" asChild className="text-primary"><Link href="/blog">Read the blog <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div className="grid gap-8 md:grid-cols-3">{latestPosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
          </div>
        </section>
      )}

      {!loadingFaqs && faqs && faqs.length > 0 && <FaqSection faqs={faqs} />}
    </div>
  );
}
