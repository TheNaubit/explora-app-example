import { z } from "zod";

/**
 * Parse unknown payloads (mocked API responses, JSON fixtures, generated items).
 * Throws `ZodError` on invalid data so TanStack Query / callers can treat it as a request failure.
 */
export function parseWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  return schema.parse(data);
}

/**
 * Non-throwing parse when invalid data should be handled inline (log, fallback, or soft error UI).
 */
export function safeParseWithSchema<TSchema extends z.ZodType>(schema: TSchema, data: unknown) {
  return schema.safeParse(data);
}
