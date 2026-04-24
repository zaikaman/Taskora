import { mapWorkforceRecord, type WorkforceSummary, workforceSummarySchema } from "@taskora/core";
import type { Json } from "../types/database.js";
import type { TableInsert, WorkforceRow } from "../types/index.js";
import { ensureData, resolveViewerId, type TaskoraSupabaseClient } from "./common.js";

export interface CreateWorkforceInput {
  name: string;
  slug: string;
  category: string;
  description: string;
  deploymentMode: "self_hosted" | "taskora_hosted";
  executionBackend: "local_runtime" | "gensyn" | "self_hosted_endpoint" | "hybrid";
  pricingModel: Record<string, unknown>;
  reputationSummary?: Record<string, unknown>;
  availabilityStatus?: "draft" | "connected" | "available" | "paused" | "unavailable";
}

export async function createWorkforceForDeveloper(
  client: TaskoraSupabaseClient,
  input: CreateWorkforceInput,
  viewerId?: string
): Promise<WorkforceSummary> {
  const developerId = await resolveViewerId(client, viewerId);
  const payload: TableInsert<"workforces"> = {
    developer_id: developerId,
    name: input.name,
    slug: input.slug,
    category: input.category,
    description: input.description,
    deployment_mode: input.deploymentMode,
    execution_backend: input.executionBackend,
    availability_status: input.availabilityStatus ?? "draft",
    pricing_model: input.pricingModel as Json,
    reputation_summary: (input.reputationSummary ?? {}) as Json
  };

  const response = await client
    .from<WorkforceRow>("workforces")
    .insert(payload)
    .select("*")
    .single();
  const row = ensureData(response.data as WorkforceRow | null, response.error, "Workforce creation failed.");

  return mapWorkforceRecord(row);
}

export async function listAvailableWorkforces(
  client: TaskoraSupabaseClient,
  filters: {
    category?: string;
    deploymentMode?: "self_hosted" | "taskora_hosted";
  } = {}
): Promise<WorkforceSummary[]> {
  let query = client
    .from<WorkforceRow>("workforces")
    .select("*")
    .eq("availability_status", "available");

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.deploymentMode) {
    query = query.eq("deployment_mode", filters.deploymentMode);
  }

  const response = await query.order("updated_at", { ascending: false });
  const rows = ensureData((response.data ?? []) as WorkforceRow[], response.error, "Workforces not found.");

  return rows.map((row) => mapWorkforceRecord(row));
}

export async function getWorkforceById(
  client: TaskoraSupabaseClient,
  workforceId: string,
  viewerId?: string
): Promise<WorkforceSummary> {
  const viewer = viewerId ? await resolveViewerId(client, viewerId) : undefined;
  const response = await client
    .from<WorkforceRow>("workforces")
    .select("*")
    .eq("id", workforceId)
    .single();
  const row = ensureData(response.data as WorkforceRow | null, response.error, "Workforce not found.");

  if (row.availability_status !== "available" && row.developer_id !== viewer) {
    throw new Error("Workforce is not visible to this viewer.");
  }

  return workforceSummarySchema.parse(mapWorkforceRecord(row));
}
