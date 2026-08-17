import { useState } from 'react';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';

export default function DownloadPdfPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // SEO Metadata matching your other tools
  const title = 'Download PDF from URL Online Free — PDFKira';
  const description = 'Easily download any PDF directly from a web link. Fast, private, and secure. No sign-up required.';

  useSEOAdvanced({
    title,
    description,
    canonical: `${SITE_URL}/download-pdf`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira Download PDF from URL Tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description,
    },
  });

  const handleDownload = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please paste a valid PDF URL.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = `/api/download-pdf`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || contentType.includes('application/json')) {
        let errorMsg = 'Failed to fetch PDF.';
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();

      // try to parse filename from content-disposition
      const cd = response.headers.get('content-disposition') || '';
      let filename = 'download.pdf';
      const m = cd.match(/filename\*=?(?:UTF-8'')?"?([^";]+)"?/i);
      if (m && m[1]) filename = decodeURIComponent(m[1]);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Download PDF from URL</h1>
        <p className="text-muted-foreground text-lg">
          Easily download any PDF directly from a web link. Fast, private, and secure.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-3">
          <label htmlFor="pdf-url" className="text-sm font-medium text-foreground/80">
            Paste PDF URL
          </label>
          <Input
            id="pdf-url"
            type="url"
            placeholder="https://example.com/document.pdf"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be a direct link to a .pdf file (e.g. ends in .pdf).
          </p>
        </div>

        <Button
          onClick={handleDownload}
          disabled={loading}
          className="w-full h-11 text-base font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>

        {error && (
          <div className="w-full p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Optional: Tips section for users */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50 text-sm text-muted-foreground space-y-2 w-full">
          <p className="font-medium text-foreground">💡 How to get a direct PDF link:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Right-click on a "Download" button and select <strong>"Copy Link Address"</strong>.</li>
            <li>Paste the link here. If it doesn't work, the website is blocking direct downloads.</li>
            <li>Works best with links ending in <code className="bg-background px-1 py-0.5 rounded text-xs">.pdf</code> or academic links like <code className="bg-background px-1 py-0.5 rounded text-xs">arxiv.org/abs/...</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}