const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlAfterPlugin = require('./config/htmlAfterPlugin');
const argv = require('yargs-parser')(process.argv.slice(2));
 

const _mode = argv.mode|| 'development';
const _module=argv.modules||"nomodule"

// console.log('用户的参数',argv.modules);
// console.log('module文件路径：',`./config/webpack.${_module}.js`)
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _mergeModuleConfig = require(`./config/webpack.${_module}.js`);
const merge = require('webpack-merge');

const  webpackConfig={
    // entry:'./src/222.js',
    plugins:[
        new HtmlWebpackPlugin({
            template:_module=='nomodule'?`src/index.html`:`dist/index.html`,
            filename:'index.html'
        }),
        new HtmlAfterPlugin({
            isHack:true
        }),
    ]
};




module.exports=merge(webpackConfig,_mergeModuleConfig,_mergeConfig);