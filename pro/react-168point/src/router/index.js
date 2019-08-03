import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Home from "../pages/home";
import Redux from "../pages/redux-test";
import Detail from "../pages/detail";
import ErrorDemo from '../pages/error';
// import Lazy from "../pages/detail/children/lazy";
const BasicRoute = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/redux" component={Redux} />
      <Route path="/detail" component={Detail} />
      <Route path="/error" component={ErrorDemo} />
    </Switch>
  </Router>
);

export default BasicRoute;
