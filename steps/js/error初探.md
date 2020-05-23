## error 集
- window.onerror，cry-catch
```
主要用来捕捉意料之外的错，try-catch捕捉意料之内的错
window.onerror((msg,url,row,col,error)=>{
    console.log(msg,url,row,col,error);
    return true
    // 返回true异常向上抛出，遇到资源错误就无能为力
})

```

- 资源错误
```
<img src='xxx.jpg'>

// 方案
window.addEventLister('error',(msg,url,row,col,error)=>{
    console.log(msg,url,row,col,error);
    return false;
},true)


```
- promise,unhandledrejection

```
Promise.reject('xxx');

window.addEventListener('unhandledrejection',function(e){
    e.preventDefault();
    <!-- return true; -->
})
// 可以解决 里面throw的错

```

- 更多内容见 zanePerfor