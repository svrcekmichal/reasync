# REASYNC - Installation & Usage

#### Docs

- [Home](https://github.com/svrcekmichal/reasync)
- [Installation & Usage](https://github.com/svrcekmichal/reasync/blob/master/docs/USAGE.md)
- [Api](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)

## Installation

```bash
npm i -S reasync
```

## Usage

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

