import type { GensynAdapter, GensynHealthStatus, SubmitWorkloadInput } from "../contracts/gensyn-adapter.js";

export class MockGensynAdapter implements GensynAdapter {
  public healthCheck(): Promise<GensynHealthStatus> {
    return Promise.resolve({
      provider: "gensyn",
      mode: "mock",
      available: true
    });
  }

  public submitWorkload(
    input: SubmitWorkloadInput
  ): Promise<{ workloadReference: string; status: string }> {
    return Promise.resolve({
      workloadReference: `mock-gensyn-workload-${input.workloadId}-${input.roleKey}`,
      status: "submitted"
    });
  }

  public getWorkloadStatus(workloadReference: string): Promise<{ status: string }> {
    return Promise.resolve({
      status: workloadReference.includes("failed") ? "failed" : "completed"
    });
  }

  public verifyWorkload(
    workloadReference: string
  ): Promise<{ verificationReference: string; verified: boolean }> {
    return Promise.resolve({
      verificationReference: `mock-gensyn-verification-${workloadReference}`,
      verified: true
    });
  }
}
