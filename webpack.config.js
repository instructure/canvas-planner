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
        loader: 'babel-loader',
      },
    ],
  },

  devtool: 'cheap-module-source-map',

  devServer: {
    proxy: {
      '/v1/api/': 'http://localhost:3004',
    },
    contentBase: path.join(__dirname, 'public'),
    // hot: true
  },
};
