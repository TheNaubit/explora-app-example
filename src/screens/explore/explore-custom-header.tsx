import { StyleSheet, View } from "react-native";
import { useValue } from "@legendapp/state/react";
import type { SharedValue } from "react-native-reanimated";

import { CategoryChipRow } from "@/components/category-chip-row";
import { CollapsingScreenHeader } from "@/components/collapsing-screen-header";
import { SearchField } from "@/components/search-field";
import { discovery$, setDiscoverySearch, toggleDiscoveryCategory } from "@/state/discovery";
import { spacing } from "@/theme";

type ExploreCustomHeaderProps = {
  bodyHeight: number;
  safeAreaTop: number;
  scrollOffset: SharedValue<number>;
  title: string;
};

/** Custom iOS discovery header. */
export function ExploreCustomHeader({
  bodyHeight,
  safeAreaTop,
  scrollOffset,
  title,
}: ExploreCustomHeaderProps) {
  const categories = useValue(discovery$.categories);
  const searchQuery = useValue(discovery$.searchQuery);

  return (
    <CollapsingScreenHeader
      bodyHeight={bodyHeight}
      safeAreaTop={safeAreaTop}
      scrollOffset={scrollOffset}
      title={title}
      persistentContent={
        <View style={styles.chips}>
          <CategoryChipRow selectedCategories={categories} onToggle={toggleDiscoveryCategory} />
        </View>
      }
    >
      <SearchField
        initialValue={searchQuery}
        onDebouncedChange={setDiscoverySearch}
        testID="explore-search-field"
      />
    </CollapsingScreenHeader>
  );
}

const styles = StyleSheet.create({
  chips: { paddingHorizontal: spacing.space24 },
});
