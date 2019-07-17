## 几个关键词 ：layout rendering  painting
s- 获取dom分割成多层  parse Html
- 对每一个层计算样式结果 recalculate style
- 为每个节点生成过程图形和位置 ，重排 layout
- 将每个节点绘制并填充到图层的位图中 重绘 paint
- 绘制出来的纹理上传到gpu  ，composite layers
## 大致流程
> layout ,paint,composite,layers
## 网页分层
> 根元素，postion，transform , 半透明，滤镜，canvas,video,overflow;
gup参与：css3d,video,webgl,transform,滤镜