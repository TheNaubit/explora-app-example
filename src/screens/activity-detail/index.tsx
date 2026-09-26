import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { announceStatus } from "@/a11y";
import { EmptyState } from "@/components/empty-state";
import { ScreenFrame } from "@/components/screen-frame";
import { getActivityCoverImage } from "@/data/activity-image";
import { resolveFeedbackPresentation } from "@/feedback/feedback-policy";
import { useActivity } from "@/hooks/use-activity";
import { emptySearchIllustration } from "@/illustrations";
import { categoryMessages } from "@/i18n/category-labels";
import { resolveErrorMessage } from "@/i18n";
import { showNativeToast } from "@/native-toast";
import { isApiError } from "@/query/errors";
import { ActivityCategoryBadge } from "@/screens/activity-detail/activity-category-badge";
import { ActivityDetailControls } from "@/screens/activity-detail/activity-detail-controls";
import { ActivityDetailErrorState } from "@/screens/activity-detail/activity-detail-error-state";
import { ActivityDetailSkeleton } from "@/screens/activity-detail/activity-detail-skeleton";
import { AddToCalendarSection } from "@/screens/activity-detail/add-to-calendar-section";
import { HeroImageBlend } from "@/screens/activity-detail/hero-image-blend";
import {
  ACTIVITY_DETAIL_BOTTOM_CHROME_CLEARANCE,
  ACTIVITY_DETAIL_HERO_ASPECT_RATIO,
  ACTIVITY_DETAIL_HERO_MAX_HEIGHT,
} from "@/screens/activity-detail/constants";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import type { Activity } from "@/schemas/activity";
import { spacing, typography, useAppTheme } from "@/theme";
import { formatDuration } from "@/utils/format-duration";

type ActivityDetailProps = {
  id: string;
};

/** Activity Detail screen with designed loading, not-found, error, and content states. */
export function ActivityDetail({ id }: ActivityDetailProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const screenTitle = t(activityDetailMessages.screenTitle);

  return (
    <ScreenFrame
      contentStyle={{ backgroundColor: theme.colors.background }}
      padHorizontal={false}
      padTop={false}
      testID="activity-detail-screen"
      title={screenTitle}
    >
      <ActivityDetailContent id={id} bottomInset={insets.bottom} topInset={insets.top} />
      <ActivityDetailControls backLabel={t(activityDetailMessages.back)} safeAreaTop={insets.top} />
    </ScreenFrame>
  );
}

type ActivityDetailContentProps = {
  bottomInset: number;
  id: string;
  topInset: number;
};

function ActivityDetailContent({ bottomInset, id, topInset }: ActivityDetailContentProps) {
  const { t } = useLingui();
  const { data, error, isPending, refetch } = useActivity(id);

  if (isPending) {
    return (
      <ActivityDetailSkeleton loadingAnnouncement={t(activityDetailMessages.loadingAnnounce)} />
    );
  }

  if (error !== null && data === undefined) {
    const errorKey = isApiError(error) ? error.errorKey : "errors.unknown";

    return (
      <ActivityDetailErrorState
        body={t(resolveErrorMessage(errorKey))}
        onRetry={() => {
          void refetch();
        }}
        retryLabel={t(activityDetailMessages.loadErrorRetry)}
        title={t(activityDetailMessages.loadErrorTitle)}
        topInset={topInset}
      />
    );
  }

  if (data === null) {
    return <ActivityNotFound />;
  }

  return (
    <ActivityDetailLoaded
      activity={data.activity}
      bottomInset={bottomInset}
      hasSavedFallback={error !== null}
      savedFallbackBody={t(activityDetailMessages.savedFallbackBody)}
      savedFallbackTitle={t(activityDetailMessages.savedFallbackTitle)}
      topInset={topInset}
    />
  );
}

