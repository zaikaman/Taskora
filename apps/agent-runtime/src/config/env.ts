import { parseServerEnv, requireServerSecret } from "@taskora/core";

export function parseRuntimeEnv(source: Record<string, string | undefined> = process.env) {
  const env = parseServerEnv(source);

  return {
    ...env,
    TASKORA_RUNTIME_SHARED_SECRET: requireServerSecret(
      env.TASKORA_RUNTIME_SHARED_SECRET,
      "TASKORA_RUNTIME_SHARED_SECRET"
    )
  };
}

export type RuntimeEnv = ReturnType<typeof parseRuntimeEnv>;
