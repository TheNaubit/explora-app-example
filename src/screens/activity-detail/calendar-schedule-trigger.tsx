import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type CalendarScheduleTriggerProps = {
  accessibilityHint: string;
  accessibilityLabel: string;
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  value: string;
};

/** Accessible trigger for the native date and time controls. */
export function CalendarScheduleTrigger({
  accessibilityHint,
  accessibilityLabel,
  disabled = false,
  label,
  onPress,
  value,
}: CalendarScheduleTriggerProps) {
  const theme = useAppTheme();

  return (
    <A11yPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={(state) => [
        styles.root,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.64 : 1,
          transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID="calendar-schedule-trigger"
    >
      <SymbolView
        name={{ ios: "calendar.badge.plus", android: "event", web: "event" }}
        size={24}
        tintColor={theme.colors.accent}
      />
      <View style={styles.copy}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      </View>
      <SymbolView
        name={{ ios: "chevron.forward", android: "chevron_right", web: "chevron_right" }}
        size={18}
        tintColor={theme.colors.textSecondary}
      />
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: spacing.space4,
  },
  label: {
    ...typography.caption,
    textAlign: "left",
  },
  root: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.space12,
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  value: {
    ...typography.bodyStrong,
    textAlign: "left",
  },
});
