import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";

const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "admin-analytics.sqlite3");
const DB_PATH = process.env.ADMIN_DB_PATH || DEFAULT_DB_PATH;

let dbInstance: DatabaseSync | null = null;

type DbCountRow = { count: number | string | null };
type DbAvgRow = { avg: number | string | null };
type AdminSessionRow = {
  token: string;
  username: string;
  created_at: string;
  createdAt: string;
  expires_at: string;
  expiresAt: string;
  ip_address: string | null;
  ipAddress: string | null;
  user_agent: string | null;
  userAgent: string | null;
};
type LoginAttemptRow = {
  attempts: number | string;
  firstAttemptAt: string;
  lastAttemptAt: string;
};
type AnalyticsEventRow = {
  ts: string;
  ipAddress: string | null;
  country: string | null;
  tool: string | null;
  statusCode: number | null;
  processingTime: number | null;
  fileSize: number | null;
  success: number | null;
};
type AnalyticsErrorRow = {
  ts: string;
  path: string;
  tool: string | null;
  statusCode: number | null;
  ipAddress: string | null;
};
type AnalyticsAggregateRow = {
  tool?: string;
  path?: string;
  day?: string;
  count: number | string | null;
  avg?: number | string | null;
  visitors?: number | string | null;
  conversions?: number | string | null;
  ocr?: number | string | null;
  pdf?: number | string | null;
  country?: string;
  user_agent?: string;
};

function toNumber(value: number | string | null | undefined): number {
  return Number(value ?? 0);
}

export type AnalyticsEventInput = {
  type: "page_view" | "api_request" | "tool_use";
  path: string;
  method: string;
  tool?: string | null;
  statusCode?: number;
  responseTimeMs?: number;
  ipAddress?: string;
  country?: string;
  userAgent?: string;
  referrer?: string;
  success?: boolean;
  fileSize?: number;
};

export type AdminSession = {
  token: string;
  username: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
};

