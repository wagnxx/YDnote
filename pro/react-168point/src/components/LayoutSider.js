import React from "react";
import { HashRouter as Router, Link } from "react-router-dom";
export default () => {
  return (
    <div className="page__container__side">
      <Router>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/detail">Detail</Link>
          </li>
          <li>
            <Link to="/redux">Redux</Link>
          </li>
          <li>
            <Link to="/error">error</Link>
          </li>
        </ul>
      </Router>
    </div>
  );
};
