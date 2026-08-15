import { useSEO } from "@/hooks/use-seo";
import { useListBlogPosts } from "@workspace/api-client-react";
import { BlogCard } from "@/components/shared/BlogCard";
import { PageHero } from "@/components/shared/PageHero";
import { BrandMark } from "@/components/brand/BrandMark";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";

export function BlogIndex() {
  useSEO({
    title: "Blog & Guides",
    description: "Expert advice, guides, and news about document management and PDF tools from PDFKira."
  });

  const { data: posts, isLoading } = useListBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <div className="bg-background pb-24">
      <PageHero
        title="Resources & Guides"
        description="Everything you need to know about working with PDFs, document management, and our latest feature updates."
        searchId="blog-search"
        searchLabel="Search articles"
        searchPlaceholder="Search articles..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
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
