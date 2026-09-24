import { StyleSheet, Text } from "react-native";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { spacing, typography, useAppTheme } from "@/theme";

type DevToolsActionRowProps = {
  label: string;
  hint: string;
  onPress: () => void;
  destructive?: boolean;
  testID?: string;
};

/** Full-width settings action row with accessible press behavior. */
export function DevToolsActionRow({
  label,
  hint,
  onPress,
  destructive = false,
  testID,
}: DevToolsActionRowProps) {
  const theme = useAppTheme();

  return (
    <A11yPressable
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={(state) => [
        styles.row,
        {
          backgroundColor: state.pressed ? theme.colors.surfaceSecondary : theme.colors.surface,
        },
      ]}
      testID={testID}
    >
      <Text
        style={[styles.label, { color: destructive ? theme.colors.danger : theme.colors.accent }]}
      >
        {label}
      </Text>
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.body,
    textAlign: "left",
  },
  row: {
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
});
