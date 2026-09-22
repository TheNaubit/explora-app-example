import { useLingui } from "@lingui/react/macro";

import { InlineStatusBanner } from "@/components/inline-status-banner";
import { resolveErrorMessage } from "@/i18n";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";

type ExploreStatusBannerProps = {
  banner: NonNullable<ExploreBannerState>;
  onDismiss: () => void;
  onRetryRefresh: () => void;
  onRetryNextPage: () => void;
};

/**
 * Inline Explore failure banner for refresh or next-page errors.
 */
export function ExploreStatusBanner({
  banner,
  onDismiss,
  onRetryRefresh,
  onRetryNextPage,
}: ExploreStatusBannerProps) {
  const { t } = useLingui();

  return (
    <InlineStatusBanner
      title={t(
        banner.kind === "refresh"
          ? exploreMessages.refreshFailedTitle
          : exploreMessages.nextPageFailedTitle,
      )}
      body={t(resolveErrorMessage(banner.errorKey))}
      actionLabel={t(exploreMessages.bannerRetry)}
      onAction={() => {
        const kind = banner.kind;
        onDismiss();
        if (kind === "refresh") {
          onRetryRefresh();
          return;
        }
        onRetryNextPage();
      }}
    />
  );
}
