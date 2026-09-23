import { Platform, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

function iosMajorVersion(): number {
  if (process.env.EXPO_OS !== "ios") {
    return 0;
  }
  const version = Platform.Version;
  return typeof version === "string" ? Number.parseInt(version, 10) : version;
}

const IS_IOS = process.env.EXPO_OS === "ios";
const IS_IOS_26_PLUS = IS_IOS && iosMajorVersion() >= 26;

/**
 * Explore tab stack.
 * Hosts the native header search bar and large title for discovery.
 * Outer flex root helps the nested stack fill the Native Tabs scene.
 * iOS keeps a transparent header so content can scroll under soft edge blur.
 */
export default function ExploreLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          contentStyle: styles.content,
          headerLargeTitleEnabled: true,
          headerShadowVisible: false,
          // Transparent only on iOS so Android keeps a solid Material header.
          headerTransparent: IS_IOS,
          // Soft gradient blur under the large title / search on iOS 26+.
          // Do not set headerBlurEffect on iOS 26+; it stacks a hard blur on top.
          ...(IS_IOS_26_PLUS
            ? {
                scrollEdgeEffects: {
                  top: "soft",
                  bottom: "hidden",
                  left: "hidden",
                  right: "hidden",
                },
              }
            : IS_IOS
              ? { headerBlurEffect: "systemThinMaterial" as const }
              : {}),
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