function ensureDbFile() {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export function getDb() {
  if (dbInstance) return dbInstance;
  ensureDbFile();
  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT
    );
    CREATE TABLE IF NOT EXISTS admin_login_attempts (
      ip_address TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      first_attempt_at TEXT NOT NULL,
      last_attempt_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      ts TEXT NOT NULL,
      type TEXT NOT NULL,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      tool TEXT,
      status_code INTEGER,
      response_time_ms REAL,
      ip_address TEXT,
      country TEXT,
      user_agent TEXT,
      referrer TEXT,
      success INTEGER,
      file_size INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_analytics_ts ON analytics_events(ts);
    CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
  `);
  return dbInstance;
}

export function createAdminSession(username: string, ipAddress: string, userAgent: string) {
  const token = randomBytes(24).toString("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  getDb()
    .prepare(
      `INSERT INTO admin_sessions(token, username, created_at, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(token, username, createdAt, expiresAt, ipAddress, userAgent);
  return { token, expiresAt };
}

export function getAdminSession(token: string): AdminSession | null {
  const row = getDb()
    .prepare(`SELECT token, username, created_at as createdAt, expires_at as expiresAt, ip_address as ipAddress, user_agent as userAgent FROM admin_sessions WHERE token = ?`)
    .get(token) as AdminSessionRow | undefined;
  if (!row) return null;
  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    deleteAdminSession(token);
    return null;
  }
  return {
    token: row.token,
    username: row.username,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
    ipAddress: row.ipAddress ?? "",
    userAgent: row.userAgent ?? "",
  };
}

export function deleteAdminSession(token: string) {
  getDb().prepare(`DELETE FROM admin_sessions WHERE token = ?`).run(token);
}

export function registerLoginAttempt(ipAddress: string) {
  const now = new Date().toISOString();
  const existing = getDb().prepare(`SELECT attempts, first_attempt_at as firstAttemptAt, last_attempt_at as lastAttemptAt FROM admin_login_attempts WHERE ip_address = ?`).get(ipAddress) as LoginAttemptRow | undefined;
  if (!existing) {
    getDb().prepare(`INSERT INTO admin_login_attempts(ip_address, attempts, first_attempt_at, last_attempt_at) VALUES (?, 1, ?, ?)`)
      .run(ipAddress, now, now);
    return { attempts: 1, blocked: false };
  }
  const attempts = Number(existing.attempts) + 1;
  getDb().prepare(`UPDATE admin_login_attempts SET attempts = ?, last_attempt_at = ? WHERE ip_address = ?`).run(attempts, now, ipAddress);
  return { attempts, blocked: attempts >= 8 };
}

export function resetLoginAttempts(ipAddress: string) {
  getDb().prepare(`DELETE FROM admin_login_attempts WHERE ip_address = ?`).run(ipAddress);
}

export function isLoginBlocked(ipAddress: string) {
  const row = getDb().prepare(`SELECT attempts, last_attempt_at as lastAttemptAt FROM admin_login_attempts WHERE ip_address = ?`).get(ipAddress) as LoginAttemptRow | undefined;
  if (!row) return false;
  const lastAttemptAt = new Date(row.lastAttemptAt).getTime();
  const windowMs = 15 * 60 * 1000;
  if (Date.now() - lastAttemptAt > windowMs) {
    getDb().prepare(`DELETE FROM admin_login_attempts WHERE ip_address = ?`).run(ipAddress);
    return false;
  }
  return Number(row.attempts) >= 8;
}

export function recordAnalyticsEvent(event: AnalyticsEventInput) {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  getDb()
    .prepare(
      `INSERT INTO analytics_events(id, ts, type, path, method, tool, status_code, response_time_ms, ip_address, country, user_agent, referrer, success, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      new Date().toISOString(),
      event.type,
      event.path,
      event.method,
      event.tool ?? null,
      event.statusCode ?? null,
      event.responseTimeMs ?? null,
      event.ipAddress ?? null,
      event.country ?? null,
      event.userAgent ?? null,
      event.referrer ?? null,
      event.success ? 1 : 0,
      event.fileSize ?? null,
    );
}

export function getOverviewStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const last7DaysStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const last15Minutes = new Date(now.getTime() - 15 * 60 * 1000).toISOString();

  const totalVisitors = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ip_address IS NOT NULL`).get() as DbCountRow;
  const visitorsToday = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ts >= ? AND ip_address IS NOT NULL`).get(todayStart) as DbCountRow;
  const visitorsYesterday = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ts >= ? AND ts < ? AND ip_address IS NOT NULL`).get(yesterdayStart, todayStart) as DbCountRow;
  const visitorsLast7Days = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ts >= ? AND ip_address IS NOT NULL`).get(last7DaysStart) as DbCountRow;
  const visitorsLast30Days = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ts >= ? AND ip_address IS NOT NULL`).get(last30DaysStart) as DbCountRow;
  const visitorsAllTime = toNumber(totalVisitors.count);

  const toolUses = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE type = 'tool_use'`).get() as DbCountRow;
  const successfulConversions = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE type = 'tool_use' AND success = 1`).get() as DbCountRow;
  const failedConversions = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE type = 'tool_use' AND success = 0`).get() as DbCountRow;
  const avgProcessingTime = getDb().prepare(`SELECT AVG(response_time_ms) as avg FROM analytics_events WHERE response_time_ms IS NOT NULL`).get() as DbAvgRow;
  const totalOcrRequests = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE tool = 'OCR Image to Text'`).get() as DbCountRow;
  const totalPdfRequests = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE tool IN ('Merge PDF','Split PDF','Compress PDF','Protect PDF','Unlock PDF','Organize PDF','Delete Pages','Extract Pages','PDF to Word','Word to PDF','JPG to PDF','PDF to JPG')`).get() as DbCountRow;
  const activeUsers = getDb().prepare(`SELECT COUNT(DISTINCT ip_address) as count FROM analytics_events WHERE ts >= ? AND ip_address IS NOT NULL`).get(last15Minutes) as DbCountRow;

  const toolUsesCount = toNumber(toolUses.count);
  const successfulConversionsCount = toNumber(successfulConversions.count);
  const successRate = toolUsesCount > 0 ? Math.round((successfulConversionsCount / toolUsesCount) * 1000) / 10 : 0;

  const system = getSystemStats();

  return {
    totalVisitors: visitorsAllTime,
    visitorsToday: toNumber(visitorsToday.count),
    visitorsYesterday: toNumber(visitorsYesterday.count),
    visitorsLast7Days: toNumber(visitorsLast7Days.count),
    visitorsLast30Days: toNumber(visitorsLast30Days.count),
    visitorsAllTime,
    totalToolUses: toolUsesCount,
    totalSuccessfulConversions: successfulConversionsCount,
    failedConversions: toNumber(failedConversions.count),
    successRate,
    averageProcessingTime: toNumber(avgProcessingTime.avg),
    totalOcrRequests: toNumber(totalOcrRequests.count),
    totalPdfRequests: toNumber(totalPdfRequests.count),
    activeUsers: toNumber(activeUsers.count),
    serverUptime: system.serverUptime,
    memoryUsage: system.memoryUsage,
    cpuUsage: system.cpuUsage,
    diskUsage: system.diskUsage,
    nodeVersion: process.version,
  };
}

export function getToolStats() {
  const rows = getDb()
    .prepare(`SELECT tool, COUNT(*) as count FROM analytics_events WHERE type = 'tool_use' AND tool IS NOT NULL GROUP BY tool ORDER BY count DESC`)
    .all() as AnalyticsAggregateRow[];
  const total = rows.reduce((sum, row) => sum + toNumber(row.count), 0);
  return rows.map((row) => ({
    name: row.tool,
    count: toNumber(row.count),
    percentage: total > 0 ? Math.round((toNumber(row.count) / total) * 1000) / 10 : 0,
  }));
}

export function getAnalyticsSeries() {
  const rows = getDb()
    .prepare(`SELECT substr(ts, 1, 10) as day, COUNT(DISTINCT ip_address) as visitors, SUM(CASE WHEN type='tool_use' AND success=1 THEN 1 ELSE 0 END) as conversions, SUM(CASE WHEN tool='OCR Image to Text' THEN 1 ELSE 0 END) as ocr, SUM(CASE WHEN tool IN ('Merge PDF','Split PDF','Compress PDF','Protect PDF','Unlock PDF','Organize PDF','Delete Pages','Extract Pages','PDF to Word','Word to PDF','JPG to PDF','PDF to JPG') THEN 1 ELSE 0 END) as pdf FROM analytics_events GROUP BY substr(ts, 1, 10) ORDER BY day DESC LIMIT 30`)
    .all() as AnalyticsAggregateRow[];
  return rows.reverse().map((row) => ({
    day: row.day,
    visitors: toNumber(row.visitors),
    conversions: toNumber(row.conversions),
    ocr: toNumber(row.ocr),
    pdf: toNumber(row.pdf),
  }));
}

export function getVisitorBreakdowns() {
  const countries = getDb().prepare(`SELECT country, COUNT(*) as count FROM analytics_events WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  const browsers = getDb().prepare(`SELECT user_agent, COUNT(*) as count FROM analytics_events WHERE user_agent IS NOT NULL GROUP BY user_agent ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  return {
    countries: countries.map((row) => ({ name: row.country, count: toNumber(row.count) })),
    browsers: browsers.map((row) => ({ name: detectBrowser(row.user_agent), count: toNumber(row.count) })),
    os: browsers.map((row) => ({ name: detectOs(row.user_agent), count: toNumber(row.count) })),
    devices: browsers.map((row) => ({ name: detectDevice(row.user_agent), count: toNumber(row.count) })),
  };
}

export function getLogs(limit = 100, offset = 0, filters: { status?: string; tool?: string; search?: string } = {}) {
  const where: string[] = [];
  const params: any[] = [];
  if (filters.status) {
    where.push(`status_code = ?`);
    params.push(Number(filters.status));
  }
  if (filters.tool) {
    where.push(`tool = ?`);
    params.push(filters.tool);
  }
  if (filters.search) {
    where.push(`(path LIKE ? OR tool LIKE ? OR country LIKE ?)`);
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = getDb()
    .prepare(`SELECT ts, ip_address as ipAddress, country, tool, status_code as statusCode, response_time_ms as processingTime, file_size as fileSize, success FROM analytics_events ${whereClause} ORDER BY ts DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as AnalyticsEventRow[];
  return rows.map((row) => ({
    time: row.ts,
    ipAddress: row.ipAddress,
    country: row.country || "Unknown",
    requestedTool: row.tool || "N/A",
    statusCode: row.statusCode,
    processingTime: toNumber(row.processingTime),
    fileSize: toNumber(row.fileSize),
    success: Boolean(row.success),
  }));
}

