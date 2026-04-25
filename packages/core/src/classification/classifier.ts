import { jobClassificationSchema, jobCreateSchema } from "../domain/schemas.js";
import type { JobClassification, JobCreateInput } from "../domain/models.js";

export const classifierVersion = "taskora-keyword-v1";

export interface ClassifyJobInput extends JobCreateInput {
  jobId: string;
}

interface ClassificationRule {
  category: string;
  jobType: string;
  riskLevel: "low" | "medium" | "high";
  capabilities: string[];
  keywords: string[];
}

const classificationRules: ClassificationRule[] = [
  {
    category: "onchain",
    jobType: "safe_onchain_execution",
    riskLevel: "high",
    capabilities: ["smart_contracts", "audit", "approval_gates", "keeperhub_execution"],
    keywords: [
      "escrow",
      "onchain",
      "on-chain",
      "testnet",
      "mainnet",
      "contract",
      "solidity",
      "wallet",
      "deposit",
      "blockchain"
    ]
  },
  {
    category: "marketing",
    jobType: "landing_page",
    riskLevel: "low",
    capabilities: ["frontend", "copywriting", "design_review", "web_delivery"],
    keywords: ["landing page", "marketing site", "website", "homepage", "hero", "launch page"]
  },
  {
    category: "research",
    jobType: "market_research",
    riskLevel: "medium",
    capabilities: ["research", "synthesis", "source_review"],
    keywords: ["market research", "competitor", "analysis", "report", "survey"]
  }
];

export function classifyJob(input: ClassifyJobInput): JobClassification {
  const parsed = jobCreateSchema.parse(input);
  const normalizedText = `${parsed.title} ${parsed.description}`.toLowerCase();
  const matchedRule = classificationRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedText.includes(keyword))
  );

  const rule =
    matchedRule ??
    ({
      category: "general",
      jobType: "unsupported",
      riskLevel: "medium",
      capabilities: ["manual_review"],
      keywords: []
    } satisfies ClassificationRule);

  return jobClassificationSchema.parse({
    jobId: input.jobId,
    category: rule.category,
    jobType: rule.jobType,
    riskLevel: rule.riskLevel,
    requiredCapabilities: rule.capabilities,
    budgetFit: determineBudgetFit(parsed.budget.amount, rule.jobType),
    matchingExplanation: {
      matchedKeywords: rule.keywords.filter((keyword) => normalizedText.includes(keyword)),
      deterministicRule: rule.jobType,
      title: parsed.title
    },
    classifierVersion
  });
}

function determineBudgetFit(amount: number, jobType: string): string {
  const minimumBudgets: Record<string, number> = {
    safe_onchain_execution: 500,
    smart_contract_deployment: 500,
    landing_page: 300,
    marketing_site: 300,
    market_research: 250
  };
  const minimum = minimumBudgets[jobType] ?? 100;

  if (amount < minimum * 0.75) {
    return "below_typical";
  }

  if (amount > minimum * 3) {
    return "above_typical";
  }

  return "within_typical";
}
