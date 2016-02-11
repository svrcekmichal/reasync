# REASYNC

Library for connecting React components to async actions like fetching

## Installation

```bash
npm i -S reasync
```

##Warning

The package is under hard development. Don't use in production.

## How does it work?

On server, we use `renderProps` from react-router match callback. We iterate
over components, looking after components decorated with `asyncResolve`

On client we use `AsyncResolver` component in react-router render, where we
bind to componentWillMount to check data after startup and then componentWillReceiveProps
to check for route changing

For executing actions before rendering we use `history.listenBefore()`

We don't do any optimisations, as we can do that on connected component, which receive
in decorated function all it needs, like location, params and all our params we define

#Example

### On client

```javascript

import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import createStore from './redux/createStore';
import reducers from './redux/modules';
import {getRoutes} from './routes';
import {Provider} from 'react-redux';
import {Router, browserHistory } from 'react-router';
import {AsyncResolver, connectHistoryForResolving} from 'reasync';
import {syncHistoryWithStore} from 'react-router-redux'

const store = createStore(browserHistory, window.__data__);
const history = syncHistoryWithStore(browserHistory, store);
const routes = getRoutes(store);

const mountPoint = document.getElementById('content');

const custom = {
    dispatch:store.dispatch,
    getState:store.getState
};

connectHistoryForResolving(history, routes, custom);
const router = (
  <Router
      history={history}
      routes={routes}
      render={(props) => <AsyncResolver custom={custom} {...props}/>}
  />
);


ReactDOM.render(
<Provider store={store} key="provider">
  {router}
</Provider>,
mountPoint
);


```

### On server

```javascript

... //import createStore, getRoutes, reducers etc.
import {match} from 'react-router';
import createHistory from 'history/lib/createMemoryHistory';
import {getAsyncDependencies} from 'reasync';

match({history,routes,location:req.originalUrl},(error, redirectLocation, renderProps) => {
  if (redirectLocation) {
    res.redirect(redirectLocation.pathname + redirectLocation.search);
  } else if (error) {
    console.error('ROUTER ERROR:', error);
    res.status(500);
    hydrateOnClient(); // error in router, you should try to hydrate app on client
  } else if(renderProps) {

      //here starts our work, we get all connected promises and after they are resolved, we render app for client
      const resolveParams = [renderProps.location, renderProps.params, custom];
      const preAsyncDependencies = getAsyncDependencies(renderProps.components);
      const deferAsyncDependencies = getAsyncDependencies(renderProps.components,false);
        Promise.all(preAsyncDependencies(...resolveParams))
          .then(() => Promise.all(deferAsyncDependencies(...resolveParams)))
          .then(
            //render ...
          ).catch((e) => {
            console.error(e);
            hydrateOnClient();
          });
  } else {
    console.error(err);
    res.status(404);  // page not found in router, you should try to hydrate app on client
    hydrateOnClient();
  }
})

```

### Component decorator

For decorating component you can use default export. Decorator must contain function, which return promise.
Decorator can accept two function which return promise. First parameter is for prefetching, before route
transition, second one is for deferred fething.

From my point of view, people don't understand word 'deferred' same way, so in this package, on the server
it is resolved before rendering, but on client it is resolved after route transition

```javascript
import asyncResolve from 'reasync';

// first argument is named, containing location and params from router, and every custom functionality injected
const preResolve = () => new Promise(resolve => setTimeout(resolve,2000)); // all route transition will happended with 2sec delay

const deferResolve = ({getState,dispatch}) => {
  let promises = [];
    if(isSomethingFetched(getState())){ //check if you really need fetch
      promises.push(dispatch(fetchSomething())); //dispatch action
    }
  return Promise.all(promises);
}

//if you need only deferRespolve, preResolve should be undefined or any other false value
@asyncResolve(preResolve, deferResolve)
export default class App extends Component {
...

```

#### Don't want to use decorators?

You can use same as above, only don't export class, but result of `asyncData`
```javascript
  export default asyncResolve(preResolve, deferResolve)(App); //exported component
```


## Usage

[svrcekmichal/universal-react](https://github.com/svrcekmichal/universal-react)

## Future

There's so much to do, like write tests, simplify usage, cleanup the mess
