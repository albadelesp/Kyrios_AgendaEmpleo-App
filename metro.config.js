const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("jpg", "jpeg", "png", "gif", "webp");

module.exports = defaultConfig;

