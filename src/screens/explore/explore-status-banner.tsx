import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLingui } from "@lingui/react/macro";
import Animated from "react-native-reanimated";

import { A11y } from "@/a11y";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { getRecoverySymbol } from "@/components/recovery-state/recovery-symbol";
import { useStateEntrance } from "@/hooks/use-state-entrance";
import { resolveErrorMessage } from "@/i18n";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";
import { radii, spacing, typography, useAppTheme } from "@/theme";

/** Visual size of the cause symbol. */
const CAUSE_SYMBOL_SIZE = 18;

/** Visual size of the retry symbol inside the pill. */
const RETRY_SYMBOL_SIZE = 15;

/** Tonal circle behind the cause symbol. */
const CAUSE_FRAME_SIZE = 32;

type ExploreStatusBannerProps = {
  banner: NonNullable<ExploreBannerState>;
  onDismiss: () => void;
  onRetryNextPage: () => void;
};

/**
 * Quiet end-of-list recovery for a next-page error.
 * The loaded activities stay usable, so the footer does not use an alarm color.
 * It is compact, so it fits fully between the last card and the tab bar.
 * It names the cause and gives one retry action.
 */
export function ExploreStatusBanner({
  banner,
  onDismiss,
  onRetryNextPage,
}: ExploreStatusBannerProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const entranceStyle = useStateEntrance();
  const retryLabel = t(exploreMessages.bannerRetry);

  return (
    <Animated.View style={entranceStyle}>
      <A11y.View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        focusable={false}
        style={styles.root}
        testID="explore-next-page-error"
      >
        <View style={styles.headerRow}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.causeFrame, { backgroundColor: theme.colors.surfaceSecondary }]}
          >
            <SymbolView
              name={getRecoverySymbol(banner.errorKey)}
              size={CAUSE_SYMBOL_SIZE}
              tintColor={theme.colors.textSecondary}
            />
          </View>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
            {t(exploreMessages.nextPageFailedTitle)}
          </Text>
          <A11yPressable
            accessibilityLabel={retryLabel}
            accessibilityRole="button"
            onPress={() => {
              onDismiss();
              onRetryNextPage();
            }}
            style={(state) => [
              styles.retry,
              {
                backgroundColor: state.pressed
                  ? theme.colors.skeleton
                  : theme.colors.surfaceSecondary,
                transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }],
              },
            ]}
            testID="explore-next-page-retry"
          >
            <SymbolView
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
              size={RETRY_SYMBOL_SIZE}
              tintColor={theme.colors.accent}
            />
            <Text style={[styles.retryLabel, { color: theme.colors.accent }]}>{retryLabel}</Text>
          </A11yPressable>
        </View>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {t(resolveErrorMessage(banner.errorKey))}
        </Text>
      </A11y.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.caption,
    marginStart: CAUSE_FRAME_SIZE + spacing.space12,
    textAlign: "left",
  },
  causeFrame: {
    alignItems: "center",
    borderRadius: radii.full,
    height: CAUSE_FRAME_SIZE,
    justifyContent: "center",
    width: CAUSE_FRAME_SIZE,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.space12,
  },
  retry: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: radii.full,
    flexDirection: "row",
    gap: spacing.space8,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.space16,
  },
  retryLabel: {
    ...typography.label,
    textAlign: "center",
  },
  root: {
    gap: spacing.space4,
    paddingVertical: spacing.space16,
  },
  title: {
    ...typography.bodyStrong,
    flex: 1,
    textAlign: "left",
  },
});
