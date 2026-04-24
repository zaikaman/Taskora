create extension if not exists "pgcrypto";

create type default_role_mode as enum ('customer', 'developer', 'both');
create type verification_status as enum ('pending', 'verified', 'rejected');
create type deployment_mode as enum ('self_hosted', 'taskora_hosted');
create type execution_backend as enum ('local_runtime', 'gensyn', 'self_hosted_endpoint', 'hybrid');
create type workforce_availability_status as enum ('draft', 'connected', 'available', 'paused', 'unavailable');
create type prompt_source_type as enum ('inline', 'skill_file', 'remote_manifest');
create type role_execution_mode as enum ('local', 'gensyn_eligible', 'keeperhub_only', 'self_hosted');
create type edge_type as enum ('depends_on', 'review_gate', 'approval_gate', 'success_terminal', 'failure_terminal');
create type job_status as enum (
  'draft',
  'classified',
  'matched',
  'payment_pending',
  'authorized',
  'queued',
  'running',
  'awaiting_approval',
  'executing_onchain',
  'completed',
  'failed',
  'rejected',
  'canceled'
);
create type risk_level as enum ('low', 'medium', 'high');
create type review_decision as enum ('pending', 'approved', 'rejected', 'changes_requested');
create type decision_actor_type as enum ('role', 'human');
create type payment_status as enum ('pending', 'authorized', 'released', 'failed', 'voided');
create type settlement_status as enum ('pending', 'ready', 'released', 'failed');
create type payout_status as enum ('pending', 'paid', 'failed');
create type deployment_status as enum ('draft', 'deploying', 'connected', 'available', 'paused', 'unavailable', 'failed');
create type compute_provider as enum ('local_runtime', 'gensyn', 'self_hosted', 'hybrid');
create type integration_reference_type as enum (
  'og_manifest',
  'og_trace',
  'og_memory',
  'og_inference',
  'gensyn_workload',
  'gensyn_verification',
  'gensyn_coordination',
  'keeperhub_workflow',
  'keeperhub_run',
  'keeperhub_settlement',
  'keeperhub_execution',
  'self_hosted_health_check'
);
create type compatibility_status as enum ('pending', 'compatible', 'incompatible');

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  default_role_mode default_role_mode not null default 'customer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists developer_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  display_name text not null,
  bio text,
  payout_address text not null,
  verification_status verification_status not null default 'pending',
  hosting_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists workforces (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references developer_profiles (user_id) on delete cascade,
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  deployment_mode deployment_mode not null,
  execution_backend execution_backend not null,
  availability_status workforce_availability_status not null default 'draft',
  pricing_model jsonb not null default '{}'::jsonb,
  reputation_summary jsonb not null default '{}'::jsonb,
  last_health_check_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists workforce_manifests (
  id uuid primary key default gen_random_uuid(),
  workforce_id uuid not null references workforces (id) on delete cascade,
  version integer not null,
  manifest_json jsonb not null,
  manifest_hash text not null,
  manifest_url text,
  public_endpoint text,
  og_manifest_ref text,
  compatibility_status compatibility_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  unique (workforce_id, version)
);

create table if not exists workforce_roles (
  id uuid primary key default gen_random_uuid(),
  workforce_id uuid not null references workforces (id) on delete cascade,
  role_key text not null,
  name text not null,
  purpose text not null,
  prompt_source_type prompt_source_type not null,
  prompt_source_value text not null,
  permissions text[] not null default '{}',
  tools jsonb not null default '[]'::jsonb,
  input_expectations jsonb not null default '{}'::jsonb,
  output_expectations jsonb not null default '{}'::jsonb,
  execution_mode role_execution_mode not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workforce_id, role_key)
);

