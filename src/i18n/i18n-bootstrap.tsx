import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { TransRenderProps } from "@lingui/react";
import { useLocales } from "expo-localization";
import { type ReactNode, useEffect } from "react";
import { AppState, Text, type AppStateStatus } from "react-native";

import { activateFromDevice } from "@/i18n/activate";

type I18nBootstrapProps = {
  children: ReactNode;
  /**
   * Called when catalog activation finishes.
   * Prefer `useLocales` / `readDeviceTextDirection` for live direction in the root layout.
   */
  onReady?: (state: { locale: string; direction: "ltr" | "rtl"; languageTag: string }) => void;
};

/**
 * Default `Trans` render target for React Native.
 * All text must live inside a `Text` node.
 */
function DefaultTransComponent({ children }: TransRenderProps) {
  return <Text>{children}</Text>;
}

/**
 * Mounts `I18nProvider` immediately (source catalog is already active).
 * Re-activates from device when locale settings change or the app returns to the foreground.
 */
export function I18nBootstrap({ children, onReady }: I18nBootstrapProps) {
  const locales = useLocales();
  const languageTag = locales[0]?.languageTag;

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const state = await activateFromDevice();
      if (!cancelled) {
        onReady?.(state);
      }
    }

    void refresh();

    return () => {
      cancelled = true;
    };
  }, [languageTag, onReady]);

  useEffect(() => {
    function onAppStateChange(next: AppStateStatus) {
      if (next === "active") {
        void activateFromDevice().then((state) => {
          onReady?.(state);
        });
      }
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [onReady]);

  return (
    <I18nProvider i18n={i18n} defaultComponent={DefaultTransComponent}>
      {children}
    </I18nProvider>
  );
}
