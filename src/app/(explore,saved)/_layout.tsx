import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

export const unstable_settings = {
  explore: { anchor: "index" },
  saved: { anchor: "index" },
};

const IS_IOS = process.env.EXPO_OS === "ios";

type SharedTabStackProps = {
  segment: string;
};

/** Shared stack for Explore and Saved. Both tabs can push Activity Detail. */
export default function SharedTabStack({ segment }: SharedTabStackProps) {
  const tab = segment.match(/\((.*)\)/)?.[1];
  const showsExploreHeader = tab === "explore" && !IS_IOS;

  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          contentStyle: styles.content,
          headerLargeTitleEnabled: false,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: showsExploreHeader }} />
        <Stack.Screen name="activity/[id]" options={{ headerShown: false }} />
      </Stack>
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
