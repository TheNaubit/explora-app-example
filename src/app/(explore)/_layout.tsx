import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

const IS_IOS = process.env.EXPO_OS === "ios";

/**
 * Explore tab stack.
 * Explore keeps its custom header on iOS. Android uses the native Stack header.
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
