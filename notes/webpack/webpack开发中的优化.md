# webpack在一线开发中优化

> 这章主要记录webpack在开发中的优化点,主要集中在线上部分,主要从几个插件说起,其具有什么功能

1. optimize-css-assets-webpack-plugin

```
 // 对css进行提取,cssnano压缩css,对空的css清空,错误的class进行校验
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]

```

2. optimization配置项

```
webpackConfig={
    optimizations:{
        cacheGroups:{
            ....
            runtime,common,async-common
        }
    }
}
//其中runtime是管理者角色,它包含webapck内部函数及模块化标准

```

3.webpack打包慢的解决方案
- 使用 speed-measure-webpack-plugin,对webapckconfig进行包裹,打包时候能够详细展示每个插件和loader所用的具体时间
- cache-loader 可以对其以后的loaders进行缓存,优化打包速度
- thread-loader 启用多线程计算,代替原先的happypack
- externals ,它是webpack的配置项,通过对cdn配置大大减小各种库的引用,从而减少bundle的文件体积
- webpack-bundle-analyzer或者webpack-jaris(比较老,但有清晰的统计）；二者都可以很好地展示各模块依赖关系和大小,只是前者对文件大小展示的不是很明显,后者补充了这点,当然如果上面的externals已经配置了就用不着配置这步了,因为平时大文件一般都是由于上一点没有配置引起的

4. contentHash
使用普通chunkhash时,只要一个文件改变,这个hash都会改变,不利于打包的性能；如果改用 contentHash的话每个文件有自己的hash,当其中一个文件的内容有所改变,不会影响其他文件的md5的改变

