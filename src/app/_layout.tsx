import { useCallback, useState } from "react";
import { LocaleProvider, Stack } from "expo-router";

import { A11yProvider } from "@/a11y";
import { I18nBootstrap } from "@/i18n";

/**
 * Root layout. Wraps a11y and i18n providers.
 * `A11yProvider` is a compatibility shim from react-native-a11y 0.9.
 * Locale direction comes from device settings via `I18nBootstrap`.
 */
export default function RootLayout() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const onI18nReady = useCallback(
    (state: { locale: string; direction: "ltr" | "rtl"; languageTag: string }) => {
      setDirection(state.direction);
    },
    [],
  );

  return (
    <A11yProvider>
      <I18nBootstrap onReady={onI18nReady}>
        <LocaleProvider direction={direction}>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Explora" }} />
          </Stack>
        </LocaleProvider>
      </I18nBootstrap>
    </A11yProvider>
  );
}
