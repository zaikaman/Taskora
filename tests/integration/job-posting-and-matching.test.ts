import { describe, expect, it } from "vitest";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import { classifyJob } from "../../packages/core/src/classification/classifier.ts";
import { createJobForCustomer, getJobDetailForCustomer, updateJobStatus } from "../../packages/supabase/src/helpers/jobs.ts";
import { upsertJobClassification } from "../../packages/supabase/src/helpers/job-classifications.ts";
import { listRankedWorkforceMatches } from "../../packages/supabase/src/helpers/workforces.ts";
import { FakeSupabaseClient } from "./support/fake-supabase.ts";

describe("job posting and matching flow", () => {
  it("persists classification and ranks compatible workforces after posting", async () => {
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();
    const workforceId = crypto.randomUUID();
    const manifest = createManifestTemplate("safe-onchain");
    const client = new FakeSupabaseClient(userId, {
      workforces: [
        {
          id: workforceId,
          developer_id: userId,
          name: manifest.name,
          slug: "safe-onchain",
          category: manifest.category,
          description: manifest.description,
          deployment_mode: manifest.deploymentMode,
          execution_backend: manifest.executionBackend,
          availability_status: "available",
          pricing_model: manifest.pricingModel,
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
          manifest_json: manifest,
          manifest_hash: "manifest-hash",
          manifest_url: null,
          public_endpoint: null,
          og_manifest_ref: null,
          compatibility_status: "compatible",
          created_at: now
        }
      ]
    });
    const jobInput = {
      title: "Deploy escrow contract",
      description: "Deploy a simple escrow contract on testnet and only execute after audit.",
      budget: {
        amount: 800,
        currency: "USD"
      }
    };
    const job = await createJobForCustomer(client, jobInput);
    const classification = await upsertJobClassification(
      client,
      classifyJob({
        ...jobInput,
        jobId: job.id
      })
    );
    const matches = await listRankedWorkforceMatches(client, classification);
    await updateJobStatus(client, { jobId: job.id, status: matches.length > 0 ? "matched" : "classified" });

    const detail = await getJobDetailForCustomer(client, job.id);

    expect(classification.riskLevel).toBe("high");
    expect(matches[0]?.workforce.id).toBe(workforceId);
    expect(detail.classification?.jobType).toBe("safe_onchain_execution");
    expect(detail.status).toBe("matched");
  });
});
