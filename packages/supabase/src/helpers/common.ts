import { AppError } from "@taskora/core";
import type { User } from "@supabase/supabase-js";

export interface QueryError {
  message: string;
}

export interface QueryResult<T> {
  data: T | null;
  error: QueryError | null;
}

export interface UntypedQueryBuilder<T> extends PromiseLike<QueryResult<T | T[]>> {
  select(columns?: string): this;
  insert(values: unknown): this;
  update(values: unknown): this;
  upsert(values: unknown): this;
  eq(column: string, value: unknown): this;
  order(column: string, options?: { ascending?: boolean }): this;
  single(): UntypedQueryBuilder<T>;
}

export interface TaskoraSupabaseClient {
  auth: {
    getUser(): Promise<{ data: { user: User | null }; error: QueryError | null }>;
  };
  from<T extends Record<string, unknown>>(tableName: string): UntypedQueryBuilder<T>;
}

export async function resolveViewerId(
  client: TaskoraSupabaseClient,
  viewerId?: string
): Promise<string> {
  if (viewerId) {
    return viewerId;
  }

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw new AppError("auth_failed", error.message, { statusCode: 401, cause: error });
  }

  const user = data.user;

  if (!user) {
    throw new AppError("unauthenticated", "Authentication is required.", { statusCode: 401 });
  }

  return user.id;
}

export function assertUserMatches(user: User | null, expectedUserId: string): void {
  if (!user || user.id !== expectedUserId) {
    throw new AppError("forbidden", "Authenticated user does not match the requested resource.", {
      statusCode: 403
    });
  }
}

export function ensureData<T>(data: T | null, error: { message: string } | null, message: string): T {
  if (error) {
    throw new AppError("supabase_error", error.message, { statusCode: 500, cause: error });
  }

  if (data === null) {
    throw new AppError("not_found", message, { statusCode: 404 });
  }

  return data;
}
