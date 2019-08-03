import React, { Component } from "react";
import LayoutSider from "./components/LayoutSider";
import LayoutHeader from "./components/LayoutHeader";

import "./App.css";

import BasicRoute from "./router";

class App extends Component {
  render() {
    return (
      <div className="page">
        <div className="page__header">
          <LayoutHeader />
        </div>
        <div className="page__container">
          <LayoutSider />
          <div className="page_container__content">
            <BasicRoute />
          </div>
        </div>
      </div>  
    );
  }
}

export default App;
