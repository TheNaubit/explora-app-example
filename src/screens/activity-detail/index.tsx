import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useLingui } from "@lingui/react/macro";
import Animated from "react-native-reanimated";
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
import { type ActivityFact, ActivityFactList } from "@/screens/activity-detail/activity-fact-list";
import { AddToCalendarSection } from "@/screens/activity-detail/add-to-calendar-section";
import { DetailCompactBar } from "@/screens/activity-detail/detail-compact-bar";
import { HeroImageBlend } from "@/screens/activity-detail/hero-image-blend";
import {
  ACTIVITY_DETAIL_BOTTOM_CHROME_CLEARANCE,
  ACTIVITY_DETAIL_HERO_ASPECT_RATIO,
  ACTIVITY_DETAIL_HERO_MAX_HEIGHT,
  ACTIVITY_DETAIL_SCROLL_EVENT_THROTTLE_MS,
} from "@/screens/activity-detail/constants";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import { useDetailScrollMotion } from "@/screens/activity-detail/use-detail-scroll-motion";
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
        errorKey={errorKey}
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
  const motion = useDetailScrollMotion({ heroHeight, safeAreaTop: topInset });
  const facts = buildActivityFacts({
    duration,
    durationLabel: t(activityDetailMessages.duration),
    location: activity.location,
    locationLabel: t(activityDetailMessages.location),
    speak: (label, value) =>
      i18n._({ ...activityDetailMessages.factAccessibilityLabel, values: { label, value } }),
  });

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
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomInset + ACTIVITY_DETAIL_BOTTOM_CHROME_CLEARANCE },
        ]}
        contentInsetAdjustmentBehavior="never"
        onScroll={motion.onScroll}
        scrollEventThrottle={ACTIVITY_DETAIL_SCROLL_EVENT_THROTTLE_MS}
        testID="activity-detail-content"
      >
        <Link.AppleZoomTarget>
          <View collapsable={false} style={[styles.hero, { height: heroHeight }]}>
            <Animated.View style={[styles.heroMotion, motion.heroStyle]}>
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
            </Animated.View>
          </View>
        </Link.AppleZoomTarget>
        <View style={styles.copy}>
          <ActivityCategoryBadge
            category={activity.category}
            label={t(categoryMessages[activity.category])}
          />
          <Text
            accessibilityRole="header"
            selectable
            style={[styles.title, { color: theme.colors.text }]}
          >
            {activity.title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {activity.description}
          </Text>
          <ActivityFactList facts={facts} />
          <AddToCalendarSection activity={activity} />
        </View>
      </Animated.ScrollView>
      <DetailCompactBar
        fadeEnd={motion.compactBarFadeEnd}
        fadeStart={motion.compactBarFadeStart}
        height={motion.compactBarHeight}
        safeAreaTop={topInset}
        scrollY={motion.scrollY}
        title={activity.title}
      />
      <ActivityDetailControls
        activity={activity}
        backLabel={t(activityDetailMessages.back)}
        safeAreaTop={topInset}
        showBack={false}
      />
    </View>
  );
}

type BuildActivityFactsOptions = {
  duration: string;
  durationLabel: string;
  location: string;
  locationLabel: string;
  speak: (label: string, value: string) => string;
};

function buildActivityFacts({
  duration,
  durationLabel,
  location,
  locationLabel,
  speak,
}: BuildActivityFactsOptions): ActivityFact[] {
  return [
    {
      accessibilityLabel: speak(locationLabel, location),
      id: "location",
      label: locationLabel,
      symbol: { android: "location_on", ios: "mappin.and.ellipse", web: "location_on" },
      value: location,
    },
    {
      accessibilityLabel: speak(durationLabel, duration),
      id: "duration",
      label: durationLabel,
      symbol: { android: "schedule", ios: "clock", web: "schedule" },
      value: duration,
    },
  ];
}

const styles = StyleSheet.create({
  copy: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space16,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.space24,
    textAlign: "left",
  },
  hero: {
    width: "100%",
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  heroMotion: {
    ...StyleSheet.absoluteFill,
  },
  loadedRoot: {
    flex: 1,
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
