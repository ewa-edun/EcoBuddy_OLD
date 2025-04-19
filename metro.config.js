const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add all required file extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts, // Keep existing extensions
  'bin',
  'json',
  'pb',
  'onnx',
  'txt',
  'weights', 
];

// Enable asset resolution from assets folder
config.resolver.extraNodeModules = {
  assets: path.resolve(__dirname, './assets'),
};

module.exports = config;