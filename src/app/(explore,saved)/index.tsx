import { StyleSheet, View } from "react-native";
import { useSegments } from "expo-router";

import { Explore } from "@/screens/explore";
import { ExploreNativeSearch } from "@/screens/explore/explore-native-search";
import { Saved } from "@/screens/saved";

/** Thin shared index route for the Explore and Saved tab stacks. */
export default function TabIndexRoute() {
  const [segment] = useSegments();

  if (segment === "(saved)") {
    return <Saved />;
  }

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
