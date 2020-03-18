# inversify的应用及对周边源码分析

### 先看看入口文件

```
 
import { Container } from 'inversify';
import {  buildProviderModule } from 'inversify-binding-decorators';
import { InversifyKoaServer } from 'inversify-koa-utils';

const container = new Container();
container.load(buildProviderModule())
const server = new InversifyKoaServer(container);
const app = server.build();

```
通过以上代码可知，该项目需具备三个插件才能完成较高的自动化

1. inversify，这是核心，它提供了Container，injectable,inject
- Container作为容器，供存取数据使用
- injectable装饰器标明所修饰的类可以被注入
- inject 将可注入的对象注入到具体的目标

2. inversify-binding-decorators，主要对inversify中injectable功能的拓展，它主要包含以下：
- provide，该装饰器主要用着service上，它是对injectable的封装
- fluentProvide， 限定binding的范围
- buildProvideModule ，该方法主要是创建一个ContainerModule，同时把“bind-to”挂载到 register方法上，当启动container.load的时候便执行register(metadata,bind),其执行过程见下面代码
```
    new ContainerModule(bind=>...);

  // container_module.ts
  public constructor(registry: interfaces.ContainerModuleCallBack) {
        this.id = id();
        this.registry = registry;
    }


  // container.ts
    public load(...modules: interfaces.ContainerModule[]) {

        const getHelpers = this._getContainerModuleHelpersFactory();

        for (const currentModule of modules) {

            const containerModuleHelpers = getHelpers(currentModule.id);

            currentModule.registry(
                containerModuleHelpers.bindFunction,
                containerModuleHelpers.unbindFunction,
                containerModuleHelpers.isboundFunction,
                containerModuleHelpers.rebindFunction
            );

        }

    }

```

3. inversify-koa-utils，该插件也是inversify的核心，它融合了koa，koa-router，在内部实现了 app，router，可直接供外部使用，具体功能 主要有以下几点
- interface，含Controller和RoutingConfig的定义
- TYPE，目前仅有TYPE.Controller
- HttpMethod,包含HttpGet，HttpPost等
- controller，主要提供路由和标记数据 Reflect.defineMetadata(METADATA_KEY.controller, metadata, target);
- InversifyKoaServer，这个是整个应用的核心，它含有 _app,_router,这样省的用户亲自如添加对应 服务 ，还有一点不能忽略的是它的配置项，尤其是routing_config
```
interface RoutingConfig{
    rootPath:string
}

```