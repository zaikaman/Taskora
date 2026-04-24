# Quickstart: Taskora Workforce Marketplace

## Prerequisites

- Node.js LTS
- `pnpm`
- Supabase CLI
- Docker Desktop or another container runtime for local Supabase

## Environment Variables

Create workspace-level environment files for the web app and runtime with these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=
TASKORA_RUNTIME_URL=http://localhost:4001
TASKORA_RUNTIME_SHARED_SECRET=
OG_MODE=mock
OG_API_KEY=
AXL_MODE=mock
AXL_ENDPOINT=
KEEPERHUB_MODE=mock
KEEPERHUB_API_KEY=
PAYMENT_NETWORK=testnet
```

## Bootstrap

1. Install dependencies:

```bash
pnpm install
```

2. Start local Supabase:

```bash
supabase start
```

3. Apply migrations and seed demo data:

```bash
supabase db reset
```

4. Generate Supabase TypeScript types into `packages/supabase`:

```bash
pnpm supabase:types
```

## Run The Apps

Start the web app and the agent runtime together:

```bash
pnpm dev
```

Expected local services:

- Web control plane: `http://localhost:3000`
- Agent runtime: `http://localhost:4001`
- Supabase local stack: CLI-provided ports

## Seeded Demo Flows

After bootstrapping, the local seed should include at least:

- one Safe Onchain Execution Workforce
- one Landing Page Workforce
- one developer profile with payout configuration
- mock integration settings for 0G, AXL, and KeeperHub

Use these flows to validate the MVP:

1. Post the Safe Onchain Execution prompt from the job creation page.
2. Confirm that the system classifies it as high-risk onchain work and matches the safe onchain workforce.
3. Authorize payment through the mocked settlement flow.
4. Trigger runtime execution and verify planner, builder, auditor, and executor trace events.
5. Confirm that the job detail page shows approval decisions, settlement status, developer payout, Taskora fee, 0G trace reference, and KeeperHub execution reference.
6. Repeat with the Landing Page Workforce demo and verify strategy, copy, build, QA, and delivery trace events without onchain execution.

## Test Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
```

## Deployment Targets

- Deploy `apps/web` to Vercel with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Deploy `apps/agent-runtime` to Fly.io or another container host with the Supabase service role key and runtime integration credentials.
- Keep `SUPABASE_SERVICE_ROLE_KEY` out of browser bundles and front-end environment files.

## Operational Notes

- If Supabase Realtime is not enabled locally, the job detail page should fall back to polling while preserving the same trace presentation.
- Keep 0G, AXL, and KeeperHub in mock mode by default for local development until real credentials are available.
- Migrations are the source of truth for schema changes; generated types must be refreshed after each schema update.
