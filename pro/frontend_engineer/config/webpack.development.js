const { join } = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const CopyPlugin = require("copy-webpack-plugin");
const setTitle = require("node-bash-title");
setTitle("🍻  开发环境运行");
// console.log('xxxxxxxxxxxxxxx',join(__dirname,"../","src/web/components"))
module.exports = {
  devServer: {
    contentBase: join(__dirname, "../dist"),
    hot: true,
    quiet: true,
    port: "3000"
  },
  plugins: [
    new CopyPlugin([
      {
        from: join(__dirname, "../", "src/web/views/layouts/layout.html"),
        to: "../views/layouts/layout.html"
      }
    ]),
    new CopyPlugin([
      {
        from: join(__dirname, "../", "src/web/components"),
        to: "../components",
        ignore: ["*.js", "*.css"]
      }
    ]),
    // new CopyPlugin([
    //   {
    //     from: join(__dirname,"../","src/web/components"),
    //     to: "../components"
    //   },{
    //     ignore:["*.js","*.css",]//谨记这种错误用法
    //   }
    // ]),

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
