# webapck编译流程
### 这篇文章将用最少的语言，描述webpack从运行到输出的中颗粒流程

1. webpack-cli 作为 程序入口，处理 terminal参数，联通webpack，起到一个很好的桥梁作用，compiler.run便是真正的入口，同时基于回调函数的一般常识，compilerCallback将是程序的结束点，
```
    complier.run(compilerCallback)
    compilerCallback=()=>{
        stdout.write(`${statsString}\n${delimiter}`);
    }
```
2. 在瞅瞅compiler.run的主要做了啥，finalCallback和onCompiled两个回调供其他函数调用，先看看它们做了写啥
```

		const finalCallback = (err, stats) => {
			if (callback !== undefined) return callback(err, stats);
		};
 

		const onCompiled = (err, compilation) => {
			if (this.hooks.shouldEmit.call(compilation) === false) {
				this.hooks.done.callAsync(stats, err => {
					return finalCallback(null, stats);
				});
				return;
			}

			this.emitAssets(compilation, err => {
				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;
					this.hooks.done.callAsync(stats, err => {
						this.hooks.additionalPass.callAsync(err => {
							this.compile(onCompiled);
						});
					});
					return;
				}

				this.emitRecords(err => {
					this.hooks.done.callAsync(stats, err => {
						return finalCallback(null, stats);
					});
				});
			});
		};



```
经再三分析，onCompiled中内部不管中途出现深判断，最终都会执行到finalCallback，此时可以把以上代码再精简一下

```

		const finalCallback = (err, stats) => {
			 return callback(err, stats);
		};
 

		const onCompiled = (err, compilation) => {
				return finalCallback(null, stats);
		};



```
此时的callback其实就是compilerCallback，也就是说只要调用了Callback就是执行了  stdout.write(`${statsString}\n${delimiter}`) ，也代码编译完成

3. compile阶段，同样在run内部有个方法启动compile 
```

		this.hooks.beforeRun.callAsync(this, err => {
			this.hooks.run.callAsync(this, err => {
				this.readRecords(err => {
					this.compile(onCompiled);
				});
			});
		});

```
compile执行流程：
```

	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}

```

### 从以上代码可知，compile整个流程是：beforeRun->beforeCompile->compile,newCompilation(params)->make->compilation.finish->compilation.seal->afterCompile->onCompiled->finalCallback->compilerCallback->stdout.write(`${statsString}\n${delimiter}`)