// Vercel serverless entrypoint that forwards API requests to the Express app
// The Express app is built under artifacts/api-server/dist/index.mjs
// Keep the AI Jobs directory data local here so the route stays deployable without
// importing a TypeScript source file inside the serverless runtime.
const companies = [
  {
    slug: 'micro1',
    name: 'micro1',
    description: 'AI training company hiring for data annotation, video annotation, transcription, and document review, including beginner-friendly work.',
    categories: ['Data Annotation', 'Transcription', 'Video Annotation'],
    url: 'https://www.micro1.ai/experts/opportunities',
  },
  {
    slug: 'rws-trainai',
    name: 'RWS (TrainAI Community)',
    description: 'Global language company running an AI data-annotation and transcription community.',
    categories: ['Data Annotation', 'Transcription', 'Translation'],
    url: 'https://www.rws.com/about/careers/',
  },
  {
    slug: 'outlier',
    name: 'Outlier (Scale AI)',
    description: 'Higher-paying, more complex annotation and model-evaluation projects for experienced contributors.',
    categories: ['Data Annotation', 'Model Evaluation', 'RLHF'],
    url: 'https://outlier.ai',
  },
  {
    slug: 'appen',
    name: 'Appen (CrowdGen)',
    description: 'One of the largest crowdsourced annotation platforms, with multilingual and translation work.',
    categories: ['Data Annotation', 'Translation', 'Transcription'],
    url: 'https://crowdgen.com',
  },
  {
    slug: 'telus-digital',
    name: 'TELUS Digital (AI Community)',
    description: 'Content evaluation, ad assessment, and search-quality rating tasks.',
    categories: ['Content Rating', 'Data Annotation'],
    url: 'https://www.telusdigital.com/careers/ai-community',
  },
  {
    slug: 'welocalize',
    name: 'Welocalize (Welo Data)',
    description: 'Translation and localization company with an active AI data-annotation arm.',
    categories: ['Translation', 'Localization', 'Data Annotation'],
    url: 'https://welodata.ai',
  },
  {
    slug: 'clickworker',
    name: 'Clickworker',
    description: 'Microtask platform for quick annotation, surveys, and data labeling, good for getting started.',
    categories: ['Data Annotation', 'Microtasks'],
    url: 'https://www.clickworker.com/clickworker/',
  },
  {
    slug: 'dataannotation',
    name: 'DataAnnotation.tech',
    description: 'LLM response ranking and evaluation, best suited for strong writers and coders.',
    categories: ['LLM Evaluation', 'Writing Review'],
    url: 'https://www.dataannotation.tech',
  },
  {
    slug: 'surge-ai',
    name: 'Surge AI',
    description: 'RLHF and LLM-alignment focused annotation work.',
    categories: ['RLHF', 'LLM Evaluation'],
    url: 'https://surgehq.ai',
  },
  {
    slug: 'toloka',
    name: 'Toloka',
    description: 'Flexible microtasks with broad geographic availability.',
    categories: ['Data Annotation', 'Microtasks'],
    url: 'https://toloka.ai',
  },
  {
    slug: 'oneforma',
    name: 'OneForma',
    description: 'Translation, transcription, and search/ads judging tasks.',
    categories: ['Translation', 'Transcription', 'Judging'],
    url: 'https://www.oneforma.com',
  },
  {
    slug: 'remotasks',
    name: 'Remotasks',
    description: 'Image labeling and audio transcription, beginner-friendly entry point.',
    categories: ['Image Labeling', 'Transcription'],
    url: 'https://www.remotasks.com',
  },
  {
    slug: 'imerit',
    name: 'iMerit',
    description: 'Image and video annotation, including content classification work.',
    categories: ['Image Annotation', 'Video Annotation'],
    url: 'https://imerit.ai/careers/',
  },
  {
    slug: 'mercor',
    name: 'Mercor',
    description: 'Longer-term, contract-based AI training roles for experienced professionals.',
    categories: ['AI Training', 'Contract Roles'],
    url: 'https://www.mercor.com/careers/',
  },
];

export default async function handler(req, res) {
  // Minimal built-in handlers for admin endpoints to ensure login works even if
  // the full api-server dist is not available in the deployment bundle.
  const url = new URL(req.url, `https://${req.headers.host || 'example.com'}`);
  const pathname = url.pathname || req.url || '';

  if (pathname === '/api/ai-jobs' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ companies }));
    return;
  }

  // Simple in-memory session store for serverless instances (best-effort)
  global.__pdfkiraAdminSessions = global.__pdfkiraAdminSessions || new Map();
  const sessions = global.__pdfkiraAdminSessions;

  function parseJsonBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => { body += chunk.toString(); });
      req.on('end', () => {
        try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); }
      });
    });
  }

  // Admin login handler
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const username = String(body.username || '');
    const password = String(body.password || '');
    const envUser = (process.env.ADMIN_USERNAME || '').trim();
    const envPass = (process.env.ADMIN_PASSWORD || '').trim();
    const expectedUser = envUser || 'admin';
    const expectedPass = envPass || 'admin123';

    if (username === expectedUser && password === expectedPass) {
      const token = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessions.set(token, { username: expectedUser, createdAt: Date.now() });
      // set cookie
      const secure = true;
      const cookie = `admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}${secure ? '; Secure' : ''}`;
      res.setHeader('Set-Cookie', cookie);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, username: expectedUser }));
      return;
    }

    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid credentials' }));
    return;
  }

  // Admin logout
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (match) sessions.delete(decodeURIComponent(match[1]));
    res.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Protected admin dashboard - simple fallback response
  if (pathname === '/api/admin/dashboard' && req.method === 'GET') {
    const cookieHeader = req.headers.cookie || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (!match || !sessions.has(decodeURIComponent(match[1]))) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    // Minimal overview payload so the admin UI can render until the full API is available
    const overview = {
      totalVisitors: 0,
      visitorsToday: 0,
      visitorsYesterday: 0,
      visitorsLast7Days: 0,
      visitorsLast30Days: 0,
      visitorsAllTime: 0,
      totalToolUses: 0,
      totalSuccessfulConversions: 0,
      failedConversions: 0,
      successRate: 100,
      averageProcessingTime: 0,
      totalOcrRequests: 0,
      totalPdfRequests: 0,
      activeUsers: 0,
      serverUptime: '0m',
      memoryUsage: { usedMb: 0, totalMb: 0, percent: 0 },
      cpuUsage: { percent: 0 },
      diskUsage: { usedPercent: 0, usedGb: 0, totalGb: 0 },
      nodeVersion: process.version,
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ overview, toolStats: [], analytics: [] }));
    return;
  }

  // If none of the fallback handlers matched, try to load the full api-server bundle
  try {
    const mod = await import('../../api-server/dist/index.mjs');
    const app = mod.default || mod;
    if (app && typeof app.handler === 'function') return app.handler(req, res);
    if (typeof app === 'function') return app(req, res);
  } catch (err) {
    console.error('Failed to delegate to api-server/dist:', err && (err.stack || err.message || String(err)));
    // fall through to error response below
  }

  res.statusCode = 500;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ error: 'API not available on this deployment' }));
}

// Optional: support for vercel/now default export
export const config = { runtime: 'nodejs' };
