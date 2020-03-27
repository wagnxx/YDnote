# react 源码分析

react源码很多，也很复杂，需要分成不同模块逐一分析才能看明白，大概先以下几个方面展开分析
- render，该部分比较简单，已经分析过，主要创建FiberRoot和RootFIber
- FiberRoot和Fiber
- update和updateQueue
- scheduleWork
- requestWork
- batchUpdate
- React Scheduler
- performWork
- renderRoot

### 1.FiberRoot和Fiber
#### FiberRoot
- 初始化ReactRoot时便完成了FiberRoot的创建
```
function ReactRoot(container, isConcurrent, hydrate) {
  var root = createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
  
}

function createContainer(containerInfo, isConcurrent, hydrate) {
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}


```
- FiberRoot比较重要的字段

```
fiberRoot:FiberRoot{
    containerInfo,
    current,//树顶点
    nextExpirationtimeToWork,
    expirationTime
}


```

#### Fiber

Fiber对象是FiberTree的一员，先了解它的功能，创建的具体流程在后面深入了在设计
- 每一个ReactElement对象对应一个Fiber
- 记录节点的各种状态
- 串联整个应用形成树形结构
- 只有当Fiber中的数据更新了，组件才会更新state
- Fiber的数据结构：
```
fiber:Fiber{
    return,//父节点
    child,//第一个子节点
    sibling//兄弟节点
}

```



### 2.update和updateQueue
#### update，用于记录组件状态的改变，存在updateQueue中，可以同时存在多个update

```
function scheduleRootUpdate(current$$1, element, expirationTime, callback) {
 
  var update = createUpdate(expirationTime);
 

  flushPassiveEffects();
  enqueueUpdate(current$$1, update);
  scheduleWork(current$$1, expirationTime);

  return expirationTime;
}

 
function createUpdate(expirationTime) {
  return {
    expirationTime: expirationTime,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
    nextEffect: null
  };
}


```
#### 其中字段tag存在四种情况，updateState,replaceState,forceUpdateState,captuarUpdateSate(很重要，可以捕获异常传给组件)

#### enqueueUpdate阶段创建updateQueue，并且有更新操作
# 后续还会继续分析。。。