export function getErrors() {
  const totalErrors = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE success = 0`).get() as DbCountRow;
  const recentErrors = getDb().prepare(`SELECT ts, path, tool, status_code as statusCode, ip_address as ipAddress FROM analytics_events WHERE success = 0 ORDER BY ts DESC LIMIT 10`).all() as AnalyticsErrorRow[];
  const mostCommon = getDb().prepare(`SELECT path, COUNT(*) as count FROM analytics_events WHERE success = 0 GROUP BY path ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  const ocrFailures = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE tool = 'OCR Image to Text' AND success = 0`).get() as DbCountRow;
  const conversionFailures = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE type = 'tool_use' AND success = 0`).get() as DbCountRow;
  const http500s = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE status_code >= 500`).get() as DbCountRow;
  const http404s = getDb().prepare(`SELECT COUNT(*) as count FROM analytics_events WHERE status_code = 404`).get() as DbCountRow;
  return {
    totalErrors: Number(totalErrors.count || 0),
    recentErrors,
    mostCommonErrors: mostCommon.map((row) => ({ path: row.path, count: toNumber(row.count) })),
    ocrFailures: Number(ocrFailures.count || 0),
    conversionFailures: Number(conversionFailures.count || 0),
    http500s: Number(http500s.count || 0),
    http404s: Number(http404s.count || 0),
  };
}

export function getPerformance() {
  const avgResponse = getDb().prepare(`SELECT AVG(response_time_ms) as avg FROM analytics_events WHERE response_time_ms IS NOT NULL`).get() as DbAvgRow;
  const slowest = getDb().prepare(`SELECT path, AVG(response_time_ms) as avg FROM analytics_events WHERE response_time_ms IS NOT NULL GROUP BY path ORDER BY avg DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  const system = getSystemStats();
  return {
    averageApiResponseTime: toNumber(avgResponse.avg),
    slowestApis: slowest.map((row) => ({ path: row.path, avgMs: toNumber(row.avg) })),
    memoryUsage: system.memoryUsage,
    cpuUsage: system.cpuUsage,
    diskUsage: system.diskUsage,
    serverUptime: system.serverUptime,
    nodeVersion: process.version,
  };
}

