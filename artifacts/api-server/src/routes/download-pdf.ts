import { Router } from "express";
import dns from "dns";
import net from "net";
import { URL } from "url";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const router = Router();
const dnsLookup = dns.promises.lookup;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;

function isPrivateIPv4(addr: string) {
  const parts = addr.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function isPrivateIPv6(addr: string) {
  const low = addr.toLowerCase();
  if (low === '::1') return true;
  if (low.startsWith('fe80:')) return true; // link-local
  if (low.startsWith('fc') || low.startsWith('fd')) return true; // unique local
  // IPv4-mapped IPv6 ::ffff:127.0.0.1 etc
  const v4match = low.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4match) return isPrivateIPv4(v4match[1]);
  return false;
}

async function validateHostname(hostname: string) {
  if (!hostname) throw new Error('Empty hostname');

  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.localhost')) {
    throw new Error('Hostname localhost is not allowed');
  }

  // Allow public domains that resolve from a private DNS resolver, but still reject
  // obvious private/loopback addresses when the lookup succeeds.
  let addresses;
  try {
    addresses = await dnsLookup(hostname, { all: true });
  } catch (err) {
    // Some valid public hosts can fail DNS in constrained environments. We only reject
    // clearly local/internal candidates here; otherwise allow the fetch to continue.
    const candidate = lower.replace(/\[|\]/g, '');
    if (/^\d+\.\d+\.\d+\.\d+$/.test(candidate)) {
      const ip = candidate;
      if (isPrivateIPv4(ip)) throw new Error('Private or loopback address is not allowed');
    }
    return;
  }

  if (!addresses || addresses.length === 0) return;

  for (const a of addresses) {
    const ip = a.address;
    const family = a.family;
    if (family === 4) {
      if (isPrivateIPv4(ip)) throw new Error('Private or loopback address is not allowed');
    } else if (family === 6) {
      if (isPrivateIPv6(ip)) throw new Error('Private or link-local IPv6 address is not allowed');
    } else {
      throw new Error('Unrecognized IP family');
    }
  }
}

function sanitizeFilename(name: string) {
  const base = path.basename(name || 'download');
  // remove query-like parts
  const cleaned = base.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(cleaned || 'download');
  // allow letters, numbers, dash, underscore, dot
  const safe = decoded.replace(/[^a-zA-Z0-9._-]/g, '-');
  if (!safe.toLowerCase().endsWith('.pdf')) return `${safe}.pdf`;
  return safe;
}

