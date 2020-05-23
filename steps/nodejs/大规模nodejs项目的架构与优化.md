## 异步io的好处
- 前端通过异步处理ui堵塞
- i/o 是昂贵的，分布式i/o更是昂贵的。
- nodejs适用于io密集型，不适合cpu密集型。
## 一些底层知识
> 操作系统对计算机进行抽象，将所有输入输出设备抽象为文件。内核在进行文件i/o操作时，通过文件描述符进行管理。应用程序如果要进IO需要打开文件描述符，再进行数据和文件的读写。异步i/o不带数据直接返回，要获取数据还需要通过文件描述符再次读取。

## node对异步io的实现
> 完美的异步io应该是应用程序发起非堵塞调用，无需通过遍历或者事件循环等方式轮询。

```
                the nodejs system
                | |
                | |
    application -->v8
                | |
                | |
                os operation  (nodejs bindings---node api)
                | |
                | |s
    libuv     event queue
                | |
                | |
                event loop
                | |
                | |
                worker thereads

```

## nodejs几个特殊api
> setTimeout,setInterval,promise,process.nextTick,