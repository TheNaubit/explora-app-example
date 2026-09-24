import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import { useRefreshCatalog } from "@/hooks/use-refresh-catalog";
import { hapticActionError, hapticRefreshSuccess } from "@/haptics/feedback";
import { resolveErrorMessage } from "@/i18n";
import { isApiError } from "@/query/errors";
import { activityKeys } from "@/query/keys";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";

/**
 * Pull-to-refresh and first-load error reset for Explore.
 * Keeps list content visible. Maps refresh failures to an inline banner.
 */
export function useExploreRefresh() {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const refresh = useRefreshCatalog();
  const refreshInFlight = useRef(false);
  const [banner, setBanner] = useState<ExploreBannerState>(null);

  async function handleRefresh() {
    if (refreshInFlight.current) {
      return;
    }

    refreshInFlight.current = true;
    setBanner(null);
    try {
      await refresh.mutateAsync();
      hapticRefreshSuccess();
      announceStatus(t(exploreMessages.refreshSuccessAnnounce));
    } catch (error) {
      const errorKey = isApiError(error) ? error.errorKey : "errors.refreshFailed";
      setBanner({ kind: "refresh", errorKey });
      hapticActionError();
      announceStatus(t(resolveErrorMessage(errorKey)));
    } finally {
      refreshInFlight.current = false;
    }
  }

  function handleQueryErrorReset() {
    void queryClient.resetQueries({ queryKey: activityKeys.lists() });
  }

  return {
    banner,
    setBanner,
    refreshing: refresh.isPending,
    handleRefresh,
    handleQueryErrorReset,
  };
}
