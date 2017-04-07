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
              cacheDirectory: process.env.NODE_ENV === 'production' ? false : '.babel-cache'
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
              cacheDirectory: process.env.NODE_ENV === 'production' ? false : '.babel-cache'
            }
          },
          'instructure-ui/webpack/loaders/themeable-css-loader',
          {
            loader: 'css-loader',
            options: {
               discardComments: true,
               discardEmpty: true,
               discardUnused: true,
               importLoaders: 1,
               localIdentName: require('./themeable.config').generateScopedName({ env: process.env.NODE_ENV }),
               minimize: process.env.NODE_ENV === 'production',
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
    contentBase: path.join(__dirname, 'public'),
    // hot: true
  },
};
