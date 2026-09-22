import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { SymbolView } from "expo-symbols";

import { buildSearchFieldLabel } from "@/a11y";
import { A11yInput } from "@/components/a11y-input";
import { A11yPressable } from "@/components/a11y-pressable";
import { MIN_TOUCH_TARGET, SEARCH_DEBOUNCE_MS } from "@/components/constants";
import { radii, spacing, typography, useAppTheme } from "@/theme";

type SearchFieldProps = {
  /** Controlled local value. Defaults to empty. */
  initialValue?: string;
  /** Debounce delay in ms. Defaults to SEARCH_DEBOUNCE_MS. */
  debounceMs?: number;
  /** Called with the trimmed query after the debounce delay. */
  onDebouncedChange: (query: string) => void;
  testID?: string;
};

const clearLabel = msg({
  id: "search.clear",
  comment: "Spoken and visible label for clearing the discovery search field",
  message: "Clear search",
});

const placeholder = msg({
  id: "search.placeholder",
  comment: "Placeholder text inside the discovery search field",
  message: "Search by title",
});

/**
 * Debounced title search field.
 * The parent owns store writes through `onDebouncedChange`.
 */
export function SearchField({
  initialValue = "",
  debounceMs = SEARCH_DEBOUNCE_MS,
  onDebouncedChange,
  testID,
}: SearchFieldProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const [value, setValue] = useState(initialValue);
  const spokenLabel = buildSearchFieldLabel();
  const clear = t(clearLabel);

  useEffect(() => {
    const handle = setTimeout(() => {
      onDebouncedChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [debounceMs, onDebouncedChange, value]);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      testID={testID ?? "search-field"}
    >
      <SymbolView
        name={{ ios: "magnifyingglass", android: "search", web: "search" }}
        size={18}
        tintColor={theme.colors.textSecondary}
        style={styles.icon}
      />
      <A11yInput
        accessibilityLabel={spokenLabel}
        accessibilityRole="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        onChangeText={setValue}
        placeholder={t(placeholder)}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        style={[styles.input, { color: theme.colors.text }]}
        testID="search-field-input"
        value={value}
      />
      {value.length > 0 ? (
        <A11yPressable
          accessibilityLabel={clear}
          accessibilityRole="button"
          onPress={() => setValue("")}
          style={styles.clear}
          testID="search-field-clear"
        >
          <SymbolView
            name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
            size={20}
            tintColor={theme.colors.textSecondary}
          />
        </A11yPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  clear: {
    alignItems: "center",
    height: MIN_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_TOUCH_TARGET,
  },
  icon: {
    marginEnd: spacing.space8,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: spacing.space8,
    textAlign: "left",
  },
  root: {
    alignItems: "center",
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginHorizontal: spacing.space24,
    marginBottom: spacing.space12,
    paddingHorizontal: spacing.space12,
  },
});
