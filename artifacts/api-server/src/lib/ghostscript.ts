import { runSafeCommand, SafeCommandError } from "./safe-command";

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
  let result: GhostscriptResult;
  try {
    result = await runSafeCommand("gs", args, { timeoutMs, expectedOutputPath });
  } catch (error) {
    if (!(error instanceof SafeCommandError)) throw new GhostscriptError("exit");
    const reason = error.passwordDiagnostic
      ? "password"
      : error.reason === "timeout"
        ? "timeout"
        : error.reason === "output"
          ? "output"
          : "exit";
    throw new GhostscriptError(reason, error.exitCode);
  }

  if (/password/i.test(result.stderr)) {
    throw new GhostscriptError("password", 0);
  }
  if (/\bunrecoverable error\b|\berror\b/i.test(result.stderr)) {
    throw new GhostscriptError("diagnostic", 0);
  }

  return result;
}
