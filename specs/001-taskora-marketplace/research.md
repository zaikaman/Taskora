# Research: Taskora Workforce Marketplace

## Decision 1: Use a pnpm workspace monorepo with Turborepo

- **Decision**: Structure the repository as a TypeScript monorepo using `pnpm` workspaces and Turborepo for build, test, lint, and dev orchestration.
- **Rationale**: The product has two independently deployable applications plus several shared packages. A monorepo keeps domain types, validation schemas, adapters, and Supabase access consistent while still allowing separate deployment targets.
- **Alternatives considered**:
  - Separate repositories for web and runtime: rejected because shared domain contracts and generated database types would drift faster.
  - Single app repository without packages: rejected because adapter boundaries and shared execution logic would become tangled inside app-specific folders.

## Decision 2: Treat Next.js strictly as the control plane

- **Decision**: Use Next.js App Router for all buyer and developer UI, server components and API routes for lightweight control-plane actions, and keep all long-running orchestration in the separate runtime service.
- **Rationale**: The spec explicitly prohibits long-lived agent execution inside Next.js routes. Keeping the web app focused on interactive workflows, reads, writes, and dispatch requests reduces operational coupling and avoids serverless lifecycle mismatches.
- **Alternatives considered**:
  - Running orchestration in Next.js route handlers: rejected because it violates the product constraint and complicates long-running retries and state management.
  - Building the control plane as a separate custom Node server: rejected because Next.js App Router provides the required web experience and server-side integration patterns with less custom infrastructure.

## Decision 3: Use Supabase as the operational source of truth with RLS-first access patterns

- **Decision**: Persist all buyer-visible operational state in Supabase Postgres, use Supabase Auth for identity, enable RLS on user-facing tables, and expose only anon-authenticated access to the browser while reserving the service role for server-side code and the runtime.
- **Rationale**: Taskora needs authenticated dashboards, operational job state, live traces, and financial records with clear access boundaries between customers and developers. Supabase provides managed primitives for those requirements with a clean separation between browser and trusted server access.
- **Alternatives considered**:
  - Using 0G as the primary application database: rejected because 0G is intended here for verifiable references rather than operational UI reads and writes.
  - Bypassing RLS in favor of only server-mediated reads: rejected because the UI still benefits from secure, policy-backed direct reads and Realtime subscriptions.

## Decision 4: Build the agent runtime as a standalone Node.js service with a future queue seam

- **Decision**: Implement `apps/agent-runtime` as a standalone Node.js TypeScript service with an HTTP API for the first version and an orchestration layer whose job intake can later be swapped to Redis, BullMQ, Inngest, Trigger.dev, or another durable queue.
- **Rationale**: The runtime needs to load manifests, execute role graphs, emit trace events, enforce permissions and approvals, and perform retries independently from the web request lifecycle. An explicit intake seam avoids repainting the architecture when durable queueing is introduced later.
- **Alternatives considered**:
  - Starting with a queue-first architecture immediately: rejected for initial scope because HTTP dispatch is simpler for the first delivery and still preserves the future queue boundary.
  - Embedding runtime logic inside the web app: rejected because it conflicts with the separate compute-plane requirement.

## Decision 5: Use deterministic classification and matching first

- **Decision**: Implement job classification and workforce matching as deterministic rules in `packages/core`, driven by category maps, accepted and rejected job types, risk rules, capability requirements, and ranking weights.
- **Rationale**: Deterministic rules are debuggable, testable, and suitable for the initial demo and production-minded first version. They also produce auditable explanations for why a workforce was or was not matched.
- **Alternatives considered**:
  - Starting with an LLM-based classifier: rejected because it would make early behavior harder to reason about and test.
  - Hardcoding demo-specific routing only: rejected because the platform must remain extensible to multiple workforce categories.

## Decision 6: Make the workforce manifest canonical in Supabase and verifiable in 0G

- **Decision**: Validate workforce manifests with Zod, store the canonical manifest JSON and version metadata in Supabase, and publish a verifiable manifest reference to 0G through a dedicated adapter when available.
- **Rationale**: Supabase needs fast operational reads for matching and runtime startup, while 0G provides the verifiable reference layer required by the product. Keeping both surfaces aligned through one canonical manifest contract avoids divergent representations.
- **Alternatives considered**:
  - Storing only normalized role records: rejected because full manifest replay and verification become harder.
  - Storing only raw manifest blobs: rejected because the product still needs normalized querying across workforces, roles, and deployment state.

## Decision 7: Route all inter-role communication and external infra through adapters

- **Decision**: Define stable interfaces in `packages/axl`, `packages/og`, and `packages/keeperhub`, ship mock implementations first, and force both the runtime and any future self-hosted integration flows to call those adapters rather than infrastructure-specific clients directly.
- **Rationale**: The product depends on sponsor infrastructure, but the first version cannot depend on all real integrations being production-ready. Adapter boundaries let the flow stay real while specific providers remain mockable and replaceable.
- **Alternatives considered**:
  - Calling provider SDKs directly from the runtime: rejected because it would couple orchestration logic to vendor details and make testing harder.
  - Stubbing everything at the UI layer only: rejected because runtime and settlement behavior still need integration-shaped execution paths.

## Decision 8: Use Supabase Realtime for trace updates with a polling fallback

- **Decision**: Design the job detail page around `job_trace_events` subscriptions via Supabase Realtime when available, with a polling data source that reuses the same UI state model.
- **Rationale**: The job detail page is the most important screen and benefits from live trace updates. A fallback path is necessary because Realtime rollout or environment setup may lag behind the rest of the product.
- **Alternatives considered**:
  - Polling only: rejected because the product should feel live and trace-forward.
  - Realtime-only with no fallback: rejected because it would create unnecessary fragility in local development and early deployment environments.

## Decision 9: Model settlement explicitly, even with mocked execution

- **Decision**: Represent `payments`, `settlements`, `payouts`, and `integration_references` as first-class records in Supabase and drive approval-gated settlement through the KeeperHub adapter, even when the adapter is mocked.
- **Rationale**: Settlement transparency is a product requirement, not a later integration detail. The data model and UI must already reflect fee splitting, payout status, and execution references.
- **Alternatives considered**:
  - Treating payment as a single status field on `jobs`: rejected because it cannot model authorization, settlement, fee splits, and payout lifecycle cleanly.
  - Deferring settlement modeling until real payments are integrated: rejected because it would distort the core product flow.

## Decision 10: Support planning on `main` by feature directory, not only by branch name

- **Decision**: Allow the local Speckit planning scripts to proceed on `main` when `.specify/feature.json` identifies the active feature directory.
- **Rationale**: The working preference for this repository is to stay on `main`, while Speckit still needs a concrete feature directory to populate. The persisted feature directory already provides that context.
- **Alternatives considered**:
  - Requiring feature branches for planning: rejected because it conflicts with the chosen repository workflow.
  - Skipping the built-in scripts entirely: rejected because keeping Speckit utilities usable is lower friction for future commands.
