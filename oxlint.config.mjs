import { defineConfig } from "oxlint";
import sonarjs from "eslint-plugin-sonarjs";

/**
 * SonarJS recommended rules that do not need TypeScript type information.
 * Oxlint JS plugins do not support type-aware ESLint rules yet
 * (see https://oxc.rs/docs/guide/usage/linter/js-plugins and oxc#19596).
 */
function sonarjsRecommendedWithoutTypeAware() {
  const recommended = sonarjs.configs.recommended.rules ?? {};
  /** @type {Record<string, unknown>} */
  const rules = {};

  for (const [ruleId, severity] of Object.entries(recommended)) {
    if (severity === "off" || (Array.isArray(severity) && severity[0] === "off")) {
      continue;
    }

    const shortName = ruleId.replace(/^sonarjs\//, "");
    const rule = sonarjs.rules?.[shortName];
    if (rule?.meta?.docs?.requiresTypeChecking) {
      continue;
    }

    rules[ruleId] = severity;
  }

  return rules;
}

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  ignorePatterns: [
    "**/.agents/**",
    "**/.claude/**",
    "**/.tmp-review/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/android/**",
    "**/ios/**",
    "**/.expo/**",
  ],
  jsPlugins: [
    { name: "react-native", specifier: "oxlint-plugin-react-native" },
    "eslint-plugin-sonarjs",
  ],
  plugins: ["typescript", "unicorn", "oxc"],
  categories: {
    correctness: "error",
  },
  rules: {
    ...sonarjsRecommendedWithoutTypeAware(),
    "react-native/no-color-literals": "error",
    "react-native/no-inline-styles": "warn",
    "react-native/no-raw-text": [
      "error",
      {
        skip: ["ThemedText", "NativeTabs.Trigger.Label", "TabButton"],
      },
    ],
    "react-native/no-single-element-style-arrays": "error",
    "react-native/no-unused-styles": "warn",
    "react-native/sort-styles": "warn",
  },
  env: {
    builtin: true,
  },
  options: {
    typeAware: true,
  },
});
