import { Link } from "wouter";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 transition-opacity hover:opacity-80">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">PDF Tools</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium, fast, and secure PDF tools for modern professionals. 
              No clutter, no ads, just tools that work.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Tools</Link></li>
              <li><Link href="/tools/merge-pdf" className="text-sm text-muted-foreground hover:text-primary transition-colors">Merge PDF</Link></li>
              <li><Link href="/tools/split-pdf" className="text-sm text-muted-foreground hover:text-primary transition-colors">Split PDF</Link></li>
              <li><Link href="/tools/compress-pdf" className="text-sm text-muted-foreground hover:text-primary transition-colors">Compress PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/ai-jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PDF Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
