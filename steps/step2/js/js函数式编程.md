## js的函数式编程

### 1. 函数式编程的思维
- 源于范畴论(categery Thery)
- 基础理论
 a. 模型来源于λ(lambda x=> x*2)演算，用于研究函数定义，函数应用和递归的形式系统
 b. 函数式编程不是用函数编程，也不是传统的面向过程编程，其主旨是要将复杂的函数符合成简单的函数，运算过程尽量写成一系列嵌套的函数调用
 c. js语言是披着c外衣的lisp（一种纯函数编程语言）
 d. 随react的高阶函数逐渐升温
- 函数式编程特点
 a. 函数是一等公民
 b. 只用表达式，不用语句
 c. 没有副作用
 d. 不修改状态
 e. 引用透明（函数运行只靠参数）

 ### 2. 函数式编程的优缺点
  a. 优点：值唯一，可缓存，提高代码后期运行速度
  b. 缺点：举例代码说明
  ```
  // 不纯的
  var min = 18;
  var checkage = age=>age>min;
  // 纯的
  var checkage = age=>age>18;

  //结论：
  // 在不纯的情况下，checkage 不仅取决于age参数，还依赖与外部的min变量；在纯的情况下，checkage把关键数字18 硬编码到函数内部，扩展性比较差（解决方案见后续部分的curried）


  ```
 ### 3. 柯里化（curried）,通过偏应用函数实现
  对以上checkage的解决方案如下：
  ```
    var checkage = min=>(age=>age>min);

    var checkage18 = checkage(18);

    checkage18(20);

  ```
###  4. 函数组合，主要解决洋葱式函数嵌套问题,参数扁平化
  ```
    const compose = (f,g) =>(x=>f(g(x)));

  ```
###  5. Point Free（把一些对象自身的方法转换成纯函数，不要命名转瞬即逝的中间变量），
  ```
  // 举例代码
  // 原始方案
  var f = str => str.toUpperCase().split(" ");
  // 更改成两个纯函数再合并
  var toUpperCase = word =>word.toUpperCase();
  var split = x => (str => str.split(x));
  var f = compose(split(" "),toUpperCase);

  f("abcd efg")
  // 这种风格能够帮助我们减少不必要的命名，让代码保持简洁和通用

  ```
###  6. 声明式与命令式代码比较
  ```
  // 命令式
  var CEOS = [];
  for(var i=0;i<companies.length;i++){
      CEOS.push(companies[i].CEO)
  }
  // 声明式
  var CEOS = companies.map(c=>c.CEO)
  //优缺点比较
  // 优点：声明式代码不需要考虑函数内部如何实现，只需关注于写业务代码，优化时只需将注意点集中在这些稳固的函数内部即可
  // 缺点：命令式代码的缺点，副作用多，让开发者头疼，负担重
  ```
### 7. 更加专业的术语
   a. 高阶函数
   > 高阶函数本身是一个函数，它是指将其他函数作为其参数传入，对其进行一定的处理再返回
   
   b. 尾调用
   >  尾调用是指在函数的最后一部调用一个函数，其优点主要体现在不留痕迹的执行了你需要的代码，因为如果不用尾调用的话，执行一个普通的函数调用把它的值存起来，这样会在内存中生成一个调用桢，多个相同的操作嵌套在一起会形成一个调用栈，所以尾调用对性能优化很重要

### 8. 容器，Functor（函子）
```
// 构造一个容器
var Container = function(x){
    this.__value = x;
};
Container.of = x => new Container(x);
Container.prototype.map = function(f){
    return Container.of(f(this.__value));
};

```
### 9.Maybe 函子 （if）
>  函子接受各种函数来处理容器内部的值，有个问题是容器内部的值可能是一个空值（比如 null），而外部的函数未必有处理空值的机制，如果传入空值，可能会出错

**代码说明**
```
class  Maybe extends Functor {
    map(f){
        return this.val?
            Maybe.of(f(this.val)):
            Maybe.of(null)
    }
}

```
### 10. 错误处理 Either

- 容器做的事不少，try/catch/throw并不纯，因为它从外部接管了我们的函数，并且函数出错时抛出其返回值
- Promise可以调用 catch 来集中处理错误
- 本质上 Either 并不是用来做错误处理的，它表示的逻辑或，范畴学里的coproduc
```
class Either extends Functor {
    constructor(left,right){
        this.left = left;
        this.right = right;
    }

    map(f){
        return this.right?
            Either.of(this.left,f(this.right)):
            Either.of(f(this.left),this.right);
    }


}

Either.of = function(left,right){
    return new Either(left,right);
};

//使用Either

var addOne = function(x){
    return x+1;
};

Either.of(5,6).map(addOne);
// Either(5,7)

Either.of(1,null).map(addOne)
// Either(2,null)


```

### 11. Ap 函子
> 函子里包含的值有可能是普通值，也有可能是 函数，当函子的值是函数时，以上方法都不能发挥作用了，需要用Ap函子的方案去解决，具体实现见以下代码

```
    class Ap extends Functor{
        ap(F){
            return Ap.of(this.val(F.val))
        }
    }


```
### 12. IO

IO的两大特点

a. 惰性求值，都是比较杂，脏的操作
b. IO是脏的，所以要用函数将其包裹起来，并返回这个函数

### 13. Monad

> Monad 函子的作用，总是返回一个单层的函子，它有一个flatMap方法，与map方法基本一样，唯一不同的是如果生成的是一个嵌套函子，他会取出后者内部的值，保证它返回的永远是一个单层的容器，不会出现嵌套的情况。


```
class Monad extends Functor {
    join(){
        return this.val;
    }
    flatMap(f){
        return this.map(f).join();
    }
}
// 如果函数f返回的是一个函子，那么 this.map(f) 就会生成一个嵌套的函子所以 join方法保证了 flatMap 方法返回一个单层函子，这意味着嵌套的函子会被铺平（platten）

```
### 14. 流行库

- Rxjx：响应式函数库，是underscord的fork过来的，frp基于fp
- lodash