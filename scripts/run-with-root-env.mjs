import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const rootEnvPath = resolve(repoRoot, ".env");

if (existsSync(rootEnvPath)) {
  const parsed = parse(readFileSync(rootEnvPath));

  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const [, , command, ...args] = process.argv;

if (!command) {
  console.error("Usage: node scripts/run-with-root-env.mjs <command> [...args]");
  process.exit(1);
}

const commandLine = [command, ...args]
  .map((part) => quoteForShell(part, process.platform))
  .join(" ");

const child =
  process.platform === "win32"
    ? spawn(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", commandLine], {
        cwd: process.cwd(),
        env: process.env,
        stdio: "inherit"
      })
    : spawn(process.env.SHELL ?? "sh", ["-lc", commandLine], {
        cwd: process.cwd(),
        env: process.env,
        stdio: "inherit"
      });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

function quoteForShell(value, platform) {
  if (platform === "win32") {
    if (value.length === 0) {
      return '""';
    }

    if (!/[\s"&|<>^()]/.test(value)) {
      return value;
    }

    return `"${value.replace(/"/g, '""')}"`;
  }

  if (/^[A-Za-z0-9_./:-]+$/.test(value)) {
    return value;
  }

  return `'${value.replace(/'/g, `'\\''`)}'`;
}
