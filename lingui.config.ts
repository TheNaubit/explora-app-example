import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-po";

import { locales, sourceLocale } from "./src/i18n/locales";

/**
 * Lingui extract / compile config.
 * Catalogs live under `src/locales/{locale}/messages.po`.
 * Metro compiles `.po` on import via `@lingui/metro-transformer`.
 */
export default defineConfig({
  sourceLocale,
  locales: [...locales],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: formatter({ lineNumbers: false }),
});
