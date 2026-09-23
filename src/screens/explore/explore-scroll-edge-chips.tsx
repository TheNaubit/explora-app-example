import { StyleSheet, View } from "react-native";
import { ScrollEdgeEffect } from "@bsky.app/expo-scroll-edge-effect";
import { useValue } from "@legendapp/state/react";

import { CategoryChipRow } from "@/components/category-chip-row";
import { EXPLORE_CHIP_OVERLAY_HEIGHT } from "@/screens/explore/constants";
import { useExploreTopInset } from "@/screens/explore/use-explore-top-inset";
import { discovery$, setDiscoveryCategory } from "@/state/discovery";
import { spacing } from "@/theme";

/**
 * Floating category chips under the transparent native header.
 * ScrollEdgeEffect lets iOS 26 soft-edge blur morph around the chips.
 */
export function ExploreScrollEdgeChips() {
  const topInset = useExploreTopInset();
  const category = useValue(discovery$.category);

  return (
    <ScrollEdgeEffect
      edge="top"
      effect="soft"
      pointerEvents="box-none"
      style={[styles.overlay, { height: EXPLORE_CHIP_OVERLAY_HEIGHT, top: topInset }]}
      testID="explore-scroll-edge-chips"
    >
      <View style={styles.chips} pointerEvents="auto">
        <CategoryChipRow selected={category} onSelect={setDiscoveryCategory} />
      </View>
    </ScrollEdgeEffect>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: spacing.space24,
  },
  overlay: {
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 2,
  },
});
