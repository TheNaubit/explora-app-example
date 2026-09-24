import { StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import { DevToolsSection } from "@/screens/dev-tools/dev-tools-section";
import { devToolsMessages } from "@/screens/dev-tools/messages";
import { spacing, typography, useAppTheme } from "@/theme";

export type ReviewModeOption = "normal" | "slow" | "fail" | "success";

type DevToolsModeSectionProps = {
  title: string;
  help: string;
  testIDPrefix: string;
  options: readonly ReviewModeOption[];
  selected: ReviewModeOption;
  onChange: (value: ReviewModeOption) => void;
};

const optionMessages = {
  normal: devToolsMessages.normal,
  slow: devToolsMessages.slow,
  fail: devToolsMessages.fail,
  success: devToolsMessages.success,
} as const;

/** One grouped radio selection for a request mode. */
export function DevToolsModeSection({
  title,
  help,
  testIDPrefix,
  options,
  selected,
  onChange,
}: DevToolsModeSectionProps) {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();

  return (
    <DevToolsSection title={title} footer={help}>
      {options.map((option) => {
        const optionLabel = t(optionMessages[option]);
        const isSelected = option === selected;

        return (
          <A11yPressable
            accessibilityHint={t(devToolsMessages.modeOptionHint)}
            accessibilityLabel={i18n._({
              ...devToolsMessages.modeOptionLabel,
              values: { option: optionLabel, setting: title },
            })}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            key={option}
            onPress={() => onChange(option)}
            style={(state) => [
              styles.row,
              {
                backgroundColor: state.pressed
                  ? theme.colors.surfaceSecondary
                  : theme.colors.surface,
              },
            ]}
            testID={`dev-tools-${testIDPrefix}-${option}`}
          >
            <Text style={[styles.label, { color: theme.colors.text }]}>{optionLabel}</Text>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Text style={[styles.checkmark, { color: theme.colors.accent }]}>
                {isSelected ? "✓" : ""}
              </Text>
            </View>
          </A11yPressable>
        );
      })}
    </DevToolsSection>
  );
}

const styles = StyleSheet.create({
  checkmark: {
    ...typography.bodyStrong,
    textAlign: "right",
  },
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
});
