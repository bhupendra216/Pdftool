import { Router } from 'express';

const router = Router();

// Simple in-memory cache: key -> { expires: number, data }
const cache = new Map<string, { expires: number; data: any }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Helper: normalize string for deduplication
const normalizeKey = (title: string, author = '') => {
  const strip = (s = '') => String(s || '')
    .toLowerCase()
    .split(/[:;\-\|]/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  return `${strip(title)}::${strip(author)}`;
};

const normalizeTitleForMatch = (s: string) => 
  String(s || '').toLowerCase().replace(/\s+/g, ' ').split(/[:;\-\|]/)[0].trim();

const pickBetter = (a: any, b: any) => {
  const ad = Number(a.downloadCount || 0);
  const bd = Number(b.downloadCount || 0);
  return ad >= bd ? a : b;
};

// Helper: fetch with retries, per-attempt timeout and simple backoff
const fetchWithRetries = async (url: string, opts: any = {}, attempts = 3, timeoutMs = 8000) => {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const mergedOpts = Object.assign(
        {}, 
        opts, 
        { 
          signal: AbortSignal.timeout(timeoutMs), 
          headers: Object.assign(
            { 
              'User-Agent': 'PDFKira/1.0 (+https://pdfkira.example)', 
              'Accept': 'application/json' 
            }, 
            opts && opts.headers
          ) 
        }
      );
      const r = await fetch(url, mergedOpts);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r;
    } catch (e: any) {
      lastErr = e;
      const delay = 300 * Math.pow(2, i); // 300ms, 600ms, 1200ms
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastErr;
};

router.get('/search-pdfs', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = Number(req.query.page || 1) || 1;
  
  if (!q) {
    res.status(400).json({ error: 'Missing query parameter q' });
    return;
  }

  // Cache key based on query
  const cacheKey = `search-pdfs:${q.toLowerCase().trim()}:${page}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    console.log(`✅ Cache hit for: ${q}`);
    res.json(cached.data);
    return;
  }

  try {
    // === INTERNET ARCHIVE FETCH ===
    const fetchArchive = async () => {
      try {
        const iaParams = new URLSearchParams();
        iaParams.set('q', q);
        iaParams.append('fl[]', 'identifier');
        iaParams.append('fl[]', 'title');
        iaParams.append('fl[]', 'creator');
        iaParams.append('fl[]', 'downloads');
        iaParams.append('fl[]', 'date');
        iaParams.append('fl[]', 'format');
        iaParams.set('rows', '24');
        iaParams.set('output', 'json');

        const url = `https://archive.org/advancedsearch.php?${iaParams.toString()}`;
        const resp = await fetchWithRetries(url, { method: 'GET' }, 3, 8000);
        const body = (await resp.json()) as any;
        const response = body.response || {};
        const docs = Array.isArray(response.docs) ? response.docs : [];

        const results: any[] = [];

        for (const d of docs) {
          // Check if PDF exists in formats
          const formats = d.format || [];
          const hasPdf = Array.isArray(formats) 
            ? formats.some((f: any) => String(f).toLowerCase().includes('pdf'))
            : String(formats).toLowerCase().includes('pdf');
          
          const downloads = Number(d.downloads || 0);
          const title = d.title || '';
          const creator = Array.isArray(d.creator) ? d.creator.join(', ') : d.creator || '';
          
          // Only include if the title reasonably matches the query.
          const tNorm = normalizeTitleForMatch(title);
          const qNorm = normalizeTitleForMatch(q);
          // broaden matching: direct contains, identifier contains, or token overlap
          const qTokens = qNorm.split(' ').filter(Boolean);
          const tTokens = (tNorm || '').split(' ').filter(Boolean);
          const tokenOverlap = qTokens.filter((tok) => tTokens.includes(tok)).length;
          const identifier = String(d.identifier || '').toLowerCase();
          const titleMatch = !!(
            (tNorm && qNorm && (
              tNorm.includes(qNorm) || qNorm.includes(tNorm)
            )) ||
            // token overlap: require at least 2 tokens overlap, or 1 if the query is short
            (tokenOverlap >= Math.max(1, Math.min(2, qTokens.length))) ||
            // identifier-based match (helps for dashed identifiers like rich-dad-poor-dad)
            (identifier && identifier.includes(qNorm.replace(/\s+/g, '-')))
          );

          if (!titleMatch) continue;

          // Exclude obvious media-only items unless we see a PDF available.
          const mediaPatterns = ['mp3', 'mpeg', 'audio', 'video', 'mp4', 'webm', 'm4v', 'ogg', 'h264', 'mkv'];
          const formatsStr = Array.isArray(formats) ? formats.join(' ').toLowerCase() : String(formats).toLowerCase();
          const looksMediaOnly = mediaPatterns.some((p) => formatsStr.includes(p));
          if (looksMediaOnly && !hasPdf) continue;

          results.push({
            identifier: d.identifier,
            title: title || d.identifier,
            creator,
            year: d.date || '',
            thumbnailUrl: `https://archive.org/services/img/${d.identifier}`,
            sourceUrl: `https://archive.org/details/${d.identifier}`,
            source: 'Internet Archive',
            downloadCount: downloads,
            formats: formats,
            hasPdf: hasPdf,
          });
        }

        // Deduplicate within IA (keep highest downloads)
        const dedupMap = new Map<string, any>();
        for (const it of results) {
          const key = normalizeKey(it.title, it.creator);
          if (!dedupMap.has(key)) {
            dedupMap.set(key, it);
          } else {
            dedupMap.set(key, pickBetter(dedupMap.get(key), it));
          }
        }

        console.log(`📚 IA found ${dedupMap.size} results for "${q}"`);
        return { results: Array.from(dedupMap.values()) };
        
      } catch (e) {
        console.error('❌ Internet Archive fetch error:', e);
        throw e;
      }
    };

    // === GUTENDEX (PROJECT GUTENBERG) FETCH ===
    const fetchGuten = async () => {
      try {
        const gutUrl = `https://gutendex.com/books?search=${encodeURIComponent(q)}`;
        // Give Gutendex a bit more time; avoid very short timeouts causing spurious failures
        const gResp = await fetchWithRetries(gutUrl, { method: 'GET' }, 3, 12000);
        const gBody = (await gResp.json()) as any;
        const items = Array.isArray(gBody.results) ? gBody.results : [];
        
        const results: any[] = [];

        for (const it of items) {
          const formats = it.formats || {};
          
          // Check if PDF format exists
          const hasPdf = Object.keys(formats).some((k) => 
            String(k).toLowerCase().includes('application/pdf') || 
            String(k).toLowerCase().includes('pdf')
          );
          
          if (!hasPdf) continue;

          const id = it.id;
          const title = it.title || String(id);
          const authors = Array.isArray(it.authors) && it.authors.length 
            ? it.authors.map((a: any) => a.name).filter(Boolean) 
            : [];
          const creator = authors.join(', ');

          // Thumbnail URL (don't HEAD-check to avoid extra network latency/timeouts)
          const thumbnail = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;

          results.push({
            identifier: `gutenberg-${id}`,
            title,
            creator,
            year: it.year || '',
            thumbnailUrl: thumbnail || '',
            sourceUrl: `https://www.gutenberg.org/ebooks/${id}`,
            source: 'Project Gutenberg',
            downloadCount: Number(it.download_count || 0),
          });
        }

        // Deduplicate within Gutendex
        const dedupMap = new Map<string, any>();
        for (const it of results) {
          const key = normalizeKey(it.title, it.creator);
          if (!dedupMap.has(key)) {
            dedupMap.set(key, it);
          } else {
            dedupMap.set(key, pickBetter(dedupMap.get(key), it));
          }
        }

        console.log(`📖 Gutendex found ${dedupMap.size} results for "${q}"`);
        return { results: Array.from(dedupMap.values()) };
        
      } catch (e) {
        console.error('❌ Gutendex fetch error:', e);
        throw e;
      }
    };

    // === RUN BOTH SOURCES IN PARALLEL ===
    console.log(`🔍 Searching for "${q}"...`);
    const settled = await Promise.allSettled([fetchArchive(), fetchGuten()]);
    
    const archiveRes = settled[0].status === 'fulfilled' ? settled[0].value : null;
    const gutenRes = settled[1].status === 'fulfilled' ? settled[1].value : null;

    console.log(`📊 Source status - Archive: ${!!archiveRes}, Gutenberg: ${!!gutenRes}`);

    // If both failed, return error
    if (!archiveRes && !gutenRes) {
      console.error('❌ All Phase 1 sources failed');
      res.status(502).json({ error: 'Search temporarily unavailable. Please try again.' });
      return;
    }

    // Get results
    const iaList = archiveRes ? archiveRes.results || [] : [];
    const guList = gutenRes ? gutenRes.results || [] : [];

    // === CROSS-SOURCE DEDUPLICATION (IA priority) ===
    const finalMap = new Map<string, any>();

    const addToFinal = (item: any) => {
      const key = normalizeKey(item.title || '', item.creator || '');
      if (!finalMap.has(key)) {
        const clone = Object.assign({}, item);
        clone.alsoAvailableFrom = [];
        finalMap.set(key, clone);
      } else {
        const existing = finalMap.get(key);
        existing.alsoAvailableFrom = existing.alsoAvailableFrom || [];
        existing.alsoAvailableFrom.push({ 
          source: item.source, 
          sourceUrl: item.sourceUrl 
        });
      }
    };

    // Add IA first (priority)
    iaList.forEach(addToFinal);
    
    // Add Gutendex (only if not already in final)
    guList.forEach((it) => {
      const key = normalizeKey(it.title || '', it.creator || '');
      if (!finalMap.has(key)) {
        addToFinal(it);
      } else {
        const existing = finalMap.get(key);
        existing.alsoAvailableFrom = existing.alsoAvailableFrom || [];
        existing.alsoAvailableFrom.push({ 
          source: it.source, 
          sourceUrl: it.sourceUrl 
        });
      }
    });

    const combined = Array.from(finalMap.values());

    // === SCORE AND SORT ===
    const qNorm = normalizeTitleForMatch(q);
    combined.forEach((it) => {
      const tNorm = normalizeTitleForMatch(it.title || '');
      let score = 0;
      
      // Exact title match: highest score
      if (tNorm === qNorm) score += 100;
      // Contains query
      else if (tNorm.includes(qNorm) || qNorm.includes(tNorm)) score += 50;
      // Partial word match
      else if (qNorm.split(' ').some(word => tNorm.includes(word))) score += 25;
      
      // Boost by download count (popularity)
      score += Math.min(50, Number(it.downloadCount || 0) / 10);
      // Prefer items that explicitly have a PDF available
      if (it.hasPdf) score += 50;
      
      it.relevanceScore = score;
    });

    // Sort by score descending, then download count
    combined.sort((a, b) => 
      (b.relevanceScore || 0) - (a.relevanceScore || 0) || 
      (Number(b.downloadCount || 0) - Number(a.downloadCount || 0))
    );

    // === CLEAN OUTPUT ===
    const results = combined.map((r) => ({
      identifier: r.identifier,
      title: r.title,
      creator: r.creator,
      year: r.year || '',
      thumbnailUrl: r.thumbnailUrl || '',
      sourceUrl: r.sourceUrl,
      source: r.source,
      alsoAvailableFrom: r.alsoAvailableFrom || [],
      downloadCount: r.downloadCount || 0,
      relevanceScore: r.relevanceScore || 0,
      formats: r.formats || [],
      hasPdf: !!r.hasPdf,
    }));

    const out = { 
      results, 
      page, 
      rows: 24, 
      numFound: results.length,
      query: q,
      sources: {
        internetArchive: archiveRes ? iaList.length : 0,
        projectGutenberg: gutenRes ? guList.length : 0,
      }
    };

    // Cache if results found
    if (results.length > 0) {
      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: out });
      console.log(`✅ Cached ${results.length} results for "${q}"`);
    } else {
      console.log(`ℹ️ No results found for "${q}"`);
    }

    res.json(out);
    
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(502).json({ error: 'Search failed. Please try again.' });
  }
});

export default router;