-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.deployments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workforce_id uuid NOT NULL,
  deployment_mode USER-DEFINED NOT NULL,
  execution_backend USER-DEFINED NOT NULL,
  compute_provider USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::deployment_status,
  resource_usage jsonb NOT NULL DEFAULT '{}'::jsonb,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  public_endpoint text,
  gensyn_node_ref text,
  last_health_status text,
  last_health_check_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT deployments_pkey PRIMARY KEY (id),
  CONSTRAINT deployments_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id)
);
CREATE TABLE public.developer_profiles (
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  bio text,
  payout_address text NOT NULL,
  verification_status USER-DEFINED NOT NULL DEFAULT 'pending'::verification_status,
  hosting_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT developer_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT developer_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.integration_references (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid,
  workforce_id uuid,
  deployment_id uuid,
  reference_type USER-DEFINED NOT NULL,
  external_id text NOT NULL,
  uri text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT integration_references_pkey PRIMARY KEY (id),
  CONSTRAINT integration_references_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id),
  CONSTRAINT integration_references_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id),
  CONSTRAINT integration_references_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.deployments(id)
);
CREATE TABLE public.job_classifications (
  job_id uuid NOT NULL,
  category text NOT NULL,
  job_type text NOT NULL,
  risk_level USER-DEFINED NOT NULL,
  required_capabilities ARRAY NOT NULL DEFAULT '{}'::text[],
  budget_fit text NOT NULL,
  matching_explanation jsonb NOT NULL DEFAULT '{}'::jsonb,
  classifier_version text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT job_classifications_pkey PRIMARY KEY (job_id),
  CONSTRAINT job_classifications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id)
);
CREATE TABLE public.job_trace_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  workforce_id uuid NOT NULL,
  role_id uuid,
  event_type text NOT NULL,
  status text NOT NULL,
  title text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  visible_to_customer boolean NOT NULL DEFAULT true,
  integration_reference_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT job_trace_events_pkey PRIMARY KEY (id),
  CONSTRAINT job_trace_events_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id),
  CONSTRAINT job_trace_events_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id),
  CONSTRAINT job_trace_events_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.workforce_roles(id),
  CONSTRAINT job_trace_events_integration_reference_id_fkey FOREIGN KEY (integration_reference_id) REFERENCES public.integration_references(id)
);
CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  selected_workforce_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  requested_budget_amount numeric NOT NULL CHECK (requested_budget_amount >= 0::numeric),
  currency text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::job_status,
  final_result jsonb,
  final_result_summary text,
  og_final_trace_ref text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id),
  CONSTRAINT jobs_selected_workforce_id_fkey FOREIGN KEY (selected_workforce_id) REFERENCES public.workforces(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  provider text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0::numeric),
  currency text NOT NULL,
  authorization_status USER-DEFINED NOT NULL DEFAULT 'pending'::payment_status,
  authorization_reference text,
  authorized_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id)
);
CREATE TABLE public.payouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  settlement_id uuid NOT NULL UNIQUE,
  developer_id uuid NOT NULL,
  payout_address text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'pending'::payout_status,
  payout_reference text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payouts_pkey PRIMARY KEY (id),
  CONSTRAINT payouts_settlement_id_fkey FOREIGN KEY (settlement_id) REFERENCES public.settlements(id),
  CONSTRAINT payouts_developer_id_fkey FOREIGN KEY (developer_id) REFERENCES public.developer_profiles(user_id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  display_name text,
  avatar_url text,
  default_role_mode USER-DEFINED NOT NULL DEFAULT 'customer'::default_role_mode,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.review_decisions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  role_id uuid,
  artifact_reference text NOT NULL,
  decision USER-DEFINED NOT NULL,
  decided_by_type USER-DEFINED NOT NULL,
  decided_by_id uuid,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT review_decisions_pkey PRIMARY KEY (id),
  CONSTRAINT review_decisions_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id),
  CONSTRAINT review_decisions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.workforce_roles(id)
);
CREATE TABLE public.role_graph_edges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workforce_id uuid NOT NULL,
  from_role_id uuid,
  to_role_id uuid,
  edge_type USER-DEFINED NOT NULL,
  condition jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT role_graph_edges_pkey PRIMARY KEY (id),
  CONSTRAINT role_graph_edges_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id),
  CONSTRAINT role_graph_edges_from_role_id_fkey FOREIGN KEY (from_role_id) REFERENCES public.workforce_roles(id),
  CONSTRAINT role_graph_edges_to_role_id_fkey FOREIGN KEY (to_role_id) REFERENCES public.workforce_roles(id)
);
CREATE TABLE public.settlements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL,
  payment_id uuid NOT NULL UNIQUE,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::settlement_status,
  taskora_fee_amount numeric NOT NULL DEFAULT 0 CHECK (taskora_fee_amount >= 0::numeric),
  hosting_fee_amount numeric NOT NULL DEFAULT 0 CHECK (hosting_fee_amount >= 0::numeric),
  developer_payout_amount numeric NOT NULL DEFAULT 0 CHECK (developer_payout_amount >= 0::numeric),
  keeperhub_execution_required boolean NOT NULL DEFAULT false,
  released_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT settlements_pkey PRIMARY KEY (id),
  CONSTRAINT settlements_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id),
  CONSTRAINT settlements_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);
CREATE TABLE public.workforce_manifests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workforce_id uuid NOT NULL,
  version integer NOT NULL,
  manifest_json jsonb NOT NULL,
  manifest_hash text NOT NULL,
  manifest_url text,
  public_endpoint text,
  og_manifest_ref text,
  compatibility_status USER-DEFINED NOT NULL DEFAULT 'pending'::compatibility_status,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workforce_manifests_pkey PRIMARY KEY (id),
  CONSTRAINT workforce_manifests_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id)
);
CREATE TABLE public.workforce_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  workforce_id uuid NOT NULL,
  role_key text NOT NULL,
  name text NOT NULL,
  purpose text NOT NULL,
  prompt_source_type USER-DEFINED NOT NULL,
  prompt_source_value text NOT NULL,
  permissions ARRAY NOT NULL DEFAULT '{}'::text[],
  tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  input_expectations jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_expectations jsonb NOT NULL DEFAULT '{}'::jsonb,
  execution_mode USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workforce_roles_pkey PRIMARY KEY (id),
  CONSTRAINT workforce_roles_workforce_id_fkey FOREIGN KEY (workforce_id) REFERENCES public.workforces(id)
);
CREATE TABLE public.workforces (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  description text NOT NULL,
  deployment_mode USER-DEFINED NOT NULL,
  execution_backend USER-DEFINED NOT NULL,
  availability_status USER-DEFINED NOT NULL DEFAULT 'draft'::workforce_availability_status,
  pricing_model jsonb NOT NULL DEFAULT '{}'::jsonb,
  reputation_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_health_check_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workforces_pkey PRIMARY KEY (id),
  CONSTRAINT workforces_developer_id_fkey FOREIGN KEY (developer_id) REFERENCES public.developer_profiles(user_id)
);