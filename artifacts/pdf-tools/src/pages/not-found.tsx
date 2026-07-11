import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useSEO({ title: "404 - Page Not Found" });
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background min-h-[70vh]">
      <h1 className="text-8xl font-black text-primary mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page not found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg leading-relaxed">
        The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
