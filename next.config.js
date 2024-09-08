const { withExpo } = require('@expo/next-adapter');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'react-native-web',
  'react-native-svg',
  'react-native-svg-charts',
  'react-native-elements',
  'react-native-ratings',
  'react-native-vector-icons',
  '@react-navigation/native',
  'react-native',
]);

module.exports = withPlugins([withTM, withExpo], {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',  // 将 react-native 替换为 react-native-web
    };

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules\/(?!(@react-native|react-native-elements|react-native-svg|react-native-svg-charts|react-native-ratings|react-native-vector-icons|@react-navigation|react-native)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',  // 保留 @babel/preset-env
            '@babel/preset-react',
            '@babel/preset-flow',
            '@babel/preset-typescript',
            'babel-preset-expo',
          ],
          plugins: [
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            ['@babel/plugin-transform-modules-commonjs', { loose: true }],
          ],
        },
      },
    });

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
});