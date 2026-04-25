import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AppError, serializeError } from "@taskora/core";
import { createTaskoraServerClient, type TaskoraSupabaseClient } from "@taskora/supabase";

export async function createRouteSupabaseClient(): Promise<TaskoraSupabaseClient> {
  const cookieStore = await cookies();

  return createTaskoraServerClient({
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      }
    }
  }) as unknown as TaskoraSupabaseClient;
}

export function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json(body, { status });
}

export function errorResponse(error: unknown): NextResponse {
  const serialized = serializeError(error);
  return NextResponse.json(serialized, { status: serialized.statusCode });
}

export function requireUuid(value: string, resourceName: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return value;
  }

  throw new AppError("invalid_id", `${resourceName} must be a valid UUID.`, { statusCode: 400 });
}
