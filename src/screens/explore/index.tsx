import { Suspense, type ReactNode, type Ref } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  ScrollEdgeEffectProvider,
  useScrollEdgeEffectRef,
} from "@bsky.app/expo-scroll-edge-effect";
import { useLingui } from "@lingui/react/macro";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { A11y } from "@/a11y";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { ScreenFrame } from "@/components/screen-frame";
import { IOS_EXPLORE_HEADER_BODY_HEIGHT } from "@/screens/explore/constants";
import { ExploreCustomHeader } from "@/screens/explore/explore-custom-header";
import { ExploreList } from "@/screens/explore/explore-list";
import { ExploreSkeleton } from "@/screens/explore/explore-skeleton";
import { exploreMessages } from "@/screens/explore/messages";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { useAppTheme } from "@/theme";

/**
 * Discovery Explore screen.
 * iOS uses one custom scroll-linked header with a soft edge effect.
 * Android keeps its native header and renders filters in the list header.
 * Web keeps ScreenFrame and the in-screen search field.
 */
export function Explore() {
  if (process.env.EXPO_OS === "web") {
    return <ExploreWeb />;
  }
  return (
    <ScrollEdgeEffectProvider>
      <ExploreNative />
    </ScrollEdgeEffectProvider>
  );
}

function ExploreWeb() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const refresh = useExploreRefresh();

  return (
    <ScreenFrame
      title={t(exploreMessages.screenTitle)}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID="explore-screen"
    >
      <ExploreBody refresh={refresh} />
    </ScreenFrame>
  );
}

function ExploreNative() {
  const { t } = useLingui();
  const refresh = useExploreRefresh();
  const scrollEdgeRef = useScrollEdgeEffectRef();
  const scrollOffset = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const usesCustomHeader = Platform.OS === "ios";
  const headerHeight = usesCustomHeader ? insets.top + IOS_EXPLORE_HEADER_BODY_HEIGHT : 0;

  return (
    <View collapsable={false} style={styles.root} testID="explore-screen">
      <ExploreBody
        refresh={refresh}
        filtersInOverlay={usesCustomHeader}
        headerHeight={headerHeight}
        scrollRef={scrollEdgeRef}
        scrollOffset={scrollOffset}
        skeletonFallback={
          <ExploreSkeleton
            filtersInOverlay={usesCustomHeader}
            headerHeight={headerHeight}
            scrollRef={scrollEdgeRef}
            scrollOffset={scrollOffset}
          />
        }
      />
      {usesCustomHeader ? (
        <ExploreCustomHeader safeAreaTop={insets.top} scrollOffset={scrollOffset} />
      ) : null}
      <A11y.ScreenChange title={t(exploreMessages.screenTitle)} />
    </View>
  );
}

type RefreshState = ReturnType<typeof useExploreRefresh>;

type ExploreBodyProps = {
  refresh: RefreshState;
  filtersInOverlay?: boolean;
  headerHeight?: number;
  scrollRef?: Ref<unknown>;
  scrollOffset?: SharedValue<number>;
  skeletonFallback?: ReactNode;
};

function ExploreBody({
  refresh,
  filtersInOverlay = false,
  headerHeight = 0,
  scrollRef,
  scrollOffset,
  skeletonFallback,
}: ExploreBodyProps) {
  const { banner, setBanner, refreshing, handleRefresh, handleQueryErrorReset } = refresh;

  return (
    <QueryErrorBoundary onReset={handleQueryErrorReset}>
      <Suspense fallback={skeletonFallback ?? <ExploreSkeleton />}>
        <ExploreList
          banner={banner}
          onBannerChange={setBanner}
          refreshing={refreshing}
          onRefresh={() => {
            void handleRefresh();
          }}
          filtersInOverlay={filtersInOverlay}
          headerHeight={headerHeight}
          scrollRef={scrollRef}
          scrollOffset={scrollOffset}
        />
      </Suspense>
    </QueryErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
