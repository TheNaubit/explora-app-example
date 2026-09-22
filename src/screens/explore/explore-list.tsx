import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { LegendList } from "@legendapp/list/react-native";
import { useLingui } from "@lingui/react/macro";

import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/empty-state";
import { emptySearchIllustration } from "@/illustrations";
import { resetDiscoveryFilters } from "@/state/discovery";
import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";
import { useExploreList } from "@/screens/explore/use-explore-list";
import { spacing, useAppTheme } from "@/theme";

type ExploreListProps = {
  banner: ExploreBannerState;
  onBannerChange: (banner: ExploreBannerState) => void;
  refreshing: boolean;
  onRefresh: () => void;
};

/**
 * Explore catalog body after Suspense resolves.
 * Shows empty state or the infinite activity list.
 */
export function ExploreList({ banner, onBannerChange, refreshing, onRefresh }: ExploreListProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { activities, isFetchingNextPage, handleEndReached } = useExploreList({ onBannerChange });

  const bannerNode =
    banner !== null ? (
      <ExploreStatusBanner
        banner={banner}
        onDismiss={() => onBannerChange(null)}
        onRetryRefresh={onRefresh}
        onRetryNextPage={() => {
          void handleEndReached();
        }}
      />
    ) : null;

  if (activities.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyScroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        testID="explore-empty"
      >
        {bannerNode}
        <EmptyState
          title={t(exploreMessages.emptyTitle)}
          body={t(exploreMessages.emptyBody)}
          actionLabel={t(exploreMessages.emptyAction)}
          illustration={emptySearchIllustration}
          onAction={() => {
            resetDiscoveryFilters();
          }}
        />
      </ScrollView>
    );
  }

  return (
    <LegendList
      data={activities}
      keyExtractor={(item) => item.id}
      recycleItems
      renderItem={({ item }) => <ActivityCard activity={item} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={bannerNode}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : null
      }
      contentContainerStyle={styles.listPad}
      style={styles.list}
      testID="explore-list"
    />
  );
}

const styles = StyleSheet.create({
  emptyScroll: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: spacing.space16,
  },
  list: {
    flex: 1,
  },
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
