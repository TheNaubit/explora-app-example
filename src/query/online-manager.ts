import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

/**
 * Sync TanStack Query online state with `expo-network`.
 * Call once at app startup (root layout).
 */
export function setupOnlineManager(): void {
  onlineManager.setEventListener((setOnline) => {
    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    void Network.getNetworkStateAsync().then((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    return () => {
      subscription.remove();
    };
  });
}
