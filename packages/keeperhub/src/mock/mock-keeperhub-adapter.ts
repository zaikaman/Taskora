import type {
  CreateSettlementInput,
  CreateWorkflowInput,
  KeeperHubAdapter,
  KeeperHubHealthStatus
} from "../contracts/keeperhub-adapter.js";

export class MockKeeperHubAdapter implements KeeperHubAdapter {
  public healthCheck(): Promise<KeeperHubHealthStatus> {
    return Promise.resolve({
      provider: "keeperhub",
      mode: "mock",
      available: true
    });
  }

  public createWorkflow(
    input: CreateWorkflowInput
  ): Promise<{ workflowReference: string; runReference: string }> {
    return Promise.resolve({
      workflowReference: `mock-keeperhub-workflow-${input.jobId}`,
      runReference: `mock-keeperhub-run-${input.jobId}`
    });
  }

  public executeAction(
    input: CreateWorkflowInput
  ): Promise<{ executionReference: string; status: string }> {
    return Promise.resolve({
      executionReference: `mock-keeperhub-execution-${input.jobId}`,
      status: "completed"
    });
  }

  public createSettlement(
    input: CreateSettlementInput
  ): Promise<{ settlementReference: string; status: string }> {
    return Promise.resolve({
      settlementReference: `mock-keeperhub-settlement-${input.settlementId}`,
      status: input.amount >= 0 ? "released" : "failed"
    });
  }
}
