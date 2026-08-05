import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";

export function Privacy() {
  useSEOAdvanced({
    title: "Privacy Policy",
    description: "Read how PDFKira handles file processing, temporary storage, and privacy protections.",
    canonical: `${SITE_URL}/privacy`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      url: `${SITE_URL}/privacy`,
    },
  });
  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-lg dark:prose-invert">
        <h2>Your Privacy is Our Priority</h2>
        <p>At PDFKira, we treat your documents as private information. This Privacy Policy explains how we handle files and related data when you use our services.</p>
        
        <h3>1. File Processing and Storage</h3>
        <p>Most of our tools process files locally in your browser. For tools that require server-side processing, files are uploaded securely via HTTPS. Once processing is complete, all uploaded and generated files are automatically and permanently deleted from our servers within 1 hour.</p>
        
        <h3>2. Data Collection</h3>
        <p>We collect minimal usage data (such as page views and tool usage frequencies) to help us improve the platform. We do not sell your personal information or data to third parties.</p>
        
        <h3>3. Analytics and Cookies</h3>
        <p>We use essential cookies to remember your preferences. We use privacy-friendly analytics that do not track you across the internet or collect personally identifiable information without your consent.</p>
        
        <h3>4. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
      </div>
    </div>
  );
}
