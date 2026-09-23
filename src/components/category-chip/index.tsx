import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image, type ImageSource } from "expo-image";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type CategoryChipProps = {
  icon: ImageSource;
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

const SELECTED_TINT_OPACITY = 0.14;

function useGlassChrome(): boolean {
  if (process.env.EXPO_OS !== "ios") {
    return false;
  }
  return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
}

/**
 * Category filter control.
 * Keeps `A11yPressable` for labels, roles, selected state, and keyboard focus.
 * On iOS with Liquid Glass, all states keep glass chrome.
 */
export function CategoryChip({ icon, label, selected, onPress, testID }: CategoryChipProps) {
  const theme = useAppTheme();
  const glass = useGlassChrome();
  const iosFallback = process.env.EXPO_OS === "ios" && !glass;
  const color = selected ? theme.colors.accent : theme.colors.text;

  return (
    <A11yPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: glass || iosFallback ? "transparent" : theme.colors.surfaceElevated,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID={testID}
    >
      {glass ? <GlassView glassEffectStyle="regular" style={StyleSheet.absoluteFill} /> : null}
      {iosFallback ? (
        <BlurView tint="systemUltraThinMaterial" intensity={32} style={StyleSheet.absoluteFill} />
      ) : null}
      {selected ? (
        <View
          pointerEvents="none"
          style={[styles.selectedTint, { backgroundColor: theme.colors.accent }]}
        />
      ) : null}
      <Image
        accessible={false}
        accessibilityElementsHidden
        contentFit="contain"
        source={icon}
        style={styles.icon}
      />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "center",
    marginEnd: spacing.space8,
    minHeight: MIN_TOUCH_TARGET,
    overflow: "hidden",
    paddingHorizontal: spacing.space12,
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
  selectedTint: {
    bottom: 0,
    left: 0,
    opacity: SELECTED_TINT_OPACITY,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
