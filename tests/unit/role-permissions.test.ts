import { describe, expect, it } from "vitest";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import { assertManifestPermissions, evaluateApprovalPolicy } from "../../packages/agent-sdk/src/permissions/policies.ts";
import { buildExecutionPlan } from "../../packages/agent-sdk/src/role-graph/executor-plan.ts";

describe("role permissions and graph planning", () => {
  it("builds an execution plan in dependency order", () => {
    const manifest = createManifestTemplate("safe-onchain");
    const plan = buildExecutionPlan(manifest);

    expect(plan.steps.map((step) => step.roleKey)).toEqual(["planner", "auditor", "executor"]);
  });

  it("blocks the same role from building and approving high-risk work", () => {
    const manifest = createManifestTemplate("safe-onchain");
    const invalidManifest = {
      ...manifest,
      roles: manifest.roles.map((role) =>
        role.key === "planner"
          ? { ...role, permissions: [...role.permissions, "canBuildArtifact", "canApprove"] }
          : role
      )
    };

    const decision = assertManifestPermissions(invalidManifest);

    expect(decision.allowed).toBe(false);
    expect(decision.reasons[0]).toContain("planner");
  });

  it("requires independent approvers on high-risk jobs", () => {
    const manifest = createManifestTemplate("safe-onchain");
    const decision = evaluateApprovalPolicy({
      policy: manifest.approvalPolicy,
      riskLevel: "high",
      artifactProducerRoleKey: "planner",
      approverRoleKey: "planner",
      executorRoleKey: "executor"
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain("High-risk jobs require an independent approver.");
  });
});
