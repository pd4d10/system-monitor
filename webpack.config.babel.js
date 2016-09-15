import webpack from 'webpack'

export default {
  entry: ['./src'],
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
}
