import {
  isLocalHook,
  isGlobalHook,
  isTransitionHook,
  createHookObject
} from './createHooks';

import {
  getDependencies
} from './helpers';

export const createResolver = () => {
  const registeredHooks = [];
  let errorHandler = () => {};

  const setErrorHandler = handler => {
    errorHandler = handler;
  };

  const triggerHooks = (components, attrs, transition = () => {}) => {
    let failed = false;
    const trigger = registeredHooks.reduce((promise, hookLayer) => promise.then(() => Promise.all(hookLayer
      .filter(singleHook => !failed || singleHook.executeIfPreviousFailed)
      .map(singleHook => {
        let hookAction;
        if (isLocalHook(singleHook)) hookAction = getDependencies(components, singleHook.action, attrs);
        else if (isGlobalHook(singleHook)) hookAction = singleHook.action(attrs);
        else if (isTransitionHook(singleHook)) hookAction = transition();
        else {
          console.log('Invalid hook, skipping.', singleHook);
          hookAction = Promise.resolve();
        }
        if (!singleHook.stopOnException && hookAction && typeof hookAction.catch !== 'undefined') {
          hookAction = hookAction.catch(errorHandler);
        }
        return hookAction;
      })).catch((err) => {
        failed = true;
        errorHandler(err);
      })
    ), Promise.resolve());
    return trigger.then(() => failed ? Promise.reject() : Promise.resolve());
  };

  const addHooks = (...hooks) => {
    registeredHooks.push(hooks.map(createHookObject));
    return { addHooks, setErrorHandler };
  };

  return { addHooks, setErrorHandler, triggerHooks };
};