router.post('/download-pdf', async (req, res) => {
  const { url, data, filename: bodyFilename } = req.body ?? {};
  const rawUrl = typeof url === 'string' ? url.trim() : '';

  // Support raw PDF POSTs (binary) sent with Content-Type: application/pdf
  if ((req.headers['content-type'] || '').toString().includes('application/pdf') && Buffer.isBuffer(req.body)) {
    const buf = req.body as Buffer;
    try {
      console.debug('[download-pdf] received raw PDF buffer length=%d filename=%s', buf.length, req.headers['x-filename'] || bodyFilename || '');
      if (buf.length === 0 || buf.length > MAX_BYTES) {
        res.status(400).json({ error: 'Invalid or too large PDF data' });
        return;
      }
      const prefix = buf.slice(0, 32).toString('latin1').replace(/^\uFEFF/, '').replace(/^\s+/, '');
      if (!prefix.startsWith('%PDF')) {
        res.status(400).json({ error: 'Provided data is not a valid PDF' });
        return;
      }

      // Debug: write the received raw PDF to a temporary file and log its sha256
      try {
        const tmpDir = process.env.TMPDIR || '/tmp';
        const safeName = sanitizeFilename((req.headers['x-filename'] || bodyFilename) as string || `download-${Date.now()}`);
        const tmpPath = path.join(tmpDir, `pdf-debug-raw-${Date.now()}-${safeName}`);
        fs.writeFileSync(tmpPath, buf);
        const hash = crypto.createHash('sha256').update(buf).digest('hex');
        console.debug('[download-pdf] debug-saved raw tmpPath=%s size=%d sha256=%s', tmpPath, buf.length, hash);
      } catch (err) {
        console.warn('[download-pdf] failed to write debug temp file (raw)', err);
      }

      const filename = sanitizeFilename((req.headers['x-filename'] || bodyFilename) as string || `download`);
      res.setHeader('content-type', 'application/pdf');
      res.setHeader('content-disposition', `attachment; filename="${filename}"`);
      res.send(buf);
      return;
    } catch (err: any) {
      res.status(400).json({ error: 'Failed to handle raw PDF data' });
      return;
    }
  }

  // If client posted PDF bytes (base64), return them directly as a download.
  if (typeof data === 'string' && data.trim().length > 0) {
    try {
      const buf = Buffer.from(data, 'base64');
      console.debug('[download-pdf] received base64 data length=%d bytes, filename=%s', buf.length, bodyFilename || '');
      if (buf.length === 0 || buf.length > MAX_BYTES) {
        res.status(400).json({ error: 'Invalid or too large PDF data' });
        return;
      }
      const prefix = buf.slice(0, 32).toString('latin1').replace(/^\uFEFF/, '').replace(/^\s+/, '');
      if (!prefix.startsWith('%PDF')) {
        res.status(400).json({ error: 'Provided data is not a valid PDF' });
        return;
      }

      // Debug: write the received PDF to a temporary file and log its sha256
      try {
        const tmpDir = process.env.TMPDIR || '/tmp';
        const safeName = sanitizeFilename(typeof bodyFilename === 'string' ? bodyFilename : `download-${Date.now()}`);
        const tmpPath = path.join(tmpDir, `pdf-debug-${Date.now()}-${safeName}`);
        fs.writeFileSync(tmpPath, buf);
        const hash = crypto.createHash('sha256').update(buf).digest('hex');
        console.debug('[download-pdf] debug-saved tmpPath=%s size=%d sha256=%s', tmpPath, buf.length, hash);
      } catch (err) {
        console.warn('[download-pdf] failed to write debug temp file', err);
      }

      const filename = sanitizeFilename(typeof bodyFilename === 'string' ? bodyFilename : 'download');
      res.setHeader('content-type', 'application/pdf');
      res.setHeader('content-disposition', `attachment; filename="${filename}"`);
      res.send(buf);
      return;
    } catch (err: any) {
      res.status(400).json({ error: 'Failed to decode PDF data' });
      return;
    }
  }

  if (!rawUrl) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    res.status(400).json({ error: 'Unsupported protocol' });
    return;
  }

  if (parsed.username || parsed.password) {
    res.status(400).json({ error: 'Credentials in URL are not allowed' });
    return;
  }

  try {
    await validateHostname(parsed.hostname);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Hostname validation failed' });
    return;
  }

  // follow redirects manually to re-validate final hostnames
  let currentUrl = parsed;
  let redirectCount = 0;

  try {
    while (redirectCount <= MAX_REDIRECTS) {
      const controller = AbortSignal.timeout(FETCH_TIMEOUT_MS);
      const response = await fetch(currentUrl.toString(), { method: 'GET', redirect: 'manual', signal: controller });

      // handle redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          res.status(400).json({ error: 'Redirect with no location' });
          return;
        }
        const nextUrl = new URL(location, currentUrl);
        // validate the next hostname before following
        try {
          if (nextUrl.username || nextUrl.password) {
            res.status(400).json({ error: 'Credentials in redirect URL are not allowed' });
            return;
          }
          await validateHostname(nextUrl.hostname);
        } catch (err: any) {
          res.status(400).json({ error: err.message || 'Redirect hostname validation failed' });
          return;
        }

        currentUrl = nextUrl;
        redirectCount += 1;
        continue;
      }

      // got a non-redirect response, proceed to stream/validate
      if (!response.ok) {
        res.status(502).json({ error: `Remote server returned status ${response.status}` });
        return;
      }

      const contentLengthHeader = response.headers.get('content-length');
      if (contentLengthHeader) {
        const length = Number(contentLengthHeader);
        if (!Number.isNaN(length) && length > MAX_BYTES) {
          res.status(400).json({ error: 'File too large' });
          return;
        }
      }

      const urlPath = currentUrl.pathname || '';
      const softPdfHint = (response.headers.get('content-type') || '').includes('application/pdf') || urlPath.toLowerCase().endsWith('.pdf');

      // stream body with size limit and check magic bytes
      const chunks: Buffer[] = [];
      let total = 0;
      let firstFive: Buffer | null = null;

      try {
        for await (const chunk of (response.body as any)) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          if (!firstFive) {
            firstFive = buf.slice(0, 5);
          } else if (firstFive.length < 5) {
            const need = 5 - firstFive.length;
            firstFive = Buffer.concat([firstFive, buf.slice(0, need)], Math.min(5, firstFive.length + buf.length));
          }

          total += buf.length;
          if (total > MAX_BYTES) {
            res.status(400).json({ error: 'File too large' });
            return;
          }
          chunks.push(buf);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          res.status(504).json({ error: 'Timeout' });
          return;
        }
        console.error('Stream error', err);
        res.status(502).json({ error: 'Network error while fetching remote file' });
        return;
      }

      const fileBuffer = Buffer.concat(chunks, total);

      const prefix = fileBuffer.slice(0, 32).toString('latin1');
      const normalizedPrefix = prefix.replace(/^\uFEFF/, '').replace(/^\s+/, '');
      if (!normalizedPrefix.startsWith('%PDF')) {
        res.status(400).json({ error: 'Not a valid PDF' });
        return;
      }

      // all good — derive filename
      const filename = sanitizeFilename(currentUrl.pathname || 'download');

      res.setHeader('content-type', 'application/pdf');
      res.setHeader('content-disposition', `attachment; filename="${filename}"`);
      res.send(fileBuffer);
      return;
    }

    res.status(400).json({ error: 'Too many redirects' });
    return;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      res.status(504).json({ error: 'Timeout' });
      return;
    }
    console.error('Fetch error', err);
    res.status(502).json({ error: 'Network error' });
    return;
  }
});

export default router;
