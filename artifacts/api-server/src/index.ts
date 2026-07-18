import { pathToFileURL } from "node:url";
import path from "node:path";
import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";

const envPath = path.resolve(process.cwd(), ".env");
if (process.env.NODE_ENV !== "test") {
  logger.info({ envPath }, "Loaded environment file");
}

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default app;

export function startServer() {
  logger.info(
    {
      NODE_ENV: process.env.NODE_ENV,
      PORT_ENV: process.env.PORT,
      RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN,
      cwd: process.cwd(),
    },
    "Startup information"
  );

  return app.listen(port, "0.0.0.0", (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info(
      {
        host: "0.0.0.0",
        port,
        envPort: process.env.PORT,
      },
      "Server listening"
    );
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}