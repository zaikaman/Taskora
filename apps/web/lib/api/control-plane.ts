import { classifyJob, jobCreateSchema, type JobDetailDto } from "@taskora/core";
import {
  authorizePaymentForJob,
  createJobForCustomer,
  getJobDetailForCustomer,
  getPaymentById,
  listJobsForCustomer,
  listRankedWorkforceMatches,
  updateJobStatus,
  upsertJobClassification,
  type TaskoraSupabaseClient
} from "@taskora/supabase";
import { requireUuid } from "../../app/api/_shared";

interface ApiResult<T> {
  body: T;
  status: number;
}

export async function createJobApiResponse(
  client: TaskoraSupabaseClient,
  payload: unknown
): Promise<ApiResult<JobDetailDto>> {
  const parsed = jobCreateSchema.parse(normalizeJobCreatePayload(payload));
  const job = await createJobForCustomer(client, parsed);
  const classification = await upsertJobClassification(
    client,
    classifyJob({
      ...parsed,
      jobId: job.id
    })
  );
  const matches = await listRankedWorkforceMatches(client, classification);

  await updateJobStatus(client, {
    jobId: job.id,
    status: matches.length > 0 ? "matched" : "classified"
  });

  const detail = await getJobDetailForCustomer(client, job.id);

  return {
    body: {
      ...detail,
      matches
    },
    status: 201
  };
}

export async function listJobsApiResponse(
  client: TaskoraSupabaseClient
): Promise<ApiResult<{ items: Awaited<ReturnType<typeof listJobsForCustomer>> }>> {
  return {
    body: {
      items: await listJobsForCustomer(client)
    },
    status: 200
  };
}

export async function getJobApiResponse(client: TaskoraSupabaseClient, jobId: string) {
  return {
    body: await getJobDetailForCustomer(client, requireUuid(jobId, "jobId")),
    status: 200
  };
}

export async function authorizePaymentApiResponse(client: TaskoraSupabaseClient, payload: unknown) {
  return {
    body: await authorizePaymentForJob(client, payload),
    status: 200
  };
}

export async function getPaymentApiResponse(client: TaskoraSupabaseClient, paymentId: string) {
  return {
    body: await getPaymentById(client, requireUuid(paymentId, "paymentId")),
    status: 200
  };
}

function normalizeJobCreatePayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.title === "string" && record.title.trim().length > 0) {
    return record;
  }

  if (typeof record.description !== "string") {
    return record;
  }

  return {
    ...record,
    title: record.description.split(/[.!?]/)[0]?.slice(0, 80) ?? "Untitled job"
  };
}
