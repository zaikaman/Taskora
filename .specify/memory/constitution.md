<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- Placeholder Principle 1 -> I. Code Quality Is Enforced
	- Placeholder Principle 2 -> II. Testing Standards Are Mandatory
	- Placeholder Principle 3 -> III. User Experience Consistency Comes First
	- Placeholder Principle 4 -> IV. Performance Requirements Are Budgeted
	- Placeholder Principle 5 -> V. Continuous Verification Prevents Regressions
- Added sections:
	- Engineering Standards
	- Delivery Workflow And Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
	- ⚠ pending: README.md and docs/quickstart.md (files not present in repository)
- Follow-up TODOs:
	- None
-->

# Taskora Constitution

## Core Principles

### I. Code Quality Is Enforced
All production code MUST pass linting, formatting, static analysis, and peer review
before merge. Changes introducing complex logic MUST include implementation notes in the
feature plan that justify trade-offs and maintenance impact. Duplication introduced by a
change MUST be removed before release or tracked with an approved exception.

Rationale: Objective quality gates reduce defects and keep the codebase maintainable as
the product scales.

### II. Testing Standards Are Mandatory
Every feature MUST include automated tests at the appropriate levels: unit tests for core
logic, integration tests for cross-component behavior, and contract or end-to-end tests
for critical interfaces. Bug fixes MUST include a regression test that fails before the
fix and passes after. No change may be merged with failing required tests.

Rationale: Reliable tests are the fastest way to prevent regressions and preserve
development velocity.

### III. User Experience Consistency Comes First
User-facing changes MUST follow shared interaction patterns, naming, tone, and
accessibility requirements. Feature specifications MUST define acceptance scenarios for
loading, empty, error, and success states where applicable. Any intentional UX deviation
MUST be documented in the spec and approved during review.

Rationale: Consistency reduces user friction, increases trust, and lowers support cost.

### IV. Performance Requirements Are Budgeted
Each feature MUST define measurable performance budgets in planning artifacts, including
latency, throughput, and resource constraints relevant to that feature. Changes that miss
budget MUST not ship without an approved mitigation plan and tracked follow-up work.
Performance-sensitive paths MUST include reproducible benchmarks or load checks.

Rationale: Defined budgets make performance an explicit deliverable instead of a late
optimization effort.

### V. Continuous Verification Prevents Regressions
CI pipelines MUST enforce the constitutional gates for code quality, testing, UX
acceptance evidence, and performance checks required by scope. Release readiness reviews
MUST verify gate compliance or record a formal waiver with owner, expiry date, and
remediation plan.

Rationale: Automated and accountable verification prevents quality drift over time.

## Engineering Standards

- Approved linters, formatters, and static analysis tooling MUST run locally and in CI.
- Accessibility conformance for user-facing work MUST be validated during implementation
	and review.
- Performance measurement methods MUST be repeatable and documented in feature artifacts.
- Pull requests MUST remain small enough for effective review or include a staged merge
	strategy.

## Delivery Workflow And Quality Gates

1. Define quality, testing, UX, and performance expectations in the specification.
2. Convert expectations into measurable checks in the implementation plan.
3. Implement in small increments with tests and benchmarks updated alongside code.
4. Verify all constitutional gates in CI before merge.
5. Re-validate UX consistency and performance budgets before release.

## Governance

This constitution supersedes conflicting local conventions for delivery and review.
Amendments require: (1) a proposed change with rationale, (2) reviewer approval from
maintainers, and (3) updates to affected templates and guidance in the same change.

Versioning policy:
- MAJOR for incompatible governance changes or principle removals/redefinitions.
- MINOR for new principles or materially expanded mandatory guidance.
- PATCH for clarifications, wording improvements, and non-semantic refinements.

Compliance review expectations:
- Every plan MUST complete a Constitution Check before implementation begins.
- Every pull request MUST explicitly confirm constitutional gate status.
- Exceptions MUST be time-bound and tracked to closure.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
