# react源码初探之渲染流程 汇总

此刻心血来潮,总感觉之前的流程所谓分析过于幼稚,虽然看起来没有问题,但读了好多天的源码现在回过头来看看之前自己的总结,令人哭笑不得,本该删掉它们,但想想一知半解的之前对各种问题盲目推敲的某一刻的苦逼的眼神又不忍心.就姑且留着它们吧,我争取在这里以最简介的语言,少代码的方式把react更新的流程窜一边,不涉及 context,ref等;

开始吧!

站在生命周期的角度看,react的更新有两种方式,一种是 mount,一种是 update,这两种方式都会触发scheduleWork;
站在代码文件夹的角度,react分为 reconciler 和 scheduler;
站在数据类型的角度,react 在围绕这 fiber 转动;
通常以生命周期的顺序进行分析更容易让人接受,那就从 scheduleWork开始吧

1. scheduleWork
  - 主要执行scheduleWorkToRoot,更新sourceFiber的expirationTime 已经父fiber的chilExpirationTime
  - requestWork,主要执行addRootToSchedule,分同步或者异步分别执行到performWork

2. performWork,遍历rootSchedule链表,假设这里只有一个 fiberRoot,直接进入 performWorkOnRoot  

3. performWorkOnRoot,主要有两大任务,renderRoot 和 commit,
  - finishedWork 存在就 commit,否则 renderRoot

4. renderRoot,该方法主要是tryCatch workLoop,分两种情况
  - 有catch throw,若是 suspense组件throw的值则调用 throwException
  - 正常情况 就on ready commit,即 给finishedWork赋值,进入 commit 阶段

5. workLoop,主要执行 nextUnitWork = perFormUnitOfWork();
  - performUnitOfWork 中主要有beginwork对fiber进行更新或创建,添加effectTag 和 completeUnitOfWork 对 EffectTagList进行归并
  - 其中更新阶段对于class组件 可能会执行 getDerivedStateFromProps,(class生命周期章节细说)
  - 当nextUnitOfWork为null的时候 退出 workLoop 进入renderRoot里后半段的操作

6. commit阶段,找到root的effectList的firstEffect,依次分别执行三个方法:
  - commitMutationBeforeUpdate
    + class组件执行 getSnapshotBeforeUpdate, function组件执行 commitHookEffectList(UnmountSnapshot, NoHookEffect, finishedWork),即执行 destroy();
  - commitAllHostEffect
    + placement,update,deletion 对应的操作,并取消 EffectTag
  - commitAllLifeCycle
    + class组件执行didMount/didUpdate  
    + 执行 commitUpdateQueue