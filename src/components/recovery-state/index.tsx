import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { A11y, announceStatus } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type RecoveryStateProps = {
  actionLabel: string;
  actionTestID?: string;
  body: string;
  onAction: () => void;
  testID?: string;
  title: string;
};

/** Show one important failure with one direct recovery action. */
export function RecoveryState({
  actionLabel,
  actionTestID,
  body,
  onAction,
  testID,
  title,
}: RecoveryStateProps) {
  const theme = useAppTheme();

  useEffect(() => {
    announceStatus(body);
  }, [body]);

  return (
    <A11y.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      focusable={false}
      style={styles.content}
      testID={testID ?? "recovery-state"}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.icon, { backgroundColor: theme.colors.dangerSurface }]}
      >
        <SymbolView
          name={{ ios: "exclamationmark", android: "priority_high", web: "priority_high" }}
          size={24}
          tintColor={theme.colors.danger}
        />
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      </View>
      <A11yPressable
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
        onPress={onAction}
        style={(state) => [
          styles.action,
          {
            backgroundColor: state.pressed ? theme.colors.accentPressed : theme.colors.accent,
            transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
          },
        ]}
        testID={actionTestID ?? "recovery-state-action"}
      >
        <SymbolView
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
          size={spacing.space16}
          tintColor={theme.colors.onAccent}
        />
        <Text style={[styles.actionLabel, { color: theme.colors.onAccent }]}>{actionLabel}</Text>
      </A11yPressable>
    </A11y.View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.full,
    flexDirection: "row",
    gap: spacing.space8,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space20,
    paddingVertical: spacing.space12,
  },
  actionLabel: {
    ...typography.label,
    textAlign: "center",
  },
  body: {
    ...typography.body,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
    alignSelf: "center",
    gap: spacing.space24,
    maxWidth: 336,
    width: "100%",
  },
  copy: {
    alignItems: "center",
    gap: spacing.space8,
  },
  icon: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.full,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  title: {
    ...typography.headline,
    textAlign: "center",
  },
});
