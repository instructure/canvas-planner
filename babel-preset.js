const env = process.env.BABEL_ENV || process.env.NODE_ENV
const esModules = process.env.ES_MODULES

if (env !== 'development' && env !== 'test' && env !== 'production') {
  throw new Error(
    'Invalid or undefined `NODE_ENV` or ' +
    '`BABEL_ENV` environment variables. Valid values are "development", ' +
    '"test", and "production". Instead, received: ' + JSON.stringify(env) + '.'
  )
}

module.exports = function (context, opts = {}) {
  let presets = []

  const envOpts = {
    'targets': {
      'browsers': ['last 2 versions', 'not ie <= 10']
    }
  }

  if (esModules) {
    envOpts['modules'] = false
  }

  presets = presets.concat([
    [require.resolve('babel-preset-env'), envOpts],
    require.resolve('babel-preset-stage-1'),
    require.resolve('babel-preset-react')
  ])

  let plugins = [
    require.resolve('babel-plugin-transform-class-display-name')
  ]

  if (env === 'production') {
    // The css-modules-require-hook that the themeable babel plugin uses doesn't work
    // well with jest so in 'test' env use the jest transformer to mock css imports

    // and in 'dev' we want the css changes to fire a recompile so we use the
    // themeable webpack loader instead

    plugins = plugins.concat(
      [[
        require.resolve('instructure-ui/babel/plugins/transform-themeable'),
        {
          'postcssrc': './postcss.config.js',
          'themeablerc': './themeable.config.js'
        }
      ]]
    )
  }

  return {
    presets,
    plugins
  }
}
