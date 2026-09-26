import { useLingui } from "@lingui/react/macro";

import { InlineStatusBanner } from "@/components/inline-status-banner";
import { resolveErrorMessage } from "@/i18n";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";

type ExploreStatusBannerProps = {
  banner: NonNullable<ExploreBannerState>;
  onDismiss: () => void;
  onRetryNextPage: () => void;
};

/**
 * Inline Explore recovery for a next-page error.
 */
export function ExploreStatusBanner({
  banner,
  onDismiss,
  onRetryNextPage,
}: ExploreStatusBannerProps) {
  const { t } = useLingui();

  return (
    <InlineStatusBanner
      actionTestID="explore-next-page-retry"
      title={t(exploreMessages.nextPageFailedTitle)}
      body={t(resolveErrorMessage(banner.errorKey))}
      actionLabel={t(exploreMessages.bannerRetry)}
      onAction={() => {
        onDismiss();
        onRetryNextPage();
      }}
      testID="explore-next-page-error"
    />
  );
}
