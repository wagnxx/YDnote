# vue 源码核心实现

> vue是一个短小精悍的库，用起来非常丝滑，它的源码实现也很好理解，今天就说它比较核心的一部分双向数据绑定

它的实现主要是 借助Object.definProperty数据劫持和observe配合做数据分发

- 初始化
```
    var vm = new Vue({
      el: 'app',
      data: {
        text: 'hello world'
      }
    });


```

- 基于以上数据结构实现 Vue入口代码

```
function Vue(options) {
      this.data = options.data;
      var data = this.data;
      observe(data, this);
      var id = options.el;
      var dom =new Compile(document.getElementById(id),this);
      // 编译完成后，将dom返回到app中
      document.getElementById(id).appendChild(dom);
    }



```


- 经以上代码，可知在运行前先实现 observe和Compiler


```


    function defineReactive (obj, key, val) {

      var dep = new Dep();
      Object.defineProperty(obj, key, {
        get: function() {
           //添加订阅者watcher到主题对象Dep
          if(Dep.target) {
            // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
            dep.addSub(Dep.target);
          }
          return val;
        },
        set: function (newVal) {
          if(newVal === val) return;
          val = newVal;
          console.log(val);
          // 作为发布者发出通知
          dep.notify();
        }
      })
    }
    function observe(obj, vm) {
      Object.keys(obj).forEach(function(key) {
        defineReactive(vm, key, obj[key]);
      })
    }

// compiler部分

function Compile(node, vm) {
      if(node) {
        this.$frag = this.nodeToFragment(node, vm);
        return this.$frag;
      }
    }
    Compile.prototype = {
      nodeToFragment: function(node, vm) {
        var self = this;
        var frag = document.createDocumentFragment();
        var child;

        while(child = node.firstChild) {
          self.compileElement(child, vm);
          frag.append(child); // 将所有子节点添加到fragment中
        }
        return frag;
      },
      compileElement: function(node, vm) {
        var reg = /\{\{(.*)\}\}/;

        //节点类型为元素
        if(node.nodeType === 1) {
          var attr = node.attributes;
          // 解析属性
          for(var i = 0; i < attr.length; i++ ) {
            if(attr[i].nodeName == 'v-model') {
              var name = attr[i].nodeValue; // 获取v-model绑定的属性名
              node.addEventListener('input', function(e) {
                // 给相应的data属性赋值，进而触发该属性的set方法
                 vm[name] = e.target.value;
              });
              // node.value = vm[name]; // 将data的值赋给该node
              new Watcher(vm, node, name, 'value');
            }
          };
        }
        //节点类型为text
        if(node.nodeType === 3) {
          if(reg.test(node.nodeValue)) {
            var name = RegExp.$1; // 获取匹配到的字符串
            name = name.trim();
            // node.nodeValue = vm[name]; // 将data的值赋给该node
            new Watcher(vm, node, name, 'nodeValue');
          }
        }
      },
    }


```

- watcher也是很核心的代码

```


function Watcher(vm, node, name, type) {
    Dep.target = this;
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.type = type;
    this.update();
    Dep.target = null;
}

Watcher.prototype = {
    update: function() {
        this.get();
        var batcher = new Batcher();
        batcher.push(this);
        // this.node[this.type] = this.value; // 订阅者执行相应操作
    },
    cb:function(){
        this.node[this.type] = this.value; // 订阅者执行相应操作
    },
    // 获取data的属性值
    get: function() {
        this.value = this.vm[this.name]; //触发相应属性的get
    }
}


```


- 还差一个Dep代码，它实现很简单，只负责存储watcher

```
function Dep() {
      this.subs = [];
    }
    Dep.prototype = {
      addSub: function(sub) {
        this.subs.push(sub);
      },
      notify: function() {
        this.subs.forEach(function(sub) {
          sub.update();
        })
      }
    }


```

### 经上总结，运行流程为 
-  new Vue()
- observe首先登场，监听 get
- new Compiler() 时 对属性加 Watcher，watcher掉update方法触发observer的get，同时把watcher添加到dep中
- 此时，observer，dep，watcher已经建立起联系