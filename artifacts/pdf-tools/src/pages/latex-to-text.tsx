import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';
import { convertLatexToPlainText, stripOuterLatexDelimiters } from '@/lib/latexToPlainText';

const SAMPLE = String.raw`\frac{-b \pm \sqrt{b^2-4ac}}{2a}`;

type CopyState = 'idle' | 'success' | 'error';

function normalizeLatex(input: string): string {
  return stripOuterLatexDelimiters(input);
}

export default function LatexToTextPage() {
  const [latexInput, setLatexInput] = useState(SAMPLE);
  const [copyStatus, setCopyStatus] = useState<CopyState>('idle');

  const cleanedLatex = useMemo(() => normalizeLatex(latexInput), [latexInput]);
  const plainText = useMemo(() => convertLatexToPlainText(cleanedLatex), [cleanedLatex]);
  const previewHtml = useMemo(() => {
    try {
      return katex.renderToString(cleanedLatex || 'x', { throwOnError: false, displayMode: false });
    } catch {
      return '';
    }
  }, [cleanedLatex]);

  useSEOAdvanced({
    title: 'LaTeX to plain text | PDFKira',
    description: 'Paste LaTeX and convert it to readable plain Unicode text in real time.',
    canonical: `${SITE_URL}/tools/latex-to-text`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDFKira LaTeX to plain text tool',
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      description: 'Paste LaTeX and convert it to readable plain Unicode text in real time.',
    },
  });

  const handleCopy = async () => {
    if (!cleanedLatex) return;

    const plainTextString = plainText;
    console.log('plainTextString before copy:', plainTextString);

    try {
      await navigator.clipboard.writeText(plainTextString);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 1500);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 text-center">
        <Badge className="mb-4 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          LaTeX to plain text
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">Paste LaTeX and get plain text</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-card/90 shadow-xl">
          <CardContent className="space-y-5 p-5 md:p-7">
            <label htmlFor="latex-input" className="text-sm font-medium text-foreground">LaTeX input</label>
            <Textarea
              id="latex-input"
              value={latexInput}
              onChange={(event) => setLatexInput(event.target.value)}
              placeholder={String.raw`\frac{-b \pm \sqrt{b^2-4ac}}{2a}`}
              className="min-h-[220px] resize-y rounded-2xl border-border/70 bg-background/80 font-mono text-sm leading-6"
            />

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="mb-3 text-sm font-medium text-foreground">Plain text output</div>
              <Textarea
                readOnly
                value={plainText || 'Type or paste LaTeX to begin.'}
                className="min-h-[120px] resize-y rounded-xl border-border/70 bg-background/80 font-medium leading-6"
              />
              <Button onClick={handleCopy} className="mt-3 h-11 w-full gap-2 rounded-xl text-base font-medium" disabled={!cleanedLatex}>
                {copyStatus === 'success' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copyStatus === 'success' ? 'Copied' : copyStatus === 'error' ? 'Copy failed' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-xl">
          <CardContent className="p-5 md:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live preview</p>
                <h2 className="text-xl font-semibold text-foreground">KaTeX rendering</h2>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1">Preview</Badge>
            </div>

            <div className="flex min-h-[220px] items-center justify-center overflow-auto rounded-3xl border border-border/70 bg-gradient-to-br from-background to-muted/30 p-6">
              {cleanedLatex && previewHtml ? (
                <div className="katex-render text-center" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <div className="text-center text-sm text-muted-foreground">Enter LaTeX to preview it here.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
