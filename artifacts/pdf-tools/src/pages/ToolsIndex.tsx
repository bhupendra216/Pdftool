import { useSEO } from "@/hooks/use-seo";
import { useListTools } from "@workspace/api-client-react";
import { ToolCard } from "@/components/shared/ToolCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/shared/PageHero";
import { BrandMark } from "@/components/brand/BrandMark";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tools as toolCatalog } from "../../../api-server/src/lib/content";

export function ToolsIndex() {
  useSEO({
    title: "All PDF Tools",
    description: "Browse free online PDF tools to merge, split, compress, convert, and organize documents. Pick a secure browser-based workflow and get started with PDFKira."
  });

  const { data: tools, isLoading } = useListTools();
  const catalogTools = Array.isArray(tools) && tools.length > 0 ? tools : toolCatalog;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    if (!Array.isArray(catalogTools)) return ["All"];
    const cats = new Set(catalogTools.map((t) => t.category));
    return ["All", ...Array.from(cats)].sort();
  }, [catalogTools]);

  const filteredTools = useMemo(() => {
    if (!Array.isArray(catalogTools)) return [];
    return catalogTools.filter((tool) => {
      if (tool.slug === "edit-pdf") return false;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [catalogTools, searchQuery, activeCategory]);

  return (
    <div className="bg-background pb-24">
      <PageHero
        title="All PDF and image tools in one place"
        description="A complete suite to help you manage your documents efficiently and securely."
        searchId="tools-search"
        searchLabel="Search PDF tools"
        searchPlaceholder="Search PDF tools..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map(category => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "secondary"}
              className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {isLoading && Array.isArray(tools) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border mt-8">
            <BrandMark className="mb-6 justify-center" logoClassName="h-9 w-9" wordmarkClassName="text-lg" />
            <p className="text-xl text-muted-foreground">No tools found matching your search.</p>
            <Button 
              variant="link" 
              className="mt-4 text-primary"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
