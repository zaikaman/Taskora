import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

const envFiles = [
  ".env.test",
  ".env",
  "apps/agent-runtime/.env",
  "apps/web/.env",
  "apps/agent-runtime/.env.local",
  "apps/web/.env.local"
];

for (const relativePath of envFiles) {
  const absolutePath = resolve(process.cwd(), relativePath);

  if (existsSync(absolutePath)) {
    config({ path: absolutePath, override: false });
  }
}

process.env.NODE_ENV ??= "test";
process.env.TASKORA_RUNTIME_URL ??= "http://localhost:4001";
process.env.OG_MODE ??= "mock";
process.env.GENSYN_MODE ??= "mock";
process.env.KEEPERHUB_MODE ??= "mock";
