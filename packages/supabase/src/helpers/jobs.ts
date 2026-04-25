import {
  jobCreateSchema,
  mapJobDetailRecord,
  mapJobRecord,
  type JobCreateInput,
  type JobDetailDto,
  type JobSummaryDto
} from "@taskora/core";
import type { Database } from "../types/database.js";
import type { JobRow, TableInsert } from "../types/index.js";
import { ensureData, resolveViewerId, type TaskoraSupabaseClient } from "./common.js";
import { getJobClassification } from "./job-classifications.js";
import { getLatestPaymentForJob } from "./payments.js";

export async function createJobForCustomer(
  client: TaskoraSupabaseClient,
  input: JobCreateInput,
  viewerId?: string
): Promise<JobSummaryDto> {
  const parsed = jobCreateSchema.parse(input);
  const customerId = await resolveViewerId(client, viewerId);

  const payload: TableInsert<"jobs"> = {
    customer_id: customerId,
    selected_workforce_id: parsed.preferredWorkforceId ?? null,
    title: parsed.title,
    description: parsed.description,
    requested_budget_amount: parsed.budget.amount,
    currency: parsed.budget.currency,
    status: "draft"
  };

  const response = await client.from<JobRow>("jobs").insert(payload).select("*").single();
  const row = ensureData(response.data as JobRow | null, response.error, "Job creation failed.");

  return mapJobRecord(row);
}

export async function listJobsForCustomer(
  client: TaskoraSupabaseClient,
  viewerId?: string
): Promise<JobSummaryDto[]> {
  const customerId = await resolveViewerId(client, viewerId);
  const response = await client
    .from<JobRow>("jobs")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const rows = ensureData((response.data ?? []) as JobRow[], response.error, "Jobs not found.");
  return rows.map((row) => mapJobRecord(row));
}

export async function getJobForCustomer(
  client: TaskoraSupabaseClient,
  jobId: string,
  viewerId?: string
): Promise<JobSummaryDto> {
  const customerId = await resolveViewerId(client, viewerId);
  const response = await client
    .from<JobRow>("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("customer_id", customerId)
    .single();
  const row = ensureData(response.data as JobRow | null, response.error, "Job not found.");

  return mapJobRecord(row);
}

export async function selectWorkforceForJob(
  client: TaskoraSupabaseClient,
  input: { jobId: string; workforceId: string },
  viewerId?: string
): Promise<JobSummaryDto> {
  const customerId = await resolveViewerId(client, viewerId);
  const response = await client
    .from<JobRow>("jobs")
    .update({
      selected_workforce_id: input.workforceId,
      status: "matched",
      updated_at: new Date().toISOString()
    })
    .eq("id", input.jobId)
    .eq("customer_id", customerId)
    .select("*")
    .single();
  const row = ensureData(response.data as JobRow | null, response.error, "Job update failed.");

  return mapJobRecord(row);
}

export async function updateJobStatus(
  client: TaskoraSupabaseClient,
  input: { jobId: string; status: Database["public"]["Enums"]["job_status"] },
  viewerId?: string
): Promise<JobSummaryDto> {
  const customerId = await resolveViewerId(client, viewerId);
  const response = await client
    .from<JobRow>("jobs")
    .update({
      status: input.status,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.jobId)
    .eq("customer_id", customerId)
    .select("*")
    .single();
  const row = ensureData(response.data as JobRow | null, response.error, "Job status update failed.");

  return mapJobRecord(row);
}

export async function getJobDetailForCustomer(
  client: TaskoraSupabaseClient,
  jobId: string,
  viewerId?: string
): Promise<JobDetailDto> {
  const job = await getJobForCustomer(client, jobId, viewerId);
  const classification = await getJobClassification(client, job.id);
  const payment = await getLatestPaymentForJob(client, job.id);

  return mapJobDetailRecord(job, {
    ...(classification ? { classification } : {}),
    ...(payment ? { payment } : {})
  });
}
