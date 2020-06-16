const devconfig = require('./config/webpack.dev');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

const config = {
  output: {
    path: path.join(__dirname, "./dist"),
    publicPath:'/',
    filename: "scripts/[name].bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
  })
  ]
};
module.exports = ({ mode, mock }) => merge(config, devconfig({ mode, mock }));
