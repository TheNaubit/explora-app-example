import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import Animated from "react-native-reanimated";

import { A11y } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { getRecoverySymbol } from "@/components/recovery-state/recovery-symbol";
import { useStateEntrance } from "@/hooks/use-state-entrance";
import type { ErrorKey } from "@/i18n/error-keys";
import { radii, spacing, typography, useAppTheme } from "@/theme";

/** Visual size of the banner symbol. */
const BANNER_SYMBOL_SIZE = 20;

/** Symbol for a failure without a known cause, for example a calendar error. */
const DEFAULT_BANNER_SYMBOL = {
  android: "error",
  ios: "exclamationmark.triangle.fill",
  web: "error",
} as const;

type InlineStatusBannerProps = {
  title: string;
  body: string;
  actionLabel?: string;
  actionTestID?: string;
  /** Failure cause. It selects the symbol that names the problem. */
  errorKey?: ErrorKey;
  inset?: boolean;
  onAction?: () => void;
  testID?: string;
};

/**
 * Show an actionable failure without replacing available content.
 */
export function InlineStatusBanner({
  title,
  body,
  actionLabel,
  actionTestID,
  errorKey,
  inset = true,
  onAction,
  testID,
}: InlineStatusBannerProps) {
  const theme = useAppTheme();
  const entranceStyle = useStateEntrance();
  const symbol = errorKey === undefined ? DEFAULT_BANNER_SYMBOL : getRecoverySymbol(errorKey);

  return (
    <Animated.View style={entranceStyle}>
      <A11y.View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        focusable={false}
        style={[
          styles.root,
          inset ? styles.inset : null,
          {
            backgroundColor: theme.colors.dangerSurface,
            boxShadow: theme.elevation.none,
          },
        ]}
        testID={testID ?? "inline-status-banner"}
      >
        <View style={styles.header}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.icon, { backgroundColor: theme.colors.surface }]}
          >
            <SymbolView name={symbol} size={BANNER_SYMBOL_SIZE} tintColor={theme.colors.danger} />
          </View>
          <View style={styles.copy}>
            <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
            {actionLabel && onAction ? (
              <A11yPressable
                accessibilityRole="button"
                accessibilityLabel={actionLabel}
                onPress={onAction}
                style={({ pressed }) => [styles.retry, { opacity: pressed ? 0.62 : 1 }]}
                testID={actionTestID ?? "inline-status-retry"}
              >
                <SymbolView
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
                  size={spacing.space16}
                  tintColor={theme.colors.accent}
                />
                <Text style={[styles.retryLabel, { color: theme.colors.accent }]}>
                  {actionLabel}
                </Text>
              </A11yPressable>
            ) : null}
          </View>
        </View>
      </A11y.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.caption,
    textAlign: "left",
  },
  copy: {
    flex: 1,
    gap: spacing.space4,
    minWidth: 0,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.space12,
  },
  icon: {
    alignItems: "center",
    borderRadius: radii.full,
    height: spacing.space32,
    justifyContent: "center",
    width: spacing.space32,
  },
  retry: {
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.space8,
    justifyContent: "flex-start",
    minHeight: MIN_TOUCH_TARGET,
    paddingEnd: spacing.space12,
  },
  retryLabel: {
    ...typography.label,
    textAlign: "left",
  },
  root: {
    alignItems: "stretch",
    borderCurve: "continuous",
    borderRadius: radii.medium,
    marginBottom: spacing.space12,
    padding: spacing.space16,
  },
  inset: {
    marginHorizontal: spacing.space24,
  },
  title: {
    ...typography.bodyStrong,
    textAlign: "left",
  },
});
