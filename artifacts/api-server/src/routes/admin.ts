import { Router } from "express";
import { loginAdmin, logoutAdmin, requireAdmin } from "../lib/admin-auth";
import { getAnalyticsSeries, getErrors, getLogs, getOverviewStats, getPerformance, getSearchAnalytics, getToolStats, getVisitorBreakdowns, recordAnalyticsEvent } from "../lib/admin-store";

const router = Router();

router.post("/admin/login", (req, res) => loginAdmin(req, res));
router.post("/admin/logout", (req, res) => logoutAdmin(req, res));
router.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ ok: true, admin: req.admin });
});

router.get("/admin/dashboard", requireAdmin, (_req, res) => {
  const breakdowns = getVisitorBreakdowns();
  res.json({
    overview: getOverviewStats(),
    toolStats: getToolStats(),
    analytics: getAnalyticsSeries(),
    visitorBreakdowns: breakdowns,
  });
});

router.get("/admin/analytics", requireAdmin, (_req, res) => {
  const breakdowns = getVisitorBreakdowns();
  res.json({
    overview: getOverviewStats(),
    series: getAnalyticsSeries(),
    breakdowns,
  });
});

router.get("/admin/logs", requireAdmin, (req, res) => {
  const limit = Math.min(200, Math.max(20, Number(req.query.limit || 100)));
  const offset = Math.max(0, Number(req.query.offset || 0));
  const filters = {
    status: req.query.status ? String(req.query.status) : undefined,
    tool: req.query.tool ? String(req.query.tool) : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
  };
  res.json({ logs: getLogs(limit, offset, filters) });
});

router.get("/admin/performance", requireAdmin, (_req, res) => {
  res.json(getPerformance());
});

router.get("/admin/tools", requireAdmin, (_req, res) => {
  res.json({ tools: getToolStats() });
});

router.get("/admin/errors", requireAdmin, (_req, res) => {
  res.json(getErrors());
});

router.get("/admin/search", requireAdmin, (_req, res) => {
  res.json(getSearchAnalytics());
});

router.post("/admin/track", (req, res) => {
  const eventType = req.body?.type;
  const type = eventType === "page_view" || eventType === "api_request" || eventType === "tool_use"
    ? eventType
    : "api_request";

  const event = {
    type,
    path: req.body?.path || "/",
    method: req.body?.method || "GET",
    tool: req.body?.tool || null,
    statusCode: req.body?.statusCode || 200,
    responseTimeMs: req.body?.responseTimeMs || 0,
    ipAddress: req.body?.ipAddress || "unknown",
    country: req.body?.country || null,
    userAgent: req.body?.userAgent || null,
    referrer: req.body?.referrer || null,
    success: req.body?.success !== false,
    fileSize: req.body?.fileSize || null,
  };
  recordAnalyticsEvent(event);
  res.json({ ok: true });
});

export default router;
