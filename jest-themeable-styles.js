var proxy = require('identity-obj-proxy');
var transform = require('instructure-ui/babel/plugins/util/transform-css-require.js')

module.exports = {
  process: function(src, filename) {
    return 'module.exports = ' + transform(proxy, src)
  }
};
