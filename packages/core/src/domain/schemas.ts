import { z } from "zod";
import {
  approvalModeSchema,
  compatibilityStatusSchema,
  decisionActorTypeSchema,
  deploymentModeSchema,
  edgeTypeSchema,
  executionBackendSchema,
  hostingFeeModeSchema,
  integrationReferenceTypeSchema,
  paymentStatusSchema,
  payoutStatusSchema,
  pricingModeSchema,
  promptSourceTypeSchema,
  reviewDecisionSchema,
  riskLevelSchema,
  roleExecutionModeSchema,
  rolePermissionSchema,
  settlementStatusSchema,
  workforceAvailabilityStatusSchema
} from "./enums.js";
import {
  integrationReferenceIdSchema,
  jobIdSchema,
  paymentIdSchema,
  profileIdSchema,
  reviewDecisionIdSchema,
  traceEventIdSchema,
  workforceIdSchema,
  workforceManifestIdSchema,
  workforceRoleIdSchema
} from "./ids.js";
import {
  currencyCodeSchema,
  jsonObjectSchema,
  moneySchema,
  nonEmptyTrimmedStringSchema,
  timestampSchema
} from "./common.js";

export const pricingModelSchema = z.object({
  mode: pricingModeSchema,
  amount: z.number().finite().nonnegative().optional(),
  currency: currencyCodeSchema.optional(),
  hostingFeeMode: hostingFeeModeSchema.default("none"),
  hostingFeeValue: z.number().finite().nonnegative().optional()
});

export const approvalPolicySchema = z
  .object({
    mode: approvalModeSchema,
    minimumApprovals: z.number().int().nonnegative().optional(),
    executionRequiresIndependentApprover: z.boolean().default(false)
  })
  .superRefine((value, ctx) => {
    if (value.mode === "multi_reviewer_required" && (value.minimumApprovals ?? 0) < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "multi_reviewer_required requires at least two approvals",
        path: ["minimumApprovals"]
      });
    }
  });

export const workforceRoleSchema = z
  .object({
    id: workforceRoleIdSchema.optional(),
    key: nonEmptyTrimmedStringSchema,
    name: nonEmptyTrimmedStringSchema,
    purpose: nonEmptyTrimmedStringSchema,
    promptSourceType: promptSourceTypeSchema.optional(),
    prompt: z.string().trim().min(1).optional(),
    skillFile: z.string().trim().min(1).optional(),
    permissions: z.array(rolePermissionSchema).default([]),
    tools: z.array(nonEmptyTrimmedStringSchema).default([]),
    inputExpectations: jsonObjectSchema.default({}),
    outputExpectations: jsonObjectSchema.default({}),
    executionMode: roleExecutionModeSchema
  })
  .superRefine((value, ctx) => {
    if (!value.prompt && !value.skillFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "role requires either prompt or skillFile",
        path: ["prompt"]
      });
    }
  });

export const roleGraphEdgeSchema = z.object({
  from: nonEmptyTrimmedStringSchema,
  to: nonEmptyTrimmedStringSchema,
  type: edgeTypeSchema,
  condition: jsonObjectSchema.default({})
});

export const integrationBindingsSchema = z.object({
  og: z
    .object({
      publishManifest: z.boolean().default(true),
      publishTrace: z.boolean().default(true),
      publishRoleMemory: z.boolean().default(false),
      enableInferenceHooks: z.boolean().default(false)
    })
    .default({}),
  gensyn: z
    .object({
      enabled: z.boolean().default(false),
      network: z.string().trim().min(1).default("testnet"),
      workloadMode: z.enum(["optional", "preferred", "required"]).default("optional"),
      verificationRequired: z.boolean().default(false)
    })
    .default({}),
  keeperhub: z
    .object({
      enabled: z.boolean().default(false),
      executionMode: z.enum(["workflow", "direct_execution", "none"]).default("none"),
      supportedChains: z.array(nonEmptyTrimmedStringSchema).default([])
    })
    .default({})
});

export const workforceManifestSchema = z
  .object({
    id: workforceManifestIdSchema.optional(),
    name: nonEmptyTrimmedStringSchema.min(3),
    category: nonEmptyTrimmedStringSchema.min(2),
    description: nonEmptyTrimmedStringSchema.min(10),
    acceptedJobTypes: z.array(nonEmptyTrimmedStringSchema).min(1),
    rejectedJobTypes: z.array(nonEmptyTrimmedStringSchema).default([]),
    deploymentMode: deploymentModeSchema,
    executionBackend: executionBackendSchema,
    publicEndpoint: z.string().url().optional(),
    manifestUrl: z.string().url().optional(),
    roles: z.array(workforceRoleSchema).min(1),
    roleGraphEdges: z.array(roleGraphEdgeSchema).min(1),
    approvalPolicy: approvalPolicySchema,
    tools: z.array(nonEmptyTrimmedStringSchema).default([]),
    pricingModel: pricingModelSchema,
    payoutAddress: nonEmptyTrimmedStringSchema.min(3),
    exampleJobs: z.array(nonEmptyTrimmedStringSchema).default([]),
    availabilityStatus: workforceAvailabilityStatusSchema,
    integrations: integrationBindingsSchema
  })
  .superRefine((value, ctx) => {
    if (value.deploymentMode === "self_hosted" && !value.publicEndpoint && !value.manifestUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "self-hosted workforces require publicEndpoint or manifestUrl",
        path: ["publicEndpoint"]
      });
    }

    if (value.acceptedJobTypes.some((jobType) => value.rejectedJobTypes.includes(jobType))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "acceptedJobTypes and rejectedJobTypes must not overlap",
        path: ["rejectedJobTypes"]
      });
    }
  });

