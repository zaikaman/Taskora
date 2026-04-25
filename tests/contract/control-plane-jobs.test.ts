import { describe, expect, it } from "vitest";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import { selectWorkforceForJob } from "../../packages/supabase/src/helpers/jobs.ts";
import {
  authorizePaymentApiResponse,
  createJobApiResponse,
  getJobApiResponse,
  getPaymentApiResponse,
  listJobsApiResponse
} from "../../apps/web/lib/api/control-plane.ts";
import { FakeSupabaseClient } from "../integration/support/fake-supabase.ts";

describe("control-plane jobs and payments API contracts", () => {
  it("creates a classified job with compatible matches", async () => {
    const userId = crypto.randomUUID();
    const workforceId = crypto.randomUUID();
    const client = new FakeSupabaseClient(userId, createMarketplaceSeed(userId, workforceId));

    const response = await createJobApiResponse(client, {
      description: "Deploy a simple escrow contract on testnet and execute a test deposit only if audited.",
      budget: {
        amount: 900,
        currency: "USD"
      }
    });

    expect(response.status).toBe(201);
    expect(response.body.classification?.jobType).toBe("safe_onchain_execution");
    expect(response.body.matches).toHaveLength(1);
    expect(response.body.matches?.[0]?.workforce.id).toBe(workforceId);
  });

  it("lists and reads job details by id", async () => {
    const userId = crypto.randomUUID();
    const workforceId = crypto.randomUUID();
    const client = new FakeSupabaseClient(userId, createMarketplaceSeed(userId, workforceId));
    const created = await createJobApiResponse(client, {
      title: "Landing page build",
      description: "Build a beautiful landing page for my AI habit tracker.",
      budget: {
        amount: 450,
        currency: "USD"
      }
    });

    const listResponse = await listJobsApiResponse(client);
    const detailResponse = await getJobApiResponse(client, created.body.id);

    expect(listResponse.body.items).toHaveLength(1);
    expect(detailResponse.body.id).toBe(created.body.id);
    expect(detailResponse.body.classification?.jobType).toBe("landing_page");
  });

  it("authorizes payment for a selected job and exposes payment detail", async () => {
    const userId = crypto.randomUUID();
    const workforceId = crypto.randomUUID();
    const client = new FakeSupabaseClient(userId, createMarketplaceSeed(userId, workforceId));
    const created = await createJobApiResponse(client, {
      title: "Landing page build",
      description: "Build a beautiful landing page for my AI habit tracker.",
      budget: {
        amount: 450,
        currency: "USD"
      },
      preferredWorkforceId: workforceId
    });

    await selectWorkforceForJob(client, {
      jobId: created.body.id,
      workforceId
    });
    const paymentResponse = await authorizePaymentApiResponse(client, {
      jobId: created.body.id,
      paymentMethod: "mock-card"
    });
    const paymentDetail = await getPaymentApiResponse(client, paymentResponse.body.id);

    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.body.authorizationStatus).toBe("authorized");
    expect(paymentDetail.body.id).toBe(paymentResponse.body.id);
  });
});

function createMarketplaceSeed(userId: string, workforceId: string) {
  const onchainManifest = createManifestTemplate("safe-onchain");
  const landingManifest = createManifestTemplate("landing-page");
  const now = new Date().toISOString();
  const landingWorkforceId = crypto.randomUUID();

  return {
    workforces: [
      {
        id: workforceId,
        developer_id: userId,
        name: onchainManifest.name,
        slug: "safe-onchain",
        category: onchainManifest.category,
        description: onchainManifest.description,
        deployment_mode: onchainManifest.deploymentMode,
        execution_backend: onchainManifest.executionBackend,
        availability_status: "available",
        pricing_model: onchainManifest.pricingModel,
        reputation_summary: {},
        last_health_check_at: now,
        created_at: now,
        updated_at: now
      },
      {
        id: landingWorkforceId,
        developer_id: userId,
        name: landingManifest.name,
        slug: "landing-page",
        category: landingManifest.category,
        description: landingManifest.description,
        deployment_mode: landingManifest.deploymentMode,
        execution_backend: landingManifest.executionBackend,
        availability_status: "available",
        pricing_model: landingManifest.pricingModel,
        reputation_summary: {},
        last_health_check_at: now,
        created_at: now,
        updated_at: now
      }
    ],
    workforce_manifests: [
      {
        id: crypto.randomUUID(),
        workforce_id: workforceId,
        version: 1,
        manifest_json: onchainManifest,
        manifest_hash: "onchain-hash",
        manifest_url: null,
        public_endpoint: null,
        og_manifest_ref: null,
        compatibility_status: "compatible",
        created_at: now
      },
      {
        id: crypto.randomUUID(),
        workforce_id: landingWorkforceId,
        version: 1,
        manifest_json: landingManifest,
        manifest_hash: "landing-hash",
        manifest_url: null,
        public_endpoint: null,
        og_manifest_ref: null,
        compatibility_status: "compatible",
        created_at: now
      }
    ]
  };
}
