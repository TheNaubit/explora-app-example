import { StyleSheet, Text } from "react-native";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type CategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * Single category filter chip for the Explore selector row.
 */
export function CategoryChip({ label, selected, onPress, testID }: CategoryChipProps) {
  const theme = useAppTheme();
  const backgroundColor = selected ? theme.colors.accent : theme.colors.surfaceSecondary;
  const color = selected ? theme.colors.onAccent : theme.colors.text;

  return (
    <A11yPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID={testID}
    >
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
    paddingHorizontal: spacing.space16,
  },
  label: {
    ...typography.label,
    textAlign: "left",
  },
});
