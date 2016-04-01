
export const isFunction = func => typeof func === 'function';

export const isString = text => typeof text === 'string' || text instanceof String;

export const isObject = object => !isFunction(object) && object === Object(object);

const flattenObjectComponents = components => components.reduce((collector, component) => {
  if (isObject(component)) {
    for (const key in component) {
      if (component.hasOwnProperty(key)) collector.push(component[key]);
    }
  } else {
    collector.push(component);
  }
  return collector;
}, []);

export const getDependencies = (components, type, attrs) => {
  const toResolve = flattenObjectComponents(components)
    .filter(component => component && component.asyncResolve && component.asyncResolve[type])
    .map(component => component.asyncResolve[type])
    .filter(resolve => resolve);
  const promises = [].concat.apply([], toResolve)
    .map(resolve => Promise.resolve(resolve(attrs)));
  return Promise.all(promises);
};

