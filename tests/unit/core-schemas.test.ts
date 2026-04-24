import { describe, expect, it } from "vitest";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import {
  jobCreateSchema,
  paymentDetailSchema,
  traceEventSchema,
  workforceManifestSchema
} from "../../packages/core/src/domain/schemas.ts";

describe("core schemas", () => {
  it("accepts a valid workforce manifest", () => {
    const manifest = createManifestTemplate("safe-onchain");
    const parsed = workforceManifestSchema.parse(manifest);

    expect(parsed.name).toContain("Safe Onchain");
    expect(parsed.roles).toHaveLength(3);
  });

  it("rejects invalid self-hosted manifests without a public surface", () => {
    const manifest = {
      ...createManifestTemplate("landing-page"),
      deploymentMode: "self_hosted" as const,
      publicEndpoint: undefined,
      manifestUrl: undefined
    };

    expect(() => workforceManifestSchema.parse(manifest)).toThrow(/publicEndpoint/i);
  });

  it("parses job creation payloads", () => {
    const parsed = jobCreateSchema.parse({
      title: "Deploy escrow contract",
      description: "Deploy an escrow contract on testnet after audit approval.",
      budget: {
        amount: 1200,
        currency: "usd"
      }
    });

    expect(parsed.budget.currency).toBe("USD");
  });

  it("parses payment and trace payloads", () => {
    const payment = paymentDetailSchema.parse({
      id: crypto.randomUUID(),
      jobId: crypto.randomUUID(),
      provider: "mock",
      totalAmount: 100,
      currency: "USD",
      authorizationStatus: "authorized"
    });
    const traceEvent = traceEventSchema.parse({
      jobId: crypto.randomUUID(),
      workforceId: crypto.randomUUID(),
      eventType: "runtime.started",
      status: "running",
      title: "Runtime started"
    });

    expect(payment.authorizationStatus).toBe("authorized");
    expect(traceEvent.visibleToCustomer).toBe(true);
  });
});
