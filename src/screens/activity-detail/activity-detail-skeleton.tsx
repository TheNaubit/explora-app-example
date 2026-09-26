import { useEffect } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { announceStatus } from "@/a11y";
import {
  SKELETON_OPACITY_MAX,
  SKELETON_OPACITY_MIN,
  SKELETON_PULSE_MS,
} from "@/components/constants";
import {
  ACTIVITY_DETAIL_HERO_ASPECT_RATIO,
  ACTIVITY_DETAIL_HERO_MAX_HEIGHT,
} from "@/screens/activity-detail/constants";
import { radii, spacing, useAppTheme } from "@/theme";

type ActivityDetailSkeletonProps = {
  loadingAnnouncement: string;
};

/** Activity Detail loading state that matches the final hero and copy layout. */
export function ActivityDetailSkeleton({ loadingAnnouncement }: ActivityDetailSkeletonProps) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(SKELETON_OPACITY_MAX);
  const heroHeight = Math.min(
    width / ACTIVITY_DETAIL_HERO_ASPECT_RATIO,
    ACTIVITY_DETAIL_HERO_MAX_HEIGHT,
  );

  useEffect(() => {
    announceStatus(loadingAnnouncement);

    if (reducedMotion) {
      opacity.set(SKELETON_OPACITY_MAX);
      return;
    }

    opacity.set(
      withRepeat(
        withTiming(SKELETON_OPACITY_MIN, {
          duration: SKELETON_PULSE_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [loadingAnnouncement, opacity, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <ScrollView
      accessibilityLabel={loadingAnnouncement}
      accessibilityRole="progressbar"
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="never"
      testID="activity-detail-skeleton"
    >
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={animatedStyle}
      >
        <View
          style={[styles.hero, { height: heroHeight, backgroundColor: theme.colors.skeleton }]}
        />
        <View style={styles.copy}>
          <View style={[styles.category, { backgroundColor: theme.colors.skeleton }]} />
          <View style={[styles.title, { backgroundColor: theme.colors.skeleton }]} />
          <View style={[styles.body, { backgroundColor: theme.colors.skeleton }]} />
          <View style={[styles.bodyShort, { backgroundColor: theme.colors.skeleton }]} />
          <View style={[styles.meta, { backgroundColor: theme.colors.skeleton }]} />
          <View style={[styles.action, { backgroundColor: theme.colors.skeleton }]} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  action: {
    borderRadius: radii.medium,
    height: spacing.space48,
    marginTop: spacing.space32,
    width: "100%",
  },
  body: {
    borderRadius: radii.small,
    height: spacing.space16,
    marginTop: spacing.space24,
    width: "100%",
  },
  bodyShort: {
    borderRadius: radii.small,
    height: spacing.space16,
    marginTop: spacing.space8,
    width: "72%",
  },
  category: {
    borderRadius: radii.small,
    height: spacing.space12,
    width: "28%",
  },
  content: {
    paddingBottom: spacing.space48,
  },
  copy: {
    padding: spacing.space24,
  },
  hero: {
    width: "100%",
  },
  meta: {
    borderRadius: radii.small,
    height: spacing.space40,
    marginTop: spacing.space32,
    width: "100%",
  },
  title: {
    borderRadius: radii.small,
    height: spacing.space32,
    marginTop: spacing.space12,
    width: "84%",
  },
});
