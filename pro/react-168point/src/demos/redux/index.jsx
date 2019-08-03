import React from "react";
import createStore from "./hooks-redux";
const { Provider, store } = createStore({
    isDev: true,
    initialState: { name: "京程一灯🏮", age: 0 }
})
function timeOutAdd(a) {
    return new Promise(cb => setTimeout(() => cb(a + 1), 300));
}
const actionOfAdd = () => async (dispatch, ownState) => {
    const age = await timeOutAdd(ownState.age);
    dispatch({
        type: "addNum",
        reducer(state) {
            return { ...state, age }
        }
    });
}
// function actionOfAdd() {
//     return {
//         type: "addNum",
//         reducer(state) {
//             return { ...state, age: state.age + 1 }
//         }
//     }
// }
function Button() {
    function handleAdd() {
        store.dispatch(actionOfAdd())
    }
    return <button onClick={handleAdd}>点击增加</button>
}
function Page() {
    const state = store.useContext();
    return (
        <div>
            {state.age}
            <Button />
        </div>
    )
}

export default function App() {
    return (
        <Provider>
            <Page />
        </Provider>
    )
}