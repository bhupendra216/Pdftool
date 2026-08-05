import type { AdminSession } from "../lib/admin-store";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminSession;
      fileValidationError?: string;
    }
  }
}

export {};
