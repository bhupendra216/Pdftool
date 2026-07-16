import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../../api-server/src/app";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
