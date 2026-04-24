import { describe, expect, it } from "vitest";
import { createJobForCustomer, getJobForCustomer, listJobsForCustomer, selectWorkforceForJob } from "../../packages/supabase/src/helpers/jobs.ts";
import { getAuthenticatedProfile, upsertProfile } from "../../packages/supabase/src/helpers/profiles.ts";
import { createWorkforceForDeveloper, getWorkforceById, listAvailableWorkforces } from "../../packages/supabase/src/helpers/workforces.ts";
import { FakeSupabaseClient } from "./support/fake-supabase.ts";

describe("supabase helpers", () => {
  it("upserts and reads the authenticated profile", async () => {
    const userId = crypto.randomUUID();
    const client = new FakeSupabaseClient(userId);

    await upsertProfile(client, {
      displayName: "Taskora Builder",
      defaultRoleMode: "both"
    });

    const profile = await getAuthenticatedProfile(client);

    expect(profile.id).toBe(userId);
    expect(profile.defaultRoleMode).toBe("both");
  });

  it("creates, lists, and updates customer jobs with viewer scoping", async () => {
    const userId = crypto.randomUUID();
    const client = new FakeSupabaseClient(userId);

    const createdJob = await createJobForCustomer(client, {
      title: "Landing page build",
      description: "Build a polished landing page for a launch next week.",
      budget: {
        amount: 450,
        currency: "USD"
      }
    });

    const listedJobs = await listJobsForCustomer(client);
    const updatedJob = await selectWorkforceForJob(client, {
      jobId: createdJob.id,
      workforceId: crypto.randomUUID()
    });
    const fetchedJob = await getJobForCustomer(client, createdJob.id);

    expect(listedJobs).toHaveLength(1);
    expect(updatedJob.status).toBe("matched");
    expect(fetchedJob.id).toBe(createdJob.id);
  });

  it("creates and reads available workforces", async () => {
    const developerId = crypto.randomUUID();
    const client = new FakeSupabaseClient(developerId);

    const workforce = await createWorkforceForDeveloper(client, {
      name: "Safe Onchain Workforce",
      slug: "safe-onchain",
      category: "onchain",
      description: "High-trust onchain execution with audits.",
      deploymentMode: "taskora_hosted",
      executionBackend: "hybrid",
      pricingModel: { mode: "fixed", amount: 500, currency: "USD" },
      availabilityStatus: "available"
    });

    const listed = await listAvailableWorkforces(client);
    const fetched = await getWorkforceById(client, workforce.id, developerId);

    expect(listed).toHaveLength(1);
    expect(fetched.slug).toBe("safe-onchain");
  });
});
