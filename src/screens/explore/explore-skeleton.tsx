import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { exploreMessages } from "@/screens/explore/messages";
import { spacing } from "@/theme";

/**
 * Suspense fallback for the Explore catalog list.
 * Card-shaped skeletons match the success layout.
 */
export function ExploreSkeleton() {
  const { t } = useLingui();

  useEffect(() => {
    announceStatus(t(exploreMessages.loadingAnnounce));
  }, [t]);

  return (
    <View style={styles.listPad} testID="explore-skeleton">
      {Array.from({ length: SKELETON_LIST_ROW_COUNT }, (_, index) => (
        <ActivityCardSkeleton
          key={`skeleton-${index}`}
          testID={`activity-card-skeleton-${index}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
