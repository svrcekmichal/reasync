# Deprecated - REASYNC

Library for connecting React components to async actions like fetching

## Warning

The package is currently in beta version. Use with own risk. It's used in production on own closed-source app.

#### Docs

- [Installation & Simple Example](https://github.com/svrcekmichal/reasync/blob/master/docs/SIMPLE_EXAMPLE.md)
- [Complex Example](https://github.com/svrcekmichal/reasync/blob/master/docs/COMPLEX_EXAMPLE.md)
- [API](https://github.com/svrcekmichal/reasync/blob/master/docs/API.md)

## Why I need this?

Let's say we have universal application. We want to fetch some data on server, before server render. 
We also want to do some work only on server, before render and we want to track server action to let's say 
google analytics after render. 

On the client, we hydrate app with data from server, but if server fail we want to fetch data from client. 
After data are fetched we want to start rendering, then fetch some data after render, you want do some action 
only on client and when everything is done we want to track some actions to analytics too. We want to track 
actions even if something before failed. We want to show user some loader before transition is done.

You can configure lifecycle of this events with `reasync`.

## Why I have created this package?

Long time ago, few people started using react-redux project for managing routing state in redux. In those times, idea of prefetching
and deferred fetching was used making router transition from one route to another more sophisticated. React-redux package was awesome,
but it stared to get bloated and handling to much and it was also complicated to setup.

People started to migrate to react-router-redux, which was much more simplified, but it was not possible to easily create react-redux transition functionality. 
I found it awesome to be able to delay transition and to fetch data or do any other async work when i want to.

This package is not about how to fetch data, query some storage or another async actions. It's about way to tell, when i need to execute that async action. 
Do I need some data before server start to render? Do I need to track something only on server? Or load some storage only on client?  Do I need them before 
page is shown to client? And what should be done before transition, what after? 

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
