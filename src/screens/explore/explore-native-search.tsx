import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";
import type { SearchBarCommands } from "react-native-screens";

import { SEARCH_DEBOUNCE_MS } from "@/components/constants";
import { exploreMessages } from "@/screens/explore/messages";
import { discovery$, setDiscoverySearch } from "@/state/discovery";

/**
 * Native stack title and search bar for Explore on iOS and Android.
 * Keeps the bar text in sync when filters clear from the empty state.
 * Handlers stay stable so header options do not reconfigure on every keystroke.
 * Web returns only the title; the in-screen SearchField lives in ExploreHeader.
 */
export function ExploreNativeSearch() {
  const { t } = useLingui();
  const storeQuery = useValue(discovery$.searchQuery);
  const [draft, setDraft] = useState(storeQuery);
  const searchBarRef = useRef<SearchBarCommands | null>(null);
  const skipDebounce = useRef(true);
  /** Last query this bar pushed to the store. Used to detect external clears. */
  const lastPushed = useRef(storeQuery);

  useEffect(() => {
    if (storeQuery === lastPushed.current) {
      return;
    }
    lastPushed.current = storeQuery;
    setDraft(storeQuery);
    searchBarRef.current?.setText(storeQuery);
  }, [storeQuery]);

  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;
      return;
    }

    const handle = setTimeout(() => {
      const next = draft.trim();
      lastPushed.current = next;
      startTransition(() => {
        setDiscoverySearch(next);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [draft]);

  const onChangeText = useCallback((event: { nativeEvent: { text: string } }) => {
    setDraft(event.nativeEvent.text);
  }, []);

  const onCancelButtonPress = useCallback(() => {
    setDraft("");
    lastPushed.current = "";
    startTransition(() => {
      setDiscoverySearch("");
    });
  }, []);

  const onSearchButtonPress = useCallback((event: { nativeEvent: { text: string } }) => {
    const next = event.nativeEvent.text.trim();
    setDraft(next);
    lastPushed.current = next;
    startTransition(() => {
      setDiscoverySearch(next);
    });
  }, []);

  if (process.env.EXPO_OS === "ios") {
    return null;
  }

  const title = <Stack.Title>{t(exploreMessages.heading)}</Stack.Title>;

  if (process.env.EXPO_OS === "web") {
    return title;
  }

  return (
    <>
      {title}
      <Stack.SearchBar
        ref={searchBarRef}
        placeholder={t(exploreMessages.searchPlaceholder)}
        autoCapitalize="none"
        hideWhenScrolling
        // Stacked avoids iOS 26 toolbar integration with NativeTabs, which can
        // break the screen width when the search controller activates.
        placement="stacked"
        allowToolbarIntegration={false}
        obscureBackground={false}
        hideNavigationBar={false}
        onChangeText={onChangeText}
        onCancelButtonPress={onCancelButtonPress}
        onSearchButtonPress={onSearchButtonPress}
      />
    </>
  );
}
