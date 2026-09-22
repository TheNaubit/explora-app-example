import type { ErrorKey } from "@/i18n/error-keys";
import type { MockErrorBody, MockResult, MockSuccessBody } from "@/schemas/mock-result";
import { mockErrorBodySchema, mockSuccessBodySchema } from "@/schemas/mock-result";
import { parseWithSchema } from "@/utils/parse-with-schema";
import { z } from "zod";

export type { MockErrorBody, MockResult, MockSuccessBody };

/** Build a failed mock body with a stable error key. */
export function mockFailure(errorKey: ErrorKey): MockErrorBody {
  return parseWithSchema(mockErrorBodySchema, { ok: false, errorKey });
}

/** Build a successful mock body. Validates `data` when a schema is provided. */
export function mockSuccess<T>(data: T): MockSuccessBody<T>;
export function mockSuccess<TSchema extends z.ZodType>(
  data: z.infer<TSchema>,
  dataSchema: TSchema,
): MockSuccessBody<z.infer<TSchema>>;
export function mockSuccess<T>(data: T, dataSchema?: z.ZodType<T>): MockSuccessBody<T> {
  if (dataSchema) {
    return parseWithSchema(mockSuccessBodySchema(dataSchema), {
      ok: true as const,
      data,
    });
  }

  return { ok: true, data };
}
