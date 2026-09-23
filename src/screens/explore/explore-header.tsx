import { StyleSheet, View } from "react-native";
import { useValue } from "@legendapp/state/react";

import { CategoryChipRow } from "@/components/category-chip-row";
import { SearchField } from "@/components/search-field";
import { discovery$, setDiscoverySearch, toggleDiscoveryCategory } from "@/state/discovery";
import { spacing } from "@/theme";

/**
 * Search and category controls for the Search list header.
 * Catalog LegendList stays the vertical scroll owner.
 */
export function ExploreHeader() {
  const categories = useValue(discovery$.categories);
  const searchQuery = useValue(discovery$.searchQuery);
  const showWebSearch = process.env.EXPO_OS === "web";

  return (
    <View style={styles.root}>
      {showWebSearch ? (
        <SearchField initialValue={searchQuery} onDebouncedChange={setDiscoverySearch} />
      ) : null}
      <View style={styles.chips}>
        <CategoryChipRow selectedCategories={categories} onToggle={toggleDiscoveryCategory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingBottom: spacing.space8,
  },
  root: {
    marginBottom: spacing.space8,
    marginTop: spacing.space8,
  },
});
