import { StyleSheet, Text, View } from "react-native";

import { MIN_TOUCH_TARGET } from "@/components/constants";
import { spacing, typography, useAppTheme } from "@/theme";

type DevToolsValueRowProps = {
  label: string;
  value: string;
  accessibilityLabel: string;
  testID?: string;
};

/** Static label and value row for local assessment data. */
export function DevToolsValueRow({
  label,
  value,
  accessibilityLabel,
  testID,
}: DevToolsValueRowProps) {
  const theme = useAppTheme();

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={styles.row} testID={testID}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.body,
    flex: 1,
    textAlign: "left",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  value: {
    ...typography.body,
    marginStart: spacing.space16,
    textAlign: "right",
  },
});
