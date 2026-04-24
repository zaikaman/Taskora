import { traceEventSchema, type TraceEvent } from "@taskora/core";

export interface TraceEventInput extends Omit<TraceEvent, "id" | "createdAt"> {
  id?: string;
  createdAt?: string;
}

export function createTraceEvent(input: TraceEventInput): TraceEvent {
  return traceEventSchema.parse({
    ...input,
    id: input.id ?? crypto.randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString()
  });
}

export function createRoleTraceEvent(
  input: TraceEventInput & { roleName: string }
): TraceEvent {
  return createTraceEvent({
    ...input,
    details: {
      roleName: input.roleName,
      ...input.details
    }
  });
}
