export interface GensynHealthStatus {
  provider: "gensyn";
  mode: string;
  available: boolean;
}

export interface SubmitWorkloadInput {
  workloadId: string;
  roleKey: string;
  payload: unknown;
}

export interface GensynAdapter {
  healthCheck(): Promise<GensynHealthStatus>;
  submitWorkload(input: SubmitWorkloadInput): Promise<{ workloadReference: string; status: string }>;
  getWorkloadStatus(workloadReference: string): Promise<{ status: string }>;
  verifyWorkload(workloadReference: string): Promise<{ verificationReference: string; verified: boolean }>;
}
