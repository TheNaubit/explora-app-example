import { StyleSheet, Text, View } from "react-native";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type InlineStatusBannerProps = {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
  testID?: string;
};

/**
 * Non-blocking status banner for refresh or next-page failures.
 * Keep stale content visible below the banner.
 */
export function InlineStatusBanner({
  title,
  body,
  actionLabel,
  onAction,
  testID,
}: InlineStatusBannerProps) {
  const theme = useAppTheme();

  return (
    <View
      accessibilityRole="alert"
      style={[styles.root, { backgroundColor: theme.colors.dangerSurface }]}
      testID={testID ?? "inline-status-banner"}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.colors.danger }]}>{title}</Text>
        <Text style={[styles.body, { color: theme.colors.text }]}>{body}</Text>
      </View>
      <A11yPressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        style={[styles.retry, { borderColor: theme.colors.danger }]}
        testID="inline-status-retry"
      >
        <Text style={[styles.retryLabel, { color: theme.colors.danger }]}>{actionLabel}</Text>
      </A11yPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.caption,
    textAlign: "left",
  },
  copy: {
    flex: 1,
    marginEnd: spacing.space12,
  },
  retry: {
    alignItems: "center",
    borderRadius: radii.small,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space12,
  },
  retryLabel: {
    ...typography.label,
    textAlign: "left",
  },
  root: {
    alignItems: "center",
    borderRadius: radii.small,
    flexDirection: "row",
    marginBottom: spacing.space12,
    marginHorizontal: spacing.space24,
    padding: spacing.space12,
  },
  title: {
    ...typography.label,
    marginBottom: spacing.space4,
    textAlign: "left",
  },
});
