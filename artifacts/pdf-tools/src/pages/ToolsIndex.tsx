import { useMemo, useState } from "react";
import { useListTools } from "@workspace/api-client-react";
import { ToolCard } from "@/components/shared/ToolCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/BrandMark";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";

export function ToolsIndex() {
  const { data: tools, isLoading } = useListTools();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    if (!Array.isArray(tools)) return ["All"];
    const cats = new Set(tools.map((t) => t.category));
    return ["All", ...Array.from(cats)].sort();
  }, [tools]);

  const filteredTools = useMemo(() => {
    if (!Array.isArray(tools)) return [];
    return tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, activeCategory]);

  useSEOAdvanced({
    title: "All PDF Tools",
    description: "Browse PDFKira's free PDF and image tools for merging, splitting, compressing, converting, signing, OCR, and organizing files.",
    canonical: `${SITE_URL}/tools`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "PDFKira Tools",
      url: `${SITE_URL}/tools`,
      description: "A complete collection of browser-based PDF and image tools.",
    },
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-16 pb-12 mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <BrandMark className="mb-6 justify-center" logoClassName="h-16 w-16" wordmarkClassName="text-xl" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">All PDF and image tools in one place</h1>
          <p className="text-xl text-muted-foreground mb-10">
            Explore browser-based tools for common document workflows, built to keep results accurate and easy to review.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input 
              type="text" 
              placeholder="Search for a tool, such as merge, compress, or sign..." 
              className="h-14 pl-12 pr-4 rounded-full text-lg shadow-sm border-2 focus-visible:ring-0 focus-visible:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

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

        {isLoading ? (
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
            <p className="text-xl text-muted-foreground">No tools match your current search and category filters.</p>
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
