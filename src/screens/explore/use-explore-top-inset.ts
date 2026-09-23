import { useContext } from "react";
import { Platform } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { IOS_LARGE_TITLE_AND_SEARCH_BLOCK } from "@/screens/explore/constants";

/**
 * Top pad so catalog content clears the transparent iOS header chrome.
 * Android uses an opaque header, so the scene already starts below it.
 * Reads insets from context when present (tests may omit SafeAreaProvider).
 */
export function useExploreTopInset(): number {
  const insets = useContext(SafeAreaInsetsContext);
  if (Platform.OS !== "ios") {
    return 0;
  }
  return (insets?.top ?? 0) + IOS_LARGE_TITLE_AND_SEARCH_BLOCK;
}
