import { Link } from "wouter";
import type { Tool } from "@workspace/api-client-react";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ToolCard({ tool }: { tool: Tool }) {
  const isAvailable = tool.status === "available";

  return (
    <Link href={isAvailable ? `/tools/${tool.slug}` : "#"} className={!isAvailable ? "cursor-not-allowed" : ""}>
      <Card className={`group h-full transition-all duration-300 ${isAvailable ? 'hover:shadow-md hover:-translate-y-1 hover:border-primary/50' : 'opacity-70'}`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary text-secondary-foreground rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon name={tool.icon} className="w-6 h-6" />
            </div>
            {tool.popular && isAvailable && (
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
