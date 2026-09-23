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
  SKELETON_OPACITY_MAX,
  SKELETON_OPACITY_MIN,
  SKELETON_PULSE_MS,
} from "@/components/constants";
import { radii, spacing, useAppTheme } from "@/theme";

type ActivityCardSkeletonProps = {
  testID?: string;
};

/**
 * Card-shaped loading placeholder for the Explore list.
 * Pulses opacity unless the user prefers reduced motion.
 */
export function ActivityCardSkeleton({ testID }: ActivityCardSkeletonProps) {
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

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: theme.elevation.raised,
        },
        animatedStyle,
      ]}
      testID={testID}
    >
      <View style={[styles.media, { backgroundColor: blockColor }]} />
      <View style={styles.lines}>
        <View style={[styles.lineWide, { backgroundColor: blockColor }]} />
        <View style={styles.metaRow}>
          <View style={[styles.lineShort, { backgroundColor: blockColor }]} />
          <View style={[styles.lineMid, { backgroundColor: blockColor }]} />
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
    height: ACTIVITY_CARD_MEDIA_HEIGHT,
    width: "100%",
  },
});
