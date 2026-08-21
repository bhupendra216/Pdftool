import { useParams, Link } from "wouter";
import { useGetBlogPost, useGetTool } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/use-seo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPost(slug);
  
  // Conditionally fetch related tool if it exists
  const { data: relatedTool } = useGetTool(post?.relatedToolSlug || "", {
    query: { enabled: !!post?.relatedToolSlug, queryKey: ["getTool", post?.relatedToolSlug] } as any
  });

  useSEO({
    title: post?.title || "Loading...",
    description: post?.excerpt || "Blog post"
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-3xl space-y-8">
        <BrandMark className="justify-center" logoClassName="h-10" wordmarkClassName="text-lg" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-96 w-full mt-12" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Post not found</h1>
        <p className="text-xl text-muted-foreground mb-8">We couldn't find the article you're looking for.</p>
        <Button asChild><Link href="/blog">Back to Blog</Link></Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border pt-16 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {post.category}
            </Badge>
            <span className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5 opacity-70" />
              {post.readingMinutes} min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl mt-16">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Tool CTA */}
        {relatedTool && (
          <div className="mt-16 p-8 md:p-10 bg-primary/5 border border-primary/20 rounded-3xl text-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm overflow-hidden">
              <img src="/favicon.png" alt="PDFKira" className="w-10 h-10 object-cover rounded-full" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Try it yourself</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Put this guide into practice using our free, secure <strong>{relatedTool.name}</strong> tool.
            </p>
            <Button size="lg" asChild className="rounded-full px-8 shadow-md">
              <Link href={`/tools/${relatedTool.slug}`}>
                Use {relatedTool.name} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
