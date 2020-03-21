# hooks版本的redux实现

> 由于react16+中hooks的新出使得原redux黯然失色，今天不得不借助hooks重新构建redux；
- 先看看使用，怎么使用舒服

```

import React from 'react'
import hookRedux from './hooks-reudux';

const { Provider, store } = hookRedux({
    initState: {
        name: 'initname',
        age: 4
    }
})

function actionAdd() {
    // reducer in action
    return {
        type: 'init',
        reducer(state) {
            return {
                ...state,
                age: state.age + 1,
            }
        }
    }
}

function Button() {

    function handleAdd() {
        return store.dispatch(actionAdd())
    }

    return <button onClick={handleAdd}>点击</button>
}


function Page() {
    const state = store.useContext();
    return (
        <div>
            {state.age}
            <hr />
            <Button />
        </div>
    );
}

export default () => {

    return (
        <Provider>
            <Page />
        </Provider>);


}

```
- 经上面需求得知，我们需要Provider，store即可,相比原redux，hooks版的引进了useReducer解决了最核心的问题，比之前简单多了，要想弄明白只需深入研究该hooks就就可以了解该架构

```
import React, { useReducer, useContext, createContext } from 'react';


function reducerInAction(state, action) {
  if (typeof action.reducer === 'function') {
    return action.reducer(state);
  }
  return state;
}

export default function createStore(parmas) {
  const Appcontext = createContext();
  const { initState, reducer, middleware } = {
    reducer: reducerInAction,
    ...parmas
  };

  const middleWareReducer = (lastState, action) => {
    let nextState = reducer(lastState, action);
    // 实现reducer in action
    store._state = nextState;
    return nextState;
  };

  const store = {
    _state: initState,
    dispatch: undefined,
    useContext: () => {
      return useContext(Appcontext);
    }
  };
  const Provider = props => {
    const [state, dispatch] = useReducer(middleWareReducer, initState);
    if (!store.dispatch) {
      store.dispatch = async action => {
          dispatch(action);
       
      };
    }

    return <Appcontext.Provider {...props} value={{ ...state }} />;
  };

  return { Provider, store };
}


```
- 对原来applyMiddleware的这部分工作和combineReducer合在一起

```
export default function createStore(parmas) {
  const Appcontext = createContext();
  const { initState, reducer, middleware } = {
    reducer: reducerInAction,
    middleware: [middleWareLog],
    ...parmas
  };

  const middleWareReducer = (lastState, action) => {
    // switch (action.type) {
    //   case 'init':
    //     return {
    //       ...lastState,
    //       age: lastState.age+1
    //     };
    //   default:
    //     return {
    //       ...lastState
    //     };
    // }
    let nextState = reducer(lastState, action);
    if (!Array.isArray(middleware)) {
      throw new Error('middleware type must be array');
    }

    // 这里的中间件有多种实现形式，该处使用数组的形式把中间件依次传入
    for (let item of middleware) {
      const newState = item(store, lastState, nextState, action);
      if (newState) {
        nextState = newState;
      }
    }

    // 实现reducer in action

    store._state = nextState;
    return nextState;
  };

```
- 对于异步acion的处理
先看看调用方式

```
function timeoutAdd(a){
    return new Promise(resove=>{
        setTimeout(() => {
            resove(a+1)
        }, 2000);
    })
}

// 异步
function actionAdd() {
    // reducer in action

    return async (dispatch, ownState) => {
        const age = await timeoutAdd(ownState.age);
        dispatch({
            type: 'asyncAdd',
            reducer(state) {
                return {
                    ...state,
                    age
                }
            }
        });
    }

}

```
解决思路是把该方法作为回调在 dispatch阶段执行
```
      store.dispatch = async action => {
        if (typeof action === 'function') {
          await action(dispatch, store._state);
        } else {
          dispatch(action);
        }
      };

```