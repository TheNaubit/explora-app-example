import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";

import { A11y } from "@/a11y";
import { getCategoryChipIllustration } from "@/illustrations";
import type { ActivityCategory } from "@/schemas/activity";
import { radii, spacing, typography, useAppTheme } from "@/theme";

const CATEGORY_TINT_OPACITY = 0.14;

type ActivityCategoryBadgeProps = {
  category: ActivityCategory;
  label: string;
};

function useGlassChrome(): boolean {
  if (process.env.EXPO_OS !== "ios") {
    return false;
  }

  return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
}

/** Show the activity category with the same image and material as discovery filter chips. */
export function ActivityCategoryBadge({ category, label }: ActivityCategoryBadgeProps) {
  const theme = useAppTheme();
  const glass = useGlassChrome();
  const iosFallback = process.env.EXPO_OS === "ios" && !glass;

  return (
    <A11y.View
      accessibilityLabel={label}
      accessibilityRole="text"
      accessible
      focusable={false}
      style={[
        styles.badge,
        {
          backgroundColor: glass || iosFallback ? "transparent" : theme.colors.surfaceElevated,
          borderColor: theme.colors.accent,
        },
      ]}
      testID="activity-detail-category"
    >
      {glass ? <GlassView glassEffectStyle="regular" style={StyleSheet.absoluteFill} /> : null}
      {iosFallback ? (
        <BlurView tint="systemUltraThinMaterial" intensity={32} style={StyleSheet.absoluteFill} />
      ) : null}
      <View pointerEvents="none" style={[styles.tint, { backgroundColor: theme.colors.accent }]} />
      <Image
        accessible={false}
        accessibilityElementsHidden
        contentFit="contain"
        source={getCategoryChipIllustration(category)}
        style={styles.icon}
        testID="activity-detail-category-icon"
      />
      <Text accessible={false} style={[styles.label, { color: theme.colors.accent }]}>
        {label}
      </Text>
    </A11y.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginBottom: spacing.space12,
    minHeight: 36,
    overflow: "hidden",
    paddingHorizontal: spacing.space12,
    paddingVertical: spacing.space4,
  },
  icon: {
    height: 24,
    marginEnd: spacing.space4,
    width: 24,
  },
  label: {
    ...typography.label,
    textAlign: "left",
  },
  tint: {
    bottom: 0,
    left: 0,
    opacity: CATEGORY_TINT_OPACITY,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
