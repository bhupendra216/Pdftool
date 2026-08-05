import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import os from "node:os";

type DbCountRow = { count: number | string | null };
type DbAvgRow = { avg: number | string | null };
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
type AnalyticsEventRecord = {
  id: string;
  ts: string;
  type: string;
  path: string;
  method: string;
  tool: string | null;
  statusCode: number | null;
  responseTimeMs: number | null;
  ipAddress: string | null;
  country: string | null;
  userAgent: string | null;
  referrer: string | null;
  success: number | null;
  fileSize: number | null;
};
type AdminMemoryStore = {
  sessions: Map<string, AdminSession>;
  loginAttempts: Map<string, LoginAttemptRow>;
  analyticsEvents: AnalyticsEventRecord[];
};
type GlobalWithStore = typeof globalThis & {
  __pdfKiraAdminStore?: AdminMemoryStore;
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

function getMemoryStore(): AdminMemoryStore {
  const globalStore = globalThis as GlobalWithStore;
  if (!globalStore.__pdfKiraAdminStore) {
    // Serverless deployments do not have durable disk storage across cold starts or
    // multiple instances, so this fallback is intentionally in-memory only.
    // Revisit this before analytics become a critical production dependency.
    globalStore.__pdfKiraAdminStore = {
      sessions: new Map(),
      loginAttempts: new Map(),
      analyticsEvents: [],
    };
  }
  return globalStore.__pdfKiraAdminStore;
}

export function getDb() {
  return getMemoryStore();
}

export function createAdminSession(username: string, ipAddress: string, userAgent: string) {
  const token = randomBytes(24).toString("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  const session: AdminSession = { token, username, createdAt, expiresAt, ipAddress, userAgent };
  getMemoryStore().sessions.set(token, session);
  return { token, expiresAt };
}

export function getAdminSession(token: string): AdminSession | null {
  const session = getMemoryStore().sessions.get(token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    deleteAdminSession(token);
    return null;
  }
  return session;
}

export function deleteAdminSession(token: string) {
  getMemoryStore().sessions.delete(token);
}

export function registerLoginAttempt(ipAddress: string) {
  const store = getMemoryStore();
  const now = new Date().toISOString();
  const existing = store.loginAttempts.get(ipAddress);
  if (!existing) {
    store.loginAttempts.set(ipAddress, { attempts: 1, firstAttemptAt: now, lastAttemptAt: now });
    return { attempts: 1, blocked: false };
  }
  const attempts = Number(existing.attempts) + 1;
  store.loginAttempts.set(ipAddress, { ...existing, attempts, lastAttemptAt: now });
  return { attempts, blocked: attempts >= 8 };
}

export function resetLoginAttempts(ipAddress: string) {
  getMemoryStore().loginAttempts.delete(ipAddress);
}

export function isLoginBlocked(ipAddress: string) {
  const store = getMemoryStore();
  const row = store.loginAttempts.get(ipAddress);
  if (!row) return false;
  const lastAttemptAt = new Date(row.lastAttemptAt).getTime();
  const windowMs = 15 * 60 * 1000;
  if (Date.now() - lastAttemptAt > windowMs) {
    store.loginAttempts.delete(ipAddress);
    return false;
  }
  return Number(row.attempts) >= 8;
}

export function recordAnalyticsEvent(event: AnalyticsEventInput) {
  const record: AnalyticsEventRecord = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: new Date().toISOString(),
    type: event.type,
    path: event.path,
    method: event.method,
    tool: event.tool ?? null,
    statusCode: event.statusCode ?? null,
    responseTimeMs: event.responseTimeMs ?? null,
    ipAddress: event.ipAddress ?? null,
    country: event.country ?? null,
    userAgent: event.userAgent ?? null,
    referrer: event.referrer ?? null,
    success: event.success ? 1 : 0,
    fileSize: event.fileSize ?? null,
  };
  getMemoryStore().analyticsEvents.push(record);
}

function getAnalyticsEvents() {
  return getMemoryStore().analyticsEvents;
}

export function getOverviewStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const last7DaysStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const last15Minutes = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const events = getAnalyticsEvents();

  const visitorsAllTime = new Set(events.filter((event) => event.ipAddress).map((event) => event.ipAddress!)).size;
  const visitorsToday = new Set(events.filter((event) => event.ipAddress && event.ts >= todayStart).map((event) => event.ipAddress!)).size;
  const visitorsYesterday = new Set(events.filter((event) => event.ipAddress && event.ts >= yesterdayStart && event.ts < todayStart).map((event) => event.ipAddress!)).size;
  const visitorsLast7Days = new Set(events.filter((event) => event.ipAddress && event.ts >= last7DaysStart).map((event) => event.ipAddress!)).size;
  const visitorsLast30Days = new Set(events.filter((event) => event.ipAddress && event.ts >= last30DaysStart).map((event) => event.ipAddress!)).size;
  const activeUsers = new Set(events.filter((event) => event.ipAddress && event.ts >= last15Minutes).map((event) => event.ipAddress!)).size;

  const toolUsesCount = events.filter((event) => event.type === "tool_use").length;
  const successfulConversionsCount = events.filter((event) => event.type === "tool_use" && event.success === 1).length;
  const failedConversionsCount = events.filter((event) => event.type === "tool_use" && event.success === 0).length;
  const responseTimes = events.filter((event) => event.responseTimeMs != null).map((event) => Number(event.responseTimeMs));
  const averageProcessingTime = responseTimes.length > 0 ? responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length : 0;
  const totalOcrRequests = events.filter((event) => event.tool === "OCR Image to Text").length;
  const totalPdfRequests = events.filter((event) => {
    const tool = event.tool;
    return tool && ["Merge PDF", "Split PDF", "Compress PDF", "Protect PDF", "Unlock PDF", "Organize PDF", "Delete Pages", "Extract Pages", "PDF to Word", "Word to PDF", "JPG to PDF", "PDF to JPG"].includes(tool);
  }).length;
  const successRate = toolUsesCount > 0 ? Math.round((successfulConversionsCount / toolUsesCount) * 1000) / 10 : 0;

  const system = getSystemStats();

  return {
    totalVisitors: visitorsAllTime,
    visitorsToday,
    visitorsYesterday,
    visitorsLast7Days,
    visitorsLast30Days,
    visitorsAllTime,
    totalToolUses: toolUsesCount,
    totalSuccessfulConversions: successfulConversionsCount,
    failedConversions: failedConversionsCount,
    successRate,
    averageProcessingTime,
    totalOcrRequests,
    totalPdfRequests,
    activeUsers,
    serverUptime: system.serverUptime,
    memoryUsage: system.memoryUsage,
    cpuUsage: system.cpuUsage,
    diskUsage: system.diskUsage,
    nodeVersion: process.version,
  };
}

