import React from 'react';
import { unstable_batchedUpdates as batchedUpdates } from "react-dom";
const { Component } = React;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  test(){
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
  }
  componentDidMount() {
    let me = this;
    me.setState({
      count: me.state.count + 1
    });
    console.log(me.state.count);    // 打印
    me.setState({
      count: me.state.count + 1
    });
    console.log(me.state.count);    // 打印
    setTimeout(function () {
      me.setState({
        count: me.state.count + 1
      });
      console.log('第一次', me.state.count);   // 打印
    }, 0);
    console.log("batchedUpdates", batchedUpdates)
    setTimeout(function () {
      batchedUpdates(() => {
        me.setState({
          count: me.state.count + 1
        })
      })
    }, 0);
    //console.log('第二次', me.state.count);   // 打印
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.test.bind(this)}>增加count</button>
      </div>
    );
  }
}

export default App;
