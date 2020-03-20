#redux 源码分析
> 先了解下redux的组成部分初步了解它的结构和数据流向
1. redux来源于flux架构，flux架构核心是 Action,Dispatcher,Store,View这个几个，架构方案是：
- 用户访问View
- View发出用户的Action
- Dispatcher收到 Action ，通知Store更新
- Store更新完之后，发出change事件
- View收到change事件，更新View
2. redux的组成主要是 getSate,dispacth,subscribe,以下代码也是最基本的组成,简单纯粹没什么可说的

```
function createStore(initState) {
  let state = initState,
    listeners = [],
    getState = () => state,
    subscribe = listener => listeners.push(listener),
    changeState = newState => {
      state = newState;
      listeners.forEach(l => l());
    };

  return {
    getState,
    subscribe,
    changeState
  };
}

//调用阶段
const initState = {
    counter: {
        count: 0
    },
    info: {
        name: '',
        description: ''
    }


}

let store = createStore(initState);

store.subscribe(() => {
    let satte = store.getState();
    console.log('当前的state', state);
});

store.changeState({
    ...store.getState(),
    info: {
        name: 'hello',
        description: 'redux design class'
    }
});


```
3. redux深入--添加reducer
上面代码最基本的功能是有，但是管理起来很麻烦，reducer参数了

```
第二版
function createStore(reducer,initState) {
    let state = initState,
      listeners = [],
      getState = () => state,
      subscribe = listener => listeners.push(listener),
      dispacth = (action) => {
        state = reducer(state,action);
        listeners.forEach(l => l());
      };

    return {
      getState,
      subscribe,
      dispacth
    };
  }


//调用阶段
// reducer 代码
export default (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
};

只需在原来基础之上添加reducer即可

let store = createStore(reducer,initState);

//调用dispatch即可触发状态改变
store.dispatch({
    type:'INCREMENT'
})

```
3. redux深入--reducer--combineReducer
仅凭以上代码只能实现简单的大reducer，而项目中需要将reducer进行分解，分解成语义化或者各个功能的reducer；若有这种需求需要对各个reducer进行合并，不得不使用combineReducer，它的核心目的是合并合并一个rootRouter提供给createStore。具体操作分两步
- 实现一个方法，遍历reducers，合并initState 为一个大的state对象；
- 在createStore中调用dispatch即可触发上面的方法

```

export default reducers => {
  //combineReducers

  let reducerKeys = Object.keys(reducers);

  //combine
  return (state = {}, action) => {
    //遍历reducers
    let nextState = {};
    for (let item of reducerKeys) {
      const reducer = reducers[item];
      let previousStateForKey = state[item];
      let nextStateForKey = reducer(previousStateForKey,action);
      nextState[item]= nextStateForKey;
    }
    return nextState;
  };
};


```

4. redux深入-middleware
在实际项目中，reducer的目的只是 生成新的state，对额外的需求不能解决，比如在数据传输过程中记录下日志，就得需要中间件了，中间件的最佳时机是在dispatch之前，它的功能主要是对原dispatch做代理，比如简单的logMiddleware

```
const logMiddleware=(store)=>next=>action=>{
    //做你想做的事，比如打印下当前state的值
    console.log('logMiddleware state',state);
    //继续执行原来的dispatch
    next(action)
}


```

4. redux深入-applyMiddleware
意思middleware似乎可以解决上述问题，但是实际项目不会有这么简单，可能会需要不同功能的多个middleware来参与，这个时候你一个个继续嵌套middleware是可以实现的，但代码不美观，难以管理，于是applyMiddleware便应运而生，它的功能主要是讲各个middleware组成一条链chain，按自己预期有序执行

```
const applyMiddleware=(...middlewares)
                    =>createStore
                    =>(...args)
                    =>{
                        const store=createStore(...args);
                        const chain=middlewares.map(mw=>mw(store));
                        const dispach=compose(...chain)(store.dispatch);
                        return {
                            ...store,
                            dispatch
                        };
                    }


```

对以上代码要想理解透彻去探究chain中的一元是什么样的，然后在看看在哪里启动

```
//1. 先看chain的一元，类似这样,这也是middleware的核心
let log=loggerMiddleware(store);
store.dispacth=log(store.dispacth);

// 2. 再看启动函数在createStore中如果有applyMiddleware会做以下处理

applyMiddleware(createStore)(reducer,initState)

//当上面的applyMiddleware启动以后直接执行到 ‘ =>(...args)’ 这一步，里面就是简单的替换dispatch

```