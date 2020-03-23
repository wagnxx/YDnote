# react源码分析
> 由于内容较多，本章重点梳理渲染部分及setState中的轮廓部分，对于深层次的创建fiber root及其reconsider放在单独的章节讨论；需要声明的一点是，该部分内容分析主要是基于 v16.8.4
1. 先来看看代码执行流程
- 先render看起：
```
//先得有个实例
 ReactDOM.createRoot = createRoot;

 function createRoot(container, options) {
     // ...
  return new ReactRoot(container, true, hydrate);
}


// 最核心的 root来了
function ReactRoot(container, isConcurrent, hydrate) {
    // 这里是很重要的一点 createContainer可以生成 fiberRoot过来，这部分内容较多，放在单独的Fiber root章节单独说
  var root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}

// render部分
ReactRoot.prototype.render = function (children, callback) {
  var root = this._internalRoot;
  // work具体干啥先不管，等表面轮廓走完在深入
  var work = new ReactWork();
  updateContainer(children, root, null, work._onCommit);
  return work;
};

```
2. updateContainer，重要迎来了重要的这个方法，updateContainer在很多地方调用了

```
function updateContainer(element, container, parentComponent, callback) {
  var current$$1 = container.current;
  var currentTime = requestCurrentTime();
  var expirationTime = computeExpirationForFiber(currentTime, current$$1);
  return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback);
}

// 以上都是Fiber机reconsider部分的内容，略过
// 先粗略地看看 updateContainerAtExpirationTime 部分代码直接返回 ，也是scheduler部分，这里先可大概理解成它 就是更新核心，，一切更新，从react-dom开始到这里就不在是reactdom干的活了

scheduleRootUpdate(current$$1, element, expirationTime, callback);

```

3. 在探探setState怎么走的

```
// 从react的setState可以追到 this.updater.enqueueSetState,直到：

var classComponentUpdater = {
  isMounted: isMounted,
  enqueueSetState: function (inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, fiber);

    var update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      {
        warnOnInvalidCallback$1(callback, 'setState');
      }
      update.callback = callback;
    }

    debugger
    flushPassiveEffects();
    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
}




```
以上代码核心的是   enqueueUpdate(fiber, update)， scheduleWork(fiber, expirationTime)，他们属于Fiber和Schedule的内容，在这里分析会让人崩溃，Fiber章节统一对它们分别探究

 