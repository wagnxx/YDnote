# css的核心要点

这小节主要梳理下css相关的内容，所设计到的细节目录为：
- OOCSS、BEM、SAMCSS
- 圣杯布局和双飞翼布局
- 网页渲染过程之css阶段
- css处理器

### OOCSS、BEM、SAMCSS
> oocss是对css采取面向对象的方式进行管理，BEM是指的block-element-Modifier，SAMCSS是指 scalable and modular architecture for css（可扩展的模块化架构css）
- oocss的具体特点见 [oocss作用和说明](../demos/oocss.html)
- BEM 形式也很简单，比如 nav__item--active 中 就和 B__E--statu 一样 ，其中 statu多数情况可以省略，默认值直接加给 B-E中
- SAMCSS 有一下几点：
    + Base 预设值，如：html{} input:{}等
    + Layout 整个网站[大架构]的外观   如：header{}
    + Module 公共模块 如：button{}
    + State 状态 如：nav--main{}
    + Theme 页面上所有【主视觉】如：border-color

### 圣杯布局和双飞翼布局
> 圣杯布局主要是子元素用float和postion已经负margin-left调整位置，父元素添加padding让中间元素全部展现出来；双飞翼布局是在圣杯布局的基础之上把子元素的position去掉，在middle元素内在创建一个inner元素，将父元素的padding去掉转移到middle元素或者直接删除，middle内部的布局由middle自己配合inner决定

- [圣杯布局demo](../demos/圣杯布局.html)
- [双飞翼布局demo](../demos/双飞翼布局.html)


### 网页渲染过程之css阶段
1. 网页的渲染主要阶段有：loading ，scripting ，rendering ，painting ，other ， idle，各个阶段具体复杂详情如下：

- loading 网络通信和Html解析
- scripting 执行script
- rendering 重排阶段，样式的计算和布局
- painting 重绘阶段
- other 其他事件所花事件
- idle 空闲时间

2. 从以上渲染流程可以看出，只要发生重排一定会导致重绘，所以需要主要哪些操作会引起重排来避免它，一般情况会有一下几种：
- 添加或者删除dom元素
- 改变元素位置
- 改变元素尺寸
- 元素内容改变
- 页面初始化渲染（无法避免）
- 浏览器窗口尺寸改变

3. 如果dom变化仅仅是改变了颜色（非几何属性），此时只发生重绘，不会重排

4. 开启动画加速元素为什么不会引起重排？答案是因为它发生在合成阶段，处于渲染后期，没有机会去重排。合成层的步骤如下：
- DOM子树渲染层 (RenderLayer) --> RenderObject --> GraphicsContext;GraphicsContext有 ：根元素，postion，transform，半透明，css滤镜，canvas2d，video，溢出
- Compositor --> 渲染层子树的图形层(GraphicsLayer)--> RenderObject
- 注：compositor將所有拥有compositing layer 进行合成，合成过程gpu参与，合成完毕就能够將纹理映射到一个网格结构几何体之上

### css处理器
主要包含预处理和后处理，详情如下
- 预处理是指的处理特定格式的文件到目标css的处理程序
- 后处理主要是对css进行一些压缩已经浏览器兼容操作
- 当前较好的处理器 Post CSS能前后通吃，具体配置在 工程化章节
