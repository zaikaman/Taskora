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

## Decision 4: Build the runtime as a standalone Node.js service with a future queue seam

- **Decision**: Implement `apps/agent-runtime` as a standalone Node.js TypeScript service with an HTTP API for the first version and an orchestration layer whose intake can later be swapped to Redis, BullMQ, Inngest, Trigger.dev, or another durable queue.
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

## Decision 6: Use 0G for verifiable manifests, memory, and traces

- **Decision**: Integrate 0G as the verifiable storage and reference layer for published workforce manifests, role memory snapshots, audit logs, and final job traces while keeping Supabase as the operational system of record.
- **Rationale**: 0G's docs currently position the platform around decentralized storage, inference, and developer-facing storage SDKs, including TypeScript support. That matches Taskora's need for verifiable artifact publication without replacing the operational database.
- **Alternatives considered**:
  - Storing only manifest hashes in Supabase without off-platform publication: rejected because the product explicitly calls for visible verifiable references.
  - Using 0G as the only state store: rejected because buyer-facing and developer-facing workflows require relational queries, RLS, and low-friction operational reads.

## Decision 7: Treat Gensyn as decentralized compute and verification, not a simple transport adapter

- **Decision**: Replace the earlier transport-only concept with a `packages/gensyn` integration that represents delegated compute, verification, peer coordination, and workload references for eligible hosted role steps.
- **Rationale**: Gensyn's docs describe four core layers: execution, trustless verification, peer-to-peer communication, and decentralized coordination. That makes it a better conceptual fit for delegated compute and verified workload execution than for simple message passing. The runtime should decide which role steps stay local and which are submitted through the Gensyn adapter.
- **Alternatives considered**:
  - Modeling Gensyn as only an inter-agent message bus: rejected because it underuses the protocol's documented compute and verification role.
  - Requiring all role steps to execute on Gensyn immediately: rejected because the public docs currently note that there are no official swarms running, so Taskora needs a local fallback to stay shippable.

## Decision 8: Use KeeperHub for approved onchain execution and workflow reliability

- **Decision**: Integrate KeeperHub as the execution and reliability layer for approved onchain actions, including workflow creation or direct execution requests after Taskora's approval policy succeeds.
- **Rationale**: KeeperHub's docs and site position it as an execution layer for onchain agents with REST, MCP, and CLI surfaces, managed workflows, retries, gas estimation, transaction ordering, and wallet security. That maps directly to Taskora's need to hand off approved onchain work rather than reimplement transaction reliability itself.
- **Alternatives considered**:
  - Building raw transaction execution inside Taskora: rejected because it would duplicate execution infrastructure and weaken operational reliability.
  - Treating KeeperHub as the primary product database: rejected because Taskora still needs its own payment, settlement, and trace records in Supabase.

## Decision 9: Keep financial state in Taskora even when using KeeperHub

- **Decision**: Persist `payments`, `settlements`, `payouts`, and user-visible fee breakdowns in Supabase even when KeeperHub executes the onchain side of settlement or action approval.
- **Rationale**: KeeperHub focuses on reliable execution. Taskora still needs a stable marketplace ledger and UI state model that remains coherent regardless of provider delays, retries, or provider outages.
- **Alternatives considered**:
  - Treating KeeperHub run history as the only settlement record: rejected because the marketplace must expose buyer-facing and developer-facing payment status in its own domain model.
  - Deferring settlement modeling until real payments are integrated: rejected because settlement transparency is already a core product requirement.

## Decision 10: Use Supabase Realtime for trace updates with a polling fallback

- **Decision**: Design the job detail page around `job_trace_events` subscriptions via Supabase Realtime when available, with a polling data source that reuses the same UI state model.
- **Rationale**: The job detail page is the most important screen and benefits from live trace updates. A fallback path is necessary because Realtime rollout or environment setup may lag behind the rest of the product.
- **Alternatives considered**:
  - Polling only: rejected because the product should feel live and trace-forward.
  - Realtime-only with no fallback: rejected because it would create unnecessary fragility in local development and early deployment environments.

## Decision 11: Support planning on `main` by feature directory, not only by branch name

- **Decision**: Allow the local Speckit planning scripts to proceed on `main` when `.specify/feature.json` identifies the active feature directory.
- **Rationale**: The working preference for this repository is to stay on `main`, while Speckit still needs a concrete feature directory to populate. The persisted feature directory already provides that context.
- **Alternatives considered**:
  - Requiring feature branches for planning: rejected because it conflicts with the chosen repository workflow.
  - Skipping the built-in scripts entirely: rejected because keeping Speckit utilities usable is lower friction for future commands.
