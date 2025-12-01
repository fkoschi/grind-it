const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");

module.exports = withStorybook(wrapWithReanimatedMetroConfig(config), {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  configPath: path.resolve(__dirname, "./.storybook"),
});
