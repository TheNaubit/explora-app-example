import { z } from "zod";

import { errorKeys } from "@/i18n/error-keys";

/** Stable error keys returned by mocks. Matches `errorKeys` in `@/i18n/error-keys`. */
export const errorKeySchema = z.enum(errorKeys);

/** Failed mock / network response body. Always includes `errorKey`, never localized copy. */
export const mockErrorBodySchema = z.object({
  ok: z.literal(false),
  errorKey: errorKeySchema,
});

/** Successful mock response wrapper. `data` is validated by the caller with a payload schema. */
export function mockSuccessBodySchema<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.object({
    ok: z.literal(true),
    data: dataSchema,
  });
}

/** Union of success and failure mock envelopes for a given payload schema. */
export function mockResultSchema<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.discriminatedUnion("ok", [mockSuccessBodySchema(dataSchema), mockErrorBodySchema]);
}

export type ErrorKeyFromSchema = z.infer<typeof errorKeySchema>;
export type MockErrorBody = z.infer<typeof mockErrorBodySchema>;
export type MockSuccessBody<T> = {
  ok: true;
  data: T;
};
export type MockResult<T> = MockSuccessBody<T> | MockErrorBody;
