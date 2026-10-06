import { Link } from "wouter";
import type { Tool } from "@workspace/api-client-react";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ToolCard({ tool, featured = false, className = "" }: { tool: Tool; featured?: boolean; className?: string }) {
  const isAvailable = tool.status === "available";
  const clientToolPath = ["pdf-to-excel", "sign-pdf", "ocr-pdf"].includes(tool.slug)
    ? `/${tool.slug}`
    : `/tools/${tool.slug}`;

  // The edit-PDF MVP is intentionally hidden from the main tool catalog until it is
  // ready for public navigation, but its direct route remains available for access by URL.
  if (tool.slug === "edit-pdf") {
    return null;
  }

  return (
    <Link href={isAvailable ? clientToolPath : "#"} className={!isAvailable ? "cursor-not-allowed" : ""}>
      <Card className={`group h-full transition-all duration-300 ${isAvailable ? 'hover:shadow-md hover:-translate-y-1 hover:border-primary/50' : 'opacity-70'} ${featured ? 'border-primary/60 shadow-lg shadow-primary/10 ring-1 ring-primary/20' : ''} ${className}`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary text-secondary-foreground rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon name={tool.icon} className="w-6 h-6" />
            </div>
            {featured && isAvailable && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-medium">Featured</Badge>
            )}
            {tool.popular && isAvailable && !featured && (
              <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-none font-medium">Popular</Badge>
            )}
            {!isAvailable && (
              <Badge variant="outline" className="text-muted-foreground bg-muted">Coming Soon</Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {tool.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
