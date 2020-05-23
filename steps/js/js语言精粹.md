### 一 数据类型

1. typeof
```
    typeof alert  //  'undefined'

    typeof not_defined-var  //  'undefined'

```
2.  undefinde存在的原因
> 声明一个变量未赋值，由于js是弱类型语言，给不了它合适的初始值，undefined便诞生了

3. 变量提升
> js在**作用域内**可以引用稍后声明的变量而不引发异常，这一概念成为变量提升
```
// 举例
if(!('username' in window)){
    var username = 'hello wold';
}

console.log(username)

```

3. this:运行时的对象

### 二 继承
继承的目的是为了将父级对象的属性和方法接手过来，在子对象中的一切操作并不影响父级对象（严格来说是类的继承，在js中暂且就叫对象吧）

### 三 ES6 在企业中的应用