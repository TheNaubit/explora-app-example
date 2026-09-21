module.exports = function (api) {
  api.cache(true);

  return {
    // React Compiler is enabled by `experiments.reactCompiler` in app.config
    // and injected early inside `babel-preset-expo`.
    presets: ["babel-preset-expo"],
    // Babel runs root `plugins` before presets. Keep Lingui here so macros expand
    // before React Compiler (Lingui + React Compiler requirement).
    // Do not move `@lingui/babel-plugin-lingui-macro` into the preset options.
    plugins: ["@lingui/babel-plugin-lingui-macro"],
  };
};
