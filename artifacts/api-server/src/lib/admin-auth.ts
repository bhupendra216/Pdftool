import { createHmac, timingSafeEqual } from "node:crypto";
import { isLoginBlocked, registerLoginAttempt, resetLoginAttempts } from "./admin-store";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!username || !password) throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured");
  return { username, password };
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be configured");
  return secret;
}

function signSession(username: string, expiresAt: number) {
  const payload = `${username}|${expiresAt}`;
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

function verifySession(token: string) {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) return null;
  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const expectedSignature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
    const provided = Buffer.from(providedSignature);
    const expected = Buffer.from(expectedSignature);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
    const separator = payload.lastIndexOf("|");
    const username = payload.slice(0, separator);
    const expiresAt = Number(payload.slice(separator + 1));
    if (!username || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
    return { username, expiresAt };
  } catch {
    return null;
  }
}

export function getClientIp(req: any) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded) && forwarded[0]) return forwarded[0];
  return req.socket?.remoteAddress || "unknown";
}

export function readAdminSessionToken(req: any) {
  const cookieHeader = req.headers.cookie || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function requireAdmin(req: any, res: any, next: any) {
  const token = readAdminSessionToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.admin = { username: session.username, expiresAt: new Date(session.expiresAt).toISOString() };
  next();
}

export function loginAdmin(req: any, res: any) {
  const ipAddress = getClientIp(req);
  if (isLoginBlocked(ipAddress)) {
    res.status(429).json({ error: "Too many login attempts. Please try again later." });
    return;
  }

  const { username, password } = req.body || {};
  const credentials = getAdminCredentials();
  const attemptState = loginAttempts.get(ipAddress) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  if (Date.now() > attemptState.resetAt) {
    attemptState.count = 0;
    attemptState.resetAt = Date.now() + 15 * 60 * 1000;
  }
  if (attemptState.count >= 5) {
    res.status(429).json({ error: "Too many login attempts. Please try again later." });
    return;
  }

  if (username === credentials.username && password === credentials.password) {
    const result = registerLoginAttempt(ipAddress);
    if (result.blocked) {
      res.status(429).json({ error: "Too many login attempts. Please try again later." });
      return;
    }
    resetLoginAttempts(ipAddress);
    loginAttempts.delete(ipAddress);
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
    res.cookie("admin_session", signSession(username, expiresAt), {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ ok: true, username });
    return;
  }

  attemptState.count += 1;
  loginAttempts.set(ipAddress, attemptState);
  const result = registerLoginAttempt(ipAddress);
  res.status(401).json({ error: result.blocked ? "Too many login attempts. Please try again later." : "Invalid credentials" });
}

export function logoutAdmin(req: any, res: any) {
  const token = readAdminSessionToken(req);
  res.clearCookie("admin_session", {
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
}
