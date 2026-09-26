import { useRef, useState } from "react";
import { useLingui } from "@lingui/react/macro";

import { useRefreshCatalog } from "@/hooks/use-refresh-catalog";
import { resolveFeedbackPresentation } from "@/feedback/feedback-policy";
import { resolveErrorMessage } from "@/i18n";
import { showNativeToast } from "@/native-toast";
import { isApiError } from "@/query/errors";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";

/**
 * Handle pull-to-refresh for Explore.
 * Keep list content visible and show transient refresh failures in a toast.
 */
export function useExploreRefresh() {
  const { t } = useLingui();
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
    } catch (error) {
      const errorKey = isApiError(error) ? error.errorKey : "errors.refreshFailed";
      const presentation = resolveFeedbackPresentation({
        kind: "error",
        recovery: "transient",
      });
      if (presentation === "toast") {
        showNativeToast({
          message: t(resolveErrorMessage(errorKey)),
          title: t(exploreMessages.refreshFailedTitle),
          type: "error",
        });
      }
    } finally {
      refreshInFlight.current = false;
    }
  }

  return {
    banner,
    setBanner,
    refreshing: refresh.isPending,
    handleRefresh,
  };
}
