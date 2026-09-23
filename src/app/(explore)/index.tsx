import { StyleSheet, View } from "react-native";

import { Explore } from "@/screens/explore";
import { ExploreNativeSearch } from "@/screens/explore/explore-native-search";

/**
 * Explore tab route.
 * Scene root fills the stack content. Explore list is the first child so iOS
 * can bind large title collapse and search hide-on-scroll.
 * Stack title and search bar return null hosts and register header options.
 */
export default function ExploreRoute() {
  return (
    <View style={styles.root}>
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
