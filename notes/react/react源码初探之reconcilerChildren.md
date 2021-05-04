# react源码初探 --- reconcelerChildrenArray



> reconcelerChildrenArray 是组件在更新的时候最核心的一个算法,它的功能是主要负责对子fiber的创建和更新的合集

### 算法流程如下
1. 以newIdx为基准,遍历newChildren 和 oldFiber对比,直到找到第一个不重复的 节点停止
2. 如果 newIdx === newChhldren.length ,return
3. 如果oldFiber === null , 把newChidren中剩余的child创建出来,并 return
4. 如果oldFiber !== null , 把oldFiber剩余的sibings全部存在existingChildrenMap中,
  遍历 newChildren 在Map中查找,有重复的直接使用,没有就创建一个新的Fiber
5. return resultingFirstChild  