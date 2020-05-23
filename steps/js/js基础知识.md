## 一 练习题
### 1.请写出弹出值，并解释为什么。(5分)
```


alert(a)
a();
var a = 3;
function a() {
    alert(10)
}
alert(a)
a = 6;
a();
```
 - 答：fa ,10,3,a is not a function 
 >知识点： 变量提升，函数优先级最高

### 2.请写出如下输出值，并写出把注释掉的代码取消注释的值，并解释为什么(8分)
```
this.a = 20;
var test = {
 a: 40,
 init:()=> {
 console.log(this.a);
 function go() {
 // this.a = 60;
 console.log(this.a);
 }
 go.prototype.a = 50;
 return go; 
 }
};
//var p = test.init();

//p();
new(test.init())();
```
- 答：
(去掉代码注释后的答案)： 

## 二 核心知识总结
1. 注意es6中的方法不能被new
```
var o ={
    bar(){}
};
var p = o.bar.bind({});

new p();//  p is not a constructor

```