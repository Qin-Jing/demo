// vue.config.js
const devServer = require('./config/dev.server');

const alias = require('./config/alias');

const env = process.env.NODE_ENV;

module.exports = {
  publicPath: env === 'production'
    ? './'
    : './',
  devServer,
  chainWebpack: alias,
  css: {
    loaderOptions: {
      sass: {}
    }
  },
  transpileDependencies: ['gweb-ui'],
  configureWebpack: (config) => {
    if (env == 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
};
