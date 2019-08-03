import React from "react";
const { useReducer, useContext, createContext } = React;
function middlewareLog(store, lastState, nextState, action, isDev) {
    if (isDev) {
        console.log(action.type);
        console.log("🐖",lastState);
        console.log("🐒",nextState);
    }
}
//专门处理reducer-in-action
function reduerInAction(state, action) {
    if (typeof action.reducer === "function") {
        return action.reducer(state);
    }
    return state;
}
export default function createStore(params) {
    //开启对中间件的检查模式
    let isCheckMiddleware = false;
    const { isDev, middleware, initialState } = {
        isDev: false,
        initialState: {},
        middleware: params.isDev ? [middlewareLog] : undefined,
        ...params
    }
    //创建一个全局的状态管理机制
    const AppContext = createContext();
    //构建初始化的store
    const store = {
        _state: initialState,
        dispatch: undefined,
        getState: () => {
            return store._state
        },
        useContext: () => {
            return useContext(AppContext)
        }
    }
    //负责分发action和reducer用的函数+管理中间件
    const middlewareReduer = (lastState, action) => {
        // switch (action.type) {
        //     case "addNum":
        //         return {
        //             ...lastState,
        //             age: lastState.age + 1
        //         }
        //     default:
        //         return {
        //             ...lastState
        //         }
        // }
        //集成所有的中间件
        let nextSatate = reduerInAction(lastState, action);
        if (!isCheckMiddleware) {
            if (!Array.isArray(middleware)) {
                throw new Error("middleware必须是个数组");
            }
            isCheckMiddleware = true;
        }
        for (let item of middleware) {
            const newSatate = item(store, lastState, nextSatate, action, isDev);
            if (newSatate) {
                nextSatate = newSatate;
            }
        }
        //store中的数据 实时更新
        store._state = nextSatate;
        return nextSatate;
    }
    const Provider = props => {
        const [state, dispatch] = useReducer(middlewareReduer, initialState);
        if (!store.dispatch) {
            store.dispatch = async (action) => {
                if (typeof action === "function") {
                    await action(dispatch, store._state);
                } else {
                    dispatch(action);
                }
            }
        }
        return <AppContext.Provider {...props} value={state} />
    }
    return {
        Provider,
        store
    }
}