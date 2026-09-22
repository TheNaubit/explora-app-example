import { StyleSheet, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { CategoryChip } from "@/components/category-chip";
import { DISCOVERY_CATEGORIES } from "@/components/category-chip-row/constants";
import { categoryChipRowMessages } from "@/components/category-chip-row/messages";
import type { ActivityCategory } from "@/schemas/activity";

type CategoryChipRowProps = {
  selected: ActivityCategory | null;
  onSelect: (category: ActivityCategory | null) => void;
};

/**
 * Five chips: All plus the four catalog categories.
 */
export function CategoryChipRow({ selected, onSelect }: CategoryChipRowProps) {
  const { t } = useLingui();

  return (
    <View style={styles.row} testID="category-chip-row">
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
