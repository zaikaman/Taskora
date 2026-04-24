import { describe, expect, it } from "vitest";
import { MockGensynAdapter } from "../../packages/gensyn/src/mock/mock-gensyn-adapter.ts";
import { MockKeeperHubAdapter } from "../../packages/keeperhub/src/mock/mock-keeperhub-adapter.ts";
import { hashManifest } from "../../packages/core/src/domain/mappers.ts";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import { MockOgAdapter } from "../../packages/og/src/mock/mock-og-adapter.ts";
import { createRuntimeIntegrations } from "../../apps/agent-runtime/src/integrations/factory.ts";
import { parseRuntimeEnv } from "../../apps/agent-runtime/src/config/env.ts";

describe("provider adapters", () => {
  it("publishes manifest and trace references through the mock 0G adapter", async () => {
    const manifest = createManifestTemplate("safe-onchain");
    const adapter = new MockOgAdapter();

    const manifestResult = await adapter.publishManifest({
      workforceId: crypto.randomUUID(),
      manifestHash: hashManifest(manifest),
      manifest
    });
    const traceResult = await adapter.publishTrace({
      jobId: crypto.randomUUID(),
      events: [{ eventType: "runtime.started" }]
    });

    expect(manifestResult.reference).toContain("mock-og-manifest");
    expect(traceResult.reference).toContain("mock-og-trace");
  });

  it("simulates Gensyn and KeeperHub workflows", async () => {
    const gensyn = new MockGensynAdapter();
    const keeperhub = new MockKeeperHubAdapter();

    const workload = await gensyn.submitWorkload({
      workloadId: crypto.randomUUID(),
      roleKey: "planner",
      payload: {}
    });
    const verification = await gensyn.verifyWorkload(workload.workloadReference);
    const workflow = await keeperhub.createWorkflow({
      jobId: crypto.randomUUID(),
      action: "execute",
      payload: {}
    });

    expect(verification.verified).toBe(true);
    expect(workflow.workflowReference).toContain("mock-keeperhub-workflow");
  });

  it("wires mock integrations from runtime env", () => {
    const env = parseRuntimeEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      SUPABASE_DB_URL: "postgres://postgres:postgres@localhost:54322/postgres",
      TASKORA_RUNTIME_URL: "http://localhost:4001",
      TASKORA_RUNTIME_SHARED_SECRET: "runtime-secret",
      OG_MODE: "mock",
      GENSYN_MODE: "mock",
      GENSYN_NETWORK: "testnet",
      KEEPERHUB_MODE: "mock",
      PAYMENT_NETWORK: "testnet"
    });

    const integrations = createRuntimeIntegrations(env);

    expect(integrations.og).toBeInstanceOf(MockOgAdapter);
    expect(integrations.gensyn).toBeInstanceOf(MockGensynAdapter);
    expect(integrations.keeperhub).toBeInstanceOf(MockKeeperHubAdapter);
  });
});
