# Tapable的原理

tapable基于发布订阅形成自己的一套事件监听机制，同时它也有自己的一套生命周期，通过hooks实现，webpack基于这一点构建出一套庞杂的前端打包优化系统。

先了解下基本的hooks是怎么使用的：
```
const {
  SyncHook
} = require('tapable');

let run = new SyncHook(['compilation']);

run.tap('observer1', function (comp) {
  console.log(comp);
});
 
run.call('webpacl');

// log如下

webpacl




```
### 从以上代码可知，每个hooks实例都是一个发布者，它控制消息的接收和中转，而订阅者也可以通过 hooks.tap方法即可订阅成功，执行call方法就可以让他运行，那接下来基于以上代码的参数深入的Tapable中分析下它的源码：

- 实例化SyncHooks阶段,进入该文件，发现SyncHooks继承自Hook，且没有构造函数，所以，初始化就得去Hooks文件了
```
//SyncHooks文件
const factory = new SyncHookCodeFactory();

class SyncHook extends Hook {
	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncHook");
	}

	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}

// hooks文件
class Hook {
	constructor(args) {
		if (!Array.isArray(args)) args = [];
		this._args = args;
		this.taps = [];
		this.interceptors = [];
		this.call = this._call;
		this.promise = this._promise;
		this.callAsync = this._callAsync;
		this._x = undefined;
	}

}


// new SyncHook(['compilation']) 中我们传入的是 compilation，那么 此时我仅仅做了 ,初始化已完成

this._args = ['compilation'];

```

- 完成了初始化，接下来订阅者来开始注册

```

	tap(options, fn) {
		if (typeof options === "string") options = { name: options };
		if (typeof options !== "object" || options === null)
			throw new Error(
				"Invalid arguments to tap(options: Object, fn: function)"
			);
		options = Object.assign({ type: "sync", fn: fn }, options);
		if (typeof options.name !== "string" || options.name === "")
			throw new Error("Missing name for tap");
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}


```
     此时我们的 options={name:'observer1',fn:callback},去_runRegisterInterceptors方法，发现我们并没有interceptor，所以我们的options没有改变，

```
	_runRegisterInterceptors(options) {
		for (const interceptor of this.interceptors) {
			if (interceptor.register) {
				const newOptions = interceptor.register(options);
				if (newOptions !== undefined) options = newOptions;
			}
		}
		return options;
	}

```

继续去_insert方法看看发生了什么？

```
	_insert(item) {
		this._resetCompilation();
		let before;
		if (typeof item.before === "string") before = new Set([item.before]);
		else if (Array.isArray(item.before)) {
			before = new Set(item.before);
		}
		let stage = 0;
		if (typeof item.stage === "number") stage = item.stage;
		let i = this.taps.length;
		while (i > 0) {
			i--;
			const x = this.taps[i];
			this.taps[i + 1] = x;
			const xStage = x.stage || 0;
			if (before) {
				if (before.has(x.name)) {
					before.delete(x.name);
					continue;
				}
				if (before.size > 0) {
					continue;
				}
			}
			if (xStage > stage) {
				continue;
			}
			i++;
			break;
		}
		this.taps[i] = item;
	}


```
我们的options里并没有before，所以，代码可以精简为

```
	_insert(item) {
		this._resetCompilation();
		this.taps[i] = item;
	}


    _resetCompilation() {
		this.call = this._call;
		this.callAsync = this._callAsync;
		this.promise = this._promise;
	}

 // 从以上精简代码可以推出当前 this.taps[0] = options,即:
    this.taps=[
        {name:'observer1',fn:callback}
    ]
```


- 注册已经完成，接下来看看派发阶段如何执行call的

```
// hooks.js
    // prototype:
	_call: {
		value: createCompileDelegate("call", "sync"),
		configurable: true,
		writable: true
	}


    function createCompileDelegate(name, type) {
        return function lazyCompileHook(...args) {
            this[name] = this._createCall(type);
            return this[name](...args);
        };
    }


```
run.call('webpack') 的参数带入便知：

```
// 设定这一步返回结果是 runCall
let runCall = createCompileDelegate("call", "sync")('webpack');
            =>('webpack)=>{
                this['call']=this.createCall(type);
                //假设createCall的执行结果为 fn1 
                return this.call('webpack')
            }


// 看看身子的_createCall做了啥

	_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}


// 不难看出我们fn1为compile：

    fn1=this.compile({
			taps:[{name:'observer1',fn:callback}],
			interceptors: this.interceptors,
			args: ['compilation'],
			type: 'sync'
		});

//综上，可得出 runCall

    runCall=fn1('webpack')
           =this.compile({
			taps:[{name:'observer1',fn:callback}],
			interceptors: this.interceptors,
			args: ['compilation'],
			type: 'sync'
		})('webapck');

// 看看compile具体代码，hooks中的是抽象类，实现应该在SyncHooks中

	compile(options) {
		throw new Error("Abstract: should be overriden");
	}


    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }

// 先记 compileFn=factory.create(options), 那么

    runCall = factory.create(options)('webpack');
            =compileFn('webpac)

//先求 compileFn



```
求compileFn的过程，去hooks文件找答案

