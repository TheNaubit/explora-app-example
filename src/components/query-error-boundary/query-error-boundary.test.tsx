import { createElement } from "react";
import { Text } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { ApiError } from "@/query/errors";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

function Boom({ fail }: { fail: boolean }) {
  if (fail) {
    throw new ApiError("errors.networkTimeout");
  }
  return createElement(Text, null, "ok");
}

function UnknownBoom(): null {
  throw new Error("nope");
}

describe("QueryErrorBoundary", () => {
  it("shows ApiError copy and retries", async () => {
    const onReset = jest.fn();
    let fail = true;

    function Child() {
      return createElement(Boom, { fail });
    }

    await render(
      createElement(QueryErrorBoundary, {
        onReset,
        children: createElement(Child),
      }),
      {
        wrapper: createProviders(createQueryClient()),
      },
    );

    expect(screen.getByTestId("query-error-boundary")).toBeTruthy();
    expect(screen.getByText(/took too long/i)).toBeTruthy();

    fail = false;
    await act(async () => {
      fireEvent.press(screen.getByTestId("query-error-retry"));
    });
    expect(onReset).toHaveBeenCalled();
  });

  it("falls back to unknown errors", async () => {
    await render(
      createElement(QueryErrorBoundary, {
        children: createElement(UnknownBoom),
      }),
      {
        wrapper: createProviders(createQueryClient()),
      },
    );

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
  });
});
