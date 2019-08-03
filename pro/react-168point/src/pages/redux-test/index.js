import React, { Component } from "react";
import createStore from "./store";

import PropTypes from "prop-types";

const appState = {
  title: {
    text: "React.js 小书",
    color: "red"
  },
  content: {
    text: "React.js 小书内容",
    color: "blue"
  }
};

function changeColor(state, action) {
  switch (action.type) {
    case "title":
      state.title.color = action.color;
      break;
    case "content":
      state.content.color = action.color;
      break;
    default:
  }
  return { ...state };
}

var store = createStore(changeColor, appState);
store.subscribe(() => {
  console.log(store.getState());
});

class ReduxPage extends Component {
  static contextTypes = {
    store: PropTypes.object
  };
  // constructor(props){
  //   super(props)
  // }
  titleChange = () => {
    // this.context.store.dispatch({
    //   type: "title",
    //   color: "yellow"
    // });
  };
  render() {
    
    const state = this.context.store.getState();
    return (
      <div>
        <h3>redux page</h3>
        <div className="redux-show">
          <h4 style={{ color: state.title.color }}>{state.title.text}</h4>
          <p style={{ color: state.content.color }}>{state.content.text}</p>
          <p>
            <button onClick={this.titleChange}>改变title颜色</button>
          </p>
          <p>
            <button>改变content颜色</button>
          </p>
        </div>
      </div>
    );
  }
}

export default class extends Component {
 
  render() {
     
    return (
      <Provider2s store={store}>
        <ReduxPage />
      </Provider2s>
    );
  }
}

 
class Provider2s extends Component {
  static childContextTypes = {
    store: PropTypes.object
  };
 

  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}


