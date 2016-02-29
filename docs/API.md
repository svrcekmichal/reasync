# REASYNC - API

#### Docs

- [Home](https://github.com/svrcekmichal/reasync)
- [Installation & Usage](https://github.com/svrcekmichal/reasync/blob/master/docs/USAGE.md)
- [Api](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)

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

unregister listenBefore hook from history

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
