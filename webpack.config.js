const path = require('path');

module.exports = {
  entry: './src/demo.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'canvas-planner.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'babel-loader',
            query: {
              babelrc: true,
              cacheDirectory: '.babel-cache'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              babelrc: true,
              cacheDirectory: '.babel-cache'
            }
          },
          'instructure-ui/webpack/loaders/themeable-css-loader',
          {
            loader: 'css-loader',
            options: {
               importLoaders: 1,
               localIdentName: require('./themeable.config').generateScopedName({ env: 'development'}),
               modules: true
             }
          },
          'postcss-loader'
        ]
      }
    ],
  },

  devtool: 'cheap-module-source-map',

  devServer: {
    proxy: {
      '**': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        pathRewrite: { '^/api/v1' : '' }
      }
    },
    contentBase: path.join(__dirname, 'public')
  },
};
