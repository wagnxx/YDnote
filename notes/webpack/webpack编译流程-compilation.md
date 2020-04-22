# webpack编译流程-compilation

> compilation所处的阶段是最核心的一个阶段，这时处理从addEntry到seal的每一步

### 先把compilation前后的流程排出来
- new Compilation
- compiler.hooks.make , compilation.addEntry
- compilation._addModuleChain(options,succeedEntryCallback)
- moduleFactory.create
- buildModule -> module.build
- build -> dobuild ->runLoaders ->this._ast =webapckAST
- compilation.hooks.succeedModule.call(module);
- compilation.finish,compilation.seal
- afterSeal 
- afterCompile
- onCompiled ,done,finallyCallback
### 对每一步详细深入
- new Compilation，实例化compilation的同时做了很多事
```
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);

    // 以上简单的两句代码，却暗地里执行了很多事，比如

    	compiler.hooks.thisCompilation.tap("CachePlugin", compilation => {
					compilation.cache = cache;
					compilation.hooks.childCompiler.tap(
						"CachePlugin"，)
        })


        compiler.hooks.compilation.tap(
            "SingleEntryPlugin",
            (compilation, { normalModuleFactory }) => {
                compilation.dependencyFactories.set(
                    SingleEntryDependency,
                    normalModuleFactory
                );
            }
        );

iniCssExtractPlugin.loader，当解析到css文件时，会首先执行MiniCssExtractPlugin的loader中实现的pitch方法，pitch方法会为每一个css模块调用this._compilation.createChildCompiler创建一个childCompiler和childCompilation；childCompiler控制完成该模块的加载和构建后返回。childCompilation中构建的module是CssModule，并且使用type='css/mini-extract'来区分。
 

在seal中MiniCssExtractPlugin会根据module的type='css/mini-extract'的类型来区分是否css样式，进行单独处理，而其他js模版不认识type='css/mini-extract'类型的module也就被过滤掉了，这样就实现了样式分离。

```

- compiler.hooks.make阶段触发compilation.addEntry，

```
	compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);

```

