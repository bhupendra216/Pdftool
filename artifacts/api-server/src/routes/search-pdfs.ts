import { Router } from 'express';

const router = Router();

// Simple in-memory cache: key -> { expires: number, data }
const cache = new Map<string, { expires: number; data: any }>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

router.get('/search-pdfs', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = Number(req.query.page || 1) || 1;
  if (!q) {
    res.status(400).json({ error: 'Missing query parameter q' });
    return;
  }

  const cacheKey = `${q}::${page}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > now) {
    res.json(cached.data);
    return;
  }

  try {
    // helper: fetch with retries, per-attempt timeout and simple backoff
    const fetchWithRetries = async (url: string, opts: any = {}, attempts = 3, timeoutMs = 15000) => {
      let lastErr: any = null;
      for (let i = 0; i < attempts; i++) {
        try {
          const mergedOpts = Object.assign({}, opts, { signal: AbortSignal.timeout(timeoutMs), headers: Object.assign({ 'User-Agent': 'PDFKira/1.0 (+https://pdfkira.example)', Accept: 'application/json' }, opts && opts.headers) });
          const r = await fetch(url, mergedOpts);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r;
        } catch (e: any) {
          lastErr = e;
          const delay = 500 * Math.pow(2, i); // 500ms, 1s, 2s
          await new Promise((res) => setTimeout(res, delay));
        }
      }
      throw lastErr;
    };
    const params = new URLSearchParams();
    // search only texts (books/documents) and exclude access-restricted (lending/borrow-only) items
    params.set('q', `${q} AND mediatype:texts AND -access-restricted-item:true`);
    params.append('fl[]', 'identifier');
    params.append('fl[]', 'title');
    params.append('fl[]', 'creator');
    params.append('fl[]', 'year');
    params.append('fl[]', 'format');
    // request the access-restricted flag so we can defensively filter any restricted items
    params.append('fl[]', 'access-restricted-item');
    params.set('output', 'json');
    params.set('rows', '24');
    params.set('page', String(page));

    const SOURCE_FETCH_TIMEOUT_MS = 15_000;

    const fetchArchive = async () => {
      try {
        const url = `https://archive.org/advancedsearch.php?${params.toString()}`;
        const resp = await fetchWithRetries(url, { method: 'GET' }, 3, SOURCE_FETCH_TIMEOUT_MS);
        const body = await resp.json();
        const response = body.response || {};
        const docs = Array.isArray(response.docs) ? response.docs : [];

        // First filter by format hint from search response and skip any docs that are marked as access-restricted
        const hinted = docs.filter((d: any) => {
          const restrictedFlag = d['access-restricted-item'];
          if (restrictedFlag === true || String(restrictedFlag).toLowerCase() === 'true') return false;

          const f = d.format;
          if (!f) return false;
          if (Array.isArray(f)) return f.some((x) => String(x).toLowerCase().includes('pdf'));
          return String(f).toLowerCase().includes('pdf');
        });

        const fetchMetadata = async (identifier: string) => {
          try {
            try {
              const mResp = await fetchWithRetries(`https://archive.org/metadata/${encodeURIComponent(identifier)}`, { method: 'GET' }, 2, 10_000);
              return await mResp.json();
            } catch (e) {
              return null;
            }
          } catch (e) {
            return null;
          }
        };

        const concurrency = 6;
        const aResults: any[] = [];
        for (let i = 0; i < hinted.length; i += concurrency) {
          const batch = hinted.slice(i, i + concurrency);
          const metas = await Promise.all(batch.map((b: any) => fetchMetadata(b.identifier)));
          metas.forEach((meta, idx) => {
            const doc = batch[idx];
            if (!meta) return;

            const metaRestricted = meta['access-restricted-item'] || (meta.metadata && meta.metadata['access-restricted-item']);
            if (metaRestricted === true || String(metaRestricted).toLowerCase() === 'true') return;

            const access = meta.access || (meta.metadata && meta.metadata.access) || '';
            if (access && String(access).toLowerCase() !== 'public') return;

            const rights = (meta.metadata && meta.metadata.rights) || '';
            const rightsStr = String(rights).toLowerCase();
            if (rightsStr.includes('all rights reserved') || (rightsStr.includes('copyright') && !rightsStr.includes('public'))) return;

            const files = Array.isArray(meta.files) ? meta.files : [];
            const pdfFile = files.find((f: any) => {
              const fm = String(f.format || '').toLowerCase();
              const name = String(f.name || '').toLowerCase();
              return fm.includes('pdf') || name.endsWith('.pdf');
            });
            if (!pdfFile) return;

            aResults.push({
              identifier: doc.identifier,
              title: doc.title || doc.identifier,
              creator: Array.isArray(doc.creator) ? doc.creator.join(', ') : doc.creator || '',
              year: doc.year || '',
              thumbnailUrl: `https://archive.org/services/img/${doc.identifier}`,
              sourceUrl: `https://archive.org/details/${doc.identifier}`,
              source: 'Internet Archive',
            });
          });
        }

        return { results: aResults, numFound: response.numFound || aResults.length };
      } catch (e) {
        console.error('archive fetch error', e);
        throw e;
      }
    };

    const fetchGuten = async () => {
      try {
        const gutUrl = `https://gutendex.com/books?search=${encodeURIComponent(q)}&page=${page}`;
        const gResp = await fetchWithRetries(gutUrl, { method: 'GET' }, 3, SOURCE_FETCH_TIMEOUT_MS);
        const gBody = await gResp.json();
        const items = Array.isArray(gBody.results) ? gBody.results : [];

        const gResults: any[] = [];
        for (const it of items) {
          const id = it.id;
          const title = it.title || String(id);
          const authors = Array.isArray(it.authors) ? it.authors.map((a: any) => a.name).filter(Boolean) : [];
          const creator = authors.join(', ');
          const formats = it.formats || {};

          // find a PDF format entry (key or value may indicate PDF)
          let pdfUrl: string | null = null;
          for (const k of Object.keys(formats)) {
            const v = formats[k];
            if (!v) continue;
            const keyLow = String(k).toLowerCase();
            const valLow = String(v).toLowerCase();
            // some Gutendex keys are exact mime types like 'application/pdf' or 'application/pdf; charset=utf-8'
            if (keyLow.includes('pdf') || valLow.endsWith('.pdf') || valLow.includes('.pdf')) {
              pdfUrl = v;
              break;
            }
          }
          if (!pdfUrl) continue; // skip items with no PDF

          // thumbnail: prefer an image/jpeg in formats, else construct Gutenberg cover url as fallback
          let thumb = null;
          for (const k of Object.keys(formats)) {
            const v = formats[k];
            if (!v) continue;
            const keyLow = String(k).toLowerCase();
            if (keyLow.includes('image') || keyLow.includes('cover')) {
              thumb = v;
              break;
            }
          }
          if (!thumb) {
            try {
              thumb = `https://www.gutenberg.org/cache/epub/${encodeURIComponent(id)}/pg${encodeURIComponent(id)}.cover.medium.jpg`;
            } catch (e) {
              thumb = '';
            }
          }

          gResults.push({
            identifier: `gutenberg-${id}`,
            title,
            creator,
            year: '',
            thumbnailUrl: thumb || '',
            sourceUrl: `https://www.gutenberg.org/ebooks/${id}`,
            source: 'Project Gutenberg',
          });
        }

        return { results: gResults, numFound: gBody.count || gResults.length };
      } catch (e) {
        console.error('gutendex fetch error', e);
        throw e;
      }
    };

    // run both in parallel and tolerate one failing
    const [archiveSettled, gutenSettled] = await Promise.allSettled([fetchArchive(), fetchGuten()]);

    const archiveRes = archiveSettled.status === 'fulfilled' ? archiveSettled.value : null;
    const gutenRes = gutenSettled.status === 'fulfilled' ? gutenSettled.value : null;

    if (!archiveRes && !gutenRes) {
      console.error('Both search sources failed');
      res.status(502).json({ error: 'Search failed' });
      return;
    }

    const iaResults = archiveRes ? archiveRes.results : [];
    const gutenResults = gutenRes ? gutenRes.results : [];

    const combined = iaResults.concat(gutenResults);
    const out = {
      results: combined,
      page,
      rows: 24,
      // report the number of returned items (avoid showing upstream counts that were filtered out)
      numFound: combined.length,
    };

    // Only cache non-empty results to avoid caching transient empty responses
    if (combined.length > 0) {
      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: out });
    } else {
      console.warn('search-pdfs: combined results empty, not caching', { q, page, archiveOk: !!archiveRes, gutenOk: !!gutenRes });
    }

    res.json(out);
  } catch (err) {
    console.error('search-pdfs error', err);
    res.status(502).json({ error: 'Search failed' });
  }
});

export default router;
