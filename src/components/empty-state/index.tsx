import { StyleSheet, Text, View } from "react-native";
import { Image, type ImageSource } from "expo-image";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
  /** Decorative claymorphic illustration. Hidden from the screen reader. */
  illustration?: ImageSource;
  testID?: string;
};

/**
 * Designed empty result. Show after a query succeeds with zero items.
 * Always include one recovery action.
 */
export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  illustration,
  testID,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.root} testID={testID ?? "empty-state"}>
      {illustration ? (
        <Image
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          source={illustration}
          style={styles.illustration}
          contentFit="contain"
          testID="empty-state-illustration"
        />
      ) : null}
      <Text style={[styles.title, { color: theme.colors.text }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      <A11yPressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        style={[styles.action, { backgroundColor: theme.colors.accent }]}
        testID="empty-state-action"
      >
        <Text style={[styles.actionLabel, { color: theme.colors.onAccent }]}>{actionLabel}</Text>
      </A11yPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.medium,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space12,
  },
  actionLabel: {
    ...typography.label,
    textAlign: "left",
  },
  body: {
    ...typography.body,
    marginBottom: spacing.space16,
    textAlign: "left",
  },
  illustration: {
    alignSelf: "center",
    height: 140,
    marginBottom: spacing.space16,
    width: 140,
  },
  root: {
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space32,
  },
  title: {
    ...typography.headline,
    marginBottom: spacing.space8,
    textAlign: "left",
  },
});
