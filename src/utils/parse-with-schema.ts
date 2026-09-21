import { z } from "zod";

/**
 * Parse unknown payloads (mocked API responses, JSON fixtures, generated items).
 * Throws a ZodError on invalid data so Query / callers can treat it as a failure.
 */
export function parseWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  return schema.parse(data);
}

/**
 * Safe variant for cases where invalid data should not throw (e.g. logging + fallback).
 */
export function safeParseWithSchema<TSchema extends z.ZodType>(schema: TSchema, data: unknown) {
  return schema.safeParse(data);
}
