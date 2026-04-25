import type { JobClassification, WorkforceMatch, WorkforceSummary } from "../domain/models.js";

export interface MatchableWorkforce extends WorkforceSummary {
  acceptedJobTypes: string[];
  rejectedJobTypes: string[];
}

export interface WorkforceMatchingResult {
  matches: WorkforceMatch[];
  excluded: Array<{
    workforce: WorkforceSummary;
    reason: string;
  }>;
}

export function rankWorkforcesForJob(
  classification: JobClassification,
  workforces: MatchableWorkforce[]
): WorkforceMatchingResult {
  const matches: WorkforceMatch[] = [];
  const excluded: WorkforceMatchingResult["excluded"] = [];

  for (const workforce of workforces) {
    const exclusionReason = getExclusionReason(classification, workforce);

    if (exclusionReason) {
      excluded.push({ workforce, reason: exclusionReason });
      continue;
    }

    const specializationFitScore = getSpecializationFitScore(classification, workforce);
    const priceScore = getPriceScore(classification, workforce);
    const availabilityScore = workforce.availabilityStatus === "available" ? 1 : 0;
    const totalScore = roundScore(
      specializationFitScore * 0.55 + priceScore * 0.25 + availabilityScore * 0.2
    );

    matches.push({
      workforce,
      specializationFitScore,
      priceScore,
      availabilityScore,
      totalScore,
      rankingReason: buildRankingReason(classification, workforce, specializationFitScore, priceScore),
      acceptedJobTypes: workforce.acceptedJobTypes,
      rejectedJobTypes: workforce.rejectedJobTypes
    });
  }

  return {
    matches: matches.sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }

      return left.workforce.name.localeCompare(right.workforce.name);
    }),
    excluded
  };
}

function getExclusionReason(
  classification: JobClassification,
  workforce: MatchableWorkforce
): string | null {
  if (workforce.availabilityStatus !== "available") {
    return "Workforce is not available.";
  }

  if (workforce.rejectedJobTypes.includes(classification.jobType)) {
    return "Workforce explicitly rejects this job type.";
  }

  if (!workforce.acceptedJobTypes.includes(classification.jobType)) {
    return "Workforce does not accept this job type.";
  }

  return null;
}

function getSpecializationFitScore(
  classification: JobClassification,
  workforce: MatchableWorkforce
): number {
  const categoryScore = workforce.category === classification.category ? 0.45 : 0.15;
  const acceptedJobScore = workforce.acceptedJobTypes.includes(classification.jobType) ? 0.45 : 0;
  const rejectionClarityScore = workforce.rejectedJobTypes.length > 0 ? 0.1 : 0.05;

  return roundScore(categoryScore + acceptedJobScore + rejectionClarityScore);
}

function getPriceScore(classification: JobClassification, workforce: MatchableWorkforce): number {
  const amount = workforce.pricingModel.amount;

  if (!amount || workforce.pricingModel.mode === "quote_required") {
    return 0.5;
  }

  const targetBudgetByFit: Record<string, number> = {
    below_typical: amount * 0.75,
    within_typical: amount,
    above_typical: amount * 1.5
  };
  const targetBudget = targetBudgetByFit[classification.budgetFit] ?? amount;
  const ratio = Math.min(targetBudget, amount) / Math.max(targetBudget, amount);

  return roundScore(Math.max(0.25, ratio));
}

function buildRankingReason(
  classification: JobClassification,
  workforce: MatchableWorkforce,
  specializationFitScore: number,
  priceScore: number
): string {
  return `${workforce.name} accepts ${classification.jobType} with specialization score ${specializationFitScore.toFixed(
    2
  )} and price score ${priceScore.toFixed(2)}.`;
}

function roundScore(score: number): number {
  return Math.round(score * 100) / 100;
}
