# Tasks: Taskora Workforce Marketplace

**Input**: Design documents from `/specs/001-taskora-marketplace/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: Test tasks are REQUIRED. Include unit, integration, contract, and end-to-end coverage aligned to each user story and the provider-backed runtime.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript monorepo, shared tooling, and baseline app structure

- [ ] T001 Create the pnpm workspace and Turborepo root configuration in `package.json`, `pnpm-workspace.yaml`, and `turbo.json`
- [ ] T002 Create the web app workspace scaffold in `apps/web/package.json`, `apps/web/tsconfig.json`, and `apps/web/next.config.ts`
- [ ] T003 Create the agent runtime workspace scaffold in `apps/agent-runtime/package.json`, `apps/agent-runtime/tsconfig.json`, and `apps/agent-runtime/src/index.ts`
- [ ] T004 [P] Create shared package scaffolds in `packages/core/package.json`, `packages/supabase/package.json`, `packages/agent-sdk/package.json`, `packages/og/package.json`, `packages/gensyn/package.json`, `packages/keeperhub/package.json`, and `packages/ui/package.json`
- [ ] T005 [P] Configure TypeScript project references and shared compiler options in `tsconfig.base.json` and workspace `tsconfig.json` files
- [ ] T006 [P] Configure linting, formatting, and static analysis in `eslint.config.js`, `.prettierrc`, and `.editorconfig`
- [ ] T007 [P] Configure test runners and coverage defaults in `vitest.config.ts`, `playwright.config.ts`, and `tests/setup/env.ts`
- [ ] T008 [P] Create environment variable templates in `.env.example`, `apps/web/.env.example`, and `apps/agent-runtime/.env.example`
- [ ] T009 [P] Add baseline CI quality gates in `.github/workflows/ci.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create the Supabase project structure and local configuration in `supabase/config.toml` and `supabase/seed.sql`
- [ ] T011 Create the initial Supabase schema migration for core tables in `supabase/migrations/202604250001_taskora_core.sql`
- [ ] T012 [P] Implement generated-type entry points and typed table exports in `packages/supabase/src/types/database.ts` and `packages/supabase/src/types/index.ts`
- [ ] T013 [P] Implement server-side and browser-safe Supabase clients in `packages/supabase/src/clients/server.ts`, `packages/supabase/src/clients/browser.ts`, and `packages/supabase/src/clients/service-role.ts`
- [ ] T014 [P] Implement shared environment parsing and secrets guards in `packages/core/src/config/env.ts` and `apps/agent-runtime/src/config/env.ts`
- [ ] T015 [P] Implement root domain enums and shared Zod primitives in `packages/core/src/domain/enums.ts`, `packages/core/src/domain/ids.ts`, and `packages/core/src/domain/common.ts`
- [ ] T016 Implement manifest, job, payment, settlement, and trace schemas in `packages/core/src/domain/schemas.ts`
- [ ] T017 Implement shared domain DTOs and mappers in `packages/core/src/domain/models.ts` and `packages/core/src/domain/mappers.ts`
- [ ] T018 [P] Implement workforce manifest validation and template helpers in `packages/agent-sdk/src/manifests/schema.ts`, `packages/agent-sdk/src/manifests/templates.ts`, and `packages/agent-sdk/src/manifests/index.ts`
- [ ] T019 [P] Implement role graph, permission policy, and approval gate logic in `packages/agent-sdk/src/role-graph/executor-plan.ts`, `packages/agent-sdk/src/permissions/policies.ts`, and `packages/agent-sdk/src/tracing/events.ts`
- [ ] T020 [P] Implement provider adapter interfaces in `packages/og/src/contracts/og-adapter.ts`, `packages/gensyn/src/contracts/gensyn-adapter.ts`, and `packages/keeperhub/src/contracts/keeperhub-adapter.ts`
- [ ] T021 [P] Implement mock provider adapters in `packages/og/src/mock/mock-og-adapter.ts`, `packages/gensyn/src/mock/mock-gensyn-adapter.ts`, and `packages/keeperhub/src/mock/mock-keeperhub-adapter.ts`
- [ ] T022 [P] Implement runtime integration factory wiring in `apps/agent-runtime/src/integrations/factory.ts`
- [ ] T023 Implement shared auth, profile, and RLS-aware repository helpers in `packages/supabase/src/helpers/profiles.ts`, `packages/supabase/src/helpers/jobs.ts`, and `packages/supabase/src/helpers/workforces.ts`
- [ ] T024 [P] Implement shared UI shell, navigation, and state components in `packages/ui/src/components/app-shell.tsx`, `packages/ui/src/components/page-state.tsx`, and `packages/ui/src/components/navigation.tsx`
- [ ] T025 [P] Implement web app auth bootstrap and route guards in `apps/web/lib/auth.ts`, `apps/web/middleware.ts`, and `apps/web/app/(app)/layout.tsx`
- [ ] T026 [P] Configure shared logging, error serialization, and request tracing in `packages/core/src/observability/logger.ts`, `packages/core/src/observability/errors.ts`, and `apps/agent-runtime/src/services/request-context.ts`
- [ ] T027 [P] Create foundational unit coverage for schemas, adapters, and permissions in `tests/unit/core-schemas.test.ts`, `tests/unit/provider-adapters.test.ts`, and `tests/unit/role-permissions.test.ts`
- [ ] T028 [P] Create migration and repository integration coverage in `tests/integration/supabase-schema.test.ts` and `tests/integration/supabase-helpers.test.ts`
- [ ] T029 Define the shared UX state checklist and performance assertions in `apps/web/lib/ux-criteria.ts` and `tests/integration/performance-budgets.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Post And Buy Specialized Work (Priority: P1) MVP

**Goal**: Let a human post a job, receive deterministic classification and compatible workforce matches, authorize payment, and reach a job detail page.

**Independent Test**: A customer can post a supported job, see compatible workforces ranked with pricing and deployment details, authorize payment, and open a job detail page with current status and selected workforce.

### Tests for User Story 1 (REQUIRED)

- [ ] T030 [P] [US1] Add unit tests for deterministic classification and ranking in `tests/unit/job-classification.test.ts`
- [ ] T031 [P] [US1] Add contract tests for jobs and payment authorization APIs in `tests/contract/control-plane-jobs.test.ts`
- [ ] T032 [P] [US1] Add integration coverage for posting and matching flows in `tests/integration/job-posting-and-matching.test.ts`
- [ ] T033 [P] [US1] Add end-to-end coverage for the buyer MVP journey in `tests/e2e/buyer-post-job.spec.ts`

### Implementation for User Story 1

- [ ] T034 [P] [US1] Implement deterministic classification logic in `packages/core/src/classification/classifier.ts`
- [ ] T035 [P] [US1] Implement workforce compatibility and ranking logic in `packages/core/src/matching/matcher.ts`
- [ ] T036 [P] [US1] Implement job and classification repositories in `packages/supabase/src/helpers/jobs.ts` and `packages/supabase/src/helpers/job-classifications.ts`
- [ ] T037 [P] [US1] Implement workforce query and ranking repositories in `packages/supabase/src/helpers/workforces.ts`
- [ ] T038 [US1] Implement the `POST /api/jobs` route in `apps/web/app/api/jobs/route.ts`
- [ ] T039 [US1] Implement the `GET /api/jobs` and `GET /api/jobs/[jobId]` routes in `apps/web/app/api/jobs/route.ts` and `apps/web/app/api/jobs/[jobId]/route.ts`
- [ ] T040 [US1] Implement the `POST /api/payments/authorize` and `GET /api/payments/[paymentId]` routes in `apps/web/app/api/payments/authorize/route.ts` and `apps/web/app/api/payments/[paymentId]/route.ts`
- [ ] T041 [P] [US1] Build the landing page and top-level marketplace navigation in `apps/web/app/page.tsx` and `apps/web/components/marketing/hero.tsx`
- [ ] T042 [P] [US1] Build the human job posting form in `apps/web/app/(app)/jobs/new/page.tsx` and `apps/web/components/jobs/job-post-form.tsx`
- [ ] T043 [P] [US1] Build the workforce matching list and comparison UI in `apps/web/app/(app)/jobs/[jobId]/matches/page.tsx` and `apps/web/components/workforces/workforce-match-list.tsx`
- [ ] T044 [US1] Build the initial job detail page with status summary and selected workforce panel in `apps/web/app/(app)/jobs/[jobId]/page.tsx` and `apps/web/components/jobs/job-summary-panel.tsx`
- [ ] T045 [US1] Build the payment authorization panel and empty-state handling in `apps/web/components/payments/payment-authorization-panel.tsx`
- [ ] T046 [US1] Validate UX states and performance budgets for posting and matching in `tests/integration/us1-ux-and-performance.test.ts`

**Checkpoint**: User Story 1 should now support the marketplace MVP from job creation through payment authorization and initial job detail display.

---

## Phase 4: User Story 2 - Governed Workforce Execution With Traceability (Priority: P1)

**Goal**: Execute selected workforces through the runtime with role-graph enforcement, visible trace events, approval gates, and provider-backed references.

**Independent Test**: A matched job can be handed to the runtime, processed through its role graph, blocked or advanced by approvals, and displayed in a live or refreshable trace that includes 0G, Gensyn, and KeeperHub references where applicable.

### Tests for User Story 2 (REQUIRED)

- [ ] T047 [P] [US2] Add unit tests for role graph execution and approval gate enforcement in `tests/unit/role-graph-execution.test.ts`
- [ ] T048 [P] [US2] Add unit tests for trace event creation and provider handoff rules in `tests/unit/runtime-trace-and-handoffs.test.ts`
- [ ] T049 [P] [US2] Add contract tests for runtime APIs in `tests/contract/agent-runtime-api.test.ts`
- [ ] T050 [P] [US2] Add integration coverage for Safe Onchain Execution runtime flow in `tests/integration/safe-onchain-runtime-flow.test.ts`
- [ ] T051 [P] [US2] Add end-to-end coverage for the trace timeline and approval states in `tests/e2e/job-trace-and-approvals.spec.ts`

### Implementation for User Story 2

- [ ] T052 [P] [US2] Implement runtime job loader and execution planner in `apps/agent-runtime/src/services/job-loader.ts` and `apps/agent-runtime/src/orchestrator/execution-plan.ts`
- [ ] T053 [P] [US2] Implement local role executor and Gensyn delegation executor in `apps/agent-runtime/src/executors/local-role-executor.ts` and `apps/agent-runtime/src/executors/gensyn-role-executor.ts`
- [ ] T054 [P] [US2] Implement runtime trace persistence and 0G publication services in `apps/agent-runtime/src/services/trace-service.ts` and `packages/og/src/providers/og-storage-adapter.ts`
- [ ] T055 [P] [US2] Implement KeeperHub execution and settlement handoff service in `apps/agent-runtime/src/services/keeperhub-service.ts` and `packages/keeperhub/src/providers/keeperhub-http-adapter.ts`
- [ ] T056 [P] [US2] Implement Gensyn workload submission and verification service in `apps/agent-runtime/src/services/gensyn-service.ts` and `packages/gensyn/src/providers/gensyn-http-adapter.ts`
- [ ] T057 [US2] Implement runtime orchestration and approval checkpoint logic in `apps/agent-runtime/src/orchestrator/runtime-orchestrator.ts`
- [ ] T058 [US2] Implement the `POST /runtime/jobs/[jobId]/run`, `GET /runtime/jobs/[jobId]/status`, `POST /runtime/workforces/[workforceId]/test`, and `GET /runtime/health` routes in `apps/agent-runtime/src/routes/jobs.ts`, `apps/agent-runtime/src/routes/workforces.ts`, and `apps/agent-runtime/src/routes/health.ts`
- [ ] T059 [P] [US2] Implement runtime-facing Supabase helpers for trace events, approvals, and integration references in `packages/supabase/src/helpers/job-trace-events.ts`, `packages/supabase/src/helpers/review-decisions.ts`, and `packages/supabase/src/helpers/integration-references.ts`
- [ ] T060 [P] [US2] Build the role graph visualizer and trace timeline UI in `apps/web/components/jobs/role-graph-panel.tsx` and `apps/web/components/jobs/trace-timeline.tsx`
- [ ] T061 [P] [US2] Build approval decision and execution reference panels in `apps/web/components/jobs/approval-decision-panel.tsx` and `apps/web/components/jobs/integration-reference-panel.tsx`
- [ ] T062 [US2] Add Supabase Realtime subscription and polling fallback for trace updates in `apps/web/lib/realtime/job-trace.ts` and `apps/web/components/jobs/live-trace-provider.tsx`
- [ ] T063 [US2] Extend the job detail page to display trace, approvals, 0G references, Gensyn references, and KeeperHub execution data in `apps/web/app/(app)/jobs/[jobId]/page.tsx`
- [ ] T064 [US2] Validate UX states and performance budgets for runtime traces and approval blocking in `tests/integration/us2-ux-and-performance.test.ts`

**Checkpoint**: User Story 2 should now support governed execution with an understandable trace, provider references, and enforced approval rules.

---

## Phase 5: User Story 3 - Register And Monetize Specialized Workforces (Priority: P2)

**Goal**: Let developers create, import, validate, and manage specialized workforces in self-hosted or Taskora-hosted modes.

**Independent Test**: A developer can create a workforce from a guided form or manifest, validate it, publish its manifest record, see deployment and connection status, and have the workforce become available for matching only when valid.

### Tests for User Story 3 (REQUIRED)

- [ ] T065 [P] [US3] Add unit tests for workforce manifest validation and templates in `tests/unit/workforce-manifest-validation.test.ts`
- [ ] T066 [P] [US3] Add contract tests for workforce registration APIs in `tests/contract/control-plane-workforces.test.ts`
- [ ] T067 [P] [US3] Add integration coverage for self-hosted and Taskora-hosted registration in `tests/integration/workforce-registration.test.ts`
- [ ] T068 [P] [US3] Add end-to-end coverage for the developer workforce creation flow in `tests/e2e/developer-create-workforce.spec.ts`

### Implementation for User Story 3

- [ ] T069 [P] [US3] Implement developer profile, workforce, role, manifest, deployment, and integration repositories in `packages/supabase/src/helpers/developer-profiles.ts`, `packages/supabase/src/helpers/workforces.ts`, `packages/supabase/src/helpers/workforce-manifests.ts`, and `packages/supabase/src/helpers/deployments.ts`
- [ ] T070 [P] [US3] Implement workforce template and manifest export helpers in `packages/agent-sdk/src/manifests/templates.ts` and `packages/agent-sdk/src/manifests/export.ts`
- [ ] T071 [P] [US3] Implement 0G manifest publication workflow in `apps/agent-runtime/src/services/manifest-publication-service.ts` and `packages/og/src/providers/og-storage-adapter.ts`
- [ ] T072 [P] [US3] Implement workforce compatibility testing and self-hosted health-check service in `apps/agent-runtime/src/services/workforce-compatibility-service.ts`
- [ ] T073 [US3] Implement the `POST /api/workforces`, `GET /api/workforces`, `GET /api/workforces/[workforceId]`, and `POST /api/workforces/[workforceId]/register` routes in `apps/web/app/api/workforces/route.ts`, `apps/web/app/api/workforces/[workforceId]/route.ts`, and `apps/web/app/api/workforces/[workforceId]/register/route.ts`
- [ ] T074 [P] [US3] Build the developer dashboard shell in `apps/web/app/(app)/developer/page.tsx` and `apps/web/components/developer/developer-dashboard.tsx`
- [ ] T075 [P] [US3] Build the workforce creation and registration flow in `apps/web/app/(app)/developer/workforces/new/page.tsx` and `apps/web/components/developer/workforce-form.tsx`
- [ ] T076 [P] [US3] Build the workforce manifest editor and role graph editor in `apps/web/components/developer/manifest-editor.tsx` and `apps/web/components/developer/role-graph-editor.tsx`
- [ ] T077 [P] [US3] Build the workforce detail page with deployment and provider status in `apps/web/app/(app)/workforces/[workforceId]/page.tsx` and `apps/web/components/workforces/workforce-detail-panel.tsx`
- [ ] T078 [US3] Build developer revenue, hosting mode, and connection status widgets in `apps/web/components/developer/revenue-panel.tsx` and `apps/web/components/developer/deployment-status-card.tsx`
- [ ] T079 [US3] Validate UX states and performance budgets for developer onboarding and registration in `tests/integration/us3-ux-and-performance.test.ts`

**Checkpoint**: User Story 3 should now support developer onboarding, workforce creation, validation, and publication.

---

## Phase 6: User Story 4 - Transparent Settlement And Payouts (Priority: P2)

**Goal**: Show clear payment, settlement, fee split, payout, and execution status for every paid job.

**Independent Test**: A completed or failed job shows total amount, Taskora fee, hosting fee, developer payout, authorization status, settlement status, payout status, and the external references that explain the terminal outcome.

### Tests for User Story 4 (REQUIRED)

- [ ] T080 [P] [US4] Add unit tests for payment split calculations and settlement guards in `tests/unit/settlement-calculations.test.ts`
- [ ] T081 [P] [US4] Add unit tests for KeeperHub settlement mirroring in `tests/unit/keeperhub-settlement-mirroring.test.ts`
- [ ] T082 [P] [US4] Add contract tests for payment detail responses in `tests/contract/control-plane-payments.test.ts`
- [ ] T083 [P] [US4] Add integration coverage for settlement and payout visibility in `tests/integration/settlement-visibility.test.ts`
- [ ] T084 [P] [US4] Add end-to-end coverage for settlement detail rendering in `tests/e2e/payment-and-settlement.spec.ts`

### Implementation for User Story 4

- [ ] T085 [P] [US4] Implement payment, settlement, and payout domain services in `packages/core/src/settlement/payment-service.ts`, `packages/core/src/settlement/settlement-service.ts`, and `packages/core/src/settlement/payout-service.ts`
- [ ] T086 [P] [US4] Implement payment, settlement, and payout repositories in `packages/supabase/src/helpers/payments.ts`, `packages/supabase/src/helpers/settlements.ts`, and `packages/supabase/src/helpers/payouts.ts`
- [ ] T087 [P] [US4] Implement KeeperHub settlement synchronization service in `apps/agent-runtime/src/services/settlement-sync-service.ts`
- [ ] T088 [US4] Extend payment authorization and job detail reads to include settlement and payout breakdowns in `apps/web/app/api/payments/authorize/route.ts`, `apps/web/app/api/payments/[paymentId]/route.ts`, and `apps/web/app/api/jobs/[jobId]/route.ts`
- [ ] T089 [P] [US4] Build the payment and settlement detail panel in `apps/web/components/payments/settlement-detail-panel.tsx`
- [ ] T090 [P] [US4] Build developer payout and fee breakdown cards in `apps/web/components/payments/payout-breakdown-card.tsx` and `apps/web/components/developer/payout-status-card.tsx`
- [ ] T091 [US4] Extend the job detail page to surface payout status, settlement references, and failed terminal-state explanations in `apps/web/app/(app)/jobs/[jobId]/page.tsx`
- [ ] T092 [US4] Validate UX states and performance budgets for settlement transparency in `tests/integration/us4-ux-and-performance.test.ts`

**Checkpoint**: User Story 4 should now surface transparent financial state and provider references for completed, failed, and blocked jobs.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalize cross-story quality, demos, docs, and release readiness

- [ ] T093 [P] Add demo seed data for Safe Onchain Execution and Landing Page workforces in `supabase/seed.sql`
- [ ] T094 [P] Add landing page and runtime demo content for the Safe Onchain and Landing Page scenarios in `apps/web/app/(app)/demos/safe-onchain/page.tsx` and `apps/web/app/(app)/demos/landing-page/page.tsx`
- [ ] T095 [P] Document local development, provider modes, migrations, and deployment in `README.md`
- [ ] T096 Harden runtime error mapping, retry behavior, and audit logging across providers in `apps/agent-runtime/src/services/runtime-error-handler.ts` and `apps/agent-runtime/src/orchestrator/retry-policy.ts`
- [ ] T097 [P] Run full quickstart validation and capture gaps in `tests/integration/quickstart-validation.test.ts`
- [ ] T098 Validate all constitution gates in CI and finalize release checklist updates in `.github/workflows/ci.yml` and `specs/001-taskora-marketplace/checklists/requirements.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
- **Polish (Phase 7)**: Depends on the user stories selected for release

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and delivers the marketplace MVP
- **User Story 2 (P1)**: Starts after Foundational and depends on core repositories and runtime scaffolding from Phase 2, but does not depend on US3 or US4
- **User Story 3 (P2)**: Starts after Foundational and can proceed in parallel with US2 once shared manifest and repository infrastructure exists
- **User Story 4 (P2)**: Starts after Foundational and benefits from US1 job/payment routes and US2 runtime settlement references

