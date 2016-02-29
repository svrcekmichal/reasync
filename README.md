# REASYNC

Library for connecting React components to async actions like fetching

#### Docs

- [Installation & Usage](https://github.com/svrcekmichal/reasync/blob/master/docs/USAGE.md)
- [Api](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)

##Warning

The package is currently alpha version. Use with own risk.

## Why I have created this package?

Long time ago, few people started using react-redux project for managing routing state in redux. In those times, idea of prefetching
and deferred fetching was used making router transition from one route to another more sophisticated. React-redux package was awesome,
but it stared to get bloated and handling to much and it was also complicated to setup.

People started to migrate to react-router-redux, which was much more simplified, but it was not possible to easily create react-redux functionality in transition. 
I found it awesome to be able to delay transition, when i want and to fetch data or do any other async work when i want.

This package is not about how to fetch data, query some storage or another async actions. It's about way to tell, when i need those data. Do I need those data
before server start to render? Do I need them before some page is shown to client? And what should be done before transition, what after? 

## What does it do?

This is lifecycle of single transition in reasync, which better ilustrate what does it do:

### On server

1. `user` visit url
2. `react-router` match route to url and return list of components
3. `reasync` check all `preResolve` actions defined on components
4. when `preResolve` is done, it will do all `deferResolve` actions defined on components
5. from this point your `server` continue, you can do what ever you want, for example `render` to client

### On client

1. `user` click on link and initialize transition
2. `react-router` match route to url and return list of components
3. `reasync` triggers everything defined in `beforeTransition`, for example start showing loader
4. `reasync` check all `preResolve` actions defined on components and resolve them
until now `user` can see old page, maybe change where he want to navigate, or read another article, see advertisement etc
5. `react-router` will transition to new page
6. `reasync` triggers everything defined in `afterTransition`, for example stop showing loader
7. `reasync` check all `deferResolve` actions defined on components and resolve them

## Used in

Package was extracted from non-oss project, but it is used in my boilerplate:

- [svrcekmichal/universal-react](https://github.com/svrcekmichal/universal-react)
- [svrcekmichal/react-production-starter](https://github.com/svrcekmichal/react-production-starter) fork of awesome [@jaredpalmer](https://twitter.com/jaredpalmer) boilerplate [React Production Starter](https://github.com/jaredpalmer/react-production-starter)

## Related projects

- [React Resolver](https://github.com/ericclemmons/react-resolver) by [@ericclemmons](https://twitter.com/ericclemmons)
- [React Transmit](https://github.com/RickWong/react-transmit) by [@rygu](https://twitter.com/rygu)
- [AsyncProps for React Router](https://github.com/rackt/async-props) by [@ryanflorence](https://twitter.com/ryanflorence)
- [React Async](https://github.com/andreypopp/react-async) by [@andreypopp](https://twitter.com/andreypopp)
- [Redial](https://github.com/markdalgleish/redial) by [@markdalgleish](https://twitter.com/markdalgleish)

## Future

There's so much to do, like write tests, simplify usage, cleanup the mess
