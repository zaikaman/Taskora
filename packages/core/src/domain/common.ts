import { z } from "zod";

export const trimmedStringSchema = z.string().trim();
export const nonEmptyTrimmedStringSchema = trimmedStringSchema.min(1);
export const nullableUrlSchema = z.string().url().nullable().optional();
export const timestampSchema = z.string().datetime({ offset: true });
export const currencyCodeSchema = z.string().trim().min(3).max(3).transform((value) => value.toUpperCase());

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValueSchema), z.record(jsonValueSchema)])
);

export const jsonObjectSchema = z.record(jsonValueSchema);

export const moneySchema = z.object({
  amount: z.number().finite().nonnegative(),
  currency: currencyCodeSchema
});

export const paginationSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  cursor: z.string().trim().min(1).optional()
});

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
