# react源码初探之渲染流程(1)
> 由于内容较多，本小节主要内容是scheduleWork阶段的requestWork，走到scheduler.unstable_scheduleCallback之前

 ### 本小节主要任务以下几点：

- scheduleWork
- requestWork,addRootToSchedule
- performSyncWork / scheduler.unstable_scheduleCallback


### 流程走起

1. scheduleWork
```
function scheduleWork(fiber, expirationTime) {
  // scheduleWorkToRoot所做的事有：
  // 找到当前Fiber的 root
  // 给更新节点的父节点链上的每个节点的expirationTime设置为这个update的expirationTime，除非他本身时间要小于expirationTime
  // 给更新节点的父节点链上的每个节点的childExpirationTime设置为这个update的expirationTime，除非他本身时间要小于expirationTime
  var root = scheduleWorkToRoot(fiber, expirationTime);
  if (root === null) {
    return;
  }

  if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime > nextRenderExpirationTime) {
    // This is an interruption. (Used for performance tracking.)
    interruptedBy = fiber;
    resetStack();
  }
  markPendingPriorityLevel(root, expirationTime);

  // isWorking代表是否正在工作，在开始renderRoot和commitRoot的时候会设置为 true，也就是在render和commit两个阶段都会为true
  // nextRenderExpirationTime在是新的renderRoot的时候会被设置为当前任务的expirationTime，而且一旦他被，只有当下次任务是NoWork的时候他才会被再次设置为NoWork，当然最开始也是NoWork
  if (
  // If we're in the render phase, we don't need to schedule this root
  // for an update, because we'll do it before we exit...
  !isWorking || isCommitting$1 ||
  // ...unless this is a different root than the one we're rendering.
  nextRoot !== root) {
    var rootExpirationTime = root.expirationTime;
    requestWork(root, rootExpirationTime);
  }
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    // Reset this back to zero so subsequent updates don't throw.
    nestedUpdateCount = 0;
    invariant(false, 'Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.');
  }
}



```

2. requestWork

```
// requestWork is called by the scheduler whenever a root receives an update.
// It's up to the renderer to call renderRoot at some point in the future.
function requestWork(root, expirationTime) {
  // 把当前的fiberRoot加入到调度链表中
  addRootToSchedule(root, expirationTime);
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root;
      nextFlushedExpirationTime = Sync;
      performWorkOnRoot(root, Sync, false);
    }
    return;
  }

  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }
}

```
3. scheduleCallbackWithExpirationTime,整个阶段做好对时间的处理，直接进入下一个阶段unstable_scheduleCallback

```
function scheduleCallbackWithExpirationTime(root, expirationTime) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime < callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        scheduler.unstable_cancelCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;
  var currentMs = scheduler.unstable_now() - originalStartTimeMs;
  var expirationTimeMs = expirationTimeToMs(expirationTime);
  var timeout = expirationTimeMs - currentMs;
  callbackID = scheduler.unstable_scheduleCallback(performAsyncWork, { timeout: timeout });
}


```