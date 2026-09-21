import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { TransRenderProps } from "@lingui/react";
import { type ReactNode, useEffect } from "react";
import { AppState, Text, type AppStateStatus } from "react-native";

import { activateFromDevice } from "@/i18n/activate";

type I18nBootstrapProps = {
  children: ReactNode;
  /** Called when locale activation finishes (including direction for Expo Router). */
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
 * Refreshes locale from the device on mount and when the app returns to the foreground.
 */
export function I18nBootstrap({ children, onReady }: I18nBootstrapProps) {
  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const state = await activateFromDevice();
      if (!cancelled) {
        onReady?.(state);
      }
    }

    void refresh();

    function onAppStateChange(next: AppStateStatus) {
      if (next === "active") {
        void refresh();
      }
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [onReady]);

  return (
    <I18nProvider i18n={i18n} defaultComponent={DefaultTransComponent}>
      {children}
    </I18nProvider>
  );
}
