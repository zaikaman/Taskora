# Implementation Plan: Taskora Workforce Marketplace

**Branch**: `[main]` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-taskora-marketplace/spec.md`

## Summary

Build Taskora as a production-oriented TypeScript monorepo with a Next.js control plane in `apps/web`, a separate long-running runtime in `apps/agent-runtime`, Supabase as the operational backend, 0G as the verifiable registry and trace layer, Gensyn as the decentralized compute and coordination integration, and KeeperHub as the approved onchain execution and reliability layer. The first implementation keeps deterministic matching and approval enforcement inside Taskora, persists all operational state in Supabase, publishes verifiable artifacts to 0G, exposes a Gensyn-backed compute adapter with a local fallback, and delegates approved onchain actions to KeeperHub through production-shaped adapters.

## Technical Context

**Language/Version**: TypeScript 5.x across a Node.js LTS monorepo  
**Primary Dependencies**: Next.js App Router, React, Tailwind CSS, shadcn/ui, Supabase JavaScript client, Zod, Fastify, pnpm workspaces, Turborepo, Vitest, Playwright, official 0G Storage SDK where available, thin HTTP clients for Gensyn and KeeperHub  
**Storage**: Supabase Postgres as the operational source of truth, Supabase Auth for identity, Supabase Realtime for trace updates where practical, optional Supabase Storage for artifacts, 0G for manifest publication, role memory references, audit logs, and final trace references  
**Testing**: Vitest for unit and service tests, integration tests for Supabase-backed flows and runtime orchestration, Playwright for critical web flows, contract validation for API and manifest shapes  
**Target Platform**: Browser-based web app on Vercel, containerized Node.js runtime on Fly.io, managed Supabase project for Auth/Postgres/Realtime/Storage, optional Gensyn testnet-connected compute nodes, KeeperHub-managed onchain workflows across supported EVM networks  
**Project Type**: TypeScript monorepo with a web control plane, a long-running execution service, shared domain packages, and infrastructure adapter packages  
**Performance Goals**: Show classification and matching results within 10 seconds for 95% of normal submissions, surface new trace events within 30 seconds for 95% of completed role steps, render job status context within 3 seconds for 95% of normal detail views, and ensure approved onchain execution requests are handed off to KeeperHub within 10 seconds after the final approval gate passes  
**Constraints**: Never expose the Supabase service role key to the browser; keep long-running execution out of Next.js routes; enforce RLS on user-facing tables; treat 0G as a verifiable reference layer rather than the operational database; treat Gensyn as a decentralized compute and verification backend rather than a simple message bus; treat KeeperHub as the execution reliability layer for onchain actions rather than the primary system of record; support local development with mocked 0G, Gensyn, and KeeperHub adapters; preserve a local executor fallback because Gensyn documentation currently notes that no official swarms are running  
**Scale/Scope**: Initial production scope covers the buyer flow, developer onboarding, workforce registration, deterministic matching, runtime orchestration, payment simulation or testnet settlement, 0G trace publication, Gensyn-ready compute delegation, KeeperHub-backed onchain execution, and two end-to-end demo workforces with hundreds of workforces, thousands of jobs per month, and dozens to low hundreds of trace events per job

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: Enforce `eslint`, `prettier`, TypeScript project references, shared Zod validation at all external boundaries, migration review for schema changes, and code review for matching, approval, payout, Gensyn delegation, 0G publication, and KeeperHub handoff logic.
- Testing Gate: Require unit tests for manifest validation, matching, permissions, approval gating, payment splitting, trace creation, 0G adapter behavior, Gensyn adapter behavior, KeeperHub adapter behavior, and Supabase helpers; require integration coverage for Safe Onchain Execution and Landing Page demo flows; require contract validation for control-plane APIs, runtime APIs, and manifest schemas.
- UX Consistency Gate: Standardize on Tailwind CSS plus shadcn/ui primitives, shared page shells, and explicit loading, empty, blocked, error, and success states across posting, matching, job detail, workforce registration, and settlement views; include accessible trace updates and clear visual separation of Supabase state, 0G references, Gensyn execution status, and KeeperHub execution references.
- Performance Gate: Budget classification and matching to the 10 second requirement, trace propagation to 30 seconds, initial status rendering to 3 seconds, and approved KeeperHub handoff to 10 seconds; validate using seeded demo flows, targeted latency instrumentation, and runtime profiling under mocked and real integration modes.
- Continuous Verification Gate: Run lint, typecheck, unit tests, integration tests, contract validation, and migration checks in CI on every pull request; treat any waiver as explicit, time-bound, and documented in the implementation record.

Post-design check: PASS. The selected architecture keeps long-running execution outside the web app, keeps sensitive credentials server-only, aligns 0G, Gensyn, and KeeperHub with their documented roles, and preserves the adapter boundaries needed for reliable local development and future provider upgrades.

## Project Structure

### Documentation (this feature)

```text
specs/001-taskora-marketplace/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- control-plane.openapi.yaml
|   |-- agent-runtime.openapi.yaml
|   `-- workforce-manifest.schema.json
`-- tasks.md
```

### Source Code (repository root)

```text
apps/
|-- web/
|   |-- app/
|   |-- components/
|   |-- lib/
|   `-- app/api/
`-- agent-runtime/
    |-- src/
    |   |-- routes/
    |   |-- services/
    |   |-- orchestrator/
    |   |-- executors/
    |   `-- integrations/
    `-- tests/

