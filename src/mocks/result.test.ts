import { mockFailure, mockSuccess } from "@/mocks/result";
import { mockResultSchema } from "@/schemas/mock-result";
import { z } from "zod";

describe("mock result helpers", () => {
  it("builds a validated failure body", () => {
    const result = mockFailure("errors.refreshFailed");

    expect(result).toEqual({ ok: false, errorKey: "errors.refreshFailed" });
  });

  it("builds a success body without a data schema", () => {
    const result = mockSuccess({ value: 1 });

    expect(result).toEqual({ ok: true, data: { value: 1 } });
  });

  it("builds a success body and validates data when a schema is provided", () => {
    const dataSchema = z.object({ id: z.string().min(1) });
    const result = mockSuccess({ id: "act-001" }, dataSchema);

    expect(result).toEqual({ ok: true, data: { id: "act-001" } });
  });

  it("parses a mock result union schema", () => {
    const dataSchema = z.object({ id: z.string() });
    const schema = mockResultSchema(dataSchema);

    expect(schema.parse({ ok: true, data: { id: "a" } })).toEqual({
      ok: true,
      data: { id: "a" },
    });
    expect(schema.parse({ ok: false, errorKey: "errors.notFound" })).toEqual({
      ok: false,
      errorKey: "errors.notFound",
    });
  });
});