export function getSearchAnalytics() {
  const searches = getDb().prepare(`SELECT tool, COUNT(*) as count FROM analytics_events WHERE type = 'tool_use' AND tool IS NOT NULL GROUP BY tool ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  const pages = getDb().prepare(`SELECT path, COUNT(*) as count FROM analytics_events WHERE type = 'page_view' GROUP BY path ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  const downloads = getDb().prepare(`SELECT path, COUNT(*) as count FROM analytics_events WHERE path LIKE '%download%' GROUP BY path ORDER BY count DESC LIMIT 10`).all() as AnalyticsAggregateRow[];
  return {
    mostSearchedTools: searches.map((row) => ({ name: row.tool, count: toNumber(row.count) })),
    mostVisitedPages: pages.map((row) => ({ path: row.path, count: toNumber(row.count) })),
    mostDownloadedOutputs: downloads.map((row) => ({ path: row.path, count: toNumber(row.count) })),
    averageSessionDuration: 0,
    bounceRate: 0,
  };
}

function getSystemStats() {
  const memoryUsage = process.memoryUsage();
  const totalMemory = os.totalmem();
  const usedMemory = memoryUsage.heapUsed;
  const memoryPercent = Math.round((usedMemory / totalMemory) * 1000) / 10;
  const cpuUsage = process.cpuUsage();
  const cpuPercent = Math.round(((cpuUsage.user + cpuUsage.system) / 1000000) * 10) / 10;
  let diskUsage = { usedPercent: 0, usedGb: 0, totalGb: 0 };
  try {
    const output = execSync("df -Pk . | tail -1", { encoding: "utf8" });
    const tokens = output.trim().split(/\s+/);
    const totalKb = Number(tokens[1] || 0);
    const usedKb = Number(tokens[2] || 0);
    if (totalKb) {
      diskUsage = {
        usedPercent: Math.round((usedKb / totalKb) * 1000) / 10,
        usedGb: Math.round((usedKb / 1024 / 1024) * 100) / 100,
        totalGb: Math.round((totalKb / 1024 / 1024) * 100) / 100,
      };
    }
  } catch {
    // Ignore environment differences and fall back to zeros.
  }
  return {
    serverUptime: `${Math.floor(process.uptime() / 60)}m`,
    memoryUsage: { usedMb: Math.round(usedMemory / 1024 / 1024), totalMb: Math.round(totalMemory / 1024 / 1024), percent: memoryPercent },
    cpuUsage: { percent: Math.min(100, cpuPercent) },
    diskUsage,
  };
}

function detectBrowser(userAgent = "") {
  if (!userAgent) return "Unknown";
  if (/chrome|chromium/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/edg/i.test(userAgent)) return "Edge";
  return "Other";
}

function detectOs(userAgent = "") {
  if (!userAgent) return "Unknown";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/mac os/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad/i.test(userAgent)) return "iOS";
  return "Other";
}

function detectDevice(userAgent = "") {
  if (!userAgent) return "Unknown";
  if (/mobile|iphone|android/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}
