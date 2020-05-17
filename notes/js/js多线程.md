## js 的多线程

### worker

由于 js 是单线程,在有大量计算的需求会导致 UI 主线程的阻塞,不得不想办法,通过 worker 开辟一个
新的线程来帮忙处理,基本用法如下例子:

```js
// 主线程所在的页面
console.log('估计开始启动worker了!!!!');

const task = new Worker('./js/thread/task.js');
task.onmessage = function (event) {
  console.log('计算完毕');
  console.log(event.data);
};
console.log('worker注册完毕,准备接受数据咯~~~~');

// task.js

while (count < 1020) {
  count += 9;
  if (count > 1000) {
    postMessage('count 到1000,' + count);
  } else {
    // postMessage('小于1000了,count:' + count);
  }
}
```
