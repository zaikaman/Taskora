import { mapProfileRecord, profileSchema, type ProfileDto } from "@taskora/core";
import type { ProfileRow, TableInsert } from "../types/index.js";
import { ensureData, resolveViewerId, type TaskoraSupabaseClient } from "./common.js";

export interface UpsertProfileInput {
  displayName?: string | null;
  avatarUrl?: string | null;
  defaultRoleMode?: "customer" | "developer" | "both";
}

export async function getAuthenticatedProfile(
  client: TaskoraSupabaseClient,
  viewerId?: string
): Promise<ProfileDto> {
  const resolvedViewerId = await resolveViewerId(client, viewerId);
  const response = await client
    .from<ProfileRow>("profiles")
    .select("*")
    .eq("id", resolvedViewerId)
    .single();
  const row = ensureData(response.data as ProfileRow | null, response.error, "Profile not found.");

  return mapProfileRecord(row);
}

export async function upsertProfile(
  client: TaskoraSupabaseClient,
  input: UpsertProfileInput,
  viewerId?: string
): Promise<ProfileDto> {
  const resolvedViewerId = await resolveViewerId(client, viewerId);
  const payload: TableInsert<"profiles"> = {
    id: resolvedViewerId,
    display_name: input.displayName ?? null,
    avatar_url: input.avatarUrl ?? null,
    default_role_mode: input.defaultRoleMode ?? "customer"
  };

  const response = await client
    .from<ProfileRow>("profiles")
    .upsert(payload)
    .select("*")
    .single();
  const row = ensureData(response.data as ProfileRow | null, response.error, "Profile upsert failed.");

  return mapProfileRecord(row);
}

export function validateProfileInput(input: unknown): UpsertProfileInput {
  const parsed = profileSchema
    .omit({ id: true, createdAt: true, updatedAt: true })
    .partial()
    .parse(input);

  const output: UpsertProfileInput = {};

  if (parsed.displayName !== undefined) {
    output.displayName = parsed.displayName;
  }

  if (parsed.avatarUrl !== undefined) {
    output.avatarUrl = parsed.avatarUrl;
  }

  if (parsed.defaultRoleMode !== undefined) {
    output.defaultRoleMode = parsed.defaultRoleMode;
  }

  return output;
}
