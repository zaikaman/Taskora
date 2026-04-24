import type { Database } from "./database.js";

export type { Database, Json } from "./database.js";

type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];
export type TableRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"];
export type EnumName = keyof PublicSchema["Enums"];
export type EnumValue<T extends EnumName> = PublicSchema["Enums"][T];

export type ProfileRow = TableRow<"profiles">;
export type DeveloperProfileRow = TableRow<"developer_profiles">;
export type WorkforceRow = TableRow<"workforces">;
export type WorkforceManifestRow = TableRow<"workforce_manifests">;
export type WorkforceRoleRow = TableRow<"workforce_roles">;
export type RoleGraphEdgeRow = TableRow<"role_graph_edges">;
export type JobRow = TableRow<"jobs">;
export type JobClassificationRow = TableRow<"job_classifications">;
export type IntegrationReferenceRow = TableRow<"integration_references">;
export type JobTraceEventRow = TableRow<"job_trace_events">;
export type ReviewDecisionRow = TableRow<"review_decisions">;
export type PaymentRow = TableRow<"payments">;
export type SettlementRow = TableRow<"settlements">;
export type PayoutRow = TableRow<"payouts">;
export type DeploymentRow = TableRow<"deployments">;
