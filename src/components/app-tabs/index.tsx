import { DynamicColorIOS, Platform, useColorScheme } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { NativeTabs } from "expo-router/native-tabs";

import { tabMessages } from "@/screens/tabs/messages";
import { primitiveColors } from "@/theme";

/**
 * Native tab bar for Explore, Favorites, and Dev Tools.
 * iOS 26 uses Liquid Glass. Android uses Material bottom navigation.
 */
export function AppTabs() {
  const { t } = useLingui();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const tabTintColor =
    Platform.OS === "ios"
      ? DynamicColorIOS({
          light: primitiveColors.forest500,
          dark: primitiveColors.forest300,
        })
      : isDark
        ? primitiveColors.forest300
        : primitiveColors.forest500;

  const tabLabelColor =
    Platform.OS === "ios"
      ? DynamicColorIOS({
          light: primitiveColors.ink900,
          dark: "#F5F2EA",
        })
      : isDark
        ? "#F5F2EA"
        : primitiveColors.ink900;

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tabBarRespectsIMEInsets
      tintColor={tabTintColor}
      labelStyle={{
        color: tabLabelColor,
      }}
    >
      <NativeTabs.Trigger name="(explore)" accessibilityLabel={t(tabMessages.explore)}>
        <NativeTabs.Trigger.Icon sf={{ default: "safari", selected: "safari.fill" }} md="explore" />
        <NativeTabs.Trigger.Label>{t(tabMessages.explore)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(favorites)" accessibilityLabel={t(tabMessages.favorites)}>
        <NativeTabs.Trigger.Icon sf={{ default: "heart", selected: "heart.fill" }} md="favorite" />
        <NativeTabs.Trigger.Label>{t(tabMessages.favorites)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(dev-tools)" accessibilityLabel={t(tabMessages.devTools)}>
        <NativeTabs.Trigger.Icon
          sf={{ default: "wrench.and.screwdriver", selected: "wrench.and.screwdriver.fill" }}
          md="build"
        />
        <NativeTabs.Trigger.Label>{t(tabMessages.devTools)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