packages/
|-- core/
|   |-- src/domain/
|   |-- src/classification/
|   |-- src/matching/
|   `-- src/settlement/
|-- supabase/
|   |-- src/clients/
|   |-- src/helpers/
|   `-- src/types/
|-- agent-sdk/
|   |-- src/manifests/
|   |-- src/role-graph/
|   |-- src/permissions/
|   `-- src/tracing/
|-- og/
|   |-- src/contracts/
|   |-- src/mock/
|   `-- src/providers/
|-- gensyn/
|   |-- src/contracts/
|   |-- src/mock/
|   `-- src/providers/
|-- keeperhub/
|   |-- src/contracts/
|   |-- src/mock/
|   `-- src/providers/
`-- ui/
    |-- src/components/
    `-- src/styles/

supabase/
|-- migrations/
|-- seed.sql
`-- config.toml

tests/
|-- integration/
|-- contract/
`-- e2e/
```

**Structure Decision**: Use a pnpm workspace monorepo with Turborepo orchestration. Keep product-facing code split between `apps/web` and `apps/agent-runtime`, keep domain logic and provider integrations in shared packages, and keep Supabase schema management in a root `supabase/` directory so migrations, generated types, and local development remain consistent across the web app, runtime, and integration adapters.

## Integration Design

### 0G

- Use 0G as the verifiable artifact and trace layer, not as the operational database.
- Publish the canonical workforce manifest to 0G after Supabase validation succeeds.
- Append important job trace checkpoints and the final trace bundle to 0G.
- Store role memory snapshots or references in 0G when a workforce policy allows externalized memory persistence.
- Persist all resulting 0G URIs or IDs back into Supabase `integration_references`.
- Treat 0G inference hooks as optional and behind an adapter seam. Do not block core workflow completion on 0G inference availability.

### Gensyn

- Use Gensyn as the decentralized compute and coordination integration for Taskora-hosted workforces whose role steps are suitable for delegated compute or verifiable distributed execution.
- Keep Taskora's own runtime as the orchestration authority that decides whether each role step runs locally or through the Gensyn adapter.
- Represent Gensyn usage as role-step execution attempts with workload submission, status tracking, verification result, and completion references stored in Supabase.
- Preserve a local executor fallback with the same interface for development, unsupported workloads, or when no compatible Gensyn swarm is available.
- Do not model Gensyn as the primary buyer-facing message timeline. Taskora remains responsible for the human-readable trace; Gensyn contributes compute and verification references that Taskora surfaces.

### KeeperHub

- Use KeeperHub as the onchain execution and reliability layer for approved blockchain actions and onchain settlement steps.
- Model KeeperHub usage around workflow creation or direct execution requests initiated only after Taskora approval policies pass.
- Record KeeperHub workflow, run, settlement, and execution references in Supabase `integration_references`.
- Mirror execution and settlement status into Taskora-owned `payments`, `settlements`, and `payouts` records so the UI remains consistent even when KeeperHub is temporarily unavailable.
- Keep final release gating inside Taskora domain logic: Taskora decides whether a payment or onchain action is eligible; KeeperHub performs the approved action reliably.

## Delivery Phases

### Phase 0: Research And Provider Alignment

- Finalize the adapter responsibilities for 0G, Gensyn, and KeeperHub using their current official docs.
- Document where the providers fit the product and where Taskora must keep independent logic.
- Resolve one critical constraint from provider reality: Gensyn integration must remain optional and fallback-friendly because the public docs currently indicate no official swarms are running.

### Phase 1: Domain And Contract Design

- Finalize shared Zod schemas for manifests, jobs, classifications, trace events, review decisions, payments, settlements, and integration references.
- Expand the workforce manifest contract to include explicit integration bindings for 0G, Gensyn, and KeeperHub.
- Finalize control-plane and runtime API contracts with explicit integration reference fields.
- Finalize Supabase schema design for integration-aware execution and payout visibility.

### Phase 2: Implementation Planning

- Implement shared domain types and validation.
- Add Supabase migrations and generated types.
- Build the runtime orchestration core with local execution first, then wire 0G, Gensyn, and KeeperHub adapters.
- Build the buyer and developer UI with the job detail page as the anchor surface.
- Add integration tests for both demo scenarios under mocked providers before enabling any real provider mode.

## Complexity Tracking

No constitution violations require justification in this plan. The multi-package structure is necessary because the product explicitly separates a web control plane, a long-running runtime, and three provider-facing integration layers with independent operational concerns.
