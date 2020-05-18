## 简介

该项目主要包含nodejs的多线程处理方案

### 多进程
在单核 CPU 系统之上我们采用 单进程 + 单线程 的模式来开发。在多核 CPU 系统之上，可以通过 child_process.fork 开启多个进程（Node.js 在 v0.8 版本之后新增了Cluster 来实现多进程架构） ，即 多进程 + 单线程 模式。注意：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。

1. Node.js 中的进程

 - process 模块
    Node.js 中的进程 Process 是一个全局对象，无需 require 直接使用，给我们提供了当前进程中的相关信息

    + process.env：环境变量，例如通过 process.env.NODE_ENV 获取不同环境项目配置信息
    + process.nextTick：Event loop相关的
    + process.pid：获取当前进程id
    + process.ppid：当前进程对应的父进程
    + process.cwd()：获取当前进程工作目录，
    + process.platform：获取当前进程运行的操作系统平台
    + process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
    + 进程事件：process.on(‘uncaughtException’, cb) 捕获异常信息、process.on(‘exit’, cb）进程推出监听
    + 三个标准流：process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出
    + process.title 指定进程名称，有的时候需要给进程指定一个名称
- 进程创建
    进程创建有多种方式,这里以child_process模块和cluster模块为主
    + child_process 是Nodejs的内置模块,内部有几个重要的函数:
```    
child_process.spawn()：适用于返回大量数据，例如图像处理，二进制数据处理。
child_process.exec()：适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
child_process.execFile()：类似 child_process.exec()，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
child_process.fork()： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统** CPU 核心数**设置。

```

```
// master process
const http = require('http');
const fork = require('child_process').fork;

const server = http.createServer((req, res) => {
  if (req.url == '/compute') {
    const compute = fork('./fork_compute.js');
    compute.send('开启一个子进程');
    compute.on('message', (sum) => {
      res.end(`sum is ${sum}`);
      compute.kill();
    });
    compute.on('close', (code, signal) => {
      console.log(`收到close事件,子进程收到信号${signal}而终止,退出码 ${code}`);
      compute.kill();
    });
  } else {
    res.end('ok');
  }
});

server.listen(3000, () => {
  console.log('server is stated over 3000 port');
});
// fork process 
const computation = () => {
    let sum = 0;
    console.info('计算开始');
    console.time('计算耗时');

 
    for (let i = 0; i < 1e10; i++) {
      sum += i;
    }
 
    console.info('计算结束');
    console.timeEnd('计算耗时');
    return sum;
}


process.on('message',msg => {
    console.log(msg,"process.pid",process.pid);
    const sum = computation();
    process.send(sum);
});
```


- cluster 模块
它内部是对 child_process的封装,应用代码如下:

```
const http = require('http');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
if (cluster.isMaster) {
  console.log('Master proces id is ', process.pid);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker process died ,id', worker.process.pid);
  });
} else {
  http
    .createServer(function (req, res) {
      res.writeHead(200);
      res.end('hello word');
    })
    .listen(8000);
}
```




### NodeJS 线程
Node中的核心是v8引擎,在Node启动后会创建v8实例,这个实例是多线程的,主要包含:
- 主线程:编译,执行代码
- 编译/优化线程: 在主线程执行的时候,可以优化代码
- 分析器线程:记录分析代码运行时间,为Crankshaft优化代码提供依据
- 垃圾回收的几个线程

1. 多线程的创建:
```js
const {
  isMainThread,
  parentPort,
  workerData,
  threadId,
  MessageChannel,
  MessagePort,
  Worker
} = require('worker_threads');

function mainThread() {
  for (let i = 0; i < 5; i++) {
    const worker = new Worker(__filename, { workerData: i });
    worker.on('exit', code => { console.log(`main: worker stopped with exit code ${code}`); });
    worker.on('message', msg => {
      console.log(`main: receive ${msg}`);
      worker.postMessage(msg + 1);
    });
  }
}

function workerThread() {
  console.log(`worker: workerDate ${workerData}`);
  parentPort.on('message', msg => {
    console.log(`worker: receive ${msg}`);
  }),
  parentPort.postMessage(workerData);
}

if (isMainThread) {
  mainThread();
} else {
  workerThread();
}


```

- worker_thread 模块的几个参数
    + isMainThread: 是否是主线程，源码中是通过 threadId === 0 进行判断的。
    + MessagePort: 用于线程之间的通信，继承自 EventEmitter。
    + MessageChannel: 用于创建异步、双向通信的通道实例。
    + threadId: 线程 ID。
    + Worker: 用于在主线程中创建子线程。第一个参数为 filename，表示子线程执行的入口。
    + parentPort: 在 worker 线程里是表示父进程的 MessagePort 类型的对象，在主线程里为 null
    + workerData: 用于在主进程中向子进程传递数据（data 副本）


### 多进程多线程的比较,以以下几个方面:

- 数据,多进程用IPC,数据分开同步简单,多线程中共享进程数据,数据共享简单,同步复杂,各有千秋
- CPU,内存:多进程占比较多,多线程对CPU利用率高,多线程较好
- 销毁,切换:多线程复杂且慢,选择多线程
- coding:多进程简单方便
- 可靠性:多进程中进程独立运行,不会相互影响
- 分布式:多进程中可用于多机多核分布式,易于扩展,多线程只能用于多核分布式,这一块多进程更胜一筹