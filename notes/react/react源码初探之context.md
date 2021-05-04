# react 源码 --- context

大家都知道 state 是为组件内部服务的,可以通过 prop 和子组件进行通信,但对应跨组件的通信却无能为力,或者说难度很大.context 的出现就是解决这个问题,它在 react 应用中主要提供一个"全局"的对象供子组件使用.实际上它并非一定是全局,不管是 legacy context 还是新的 contextProvider 都可以嵌套,每嵌套一个入栈一次,和函数执行栈一样,有当前的 excute context 即为当前的 context.

### legacy context

- 准备一个 valueStack 用来存储 context
- updateClassComponent 的时候 执行 pushContextProvider

```js
function pushContextProvider(workInProgress: Fiber): boolean {
  const instance = workInProgress.stateNode;
  // We push the context as early as possible to ensure stack integrity.
  // If the instance does not exist yet, we will push null at first,
  // and replace it on the stack later when invalidating the context.
  const memoizedMergedChildContext =
    (instance && instance.__reactInternalMemoizedMergedChildContext) ||
    emptyContextObject;

  // Remember the parent context so we can merge with it later.
  // Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.
  previousContext = contextStackCursor.current;
  push(contextStackCursor, memoizedMergedChildContext, workInProgress);
  push(
    didPerformWorkStackCursor,
    didPerformWorkStackCursor.current,
    workInProgress
  );

  return true;
}
```

- finishClassComponent 的时候执行 invalidateContextProvider

```js
if (hasContext) {
  invalidateContextProvider(workInProgress, Component, true);
}

function invalidateContextProvider(
  workInProgress: Fiber,
  type: any,
  didChange: boolean
): void {
  const instance = workInProgress.stateNode;
  if (didChange) {
    const mergedContext = processChildContext(
      workInProgress,
      type,
      previousContext
    );
    instance.__reactInternalMemoizedMergedChildContext = mergedContext;

    pop(didPerformWorkStackCursor, workInProgress);
    pop(contextStackCursor, workInProgress);
    // Now push the new context and mark that it has changed.
    push(contextStackCursor, mergedContext, workInProgress);
    push(didPerformWorkStackCursor, didChange, workInProgress);
  } else {
    pop(didPerformWorkStackCursor, workInProgress);
    push(didPerformWorkStackCursor, didChange, workInProgress);
  }
}
```

- completeUnitOfWork 的时候执行 pop,valueStack 又向上回退了

```js
    case ClassComponent: {
      const Component = workInProgress.type;
      if (isLegacyContextProvider(Component)) {
        popLegacyContext(workInProgress);
      }
      break;
    }
function popContext(fiber: Fiber): void {
  pop(didPerformWorkStackCursor, fiber);
  pop(contextStackCursor, fiber);
}

```

### new context

- updateProvider 时候 pushProvider,和 legacy 一样,只是去掉了对 didPerformUnitOfWorkStackCursor 的 push

```js
// 1)
export function pushProvider<T>(providerFiber: Fiber, nextValue: T): void {
  const context: ReactContext<T> = providerFiber.type._context;
  push(valueCursor, context._currentValue, providerFiber);
  context._currentValue = nextValue;
}
// 如果 有改变执行 propagateContextChange
// Match! Schedule an update on this fiber.判断条件是
if (
  dependency.context === context &&
  (dependency.observedBits & changedBits) !== 0
) {
  if (fiber.tag === ClassComponent) {
    const update = createUpdate(renderExpirationTime);
    update.tag = ForceUpdate;

    enqueueUpdate(fiber, update);
  }
  // 如果其他类型 tag 就 修改需要修改的 expirationTime,已经alternate的expirationTime和childExpirationTime
}
//
```

- updateContextConsumer ,该组件和 context 是相互引用的,所以只需 readContext 就行

```js
function readContext (){
  let contextItem = {
    context: ((context: any): ReactContext<mixed>),
    observedBits: resolvedObservedBits,
    next: null,
  };
  lastContextDependency = contextItem;
  currentlyRenderingFiber.contextDependencies = {
    first: contextItem,
    expirationTime: NoWork,
  };
  return context._currentValue

}
```
- completeUnitOfWork 的时候和legacy一样 pop