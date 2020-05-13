# namespace 简介

### 这部分主要包含 localforage 和 basketJS 的缓存方案，他们两个可以一起使用，他们都是利用了前端本地存储功能实现，但他们也有各自的特点：

- localforage 主要是将代码中的数据存到 localstorage 或者 WEBSQL，INdexDB 中，它帮大家实现了一套数据存取兼容的方案

- basketJS 主要是加载js脚本，并把他存到 localstorage上，主要是为了更精准控制缓存，防止不必要的重新请求js脚本，提升网站加载速度

```js
basket.require({ url: 'missing.js' }).then(
  function () {
    // Success
  },
  function (error) {
    // There was an error fetching the script
    console.log(error);
  }
);

basket.require({ url: 'jquery.js' }).then(function () {
  basket.require({ url: 'jquery-ui.js' });
});

// 参数包含以下信息
{
"url":"helloworld.js?basket-unique=123",
"unique":"123",
"execute":true,
"key":"helloworld.js",
"data":"alert('hello world');",
"originalType":"application/javascript",
"type":"application/javascript",
"skipCache":false,
"stamp":1459606005108,
"expire":1477606005108
}
```


### quickLink 也是很关键的技术，它能提前加载可见范围的资源，为页面秒开性能起到核心作用

```
// 如果不设置，默认为 document。
const elem = document.getElementById('carousel');
quicklink({
  el: elem
});

```

### basketJS和quickLink在做稍大一点实战项目时加入，目前的小项目加入也没有明显的感觉，当然主要原因是他们使用起来是比较简单的，当下不深入并不影响将来突然使用能否顺利进行。