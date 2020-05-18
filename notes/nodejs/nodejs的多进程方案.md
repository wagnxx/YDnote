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