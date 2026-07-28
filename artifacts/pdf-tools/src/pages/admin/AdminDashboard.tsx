import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand/BrandMark";

type Overview = {
  totalVisitors: number;
  visitorsToday: number;
  visitorsYesterday: number;
  visitorsLast7Days: number;
  visitorsLast30Days: number;
  visitorsAllTime: number;
  totalToolUses: number;
  totalSuccessfulConversions: number;
  failedConversions: number;
  successRate: number;
  averageProcessingTime: number;
  totalOcrRequests: number;
  totalPdfRequests: number;
  activeUsers: number;
  serverUptime: string;
  memoryUsage: { usedMb: number; totalMb: number; percent: number };
  cpuUsage: { percent: number };
  diskUsage: { usedPercent: number; usedGb: number; totalGb: number };
  nodeVersion: string;
};

type ToolStat = { name: string; count: number; percentage: number };
type SeriesPoint = { day: string; visitors: number; conversions: number; ocr: number; pdf: number };
type LogEntry = { time: string; ipAddress: string; country: string; requestedTool: string; statusCode: number; processingTime: number; fileSize: number; success: boolean };

type ErrorSummary = {
  totalErrors: number;
  recentErrors: Array<{ ts: string; path: string; tool: string; statusCode: number; ipAddress: string }>;
  mostCommonErrors: Array<{ path: string; count: number }>;
  ocrFailures: number;
  conversionFailures: number;
  http500s: number;
  http404s: number;
};

