# REASYNC - API

#### Docs

- [Home](https://github.com/svrcekmichal/reasync)
- [Installation & Simple Example](https://github.com/svrcekmichal/reasync/blob/master/docs/SIMPLE_EXAMPLE.md)
- [Complex Example](https://github.com/svrcekmichal/reasync/blob/master/docs/COMPLEX_EXAMPLE.md)
- [Api](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)


## resolve(hookName:String, toResolve:{(...attributes):Promise}):void

resolve function is used for decorating of components with data needed. First argument is name of the decoration,
second is function which will be triggered when your app need it. Attributes received in toResolve functions are 
location, params, components and all custom attributes defined in `createResolve`, respectively `createClientResolver`

```javascript
import { resolve } from 'reasync';
import { Component } from 'react';

const toResolve = ({location, analytics}) => analytics.push(location);

//analytics is custom object defined by user
@resolve('MY_ANALYTICS_EVENT', toResolve)
class SomeComponent extends Component {
...
```

If you want to use es5 syntax, you can use `resolve` as function. Just don't forget to export it's result

```javascript
export const someComponentWithResolve = resolve('MY_ANALYTICS_EVENT', toResolve)(SomeComponent);
```

## preResolve(toResolve:{(...attributes):Promise}):void
## deferResolve(toResolve:{(...attributes):Promise}):void

preResolve and deferResolve are two out of box created resolve types.
```javascript
export const preResolve = resolve.bind(undefined, PRE_RESOLVE_HOOK);
export const deferResolve = resolve.bind(undefined, DEFER_RESOLVE_HOOK);
```

Those are two basic resolve functions, but you can create own. Resolve example reworked:
```javascript
export const myAnalyticsResolve = resolve.bind(undefined, 'MY_ANALYTICS_EVENT');

//then in another file you import myAnalyticsResolve
const toResolve = ({location, analytics}) => analytics.push(location);
@myAnalyticsResolve(toResolve)
class SomeComponent extends Component {
...
```

## createGlobalHook(action:{(...attributes):Promise}[, hookOptions:HookOptions]):HookObject

Used for creating hook object which will fire global actions. This can be used for showing loader bar or some actions, that
must execute on every route transition. Attributes received in action parameter are 
location, params, components and all custom attributes defined in `createResolve`, respectively `createClientResolver`.

## createLocalHook(hookName:String[, hookOptions:HookOptions]):HookObject

Used for creating hook object which will fire component resolve actions. hookName attribute must be 
same as in resolve function defined above. 

## createTransitionHook([hookOptions:HookOptions]):HookObject

Special hook used for defining when should transition or render (on server) execute.

## HookOptions
### stopOnException = true

If any promise returned from globalHook action or localHook component action will be rejected, no more hooks layer will be triggered.
Only exception are hooks which have `executeIfPreviousFailed` set to true.

### executeIfPreviousFailed = false

If any previous hooks rejected, only hooks defined with `executeIfPreviousFailed` to true will be fired.

## createResolver():Resolver

Creates empty resolver object. It's used for creating hook layers which will be triggered parallelly and chaining them to sequence.
Resolver is meant to be used on the server. On the client, you can use `createClientResolver`, which wrap createResolver and adds more
functionality around transitioning

## Resolver.addHooks(...attributes:String|Function|HookObject):Object

Creates hook layer for resolver. All attributes in this function will be triggered at the same time, and if any of them return promise, triggering
of next layer hooks will be delayed. If promise of hook, which have `stopOnException` set to `true` will reject, every next hook layer will trigger only hooks
with `executeIfPreviousFailed` set to `true`. 

`addHooks` accepts all three of hook types, but you can insert string or function too. String will be transformed to `createLocalHook(name)` and function to
`createGlobalHook(action)` with options set to default values.

Object returned from addHooks have two methods, `addHooks` and `setErroHandler` because we suggest to write them in chain for better readability.

## Resolver.setErrorHandler(errorHandler:{(err):void})

If any of the hooks failed, you can create custom error handler. Error handler accept fucntion which have error as it's first argument.

## Resolver.triggerHooks(components:ReactComponent[], attributes:Object[, transition:Function]):Promise

Function for triggering transition. It accepts react components from `react-router`, all attributes you want to pass to resolve functions and global hook's actions.
We recommend to insert `location`, `params` from renderProps. If you are using `redux`, you can insert getState and dispatch, but it's up to you what you need and what you don't.

Only single notice, make sure that attributes inserted to all resolver are same. Client resolver is inserting `location` and `params` in it's implementation.
 
## createClientResolver(history:History, routes: Routes, initLocation:Location[, attributes:Object]):ClientResolver

Used for creating client resolver object. First attribute must be history object, from `react-router` or dirrectly fro m `history` package. Second attributes are routes used in router
and third argument is object with you custom attributes. You can read more about attributes in `Resolver.triggerHooks` method. 

Client resolver will trigger hooks on every route transition which change `location.pathname` or `location.search`. 
You can change this with `setTransitionRule` or trigger hooks with `forceTrigger`.

## ClientResolver.addHooks(...attributes:String|Function|HookObject):Object

Same as `Resolver.addHooks`

## ClientResolver.setErrorHandler(errorHandler:{(err):void}):void

Same as `Resolver.setErrorHandler`

## ClientResolver.forceTrigger():void

If you want to trigger all hooks, withou user changing location, you can call this method and it will run all hooks as defined.

## ClientResolver.setTransitionRule(rule:{(oldLocation:Location,newLocation:Location):bool}):void

If you want to change, which transition is transition and which doesn't, use this. By default if oldLocation and newLoation don't have same
pathname and search, it's considered to be transition.
