# Data Model: Taskora Workforce Marketplace

## Modeling Principles

- Supabase Postgres is the operational source of truth for all buyer-visible and developer-visible state.
- Canonical workforce manifests are stored as validated JSON plus normalized supporting records for query efficiency.
- Every major job lifecycle change, approval decision, payout event, and external reference is represented explicitly rather than folded into generic metadata.
- External infrastructure identifiers from 0G, AXL, KeeperHub, and self-hosted endpoints are stored in `integration_references` so the UI can surface them consistently.

## Core Entities

### Profile

- **Table**: `profiles`
- **Purpose**: Stores application-specific identity and presentation data for each authenticated user.
- **Primary fields**:
  - `id` UUID, primary key, references Supabase Auth user
  - `display_name`
  - `avatar_url`
  - `default_role_mode` enum-like text (`customer`, `developer`, `both`)
  - `created_at`
  - `updated_at`
- **Relationships**:
  - One profile can own many jobs as a customer.
  - One profile can have zero or one developer profile.

### DeveloperProfile

- **Table**: `developer_profiles`
- **Purpose**: Extends a profile with monetization and hosting-specific developer metadata.
- **Primary fields**:
  - `user_id` UUID, primary key, references `profiles.id`
  - `display_name`
  - `bio`
  - `payout_address`
  - `verification_status` (`pending`, `verified`, `rejected`)
  - `hosting_preferences` JSON
  - `created_at`
  - `updated_at`
- **Relationships**:
  - One developer profile owns many workforces.
  - One developer profile receives many payouts.

### Workforce

- **Table**: `workforces`
- **Purpose**: Represents a specialized worker or multi-role workforce available in the marketplace.
- **Primary fields**:
  - `id` UUID
  - `developer_id` UUID, references `developer_profiles.user_id`
  - `name`
  - `slug`
  - `category`
  - `description`
  - `deployment_mode` (`self_hosted`, `taskora_hosted`)
  - `availability_status` (`draft`, `connected`, `available`, `paused`, `unavailable`)
  - `pricing_model` JSON
  - `reputation_summary` JSON
  - `last_health_check_at`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - One workforce has one active canonical manifest plus historical manifest versions.
  - One workforce has many roles, graph edges, deployments, and jobs.

### WorkforceManifest

- **Table**: `workforce_manifests`
- **Purpose**: Stores the validated canonical manifest and verification references for a workforce.
- **Primary fields**:
  - `id` UUID
  - `workforce_id` UUID
  - `version`
  - `manifest_json` JSONB
  - `manifest_hash`
  - `manifest_url` nullable
  - `public_endpoint` nullable
  - `og_manifest_ref` nullable
  - `compatibility_status` (`pending`, `compatible`, `incompatible`)
  - `created_at`
- **Relationships**:
  - Belongs to one workforce.
  - May have many integration references.

### WorkforceRole

- **Table**: `workforce_roles`
- **Purpose**: Defines each role inside a workforce.
- **Primary fields**:
  - `id` UUID
  - `workforce_id` UUID
  - `role_key`
  - `name`
  - `purpose`
  - `prompt_source_type` (`inline`, `skill_file`, `remote_manifest`)
  - `prompt_source_value`
  - `permissions` text array
  - `tools` JSONB
  - `input_expectations` JSONB
  - `output_expectations` JSONB
  - `created_at`
  - `updated_at`
- **Relationships**:
  - Belongs to one workforce.
  - Can appear in many role graph edges.
  - Can emit many trace events and review decisions.

### RoleGraphEdge

- **Table**: `role_graph_edges`
- **Purpose**: Defines execution dependencies, review gates, and terminal paths between roles or workflow states.
- **Primary fields**:
  - `id` UUID
  - `workforce_id` UUID
  - `from_role_id` nullable UUID
  - `to_role_id` nullable UUID
  - `edge_type` (`depends_on`, `review_gate`, `approval_gate`, `success_terminal`, `failure_terminal`)
  - `condition` JSONB
  - `created_at`
- **Relationships**:
  - Belongs to one workforce.
  - References zero or more role records depending on whether the edge models a start or terminal transition.

### Job

- **Table**: `jobs`
- **Purpose**: Represents a paid unit of work posted by a customer and executed by a selected workforce.
- **Primary fields**:
  - `id` UUID
  - `customer_id` UUID, references `profiles.id`
  - `selected_workforce_id` nullable UUID
  - `title`
  - `description`
  - `requested_budget_amount`
  - `currency`
  - `status`
  - `final_result` JSONB nullable
  - `final_result_summary`
  - `created_at`
  - `updated_at`
  - `completed_at` nullable
- **Relationships**:
  - Has one classification.
  - Has many trace events, review decisions, payments, settlements, payouts, and integration references.

### JobClassification

- **Table**: `job_classifications`
- **Purpose**: Stores the deterministic classifier output and explanation.
- **Primary fields**:
  - `job_id` UUID, primary key
  - `category`
  - `job_type`
  - `risk_level` (`low`, `medium`, `high`)
  - `required_capabilities` text array
  - `budget_fit`
  - `matching_explanation` JSONB
  - `classifier_version`
  - `created_at`
- **Relationships**:
  - Belongs to one job.

### JobTraceEvent

- **Table**: `job_trace_events`
- **Purpose**: Provides the human-readable execution timeline for each job.
- **Primary fields**:
  - `id` UUID
  - `job_id` UUID
  - `workforce_id` UUID
  - `role_id` nullable UUID
  - `event_type`
  - `status`
  - `title`
  - `details` JSONB
  - `visible_to_customer` boolean
  - `integration_reference_id` nullable UUID
  - `created_at`