export function getToolStats() {
  const events = getAnalyticsEvents();
  const rows = events.filter((event) => event.type === "tool_use" && event.tool).reduce<Record<string, number>>((accumulator, event) => {
    const tool = event.tool as string;
    accumulator[tool] = (accumulator[tool] || 0) + 1;
    return accumulator;
  }, {});
  const total = Object.values(rows).reduce((sum, count) => sum + count, 0);
  return Object.entries(rows)
    .map(([tool, count]) => ({
      name: tool,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((left, right) => right.count - left.count);
}

export function getAnalyticsSeries() {
  const events = getAnalyticsEvents();
  const grouped = new Map<string, { day: string; visitors: Set<string>; conversions: number; ocr: number; pdf: number }>();

  for (const event of events) {
    const day = event.ts.slice(0, 10);
    const entry = grouped.get(day) || { day, visitors: new Set<string>(), conversions: 0, ocr: 0, pdf: 0 };
    if (event.ipAddress) entry.visitors.add(event.ipAddress);
    if (event.type === "tool_use" && event.success === 1) entry.conversions += 1;
    if (event.tool === "OCR Image to Text") entry.ocr += 1;
    if (event.tool && ["Merge PDF", "Split PDF", "Compress PDF", "Protect PDF", "Unlock PDF", "Organize PDF", "Delete Pages", "Extract Pages", "PDF to Word", "Word to PDF", "JPG to PDF", "PDF to JPG"].includes(event.tool)) entry.pdf += 1;
    grouped.set(day, entry);
  }

  return Array.from(grouped.values())
    .sort((left, right) => left.day.localeCompare(right.day))
    .map((row) => ({
      day: row.day,
      visitors: row.visitors.size,
      conversions: row.conversions,
      ocr: row.ocr,
      pdf: row.pdf,
    }));
}

export function getVisitorBreakdowns() {
  const events = getAnalyticsEvents();
  const countries = new Map<string, number>();
  const browsers = new Map<string, number>();
  for (const event of events) {
    if (event.country) {
      countries.set(event.country, (countries.get(event.country) || 0) + 1);
    }
    const browser = detectBrowser(event.userAgent || "");
    browsers.set(browser, (browsers.get(browser) || 0) + 1);
  }
  return {
    countries: Array.from(countries.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([name, count]) => ({ name, count })),
    browsers: Array.from(browsers.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([name, count]) => ({ name, count })),
    os: Array.from(browsers.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([name, count]) => ({ name: detectOs(name), count })),
    devices: Array.from(browsers.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([name, count]) => ({ name: detectDevice(name), count })),
  };
}

export function getLogs(limit = 100, offset = 0, filters: { status?: string; tool?: string; search?: string } = {}) {
  const events = getAnalyticsEvents().filter((event) => {
    if (filters.status && event.statusCode !== Number(filters.status)) return false;
    if (filters.tool && event.tool !== filters.tool) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return [event.path, event.tool || "", event.country || ""].some((field) => field.toLowerCase().includes(search));
    }
    return true;
  });

  return events
    .sort((left, right) => right.ts.localeCompare(left.ts))
    .slice(offset, offset + limit)
    .map((event) => ({
      time: event.ts,
      ipAddress: event.ipAddress,
      country: event.country || "Unknown",
      requestedTool: event.tool || "N/A",
      statusCode: event.statusCode,
      processingTime: toNumber(event.responseTimeMs),
      fileSize: toNumber(event.fileSize),
      success: Boolean(event.success),
    }));
}

export function getErrors() {
  const events = getAnalyticsEvents();
  const recentErrors = events.filter((event) => event.success === 0).sort((left, right) => right.ts.localeCompare(left.ts)).slice(0, 10).map((event) => ({
    ts: event.ts,
    path: event.path,
    tool: event.tool,
    statusCode: event.statusCode,
    ipAddress: event.ipAddress,
  }));
  const mostCommon = new Map<string, number>();
  for (const event of events.filter((item) => item.success === 0)) {
    mostCommon.set(event.path, (mostCommon.get(event.path) || 0) + 1);
  }
  return {
    totalErrors: events.filter((event) => event.success === 0).length,
    recentErrors,
    mostCommonErrors: Array.from(mostCommon.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([path, count]) => ({ path, count })),
    ocrFailures: events.filter((event) => event.tool === "OCR Image to Text" && event.success === 0).length,
    conversionFailures: events.filter((event) => event.type === "tool_use" && event.success === 0).length,
    http500s: events.filter((event) => Number(event.statusCode) >= 500).length,
    http404s: events.filter((event) => Number(event.statusCode) === 404).length,
  };
}

export function getPerformance() {
  const events = getAnalyticsEvents();
  const responseTimes = events.filter((event) => event.responseTimeMs != null).map((event) => Number(event.responseTimeMs));
  const slowest = new Map<string, number[]>();
  for (const event of events.filter((item) => item.responseTimeMs != null)) {
    const values = slowest.get(event.path) || [];
    values.push(Number(event.responseTimeMs));
    slowest.set(event.path, values);
  }
  const system = getSystemStats();
  return {
    averageApiResponseTime: responseTimes.length > 0 ? responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length : 0,
    slowestApis: Array.from(slowest.entries())
      .map(([path, values]) => ({ path, avgMs: values.reduce((sum, value) => sum + value, 0) / values.length }))
      .sort((left, right) => right.avgMs - left.avgMs)
      .slice(0, 10),
    memoryUsage: system.memoryUsage,
    cpuUsage: system.cpuUsage,
    diskUsage: system.diskUsage,
    serverUptime: system.serverUptime,
    nodeVersion: process.version,
  };
}

export function getSearchAnalytics() {
  const events = getAnalyticsEvents();
  const searches = new Map<string, number>();
  const pages = new Map<string, number>();
  const downloads = new Map<string, number>();
  for (const event of events) {
    if (event.type === "tool_use" && event.tool) {
      searches.set(event.tool, (searches.get(event.tool) || 0) + 1);
    }
    if (event.type === "page_view") {
      pages.set(event.path, (pages.get(event.path) || 0) + 1);
    }
    if (event.path.includes("download")) {
      downloads.set(event.path, (downloads.get(event.path) || 0) + 1);
    }
  }
  return {
    mostSearchedTools: Array.from(searches.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([name, count]) => ({ name, count })),
    mostVisitedPages: Array.from(pages.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([path, count]) => ({ path, count })),
    mostDownloadedOutputs: Array.from(downloads.entries()).sort((left, right) => right[1] - left[1]).slice(0, 10).map(([path, count]) => ({ path, count })),
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
