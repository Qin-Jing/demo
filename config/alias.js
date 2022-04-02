const path = require('path');

module.exports = (config) => {
  config.resolve.alias.set('gui', path.resolve('node_modules/gweb-ui'));
  config.resolve.alias.set('@', path.resolve('src'));
}