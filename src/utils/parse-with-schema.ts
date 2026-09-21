import { z } from "zod";

/**
 * Parse unknown payloads (mocked API responses, JSON fixtures, generated items).
 * Throws `ZodError` when data is invalid so TanStack Query can treat it as a failure.
 */
export function parseWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  return schema.parse(data);
}

/**
 * Parse without a throw when invalid data needs inline handling (log, fallback, or soft error UI).
 */
export function safeParseWithSchema<TSchema extends z.ZodType>(schema: TSchema, data: unknown) {
  return schema.safeParse(data);
}
