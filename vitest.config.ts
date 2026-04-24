import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const workspacePath = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@taskora/core", replacement: workspacePath("./packages/core/src/index.ts") },
      { find: /^@taskora\/core\/(.*)$/, replacement: workspacePath("./packages/core/src/$1") },
      { find: "@taskora/supabase", replacement: workspacePath("./packages/supabase/src/index.ts") },
      { find: /^@taskora\/supabase\/(.*)$/, replacement: workspacePath("./packages/supabase/src/$1") },
      { find: "@taskora/agent-sdk", replacement: workspacePath("./packages/agent-sdk/src/index.ts") },
      { find: /^@taskora\/agent-sdk\/(.*)$/, replacement: workspacePath("./packages/agent-sdk/src/$1") },
      { find: "@taskora/og", replacement: workspacePath("./packages/og/src/index.ts") },
      { find: /^@taskora\/og\/(.*)$/, replacement: workspacePath("./packages/og/src/$1") },
      { find: "@taskora/gensyn", replacement: workspacePath("./packages/gensyn/src/index.ts") },
      { find: /^@taskora\/gensyn\/(.*)$/, replacement: workspacePath("./packages/gensyn/src/$1") },
      { find: "@taskora/keeperhub", replacement: workspacePath("./packages/keeperhub/src/index.ts") },
      { find: /^@taskora\/keeperhub\/(.*)$/, replacement: workspacePath("./packages/keeperhub/src/$1") }
    ]
  },
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
