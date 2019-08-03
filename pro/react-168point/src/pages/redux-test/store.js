function createStore(reducer, state) {
  let currentState = state;
  let currentReducer = reducer;
  let listeners = [];

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    listeners.forEach(listener => listener());
  }
  function subscribe(listener) {
    listeners.push(listener);
  }
  function getState() {
    return currentState;
  }

  return {
    getState,
    subscribe,
    dispatch
  };
}

export default createStore;
