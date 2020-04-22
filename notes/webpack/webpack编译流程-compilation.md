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

 - compilation.finish,compilation.seal