import type { RoleGraphEdge, WorkforceManifest } from "@taskora/core";

export interface ExecutionPlanStep {
  roleKey: string;
  dependsOn: string[];
  gateType?: RoleGraphEdge["type"];
}

export interface ExecutionPlan {
  steps: ExecutionPlanStep[];
  terminalEdges: RoleGraphEdge[];
}

export function validateRoleGraph(manifest: WorkforceManifest): string[] {
  const roleKeys = new Set(manifest.roles.map((role) => role.key));
  const issues: string[] = [];

  for (const edge of manifest.roleGraphEdges) {
    if (!roleKeys.has(edge.from)) {
      issues.push(`Unknown from role "${edge.from}" in role graph.`);
    }

    if (!roleKeys.has(edge.to)) {
      issues.push(`Unknown to role "${edge.to}" in role graph.`);
    }
  }

  return issues;
}

export function buildExecutionPlan(manifest: WorkforceManifest): ExecutionPlan {
  const issues = validateRoleGraph(manifest);

  if (issues.length > 0) {
    throw new Error(issues.join(" "));
  }

  const dependencyEdges = manifest.roleGraphEdges.filter(
    (edge) => edge.type === "depends_on" || edge.type === "review_gate" || edge.type === "approval_gate"
  );
  const terminalEdges = manifest.roleGraphEdges.filter(
    (edge) => edge.type === "success_terminal" || edge.type === "failure_terminal"
  );

  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, RoleGraphEdge[]>();

  for (const role of manifest.roles) {
    inDegree.set(role.key, 0);
    adjacency.set(role.key, []);
  }

  for (const edge of dependencyEdges) {
    adjacency.get(edge.from)?.push(edge);
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  const queue = [...manifest.roles.map((role) => role.key).filter((roleKey) => (inDegree.get(roleKey) ?? 0) === 0)];
  const steps: ExecutionPlanStep[] = [];

  while (queue.length > 0) {
    const roleKey = queue.shift();

    if (!roleKey) {
      continue;
    }

    const dependencies = dependencyEdges
      .filter((edge) => edge.to === roleKey)
      .map((edge) => edge.from);
    const gateType = dependencyEdges.find((edge) => edge.to === roleKey && edge.type !== "depends_on")?.type;

    const step: ExecutionPlanStep = {
      roleKey,
      dependsOn: dependencies
    };

    if (gateType) {
      step.gateType = gateType;
    }

    steps.push(step);

    for (const edge of adjacency.get(roleKey) ?? []) {
      const nextDegree = (inDegree.get(edge.to) ?? 1) - 1;
      inDegree.set(edge.to, nextDegree);

      if (nextDegree === 0) {
        queue.push(edge.to);
      }
    }
  }

  if (steps.length !== manifest.roles.length) {
    throw new Error("Role graph contains a cycle.");
  }

  return {
    steps,
    terminalEdges
  };
}
