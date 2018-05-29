const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./webpack.config.base')

const getFilePath = file => {
  return path.resolve('./src', file)
}

const withoutExt = file => {
  return file
    .split('.')
    .slice(0, -1)
    .join('.')
}

let manifest

if (fs.existsSync(getFilePath('manifest.json'))) {
  manifest = require(getFilePath('manifest.json'))
} else if (fs.existsSync(getFilePath('manifest.js'))) {
  manifest = require(getFilePath('manifest.js'))()
} else {
  throw new Error('Please provide manifest.json or js file')
}

// Add entries
config.entry = {}

// Background scripts
manifest.background.scripts.forEach(script => {
  config.entry[withoutExt(script)] = getFilePath(script)
})

const checkHtml = html => {
  const base = withoutExt(html)
  const js = getFilePath(base + '.js')
  const index = getFilePath(base + '/index.js')

  if (fs.existsSync(getFilePath(html))) {
  } else if (fs.existsSync(js)) {
    config.entry[base] = js
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: html,
        chunks: [base],
      }),
    )
  } else if (fs.existsSync(index)) {
    config.entry[base] = index
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: html,
        chunks: [base],
      }),
    )
  } else {
    throw new Error(`Please provide ${html}, ${js} or ${index}`)
  }
}

// BrowserAction popup
if (manifest.browser_action && manifest.browser_action.default_popup) {
  checkHtml(manifest.browser_action.default_popup)
}

// Options page
if (manifest.options_ui && manifest.options_ui.page) {
  checkHtml(manifest.options_ui.page)
}

config.mode = 'development'
config.watch = true
config.devtool = 'cheap-source-map'

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err)
  }
  // Done processing
})
