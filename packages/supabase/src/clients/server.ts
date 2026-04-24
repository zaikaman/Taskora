import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { parsePublicEnv } from "@taskora/core";
import type { Database } from "../types/database.js";

export interface ServerSupabaseClientOptions {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  cookies: CookieMethodsServer;
}

export function createTaskoraServerClient(options: ServerSupabaseClientOptions) {
  const env = parsePublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: options.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      options.supabaseAnonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    TASKORA_RUNTIME_URL: process.env.TASKORA_RUNTIME_URL ?? "http://localhost:4001"
  });

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: options.cookies
  });
}
