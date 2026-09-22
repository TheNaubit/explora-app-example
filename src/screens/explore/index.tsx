import { Suspense } from "react";
import { useLingui } from "@lingui/react/macro";

import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { ScreenFrame } from "@/components/screen-frame";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { ExploreList } from "@/screens/explore/explore-list";
import { ExploreSkeleton } from "@/screens/explore/explore-skeleton";
import { exploreMessages } from "@/screens/explore/messages";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { useAppTheme } from "@/theme";

/**
 * Discovery Explore screen.
 * Composes header, Suspense list, and refresh. Keeps screen logic in colocated hooks.
 */
export function Explore() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { banner, setBanner, refreshing, handleRefresh, handleQueryErrorReset } =
    useExploreRefresh();

  return (
    <ScreenFrame
      title={t(exploreMessages.screenTitle)}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID="explore-screen"
    >
      <ExploreHeader />
      <QueryErrorBoundary onReset={handleQueryErrorReset}>
        <Suspense fallback={<ExploreSkeleton />}>
          <ExploreList
            banner={banner}
            onBannerChange={setBanner}
            refreshing={refreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
          />
        </Suspense>
      </QueryErrorBoundary>
    </ScreenFrame>
  );
}
