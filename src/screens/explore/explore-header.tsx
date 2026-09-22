import { ScrollView, StyleSheet, Text } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";

import { CategoryChipRow } from "@/components/category-chip-row";
import { SearchField } from "@/components/search-field";
import { discovery$, setDiscoveryCategory, setDiscoverySearch } from "@/state/discovery";
import { exploreMessages } from "@/screens/explore/messages";
import { spacing, typography, useAppTheme } from "@/theme";

/**
 * Explore title, search field, and category chips.
 * Stays outside Suspense so filters remain visible while the list reloads.
 */
export function ExploreHeader() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const category = useValue(discovery$.category);
  const searchQuery = useValue(discovery$.searchQuery);

  return (
    <>
      <Text style={[styles.heading, { color: theme.colors.text }]} accessibilityRole="header">
        {t(exploreMessages.heading)}
      </Text>
      <SearchField initialValue={searchQuery} onDebouncedChange={setDiscoverySearch} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}
      >
        <CategoryChipRow selected={category} onSelect={setDiscoveryCategory} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: spacing.space24,
    paddingBottom: spacing.space8,
  },
  chipsScroll: {
    flexGrow: 0,
    marginBottom: spacing.space8,
  },
  heading: {
    ...typography.display,
    marginBottom: spacing.space16,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space8,
    textAlign: "left",
  },
});