function ActivityNotFound() {
  const { t } = useLingui();

  useEffect(() => {
    announceStatus(t(activityDetailMessages.notFoundAnnounce));
  }, [t]);

  return (
    <View style={styles.notFound} testID="activity-detail-not-found">
      <EmptyState
        actionLabel={t(activityDetailMessages.unavailableAction)}
        body={t(activityDetailMessages.unavailableBody)}
        illustration={emptySearchIllustration}
        onAction={router.back}
        presentation="centered"
        title={t(activityDetailMessages.unavailableTitle)}
      />
    </View>
  );
}

type ActivityDetailLoadedProps = {
  activity: Activity;
  bottomInset: number;
  hasSavedFallback: boolean;
  savedFallbackBody: string;
  savedFallbackTitle: string;
  topInset: number;
};

function ActivityDetailLoaded({
  activity,
  bottomInset,
  hasSavedFallback,
  savedFallbackBody,
  savedFallbackTitle,
  topInset,
}: ActivityDetailLoadedProps) {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const heroHeight = Math.min(
    width / ACTIVITY_DETAIL_HERO_ASPECT_RATIO,
    ACTIVITY_DETAIL_HERO_MAX_HEIGHT,
  );
  const cover = getActivityCoverImage(activity);
  const duration = formatDuration(activity.durationMinutes);

  useEffect(() => {
    announceStatus(
      i18n._({ ...activityDetailMessages.loadedAnnounce, values: { title: activity.title } }),
    );
  }, [activity.title, i18n]);

  useEffect(() => {
    const presentation = resolveFeedbackPresentation({
      kind: "error",
      recovery: "transient",
    });
    if (hasSavedFallback && presentation === "toast") {
      showNativeToast({
        message: savedFallbackBody,
        title: savedFallbackTitle,
        type: "error",
      });
    }
  }, [hasSavedFallback, savedFallbackBody, savedFallbackTitle]);

  return (
    <View style={styles.loadedRoot}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomInset + ACTIVITY_DETAIL_BOTTOM_CHROME_CLEARANCE },
        ]}
        contentInsetAdjustmentBehavior="never"
        testID="activity-detail-content"
      >
        <Link.AppleZoomTarget>
          <View collapsable={false} style={[styles.hero, { height: heroHeight }]}>
            <Image
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              contentFit="cover"
              placeholder={{ blurhash: cover.blurhash }}
              placeholderContentFit="cover"
              source={{ uri: cover.uri }}
              style={styles.heroImage}
              testID="activity-detail-hero"
            />
            <HeroImageBlend uri={cover.uri} />
          </View>
        </Link.AppleZoomTarget>
        <View style={styles.copy}>
          <ActivityCategoryBadge
            category={activity.category}
            label={t(categoryMessages[activity.category])}
          />
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
            {activity.title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {activity.description}
          </Text>
          <View style={[styles.metadata, { borderColor: theme.colors.border }]}>
            <DetailValue label={t(activityDetailMessages.location)} value={activity.location} />
            <DetailValue label={t(activityDetailMessages.duration)} value={duration} />
          </View>
          <AddToCalendarSection activity={activity} />
        </View>
      </ScrollView>
      <ActivityDetailControls
        activity={activity}
        backLabel={t(activityDetailMessages.back)}
        safeAreaTop={topInset}
        showBack={false}
      />
    </View>
  );
}

type DetailValueProps = {
  label: string;
  value: string;
};

function DetailValue({ label, value }: DetailValueProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.detailValue}>
      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailText, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space16,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.space32,
    textAlign: "left",
  },
  detailLabel: {
    ...typography.caption,
    marginBottom: spacing.space4,
    textAlign: "left",
  },
  detailText: {
    ...typography.bodyStrong,
    textAlign: "left",
  },
  detailValue: {
    flex: 1,
    minWidth: 120,
  },
  hero: {
    overflow: "hidden",
    width: "100%",
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  loadedRoot: {
    flex: 1,
  },
  metadata: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.space24,
    paddingVertical: spacing.space20,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.space24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.space16,
    textAlign: "left",
  },
});