### Within Each User Story

- Tests must be written and fail before implementation
- Domain logic before route handlers
- Route handlers before UI integration
- UI integration before story-level UX and performance validation

### Suggested Story Order

1. Complete Setup and Foundational phases
2. Deliver **US1** as the MVP
3. Deliver **US2** to unlock real governed runtime behavior
4. Deliver **US3** to unlock developer-side marketplace supply
5. Deliver **US4** to complete transparent marketplace settlement

### Parallel Opportunities

- Setup tasks marked `[P]` can run in parallel after the root workspace exists
- Foundational repository, adapter, UI shell, and test-infra tasks marked `[P]` can run in parallel
- Within **US1**, classification logic, repositories, UI screens, and contract tests can be split across contributors
- Within **US2**, runtime executors, provider adapters, and trace UI can be split across contributors
- Within **US3**, dashboard UI, manifest helpers, and registration APIs can be split across contributors
- Within **US4**, settlement services, repositories, and financial panels can be split across contributors

---

## Parallel Example: User Story 2

```bash
# Launch runtime behavior tests together:
Task: "Add unit tests for role graph execution and approval gate enforcement in tests/unit/role-graph-execution.test.ts"
Task: "Add unit tests for trace event creation and provider handoff rules in tests/unit/runtime-trace-and-handoffs.test.ts"
Task: "Add contract tests for runtime APIs in tests/contract/agent-runtime-api.test.ts"

# Launch implementation tracks together:
Task: "Implement local role executor and Gensyn delegation executor in apps/agent-runtime/src/executors/local-role-executor.ts and apps/agent-runtime/src/executors/gensyn-role-executor.ts"
Task: "Implement runtime trace persistence and 0G publication services in apps/agent-runtime/src/services/trace-service.ts and packages/og/src/providers/og-storage-adapter.ts"
Task: "Build the role graph visualizer and trace timeline UI in apps/web/components/jobs/role-graph-panel.tsx and apps/web/components/jobs/trace-timeline.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the buyer marketplace MVP independently

### Incremental Delivery

1. Setup + Foundational establish the monorepo, schema, adapters, and auth
2. US1 delivers marketplace intake, matching, payment authorization, and initial detail views
3. US2 adds runtime orchestration, trace visibility, approvals, and provider references
4. US3 adds developer-side workforce supply and publication
5. US4 completes settlement and payout transparency

### Parallel Team Strategy

1. One stream owns Supabase and shared package foundations
2. One stream owns the web control plane and UI states
3. One stream owns the runtime and provider adapters
4. Recombine on story checkpoints, not just file completion

---

## Notes

- `[P]` tasks indicate independent file scopes and minimal cross-task blocking
- `[US1]` through `[US4]` provide direct traceability back to the feature spec
- Each user story is independently testable at its checkpoint
- The provider adapters must remain interchangeable between mock and real modes
- The runtime must preserve local fallback behavior for Gensyn-backed execution
- Keep all sensitive credentials server-side and validate that constraint in review
