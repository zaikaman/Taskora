export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          default_role_mode: Database["public"]["Enums"]["default_role_mode"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          default_role_mode?: Database["public"]["Enums"]["default_role_mode"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          default_role_mode?: Database["public"]["Enums"]["default_role_mode"];
          created_at?: string;
          updated_at?: string;
        };
      };
      developer_profiles: {
        Row: {
          user_id: string;
          display_name: string;
          bio: string | null;
          payout_address: string;
          verification_status: Database["public"]["Enums"]["verification_status"];
          hosting_preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          bio?: string | null;
          payout_address: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          hosting_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          bio?: string | null;
          payout_address?: string;
          verification_status?: Database["public"]["Enums"]["verification_status"];
          hosting_preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      workforces: {
        Row: {
          id: string;
          developer_id: string;
          name: string;
          slug: string;
          category: string;
          description: string;
          deployment_mode: Database["public"]["Enums"]["deployment_mode"];
          execution_backend: Database["public"]["Enums"]["execution_backend"];
          availability_status: Database["public"]["Enums"]["workforce_availability_status"];
          pricing_model: Json;
          reputation_summary: Json;
          last_health_check_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          developer_id: string;
          name: string;
          slug: string;
          category: string;
          description: string;
          deployment_mode: Database["public"]["Enums"]["deployment_mode"];
          execution_backend: Database["public"]["Enums"]["execution_backend"];
          availability_status?: Database["public"]["Enums"]["workforce_availability_status"];
          pricing_model?: Json;
          reputation_summary?: Json;
          last_health_check_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          developer_id?: string;
          name?: string;
          slug?: string;
          category?: string;
          description?: string;
          deployment_mode?: Database["public"]["Enums"]["deployment_mode"];
          execution_backend?: Database["public"]["Enums"]["execution_backend"];
          availability_status?: Database["public"]["Enums"]["workforce_availability_status"];
          pricing_model?: Json;
          reputation_summary?: Json;
          last_health_check_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workforce_manifests: {
        Row: {
          id: string;
          workforce_id: string;
          version: number;
          manifest_json: Json;
          manifest_hash: string;
          manifest_url: string | null;
          public_endpoint: string | null;
          og_manifest_ref: string | null;
          compatibility_status: Database["public"]["Enums"]["compatibility_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          workforce_id: string;
          version: number;
          manifest_json: Json;
          manifest_hash: string;
          manifest_url?: string | null;
          public_endpoint?: string | null;
          og_manifest_ref?: string | null;
          compatibility_status?: Database["public"]["Enums"]["compatibility_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          workforce_id?: string;
          version?: number;
          manifest_json?: Json;
          manifest_hash?: string;
          manifest_url?: string | null;
          public_endpoint?: string | null;
          og_manifest_ref?: string | null;
          compatibility_status?: Database["public"]["Enums"]["compatibility_status"];
          created_at?: string;
        };
      };
      workforce_roles: {
        Row: {
          id: string;
          workforce_id: string;
          role_key: string;
          name: string;
          purpose: string;
          prompt_source_type: Database["public"]["Enums"]["prompt_source_type"];
          prompt_source_value: string;
          permissions: string[];
          tools: Json;
          input_expectations: Json;
          output_expectations: Json;
          execution_mode: Database["public"]["Enums"]["role_execution_mode"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workforce_id: string;
          role_key: string;
          name: string;
          purpose: string;
          prompt_source_type: Database["public"]["Enums"]["prompt_source_type"];
          prompt_source_value: string;
          permissions?: string[];
          tools?: Json;
          input_expectations?: Json;
          output_expectations?: Json;
          execution_mode: Database["public"]["Enums"]["role_execution_mode"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workforce_id?: string;
          role_key?: string;
          name?: string;
          purpose?: string;
          prompt_source_type?: Database["public"]["Enums"]["prompt_source_type"];
          prompt_source_value?: string;
          permissions?: string[];
          tools?: Json;
          input_expectations?: Json;
          output_expectations?: Json;
          execution_mode?: Database["public"]["Enums"]["role_execution_mode"];
          created_at?: string;
          updated_at?: string;
        };
      };
      role_graph_edges: {
        Row: {
          id: string;
          workforce_id: string;
          from_role_id: string | null;
          to_role_id: string | null;
          edge_type: Database["public"]["Enums"]["edge_type"];
          condition: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          workforce_id: string;
          from_role_id?: string | null;
          to_role_id?: string | null;
          edge_type: Database["public"]["Enums"]["edge_type"];
          condition?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          workforce_id?: string;
          from_role_id?: string | null;
          to_role_id?: string | null;
          edge_type?: Database["public"]["Enums"]["edge_type"];
          condition?: Json;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          customer_id: string;
          selected_workforce_id: string | null;
          title: string;
          description: string;
          requested_budget_amount: number;
          currency: string;
          status: Database["public"]["Enums"]["job_status"];
          final_result: Json | null;
          final_result_summary: string | null;
          og_final_trace_ref: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          selected_workforce_id?: string | null;
          title: string;
          description: string;
          requested_budget_amount: number;
          currency: string;
          status?: Database["public"]["Enums"]["job_status"];
          final_result?: Json | null;
          final_result_summary?: string | null;
          og_final_trace_ref?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          selected_workforce_id?: string | null;
          title?: string;
          description?: string;
          requested_budget_amount?: number;
          currency?: string;
          status?: Database["public"]["Enums"]["job_status"];
          final_result?: Json | null;
          final_result_summary?: string | null;
          og_final_trace_ref?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      job_classifications: {
        Row: {
          job_id: string;
          category: string;
          job_type: string;
          risk_level: Database["public"]["Enums"]["risk_level"];
          required_capabilities: string[];
          budget_fit: string;
          matching_explanation: Json;
          classifier_version: string;
          created_at: string;
        };
        Insert: {
          job_id: string;
          category: string;
          job_type: string;
          risk_level: Database["public"]["Enums"]["risk_level"];
          required_capabilities?: string[];
          budget_fit: string;
          matching_explanation?: Json;
          classifier_version: string;
          created_at?: string;
        };
        Update: {
          job_id?: string;
          category?: string;
          job_type?: string;
          risk_level?: Database["public"]["Enums"]["risk_level"];
          required_capabilities?: string[];
          budget_fit?: string;
          matching_explanation?: Json;
          classifier_version?: string;
          created_at?: string;
        };
      };
      integration_references: {
        Row: {
          id: string;
          job_id: string | null;
          workforce_id: string | null;
          deployment_id: string | null;
          reference_type: Database["public"]["Enums"]["integration_reference_type"];
          external_id: string;
          uri: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          workforce_id?: string | null;
          deployment_id?: string | null;
          reference_type: Database["public"]["Enums"]["integration_reference_type"];
          external_id: string;
          uri?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string | null;
          workforce_id?: string | null;
          deployment_id?: string | null;
          reference_type?: Database["public"]["Enums"]["integration_reference_type"];
          external_id?: string;
          uri?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      job_trace_events: {
        Row: {
          id: string;
          job_id: string;
          workforce_id: string;
          role_id: string | null;
          event_type: string;
          status: string;
          title: string;
          details: Json;
          visible_to_customer: boolean;
          integration_reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          workforce_id: string;
          role_id?: string | null;
          event_type: string;
          status: string;
          title: string;
          details?: Json;
          visible_to_customer?: boolean;
          integration_reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          workforce_id?: string;
          role_id?: string | null;
          event_type?: string;
          status?: string;
          title?: string;
          details?: Json;
          visible_to_customer?: boolean;
          integration_reference_id?: string | null;
          created_at?: string;
        };
      };
      review_decisions: {
        Row: {
          id: string;
          job_id: string;
          role_id: string | null;
          artifact_reference: string;
          decision: Database["public"]["Enums"]["review_decision"];
          decided_by_type: Database["public"]["Enums"]["decision_actor_type"];
          decided_by_id: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          role_id?: string | null;
          artifact_reference: string;
          decision: Database["public"]["Enums"]["review_decision"];
          decided_by_type: Database["public"]["Enums"]["decision_actor_type"];
          decided_by_id?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          role_id?: string | null;
          artifact_reference?: string;
          decision?: Database["public"]["Enums"]["review_decision"];
          decided_by_type?: Database["public"]["Enums"]["decision_actor_type"];
          decided_by_id?: string | null;
          reason?: string | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          job_id: string;
          provider: string;
          total_amount: number;
          currency: string;
          authorization_status: Database["public"]["Enums"]["payment_status"];
          authorization_reference: string | null;
          authorized_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          provider: string;
          total_amount: number;
          currency: string;
          authorization_status?: Database["public"]["Enums"]["payment_status"];
          authorization_reference?: string | null;
          authorized_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          provider?: string;
          total_amount?: number;
          currency?: string;
          authorization_status?: Database["public"]["Enums"]["payment_status"];
          authorization_reference?: string | null;
          authorized_at?: string | null;
          created_at?: string;
        };
      };
      settlements: {
        Row: {
          id: string;
          job_id: string;
          payment_id: string;
          status: Database["public"]["Enums"]["settlement_status"];
          taskora_fee_amount: number;
          hosting_fee_amount: number;
          developer_payout_amount: number;
          keeperhub_execution_required: boolean;
          released_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          payment_id: string;
          status?: Database["public"]["Enums"]["settlement_status"];
          taskora_fee_amount?: number;
          hosting_fee_amount?: number;
          developer_payout_amount?: number;
          keeperhub_execution_required?: boolean;
          released_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          payment_id?: string;
          status?: Database["public"]["Enums"]["settlement_status"];
          taskora_fee_amount?: number;
          hosting_fee_amount?: number;
          developer_payout_amount?: number;
          keeperhub_execution_required?: boolean;
          released_at?: string | null;
          created_at?: string;
        };
      };
      payouts: {
        Row: {
          id: string;
          settlement_id: string;
          developer_id: string;
          payout_address: string;
          amount: number;
          status: Database["public"]["Enums"]["payout_status"];
          payout_reference: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          settlement_id: string;
          developer_id: string;
          payout_address: string;
          amount: number;
          status?: Database["public"]["Enums"]["payout_status"];
          payout_reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          settlement_id?: string;
          developer_id?: string;
          payout_address?: string;
          amount?: number;
          status?: Database["public"]["Enums"]["payout_status"];
          payout_reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
      };
      deployments: {
        Row: {
          id: string;
          workforce_id: string;
          deployment_mode: Database["public"]["Enums"]["deployment_mode"];
          execution_backend: Database["public"]["Enums"]["execution_backend"];
          compute_provider: Database["public"]["Enums"]["compute_provider"];
          status: Database["public"]["Enums"]["deployment_status"];
          resource_usage: Json;
          config: Json;
          public_endpoint: string | null;
          gensyn_node_ref: string | null;
          last_health_status: string | null;
          last_health_check_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workforce_id: string;
          deployment_mode: Database["public"]["Enums"]["deployment_mode"];
          execution_backend: Database["public"]["Enums"]["execution_backend"];
          compute_provider: Database["public"]["Enums"]["compute_provider"];
          status?: Database["public"]["Enums"]["deployment_status"];
          resource_usage?: Json;
          config?: Json;
          public_endpoint?: string | null;
          gensyn_node_ref?: string | null;
          last_health_status?: string | null;
          last_health_check_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workforce_id?: string;
          deployment_mode?: Database["public"]["Enums"]["deployment_mode"];
          execution_backend?: Database["public"]["Enums"]["execution_backend"];
          compute_provider?: Database["public"]["Enums"]["compute_provider"];
          status?: Database["public"]["Enums"]["deployment_status"];
          resource_usage?: Json;
          config?: Json;
          public_endpoint?: string | null;
          gensyn_node_ref?: string | null;
          last_health_status?: string | null;
          last_health_check_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      compatibility_status: "pending" | "compatible" | "incompatible";
      compute_provider: "local_runtime" | "gensyn" | "self_hosted" | "hybrid";
      default_role_mode: "customer" | "developer" | "both";
      decision_actor_type: "role" | "human";
      deployment_mode: "self_hosted" | "taskora_hosted";
      deployment_status: "draft" | "deploying" | "connected" | "available" | "paused" | "unavailable" | "failed";
      edge_type: "depends_on" | "review_gate" | "approval_gate" | "success_terminal" | "failure_terminal";
      execution_backend: "local_runtime" | "gensyn" | "self_hosted_endpoint" | "hybrid";
      integration_reference_type:
        | "og_manifest"
        | "og_trace"
        | "og_memory"
        | "og_inference"
        | "gensyn_workload"
        | "gensyn_verification"
        | "gensyn_coordination"
        | "keeperhub_workflow"
        | "keeperhub_run"
        | "keeperhub_settlement"
        | "keeperhub_execution"
        | "self_hosted_health_check";
      job_status:
        | "draft"
        | "classified"
        | "matched"
        | "payment_pending"
        | "authorized"
        | "queued"
        | "running"
        | "awaiting_approval"
        | "executing_onchain"
        | "completed"
        | "failed"
        | "rejected"
        | "canceled";
      payment_status: "pending" | "authorized" | "released" | "failed" | "voided";
      payout_status: "pending" | "paid" | "failed";
      prompt_source_type: "inline" | "skill_file" | "remote_manifest";
      review_decision: "pending" | "approved" | "rejected" | "changes_requested";
      risk_level: "low" | "medium" | "high";
      role_execution_mode: "local" | "gensyn_eligible" | "keeperhub_only" | "self_hosted";
      settlement_status: "pending" | "ready" | "released" | "failed";
      verification_status: "pending" | "verified" | "rejected";
      workforce_availability_status: "draft" | "connected" | "available" | "paused" | "unavailable";
    };
  };
}
