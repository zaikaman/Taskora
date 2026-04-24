import { createHash, randomUUID } from "node:crypto";
import type {
  JobDetailDto,
  JobSummaryDto,
  PaymentDetail,
  ProfileDto,
  TraceEvent,
  WorkforceManifest,
  WorkforceSummary
} from "./models.js";
import {
  paymentDetailSchema,
  profileSchema,
  traceEventSchema,
  workforceManifestSchema,
  workforceSummarySchema
} from "./schemas.js";

export function mapProfileRecord(record: {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  default_role_mode: "customer" | "developer" | "both";
  created_at: string;
  updated_at: string;
}): ProfileDto {
  return profileSchema.parse({
    id: record.id,
    displayName: record.display_name,
    avatarUrl: record.avatar_url,
    defaultRoleMode: record.default_role_mode,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  });
}

export function mapWorkforceRecord(record: {
  id: string;
  developer_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  deployment_mode: "self_hosted" | "taskora_hosted";
  execution_backend: "local_runtime" | "gensyn" | "self_hosted_endpoint" | "hybrid";
  availability_status: "draft" | "connected" | "available" | "paused" | "unavailable";
  pricing_model: unknown;
  reputation_summary: unknown;
  last_health_check_at: string | null;
  created_at: string;
  updated_at: string;
}): WorkforceSummary {
  return workforceSummarySchema.parse({
    id: record.id,
    developerId: record.developer_id,
    name: record.name,
    slug: record.slug,
    category: record.category,
    description: record.description,
    deploymentMode: record.deployment_mode,
    executionBackend: record.execution_backend,
    availabilityStatus: record.availability_status,
    pricingModel: record.pricing_model,
    reputationSummary: record.reputation_summary,
    lastHealthCheckAt: record.last_health_check_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  });
}

export function mapJobRecord(record: {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  requested_budget_amount: number;
  currency: string;
  status: string;
  selected_workforce_id: string | null;
  final_result: unknown;
  final_result_summary: string | null;
  og_final_trace_ref: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}): JobSummaryDto {
  return {
    id: record.id,
    customerId: record.customer_id,
    title: record.title,
    description: record.description,
    requestedBudgetAmount: record.requested_budget_amount,
    currency: record.currency,
    status: record.status,
    selectedWorkforceId: record.selected_workforce_id,
    finalResult: record.final_result,
    finalResultSummary: record.final_result_summary,
    ogFinalTraceRef: record.og_final_trace_ref,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    completedAt: record.completed_at
  };
}

export function mapPaymentRecord(record: {
  id: string;
  job_id: string;
  provider: string;
  total_amount: number;
  currency: string;
  authorization_status: "pending" | "authorized" | "released" | "failed" | "voided";
  authorization_reference: string | null;
  authorized_at: string | null;
  settlement_status?: "pending" | "ready" | "released" | "failed";
  payout_status?: "pending" | "paid" | "failed";
}): PaymentDetail {
  return paymentDetailSchema.parse({
    id: record.id,
    jobId: record.job_id,
    provider: record.provider,
    totalAmount: record.total_amount,
    currency: record.currency,
    authorizationStatus: record.authorization_status,
    authorizationReference: record.authorization_reference,
    authorizedAt: record.authorized_at,
    settlementStatus: record.settlement_status,
    payoutStatus: record.payout_status
  });
}

export function mapTraceEventRecord(record: {
  id?: string;
  job_id: string;
  workforce_id: string;
  role_id: string | null;
  event_type: string;
  status: string;
  title: string;
  details: unknown;
  visible_to_customer: boolean;
  integration_reference_id: string | null;
  created_at?: string;
}): TraceEvent {
  return traceEventSchema.parse({
    id: record.id ?? randomUUID(),
    jobId: record.job_id,
    workforceId: record.workforce_id,
    roleId: record.role_id,
    eventType: record.event_type,
    status: record.status,
    title: record.title,
    details: typeof record.details === "object" && record.details !== null ? record.details : {},
    visibleToCustomer: record.visible_to_customer,
    integrationReferenceId: record.integration_reference_id,
    createdAt: record.created_at ?? new Date().toISOString()
  });
}

export function mapJobDetailRecord(
  job: JobSummaryDto,
  additions: Pick<JobDetailDto, "classification" | "payment" | "trace">
): JobDetailDto {
  return {
    ...job,
    ...additions
  };
}

export function hashManifest(manifest: WorkforceManifest): string {
  const normalizedManifest = workforceManifestSchema.parse(manifest);
  return createHash("sha256").update(JSON.stringify(normalizedManifest)).digest("hex");
}
