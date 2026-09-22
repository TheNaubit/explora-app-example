import { StyleSheet, Text, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { useValue } from "@legendapp/state/react";

import { CategoryChipRow } from "@/components/category-chip-row";
import { SearchField } from "@/components/search-field";
import { discovery$, setDiscoveryCategory, setDiscoverySearch } from "@/state/discovery";
import { exploreMessages } from "@/screens/explore/messages";
import { spacing, typography, useAppTheme } from "@/theme";

/**
 * Explore filter chrome for list headers and the web search field.
 * Chips sit in the list header. Catalog LegendList stays the vertical scroll owner.
 */
export function ExploreHeader() {
  const { t } = useLingui();
  const theme = useAppTheme();
  const category = useValue(discovery$.category);
  const searchQuery = useValue(discovery$.searchQuery);
  const showWebSearch = process.env.EXPO_OS === "web";

  return (
    <View style={styles.root}>
      {showWebSearch ? (
        <>
          <Text style={[styles.heading, { color: theme.colors.text }]} accessibilityRole="header">
            {t(exploreMessages.heading)}
          </Text>
          <SearchField initialValue={searchQuery} onDebouncedChange={setDiscoverySearch} />
        </>
      ) : null}
      <View style={styles.chips}>
        <CategoryChipRow selected={category} onSelect={setDiscoveryCategory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingBottom: spacing.space8,
  },
  heading: {
    ...typography.display,
    marginBottom: spacing.space16,
    marginTop: spacing.space16,
    textAlign: "left",
  },
  root: {
    marginBottom: spacing.space8,
    marginTop: spacing.space8,
  },
});
