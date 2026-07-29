import { useSEO } from "@/hooks/use-seo";
import { useListBlogPosts } from "@workspace/api-client-react";
import { BlogCard } from "@/components/shared/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandMark } from "@/components/brand/BrandMark";

export function BlogIndex() {
  useSEO({
    title: "Blog & Guides",
    description: "Expert advice, guides, and news about document management and PDF tools from PDFKira."
  });

  const { data: posts, isLoading } = useListBlogPosts();

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <BrandMark className="mb-6 justify-center" logoClassName="h-16 w-16" wordmarkClassName="text-xl" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Resources & Guides</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about working with PDFs, document management, and our latest feature updates.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BrandMark className="mb-6 justify-center" logoClassName="h-9 w-9" wordmarkClassName="text-lg" />
            <p className="text-xl text-muted-foreground">No blog posts published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
