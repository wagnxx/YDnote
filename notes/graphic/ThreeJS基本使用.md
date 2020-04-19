# threejs的基本使用
由于做该笔记时本人对threejs的了解还不过深入，所以以下只是对threejs浅层的分析和基本使用的描述

### threejs的几大主要部件及核心属性
- scene 提供物体展示的空间 
- camera 视角的出发点，相当于人的眼睛
- renderer 渲染器
- Light 光线参与使物体达到所需的颜色及亮度
- mesh 呈现在scene中的角色
### threejs渲染流程
用简单代码实现大概如下
```
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const webGLRenderer = new THREE.WebGLRenderer();


//testbox
var cubeboxMat=new THREE.MeshBasicMaterial({color:0xcccccc});
const cubeMesh=new THREE.Mesh(
  new THREE.BoxGeometry(0.5,0.5,0.5),
  cubeboxMat
);
cubeMesh.position.set(0,0,-0.35)
scene.add(cubeMesh)


document.body.append(webGLRenderer.domElement);
render();
 
function render() {
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  requestAnimationFrame(render);
  const time=Date.now();
   
  webGLRenderer.shadowMap.enabled=true;
  // pointLight.position.y=Math.cos(time);
  cubeMesh.rotation.y+=0.00255*Math.PI
  webGLRenderer.render(scene, camera);
}

```

从以上代码可以看出，camera和scene是负责辅助性的工作，它们主要提供一个服务就是物体在哪里以什么样的视角去展示，对于我们开发者
来说最主要的就是Mesh了，因为它才是scene这个舞台上的主角，它具体怎么展示我们都是可以操控的。那接下来详谈这个mesh，它是由几何形状与材质的组合，通俗点就是在一个几何体上披上一层皮肤就构成mesh,分别细说他们
- geometry，几何体的种类，它有以下几种
 ```
    2D几何图形
        1. PlaneGeometry 矩形
            参数：width height,widthSegment heightsegment
        2. CircleGeometry 圆和扇形，取决于参数

    3D几何体
        1. BoxGeometry 这是一个具有长宽高的盒子
        2. SphereGeometry 这是一个三维球体/不完整球体
        3. CylinderGeometry 可以绘制圆柱、圆筒、圆锥或者截锥
        4. CubeGeometry
            参数：widht,heiht,depth,widthSegment,heightSetment,depthSegment
        5. TorusGeometry 环形
        6. PolyhedronGeometry 多面几何体
            参数：vertices ， faces, radius detail


    其中geometry对象有以下重要属性

 ```

 - Material ，是独立于顶点之外的属性，帮助几何体呈现什么样的效果，它也有很多种类：
 ```
 一：共有属性
        基础属性
        融合属性：如何与背景相合
        高级属性
二：基础属性
        id
        name
        opacity
        transparent
        overDraw:过滤描绘
        visible
        side:几何体的哪个面
        needsUpdate

三：融合
        blending
        blenders :融合源
        blandest ：融合目标
        blendingEquation  ：融合方式
四：高级属性：要想深入，须得去了解opengl的规范

五：各材质细说：                        
        1. MeshBasicMaterial 基础材质，不受光照影响，使用网格会被渲染出简单的多边形，可以显示出几何体的线条
            参数： color,wireFrame ,fog
        2. MeshDepthMaterial 深度材质，外观不受光照和材质决定，而是由物体到相机的距离决定，可以与其他材质组合使用
            参数：wireFrame,wireFramelineWidth
        3. 联合材质，即Scene.Utils.createMutilMaterialObject,连合多个材质来展示多个材质的综合效果
            参数 geom,[material1,material2]
        4. MeshNomalMaterial 法相材质，材质通过法向量来计算颜色
            属性： 
                wireFrame        
                wireFrameLineWidth
                shading:设置着色方法
        5. MeshFaceMaterial 面材质，其实不受真正的材质，是一种容器，可以为几何体的每个面指定不同的材质
        ##高级材质
        6. MeshLamberMaterial 朗博材质，用于创建看上去暗淡的，不光亮的表面，可以对光源产生阴影的效果
            属性：
                color:对散射光发射的能力
                ambient:对环境光反射能力
                emissive：自发光的颜色
        7. MeshPhongMaterial 光亮表面材质，创建光亮表面的材质，可以参数阴影效果
            属性：
                specular:材质光亮程度                
        8. ShaderMaterial 着色器材质，该材质是最复杂的一种材质，可以使用自己定制的着色器

 ```

 ### threejs的光源
 在意思渲染阶段，有了基本的几个组件就可以运作了，物体也可以展示，但是总觉得差点什么，一定是缺少合适的光源加以点缀，常见的光源有以下几种
 - AmbientLight 环境光，属于基础光源，影响整个场景的光源，环境光没有明确的光源位置，在各处形成的光亮度都是一致的，不会印象阴影的产生，不能将环境光作为场景的唯一光源，一般会将环境光设为白色或者黑色作为其他光的参考
 - PointLight 点光源，朝所有方向发光，不会产生阴影
 - SpotLight 聚光灯光源， 与点光源没有太多区别，只是聚光灯 可以产生锥形光束，有castShdow，target属性
 - directinalLight 平行光，类似太阳光，属性有：castShdow，angle，target
 - HemisphereLight 半球光，产生更自然的室外效果，属性:groundColor,color,intensity
 - AreaLight 平面光，属于扩展光，定义一个发光的发光体，需要使用WEBGL的延迟渲染机制
 - LensFlare 不是光源，用于给光源添加镜头光晕效果，在有太阳的时候添加该光源，会使场景更真实