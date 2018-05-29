const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const OUTPUT_FOLDER = 'public'

module.exports = {
  output: {
    path: path.resolve(OUTPUT_FOLDER),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(OUTPUT_FOLDER),
    new CopyWebpackPlugin(
      [{ from: 'src/static', to: 'static' }, { from: 'src/manifest.json', to: '' }],
      {},
    ),
  ],
}
