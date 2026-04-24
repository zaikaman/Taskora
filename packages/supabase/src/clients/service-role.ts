import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertServerOnly, parseServerEnv, requireServerSecret } from "@taskora/core";
import type { Database } from "../types/database.js";

export interface ServiceRoleSupabaseClientOptions {
  supabaseUrl?: string;
  serviceRoleKey?: string;
}

export function createTaskoraServiceRoleClient(
  options: ServiceRoleSupabaseClientOptions = {}
): SupabaseClient<Database> {
  assertServerOnly("SUPABASE_SERVICE_ROLE_KEY");

  const env = parseServerEnv({
    NEXT_PUBLIC_SUPABASE_URL: options.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
    TASKORA_RUNTIME_URL: process.env.TASKORA_RUNTIME_URL,
    TASKORA_RUNTIME_SHARED_SECRET: process.env.TASKORA_RUNTIME_SHARED_SECRET,
    OG_MODE: process.env.OG_MODE,
    OG_STORAGE_RPC_URL: process.env.OG_STORAGE_RPC_URL,
    OG_STORAGE_INDEXER_URL: process.env.OG_STORAGE_INDEXER_URL,
    OG_PRIVATE_KEY: process.env.OG_PRIVATE_KEY,
    GENSYN_MODE: process.env.GENSYN_MODE,
    GENSYN_NETWORK: process.env.GENSYN_NETWORK,
    GENSYN_NODE_URL: process.env.GENSYN_NODE_URL,
    GENSYN_COORDINATOR_URL: process.env.GENSYN_COORDINATOR_URL,
    GENSYN_API_KEY: process.env.GENSYN_API_KEY,
    KEEPERHUB_MODE: process.env.KEEPERHUB_MODE,
    KEEPERHUB_API_BASE_URL: process.env.KEEPERHUB_API_BASE_URL,
    KEEPERHUB_API_KEY: process.env.KEEPERHUB_API_KEY,
    KEEPERHUB_PROJECT_ID: process.env.KEEPERHUB_PROJECT_ID,
    PAYMENT_NETWORK: process.env.PAYMENT_NETWORK
  });

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireServerSecret(env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
