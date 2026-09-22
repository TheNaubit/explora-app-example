import { ApiError, isApiError, unwrapMockResult } from "@/query/errors";
import { mockFailure, mockSuccess } from "@/mocks/result";

describe("query errors", () => {
  it("unwraps successful mock results", () => {
    const payload = { ok: true as const };
    expect(unwrapMockResult(mockSuccess(payload))).toEqual(payload);
  });

  it("throws ApiError with errorKey on failure", () => {
    expect(() => unwrapMockResult(mockFailure("errors.refreshFailed"))).toThrow(ApiError);

    try {
      unwrapMockResult(mockFailure("errors.refreshFailed"));
    } catch (error) {
      expect(isApiError(error)).toBe(true);
      if (isApiError(error)) {
        expect(error.errorKey).toBe("errors.refreshFailed");
        expect(error.message).toBe("errors.refreshFailed");
      }
    }
  });
});