- **Relationships**:
  - Belongs to one job.
  - May reference a role and one integration reference.

### ReviewDecision

- **Table**: `review_decisions`
- **Purpose**: Records approvals, rejections, and requested changes attached to artifacts or guarded actions.
- **Primary fields**:
  - `id` UUID
  - `job_id` UUID
  - `role_id` nullable UUID
  - `artifact_reference`
  - `decision` (`pending`, `approved`, `rejected`, `changes_requested`)
  - `decided_by_type` (`role`, `human`)
  - `decided_by_id`
  - `reason`
  - `created_at`
- **Relationships**:
  - Belongs to one job.
  - May be associated with a trace event and a role.

### Payment

- **Table**: `payments`
- **Purpose**: Captures authorization and payment method state for a job.
- **Primary fields**:
  - `id` UUID
  - `job_id` UUID
  - `provider`
  - `total_amount`
  - `currency`
  - `authorization_status` (`pending`, `authorized`, `failed`, `voided`)
  - `authorization_reference`
  - `authorized_at` nullable
  - `created_at`
- **Relationships**:
  - Belongs to one job.
  - Has one or more settlements over its lifecycle, though the initial version should use one primary settlement.

### Settlement

- **Table**: `settlements`
- **Purpose**: Models release eligibility and fee splitting for a payment.
- **Primary fields**:
  - `id` UUID
  - `job_id` UUID
  - `payment_id` UUID
  - `status` (`pending`, `ready`, `released`, `failed`)
  - `taskora_fee_amount`
  - `hosting_fee_amount`
  - `developer_payout_amount`
  - `released_at` nullable
  - `created_at`
- **Relationships**:
  - Belongs to one job and one payment.
  - Has one payout record in the first version.

### Payout

- **Table**: `payouts`
- **Purpose**: Tracks the developer’s payout lifecycle.
- **Primary fields**:
  - `id` UUID
  - `settlement_id` UUID
  - `developer_id` UUID
  - `payout_address`
  - `amount`
  - `status` (`pending`, `paid`, `failed`)
  - `payout_reference`
  - `paid_at` nullable
  - `created_at`
- **Relationships**:
  - Belongs to one settlement and one developer profile.

### Deployment

- **Table**: `deployments`
- **Purpose**: Captures hosting and connection state for self-hosted and Taskora-hosted workforces.
- **Primary fields**:
  - `id` UUID
  - `workforce_id` UUID
  - `deployment_mode`
  - `runtime_target`
  - `status` (`draft`, `deploying`, `connected`, `available`, `paused`, `unavailable`, `failed`)
  - `resource_usage` JSONB
  - `config` JSONB
  - `public_endpoint` nullable
  - `last_health_status`
  - `last_health_check_at`
  - `created_at`
  - `updated_at`
- **Relationships**:
  - Belongs to one workforce.
  - May have many integration references.

### IntegrationReference

- **Table**: `integration_references`
- **Purpose**: Normalizes identifiers and URIs produced by external infrastructure.
- **Primary fields**:
  - `id` UUID
  - `job_id` nullable UUID
  - `workforce_id` nullable UUID
  - `deployment_id` nullable UUID
  - `reference_type` (`og_manifest`, `og_trace`, `og_memory`, `axl_message`, `keeperhub_settlement`, `keeperhub_execution`, `self_hosted_health_check`)
  - `external_id`
  - `uri`
  - `metadata` JSONB
  - `created_at`
- **Relationships**:
  - Can belong to a job, workforce, or deployment depending on the reference source.

## Relationship Highlights

- `profiles.id` is the shared identity root for customer-owned jobs and developer-owned workforces.
- `workforces` is the marketplace listing anchor; `workforce_manifests`, `workforce_roles`, and `role_graph_edges` describe how that workforce behaves.
- `jobs` is the execution anchor; `job_classifications`, `job_trace_events`, `review_decisions`, `payments`, `settlements`, and `integration_references` capture progression and accountability.
- `deployments` gives both self-hosted and Taskora-hosted execution a unified operational status surface.

## State Transitions

### Job Status

- `draft` -> `classified`
- `classified` -> `matched`
- `matched` -> `payment_pending`
- `payment_pending` -> `authorized`
- `authorized` -> `queued`
- `queued` -> `running`
- `running` -> `awaiting_approval`
- `awaiting_approval` -> `running`
- `running` -> `completed`
- `running` -> `failed`
- `running` -> `rejected`
- `authorized` -> `canceled`

### Review Decision Status

- `pending` -> `approved`
- `pending` -> `rejected`
- `pending` -> `changes_requested`

### Payment and Settlement Status

- Payment: `pending` -> `authorized` -> `voided` or `released`
- Settlement: `pending` -> `ready` -> `released` -> `paid`
- Any payment or settlement state can transition to `failed` if the external integration returns an unrecoverable error

### Deployment Availability Status

- `draft` -> `connected`
- `connected` -> `available`
- `available` -> `paused`
- `available` -> `unavailable`
- `connected` -> `failed`

## Invariants

- A workforce cannot be selectable if it lacks specialization category, accepted job types, rejected job types, deployment mode, pricing model, payout configuration, or at least one role.
- Self-hosted workforces require a public endpoint or manifest URL plus a successful compatibility check before they can reach `available`.
- High-risk jobs must not allow the same role to both build and approve a guarded artifact unless the approval policy explicitly allows it.
- Reviewer and auditor roles do not imply execution permissions.
- Onchain execution requires both the relevant approval decision and an authorized payment state.
- Settlement release requires an approved terminal job state.
- Every completed job must retain at least one visible final trace event and one `og_trace` integration reference, even when the 0G adapter is mocked.
