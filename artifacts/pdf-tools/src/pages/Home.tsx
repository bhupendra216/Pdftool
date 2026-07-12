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
    title: "Free, Fast, and Secure PDF Tools",
    description: "Merge, split, compress, and edit PDF files with premium, privacy-first tools designed for professionals."
  });

  const { data: tools, isLoading: loadingTools } = useListTools();
  const { data: posts, isLoading: loadingPosts } = useListBlogPosts();
  const { data: faqs, isLoading: loadingFaqs } = useListFaqs();

  console.log("TOOLS:", tools);
console.log("POSTS:", posts);
console.log("FAQS:", faqs);

console.log("tools:", tools);
console.log("tools isArray:", Array.isArray(tools));

console.log("posts:", posts);
console.log("posts isArray:", Array.isArray(posts));

console.log("faqs:", faqs);
console.log("faqs isArray:", Array.isArray(faqs));

 // const popularTools = tools?.filter(t => t.popular).slice(0, 6) || [];

 //temp solution
 console.log("tools =", tools);

const popularTools = Array.isArray(tools)
  ? tools.filter((t) => t.popular).slice(0, 6)
  : [];
 
 // const latestPosts = posts?.slice(0, 3) || [];
const latestPosts = Array.isArray(posts)
  ? posts.slice(0, 3)
  : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-36 md:pb-48">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 md:px-6 text-center z-10 max-w-4xl">
          <Badge className="mb-6 py-1.5 px-4 bg-primary/10 text-primary border-none text-sm font-medium hover:bg-primary/20 transition-colors">
            100% Free & Privacy First
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-[1.1]">
            Every PDF tool you need.<br />
            <span className="text-primary">None of the clutter.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A premium suite of tools to merge, compress, split, and edit PDFs. 
            Fast, secure, and designed for people who care about craft.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1">
              <Link href="/tools">Explore All Tools</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-14 text-lg bg-background">
              <Link href="/tools/merge-pdf">Merge PDF Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Most Popular Tools</h2>
              <p className="text-muted-foreground text-lg">The tools our community uses most.</p>
            </div>
            <Button variant="ghost" asChild className="group text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/tools">
                View all {tools?.length || 0} tools
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why PDF Tools?</h2>
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
