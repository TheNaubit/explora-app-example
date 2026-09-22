import { Suspense } from "react";
import { useLingui } from "@lingui/react/macro";

import { A11y } from "@/a11y";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { ScreenFrame } from "@/components/screen-frame";
import { ExploreList } from "@/screens/explore/explore-list";
import { ExploreSkeleton } from "@/screens/explore/explore-skeleton";
import { exploreMessages } from "@/screens/explore/messages";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { useAppTheme } from "@/theme";

/**
 * Discovery Explore screen.
 * On native, the catalog list is the first host view so iOS can bind large title and search.
 * Web keeps ScreenFrame safe-area padding and the in-screen search field.
 */
export function Explore() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { banner, setBanner, refreshing, handleRefresh, handleQueryErrorReset } =
    useExploreRefresh();

  const body = (
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
  );

  if (process.env.EXPO_OS === "web") {
    return (
      <ScreenFrame
        title={t(exploreMessages.screenTitle)}
        contentStyle={{ backgroundColor: theme.colors.background }}
        testID="explore-screen"
      >
        {body}
      </ScreenFrame>
    );
  }

  return (
    <>
      {body}
      <A11y.ScreenChange title={t(exploreMessages.screenTitle)} />
    </>
  );
}
