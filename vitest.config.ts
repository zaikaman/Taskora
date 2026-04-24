import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup/env.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["apps/agent-runtime/src/**/*.ts", "packages/**/*.ts"],
      exclude: ["**/*.d.ts", "**/dist/**", "**/node_modules/**"]
    }
  }
});
