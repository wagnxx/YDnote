
# react16+的调度流程和渲染流程


> 随着v16.8的到来，react对核心的调度层面做了彻底的修改，的的确确颠覆了往日的认知，既然是重写说明它有自己的优点和优势，也值得我们去研究它的价值。另外react本部分的笔记都是基于以下两个流程图的内容

### 目录说明
- react源码初探之渲染流程(1) ，render和setState部分，走到scheduleWork阶段
- react源码初探之渲染流程(2) ，scheduleWork阶段的requestWork，走到scheduler.unstable_scheduleCallback
- react源码初探之渲染流程(3) ，scheduler.unstable_scheduleCallback阶段 
- react源码初探之渲染流程(4) ，scheduler.unstable_scheduleCallback中触发Callback，即performWorkAsync
- react源码初探之渲染流程(5) ，commit阶段

- react源码分析-各模块分解 ，对整个流程的大回顾







### 调度流程
![avatar](./images/scheduler-fiber-scheduler.png)
### 渲染流程
![avatar](./images/scheduler-render-root.png)