```
	create(options) {
		this.init(options);
		let fn;
		switch (this.options.type) {
			case "sync":
				fn = new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.content({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true
						})
				);
        }
        return fn;
    }


    cumpileFn=new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.content({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true，
						})
				);
            = function(...args){
                this.header();
                this.content({
                    onResult: result => result，
                    rethrowIfPossible: true，
                    resultReturns: true,
                })
            }

//header没用用到，直接进入this.content瞅瞅

class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}


// 推出cumpileFn为：
cumpileFn = function(...args){
                this.header();
                this.content({
                    onResult: result => result，
                    rethrowIfPossible: true，
                    resultReturns: true,
                })
            }

            = function(...args){
                this.callTapsSeries({
                    onError: (i, err) => onError(err),
                    onDone,
                    rethrowIfPossible
                });
            }


// 进入最主要的函数

	callTapsSeries({
		onError,
		onResult,
		resultReturns,
		onDone,
		doneReturns,
		rethrowIfPossible
	}) {

	const somethingReturns = resultReturns || doneReturns || false; // resultReturns=true
		let code = "";
		let current = onDone; // onDone=() => ""
		for (let j = this.options.taps.length - 1; j >= 0; j--) { // taps.length=1;
			const i = j;
			const unroll = current !== onDone && this.options.taps[i].type !== "sync"; // 
			if (unroll) {
				code += `function _next${i}() {\n`;
				code += current(); // => ''
				code += `}\n`;
				current = () => `${somethingReturns ? "return " : ""}_next${i}();\n`; // somethingReturns =true 所以此时后面代码不在执行
			}
			const done = current;
			const doneBreak = skipDone => {
				if (skipDone) return "";
				return onDone();
			};
			const content = this.callTap(i, {
				onError: error => onError(i, error, done, doneBreak),
				onResult:
					onResult &&
					(result => {
						return onResult(i, result, done, doneBreak);
					}),
				onDone: !onResult && done,
				rethrowIfPossible:
					rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
			});
			current = () => content;
		}
		code += current();
		return code;

    }

```

callTapsSeries代码可以精简为下：

```

	callTapsSeries({
		onError,
		onResult,
		resultReturns,
		onDone,
		doneReturns,
		rethrowIfPossible
	}) {

	const somethingReturns = resultReturns || doneReturns || false; // resultReturns=true
		let code = "";
		let current = onDone; // onDone=() => ""
		for (let j = this.options.taps.length - 1; j >= 0; j--) { // taps.length=1;
			const i = j;
			const unroll = current !== onDone && this.options.taps[i].type !== "sync"; // 

            if(unroll){
                function _next0(){
                    current();
                }

                current=()=>{
                    if(somethingReturns) return;
                    _next0()
                }
            }


            const done = current;
            const doneBreak = skipDone => {
                if (skipDone) return "";
                return onDone();
            };
            const content = this.callTap(i, {
                onResult:
                    onResult &&
                    (result => {
                        return onResult(i, result, done, doneBreak);
                    }),
              
            });
            current = () => content;
            }

            current();
            return code;



		}


    }


// callTap

	callTap(tapIndex, { onError, onResult, onDone, rethrowIfPossible }) {


        code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
		const tap = this.options.taps[tapIndex];

        code += `var _result${tapIndex} = _fn${tapIndex}(${this.args({
            before: tap.context ? "_context" : undefined
        })});\n`;

        onResult(`_result${tapIndex}`);
    }


    callTap=()=>{

         _result[0]=callback(...args)
         onResult(`_result${tapIndex}`);
    }
 
//由一下已知的taps可以推出：

  this.taps=[
        {name:'observer1',fn:callback}
    ]


compileFn=
            = function(...args){
                 _result[0]=callback(...args)
                onResult(`_result${tapIndex}`);
            }
       
 runCall = factory.create(options)('webpack');
            =compileFn('webpack')
            =>{
                _result[0]=callback('webpack')
                onResult(`_result${tapIndex}`); // onResult=result=>result;
            }
            ={
                 _result[0]=callback('webpack') // log:  webpack
                onResult(undefined)
            }

        #所以 log为：

            
```



### 其实hooks都大同小异，针对不同hooks的作用大概归纳如下

- SyncHook, 同步串行，不关心返回值
- SyncBailHook, 同步串行，监听函数中有一个返回值不为null，跳过剩下的逻辑
- SyncWaterfallHook,同步串行，上个函数的返回值可以传给下个
- SyncLoopHook, 同步循环，当函数返回true返回执行
- AsyncParallelHook,异步并行，不关心返回值
- AsyncParallelBailHook,异步串行，返回值不为null忽略掉后面的监听函数
- AsyncSeriesHook, 异步串行，不关心Callback参数
- AsyncSeriesBailHook,异步串行。。。
- AsyncSeriesWaterfallHook,异步串行。。。。