import { StyleSheet, Text, View } from "react-native";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type CalendarStatusBannerProps = {
  actionLabel?: string;
  body: string;
  isError: boolean;
  onAction?: () => void;
  title: string;
};

/** Calendar result message with an optional recovery action. */
export function CalendarStatusBanner({
  actionLabel,
  body,
  isError,
  onAction,
  title,
}: CalendarStatusBannerProps) {
  const theme = useAppTheme();
  const backgroundColor = isError ? theme.colors.dangerSurface : theme.colors.surfaceSecondary;
  const emphasisColor = isError ? theme.colors.danger : theme.colors.success;

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.root, { backgroundColor }]}
      testID="calendar-status-banner"
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: emphasisColor }]}>{title}</Text>
        <Text style={[styles.body, { color: theme.colors.text }]}>{body}</Text>
      </View>
      {actionLabel && onAction ? (
        <A11yPressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          onPress={onAction}
          style={[styles.action, { borderColor: emphasisColor }]}
          testID="calendar-status-action"
        >
          <Text style={[styles.actionLabel, { color: emphasisColor }]}>{actionLabel}</Text>
        </A11yPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.small,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space12,
  },
  actionLabel: {
    ...typography.label,
    textAlign: "center",
  },
  body: {
    ...typography.caption,
    textAlign: "left",
  },
  copy: {
    flex: 1,
    gap: spacing.space4,
  },
  root: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.medium,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.space12,
    padding: spacing.space12,
  },
  title: {
    ...typography.label,
    textAlign: "left",
  },
});
