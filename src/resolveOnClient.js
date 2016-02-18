import {ReactRouter, match} from 'react-router';
import {getPreResolveDependencies,getDeferResolveDependencies} from './helpers'
import {createLocationStorage} from './locationStorage';

export const resolveOnClient = (history, routes, {getState,dispatch}, custom = {}) => {

  const beforeTransitionHooks = [];
  const afterTransitionHooks = [];

  const locationStorage = createLocationStorage();

  let transitonRule = (oldLoc, newLoc) => oldLoc.pathname != newLoc.pathname || oldLoc.search != newLoc.search;

  const beforeTransition = callback => {
    if (beforeTransitionHooks.indexOf(callback) === -1) {
      beforeTransitionHooks.push(callback);
    }
  }

  const afterTransition = callback => {
    if (afterTransitionHooks.indexOf(callback) === -1) {
      afterTransitionHooks.push(callback);
    }
  }

  const setTransitionRule = rule => transitonRule = rule;

  const executeBeforeTransition = (attrs) => {
    beforeTransitionHooks.forEach((callback) => callback(attrs));
  }

  const executeAfterTransition = (attrs) => {
    afterTransitionHooks.forEach((callback) => callback(attrs));
  }

  const stopResolving = history.listenBefore((location, continueTransition) => {
    let lastLocation = locationStorage.getLastLocation();
    locationStorage.setNewLocation(location);
    if (!transitonRule(lastLocation, location)) return;

    match({history, location, routes}, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        history.transitionTo(redirectLocation);
      } else if (renderProps) {
        const {components,params} = renderProps;
        const attrs = {...custom, location, params, getState, dispatch};
        executeBeforeTransition(attrs);
        Promise.all(getPreResolveDependencies(components)(attrs))
          .then(continueTransition, continueTransition)
          .then(executeAfterTransition.bind(undefined, attrs), executeAfterTransition.bind(undefined, attrs))
          .then(getDeferResolveDependencies(components)(attrs))
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