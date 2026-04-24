import { z } from "zod";

const runtimeModeSchema = z.enum(["mock", "live"]).default("mock");

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  TASKORA_RUNTIME_URL: z.string().url()
});

export const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_DB_URL: z.string().min(1),
  TASKORA_RUNTIME_SHARED_SECRET: z.string().min(1),
  OG_MODE: runtimeModeSchema,
  OG_STORAGE_RPC_URL: z.string().url().optional(),
  OG_STORAGE_INDEXER_URL: z.string().url().optional(),
  OG_PRIVATE_KEY: z.string().min(1).optional(),
  GENSYN_MODE: runtimeModeSchema,
  GENSYN_NETWORK: z.string().default("testnet"),
  GENSYN_NODE_URL: z.string().url().optional(),
  GENSYN_COORDINATOR_URL: z.string().url().optional(),
  GENSYN_API_KEY: z.string().min(1).optional(),
  KEEPERHUB_MODE: runtimeModeSchema,
  KEEPERHUB_API_BASE_URL: z.string().url().optional(),
  KEEPERHUB_API_KEY: z.string().min(1).optional(),
  KEEPERHUB_PROJECT_ID: z.string().min(1).optional(),
  PAYMENT_NETWORK: z.string().default("testnet")
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  return publicEnvSchema.parse(source);
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  return serverEnvSchema.parse(source);
}

export function requireServerSecret(
  secret: string | undefined,
  secretName: string
): string {
  if (secret === undefined || secret.length === 0) {
    throw new Error(`Missing required server secret: ${secretName}`);
  }

  return secret;
}

export function assertServerOnly(secretName: string): void {
  if (typeof globalThis !== "undefined" && "window" in globalThis) {
    throw new Error(`${secretName} is server-only and cannot be accessed in the browser.`);
  }
}
