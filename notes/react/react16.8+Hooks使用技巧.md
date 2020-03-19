# react16.8+ Hooks实用技巧

react在v16后有了较大的改动，主要体现在主推函数式组件，新增了hooks，抛弃了很多生命周期中的will钩子，这章的重点是谈Hooks相关的使用，先罗列下常用的Hooks有哪些：
- useState
- memo,useMemo,useCallback
- useEffect
- useRef,forwardRef,useImperativeHandle
- useContext
基本的hooks是useState,useEffect,useContext这三个，其他的是按对应功能拓展过附加来的看了常用的就这几个，比较少，终于松口气了，喝口水的功夫接下来对它们一一使用

1.useState,很简单直接上用法
```
function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

2.memo
```
//memo让一个函数组件变成一个纯组件
// memo主要解决的问题是，在同一个父组件中，两个不相干的子组件发生改变，导致父组件从新渲染，从而导致其他组件也跟着渲染；memo的出现可以解决这个问题，对一个组件包裹下便不会受到影响

const Counter=(props=>{
    console.log('Counter组件又渲染了');
    return <h1>{props.data}</h1>
});
const MemoCounter=memo(props=>{
    console.log('Counter组件又渲染了');
    return <h1>{props.data}</h1>
});

export default ()=>{
    const [count,setCount] = useState(0);
    const data='hello world';

    return(
        <>
            <span>{count}</span>
            <input type="button"
                value='修改count'
                onClick={()=>setCount(count+1)}
            />
            <Counter data={data}/>
        </>
    );
}


```
3. useMemo 是对memo的加强，可以自定义渲染的条件
```
export default ()=>{
    const [count,setCount] = useState(0);

    const double = useMemo(()=>{
        return count * 2;
    },[count === 3]);

    const data='hell world';

    return(
        <>
            <!-- 当count为0和3的时候才会渲染double -->
            <span>{double}</span>
            <input type="button"
                value='修改count'
                onClick={()=>setCount(count+1)}
            />
            <Counter data={data}/>
        </>
    );
}


//虽然useMemo解决了以上问题，但下面这种情况它解决不了

    const onClick=()=>{
       console.log('clicked');
    }

    //将一个函数传过去，又会触发它重新渲染，因为在渲染父组件的时候产生的事件句柄都是新的，导致它必须渲染，

    <Counter onClick={onClick}/>


    //useMemo可以这样解决，但显得积累，为了解决这个问题，useCallback便诞生了
     const onClick = useMemo(()=>{
        return ()=>{
       console.log('clicked');
    }
    },[]);

```

4.useCallback

```
     const onClick = useCallback(()=>{
        return ()=>{
       console.log('clicked');
    }
    },[]);

```
5.useEffect 

```
 //执行三个生命周期，DidMount,DidUpdate,WillUnmount

    const [count ,setCount]=useState(0);

    const ref=createRef('default');

    useEffect(()=>{
       
        console.log('component update');
        return ()=>{
            console.log('unbind');
        }
    },[count]);//当条件为count的时候执行

    //只执行一次
    useEffect(()=>{
        console.log('component update');
        return ()=>{
            console.log('unbind');
        }
    },[]);

```
6.ref的几个hook很简单，直接上代码
```
// forwardRef和useImperativeHandle是一对
const ContextComp = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => (
        {
            method() {
                console.log('ref方法执行了');
            }
        }
    ));


    return <p>子组件</p>
});


export default () => {

    const ref = useRef();

    useEffect(() => {
        console.log('component update');
        ref.current.method();
        return () => {
            console.log('unbind');
        }
    }, []);

    return <>
        <ContextComp ref={ref} />
    </>
};

```
7.useContext，是个很重要的hooks，不过用起来很简单，具体见下面代码一目了然

```

import React, { createContext, useContext, useState } from 'react'

const TestContext = createContext('default');

const ContextComp=(props,ref)=>{
    const context = useContext(TestContext);
    return (
        <p>
            {context}
        </p>
    );
}


export default ()=>{
    const [name,setName]=useState('tom');
    return(
        <>
            <input type="text" value={name} onChange={e=>setName(e.target.value)}/>
            <TestContext.Provider value={name}>
                <ContextComp/>
            </TestContext.Provider>
        </>
    );


```