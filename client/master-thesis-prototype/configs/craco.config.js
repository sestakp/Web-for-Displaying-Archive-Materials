const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@wrappers': path.resolve(__dirname, '../src/wrappers'),
      '@redux': path.resolve(__dirname, '../src/redux'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
    /*
      configure: (webpackConfig, { paths }) => {

        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
          os: require.resolve('os-browserify/browser'),
          https: require.resolve('https-browserify'),
          util: require.resolve('util'),
        };
        return webpackConfig;
      },*/
  },
};
