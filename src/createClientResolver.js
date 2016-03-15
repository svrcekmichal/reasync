import { match } from 'react-router';
import { createLocationStorage } from './locationStorage';
import { createResolver } from './createResolver';

export const createClientResolver = (history, routes, custom = {}) => {
  const resolver = createResolver();
  const locationStorage = createLocationStorage();

  let transitionRule = (lastLocation, newLocation) =>
  lastLocation.pathname !== newLocation.pathname ||
  lastLocation.search !== newLocation.search;

  const setTransitionRule = rule => {
    transitionRule = rule;
  };

  const isTransition = location => transitionRule(locationStorage.getLastLocation(), location);

  const transition = (location, continueTransition, forced = false) => {
    if (!forced && !isTransition(location)) return;
    match({ history, location, routes }, (error, redirectLocation, renderProps) => {
      if (renderProps) {
        const attrs = { ...custom, location, params: renderProps.params };
        resolver.triggerHooks(renderProps.components, attrs, () => {
          continueTransition();
          locationStorage.setNewLocation(location);
        });
      }
    });
  };

  history.listenBefore(transition);

  const forceTrigger = () => transition(locationStorage.getLastLocation(), () => {}, true);

  const setErrorHandler = handler => {
    resolver.setErrorHandler(handler);
  };

  const addHooks = (...hooks) => {
    resolver.addHooks(...hooks);
    return { addHooks, setErrorHandler };
  };

  return {
    addHooks,
    setErrorHandler,
    forceTrigger,
    setTransitionRule
  };
};
