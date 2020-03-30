# vue ssr 总线架构方案

### 在spa日益昌盛的今天，我们似乎没有考虑过mpa，也是由于我们平时对于spa性能的容忍性导致的惰性懒得去进一步优化项目，spa最为明显的不足就是seo不友好，首屏渲染耗时，如果要解决这种问题就得把目光转向mpa了，以下简单的以vue为例搭建一个总线供子项目使用


1. 首先得在主页引入vue，veuRouter，systemjs。其中systemjs主要是统一模块化加载

```
    Vue.use(VueRouter);

    const ListPage={
        components:{
            listComp:()=>System.import('./list.dev.bundle.js')
        },
        template:'<list-comp/>'
    };
    const AboutPage={
        components:{
            aboutComp:()=>System.import('./about.dev.bundle.js')
        },
        template:'<about-comp/>'
    };
    const HomePage={
        components:{
            homeComp:()=>System.import('./home.dev.bundle.js')
        },
        template:'<home-comp/>'
    };

    const routes=[
        {
            path:'/list',
            component:ListPage
        },
        {
            path:'/about',
            component:AboutPage
        },
        {
            path:'/',
            component:HomePage
        },
    ];
    const router=new VueRouter({
        mode:'history',
        routes
    });
    Vue.component('app',{
        template:`
            <div>
                <h3>vue微前端</h3>
                <router-link to='/'>首页</router-link>
                <router-link to='/list'>list</router-link>
                <router-link to='/about'>about</router-link>
                <router-view/>
            </div>
        `
    });
    new Vue({
        template:'<app />',
        router
    }).$mount('#app')
    

```
2. 从以上几行代码可知，我们需要给该文件提供一批 'name.dev.bundle.js'文件，该文件是system规范的js，也就是把vue组件编译后的文件，对于vue文件的编译采用rollup，大概配置如下

```
const commonjs = require('rollup-plugin-commonjs');
const vuePlugin = require('rollup-plugin-vue');

const BASE_ENTRY = './src/';
const BASE_OUTPUT = './dist/';

let configs = [
  {
    filename: 'Home.vue'
  },
  {
    filename: 'List.vue'
  },
  {
    filename: 'About.vue'
  }
];

configs=configs.map(settings);

module.exports = configs;



function settings(item, index, array) {
  return {
    input: `${BASE_ENTRY}${item.filename}`,
    output: {
        // 注意：这里不应该全转小写，到具体项目需求具体配置
      file: `${BASE_OUTPUT}${(item.filename.replace(/\.vue/,'')).toLocaleLowerCase()}.dev.bundle.js`,
      format: 'system'
    },
    plugins: [commonjs(), vuePlugin()]
  };
}


```

3. 编译后的文件是一个个组件，可以直接引用，启动服务就可以跑起来了