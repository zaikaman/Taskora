# Implementation Plan: Taskora Workforce Marketplace

**Branch**: `[main]` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-taskora-marketplace/spec.md`

## Summary

Build Taskora as a production-oriented TypeScript monorepo with a Next.js control plane in `apps/web`, a separate long-running agent runtime in `apps/agent-runtime`, Supabase as the operational backend, and adapter packages for 0G, AXL, and KeeperHub. The first implementation prioritizes deterministic job classification and matching, explicit workforce manifests and role graphs, trace-first execution visibility, approval-gated high-risk flows, and mock integrations shaped so real infrastructure can replace them without changing product behavior.

## Technical Context

**Language/Version**: TypeScript 5.x across a Node.js LTS monorepo  
**Primary Dependencies**: Next.js App Router, React, Tailwind CSS, shadcn/ui, Supabase JavaScript client, Zod, Fastify for the runtime HTTP surface, pnpm workspaces, Turborepo, Vitest, Playwright  
**Storage**: Supabase Postgres as operational source of truth, Supabase Auth for identity, Supabase Realtime for trace updates where practical, optional Supabase Storage for deliverables, 0G references persisted alongside Supabase records  
**Testing**: Vitest for unit and service tests, integration tests for Supabase-backed flows and runtime orchestration, Playwright for critical web flows, contract validation for API and manifest shapes  
**Target Platform**: Browser-based web app on Vercel, containerized Node.js runtime on Fly.io, managed Supabase project for Auth/Postgres/Realtime/Storage  
**Project Type**: TypeScript monorepo with a web control plane, a long-running execution service, shared domain packages, and infrastructure adapter packages  
**Performance Goals**: Show classification and matching results within 10 seconds for 95% of normal submissions, surface new trace events within 30 seconds for 95% of completed role steps, render job status context within 3 seconds for 95% of normal detail views  
**Constraints**: Never expose the Supabase service role key to the browser; keep long-running agent execution out of Next.js routes; enforce RLS on user-facing tables; treat 0G as a verifiable reference layer rather than the operational database; keep sponsor integrations behind interchangeable adapters; support local development with mocked integrations through a single monorepo workflow  
**Scale/Scope**: Initial production scope covers the buyer flow, developer onboarding, workforce registration, deterministic matching, runtime orchestration, payment simulation or testnet settlement, and two end-to-end demo workforces with hundreds of workforces, thousands of jobs per month, and dozens to low hundreds of trace events per job

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: Enforce `eslint`, `prettier`, TypeScript project references, shared Zod validation at boundaries, migration review for schema changes, and code review for matching, approval, payout, and runtime orchestration logic.
- Testing Gate: Require unit tests for manifest validation, matching, permissions, approval gating, payment splitting, trace creation, and Supabase helpers; require integration coverage for Safe Onchain Execution and Landing Page demo flows; require contract validation for control-plane APIs, runtime APIs, and manifest schemas.
- UX Consistency Gate: Standardize on Tailwind CSS plus shadcn/ui primitives, shared page shells, and explicit loading, empty, blocked, error, and success states across posting, matching, job detail, workforce registration, and settlement views; include keyboard and screen-reader friendly trace updates and status messaging.
- Performance Gate: Budget classification and matching to the 10 second requirement, trace propagation to 30 seconds, initial status rendering to 3 seconds, and runtime orchestration so long-lived execution does not block control-plane requests; validate using seeded demo flows and targeted latency instrumentation.
- Continuous Verification Gate: Run lint, typecheck, unit tests, integration tests, contract validation, and migration checks in CI on every pull request; treat any waiver as explicit, time-bound, and documented in the implementation record.

Post-design check: PASS. The selected architecture keeps long-running execution outside the web app, keeps sensitive credentials server-only, preserves adapter boundaries, and aligns testing and UX coverage with the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-taskora-marketplace/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── control-plane.openapi.yaml
│   ├── agent-runtime.openapi.yaml
│   └── workforce-manifest.schema.json
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── web/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── app/api/
└── agent-runtime/
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   ├── orchestrator/
    │   └── workers/
    └── tests/

packages/
├── core/
│   ├── src/domain/
│   ├── src/classification/
│   ├── src/matching/
│   └── src/settlement/
├── supabase/
│   ├── src/clients/
│   ├── src/helpers/
│   └── src/types/
├── agent-sdk/
│   ├── src/manifests/
│   ├── src/role-graph/
│   ├── src/permissions/
│   └── src/tracing/
├── og/
│   ├── src/contracts/
│   ├── src/mock/
│   └── src/providers/
├── axl/
│   ├── src/contracts/
│   ├── src/mock/
│   └── src/providers/
├── keeperhub/
│   ├── src/contracts/
│   ├── src/mock/
│   └── src/providers/
└── ui/
    ├── src/components/
    └── src/styles/

supabase/
├── migrations/
├── seed.sql
└── config.toml

tests/
├── integration/
├── contract/
└── e2e/
```

**Structure Decision**: Use a pnpm workspace monorepo with Turborepo orchestration. Keep product-facing code split between `apps/web` and `apps/agent-runtime`, keep domain logic and sponsor integrations in shared packages, and keep Supabase schema management in a root `supabase/` directory so migrations, generated types, and local development remain consistent across the two applications.

## Complexity Tracking

No constitution violations require justification in this plan. The multi-package structure is necessary because the product explicitly separates a web control plane, a long-running runtime, shared domain logic, and replaceable infrastructure adapters.
