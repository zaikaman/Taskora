import {
  AppError,
  mapPaymentRecord,
  paymentAuthorizeSchema,
  type PaymentDetail
} from "@taskora/core";
import type { PaymentRow, TableInsert } from "../types/index.js";
import { ensureData, type TaskoraSupabaseClient } from "./common.js";
import { getJobForCustomer, updateJobStatus } from "./jobs.js";

export async function authorizePaymentForJob(
  client: TaskoraSupabaseClient,
  input: unknown,
  viewerId?: string
): Promise<PaymentDetail> {
  const parsed = paymentAuthorizeSchema.parse(input);
  const job = await getJobForCustomer(client, parsed.jobId, viewerId);

  if (!job.selectedWorkforceId) {
    throw new AppError("workforce_required", "Select a workforce before authorizing payment.", {
      statusCode: 409
    });
  }

  const totalAmount = parsed.amountOverride ?? job.requestedBudgetAmount;
  const authorizedAt = new Date().toISOString();
  const payload: TableInsert<"payments"> = {
    job_id: job.id,
    provider: "taskora_mock_escrow",
    total_amount: totalAmount,
    currency: job.currency,
    authorization_status: "authorized",
    authorization_reference: `auth_${job.id.slice(0, 8)}_${Date.now()}`,
    authorized_at: authorizedAt
  };

  const response = await client.from<PaymentRow>("payments").insert(payload).select("*").single();
  const row = ensureData(response.data as PaymentRow | null, response.error, "Payment authorization failed.");

  await updateJobStatus(client, { jobId: job.id, status: "authorized" }, viewerId);

  return mapPaymentRecord(row);
}

export async function getPaymentById(
  client: TaskoraSupabaseClient,
  paymentId: string
): Promise<PaymentDetail> {
  const response = await client
    .from<PaymentRow>("payments")
    .select("*")
    .eq("id", paymentId)
    .single();
  const row = ensureData(response.data as PaymentRow | null, response.error, "Payment not found.");

  return mapPaymentRecord(row);
}

export async function getLatestPaymentForJob(
  client: TaskoraSupabaseClient,
  jobId: string
): Promise<PaymentDetail | null> {
  const response = await client
    .from<PaymentRow>("payments")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  const rows = ensureData((response.data ?? []) as PaymentRow[], response.error, "Payments not found.");
  const latest = rows[0];

  return latest ? mapPaymentRecord(latest) : null;
}
