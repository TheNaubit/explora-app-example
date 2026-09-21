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

/**
 * Lingui recommended rules via eslint-plugin-lingui as an Oxlint JS plugin.
 * Do not install or run the ESLint CLI. See https://oxc.rs/docs/guide/usage/linter/js-plugins
 */
function linguiRecommendedRules() {
  /** @type {Record<string, unknown>} */
  const rules = {
    "lingui/t-call-in-function": "error",
    "lingui/no-single-tag-to-translate": "error",
    "lingui/no-single-variables-to-translate": "error",
    "lingui/no-trans-inside-trans": "error",
    "lingui/no-expression-in-message": "error",
    // Not in the plugin recommended preset. Required here so unwrapped UI copy fails lint.
    "lingui/no-unlocalized-strings": [
      "error",
      {
        ignore: ["^[A-Z0-9_-]+$"],
        ignoreNames: [
          "className",
          "styleName",
          "style",
          "src",
          "href",
          "testID",
          "data-testid",
          "accessibilityRole",
          "accessibilityState",
          "key",
          "id",
          "name",
        ],
        ignoreFunctions: ["console.*", "require", "StyleSheet.create", "z.enum", "z.literal"],
      },
    ],
  };

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
    "**/src/locales/**",
  ],
  jsPlugins: [
    { name: "react-native", specifier: "oxlint-plugin-react-native" },
    "eslint-plugin-sonarjs",
    "eslint-plugin-lingui",
  ],
  plugins: ["typescript", "unicorn", "oxc"],
  categories: {
    correctness: "error",
  },
  rules: {
    ...sonarjsRecommendedWithoutTypeAware(),
    ...linguiRecommendedRules(),
    "react-native/no-color-literals": "error",
    "react-native/no-inline-styles": "warn",
    "react-native/no-raw-text": [
      "error",
      {
        skip: ["ThemedText", "NativeTabs.Trigger.Label", "TabButton", "Trans"],
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
