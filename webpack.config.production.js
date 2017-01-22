const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const config = require('./webpack.config')

config.plugins = [
  new CleanWebpackPlugin(['chrome/dist']),
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
]

module.exports = config
