import { StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type CategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

function useGlassChrome(): boolean {
  if (process.env.EXPO_OS !== "ios") {
    return false;
  }
  return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
}

/**
 * Category filter control.
 * Keeps `A11yPressable` for labels, roles, selected state, and keyboard focus.
 * On iOS with Liquid Glass, unselected chips use glass chrome. Selected stays solid accent.
 */
export function CategoryChip({ label, selected, onPress, testID }: CategoryChipProps) {
  const theme = useAppTheme();
  const glass = useGlassChrome();
  const color = selected ? theme.colors.onAccent : theme.colors.text;
  const backgroundColor = selected ? theme.colors.accent : theme.colors.surfaceElevated;

  return (
    <A11yPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: glass && !selected ? "transparent" : backgroundColor,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID={testID}
    >
      {glass && !selected ? (
        <GlassView glassEffectStyle="regular" style={StyleSheet.absoluteFill} />
      ) : null}
      {!glass && !selected && process.env.EXPO_OS === "ios" ? (
        <BlurView tint="systemChromeMaterial" intensity={80} style={StyleSheet.absoluteFill} />
      ) : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    marginEnd: spacing.space8,
    minHeight: MIN_TOUCH_TARGET,
    overflow: "hidden",
    paddingHorizontal: spacing.space16,
  },
  label: {
    ...typography.label,
    textAlign: "left",
  },
});
