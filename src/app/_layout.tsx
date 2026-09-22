import { useMemo } from "react";
import { LocaleProvider, Stack } from "expo-router";
import { useLocales } from "expo-localization";
import { QueryClientProvider } from "@tanstack/react-query";

import { A11yProvider } from "@/a11y";
import { I18nBootstrap, resolveTextDirection, sourceLocale } from "@/i18n";
import { queryClient } from "@/query/client";
import { setupOnlineManager } from "@/query/online-manager";

setupOnlineManager();

/**
 * Root layout. Wraps Query, a11y, and i18n providers.
 * Direction tracks the device locale via `useLocales` (updates when OS settings change).
 * Catalog language follows the device when a matching Lingui catalog exists.
 */
export default function RootLayout() {
  const locales = useLocales();
  const direction = useMemo(() => {
    const device = locales[0];
    return resolveTextDirection(device?.textDirection, device?.languageTag ?? sourceLocale);
  }, [locales]);

  return (
    <QueryClientProvider client={queryClient}>
      <A11yProvider>
        <I18nBootstrap>
          <LocaleProvider direction={direction}>
            <Stack>
              <Stack.Screen name="index" options={{ title: "Explora" }} />
            </Stack>
          </LocaleProvider>
        </I18nBootstrap>
      </A11yProvider>
    </QueryClientProvider>
  );
}
