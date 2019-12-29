const webpack = require('webpack')
const merge = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.config')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(config, {
  mode: 'production',
  watch: false,
  devtool: false,
  plugins: [new BundleAnalyzerPlugin()],
})
