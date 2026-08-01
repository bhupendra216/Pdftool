// Vercel serverless entrypoint that forwards API requests to the Express app
// The Express app is built under artifacts/api-server/dist/index.mjs

export default async function handler(req, res) {
  // Dynamically import the compiled ESM build of the API server
  const mod = await import('../../api-server/dist/index.mjs');
  const app = mod.default || mod;

  // Express apps are callable (req, res)
  return app(req, res);
}

// Optional: support for vercel/now default export
export const config = { runtime: 'nodejs' };
