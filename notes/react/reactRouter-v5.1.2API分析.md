# React-router v5.1.2总结，主要是针对 web端

1. 便捷的router的hooks
>   useHistory,
    useLocation,
    useParams
    useRouteMatch

```
// useHistory的使用
let history = useHistory();

function handleClick() {
    history.push("/HOme/123");
}

// useLocation 的使用，根据location的具体内容在函数式组件做自己的需求
let location = useLocation();


//  useParams,主要放在目标组件（子组件）里
const Home = () => {
    let { slug } = useParams();

    return <div>home cpt，slug:{slug}</div>;
}


// useRouteMatch 是对Route组件render参数match的抽离封装

function BlogPost() {
    let match = useRouteMatch("/blog/:slug");

    // Do whatever you want with the match...
    if (!match) return 'null---';
    return <h2>{match.params.slug}</h2>;
}

```

2. Link组件

```
//Link组件的to有三种格式string,object,function;string简单忽略

<Link
  to={{
    pathname: "/courses",
    search: "?sort=name",
    hash: "#the-hash",
    state: { fromDashboard: true }
  }}
/>

<Link to={location => ({ ...location, pathname: "/courses" })} />
<Link to={location => `${location.pathname}?sort=name`} />




```
3. Route组件比较少用但很重要的props:
- strict:是否匹配斜线
- exact:是否匹配自路径
- sensitive：是否忽略大小写


4. router api相关的所有代码

```

import React from 'react'
import './index.css'

import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Link,
    Switch,
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
    NavLink

} from 'react-router-dom';


function HomeButton() {
    let history = useHistory();
    let location = useLocation();

    function handleClick() {
        history.push("/HOme/123");
    }

    return (
        <button type="button" onClick={handleClick}>
            Go home
      </button>
    );
}


const Home = () => {
    let { slug } = useParams();

    return <div>home cpt，slug:{slug}</div>;
}


function BlogPost() {
    let match = useRouteMatch("/blog/:slug");

    // Do whatever you want with the match...
    if (!match) return 'null---';
    return <h2>{match.params.slug}</h2>;
}


export default () => {
    return <div>router test page!

        <Router  basename="/RouterTestPage">
            <li><NavLink  exact activeClassName='selected' to='/about'>about</NavLink></li>
            <li><NavLink exact  activeClassName='selected' to='/Home'>home</NavLink></li>
            <li><NavLink exact activeClassName='selected' to='/me'>me</NavLink></li>
            <li><HomeButton /></li>
            <Switch>
                <Route path='/HoME/:slug' sensitive={false} component={Home} />
                <BlogPost />

            </Switch>
        </Router>
    </div>
}



```