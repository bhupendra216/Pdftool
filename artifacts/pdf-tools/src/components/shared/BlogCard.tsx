import { Link } from "wouter";
import { BlogPost } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30">
        <CardContent className="p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="font-medium bg-secondary text-secondary-foreground">
              {post.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </span>
          </div>
          <h3 className="font-bold text-xl md:text-2xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm font-medium text-primary mt-auto">
            Read article
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
