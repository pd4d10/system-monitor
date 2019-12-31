const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.config')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  ...config,
  mode: 'production',
  watch: false,
  devtool: false,
  plugins: [...config.plugins, new BundleAnalyzerPlugin()],
}
