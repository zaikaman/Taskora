import { describe, expect, it } from "vitest";
import { createManifestTemplate } from "../../packages/agent-sdk/src/manifests/templates.ts";
import { classifyJob } from "../../packages/core/src/classification/classifier.ts";
import { rankWorkforcesForJob, type MatchableWorkforce } from "../../packages/core/src/matching/matcher.ts";

describe("job classification and workforce ranking", () => {
  it("classifies escrow contract work as high-risk onchain execution", () => {
    const classification = classifyJob({
      jobId: crypto.randomUUID(),
      title: "Deploy an escrow contract",
      description: "Deploy a simple escrow contract on testnet after audit approval.",
      budget: {
        amount: 1200,
        currency: "usd"
      }
    });

    expect(classification.category).toBe("onchain");
    expect(classification.jobType).toBe("safe_onchain_execution");
    expect(classification.riskLevel).toBe("high");
    expect(classification.requiredCapabilities).toContain("approval_gates");
    expect(classification.budgetFit).toBe("within_typical");
  });

  it("classifies landing page work as low-risk marketing delivery", () => {
    const classification = classifyJob({
      jobId: crypto.randomUUID(),
      title: "Landing page for habit tracker",
      description: "Build a beautiful landing page for my AI habit tracker.",
      budget: {
        amount: 450,
        currency: "USD"
      }
    });

    expect(classification.category).toBe("marketing");
    expect(classification.jobType).toBe("landing_page");
    expect(classification.riskLevel).toBe("low");
  });

  it("ranks only compatible specialized workforces", () => {
    const classification = classifyJob({
      jobId: crypto.randomUUID(),
      title: "Deploy escrow contract",
      description: "Deploy a simple escrow contract on testnet and run a small deposit.",
      budget: {
        amount: 700,
        currency: "USD"
      }
    });
    const safeOnchain = createMatchableWorkforce(createManifestTemplate("safe-onchain"));
    const landingPage = createMatchableWorkforce(createManifestTemplate("landing-page"));
    const result = rankWorkforcesForJob(classification, [landingPage, safeOnchain]);

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.workforce.name).toBe("Safe Onchain Execution Workforce");
    expect(result.excluded[0]?.reason).toMatch(/does not accept/i);
  });
});

function createMatchableWorkforce(manifest: ReturnType<typeof createManifestTemplate>): MatchableWorkforce {
  return {
    id: crypto.randomUUID(),
    developerId: crypto.randomUUID(),
    name: manifest.name,
    slug: manifest.name.toLowerCase().replaceAll(" ", "-"),
    category: manifest.category,
    description: manifest.description,
    deploymentMode: manifest.deploymentMode,
    executionBackend: manifest.executionBackend,
    availabilityStatus: manifest.availabilityStatus,
    pricingModel: manifest.pricingModel,
    reputationSummary: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    acceptedJobTypes: manifest.acceptedJobTypes,
    rejectedJobTypes: manifest.rejectedJobTypes
  };
}
