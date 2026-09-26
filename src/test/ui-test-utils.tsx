/**
 * Shared providers for React Native Testing Library UI tests.
 * Uses a lightweight Lingui instance so tests do not load `.po` catalogs.
 */
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createTestQueryClient } from "@/test/create-test-query-client";

i18n.load("en", {});
i18n.activate("en");

/** Fixed metrics so SafeAreaProvider renders children in Jest (no native bridge). */
const TEST_SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export function createProviders(queryClient: QueryClient = createTestQueryClient()) {
  return function Providers({ children }: { children: ReactNode }) {
    return createElement(
      SafeAreaProvider,
      { initialMetrics: TEST_SAFE_AREA_METRICS },
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(I18nProvider, { i18n }, children),
      ),
    );
  };
}

export { createTestQueryClient as createQueryClient };
