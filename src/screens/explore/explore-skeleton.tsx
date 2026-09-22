import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { exploreMessages } from "@/screens/explore/messages";
import { spacing } from "@/theme";

/**
 * Suspense fallback for the Explore catalog list.
 * Keeps category chips visible. Uses a ScrollView so large-title binding still works.
 */
export function ExploreSkeleton() {
  const { t } = useLingui();

  useEffect(() => {
    announceStatus(t(exploreMessages.loadingAnnounce));
  }, [t]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listPad}
      style={styles.list}
      testID="explore-skeleton"
    >
      <ExploreHeader />
      <View>
        {Array.from({ length: SKELETON_LIST_ROW_COUNT }, (_, index) => (
          <ActivityCardSkeleton
            key={`skeleton-${index}`}
            testID={`activity-card-skeleton-${index}`}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
