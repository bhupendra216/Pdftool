import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { useListTools } from "@workspace/api-client-react";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/shared/ToolCard";
import { PageHero } from "@/components/shared/PageHero";
import { tools as toolCatalog } from "../../../api-server/src/lib/content";
import { toolCategories } from "@/data/toolCategories";

export function CategoryPage() {
  const [, params] = useRoute("/categories/:id");
  const category = toolCategories.find((entry) => entry.id === params?.id);
  const { data: tools } = useListTools();
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTools = useMemo(() => {
    if (!category) return [];
    const source = Array.isArray(tools) && tools.length > 0 ? tools : toolCatalog;
    return category.slugs
      .map((slug) => source.find((tool) => tool.slug === slug) ?? toolCatalog.find((tool) => tool.slug === slug))
      .filter((tool): tool is NonNullable<typeof tool> => tool != null)
      .filter((tool) => tool.status === "available")
      .filter((tool) => `${tool.name} ${tool.shortDescription}`.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [category, searchQuery, tools]);

  useSEO({
    title: category ? `${category.name} | PDFKira` : "PDF Tool Category | PDFKira",
    description: category?.description ?? "Browse PDFKira's free online PDF tools.",
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Button asChild className="mt-6"><Link href="/tools">Browse all tools</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-background pb-24">
      <PageHero
        title={category.name}
        description={category.description}
        searchId="category-search"
        searchLabel={`Search ${category.name}`}
        searchPlaceholder="Search tools in this category..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="container mx-auto px-4 md:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-primary">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
        {categoryTools.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Tools in this category are being updated. Browse the full catalog for more options.
          </p>
        )}
      </div>
    </div>
  );
}
