import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getClientIp } from "./lib/admin-auth";
import { recordAnalyticsEvent } from "./lib/admin-store";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const startedAt = Date.now();
  const path = req.originalUrl.split("?")[0];
  const toolName = inferToolName(path);
  const isApiRequest = path.startsWith("/api");
  const ipAddress = getClientIp(req);
  const userAgent = req.get("user-agent") || undefined;
  const referrer = req.get("referer") || undefined;
  const country = req.get("x-forwarded-country") || req.get("cf-ipcountry") || undefined;
  let completed = false;

  const finalize = () => {
    if (completed) return;
    completed = true;
    const statusCode = res.statusCode || 500;
    const success = statusCode < 400;
    recordAnalyticsEvent({
      type: toolName ? "tool_use" : isApiRequest ? "api_request" : "page_view",
      path,
      method: req.method,
      tool: toolName,
      statusCode,
      responseTimeMs: Date.now() - startedAt,
      ipAddress,
      country,
      userAgent,
      referrer,
      success,
      fileSize: typeof req.headers["content-length"] === "string" ? Number(req.headers["content-length"]) : undefined,
    });
  };

  res.once("finish", finalize);
  res.once("close", finalize);
  next();
});

app.use("/api", router);

function inferToolName(path: string) {
  const mapping: Record<string, string> = {
    "/api/merge-pdf": "Merge PDF",
    "/api/split-pdf": "Split PDF",
    "/api/compress-pdf": "Compress PDF",
    "/api/convert-pdf-to-word": "PDF to Word",
    "/api/convert-word-to-pdf": "Word to PDF",
    "/api/convert-jpg-to-pdf": "JPG to PDF",
    "/api/convert-pdf-to-jpg": "PDF to JPG",
    "/api/convert-image": "Image Converter",
    "/api/image-resize": "Image Resizer",
    "/api/image-compress": "Image Compressor",
    "/api/image-upscale": "Image Upscaler",
    "/api/ocr-image-to-text": "OCR Image to Text",
    "/api/protect-pdf": "Protect PDF",
    "/api/unlock-pdf": "Unlock PDF",
    "/api/watermark-pdf": "Watermark PDF",
    "/api/add-page-numbers": "Add Page Numbers",
    "/api/organize-pdf": "Organize PDF",
    "/api/delete-pages": "Delete Pages",
    "/api/extract-pages": "Extract Pages",
  };
  return mapping[path] || null;
}

export default app;
