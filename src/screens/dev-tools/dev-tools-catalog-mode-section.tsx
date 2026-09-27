import { StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET } from "@/components/constants";
import type { CatalogMode } from "@/mocks/catalog-store";
import { DevToolsSection } from "@/screens/dev-tools/dev-tools-section";
import { devToolsMessages } from "@/screens/dev-tools/messages";
import { spacing, typography, useAppTheme } from "@/theme";

type DevToolsCatalogModeSectionProps = {
  selected: CatalogMode;
  onChange: (value: CatalogMode) => void;
};

const CATALOG_MODES = ["supplied", "performance"] as const;

/** Select the normal or performance dataset with accessible radio rows. */
export function DevToolsCatalogModeSection({
  selected,
  onChange,
}: DevToolsCatalogModeSectionProps) {
  const { i18n, t } = useLingui();
  const theme = useAppTheme();
  const title = t(devToolsMessages.catalogDataset);

  return (
    <DevToolsSection title={title} footer={t(devToolsMessages.catalogDatasetHelp)}>
      {CATALOG_MODES.map((mode) => {
        const optionLabel = t(
          mode === "supplied"
            ? devToolsMessages.suppliedCatalog
            : devToolsMessages.performanceCatalog,
        );
        const isSelected = mode === selected;

        return (
          <A11yPressable
            accessibilityHint={t(devToolsMessages.catalogModeHint)}
            accessibilityLabel={i18n._({
              ...devToolsMessages.modeOptionLabel,
              values: { option: optionLabel, setting: title },
            })}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            key={mode}
            onPress={() => onChange(mode)}
            style={(state) => [
              styles.row,
              {
                backgroundColor: state.pressed
                  ? theme.colors.surfaceSecondary
                  : theme.colors.surface,
              },
            ]}
            testID={`dev-tools-catalog-mode-${mode}`}
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