- compilation.addEntry阶段通过_addModuleChain根据模块的类型获取对应模块的工厂函数创建模块，构建模块
```
	this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {}
            )

    // 进入该函数看看 moduleFactory.create 创建完成module传给回调，在把module添加到entries中；

    moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
				(err, module) => {
		
					const addModuleResult = this.addModule(module);
					module = addModuleResult.module;

					onModule(module);

					dependency.module = module;
					module.addReason(null, dependency);

					const afterBuild = () => {
							callback(null, module);
					};

		 
					if (addModuleResult.build) {
						this.buildModule(module, false, null, null, err => {
							afterBuild();
						});
					} 
				}
			);
```
 对以回调分两步分析： 1.进入buildModule看具体做了什么；2.跟踪afterBuild后续工作
 ```
1. buildModule 中执行以下代码

		module.build(
			this.options,
			this,
			this.resolverFactory.get("normal", module.resolveOptions),
			this.inputFileSystem,
			error => {
	  
				const originalMap = module.dependencies.reduce((map, v, i) => {
					map.set(v, i);
					return map;
				}, new Map());
				module.dependencies.sort((a, b) => {
					const cmp = compareLocations(a.loc, b.loc);
					if (cmp) return cmp;
					return originalMap.get(a) - originalMap.get(b);
				});
	 
				this.hooks.succeedModule.call(module);
				return callback();
			}
		);

        // module.build中又执行 核心是this.parser.parse，但前提要先执行dobuild中runloader创建 webpackAST
        // 最后 执行 handleParseResult 后回到上段代码的回调，以succeedModule 为标志结束，进入下一个阶段

	build(options, compilation, resolver, fs, callback) {
		return this.doBuild(options, compilation, resolver, fs, err => {
			const handleParseResult = result => {
				this._lastSuccessfulBuildMeta = this.buildMeta;
				this._initBuildHash(compilation);
				return callback();
			};

			try {
				const result = this.parser.parse(
					this._ast || this._source.source(),
					{
						current: this,
						module: this,
						compilation: compilation,
						options: options
					},
					(err, result) => {
						if (err) {
							handleParseError(err);
						} else {
							handleParseResult(result);
						}
					}
				);
				if (result !== undefined) {
					// parse is sync
					handleParseResult(result);
				}
			}
		});
	}

 
 ```

 - compilation.finish,compilation.seal,这部分执行的代码也很多，主要任务有 ：optimizeDependencies，buildChunkGraph，
 optimizeModules，optimizeChunks，optimizeTree，optimizeChunkModules，createModuleAssets，summarizeDependencies，
 optimizeChunkAssets，optimizeAssets，afterSeal

 ```
	finish(callback) {
		const modules = this.modules;
		this.hooks.finishModules.callAsync(modules, err => {
			if (err) return callback(err);

			for (let index = 0; index < modules.length; index++) {
				const module = modules[index];
				this.reportDependencyErrorsAndWarnings(module, [module]);
			}

			callback();
		});
	}


   // callback 回向了 compilation.seal

	seal(callback) {
		this.hooks.seal.call();
		this.hooks.optimizeDependencies.call(this.modules);
		this.hooks.afterOptimizeDependencies.call(this.modules);

		this.hooks.beforeChunks.call();
		this.assignDepth(module);
		buildChunkGraph(
			this,
			/** @type {Entrypoint[]} */ (this.chunkGroups.slice())
		);
		this.sortModules(this.modules);
		this.hooks.afterChunks.call(this.chunks);

		this.hooks.optimize.call();

		this.hooks.optimizeModules.call(this.modules) 
		this.hooks.afterOptimizeModules.call(this.modules);

		this.hooks.optimizeChunks.call(this.chunks, this.chunkGroups);
		this.hooks.afterOptimizeChunks.call(this.chunks, this.chunkGroups);

		this.hooks.optimizeTree.callAsync(this.chunks, this.modules, err => {
			this.hooks.afterOptimizeTree.call(this.chunks, this.modules);
			this.hooks.optimizeChunkModules.call(this.chunks, this.modules) 
			this.hooks.afterOptimizeChunkModules.call(this.chunks, this.modules);

			const shouldRecord = this.hooks.shouldRecord.call() !== false;

			if (shouldRecord) {
				this.hooks.recordModules.call(this.modules, this.records);
				this.hooks.recordChunks.call(this.chunks, this.records);
			}

			this.hooks.beforeHash.call();
			this.createHash();
			this.hooks.afterHash.call();

			if (shouldRecord) {
				this.hooks.recordHash.call(this.records);
			}

			this.hooks.beforeModuleAssets.call();
			this.createModuleAssets();
			if (this.hooks.shouldGenerateChunkAssets.call() !== false) {
				this.hooks.beforeChunkAssets.call();
				this.createChunkAssets();
			}
			this.hooks.additionalChunkAssets.call(this.chunks);
			this.summarizeDependencies();
			if (shouldRecord) {
				this.hooks.record.call(this, this.records);
			}

			this.hooks.additionalAssets.callAsync(err => {
				this.hooks.optimizeChunkAssets.callAsync(this.chunks, err => {
	
					this.hooks.afterOptimizeChunkAssets.call(this.chunks);
					this.hooks.optimizeAssets.callAsync(this.assets, err => {
						this.hooks.afterOptimizeAssets.call(this.assets);
						if (this.hooks.needAdditionalSeal.call()) {
							this.unseal();
							return this.seal(callback);
						}
						return this.hooks.afterSeal.callAsync(callback);
					});
				});
			});
		});
	}

 ```

 - afterSeal 封装完成后就进入了compiler.hooks.afterCompile阶段，callback最终走向finalCallback
 ```
    this.hooks.afterCompile.callAsync(compilation, err => {
        if (err) return callback(err);

        return callback(null, compilation);
    });

 ```
### 感想
> 花了三天的时间终于把webpack打包的整个流程的源码读完了，三天时间虽然不多，但每天都是全天的全身心的投入，有时读到某个很关键的时候，知道代码所表达的意思，但就是不知道它是怎么引入的，在什么情况下调，着实让人抓狂，因为我对一件事一旦研究就得见底，不然白花时间了很亏，技术太深的看不懂我就认了，私下里花时间补回来，但对难度并不高的挡住去路时就开始怀疑基础还不够扎实。有些问题在网上一搜便有了答案，这种问题就很友善了，但有些问题你没法从网上得知，比如源码前前后后都会出现的某个 hooks.xxx.call方法，它就是广播一下，但到处的plugin里找不到注册者，那它只能在用户自定义的插件中了，但不管在内部的plugin还是外部用户的plugin你都得要从内部的pluigin中看一看，万一注册了什么重要的钩子岂不是直接忽略掉呢，这一点对于初次读webpack的同学真不友好，不过庆幸的一点是当你陷入陷阱时及时上网查下别人的理解，陷进几次坑后再读webpack就感觉它的流程其实很清晰的。另外，还还有一个render部分属于template内容就不在这里读了，因为我之前已经了解过它的功能，再者我这几天也没空，后期有空单独品品。