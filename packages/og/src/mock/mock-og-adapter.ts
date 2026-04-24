import type {
  OgAdapter,
  OgHealthStatus,
  PublishManifestInput,
  PublishRoleMemoryInput,
  PublishTraceInput
} from "../contracts/og-adapter.js";

export class MockOgAdapter implements OgAdapter {
  public healthCheck(): Promise<OgHealthStatus> {
    return Promise.resolve({
      provider: "og",
      mode: "mock",
      available: true
    });
  }

  public publishManifest(input: PublishManifestInput): Promise<{ reference: string; uri: string }> {
    return Promise.resolve({
      reference: `mock-og-manifest-${input.workforceId}-${input.manifestHash.slice(0, 8)}`,
      uri: `mock://og/manifests/${input.workforceId}`
    });
  }

  public publishTrace(input: PublishTraceInput): Promise<{ reference: string; uri: string }> {
    return Promise.resolve({
      reference: `mock-og-trace-${input.jobId}-${input.events.length}`,
      uri: `mock://og/traces/${input.jobId}`
    });
  }

  public publishRoleMemory(
    input: PublishRoleMemoryInput
  ): Promise<{ reference: string; uri: string }> {
    return Promise.resolve({
      reference: `mock-og-memory-${input.workforceId}-${input.roleKey}`,
      uri: `mock://og/memory/${input.workforceId}/${input.roleKey}`
    });
  }
}
