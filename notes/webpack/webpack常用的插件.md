## webpack 常见的插件

- html-webpack-plugin
- clean-webpack-plugin
- extract-text-webpack-plugin 已过时，现在用mini-css-extract-plugin,使用时不能用cssModule
- copy-webpack-plugin

- uglifyJs-webpack-plugin
- happyPack
- compression-webpack-plugin
- optimize-css-assets-webpack-plugin

- D: speed-measure-webpack-plugin
- D: progress-bar-webpack-plugin
- D: webpack-dashboard
- D: webpack-deep-scope-analysis  

## 优化
- nano 对css 进行hint
- es6不用编译  cdn.polify.io
- manifestPlugin




### 基础知识
- lodash 和lodash-es区别
  + lodash-es可以结构引入，方便按需引入，减少boundle体积
  + lodash不可以结构，体积很大
- purgecss-webpack-plugin: css treeShaking


## 异同
- css-module  ： 在SPA中可以使用 ，
  + 使用方法： ‘css-loader?modules&localIdentName=[name]_[local]-[hash:base64:4]’
