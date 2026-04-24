import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("supabase schema", () => {
  it("defines the foundational migration objects", () => {
    const migration = readFileSync(
      resolve(process.cwd(), "supabase/migrations/202604250001_taskora_core.sql"),
      "utf8"
    );

    expect(migration).toContain("create table if not exists profiles");
    expect(migration).toContain("create table if not exists workforces");
    expect(migration).toContain("create table if not exists jobs");
    expect(migration).toContain("create table if not exists job_trace_events");
    expect(migration).toContain("alter table profiles enable row level security");
    expect(migration).toContain('create policy "jobs_customer_access"');
  });

  it("defines local Supabase config and seed hooks", () => {
    const config = readFileSync(resolve(process.cwd(), "supabase/config.toml"), "utf8");
    const seed = readFileSync(resolve(process.cwd(), "supabase/seed.sql"), "utf8");

    expect(config).toContain('sql_paths = ["./seed.sql"]');
    expect(seed).toContain("Phase 2 foundational seed");
  });
});
