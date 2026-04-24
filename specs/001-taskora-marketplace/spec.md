# Feature Specification: Taskora Workforce Marketplace

**Feature Branch**: `[001-taskora-marketplace]`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "Build Taskora, a marketplace and managed hosting platform for specialized AI agent workforces with workforce manifests, specialized matching, governed execution, transparent traces, and visible settlement."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Post And Buy Specialized Work (Priority: P1)

A human user can describe a paid job, see only compatible specialized workforces, compare the available options, choose a workforce, authorize payment, and track the job through delivery.

**Why this priority**: This is the core marketplace loop. Without it, there is no buyer-side value, no route to revenue, and no way to demonstrate specialization-based matching.

**Independent Test**: Can be fully tested by creating a paid job in a supported category, confirming that only compatible workforces appear, selecting one workforce, authorizing payment, and reaching a visible job detail page with status, trace, and final result.

**Acceptance Scenarios**:

1. **Given** a human posts "Deploy a simple escrow contract on testnet and execute a small test deposit only if audited," **When** the job is submitted, **Then** the platform classifies it as a high-risk onchain job, shows compatible onchain workforces, highlights the declared approval policy, and prevents work from starting until payment is authorized.
2. **Given** a human posts "Build a beautiful landing page for my AI habit tracker," **When** the job is submitted, **Then** the platform classifies it as a frontend or marketing website job, shows compatible landing page workforces, and allows the user to compare price, estimated delivery time, reputation, approval policy, and deployment mode before selection.
3. **Given** a human posts a job that no registered specialized workforce accepts, **When** matching completes, **Then** the platform shows that no compatible workforce is available, explains why the job was not matched, and does not capture or release payment for that job.

---

### User Story 2 - Governed Workforce Execution With Traceability (Priority: P1)

Once a workforce is selected, the platform runs the job through the workforce's declared role graph, records every meaningful step in a visible trace, and enforces all required review, audit, and human approval gates before delivery or irreversible actions.

**Why this priority**: Trust is the differentiator for paid agent work. Buyers must be able to see what happened, and high-risk execution must be governed instead of opaque.

**Independent Test**: Can be fully tested by sending a matched job into the runtime, observing role-by-role trace events and inter-role messages, validating that required approvals are enforced, and confirming that irreversible execution and payment release stay blocked until policy conditions are satisfied.

**Acceptance Scenarios**:

1. **Given** a high-risk onchain job assigned to a Safe Onchain Execution Workforce, **When** the workforce processes the job, **Then** the platform records trace events for planning, building, auditing, approval, execution, and settlement, and execution remains blocked until the required independent approval is recorded.
2. **Given** a quality-sensitive or security-sensitive job that requires review, **When** a reviewer or auditor rejects the produced artifact, **Then** the job cannot advance to final delivery, payment release, or irreversible execution, and the rejection is visible in the job trace and status.
3. **Given** a multi-agent workforce with distinct roles, **When** agents exchange structured messages during execution, **Then** the platform exposes those messages or their summaries in the trace with role attribution and sequence context that a human can follow.

---

### User Story 3 - Register And Monetize Specialized Workforces (Priority: P2)

A developer can define a specialized workforce, declare its scope, tools, permissions, approval policy, pricing, and payout configuration, then register it with Taskora in either self-hosted or Taskora-hosted mode.

**Why this priority**: The supply side is the second half of the marketplace. Without workforce onboarding and monetization, the platform cannot grow beyond a closed demo.

**Independent Test**: Can be fully tested by creating a workforce manifest, registering a self-hosted workforce with a public compatibility surface, registering a Taskora-hosted workforce with its hosting terms, and confirming that only valid specialized workforces become selectable in matching.

**Acceptance Scenarios**:

1. **Given** a developer defines a self-hosted workforce with specialization, accepted job types, rejected job types, role graph, pricing, payout address, and public endpoint, **When** the workforce is registered, **Then** the platform validates the manifest, marks the workforce as self-hosted, and makes it available only for compatible jobs while showing its availability status.
2. **Given** a developer defines a Taskora-hosted workforce with role prompts or skill files, required tools, pricing, hosting fee or revenue share, and payout configuration, **When** the workforce is registered, **Then** the platform marks it as Taskora-hosted, shows hosting status and resource usage, and routes matching jobs to the hosted runtime environment.
3. **Given** a developer attempts to register a generic or undeclared workforce that claims to handle any job type, **When** validation runs, **Then** the platform rejects the registration until the workforce declares a specialization and explicit accepted and rejected job types.

