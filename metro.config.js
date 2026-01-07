// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .glb and .gltf to the asset extensions
config.resolver.assetExts.push('glb', 'gltf', 'bin', 'obj', 'mtl');

module.exports = config;
