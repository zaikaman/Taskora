export interface KeeperHubHealthStatus {
  provider: "keeperhub";
  mode: string;
  available: boolean;
}

export interface CreateWorkflowInput {
  jobId: string;
  action: string;
  payload: unknown;
}

export interface CreateSettlementInput {
  settlementId: string;
  amount: number;
}

export interface KeeperHubAdapter {
  healthCheck(): Promise<KeeperHubHealthStatus>;
  createWorkflow(input: CreateWorkflowInput): Promise<{ workflowReference: string; runReference: string }>;
  executeAction(input: CreateWorkflowInput): Promise<{ executionReference: string; status: string }>;
  createSettlement(input: CreateSettlementInput): Promise<{ settlementReference: string; status: string }>;
}
