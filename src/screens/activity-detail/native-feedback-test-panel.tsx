import { StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, PRESS_SCALE } from "@/components/constants";
import { isNativeToastAvailable, showNativeToast, type NativeToastType } from "@/native-toast";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type TestButtonProps = {
  label: string;
  message: string;
  type: NativeToastType;
};

const TEST_TOAST_DURATION_MS = 6000;

/** Development-only controls for direct native toast and haptic checks. */
export function NativeFeedbackTestPanel() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const available = isNativeToastAvailable();

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      testID="native-feedback-test-panel"
    >
      <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>
        {t(activityDetailMessages.nativeFeedbackTestTitle)}
      </Text>
      <Text
        style={[styles.status, { color: available ? theme.colors.success : theme.colors.danger }]}
        testID="native-feedback-module-status"
      >
        {t(
          available
            ? activityDetailMessages.nativeFeedbackAvailable
            : activityDetailMessages.nativeFeedbackUnavailable,
        )}
      </Text>
      <View style={styles.actions}>
        <TestButton
          label={t(activityDetailMessages.nativeFeedbackSuccess)}
          message={t(activityDetailMessages.nativeFeedbackSuccessMessage)}
          type="success"
        />
        <TestButton
          label={t(activityDetailMessages.nativeFeedbackWarning)}
          message={t(activityDetailMessages.nativeFeedbackWarningMessage)}
          type="warning"
        />
        <TestButton
          label={t(activityDetailMessages.nativeFeedbackError)}
          message={t(activityDetailMessages.nativeFeedbackErrorMessage)}
          type="error"
        />
        <TestButton
          label={t(activityDetailMessages.nativeFeedbackInfo)}
          message={t(activityDetailMessages.nativeFeedbackInfoMessage)}
          type="info"
        />
      </View>
    </View>
  );
}

function TestButton({ label, message, type }: TestButtonProps) {
  const theme = useAppTheme();

  return (
    <A11yPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={() =>
        showNativeToast({ duration: TEST_TOAST_DURATION_MS, message, title: label, type })
      }
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
        },
      ]}
      testID={`native-feedback-${type}`}
    >
      <Text style={[styles.buttonLabel, { color: theme.colors.text }]}>{label}</Text>
    </A11yPressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.space8,
  },
  button: {
    alignItems: "center",
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: MIN_TOUCH_TARGET,
    minWidth: 96,
    paddingHorizontal: spacing.space16,
  },
  buttonLabel: {
    ...typography.label,
    textAlign: "center",
  },
  root: {
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.space12,
    marginTop: spacing.space24,
    padding: spacing.space16,
  },
  status: {
    ...typography.caption,
    textAlign: "left",
  },
  title: {
    ...typography.headline,
    textAlign: "left",
  },
});
