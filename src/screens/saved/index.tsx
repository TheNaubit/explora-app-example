import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LegendList } from "@legendapp/list/react-native";
import { useLingui } from "@lingui/react/macro";
import { router } from "expo-router";

import { announceStatus } from "@/a11y";
import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/empty-state";
import { ScreenFrame } from "@/components/screen-frame";
import { emptySearchIllustration } from "@/illustrations";
import { savedMessages } from "@/screens/saved/messages";
import { useSavedActivities } from "@/screens/saved/use-saved-activities";
import { spacing, typography, useAppTheme } from "@/theme";

/**
 * Saved favorites tab.
 * Lists offline snapshots. Empty state links back to Explore.
 */
export function Saved() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const activities = useSavedActivities();

  useEffect(() => {
    if (activities.length === 0) {
      announceStatus(t(savedMessages.emptyAnnounce));
      return;
    }
    announceStatus(t(savedMessages.loadedAnnounce));
  }, [activities.length, t]);

  return (
    <ScreenFrame
      title={t(savedMessages.screenTitle)}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID="saved-screen"
    >
      <Text style={[styles.heading, { color: theme.colors.text }]} accessibilityRole="header">
        {t(savedMessages.heading)}
      </Text>
      <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
        {t(savedMessages.offlineHint)}
      </Text>
      {activities.length === 0 ? (
        <View style={styles.empty} testID="saved-empty">
          <EmptyState
            title={t(savedMessages.emptyTitle)}
            body={t(savedMessages.emptyBody)}
            actionLabel={t(savedMessages.emptyAction)}
            illustration={emptySearchIllustration}
            onAction={() => {
              router.navigate("/");
            }}
          />
        </View>
      ) : (
        <LegendList
          data={activities}
          keyExtractor={(item) => item.id}
          recycleItems
          renderItem={({ item }) => <ActivityCard activity={item} />}
          contentContainerStyle={styles.listPad}
          style={styles.list}
          testID="saved-list"
        />
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
  },
  heading: {
    ...typography.display,
    marginBottom: spacing.space8,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space16,
    textAlign: "left",
  },
  hint: {
    ...typography.caption,
    marginBottom: spacing.space16,
    marginHorizontal: spacing.space24,
    textAlign: "left",
  },
  list: {
    flex: 1,
  },
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
