# REASYNC - Installation & Simple Example

#### Docs

- [Home](https://github.com/svrcekmichal/reasync)
- [Complex Example](https://github.com/svrcekmichal/reasync/blob/master/docs/COMPLEX_EXAMPLE.md)
- [API](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)

## Installation

```bash
npm i -S reasync
```

## Simple Example

### What we are going to do?

We have universal app, we want to fetch some data or create some asyn actions when we need. 

Let's say, on client we want fired actions before transition to new page,
and after user transition to new page we want to fetch more data. We also want to track something to our own google analytics implementation.

On server we want to render full page with data which will client fetch before transition and after transition at once. We don't want to track server
to analytics.

### How to make client side?

First, there are 3 hooks we need, one for resolve before, one for resolve after and one for analytics. Reasync has out of the box two types, for before and after resolve
called `preResolve` and `deferResolve`, but the third one we must create. We also need transitionHook to tell reasyn when should transition happen. Transition hook can be 
created with `createTransitionHook` 

```javascript
//reasync-setup.js

import { PRE_RESOLVE_HOOK, DEFER_RESOLVE_HOOK, resolve, createTransitionHook } from 'reasync';
export { preResolve, deferResolve} from 'reasync'; //thiw will be used later

export const MY_ANALYTICS_HOOK = 'myAnalyticsHook';
export const myAnalyticsResolve = resolve.bind(undefined,MY_ANALYTICS_HOOK);

```

Now we have all three hooks, we need. So it's time to connect it with clientResolver. Even if something failed we want user to
see new page, but if you want to show old page with some error message just remove `executeIfPreviousFailed`

```javascript
//top of the file
import {createClientResolver as _createClientResolver} from 'reasync';

//bottom of file
export const createClientResolver = (history, location, customAttributes) => {
    const resolver = _createClientResolver(history, location, customAttributes);
    resolver
      .addHooks(PRE_RESOLVE_HOOK) //this will fire first
      .addHooks(createTransitionHook({executeIfPreviousFailed:true}),DEFER_RESOLVE_HOOK) //this two will fire after resolve, parallelly
      .addHooks(MY_ANALYTICS_HOOK); //this will fire when everything is done
  
    if (__DEVELOPMENT__) {
      resolver.setErrorHandler((err) => console.log(err)); //in development we want to log errors
    } 
    return resolver;
}
```

So now when we have client resolver it's time to connect it to our app:

```javascript
//client.js
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/createStore';
import { getRoutes } from './routes';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { createClientResolver } from './reasync-setup'; //here we import our reasync setup file

const store = createStore(browserHistory, window.__data__);
const routes = getRoutes(store);
const mountPoint = document.getElementById('content');

const attrs = {getState:store.getState, dispatch:store.dispatch};
const resolver = createClientResolver(history, routes, attrs); //here we hook it to our history and routes
if(!window.__data__) { // if on server something failed and we don't have data, we force trigger
  resolver.forceTransition();    
}

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router history={history} routes={routes} />
  </Provider>,
mountPoint
);

```

### On server
Differences on the server:
1. we don't want to trigger transition before deferResolve finish
2. we don't want to trigger analytics hook
3. we don't want to render page if something failed, so no `executeIfPreviousFailed`

```javascript
//reasync-setup.js

//top of the file
import {createResolver} from 'reasync';

//bottom of the file
export const createServerResolver = () => {
    const resolver = createResolver();
    resolver
      .addHooks(PRE_RESOLVE_HOOK) //this will fire first
      .addHooks(DEFER_RESOLVE_HOOK) //this will fire after PRE_RESOLVE_HOOK, if you don't have dependencies there you can fire them in parallelly
      .addHooks(createTransitionHook()); //this will fire when everything is done
  
    if (__DEVELOPMENT__) {
      resolver.setErrorHandler((err) => console.log(err)); //in development we want to log errors
    } 
    return resolver;
}
```

Connecting on the server is really simple:

```javascript
//server.js
//import createStore, getRoutes, reducers etc.
import { createServerResolver } from 'reasync-setup';

const client = createClient(req.cookies);
const history = createMemoryHistory(req.originalUrl);
const store = createStore(memoryHistory, undefined, client);
const routes = getRoutes(store);

const resolver = createServerResolver(); //we create our server resolver

match({ history, routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
  //if error or redirectLocation do whatever you want
  if (renderProps) {
    const { components, location, params } = renderProps;
    const { getState, dispatch } = store;
    const attrs = { location, params, getState, dispatch };
    
    return resolver.triggerHooks(components, attrs, () => {
        //your render function, everything resolved successfully
    }).catch(() => {
        //something failed, so try to hydrate on client
    });
  }

  // hydrate on client 404
});
```

Now everything is connected, and you can start decorating your components

### Component decorator

Use one of available decorators:
```javascript
import {preResolve, deferResolve, myAnalyticsHook} from 'reasync-setup';
```

And use for decorating of component

```javascript
import {preResolve,deferResolve} from 'reasync';

const fetchUser = ({dispatch}) => dispatch(fetchUser()); // fetch some user

const fetchUserProfile = ({getState,dispatch}) => {
  if(isUserProfileFetched(getState())){ //check if you really need fetch
    return dispatch(fetchUserProfile())); //dispatch action
  }
  return Promise.resolve();
}

@preResolve(fetchUser)
@deferResolve(fetchUserProfile)
@myAnalyticsHook(({location}) => /* do somethign with location */)
export default class App extends Component {
...

```

#### Don't want to use decorators?

You can use same as above, only don't export class, but result of function
```javascript
  export default preResolve(fetchUser)(App); //exported component
```

