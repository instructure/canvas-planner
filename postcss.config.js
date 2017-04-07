module.exports = function (ctx) {
  let plugins = []

  if (ctx.env === 'development' || ctx.env === 'test') {
    plugins = plugins.concat([
      require('stylelint')(),
      require('postcss-browser-reporter')
    ])
  }

  plugins = plugins.concat([
    require('postcss-url')({
      url: 'inline'
    }),
    require('postcss-nested')(),
    require('autoprefixer')({
      browsers: ['last 2 versions']
    }),
    require('postcss-reporter')
  ])

  return {
    plugins
  }
}
