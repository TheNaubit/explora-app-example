import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

import { setupOnlineManager } from "@/query/online-manager";

describe("setupOnlineManager", () => {
  it("subscribes to expo-network and updates online state", async () => {
    const remove = jest.fn();
    const addNetworkStateListener = jest.mocked(Network.addNetworkStateListener);
    addNetworkStateListener.mockReturnValue({ remove } as never);

    const getNetworkStateAsync = jest.mocked(Network.getNetworkStateAsync);
    getNetworkStateAsync.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
      type: "NONE" as never,
    });

    setupOnlineManager();

    expect(addNetworkStateListener).toHaveBeenCalled();
    expect(getNetworkStateAsync).toHaveBeenCalled();

    await Promise.resolve();
    expect(onlineManager.isOnline()).toBe(false);

    const listener = addNetworkStateListener.mock.calls[0]?.[0];
    listener?.({ isConnected: true, isInternetReachable: true, type: "WIFI" as never });
    expect(onlineManager.isOnline()).toBe(true);

    // Replacing the event listener should tear down the previous subscription.
    onlineManager.setEventListener(() => () => undefined);
    expect(remove).toHaveBeenCalled();
  });
});
