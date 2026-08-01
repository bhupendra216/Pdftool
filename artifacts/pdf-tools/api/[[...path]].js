// Vercel serverless entrypoint that forwards API requests to the Express app
// The Express app is built under artifacts/api-server/dist/index.mjs

export default async function handler(req, res) {
  try {
    // Dynamically import the compiled ESM build of the API server
    const mod = await import('../../api-server/dist/index.mjs');
    const app = mod.default || mod;

    // If module exports an object with `handler`, use it
    if (app && typeof app.handler === 'function') {
      return app.handler(req, res);
    }

    // If it's an express app (callable), call it
    if (typeof app === 'function') {
      return app(req, res);
    }

    // Unknown export
    console.error('Imported API server module did not export a callable app or handler', Object.keys(mod || {}));
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Server misconfiguration: API handler not found', exports: Object.keys(mod || {}) }));
  } catch (err) {
    console.error('Error loading API server module', err && (err.stack || err.message || String(err)));
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    const message = err && (err.stack || err.message || String(err));
    // Return the error message to assist debugging (remove in production)
    res.end(JSON.stringify({ error: 'Failed to load API server module', message }));
  }
}

// Optional: support for vercel/now default export
export const config = { runtime: 'nodejs' };
