import { act, renderHook } from "@testing-library/react-native";

import { usePullToRefreshMotion } from "@/components/pull-to-refresh/use-pull-to-refresh-motion";

describe("usePullToRefreshMotion", () => {
  it("accepts another native refresh request after the previous request ends", async () => {
    const onCompletePull = jest.fn();
    const { result, rerender } = await renderHook<
      ReturnType<typeof usePullToRefreshMotion>,
      { refreshing: boolean }
    >(({ refreshing }) => usePullToRefreshMotion(refreshing, onCompletePull), {
      initialProps: { refreshing: false },
    });

    await act(() => {
      result.current.requestRefresh();
    });
    expect(onCompletePull).toHaveBeenCalledTimes(1);

    await rerender({ refreshing: true });
    await rerender({ refreshing: false });

    await act(() => {
      result.current.requestRefresh();
    });
    expect(onCompletePull).toHaveBeenCalledTimes(2);
  });

  it("ignores rebound scroll events after an incomplete pull ends", async () => {
    const onCompletePull = jest.fn();
    const { result } = await renderHook(() => usePullToRefreshMotion(false, onCompletePull));

    await act(() => {
      result.current.beginPull();
      result.current.updatePull(-36);
    });
    expect(result.current.progress.get()).toBe(0.5);

    await act(() => {
      result.current.finishPull();
      result.current.updatePull(-18);
    });

    expect(result.current.progress.get()).toBe(0);
    expect(onCompletePull).not.toHaveBeenCalled();
  });
});
