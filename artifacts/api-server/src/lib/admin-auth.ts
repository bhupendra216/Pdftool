import { createAdminSession, deleteAdminSession, getAdminSession, isLoginBlocked, registerLoginAttempt, resetLoginAttempts } from "./admin-store";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function getAdminCredentials() {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in the environment");
  }
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
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

  const session = getAdminSession(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.admin = session;
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
    const session = createAdminSession(username, ipAddress, req.get("user-agent") || "unknown");
    res.cookie("admin_session", session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
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
  if (token) {
    deleteAdminSession(token);
  }
  res.clearCookie("admin_session", { path: "/" });
  res.json({ ok: true });
}
