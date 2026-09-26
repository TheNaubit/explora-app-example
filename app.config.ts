import { ConfigContext, ExpoConfig } from "expo/config";

/** Expo app config. `userInterfaceStyle: "automatic"` follows system light and dark appearance. */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Explora",
  slug: "explora-agile-monkeys",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "exploraagilemonkeys",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android"],
  ios: {
    bundleIdentifier: "com.adlerventures.explora",
    icon: "./assets/expo.icon",
    infoPlist: {
      CADisableMinimumFrameDurationOnPhone: true,
      CFBundleAllowMixedLocalizations: true,
    },
  },
  android: {
    package: "com.adlerventures.explora",
    icon: "./assets/images/icon.png",
    adaptiveIcon: {
      backgroundColor: "#F7F4EC",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  locales: {
    en: "./src/locales/native/en.json",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F7F4EC",
        image: "./assets/images/splash-icon.png",
        imageWidth: 116,
      },
    ],
    "expo-asset",
    "expo-image",
    "expo-sharing",
    "expo-web-browser",
    [
      "expo-calendar",
      {
        writeOnlyAccess: true,
        writeOnlyCalendarPermission: "Allow Explora to add activities to your calendars.",
      },
    ],
    [
      "expo-build-properties",
      {
        // SDK 58 / RN 0.88 prebuilt Core omits private headers that
        // react-native-a11y still imports. Build RN from source until a11y
        // supports the public module map.
        ios: {
          buildReactNativeFromSource: true,
        },
      },
    ],
    "./plugins/with-android-gradle-memory",
    "@rnrepo/expo-config-plugin",
    [
      "expo-localization",
      {
        supportedLocales: {
          ios: ["en"],
          android: ["en"],
        },
        supportsRTL: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "b87af5f4-ad99-4179-9e8b-8fa9ab193295",
    },
  },
});
