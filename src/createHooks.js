import { isString, isFunction } from './helpers';

const TYPE_LOCAL = 'LOCAL';
const TYPE_GLOBAL = 'GLOBAL';
const TYPE_TRANSITION = 'TRANSITION';

const createHook = (type, action, { stopOnException = true, executeIfPreviousFailed = false } = {}) => ({
  type,
  action,
  stopOnException,
  executeIfPreviousFailed
});

export const createLocalHook = (name, options) => {
  if (!isString(name)) {
    throw new Error('Local hook name must be string');
  }
  return createHook(TYPE_LOCAL, name, options);
};

export const createGlobalHook = (callback, options) => {
  if (!isFunction(callback)) {
    throw new Error('Global hook callback must be function');
  }
  return createHook(TYPE_GLOBAL, callback, options);
};

export const createTransitionHook = (options) => createHook(TYPE_TRANSITION, null, options);

export const isLocalHook = hook => hook.type === TYPE_LOCAL && isString(hook.action);

export const isGlobalHook = hook => hook.type === TYPE_GLOBAL && isFunction(hook.action);

export const isTransitionHook = hook => hook.type === TYPE_TRANSITION;

export const createHookObject = (action) => {
  if (isFunction(action)) {
    return createGlobalHook(action);
  } else if (isString(action)) {
    return createLocalHook(action);
  } else if (isLocalHook(action) || isGlobalHook(action) || isTransitionHook(action)) {
    return action;
  }
  throw new Error('Invalid argument received. Must be hook object, string or function.');
};
