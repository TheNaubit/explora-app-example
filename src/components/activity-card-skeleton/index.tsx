import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

import {
  ACTIVITY_CARD_MEDIA_HEIGHT,
  MIN_TOUCH_TARGET,
  SKELETON_OPACITY_MAX,
  SKELETON_OPACITY_MIN,
  SKELETON_PULSE_MS,
} from "@/components/constants";
import { radii, spacing, useAppTheme } from "@/theme";

type ActivityCardSkeletonProps = {
  bodyHeight?: number;
  mediaHeight?: number;
  testID?: string;
  variant?: "list" | "carousel";
};

/**
 * Card-shaped loading placeholder for the Explore list.
 * Pulses opacity unless the user prefers reduced motion.
 */
export function ActivityCardSkeleton({
  bodyHeight,
  mediaHeight,
  testID,
  variant = "list",
}: ActivityCardSkeletonProps) {
  const theme = useAppTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(SKELETON_OPACITY_MAX);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = SKELETON_OPACITY_MAX;
      return;
    }

    opacity.value = withRepeat(
      withTiming(SKELETON_OPACITY_MIN, {
        duration: SKELETON_PULSE_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const blockColor = theme.colors.skeleton;
  const foregroundColor = theme.colors.surfaceElevated;
  const resolvedMediaHeight = mediaHeight ?? ACTIVITY_CARD_MEDIA_HEIGHT;
  const resolvedTestID = testID ?? "activity-card-skeleton";

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.card,
        variant === "carousel" ? styles.carouselCard : null,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: theme.elevation.raised,
        },
        animatedStyle,
      ]}
      testID={resolvedTestID}
    >
      <View
        style={[styles.cover, { backgroundColor: blockColor }]}
        testID={`${resolvedTestID}-cover`}
      />
      <View style={[styles.media, { height: resolvedMediaHeight }]}>
        <View
          style={[styles.favorite, { backgroundColor: foregroundColor }]}
          testID={`${resolvedTestID}-favorite`}
        />
      </View>
      <View
        style={[styles.lines, bodyHeight === undefined ? null : { minHeight: bodyHeight }]}
        testID={`${resolvedTestID}-copy`}
      >
        <View style={[styles.lineWide, { backgroundColor: foregroundColor }]} />
        <View style={styles.metaRow}>
          <View style={[styles.lineShort, { backgroundColor: foregroundColor }]} />
          <View style={[styles.lineMid, { backgroundColor: foregroundColor }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderCurve: "continuous",
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.space12,
    overflow: "hidden",
  },
  carouselCard: {
    marginBottom: spacing.space4,
  },
  cover: {
    ...StyleSheet.absoluteFill,
  },
  favorite: {
    borderRadius: radii.full,
    height: MIN_TOUCH_TARGET,
    position: "absolute",
    right: spacing.space8,
    top: spacing.space8,
    width: MIN_TOUCH_TARGET,
  },
  lineMid: {
    borderRadius: radii.small,
    height: spacing.space12,
    width: "52%",
  },
  lineShort: {
    borderRadius: radii.small,
    height: spacing.space12,
    width: "45%",
  },
  lineWide: {
    borderRadius: radii.small,
    height: spacing.space16,
    marginBottom: spacing.space8,
    width: "88%",
  },
  lines: {
    padding: spacing.space16,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.space8,
  },
  media: {
    overflow: "hidden",
    width: "100%",
  },
});
