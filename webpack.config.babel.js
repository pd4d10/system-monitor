import webpack from 'webpack'

export default {
  entry: [
    // 'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src',
  ],
  output: {
    path: './chrome/dist',
    filename: 'popup.js',
  },
  resolve: ['', '.js', '.json'],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      { test: /\.css$/, loader: 'style!css?modules!postcss' }
    ],
  },
  postcss: [
    require('postcss-cssnext'),
    require('postcss-browser-reporter'),
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
}
