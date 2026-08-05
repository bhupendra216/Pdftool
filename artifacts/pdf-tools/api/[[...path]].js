// Vercel serverless entrypoint that forwards API requests to the Express app.
// The Express app is built under artifacts/api-server/dist/index.mjs.

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "example.com"}`);
  const pathname = url.pathname || req.url || "";

  try {
    const mod = await import("../../api-server/dist/index.mjs");
    const app = mod.default || mod;
    if (app && typeof app.handler === "function") return app.handler(req, res);
    if (typeof app === "function") return app(req, res);
  } catch (err) {
    console.error("Failed to delegate to api-server/dist:", err && (err.stack || err.message || String(err)));
  }

  res.statusCode = 500;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ error: "API not available on this deployment" }));
}

export const config = { runtime: "nodejs" };
