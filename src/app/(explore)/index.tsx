import { StyleSheet, View } from "react-native";
import { Explore } from "@/screens/explore";
import { ExploreNativeSearch } from "@/screens/explore/explore-native-search";

/**
 * Explore tab route.
 * Scene root fills the stack content and preserves the platform header behavior.
 */
export default function ExploreRoute() {
  return (
    <View collapsable={false} style={styles.root}>
      <Explore />
      <ExploreNativeSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
