// Learn more: https://docs.expo.dev/guides/customizing-metro/
// Lingui metro transformer: https://lingui.dev/ref/metro-transformer
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("@lingui/metro-transformer/expo"),
};

config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, "po", "pot"],
};

module.exports = config;
