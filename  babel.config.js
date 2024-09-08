module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo',
        '@babel/preset-typescript',
        '@babel/preset-flow',
        '@babel/preset-env',  // 保留 @babel/preset-env 处理现代 JavaScript
      ],
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { loose: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        ['@babel/plugin-transform-runtime', { regenerator: true }],  // 确保加入 regenerator 处理 async/await
      ],
    };
  };