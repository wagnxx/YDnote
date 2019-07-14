const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlAfterPlugin = require("./config/htmlAfterPlugin");
const argv = require("yargs-parser")(process.argv.slice(2));
const { join } = require("path");
const _mode = argv.mode || "development";


const merge = require("webpack-merge");
const glob = require("glob");
//寻找entry
const files = glob.sync("./src/web/views/**/*.entry.js");
let _entry = {};
let _plugins = [];
 
for (item of files) {
  if (/.+\/([\w]+-[\w]+)(\.entry\.js)/.test(item) == true) {
    const entryKey = RegExp.$1;
    const [dist, template] = entryKey.split("-");
    _entry[entryKey] = item;

    _plugins.push(
      (new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template: `src/web/views/${dist}/pages/${template}.html`,
        inject: false,
        chunks: [entryKey]
      }))
    );
  }
}
console.table(_entry)
 
// console.log("_e_plugins xxxxry xxxxxxx",_plugins)

const webpackConfig = {
  // entry:'./src/222.js',
  entry: _entry,
  output: {
    path: join(__dirname, "./dist/assets"),
    publicPath:'/',
    filename: "scripts/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    ..._plugins,

    // new HtmlWebpackPlugin({
    //     template:_module=='nomodule'?`src/index.html`:`dist/index.html`,
    //     filename:'index.html'u
    // }),
    // new HtmlWebpackPlugin({
    //     template:`src/index.html`,
    //     filename:'index.html'
    // }),
    new HtmlAfterPlugin({
      isHack: true
    })
  ]
};
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
module.exports = merge(webpackConfig, _mergeConfig);
