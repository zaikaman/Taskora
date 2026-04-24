import type { WorkforceManifest } from "@taskora/core";

export type ManifestTemplateName = "safe-onchain" | "landing-page";

const baseIntegrations = {
  og: {
    publishManifest: true,
    publishTrace: true,
    publishRoleMemory: false,
    enableInferenceHooks: false
  },
  gensyn: {
    enabled: false,
    network: "testnet",
    workloadMode: "optional" as const,
    verificationRequired: false
  },
  keeperhub: {
    enabled: false,
    executionMode: "none" as const,
    supportedChains: []
  }
};

export function createManifestTemplate(templateName: ManifestTemplateName): WorkforceManifest {
  if (templateName === "safe-onchain") {
    return {
      name: "Safe Onchain Execution Workforce",
      category: "onchain",
      description: "Plans, builds, audits, approves, and executes governed onchain jobs.",
      acceptedJobTypes: ["safe_onchain_execution", "smart_contract_deployment"],
      rejectedJobTypes: ["generic_anything"],
      deploymentMode: "taskora_hosted",
      executionBackend: "hybrid",
      roles: [
        {
          key: "planner",
          name: "Planner",
          purpose: "Produce a safe execution plan.",
          prompt: "Plan the job carefully and emit explicit execution steps.",
          permissions: ["canPlan"],
          tools: ["spec-reader"],
          inputExpectations: {},
          outputExpectations: {},
          executionMode: "local"
        },
        {
          key: "auditor",
          name: "Auditor",
          purpose: "Review the produced execution plan and artifacts.",
          prompt: "Audit the proposed changes and reject unsafe operations.",
          permissions: ["canReview", "canApprove"],
          tools: ["trace-viewer"],
          inputExpectations: {},
          outputExpectations: {},
          executionMode: "local"
        },
        {
          key: "executor",
          name: "Executor",
          purpose: "Execute approved onchain actions.",
          prompt: "Only execute when approval requirements are satisfied.",
          permissions: ["canExecuteOnchain"],
          tools: ["keeperhub"],
          inputExpectations: {},
          outputExpectations: {},
          executionMode: "keeperhub_only"
        }
      ],
      roleGraphEdges: [
        { from: "planner", to: "auditor", type: "review_gate", condition: {} },
        { from: "auditor", to: "executor", type: "approval_gate", condition: {} }
      ],
      approvalPolicy: {
        mode: "auditor_required",
        minimumApprovals: 1,
        executionRequiresIndependentApprover: true
      },
      tools: ["keeperhub", "trace-viewer"],
      pricingModel: {
        mode: "fixed",
        amount: 500,
        currency: "USD",
        hostingFeeMode: "percentage",
        hostingFeeValue: 15
      },
      payoutAddress: "dev-wallet-safe-onchain",
      exampleJobs: ["Deploy an escrow contract on testnet after audit approval."],
      availabilityStatus: "available",
      integrations: {
        ...baseIntegrations,
        gensyn: {
          enabled: true,
          network: "testnet",
          workloadMode: "preferred",
          verificationRequired: true
        },
        keeperhub: {
          enabled: true,
          executionMode: "workflow",
          supportedChains: ["ethereum-sepolia"]
        }
      }
    };
  }

  return {
    name: "Landing Page Workforce",
    category: "marketing",
    description: "Creates and reviews focused landing pages for product launches.",
    acceptedJobTypes: ["landing_page", "marketing_site"],
    rejectedJobTypes: ["smart_contract_deployment"],
    deploymentMode: "taskora_hosted",
    executionBackend: "local_runtime",
    roles: [
      {
        key: "strategist",
        name: "Strategist",
        purpose: "Define the page strategy and messaging.",
        prompt: "Produce a concise page strategy and outline.",
        permissions: ["canPlan"],
        tools: ["brief-reader"],
        inputExpectations: {},
        outputExpectations: {},
        executionMode: "local"
      },
      {
        key: "builder",
        name: "Builder",
        purpose: "Implement the landing page artifacts.",
        prompt: "Translate the outline into a production-ready page implementation.",
        permissions: ["canBuildArtifact"],
        tools: ["builder"],
        inputExpectations: {},
        outputExpectations: {},
        executionMode: "local"
      },
      {
        key: "reviewer",
        name: "Reviewer",
        purpose: "Review the final deliverable before release.",
        prompt: "Check clarity, quality, and consistency.",
        permissions: ["canReview", "canApprove"],
        tools: ["qa"],
        inputExpectations: {},
        outputExpectations: {},
        executionMode: "local"
      }
    ],
    roleGraphEdges: [
      { from: "strategist", to: "builder", type: "depends_on", condition: {} },
      { from: "builder", to: "reviewer", type: "review_gate", condition: {} }
    ],
    approvalPolicy: {
      mode: "reviewer_required",
      minimumApprovals: 1,
      executionRequiresIndependentApprover: false
    },
    tools: ["builder", "qa"],
    pricingModel: {
      mode: "starting_at",
      amount: 300,
      currency: "USD",
      hostingFeeMode: "flat",
      hostingFeeValue: 50
    },
    payoutAddress: "dev-wallet-landing-page",
    exampleJobs: ["Build a beautiful landing page for an AI habit tracker."],
    availabilityStatus: "available",
    integrations: baseIntegrations
  };
}

export function listManifestTemplates(): ManifestTemplateName[] {
  return ["safe-onchain", "landing-page"];
}
