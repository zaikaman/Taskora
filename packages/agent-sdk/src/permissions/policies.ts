import type { ApprovalPolicy, WorkforceManifest, WorkforceRole } from "@taskora/core";

export interface ApprovalEvaluationInput {
  policy: ApprovalPolicy;
  riskLevel: "low" | "medium" | "high";
  artifactProducerRoleKey?: string;
  approverRoleKey?: string;
  executorRoleKey?: string;
}

export interface PolicyDecision {
  allowed: boolean;
  reasons: string[];
}

export function getRolePermissions(role: WorkforceRole): Set<string> {
  return new Set(role.permissions);
}

export function canRolePerform(role: WorkforceRole, permission: string): boolean {
  return getRolePermissions(role).has(permission);
}

export function evaluateApprovalPolicy(input: ApprovalEvaluationInput): PolicyDecision {
  const reasons: string[] = [];

  if (
    input.riskLevel === "high" &&
    input.policy.executionRequiresIndependentApprover &&
    input.artifactProducerRoleKey &&
    input.approverRoleKey &&
    input.artifactProducerRoleKey === input.approverRoleKey
  ) {
    reasons.push("High-risk jobs require an independent approver.");
  }

  if (
    input.riskLevel !== "low" &&
    input.approverRoleKey &&
    input.executorRoleKey &&
    input.approverRoleKey === input.executorRoleKey
  ) {
    reasons.push("Reviewer or approver cannot also perform irreversible execution for this risk level.");
  }

  if (input.policy.mode === "multi_reviewer_required" && (input.policy.minimumApprovals ?? 0) < 2) {
    reasons.push("Multi-reviewer policies require at least two approvals.");
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}

export function assertManifestPermissions(manifest: WorkforceManifest): PolicyDecision {
  const reasons: string[] = [];

  for (const role of manifest.roles) {
    if (
      manifest.approvalPolicy.executionRequiresIndependentApprover &&
      role.permissions.includes("canBuildArtifact") &&
      role.permissions.includes("canApprove")
    ) {
      reasons.push(`Role "${role.key}" both builds artifacts and approves them under an independent approval policy.`);
    }

    if (
      role.permissions.includes("canReview") &&
      role.permissions.includes("canExecuteOnchain") &&
      manifest.approvalPolicy.mode !== "none"
    ) {
      reasons.push(`Role "${role.key}" both reviews and executes onchain actions.`);
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}
