# react源码初探之渲染流程(1)
> 由于内容较多，本章重点梳理渲染部分及setState中的轮廓部分，对于深层次的创建fiber root及其reconsider放在单独的章节讨论,即这篇文章的所谓的流程写到scheduler之前，后部分真正的渲染单独分个章节来谈；需要声明的一点是，该部分内容分析主要是基于 v16.8.4

### 从开头就对这篇做了限制，分析到scheduler之前，那么具体会做哪些部分呢，有以下目录会涉及：

- ReactDOM.reander
- setState/setProps 引起的update


### 分析目标给了，那接下来就干正事了

1. 先来看看代码执行流程
- 先render看起，看看经历了些什么呢：
```
//先找到render的入口

ReactDOM={
  ...
    render: function (element, container, callback) {
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
  },
}


function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {

  var root = container._reactRootContainer;
  // 判断container是否已经渲染过
  if (!root) {
    // Initial mount 在legacyCreateRootFromDOMContainer中会实例化reactRoot，这里的root 其实就是 reactRoot
    // reactRoot有哪些特点呢,
    //  reactRoot._internalRoot = fiberRoot;

    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    if (typeof callback === 'function') {
      var originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    unbatchedUpdates(function () {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
      } else {
        root.render(children, callback);
      }
    });
  } else {
    if (typeof callback === 'function') {
      var _originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(root._internalRoot);
        _originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
}

// 从legacyRenderSubtreeIntoContainer方法中可以看的出来，最终要么执行root.render,要么执行 root.legacy_renderSubtreeIntoContainer






 

// 在以上代码legacyCreateRootFromDOMContainer内初始化了ReactRoot，看看ReactRoot内部什么结构

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

 
//  updateContainer，重要迎来了重要的这个方法，updateContainer在很多地方调用了，先看看它是如何工作的
 
function updateContainer(element, container, parentComponent, callback) {
  var current$$1 = container.current;
  var currentTime = requestCurrentTime();
  var expirationTime = computeExpirationForFiber(currentTime, current$$1);
  return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback);
}

 
 // 在updateContainerAtExpirationTime内执行 scheduleRootUpdate(current$$1, element, expirationTime, callback);看看scheduleRootUpdate做了哪些主要事

function scheduleRootUpdate(current$$1, element, expirationTime, callback) {

  var update = createUpdate(expirationTime);
  update.payload = { element: element };

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    update.callback = callback;
  }

  flushPassiveEffects();
  enqueueUpdate(current$$1, update);
  scheduleWork(current$$1, expirationTime);

  return expirationTime;
}
// 在scheduleRootUpdate中执行了以下几件事
// 1. 创建update
// 2. 配置update属性 payload及Callback，加入 updateQueue 队列中，等待被调用，其中这里的Callback是work._onCommit
// 3. scheduleWork 启动，即将会计入单独的包scheduler中去，它和react没有耦合性，单独去分析

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
~~ 以上代码核心的是   enqueueUpdate(fiber, update)， scheduleWork(fiber, expirationTime)，他们属于Fiber和Schedule的内容，在这里分析会让人崩溃，Fiber章节统一对它们分别探究 ~~

### 总结

从以上render和setState这两部分的运行流程可以看出，不管是哪个都会到达scheduleWork，它也是reactDOM和scheduler的缓存地带。时隔多日再看它的流程其实react在这一块做的挺清晰的，可读性和语义化也很明白，只是当初读的时候自己本身基础不大好，对react的了解其实也有限导致每往下走一步都感觉充满了未知和茫然。深处茫然多听听看看别人是怎么理解的这对自己有很大的帮助，读完别人的观点后再从头走走，多几次经历一定会豁然开朗

 