import { StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { MIN_TOUCH_TARGET } from "@/components/constants";
import { spacing, typography, useAppTheme } from "@/theme";

/**
 * Largest text scale for the compact title. Native navigation titles also cap their size.
 * The full title stays in the content at the full Dynamic Type size.
 */
const COMPACT_TITLE_MAX_FONT_SCALE = 1.35;

type DetailCompactBarProps = {
  fadeEnd: number;
  fadeStart: number;
  height: number;
  safeAreaTop: number;
  scrollY: SharedValue<number>;
  title: string;
};

/**
 * Solid bar that fades in when the hero leaves the screen.
 * It keeps the activity title visible and gives the hero controls a calm surface.
 * The screen reader already reads the full title in the content, so this copy is hidden.
 */
export function DetailCompactBar({
  fadeEnd,
  fadeStart,
  height,
  safeAreaTop,
  scrollY,
  title,
}: DetailCompactBarProps) {
  const theme = useAppTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.get(), [fadeStart, fadeEnd], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          height,
          paddingTop: safeAreaTop,
        },
        animatedStyle,
      ]}
      testID="activity-detail-compact-bar"
    >
      <Text
        maxFontSizeMultiplier={COMPACT_TITLE_MAX_FONT_SCALE}
        numberOfLines={1}
        style={[styles.title, { color: theme.colors.text }]}
      >
        {title}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    left: 0,
    paddingHorizontal: spacing.space16 + MIN_TOUCH_TARGET + spacing.space12,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  title: {
    ...typography.bodyStrong,
    textAlign: "center",
  },
});