export const profileSchema = z.object({
  id: profileIdSchema,
  displayName: z.string().trim().min(1).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  defaultRoleMode: z.enum(["customer", "developer", "both"]).default("customer"),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional()
});

export const workforceSummarySchema = z.object({
  id: workforceIdSchema,
  developerId: profileIdSchema,
  name: nonEmptyTrimmedStringSchema,
  slug: nonEmptyTrimmedStringSchema,
  category: nonEmptyTrimmedStringSchema,
  description: nonEmptyTrimmedStringSchema,
  deploymentMode: deploymentModeSchema,
  executionBackend: executionBackendSchema,
  availabilityStatus: workforceAvailabilityStatusSchema,
  pricingModel: pricingModelSchema,
  reputationSummary: jsonObjectSchema.default({}),
  lastHealthCheckAt: timestampSchema.nullable().optional(),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional()
});

export const jobCreateSchema = z.object({
  title: nonEmptyTrimmedStringSchema.min(3),
  description: nonEmptyTrimmedStringSchema.min(10),
  budget: moneySchema,
  preferredWorkforceId: workforceIdSchema.optional(),
  attachments: z
    .array(
      z.object({
        name: nonEmptyTrimmedStringSchema,
        url: z.string().url()
      })
    )
    .default([])
});

export const jobClassificationSchema = z.object({
  jobId: jobIdSchema,
  category: nonEmptyTrimmedStringSchema,
  jobType: nonEmptyTrimmedStringSchema,
  riskLevel: riskLevelSchema,
  requiredCapabilities: z.array(nonEmptyTrimmedStringSchema).default([]),
  budgetFit: nonEmptyTrimmedStringSchema,
  matchingExplanation: jsonObjectSchema.default({}),
  classifierVersion: nonEmptyTrimmedStringSchema,
  createdAt: timestampSchema.optional()
});

export const paymentAuthorizeSchema = z.object({
  jobId: jobIdSchema,
  paymentMethod: z.string().trim().min(1).optional(),
  amountOverride: z.number().finite().nonnegative().optional()
});

export const paymentDetailSchema = z.object({
  id: paymentIdSchema,
  jobId: jobIdSchema,
  provider: nonEmptyTrimmedStringSchema,
  totalAmount: z.number().finite().nonnegative(),
  currency: currencyCodeSchema,
  authorizationStatus: paymentStatusSchema,
  authorizationReference: z.string().trim().nullable().optional(),
  authorizedAt: timestampSchema.nullable().optional(),
  settlementStatus: settlementStatusSchema.optional(),
  payoutStatus: payoutStatusSchema.optional()
});

export const settlementSchema = z.object({
  jobId: jobIdSchema,
  paymentId: paymentIdSchema,
  status: settlementStatusSchema,
  taskoraFeeAmount: z.number().finite().nonnegative(),
  hostingFeeAmount: z.number().finite().nonnegative(),
  developerPayoutAmount: z.number().finite().nonnegative(),
  keeperhubExecutionRequired: z.boolean().default(false),
  releasedAt: timestampSchema.nullable().optional()
});

export const integrationReferenceSchema = z.object({
  id: integrationReferenceIdSchema.optional(),
  jobId: jobIdSchema.optional(),
  workforceId: workforceIdSchema.optional(),
  referenceType: integrationReferenceTypeSchema,
  externalId: nonEmptyTrimmedStringSchema,
  uri: z.string().url().nullable().optional(),
  metadata: jsonObjectSchema.default({}),
  createdAt: timestampSchema.optional()
});

export const traceEventSchema = z.object({
  id: traceEventIdSchema.optional(),
  jobId: jobIdSchema,
  workforceId: workforceIdSchema,
  roleId: workforceRoleIdSchema.nullable().optional(),
  eventType: nonEmptyTrimmedStringSchema,
  status: nonEmptyTrimmedStringSchema,
  title: nonEmptyTrimmedStringSchema,
  details: jsonObjectSchema.default({}),
  visibleToCustomer: z.boolean().default(true),
  integrationReferenceId: integrationReferenceIdSchema.nullable().optional(),
  createdAt: timestampSchema.optional()
});

export const reviewDecisionRecordSchema = z.object({
  id: reviewDecisionIdSchema.optional(),
  jobId: jobIdSchema,
  roleId: workforceRoleIdSchema.nullable().optional(),
  artifactReference: nonEmptyTrimmedStringSchema,
  decision: reviewDecisionSchema,
  decidedByType: decisionActorTypeSchema,
  decidedById: z.string().uuid().nullable().optional(),
  reason: z.string().trim().nullable().optional(),
  createdAt: timestampSchema.optional()
});

export const manifestPersistenceSchema = z.object({
  workforceId: workforceIdSchema,
  version: z.number().int().positive(),
  manifest: workforceManifestSchema,
  manifestHash: nonEmptyTrimmedStringSchema,
  compatibilityStatus: compatibilityStatusSchema.default("pending")
});