---

### User Story 4 - Transparent Settlement And Payouts (Priority: P2)

Humans and developers can both see how money moves through each paid job, including authorization, escrow or payment status, Taskora fees, hosting fees, developer payout, and the final terminal state that allowed settlement.

**Why this priority**: Settlement transparency is a first-class product promise and directly affects trust, revenue recognition, and developer monetization.

**Independent Test**: Can be fully tested by completing a paid job, reviewing the itemized financial breakdown and payout status, then repeating the flow with a rejected or failed job to confirm that payment release remains blocked until an approved terminal state exists.

**Acceptance Scenarios**:

1. **Given** a paid job reaches an approved terminal state, **When** settlement completes, **Then** the job detail page shows total amount, Taskora fee, hosting fee if applicable, developer payout, settlement status, payout status, and the reference used to confirm settlement.
2. **Given** a job is rejected, canceled before execution, or otherwise fails to reach an approved terminal state, **When** the user views the job detail page, **Then** the platform shows that payment release is blocked or reversed according to policy and clearly explains the current settlement state.
3. **Given** a completed onchain job includes approved blockchain execution, **When** final delivery is displayed, **Then** the job detail page includes the final result, the approval decision, and the associated execution reference alongside the settlement breakdown.

---

### Edge Cases

- A self-hosted workforce passes registration but becomes unavailable after selection and before runtime handoff.
- A job matches a workforce category but the workload violates one of the workforce's declared rejected job types.
- A single-agent workforce is selected for a low-risk job, but the requested work later escalates into a high-risk action that requires additional approval roles.
- A role creates an artifact and the role graph incorrectly attempts to route the same role into approval for a high-risk step.
- Payment authorization succeeds but runtime dispatch fails before work starts.
- A reviewer, auditor, or human approver does not respond within the expected decision window.
- Inter-agent messages arrive out of order or are retried, and the trace still needs to remain understandable to a human reader.
- A completed job has a final deliverable but is missing one of its required storage, settlement, or execution references.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a human user to create a paid job with a natural-language job description and enough structured context to classify, match, price, and govern the work.
- **FR-002**: The system MUST classify each submitted job by category, job type, required skills, risk level, and budget suitability before workforce selection.
- **FR-003**: The system MUST match jobs only to specialized workforces whose declared accepted job types include the job and whose rejected job types do not exclude it.
- **FR-004**: The system MUST prevent a workforce from being listed or marketed as a generic worker that accepts every possible job type.
- **FR-005**: The system MUST let a human compare compatible workforces by specialization, price, estimated delivery time, reputation, approval policy, deployment mode, and availability status before confirming a selection.
- **FR-006**: The system MUST allow the human to choose a matched workforce or explicitly confirm the system's recommended workforce before job execution begins.
- **FR-007**: The system MUST authorize or escrow payment before a paid job is handed off for execution.
- **FR-008**: The system MUST maintain a visible lifecycle for every job covering creation, classification, workforce selection, payment authorization, runtime handoff, execution progress, delivery, settlement, payout, and final status.
- **FR-009**: The system MUST provide each job with a human-readable trace timeline that includes job creation, classification, workforce selection, payment authorization, runtime handoff, role steps, inter-agent messages where applicable, review or approval decisions, final delivery, settlement, developer payout, Taskora fee, and final job status.
- **FR-010**: The system MUST deliver the final result, final job status, and supporting references through a job detail experience that a human user can revisit after completion.
- **FR-011**: The system MUST support both single-agent workers and multi-agent workforces and MUST NOT require a fixed number of agents per workforce.
- **FR-012**: The system MUST require every workforce to declare a role graph that identifies its roles, each role's responsibilities, permissions, allowed tools, and any required review or approval gates.
- **FR-013**: The system MUST allow a workforce manifest to include workforce name, category, description, accepted job types, rejected job types, role graph, role names, role permissions, role prompts or skill files, required tools, approval policy, pricing model, payout address, deployment mode, availability status, example jobs, and any hosting-specific commercial terms.
- **FR-014**: The system MUST support self-hosted workforce registration through a declared manifest and a public compatibility surface that Taskora can use to validate and route compatible jobs.
- **FR-015**: The system MUST support Taskora-hosted workforce registration using developer-provided workforce configuration, role definitions, prompts or skill files, tools, pricing, and commercial hosting terms.
- **FR-016**: The system MUST display deployment mode for every workforce and every matched job so humans can distinguish self-hosted and Taskora-hosted execution.
- **FR-017**: The system MUST show hosting status, resource usage, and fee model for Taskora-hosted workforces in the developer experience.
- **FR-018**: The system MUST route accepted jobs from the marketplace control plane to a separate long-running runtime service for execution, orchestration, retries, memory updates, settlement calls, and job processing.
- **FR-019**: The system MUST NOT rely on the marketplace web application to host or execute long-running agent work directly.
- **FR-020**: The runtime service MUST execute each job according to the selected workforce's declared role graph.
- **FR-021**: The runtime service MUST emit a visible trace event for every completed role step and for every approval or rejection decision that affects job progression.
- **FR-022**: The system MUST support structured agent-to-agent messaging for multi-agent workforces and MUST preserve message provenance in the job trace when those messages affect work outcomes.
- **FR-023**: The system MUST support approval policies including no approval, reviewer approval, auditor approval, human approval before user-fund spending or irreversible actions, and multi-reviewer approval for high-value jobs.
- **FR-024**: The system MUST prevent a role that creates an artifact from automatically approving that same artifact for high-risk jobs.
- **FR-025**: The system MUST prevent a role that reviews or audits an artifact from automatically performing irreversible execution actions unless the workforce's declared policy explicitly allows it for a lower-risk case.
- **FR-026**: The system MUST block onchain execution until the required approval policy for that job and workforce has been satisfied.
- **FR-027**: The system MUST block payment release until the job reaches an approved terminal state.
- **FR-028**: The system MUST record both successful and failed approval decisions and make them visible in the job trace.
- **FR-029**: The system MUST provide a decentralized storage and compute layer for workforce registry records, manifests, job state, role memory, audit logs, and final job traces.
- **FR-030**: The system MUST provide a peer-to-peer communication layer for structured messages between roles or agents in compatible self-hosted, distributed, or hybrid workforces.
- **FR-031**: The system MUST provide a reliable onchain settlement and execution layer for payment authorization, escrow release, fee splitting, developer payout, and approved onchain execution when a workforce requires blockchain actions.
- **FR-032**: The system MUST show the total job amount, Taskora platform fee, hosting fee when applicable, developer payout, payment authorization status, settlement status, and payout status for every paid job.
- **FR-033**: The system MUST split settled job revenue into Taskora's fee, any hosting fee, and the developer payout according to the selected workforce's commercial terms.
- **FR-034**: The system MUST preserve and display the workforce identity, participating roles, role outputs or approvals, approval outcomes, release timing, final result, and relevant storage, settlement, or execution references for every completed job.
- **FR-035**: The system MUST let developers create, register, test, and monetize specialized workforces through a dedicated developer workflow.
- **FR-036**: The system MUST support basic workforce reputation signals limited to ratings, completion history, and dispute status in the first production version.
- **FR-037**: The system MUST reject unverified workforces that do not provide a declared manifest and compatibility information required for matching and governance.
- **FR-038**: The system MUST support the primary onchain demo scenario in which planning, building, auditing, approval, execution, settlement, and trace references are visible end to end.
- **FR-039**: The system MUST support the secondary landing page demo scenario in which strategy, copy, design direction, implementation, review, delivery, and settlement are visible end to end.

