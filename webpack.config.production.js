const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const config = require('./webpack.config')

config.plugins = [
  new CleanWebpackPlugin(['chrome/dist']),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new BundleAnalyzerPlugin(),
]

module.exports = config
