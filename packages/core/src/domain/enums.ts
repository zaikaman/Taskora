import { z } from "zod";

export const defaultRoleModes = ["customer", "developer", "both"] as const;
export const verificationStatuses = ["pending", "verified", "rejected"] as const;
export const deploymentModes = ["self_hosted", "taskora_hosted"] as const;
export const executionBackends = ["local_runtime", "gensyn", "self_hosted_endpoint", "hybrid"] as const;
export const workforceAvailabilityStatuses = ["draft", "connected", "available", "paused", "unavailable"] as const;
export const promptSourceTypes = ["inline", "skill_file", "remote_manifest"] as const;
export const roleExecutionModes = ["local", "gensyn_eligible", "keeperhub_only", "self_hosted"] as const;
export const edgeTypes = ["depends_on", "review_gate", "approval_gate", "success_terminal", "failure_terminal"] as const;
export const jobStatuses = [
  "draft",
  "classified",
  "matched",
  "payment_pending",
  "authorized",
  "queued",
  "running",
  "awaiting_approval",
  "executing_onchain",
  "completed",
  "failed",
  "rejected",
  "canceled"
] as const;
export const riskLevels = ["low", "medium", "high"] as const;
export const approvalModes = [
  "none",
  "reviewer_required",
  "auditor_required",
  "human_required",
  "multi_reviewer_required"
] as const;
export const reviewDecisions = ["pending", "approved", "rejected", "changes_requested"] as const;
export const decisionActorTypes = ["role", "human"] as const;
export const paymentStatuses = ["pending", "authorized", "released", "failed", "voided"] as const;
export const settlementStatuses = ["pending", "ready", "released", "failed"] as const;
export const payoutStatuses = ["pending", "paid", "failed"] as const;
export const computeProviders = ["local_runtime", "gensyn", "self_hosted", "hybrid"] as const;
export const deploymentStatuses = ["draft", "deploying", "connected", "available", "paused", "unavailable", "failed"] as const;
export const compatibilityStatuses = ["pending", "compatible", "incompatible"] as const;
export const pricingModes = ["fixed", "starting_at", "hourly", "quote_required"] as const;
export const hostingFeeModes = ["none", "flat", "percentage"] as const;
export const integrationReferenceTypes = [
  "og_manifest",
  "og_trace",
  "og_memory",
  "og_inference",
  "gensyn_workload",
  "gensyn_verification",
  "gensyn_coordination",
  "keeperhub_workflow",
  "keeperhub_run",
  "keeperhub_settlement",
  "keeperhub_execution",
  "self_hosted_health_check"
] as const;
export const rolePermissions = [
  "canClassify",
  "canPlan",
  "canBuildArtifact",
  "canReview",
  "canApprove",
  "canExecuteOnchain",
  "canReleasePayment",
  "canWriteMemory"
] as const;

export const defaultRoleModeSchema = z.enum(defaultRoleModes);
export const verificationStatusSchema = z.enum(verificationStatuses);
export const deploymentModeSchema = z.enum(deploymentModes);
export const executionBackendSchema = z.enum(executionBackends);
export const workforceAvailabilityStatusSchema = z.enum(workforceAvailabilityStatuses);
export const promptSourceTypeSchema = z.enum(promptSourceTypes);
export const roleExecutionModeSchema = z.enum(roleExecutionModes);
export const edgeTypeSchema = z.enum(edgeTypes);
export const jobStatusSchema = z.enum(jobStatuses);
export const riskLevelSchema = z.enum(riskLevels);
export const approvalModeSchema = z.enum(approvalModes);
export const reviewDecisionSchema = z.enum(reviewDecisions);
export const decisionActorTypeSchema = z.enum(decisionActorTypes);
export const paymentStatusSchema = z.enum(paymentStatuses);
export const settlementStatusSchema = z.enum(settlementStatuses);
export const payoutStatusSchema = z.enum(payoutStatuses);
export const computeProviderSchema = z.enum(computeProviders);
export const deploymentStatusSchema = z.enum(deploymentStatuses);
export const compatibilityStatusSchema = z.enum(compatibilityStatuses);
export const pricingModeSchema = z.enum(pricingModes);
export const hostingFeeModeSchema = z.enum(hostingFeeModes);
export const integrationReferenceTypeSchema = z.enum(integrationReferenceTypes);
export const rolePermissionSchema = z.enum(rolePermissions);