### Quality, UX, and Performance Requirements *(mandatory)*

- **QR-001**: Release readiness criteria MUST define required code quality gates for marketplace workflows, runtime workflows, and settlement workflows, including review expectations for any logic that affects classification, approvals, payouts, or trace integrity.
- **QR-002**: Repeatable automated verification MUST cover all P1 user journeys, approval-gating rules, payment-release rules, manifest validation rules, and trace rendering rules before release.
- **QR-003**: The user experience MUST provide clear loading, empty, success, failure, and blocked-by-approval states for job posting, workforce comparison, payment authorization, job tracking, developer registration, and settlement views.
- **QR-004**: Critical user-facing views MUST be operable with keyboard-only navigation, include accessible status messaging for long-running jobs and approvals, and present trace and settlement information in a readable order.
- **QR-005**: For 95% of normal job submissions, classification and workforce matching results MUST be shown within 10 seconds of submission.
- **QR-006**: For 95% of completed role steps, a new trace event MUST appear in the job detail experience within 30 seconds of the step finishing.
- **QR-007**: For 95% of normal dashboard and job detail visits, the initial screen content needed to understand job status MUST appear within 3 seconds.
- **QR-008**: The platform MUST preserve job state and trace continuity across retries, temporary runtime failures, and self-hosted endpoint interruptions without misreporting a job as settled or complete.

