import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";

export type SafeCommandFailureReason = "timeout" | "exit" | "spawn" | "output";

export class SafeCommandError extends Error {
  constructor(
    readonly reason: SafeCommandFailureReason,
    readonly exitCode?: number | null,
    readonly passwordDiagnostic = false,
  ) {
    super(
      reason === "timeout"
        ? "PDF processing timed out."
        : reason === "output"
          ? "PDF processing did not produce a valid output file."
          : reason === "spawn"
            ? "Required PDF processing software is unavailable."
            : "PDF processing failed.",
    );
    this.name = "SafeCommandError";
  }
}

export type SafeCommandResult = {
  stdout: string;
  stderr: string;
};

export type SafeCommandOptions = {
  timeoutMs?: number;
  expectedOutputPath?: string;
};

export async function runSafeCommand(
  command: string,
  args: string[],
  { timeoutMs = 120_000, expectedOutputPath }: SafeCommandOptions = {},
): Promise<SafeCommandResult> {
  const { stdout, stderr } = await new Promise<SafeCommandResult>((resolve, reject) => {
    execFile(
      command,
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
          const reason = error.killed || error.code === "ETIMEDOUT"
            ? "timeout"
            : error.code === "ENOENT"
              ? "spawn"
              : "exit";
          reject(new SafeCommandError(
            reason,
            typeof error.code === "number" ? error.code : null,
            /password/i.test(stderrText),
          ));
          return;
        }
        resolve({ stdout: stdoutText, stderr: stderrText });
      },
    );
  });

  if (expectedOutputPath) {
    try {
      const outputStats = await stat(expectedOutputPath);
      if (!outputStats.isFile() || outputStats.size < 100) {
        throw new SafeCommandError("output");
      }
    } catch (error) {
      if (error instanceof SafeCommandError) throw error;
      throw new SafeCommandError("output");
    }
  }

  return { stdout, stderr };
}
