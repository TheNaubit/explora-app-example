import { ScrollView, StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { CategoryChip } from "@/components/category-chip";
import { DISCOVERY_CATEGORIES } from "@/components/category-chip-row/constants";
import { categoryChipRowMessages } from "@/components/category-chip-row/messages";
import type { ActivityCategory } from "@/schemas/activity";
import { spacing } from "@/theme";

type CategoryChipRowProps = {
  selected: ActivityCategory | null;
  onSelect: (category: ActivityCategory | null) => void;
};

/**
 * Five filter chips: All plus the four catalog categories.
 * RN horizontal ScrollView keeps scroll offset across list header updates.
 * Chips use `A11yPressable` so labels, selected state, and keyboard focus stay correct.
 */
export function CategoryChipRow({ selected, onSelect }: CategoryChipRowProps) {
  const { t } = useLingui();

  return (
    <View style={styles.root} testID="category-chip-row">
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <CategoryChip
          label={t(categoryChipRowMessages.all)}
          selected={selected === null}
          onPress={() => onSelect(null)}
          testID="category-chip-all"
        />
        {DISCOVERY_CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={t(categoryChipRowMessages[category])}
            selected={selected === category}
            onPress={() => onSelect(category)}
            testID={`category-chip-${category.toLowerCase()}`}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: spacing.space4,
  },
  root: {
    minHeight: 44,
    width: "100%",
  },
});
