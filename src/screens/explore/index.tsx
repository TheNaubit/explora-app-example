import { useCallback, useMemo, type Ref } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import {
  ScrollEdgeEffectProvider,
  useScrollEdgeEffectRef,
} from "@bsky.app/expo-scroll-edge-effect";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";
import { useFocusEffect } from "expo-router";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenFrame } from "@/components/screen-frame";
import { toActivityListFilters } from "@/query/activity-queries";
import type { ActivityListFilters } from "@/query/keys";
import {
  IOS_EXPLORE_HEADER_BODY_HEIGHT,
  IOS_EXPLORE_HEADER_FONT_SCALE_ALLOWANCE,
} from "@/screens/explore/constants";
import { ExploreCustomHeader } from "@/screens/explore/explore-custom-header";
import { ExploreList } from "@/screens/explore/explore-list";
import { exploreMessages } from "@/screens/explore/messages";
import type { DiscoveryMode } from "@/screens/explore/types";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { discovery$, getDiscoveryScrollOffset, setDiscoveryScrollOffset } from "@/state/discovery";
import { useAppTheme } from "@/theme";

/** Explore discovery catalog with header search and category filters. */
export function Explore({ mode = "browse" }: { mode?: DiscoveryMode }) {
  if (process.env.EXPO_OS === "web") return <ExploreWeb mode={mode} />;
  return (
    <ScrollEdgeEffectProvider>
      <ExploreNative mode={mode} />
    </ScrollEdgeEffectProvider>
  );
}

function ExploreWeb({ mode }: { mode: DiscoveryMode }) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const refresh = useExploreRefresh();
  const filters = useDiscoveryFilters();
  const title = t(exploreMessages.screenTitle);

  return (
    <ScreenFrame
      title={title}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID={mode === "search" ? "search-screen" : "explore-screen"}
    >
      <ExploreBody filters={filters} mode={mode} refresh={refresh} />
    </ScreenFrame>
  );
}

function ExploreNative({ mode }: { mode: DiscoveryMode }) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const refresh = useExploreRefresh();
  const filters = useDiscoveryFilters();
  const scrollEdgeRef = useScrollEdgeEffectRef();
  const scrollOffset = useSharedValue(getDiscoveryScrollOffset(filters));
  const insets = useSafeAreaInsets();
  const { fontScale: measuredFontScale } = useWindowDimensions();
  const fontScale = measuredFontScale ?? 1;
  const usesCustomHeader = Platform.OS === "ios";
  const headerBodyHeight =
    IOS_EXPLORE_HEADER_BODY_HEIGHT +
    Math.max(0, fontScale - 1) * IOS_EXPLORE_HEADER_FONT_SCALE_ALLOWANCE;
  const headerHeight = usesCustomHeader ? insets.top + headerBodyHeight : 0;
  const title = t(exploreMessages.screenTitle);

  useFocusEffect(
    useCallback(
      () => () => {
        setDiscoveryScrollOffset(filters, scrollOffset.get());
      },
      [filters, scrollOffset],
    ),
  );

  return (
    <ScreenFrame
      title={title}
      padHorizontal={false}
      padTop={false}
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      testID={mode === "search" ? "search-screen" : "explore-screen"}
    >
      <ExploreBody
        filters={filters}
        mode={mode}
        refresh={refresh}
        filtersInOverlay={usesCustomHeader}
        headerHeight={headerHeight}
        scrollRef={usesCustomHeader ? scrollEdgeRef : undefined}
        scrollOffset={usesCustomHeader ? scrollOffset : undefined}
      />
      {usesCustomHeader ? (
        <ExploreCustomHeader
          bodyHeight={headerBodyHeight}
          safeAreaTop={insets.top}
          scrollOffset={scrollOffset}
          title={title}
        />
      ) : null}
    </ScreenFrame>
  );
}

function useDiscoveryFilters(): ActivityListFilters {
  const searchQuery = useValue(discovery$.searchQuery);
  const categories = useValue(discovery$.categories);
  return useMemo(() => toActivityListFilters(searchQuery, categories), [categories, searchQuery]);
}

type RefreshState = ReturnType<typeof useExploreRefresh>;

type ExploreBodyProps = {
  filters: ActivityListFilters;
  mode: DiscoveryMode;
  refresh: RefreshState;
  filtersInOverlay?: boolean;
  headerHeight?: number;
  scrollRef?: Ref<unknown>;
  scrollOffset?: SharedValue<number>;
};

function ExploreBody({
  filters,
  mode,
  refresh,
  filtersInOverlay = false,
  headerHeight = 0,
  scrollRef,
  scrollOffset,
}: ExploreBodyProps) {
  const { banner, setBanner, refreshing, handleRefresh } = refresh;

  return (
    <ExploreList
      banner={banner}
      filters={filters}
      mode={mode}
      onBannerChange={setBanner}
      refreshing={refreshing}
      onRefresh={() => void handleRefresh()}
      filtersInOverlay={filtersInOverlay}
      headerHeight={headerHeight}
      scrollRef={scrollRef}
      scrollOffset={scrollOffset}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
