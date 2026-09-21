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
    icon: "./assets/expo.icon",
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
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
        backgroundColor: "#208AEF",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
    "expo-asset",
    "expo-image",
    "expo-sharing",
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
});
