import { Suspense, type ReactNode, type Ref } from "react";
import { StyleSheet, View } from "react-native";
import {
  ScrollEdgeEffectProvider,
  useScrollEdgeEffectRef,
} from "@bsky.app/expo-scroll-edge-effect";
import { useLingui } from "@lingui/react/macro";

import { A11y } from "@/a11y";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { ScreenFrame } from "@/components/screen-frame";
import { ExploreList } from "@/screens/explore/explore-list";
import { ExploreScrollEdgeChips } from "@/screens/explore/explore-scroll-edge-chips";
import { ExploreSkeleton } from "@/screens/explore/explore-skeleton";
import { exploreMessages } from "@/screens/explore/messages";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { useAppTheme } from "@/theme";

/**
 * Discovery Explore screen.
 * Native: transparent header + floating chips with iOS 26 soft scroll-edge blur.
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

  return (
    <View style={styles.root} testID="explore-screen">
      <ExploreBody
        refresh={refresh}
        filtersInOverlay
        scrollRef={scrollEdgeRef}
        skeletonFallback={<ExploreSkeleton scrollRef={scrollEdgeRef} filtersInOverlay />}
      />
      <ExploreScrollEdgeChips />
      <A11y.ScreenChange title={t(exploreMessages.screenTitle)} />
    </View>
  );
}

type RefreshState = ReturnType<typeof useExploreRefresh>;

type ExploreBodyProps = {
  refresh: RefreshState;
  filtersInOverlay?: boolean;
  scrollRef?: Ref<unknown>;
  skeletonFallback?: ReactNode;
};

function ExploreBody({
  refresh,
  filtersInOverlay = false,
  scrollRef,
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
          scrollRef={scrollRef}
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
