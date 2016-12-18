const webpack = require('webpack')
const config = require('./webpack.config')

config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
}))

module.exports = config
