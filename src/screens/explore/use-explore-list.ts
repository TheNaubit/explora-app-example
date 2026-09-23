import { useEffect } from "react";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import { useActivities } from "@/hooks/use-activities";
import { isApiError } from "@/query/errors";
import type { ActivityListFilters } from "@/query/keys";
import { flattenActivityPages } from "@/screens/explore/flatten-activity-pages";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";

type UseExploreListArgs = {
  filters: ActivityListFilters;
  onBannerChange: (banner: ExploreBannerState) => void;
};

/**
 * Suspense catalog list for Explore.
 * Flattens pages, announces empty or loaded, and loads the next page on scroll.
 */
export function useExploreList({ filters, onBannerChange }: UseExploreListArgs) {
  const { t } = useLingui();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    failureReason,
    fetchStatus,
  } = useActivities(filters);
  const activities = flattenActivityPages(data);

  useEffect(() => {
    if (activities.length === 0) {
      announceStatus(
        t(
          filters.search.length > 0 || filters.categories.length > 0
            ? exploreMessages.emptyAnnounce
            : exploreMessages.browseEmptyAnnounce,
        ),
      );
      return;
    }
    announceStatus(t(exploreMessages.loadedAnnounce));
  }, [activities.length, filters.categories.length, filters.search.length, t]);

  useEffect(() => {
    if (!isFetchNextPageError) {
      return;
    }

    const errorKey = isApiError(failureReason) ? failureReason.errorKey : "errors.unknown";
    onBannerChange({ kind: "nextPage", errorKey });
  }, [failureReason, isFetchNextPageError, onBannerChange]);

  async function handleEndReached() {
    if (!hasNextPage || isFetchingNextPage || fetchStatus === "fetching") {
      return;
    }

    try {
      await fetchNextPage();
    } catch (error) {
      const errorKey = isApiError(error) ? error.errorKey : "errors.unknown";
      onBannerChange({ kind: "nextPage", errorKey });
    }
  }

  return {
    activities,
    isFetchingNextPage,
    handleEndReached,
  };
}
