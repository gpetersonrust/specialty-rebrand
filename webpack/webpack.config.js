const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
 
const { MODE, dynamic_hash } = require('./library/constants/global');

let hash = dynamic_hash.dynamic;

module.exports = {
  mode: MODE,
  entry: {
    app: path.resolve(__dirname, 'src', 'app', 'js', 'app.js'),
    ['relationships-builders']: path.resolve(__dirname, 'src', 'app', 'js', 'app.js'),
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname.replace('webpack', ''), 'dist'),
    filename: ({ chunk: name }) => {
      return name === 'main'
        ? `[name]${hash}.js`
        : `[name]/[name]${hash}.js`;
    },
    clean: true,
     
  },
  watchOptions: {
    ignored: /dist/, // 🚀 Prevents Webpack from watching its own output
    aggregateTimeout: 300, // Delay rebuilds to avoid excessive triggers
    poll: 1000, // Lower CPU usage
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MODE === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: ({ chunk: { name } }) => {
        return name === 'main'
          ? `[name]${hash}.css`
          : `[name]/[name]${hash}.css`;
      },
    }),
 
  ],
  
  devtool: 'source-map',
};