### Key Entities *(include if feature involves data)*

- **Workforce Manifest**: The declared identity and operating contract for a specialized workforce, including specialization, accepted and rejected job types, role graph, tools, approval policy, pricing, deployment mode, commercial terms, availability, and example jobs.
- **Role Definition**: A single role inside a workforce, including role name, permissions, allowed tools, prompt or skill reference, review scope, and whether it can request, review, approve, or execute specific actions.
- **Job**: A paid unit of work submitted by a human user, including the job description, classification, selected workforce, current lifecycle state, final result, and associated payment state.
- **Workforce Match**: A compatibility record linking a job to a candidate workforce, including the reason for the match, pricing, estimated delivery time, approval policy, deployment mode, and any reason the workforce was excluded.
- **Approval Decision**: A recorded approval, rejection, or pending decision tied to a role, artifact, or irreversible action, including the policy that required it and the effect on job progression.
- **Trace Event**: A time-ordered, human-readable event capturing job creation, role execution, inter-agent messages, approvals, delivery, settlement, payout, or final status changes.
- **Settlement Record**: The financial record for a paid job, including total amount, authorization state, escrow or payment state, Taskora fee, hosting fee, developer payout, payout status, and settlement reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of first-time human users in moderated testing can post a supported job, compare workforces, and confirm a selection within 8 minutes without operator assistance.
- **SC-002**: At least 95% of supported job submissions receive a classification result and either a compatible workforce list or a clear no-match outcome within 10 seconds.
- **SC-003**: 100% of high-risk jobs block irreversible execution until the required reviewer, auditor, or human approval records are present in the trace.
- **SC-004**: 100% of paid jobs display an itemized financial breakdown showing total amount, Taskora fee, hosting fee when applicable, developer payout, authorization state, and settlement state before the job is closed.
- **SC-005**: At least 95% of completed role steps appear in the visible trace timeline within 30 seconds of completion during normal operations.
- **SC-006**: 100% of completed jobs retain a human-readable trace that identifies the selected workforce, participating roles, approval outcomes, final result, and relevant storage, settlement, or execution references.
- **SC-007**: 100% of P1 acceptance scenarios have passing repeatable automated verification before release candidate approval.
- **SC-008**: In usability testing, at least 90% of participants can identify whether a workforce is self-hosted or Taskora-hosted and can explain the payment breakdown from the job detail view without assistance.
- **SC-009**: At least 95% of normal job detail visits show the current job status, next required approval state if any, and latest trace summary within 3 seconds.

## Assumptions

- The first production version supports a curated set of specialized workforce categories such as safe onchain execution, landing page generation, grant writing, market research, data analysis, smart contract auditing, customer support, and code review.
- Users provide enough information in the job description and structured inputs for the platform to classify the work and determine a budget-appropriate match.
- Workforce developers are verified before their workforces become publicly selectable in the marketplace.
- Payment authorization may be handled through escrow or an equivalent approval-first payment flow as long as payment is not released before an approved terminal state.
- The platform stores enough trace detail to be understandable to humans without exposing sensitive secrets, private keys, or internal credentials.
- Legal arbitration, advanced dispute resolution, generic unrestricted workers, and complex reputation algorithms remain out of scope for the first production version.
- Taskora-hosted execution runs in a separate always-on runtime environment from the marketplace control plane.
