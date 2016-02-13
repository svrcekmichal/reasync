import {ReactRouter, match} from 'react-router';
import {getPreResolveDependencies,getDeferResolveDependencies} from './helpers'
import {createLocationStorage} from './locationStorage';

export const resolveOnClient = (history, routes, custom) => {

  const beforeTransitionHooks = [];
  const afterTransitionHooks = [];

  const locationStorage = createLocationStorage();

  let transitonRule = (oldLoc, newLoc) => oldLoc.pathname != newLoc.pathname || oldLoc.search != newLoc.search;

  function beforeTransition(callback) {
    if(beforeTransitionHooks.indexOf(callback) === -1) {
      beforeTransitionHooks.push(callback);
    }
  }

  function afterTransition(callback) {
    if(afterTransitionHooks.indexOf(callback) === -1) {
      afterTransitionHooks.push(callback);
    }
  }

  function setTransitionRule(rule) {
    transitonRule = rule;
  }

  const executeBeforeTransition = (location,params,custom) => {
    beforeTransitionHooks.forEach((callback) => callback({location,params,...custom}));
  }

  const executeAfterTransition = (location,params,custom) => {
    afterTransitionHooks.forEach((callback) => callback({location,params,...custom}));
  }

  const stopResolving = history.listenBefore((location, continueTransition) => {
    let lastLocation = locationStorage.getLastLocation();
    locationStorage.setNewLocation(location);
    if(!transitonRule(lastLocation,location)) return;

    match({history, location, routes}, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        history.transitionTo(redirectLocation);
      } else if(renderProps) {
        const {components,params} = renderProps;
        const attrs = [location,params,custom];

        executeBeforeTransition();
        Promise.all(getPreResolveDependencies(components)(...attrs))
          .then(continueTransition,continueTransition)
          .then(executeAfterTransition,executeAfterTransition)
          .then(getDeferResolveDependencies(components)(...attrs))
      }
    });
  });

  return {
    beforeTransition,
    afterTransition,
    setTransitionRule,
    stopResolving
  }

}