create table if not exists role_graph_edges (
  id uuid primary key default gen_random_uuid(),
  workforce_id uuid not null references workforces (id) on delete cascade,
  from_role_id uuid references workforce_roles (id) on delete set null,
  to_role_id uuid references workforce_roles (id) on delete set null,
  edge_type edge_type not null,
  condition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles (id) on delete cascade,
  selected_workforce_id uuid references workforces (id) on delete set null,
  title text not null,
  description text not null,
  requested_budget_amount numeric(12, 2) not null check (requested_budget_amount >= 0),
  currency text not null,
  status job_status not null default 'draft',
  final_result jsonb,
  final_result_summary text,
  og_final_trace_ref text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists job_classifications (
  job_id uuid primary key references jobs (id) on delete cascade,
  category text not null,
  job_type text not null,
  risk_level risk_level not null,
  required_capabilities text[] not null default '{}',
  budget_fit text not null,
  matching_explanation jsonb not null default '{}'::jsonb,
  classifier_version text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists integration_references (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete cascade,
  workforce_id uuid references workforces (id) on delete cascade,
  deployment_id uuid,
  reference_type integration_reference_type not null,
  external_id text not null,
  uri text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_trace_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  workforce_id uuid not null references workforces (id) on delete cascade,
  role_id uuid references workforce_roles (id) on delete set null,
  event_type text not null,
  status text not null,
  title text not null,
  details jsonb not null default '{}'::jsonb,
  visible_to_customer boolean not null default true,
  integration_reference_id uuid references integration_references (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists review_decisions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  role_id uuid references workforce_roles (id) on delete set null,
  artifact_reference text not null,
  decision review_decision not null,
  decided_by_type decision_actor_type not null,
  decided_by_id uuid,
  reason text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  provider text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null,
  authorization_status payment_status not null default 'pending',
  authorization_reference text,
  authorized_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists settlements (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  payment_id uuid not null references payments (id) on delete cascade,
  status settlement_status not null default 'pending',
  taskora_fee_amount numeric(12, 2) not null default 0 check (taskora_fee_amount >= 0),
  hosting_fee_amount numeric(12, 2) not null default 0 check (hosting_fee_amount >= 0),
  developer_payout_amount numeric(12, 2) not null default 0 check (developer_payout_amount >= 0),
  keeperhub_execution_required boolean not null default false,
  released_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (payment_id)
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references settlements (id) on delete cascade,
  developer_id uuid not null references developer_profiles (user_id) on delete cascade,
  payout_address text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  status payout_status not null default 'pending',
  payout_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (settlement_id)
);

create table if not exists deployments (
  id uuid primary key default gen_random_uuid(),
  workforce_id uuid not null references workforces (id) on delete cascade,
  deployment_mode deployment_mode not null,
  execution_backend execution_backend not null,
  compute_provider compute_provider not null,
  status deployment_status not null default 'draft',
  resource_usage jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  public_endpoint text,
  gensyn_node_ref text,
  last_health_status text,
  last_health_check_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table integration_references
  add constraint integration_references_deployment_id_fkey
  foreign key (deployment_id) references deployments (id) on delete cascade;

create index if not exists idx_workforces_developer_id on workforces (developer_id);
create index if not exists idx_workforces_availability_status on workforces (availability_status);
create index if not exists idx_workforce_manifests_workforce_id on workforce_manifests (workforce_id);
create index if not exists idx_jobs_customer_id on jobs (customer_id);
create index if not exists idx_jobs_selected_workforce_id on jobs (selected_workforce_id);
create index if not exists idx_job_trace_events_job_id on job_trace_events (job_id, created_at desc);
create index if not exists idx_review_decisions_job_id on review_decisions (job_id, created_at desc);
create index if not exists idx_integration_references_job_id on integration_references (job_id, created_at desc);
create index if not exists idx_deployments_workforce_id on deployments (workforce_id);

alter table profiles enable row level security;
alter table developer_profiles enable row level security;
alter table workforces enable row level security;
alter table workforce_manifests enable row level security;
alter table workforce_roles enable row level security;
alter table role_graph_edges enable row level security;
alter table jobs enable row level security;
alter table job_classifications enable row level security;
alter table integration_references enable row level security;
alter table job_trace_events enable row level security;
alter table review_decisions enable row level security;
alter table payments enable row level security;
alter table settlements enable row level security;
alter table payouts enable row level security;
alter table deployments enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_upsert_own" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "developer_profiles_select_own" on developer_profiles
  for select using (auth.uid() = user_id);

create policy "developer_profiles_manage_own" on developer_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "jobs_customer_access" on jobs
  for select using (auth.uid() = customer_id);

create policy "jobs_customer_insert" on jobs
  for insert with check (auth.uid() = customer_id);

create policy "jobs_customer_update" on jobs
  for update using (auth.uid() = customer_id);

create policy "job_classifications_customer_access" on job_classifications
  for select using (
    exists (
      select 1 from jobs
      where jobs.id = job_classifications.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "payments_customer_access" on payments
  for select using (
    exists (
      select 1 from jobs
      where jobs.id = payments.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "settlements_customer_access" on settlements
  for select using (
    exists (
      select 1 from jobs
      where jobs.id = settlements.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "trace_events_customer_access" on job_trace_events
  for select using (
    visible_to_customer = true and exists (
      select 1 from jobs
      where jobs.id = job_trace_events.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "review_decisions_customer_access" on review_decisions
  for select using (
    exists (
      select 1 from jobs
      where jobs.id = review_decisions.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "integration_references_customer_access" on integration_references
  for select using (
    job_id is not null and exists (
      select 1 from jobs
      where jobs.id = integration_references.job_id and jobs.customer_id = auth.uid()
    )
  );

create policy "workforces_public_available" on workforces
  for select using (availability_status = 'available');

create policy "workforces_developer_manage_own" on workforces
  for all using (auth.uid() = developer_id) with check (auth.uid() = developer_id);

create policy "workforce_manifests_select_public_or_owner" on workforce_manifests
  for select using (
    exists (
      select 1 from workforces
      where workforces.id = workforce_manifests.workforce_id
        and (workforces.availability_status = 'available' or workforces.developer_id = auth.uid())
    )
  );

create policy "workforce_roles_select_public_or_owner" on workforce_roles
  for select using (
    exists (
      select 1 from workforces
      where workforces.id = workforce_roles.workforce_id
        and (workforces.availability_status = 'available' or workforces.developer_id = auth.uid())
    )
  );

create policy "role_graph_edges_select_public_or_owner" on role_graph_edges
  for select using (
    exists (
      select 1 from workforces
      where workforces.id = role_graph_edges.workforce_id
        and (workforces.availability_status = 'available' or workforces.developer_id = auth.uid())
    )
  );

create policy "deployments_developer_access" on deployments
  for select using (
    exists (
      select 1 from workforces
      where workforces.id = deployments.workforce_id and workforces.developer_id = auth.uid()
    )
  );
