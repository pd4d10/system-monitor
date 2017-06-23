const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    background: './src/background',
    popup: './src/index',
  },
  output: {
    path: path.resolve('chrome/dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-modules')(),
                require('postcss-cssnext')(),
                require('postcss-browser-reporter')(),
              ]
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['chrome/dist']),
    new webpack.optimize.CommonsChunkPlugin('vendor'),
  ],
}
