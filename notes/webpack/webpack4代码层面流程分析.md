# webpack4流程分析

webpack的大流程是  js文件 ------>loaders parse-------> AST --------==> String/Buffer----->Template----->boundle

从代码角度它的流向是：webpack.config.js,webpack-cli(compiler.run()),webpack/webpack.js=>Compiler 

- webpack.config.js文件中是webpack的config options，以key-val的形式存在
```
{
    entry:{
        app:'src/app.js'
    },
    plugins:[
        ...plugins
    ]
    modules:{
        rules:[
            {
                test:/\.js$/,
                use:['...loaders']
            }
        ]
    }
}

```

- 当在terminal中输入webpack命令时，webpack-cli便开始工作，对其参数接收进行加工，并引入webpack.js启动，核心代码如下

```

	const webpack = require("webpack");

    let lastHash = null;
    let compiler;
    compiler = webpack(options);




    compiler.run((err, stats) => {
        if (compiler.close) {
            compiler.close(err2 => {
                compilerCallback(err || err2, stats);
            });
        } else {
            compilerCallback(err, stats);
        }
    });



    function compilerCallback(err, stats){
        // 主要是捕获webapck运行时抛出的异常
    }

```

- webpack.js核心工作就是对导出内部插件和webpack，当然最核心的就是提供 webpack方法并导出

```

const webpack = (options, callback) => {

	let compiler;
	if (Array.isArray(options)) {
		compiler = new MultiCompiler()
	} else if (typeof options === "object") {
		options = new WebpackOptionsDefaulter().process(options);

		compiler = new Compiler(options.context);

		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
				if (typeof plugin === "function") {
					plugin.call(compiler, compiler);
				} else {
					plugin.apply(compiler);
				}
			}
		}
		compiler.hooks.environment.call();
		compiler.hooks.afterEnvironment.call();
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}

	return compiler;
};

exports = module.exports = webpack;


```

- 从上一步可以看出最核心的计算 new Compiler，进入compiler.js文件中会发现Compiler是继承自Tapable，Tapable已经是webpack代码中最顶端的存在了，它有哪些功能呢，tapable 是一个类似于nodejs 的EventEmitter 的库, 主要是控制钩子函数的发布与订阅,控制着webpack的插件系.webpack的本质就是一系列的插件运行。由此得知tapable就是大管家的存在，那进入Compiler.js看它的特色


```

class Compiler extends Tapable {



	run(callback) {
		const onCompiled = (err, compilation) => {
			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					this.hooks.done.callAsync(stats, err => {
						this.hooks.additionalPass.callAsync(err => {
							this.compile(onCompiled);
						});
					});
					return;
				}
			});
		};

		this.hooks.beforeRun.callAsync(this, err => {
			this.hooks.run.callAsync(this, err => {
				this.readRecords(err => {
					this.compile(onCompiled);
				});
			});
		});
	}








	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

            // 这是最核心的一步了
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





}







// 当执行了this.compile后 终于迎来了 compilation ，同时基于compilation的参数创建chunks


// this.hooks.make.callAsync触发 compilation.addEntry(context, dep, name, callback)，
//SingleEntryPlugin.js插件
compiler.hooks.make.tapAsync(
    "SingleEntryPlugin",
    (compilation, callback) => {
        const { entry, name, context } = this;

        const dep = SingleEntryPlugin.createDependency(entry, name);
        compilation.addEntry(context, dep, name, callback);
    }
);
 

```

- 接下来便是使用 paser对chunks解析依赖，使用tamlate对compilation数据生成文件，make的过程是一个很复杂过程，在下面单独大节说





## make 过程

1. make 流程
- 调用 loaders 对模块的原始代码进行编译，转换成标准的JS代码
- 调用 acorn 对JS代码进行语法分析，然后收集其中的依赖关系。每个模块都会记录自己的依赖关系，从而形成一颗关系树

2. 代码流程

```
// compiler.hooks.make.tapAsync 触发

	compilation.addEntry(context, dep, name, callback);

// compilation.js

	addEntry(context, entry, name, callback) {
		this._addModuleChain();
	}
	_addModuleChain(){
		this.buildModule(module, false, null, null, err 
	}
	buildModule(){
			module.build(
			this.options,
			this,
			....)
	}

// NormalModule.js

	build(options, compilation, resolver, fs, callback) {
			return this.doBuild(options, compilation, resolver, fs, err => {

				const handleParseResult = result => {
					this._lastSuccessfulBuildMeta = this.buildMeta;
					this._initBuildHash(compilation);
					return callback();
				};

				const result = this.parser.parse(this.ast||);

				handleParseResult(result);


			});
	}


	doBuild(options, compilation, resolver, fs, callback) {
		const loaderContext = this.createLoaderContext(
		resolver,
		options,
		compilation,
		fs
		);

		runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},(err)=>{
				if(result) {
					this.cacheable = result.cacheable;
					this.fileDependencies = result.fileDependencies;
					this.contextDependencies = result.contextDependencies;
				}

				const resourceBuffer = result.resourceBuffer;
				const source = result.result[0]; // 这里就是 babel-loader 编译后的代码
				const sourceMap = result.result[1];

				// this._source 是一个 对象，有name和value两个字段，name就是我们的文件路径，value就是 编译后的JS代码
				this._source = this.createSource(asString(source), resourceBuffer, sourceMap);
				return callback();
			});

	}

```

3. make 完毕就进入了 compilation.seal阶段，该阶段主要是基于compilation和template进行render，最后生成文件boundle去dist
- seal 流程

```
	seal(){
		this.createChunkAssets();
	}


	createChunkAssets() {
		const outputOptions = this.outputOptions;
		const cachedSourceMap = new Map();

		for (let i = 0; i < this.chunks.length; i++) {
			const chunk = this.chunks[i];
			const template = chunk.hasRuntime()
				? this.mainTemplate
				: this.chunkTemplate;
			const manifest = template.getRenderManifest({});

			this.emitAsset(file, source, assetInfo);
			chunk.files.push(file);
			this.hooks.chunkAsset.call(chunk, file);




		}



	}

```

- template.getRenderManifest