import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";
import type { SearchBarCommands } from "react-native-screens";

import { SEARCH_DEBOUNCE_MS } from "@/components/constants";
import { exploreMessages } from "@/screens/explore/messages";
import { discovery$, setDiscoverySearch } from "@/state/discovery";

/** Native Explore title and Android header search bar. */
export function ExploreNativeSearch() {
  const { t } = useLingui();
  const storeQuery = useValue(discovery$.searchQuery);
  const [draft, setDraft] = useState(storeQuery);
  const searchBarRef = useRef<SearchBarCommands | null>(null);
  const skipDebounce = useRef(true);
  const lastPushed = useRef(storeQuery);

  useEffect(() => {
    if (storeQuery === lastPushed.current) return;
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
      startTransition(() => setDiscoverySearch(next));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [draft]);

  const onChangeText = useCallback((event: { nativeEvent: { text: string } }) => {
    setDraft(event.nativeEvent.text);
  }, []);

  const onCancelButtonPress = useCallback(() => {
    setDraft("");
    lastPushed.current = "";
    startTransition(() => setDiscoverySearch(""));
  }, []);

  const onSearchButtonPress = useCallback((event: { nativeEvent: { text: string } }) => {
    const next = event.nativeEvent.text.trim();
    setDraft(next);
    lastPushed.current = next;
    startTransition(() => setDiscoverySearch(next));
  }, []);

  if (process.env.EXPO_OS === "ios") return null;

  const title = <Stack.Title>{t(exploreMessages.heading)}</Stack.Title>;

  if (process.env.EXPO_OS === "web") return title;

  return (
    <>
      {title}
      <Stack.SearchBar
        ref={searchBarRef}
        allowToolbarIntegration={false}
        autoCapitalize="none"
        hideNavigationBar={false}
        hideWhenScrolling
        obscureBackground={false}
        onCancelButtonPress={onCancelButtonPress}
        onChangeText={onChangeText}
        onSearchButtonPress={onSearchButtonPress}
        placement="stacked"
        placeholder={t(exploreMessages.searchPlaceholder)}
      />
    </>
  );
}
