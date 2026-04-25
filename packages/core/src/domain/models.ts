import type { z } from "zod";
import type {
  approvalPolicySchema,
  integrationBindingsSchema,
  jobClassificationSchema,
  jobCreateSchema,
  paymentAuthorizeSchema,
  paymentDetailSchema,
  pricingModelSchema,
  profileSchema,
  integrationReferenceSchema,
  reviewDecisionRecordSchema,
  roleGraphEdgeSchema,
  settlementSchema,
  traceEventSchema,
  workforceManifestSchema,
  workforceRoleSchema,
  workforceSummarySchema
} from "./schemas.js";

export type ProfileDto = z.infer<typeof profileSchema>;
export type PricingModel = z.infer<typeof pricingModelSchema>;
export type ApprovalPolicy = z.infer<typeof approvalPolicySchema>;
export type IntegrationBindings = z.infer<typeof integrationBindingsSchema>;
export type WorkforceRole = z.infer<typeof workforceRoleSchema>;
export type RoleGraphEdge = z.infer<typeof roleGraphEdgeSchema>;
export type WorkforceManifest = z.infer<typeof workforceManifestSchema>;
export type WorkforceSummary = z.infer<typeof workforceSummarySchema>;
export type JobCreateInput = z.infer<typeof jobCreateSchema>;
export type JobClassification = z.infer<typeof jobClassificationSchema>;
export type PaymentAuthorizeInput = z.infer<typeof paymentAuthorizeSchema>;
export type PaymentDetail = z.infer<typeof paymentDetailSchema>;
export type SettlementDetail = z.infer<typeof settlementSchema>;
export type IntegrationReference = z.infer<typeof integrationReferenceSchema>;
export type TraceEvent = z.infer<typeof traceEventSchema>;
export type ReviewDecisionRecord = z.infer<typeof reviewDecisionRecordSchema>;

export interface WorkforceMatch {
  workforce: WorkforceSummary;
  specializationFitScore: number;
  priceScore: number;
  availabilityScore: number;
  totalScore: number;
  rankingReason: string;
  acceptedJobTypes: string[];
  rejectedJobTypes: string[];
}

export interface JobSummaryDto {
  id: string;
  customerId: string;
  title: string;
  description: string;
  requestedBudgetAmount: number;
  currency: string;
  status: string;
  selectedWorkforceId?: string | null;
  finalResult?: unknown;
  finalResultSummary?: string | null;
  ogFinalTraceRef?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface JobDetailDto extends JobSummaryDto {
  classification?: JobClassification;
  matches?: WorkforceMatch[];
  payment?: PaymentDetail;
  trace?: TraceEvent[];
}
