module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    // Lingui macros must expand before React Compiler (enabled via babel-preset-expo).
    plugins: ["@lingui/babel-plugin-lingui-macro"],
  };
};
