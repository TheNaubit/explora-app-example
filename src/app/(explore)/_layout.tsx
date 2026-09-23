import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

const IS_IOS = process.env.EXPO_OS === "ios";

/**
 * Explore tab stack.
 * iOS uses one custom header so title, search, and filters share one surface.
 * Android keeps the native title and search bar.
 * Outer flex root helps the nested stack fill the Native Tabs scene.
 */
export default function ExploreLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          contentStyle: styles.content,
          headerLargeTitleEnabled: false,
          headerShown: !IS_IOS,
          headerShadowVisible: false,
          headerTransparent: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
