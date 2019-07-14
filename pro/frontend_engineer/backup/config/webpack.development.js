const { join } = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const setTitle = require("node-bash-title");
setTitle("🍻  开发环境运行");
module.exports = {
  devServer: {
    contentBase: join(__dirname, "../dist"),
    hot: true,
    quiet: true,
    port:'3000'
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ["You application is running here http://localhost:3000"],
        notes: [
          "Some additionnal notes to be displayed unpon successful compilation"
        ]
      },
      onErrors: function(severity, errors) {
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warning'
        new WebpackBuildNotifierPlugin({
          title: "错误提示" + errors.name,
          //   logo: path.resolve("./img/favicon.png"),
          suppressSuccess: true
        });
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: "my project webpack build",
      //   logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    })
  ]
};
