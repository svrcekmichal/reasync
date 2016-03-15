export const getDependencies = (components, type, attrs) => {
  const toResolve = components.filter(component => component && component.asyncResolve && component.asyncResolve[type])
    .map(component => component.asyncResolve[type])
    .filter(resolve => resolve);
  const promises = [].concat.apply([], toResolve)
    .map(resolve => Promise.resolve(resolve(attrs)));
  return Promise.all(promises);
};

export const isFunction = func => typeof func === 'function';

export const isString = text => typeof text === 'string' || text instanceof String;
