const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: {
    background: ['./src/background'],
    popup: ['./src/index'],
  },
  output: {
    path: './chrome/dist',
    filename: '[name].js',
  },
  resolve: ['', '.js', '.json'],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules!postcss',
      },
    ],
  },
  postcss: [
    require('postcss-cssnext'),
    require('postcss-browser-reporter'),
  ],
  plugins: [
    new CleanWebpackPlugin(['chrome/dist']),
    new BundleAnalyzerPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],
}
