import { z } from "zod";

const uuidSchema = z.string().uuid();

export const profileIdSchema = uuidSchema.brand<"ProfileId">();
export const developerIdSchema = uuidSchema.brand<"DeveloperId">();
export const workforceIdSchema = uuidSchema.brand<"WorkforceId">();
export const workforceManifestIdSchema = uuidSchema.brand<"WorkforceManifestId">();
export const workforceRoleIdSchema = uuidSchema.brand<"WorkforceRoleId">();
export const roleGraphEdgeIdSchema = uuidSchema.brand<"RoleGraphEdgeId">();
export const jobIdSchema = uuidSchema.brand<"JobId">();
export const paymentIdSchema = uuidSchema.brand<"PaymentId">();
export const settlementIdSchema = uuidSchema.brand<"SettlementId">();
export const payoutIdSchema = uuidSchema.brand<"PayoutId">();
export const deploymentIdSchema = uuidSchema.brand<"DeploymentId">();
export const integrationReferenceIdSchema = uuidSchema.brand<"IntegrationReferenceId">();
export const traceEventIdSchema = uuidSchema.brand<"TraceEventId">();
export const reviewDecisionIdSchema = uuidSchema.brand<"ReviewDecisionId">();

export type ProfileId = z.infer<typeof profileIdSchema>;
export type DeveloperId = z.infer<typeof developerIdSchema>;
export type WorkforceId = z.infer<typeof workforceIdSchema>;
export type WorkforceManifestId = z.infer<typeof workforceManifestIdSchema>;
export type WorkforceRoleId = z.infer<typeof workforceRoleIdSchema>;
export type RoleGraphEdgeId = z.infer<typeof roleGraphEdgeIdSchema>;
export type JobId = z.infer<typeof jobIdSchema>;
export type PaymentId = z.infer<typeof paymentIdSchema>;
export type SettlementId = z.infer<typeof settlementIdSchema>;
export type PayoutId = z.infer<typeof payoutIdSchema>;
export type DeploymentId = z.infer<typeof deploymentIdSchema>;
export type IntegrationReferenceId = z.infer<typeof integrationReferenceIdSchema>;
export type TraceEventId = z.infer<typeof traceEventIdSchema>;
export type ReviewDecisionId = z.infer<typeof reviewDecisionIdSchema>;
