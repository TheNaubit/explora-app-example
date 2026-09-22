/**
 * Shared providers for React Native Testing Library UI tests.
 * Uses a lightweight Lingui instance so tests do not load `.po` catalogs.
 */
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import { createQueryClient } from "@/query/client";

i18n.load("en", {});
i18n.activate("en");

export function createProviders(queryClient: QueryClient = createQueryClient()) {
  return function Providers({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(I18nProvider, { i18n }, children),
    );
  };
}

export { createQueryClient };
