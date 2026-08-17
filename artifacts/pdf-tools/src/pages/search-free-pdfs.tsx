import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useSEOAdvanced } from '@/hooks/use-seo';
import { SITE_URL } from '@/lib/site-config';

type Item = {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
  thumbnailUrl: string;
  sourceUrl: string;
  source?: string;
};

export default function SearchFreePdfsPage() {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState('');

  useSEOAdvanced({
    title: 'Search Free PDFs — PDFKira',
    description: 'Discover public-domain and openly-licensed PDFs from the Internet Archive.',
    canonical: `${SITE_URL}/search-free-pdfs`,
  });

  const fetchResults = useCallback(async (search: string, pageNum = 1, append = false) => {
    if (!search) {
      setResults([]);
      setNoResults(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`/api/search-pdfs?q=${encodeURIComponent(search)}&page=${pageNum}`);
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      const items: Item[] = data.results || [];
      setNoResults(items.length === 0);
      setResults((prev) => (append ? [...prev, ...items] : items));
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
    fetchResults(debouncedQ, 1, false);
  }, [debouncedQ, fetchResults]);

  const loadMore = async () => {
    const next = page + 1;
    await fetchResults(debouncedQ, next, true);
    setPage(next);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="max-w-2xl mb-4">
        <div className="flex gap-2">
          <Input placeholder="Search books, authors, titles..." value={q} onChange={(e) => setQ(e.target.value)} className="h-10" />
          <Button size="sm" onClick={() => fetchResults(q, 1, false)} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
        {error && <div className="mt-3 text-sm text-destructive">{error}</div>}
      </div>

      <div>
        {loading && results.length === 0 && (
          <div className="text-center py-12">Loading...</div>
        )}

        {!loading && noResults && (
          <div className="text-center py-12 text-muted-foreground">No results found.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((r) => (
            <a key={r.identifier} href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border p-3 hover:shadow-md bg-card">
              <div className="w-full mb-3" style={{aspectRatio: '2 / 3', backgroundColor: 'transparent'}}>
                <img src={r.thumbnailUrl} alt={r.title} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/placeholder-thumbnail.svg')} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold leading-tight text-foreground" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{r.title}</div>
                {r.source && (
                  <div className="text-[10px] rounded px-2 py-0.5 bg-muted text-muted-foreground ml-2" style={{whiteSpace: 'nowrap'}}>{r.source}</div>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">{r.creator}{r.year ? ` • ${r.year}` : ''}</div>
            </a>
          ))}
        </div>

        {results.length > 0 && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
