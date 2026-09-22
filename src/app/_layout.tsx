import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { LocaleProvider, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { useLocales } from "expo-localization";
import { QueryClientProvider } from "@tanstack/react-query";

import { A11yProvider } from "@/a11y";
import { AppTabs } from "@/components/app-tabs";
import { I18nBootstrap, resolveTextDirection, sourceLocale } from "@/i18n";
import { queryClient } from "@/query/client";
import { setupOnlineManager } from "@/query/online-manager";

setupOnlineManager();

/**
 * Root layout: providers, theme, and native tabs.
 * iOS 26 uses system Liquid Glass for the tab bar. Android uses Material bottom navigation.
 */
export default function RootLayout() {
  const locales = useLocales();
  const colorScheme = useColorScheme();
  const direction = useMemo(() => {
    const device = locales[0];
    return resolveTextDirection(device?.textDirection, device?.languageTag ?? sourceLocale);
  }, [locales]);

  return (
    <QueryClientProvider client={queryClient}>
      <A11yProvider>
        <I18nBootstrap>
          <LocaleProvider direction={direction}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <AppTabs />
            </ThemeProvider>
          </LocaleProvider>
        </I18nBootstrap>
      </A11yProvider>
    </QueryClientProvider>
  );
}
