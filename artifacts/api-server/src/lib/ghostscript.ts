import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";

export type GhostscriptFailureReason = "timeout" | "exit" | "password" | "diagnostic" | "output";

export class GhostscriptError extends Error {
  constructor(
    readonly reason: GhostscriptFailureReason,
    readonly exitCode?: number | null,
  ) {
    super(
      reason === "password"
        ? "Ghostscript could not open the password-protected PDF."
        : reason === "timeout"
          ? "Ghostscript processing timed out."
          : reason === "output"
            ? "Ghostscript did not produce a valid output file."
            : "Ghostscript processing failed.",
    );
    this.name = "GhostscriptError";
  }
}

export type GhostscriptOptions = {
  timeoutMs?: number;
  expectedOutputPath?: string;
};

export type GhostscriptResult = {
  stdout: string;
  stderr: string;
};

export async function runGhostscript(
  args: string[],
  { timeoutMs = 120_000, expectedOutputPath }: GhostscriptOptions = {},
): Promise<GhostscriptResult> {
  const { stdout, stderr } = await new Promise<GhostscriptResult>((resolve, reject) => {
    try {
      execFile(
        "gs",
        args,
        {
          timeout: timeoutMs,
          killSignal: "SIGKILL",
          maxBuffer: 10 * 1024 * 1024,
          encoding: "utf8",
        },
        (error, output, diagnostics) => {
          const stdoutText = String(output || "");
          const stderrText = String(diagnostics || "");
          if (error) {
            if (error.killed || error.code === "ETIMEDOUT") {
              reject(new GhostscriptError("timeout", typeof error.code === "number" ? error.code : null));
              return;
            }
            reject(
              new GhostscriptError(
                /password/i.test(stderrText) ? "password" : "exit",
                typeof error.code === "number" ? error.code : null,
              ),
            );
            return;
          }

          if (/password/i.test(stderrText)) {
            reject(new GhostscriptError("password", 0));
            return;
          }
          if (/unrecoverable error|\berror\b/i.test(stderrText)) {
            reject(new GhostscriptError("diagnostic", 0));
            return;
          }
          resolve({ stdout: stdoutText, stderr: stderrText });
        },
      );
    } catch {
      reject(new GhostscriptError("exit"));
    }
  });

  if (expectedOutputPath) {
    try {
      const outputStats = await stat(expectedOutputPath);
      if (!outputStats.isFile() || outputStats.size < 100) {
        throw new GhostscriptError("output");
      }
    } catch (error) {
      if (error instanceof GhostscriptError) throw error;
      throw new GhostscriptError("output");
    }
  }

  return { stdout, stderr };
}
