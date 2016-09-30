import webpack from 'webpack'

export default {
  entry: {
    background: ['babel-polyfill', './src/background'],
    popup: ['babel-polyfill', './src/index'],
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
