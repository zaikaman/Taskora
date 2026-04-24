import { workforceManifestSchema, type WorkforceManifest } from "@taskora/core";

export interface ManifestValidationResult {
  success: boolean;
  data?: WorkforceManifest;
  issues?: string[];
}

export function validateWorkforceManifest(input: unknown): ManifestValidationResult {
  const parsed = workforceManifestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue: { path: (string | number)[]; message: string }) => `${issue.path.join(".")}: ${issue.message}`)
    };
  }

  return {
    success: true,
    data: parsed.data
  };
}
