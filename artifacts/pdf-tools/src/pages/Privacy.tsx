import { useSEO } from "@/hooks/use-seo";

export function Privacy() {
  useSEO({
    title: "Privacy Policy",
    description: "How PDFKira handles uploaded files, analytics, cookies, and personal information.",
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
        <p>Many tools process files locally in your browser. For tools that require server-side processing, files are transmitted over HTTPS. Uploaded and generated temporary files are automatically deleted from our servers within one hour after processing.</p>
        
        <h3>2. Data Collection</h3>
        <p>We use Google Analytics to understand site usage and improve the platform. Google Analytics may process technical usage information such as page views, device/browser data, and approximate location. We do not sell personal information.</p>
        
        <h3>3. Analytics and Cookies</h3>
        <p>Google Analytics may use cookies or similar technologies subject to Google's privacy policies. PDFKira also stores limited preferences in your browser, including local storage or essential interface cookies. You can manage or clear cookies and browser storage in your browser settings.</p>
        
        <h3>4. Contact Us</h3>
        <p>If you have questions about this Privacy Policy, email <a href="mailto:contact@pdfkira.com">contact@pdfkira.com</a>.</p>
      </div>
    </div>
  );
}