type PerformanceSummary = {
  averageApiResponseTime: number;
  slowestApis: Array<{ path: string; avgMs: number }>;
  memoryUsage: { usedMb: number; totalMb: number; percent: number };
  cpuUsage: { percent: number };
  diskUsage: { usedPercent: number; usedGb: number; totalGb: number };
  serverUptime: string;
  nodeVersion: string;
};

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [tools, setTools] = useState<ToolStat[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errors, setErrors] = useState<ErrorSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard", { credentials: "include" });
      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/admin/login");
          return;
        }
        throw new Error("Unable to load dashboard");
      }
      const payload = await response.json();
      setOverview(payload.overview);
      setTools(payload.toolStats || []);
      setSeries(payload.analytics || []);
      const logsResponse = await fetch("/api/admin/logs?limit=20", { credentials: "include" });
      if (logsResponse.ok) {
        const logsPayload = await logsResponse.json();
        setLogs(logsPayload.logs || []);
      }
      const errorsResponse = await fetch("/api/admin/errors", { credentials: "include" });
      if (errorsResponse.ok) {
        setErrors(await errorsResponse.json());
      }
      const performanceResponse = await fetch("/api/admin/performance", { credentials: "include" });
      if (performanceResponse.ok) {
        setPerformance(await performanceResponse.json());
      }
      setLoading(false);
    };

    void load();
  }, [setLocation]);

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase();
    return logs.filter((entry) => {
      return [entry.requestedTool, entry.ipAddress, entry.country, entry.statusCode.toString()].some((value) => value.toLowerCase().includes(query));
    });
  }, [logs, search]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setLocation("/admin/login");
  };

  const exportLogs = (format: "csv" | "excel" | "pdf") => {
    const rows = filteredLogs.map((entry) => [entry.time, entry.ipAddress, entry.country, entry.requestedTool, entry.statusCode, entry.processingTime, entry.fileSize, entry.success ? "Success" : "Failure"]);
    const header = ["Time", "IP Address", "Country", "Requested Tool", "Status Code", "Processing Time", "File Size", "Success"];
    const csv = [header.join(","), ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
    const data = format === "csv"
      ? csv
      : format === "excel"
      ? `<?xml version="1.0" encoding="UTF-8"?><ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><ss:Worksheet><ss:Table>${header.map((h) => `<ss:Row><ss:Cell><ss:Data ss:Type="String">${h}</ss:Data></ss:Cell></ss:Row>`).join("")}${rows.map((row) => `<ss:Row>${row.map((value) => `<ss:Cell><ss:Data ss:Type="String">${String(value)}</ss:Data></ss:Cell>`).join("")}</ss:Row>`).join("")}</ss:Table></ss:Worksheet></ss:Workbook>`
      : "";

    const blob = new Blob([data], { type: format === "csv" ? "text/csv;charset=utf-8" : "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `admin-logs.${format === "excel" ? "xls" : format}`;
    anchor.click();
    URL.revokeObjectURL(url);

    if (format === "pdf") {
      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write(`<html><body><h1>Admin Analytics Export</h1><pre>${csv}</pre></body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-6">
        <BrandMark className="justify-start" logoClassName="h-10" wordmarkClassName="text-lg" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-32 w-full" />)}</div>
      </div>
    );
  }

  const stats = [
    { title: "Total Visitors", value: overview?.totalVisitors ?? 0 },
    { title: "Visitors Today", value: overview?.visitorsToday ?? 0 },
    { title: "Visitors This Month", value: overview?.visitorsLast30Days ?? 0 },
    { title: "Total Tool Uses", value: overview?.totalToolUses ?? 0 },
    { title: "Total Successful Conversions", value: overview?.totalSuccessfulConversions ?? 0 },
    { title: "Failed Conversions", value: overview?.failedConversions ?? 0 },
    { title: "Success Rate", value: `${overview?.successRate ?? 0}%` },
    { title: "Average Processing Time", value: `${Math.round((overview?.averageProcessingTime ?? 0) * 10) / 10} ms` },
    { title: "Total OCR Requests", value: overview?.totalOcrRequests ?? 0 },
    { title: "Total PDF Requests", value: overview?.totalPdfRequests ?? 0 },
    { title: "Active Users (15m)", value: overview?.activeUsers ?? 0 },
    { title: "Server Uptime", value: overview?.serverUptime ?? "0m" },
    { title: "Memory Usage", value: `${overview?.memoryUsage.percent ?? 0}%` },
    { title: "CPU Usage", value: `${overview?.cpuUsage.percent ?? 0}%` },
    { title: "Disk Usage", value: `${overview?.diskUsage.usedPercent ?? 0}%` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/70 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Secure admin control center</p>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle Theme</Button>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => (
          <Card key={stat.title} className="border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}</div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Daily Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={series.map((point) => ({ label: point.day, value: point.visitors }))} />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Tool Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={tools.map((tool) => ({ label: tool.name, value: tool.count }))} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Conversion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={series.map((point) => ({ label: point.day, value: point.conversions }))} color="hsl(var(--chart-2))" />
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle>Usage Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-[220px] items-center justify-center">
                <DonutChart data={tools.slice(0, 5).map((tool) => ({ label: tool.name, value: tool.count }))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Request Logs</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Filter logs" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
              <Button variant="outline" onClick={() => exportLogs("csv")}>Export CSV</Button>
              <Button variant="outline" onClick={() => exportLogs("excel")}>Export Excel</Button>
              <Button variant="outline" onClick={() => exportLogs("pdf")}>Export PDF</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-2 py-3">Time</th>
                    <th className="px-2 py-3">IP</th>
                    <th className="px-2 py-3">Country</th>
                    <th className="px-2 py-3">Tool</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3">Time</th>
                    <th className="px-2 py-3">File</th>
                    <th className="px-2 py-3">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((entry) => (
                    <tr key={`${entry.time}-${entry.ipAddress}`} className="border-b border-border/60">
                      <td className="px-2 py-3">{new Date(entry.time).toLocaleString()}</td>
                      <td className="px-2 py-3">{entry.ipAddress}</td>
                      <td className="px-2 py-3">{entry.country}</td>
                      <td className="px-2 py-3">{entry.requestedTool}</td>
                      <td className="px-2 py-3">{entry.statusCode}</td>
                      <td className="px-2 py-3">{entry.processingTime}ms</td>
                      <td className="px-2 py-3">{entry.fileSize ? `${entry.fileSize}KB` : "—"}</td>
                      <td className="px-2 py-3"><Badge variant={entry.success ? "default" : "destructive"}>{entry.success ? "Success" : "Failure"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader><CardTitle>Error Monitor</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>Total Errors</span><strong>{errors?.totalErrors ?? 0}</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>OCR Failures</span><strong>{errors?.ocrFailures ?? 0}</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>500 Errors</span><strong>{errors?.http500s ?? 0}</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>404 Errors</span><strong>{errors?.http404s ?? 0}</strong></div>
            </CardContent>
          </Card>
          <Card className="border-border/70 shadow-sm">
            <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>Avg API Response</span><strong>{Math.round((performance?.averageApiResponseTime ?? 0) * 10) / 10}ms</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>Memory</span><strong>{performance?.memoryUsage.percent ?? 0}%</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>CPU</span><strong>{performance?.cpuUsage.percent ?? 0}%</strong></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3"><span>Uptime</span><strong>{performance?.serverUptime ?? "0m"}</strong></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LineChart({ data, color = "hsl(var(--chart-1))" }: { data: Array<{ label: string; value: number }>; color?: string }) {
  const width = 420;
  const height = 180;
  const max = Math.max(...data.map((point) => point.value), 1);
  const points = data.map((point, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * (width - 24) + 12;
    const y = height - (point.value / max) * (height - 24) - 12;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
      <path d={`M ${points.join(" L ")}`} fill="none" stroke={color} strokeWidth="3" />
      {points.map((point, index) => {
        const [x, y] = point.split(",").map(Number);
        return <circle key={`${data[index]?.label ?? index}-${x}`} cx={x} cy={y} r="4" fill={color} />;
      })}
    </svg>
  );
}

function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((point) => point.value), 1);
  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t-lg bg-primary/80" style={{ height: `${Math.max(20, (item.value / max) * 100)}%` }} />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-48 w-48">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="24" />
      {data.map((item) => {
        const length = total > 0 ? (item.value / total) * circumference : 0;
        const circle = <circle key={item.label} cx="60" cy="60" r={radius} fill="none" stroke={`hsl(var(--chart-${(data.indexOf(item) % 5) + 1}))`} strokeWidth="24" strokeDasharray={`${length} ${circumference}`} strokeDashoffset={-offset} strokeLinecap="round" transform="rotate(-90 60 60)" />;
        offset += length;
        return circle;
      })}
    </svg>
  );
}
