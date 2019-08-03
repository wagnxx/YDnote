import React from "react";
import { Route, Switch,Link } from "react-router-dom";
import Lazy from "./children/lazy";
import SuspenseComp from "./children/lazy/SuspenseComp";
import Memo1 from "./children/memo";
import "./index.css";
export default () => {
  return (
    <div className="detail">
      <h3>组件页</h3>
      <div className="nav">
        <ul>
          <li> <Link to="/detail/lazy">lay</Link> </li>
          <li> <Link to="/detail/Suspense">Suspense</Link> </li>
          <li> <Link to="/detail/memo1">memo1</Link> </li>
      
        </ul>
      </div>
      <div className="content">
        <h3>
          组件名：<span>item1--Component</span>
        </h3>
        <div>
          <Switch>
            <Route exact path="/detail/lazy" component={Lazy} />
            <Route exact path="/detail/Suspense" component={SuspenseComp} />
            <Route exact path="/detail/memo1" component={Memo1} />
          </Switch>
          I
        </div>
      </div>
    </div>
  );
};
