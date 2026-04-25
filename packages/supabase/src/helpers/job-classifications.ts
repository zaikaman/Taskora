import {
  jobClassificationSchema,
  mapJobClassificationRecord,
  type JobClassification
} from "@taskora/core";
import type { JobClassificationRow, TableInsert } from "../types/index.js";
import { ensureData, type TaskoraSupabaseClient } from "./common.js";

export async function upsertJobClassification(
  client: TaskoraSupabaseClient,
  classification: JobClassification
): Promise<JobClassification> {
  const parsed = jobClassificationSchema.parse(classification);
  const payload: TableInsert<"job_classifications"> = {
    job_id: parsed.jobId,
    category: parsed.category,
    job_type: parsed.jobType,
    risk_level: parsed.riskLevel,
    required_capabilities: parsed.requiredCapabilities,
    budget_fit: parsed.budgetFit,
    matching_explanation: parsed.matchingExplanation,
    classifier_version: parsed.classifierVersion
  };

  const response = await client
    .from<JobClassificationRow>("job_classifications")
    .upsert(payload)
    .select("*")
    .single();
  const row = ensureData(
    response.data as JobClassificationRow | null,
    response.error,
    "Job classification persistence failed."
  );

  return mapJobClassificationRecord(row);
}

export async function getJobClassification(
  client: TaskoraSupabaseClient,
  jobId: string
): Promise<JobClassification | null> {
  const response = await client
    .from<JobClassificationRow>("job_classifications")
    .select("*")
    .eq("job_id", jobId)
    .single();

  if (response.error && response.error.message.startsWith("No row found")) {
    return null;
  }

  const row = ensureData(
    response.data as JobClassificationRow | null,
    response.error,
    "Job classification not found."
  );

  return mapJobClassificationRecord(row);
}
