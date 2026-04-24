export interface OgHealthStatus {
  provider: "og";
  mode: string;
  available: boolean;
}

export interface PublishManifestInput {
  workforceId: string;
  manifestHash: string;
  manifest: unknown;
}

export interface PublishTraceInput {
  jobId: string;
  events: unknown[];
}

export interface PublishRoleMemoryInput {
  workforceId: string;
  roleKey: string;
  snapshot: unknown;
}

export interface OgAdapter {
  healthCheck(): Promise<OgHealthStatus>;
  publishManifest(input: PublishManifestInput): Promise<{ reference: string; uri: string }>;
  publishTrace(input: PublishTraceInput): Promise<{ reference: string; uri: string }>;
  publishRoleMemory(input: PublishRoleMemoryInput): Promise<{ reference: string; uri: string }>;
}
