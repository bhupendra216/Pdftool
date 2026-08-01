import { useSEO } from "@/hooks/use-seo";

export function Terms() {
  useSEO({ title: "Terms of Service" });
  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card border-b border-border pt-20 pb-16 mb-16">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-lg dark:prose-invert">
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using PDFKira, you agree to the terms below and to any additional guidelines posted for specific tools or services.</p>

        <h3>1. Use of Service</h3>
        <p>PDFKira provides various tools to process PDF documents. You agree to use these tools only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>

        <h3>2. User Content</h3>
        <p>You retain all rights to any documents you process using our tools. We do not claim ownership over any of your content. You represent and warrant that you have the necessary rights to process any documents you upload.</p>

        <h3>3. Service Availability</h3>
        <p>We strive to ensure the service is available at all times, but we do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time without notice.</p>

        <h3>4. Disclaimer of Warranties</h3>
        <p>The service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the processed files will meet your specific requirements or that the service will be error-free.</p>
      </div>
    </div>
  );
}
