# REASYNC

Library for connecting React components to async actions like fetching

## Installation

```bash
npm i -S reasync
```

##Warning

The package is currently alpha version. Use with own risk.

##API

### `resolveOnClient(history, routes, store:ReduxStore, custom?:Object):Resolver`

Used for resolving on client. after execution of this function package hook itself to history
and start listening for route changes. Resolver object returned has four methods:

#### `Resolver.beforeTransition(callback:Function)`

actions to be executed before transition and preResolving

#### `Resolver.afterTransition(callback:Function)`

actions to be executed after transition and before deferResolving

#### `Resolver.setTransitionRule((oldLocation,newLocation):boolean)`

rule when transition should trigger resolving

#### `Resolver.stopResolving()`

unregister listeBefore hook from history

### `resolveOnServer(renderProps, store:ReduxStore, custom?:Object):Promise`

Resolving on the server is handled after match of react-router package. Function iterate over all components,
find decorated ones and execute their actions

### `preResolve(resolveFunction)`
### `pre(resolveFunction) => alias for preResolve`
### `deferResolve(resolveFunction)`
### `defer(resolveFunction) => alias for deferResolve`

HOC for adding resolve actions to components. Accepts `resolveFunction` with following signature: `Function(attrs):Promise`.
 First argument is named and contain `params`, `location`, `store`, `getState` and every named value defined in custom.
 Return value of this function must be Promise.

### `asyncResolve(preResolve,deferResolve)`

Implementation of `preResolve` followed by `deferResolve`

### `resolve(name,toResolve):` 

Every defined resolve before is only shortcut for resolve. For example `preResolve = resolve.bind(undefined,'preResolve');`.
That's all, no magic. Resolve is exported for custom resolves, which will be used in next versions.

### `DEPRECATED asyncResolve(pre,defer)`

Special implementation of resolve, which can add preResolve and deferResolve in one decoration. `asyncResolve` is deprecated and will be
removed in next version. If you need it and want it, you can create it yourself or send me PM.

##Example

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
import {resolveOnClient} from 'reasync';
import {syncHistoryWithStore} from 'react-router-redux'

const store = createStore(browserHistory, window.__data__);
const history = syncHistoryWithStore(browserHistory, store);
const routes = getRoutes(store);

const mountPoint = document.getElementById('content');

resolveOnClient(history, routes, store);

ReactDOM.render(
<Provider store={store} key="provider">
  <Router history={history} routes={routes} />
</Provider>,
mountPoint
);


```

### On server

```javascript

... //import createStore, getRoutes, reducers etc.
import {match} from 'react-router';
import createHistory from 'history/lib/createMemoryHistory';
import {resolveOnServer} from 'reasync';

match({history,routes,location:req.originalUrl},(error, redirectLocation, renderProps) => {
  if (redirectLocation) {
    res.redirect(redirectLocation.pathname + redirectLocation.search);
  } else if (error) {
    console.error('ROUTER ERROR:', error);
    res.status(500);
    hydrateOnClient(); // error in router, you should try to hydrate app on client
  } else if(renderProps) {
    resolveOnServer(renderProps,store).then(
      () => {}, //render...
      (e) => {console.log(e)} //error, hydrate on client
    )
  } else {
    console.error(err);
    res.status(404);  // page not found in router, you should try to hydrate app on client
    hydrateOnClient();
  }
})

```

### Component decorator

Use one of available decorators or create own:
```javascript
import asyncResolve from 'reasync'; //deprecated

import {preResolve} from 'reasync';
import {pre} from 'reasync';
import {deferResolve} from 'reasync';
import {defer} from 'reasync';

//custom resolver
import {resolve} from 'reasync'
const customResolve = resolve.bind(undefined,'customResolve');
```

And use for decorating of component

```javascript
import {pre,defer} from 'reasync';

const preResolve = () => new Promise(resolve => setTimeout(resolve,2000)); // all route transition will happended with 2sec delay

const deferResolve = ({getState,dispatch}) => {
  let promises = [];
    if(isSomethingFetched(getState())){ //check if you really need fetch
      promises.push(dispatch(fetchSomething())); //dispatch action
    }
  return Promise.all(promises);
}

@pre(preResolve)
@defer(deferResolve)
export default class App extends Component {
...

```

#### Don't want to use decorators?

You can use same as above, only don't export class, but result of function
```javascript
  export default pre(preResolve)(App); //exported component
```


## Usage

[svrcekmichal/universal-react](https://github.com/svrcekmichal/universal-react)

## Related projects

- [React Resolver](https://github.com/ericclemmons/react-resolver) by [@ericclemmons](https://twitter.com/ericclemmons)
- [React Transmit](https://github.com/RickWong/react-transmit) by [@rygu](https://twitter.com/rygu)
- [AsyncProps for React Router](https://github.com/rackt/async-props) by [@ryanflorence](https://twitter.com/ryanflorence)
- [React Async](https://github.com/andreypopp/react-async) by [@andreypopp](https://twitter.com/andreypopp)
- [Redial](https://github.com/markdalgleish/redial) by [@markdalgleish](https://twitter.com/markdalgleish)

## Future

There's so much to do, like write tests, simplify usage, cleanup the mess
